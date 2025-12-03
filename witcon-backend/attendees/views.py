from rest_framework import viewsets, filters
from rest_framework.routers import DefaultRouter
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponseRedirect
from django.conf import settings
from django.core.mail import send_mail
import os
import secrets
import urllib.parse
import requests
from .models import Attendee
from .serializers import AttendeeSerializer

# Custom permission to allow updates without session authentication
class CanUpdateOwnProfile(BasePermission):
    """
    Allow update (PATCH/PUT) operations without Django session authentication.
    The frontend controls access and only allows users to update their own profile.
    """
    def has_permission(self, request, view):
        # Allow GET, POST, PATCH, PUT, DELETE without Django session auth
        # Frontend handles access control
        return True
    
    def has_object_permission(self, request, view, obj):
        # Allow all operations on attendee objects
        # Frontend ensures users only access their own profile
        return True

# Protected Attendee ViewSet
class AttendeeViewSet(viewsets.ModelViewSet):
    queryset = Attendee.objects.all().order_by("-created_at")
    serializer_class = AttendeeSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [filters.SearchFilter]
    search_fields = ["first_name", "last_name", "email", "school"]
    # Allow updates without session auth 
    permission_classes = [CanUpdateOwnProfile]

# Public Registration View
class AttendeeCreateView(generics.CreateAPIView):
    queryset = Attendee.objects.all()
    serializer_class = AttendeeSerializer
    permission_classes = [AllowAny]  # anyone can register
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    
    def create(self, request, *args, **kwargs):
        try:
            # Log incoming request data for debugging
            print(f"Registration request received")
            print(f"Files: {list(request.FILES.keys())}")
            print(f"Data keys: {list(request.data.keys())}")
            
            # Check if email already exists before attempting to create
            email = request.data.get('email') or request.data.get('confirmEmail')
            if email:
                from .models import Attendee
                if Attendee.objects.filter(email=email).exists():
                    from rest_framework.response import Response
                    from rest_framework import status
                    return Response(
                        {
                            'error': 'This email is already registered.',
                            'detail': f'An account with email {email} already exists. Please log in instead.',
                            'email_exists': True
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Logging for resume file
            if 'resume' in request.FILES:
                resume_file = request.FILES['resume']
                print(f"Resume file found: name={resume_file.name}, size={resume_file.size}, content_type={resume_file.content_type}")
            elif 'resume' in request.data:
                print(f"Resume found in request.data: {type(request.data['resume'])}")
            else:
                print("WARNING: Resume file NOT found in request.FILES or request.data")
            
            response = super().create(request, *args, **kwargs)
            print(f"Registration successful: {response.data.get('id', 'unknown')}")
            
            # Send confirmation email after successful registration
            if response.status_code == 201:  # Created successfully
                attendee_email = response.data.get('email') or email
                attendee_first_name = response.data.get('firstName', '')
                
                if attendee_email:
                    try:
                        # Email content
                        subject = "Thank You for Registering for WiTCON 2026! 💛"
                        message = f"""Hi {attendee_first_name if attendee_first_name else 'there'}!

Thanks for signing up for WiTCON 2026! We can't wait to see you! 💛

Your registration has been confirmed. We'll be in touch with more details about the event soon.

Best regards,
The WiTCON Team"""
                        
                        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
                        
                        # Check if email backend is configured
                        email_backend = getattr(settings, 'EMAIL_BACKEND', '')
                        needs_password = 'smtp' in email_backend.lower()
                        
                        # Only send email if properly configured
                        if needs_password:
                            # SMTP backend requires password
                            if from_email and settings.EMAIL_HOST_PASSWORD:
                                send_mail(
                                    subject=subject,
                                    message=message,
                                    from_email=from_email,
                                    recipient_list=[attendee_email],
                                    fail_silently=False,
                                )
                                print(f"Confirmation email sent to {attendee_email}")
                            else:
                                print("Email not configured - skipping confirmation email")
                                print(f"  Missing: from_email={bool(from_email)}, EMAIL_HOST_PASSWORD={bool(settings.EMAIL_HOST_PASSWORD)}")
                        else:
                            # Console/file backends don't need password
                            send_mail(
                                subject=subject,
                                message=message,
                                from_email=from_email,
                                recipient_list=[attendee_email],
                                fail_silently=False,
                            )
                            print(f"Confirmation email sent to {attendee_email} (using {email_backend})")
                    except Exception as email_error:
                        # Log email error but don't fail the registration
                        print(f"Error sending confirmation email: {email_error}")
                        import traceback
                        print(f"Email error traceback: {traceback.format_exc()}")
            
            return response
        except Exception as e:
            # Log the full error for debugging
            import traceback
            from django.db import IntegrityError
            from rest_framework.response import Response
            from rest_framework import status
            
            error_msg = str(e)
            error_trace = traceback.format_exc()
            print("=" * 60)
            print("REGISTRATION ERROR:")
            print("=" * 60)
            print(f"Error: {error_msg}")
            print(f"Traceback:\n{error_trace}")
            print("=" * 60)
            
            # Check if it's a duplicate email error
            if isinstance(e, IntegrityError) and 'email' in error_msg.lower() and 'unique' in error_msg.lower():
                email = request.data.get('email') or request.data.get('confirmEmail', 'this email')
                return Response(
                    {
                        'error': 'This email is already registered.',
                        'detail': f'An account with {email} already exists. Please log in instead.',
                        'email_exists': True
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            return Response(
                {'error': error_msg, 'detail': 'Registration failed. Check server logs for details.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Google OAuth views
@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_initiate(request):
    """
    Initiates Google OAuth flow by redirecting to Google's authorization page.
    """
    google_client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
    if not google_client_id:
        return Response({'error': 'Google OAuth not configured'}, status=500)
    
    # Generate state token for CSRF protection
    state = secrets.token_urlsafe(32)
    request.session['oauth_state'] = state
    
    # Get redirect URI from frontend
    redirect_uri = request.GET.get('redirect_uri', '')
    if redirect_uri:
        request.session['oauth_redirect_uri'] = redirect_uri
    
    # Build Google OAuth URL
    google_oauth_url = 'https://accounts.google.com/o/oauth2/v2/auth'
    params = {
        'client_id': google_client_id,
        'redirect_uri': request.build_absolute_uri('/backend-api/auth/google/callback/'),
        'response_type': 'code',
        'scope': 'openid email profile',
        'access_type': 'online',
        'state': state,
    }
    
    auth_url = f"{google_oauth_url}?{urllib.parse.urlencode(params)}"
    return HttpResponseRedirect(auth_url)


@api_view(['GET'])
@permission_classes([AllowAny])
def google_oauth_callback(request):
    """
    Handles Google OAuth callback, exchanges code for token, gets user email,
    and redirects to frontend registration page with email.
    """
    # Verify state token
    state = request.GET.get('state')
    if not state or state != request.session.get('oauth_state'):
        return Response({'error': 'Invalid state parameter'}, status=400)
    
    # Get authorization code
    code = request.GET.get('code')
    if not code:
        error = request.GET.get('error', 'Unknown error')
        return Response({'error': f'OAuth error: {error}'}, status=400)
    
    # Exchange code for token
    google_client_id = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
    google_client_secret = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')
    
    if not google_client_id or not google_client_secret:
        return Response({'error': 'Google OAuth not configured'}, status=500)
    
    token_url = 'https://oauth2.googleapis.com/token'
    token_data = {
        'code': code,
        'client_id': google_client_id,
        'client_secret': google_client_secret,
        'redirect_uri': request.build_absolute_uri('/backend-api/auth/google/callback/'),
        'grant_type': 'authorization_code',
    }
    
    token_response = requests.post(token_url, data=token_data)
    if token_response.status_code != 200:
        return Response({'error': 'Failed to exchange code for token'}, status=400)
    
    token_json = token_response.json()
    access_token = token_json.get('access_token')
    
    # Get user info from Google
    userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
    headers = {'Authorization': f'Bearer {access_token}'}
    userinfo_response = requests.get(userinfo_url, headers=headers)
    
    if userinfo_response.status_code != 200:
        return Response({'error': 'Failed to get user info'}, status=400)
    
    userinfo = userinfo_response.json()
    email = userinfo.get('email')
    
    if not email:
        return Response({'error': 'Email not provided by Google'}, status=400)
    
    # Check if user already exists in database
    user_exists = Attendee.objects.filter(email=email).exists()
    
    # Clear session state
    request.session.pop('oauth_state', None)
    redirect_uri = request.session.pop('oauth_redirect_uri', None)
    
    # Determine redirect destination
    if redirect_uri:
        # Parse the redirect URI to get the base URL and path
        parsed_uri = urllib.parse.urlparse(redirect_uri)
        base_url = f"{parsed_uri.scheme}://{parsed_uri.netloc}"
        
        if user_exists:
            # User already registered - redirect to profile page
            frontend_url = f"{base_url}/profile"
        else:
            # New user - redirect to registration page
            frontend_url = redirect_uri
    else:
        # Default behavior - use FRONTEND_URL or localhost
        frontend_base_url = os.getenv('FRONTEND_URL', 'http://localhost:5174')
        if user_exists:
            frontend_url = f"{frontend_base_url}/profile"
        else:
            frontend_url = f"{frontend_base_url}/register"
    
    # Prefill email as query parameter
    redirect_url = f"{frontend_url}?email={urllib.parse.quote(email)}"
    return HttpResponseRedirect(redirect_url)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_attendee_by_email(request):
    """
    Public endpoint to get attendee profile by email.
    Used for profile page after OAuth registration.
    """
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email parameter required'}, status=400)
    
    try:
        attendee = Attendee.objects.get(email=email)
        serializer = AttendeeSerializer(attendee)
        return Response(serializer.data)
    except Attendee.DoesNotExist:
        return Response({'error': 'Attendee not found'}, status=404)


@api_view(['GET'])
@permission_classes([AllowAny])
def debug_s3_config(request):
    """
    Debug endpoint to check S3 configuration and recent registration status.
    Accessible at: /backend-api/debug/s3-config/
    """
    from django.conf import settings
    
    config = {
        'use_s3': hasattr(settings, 'USE_S3') and settings.USE_S3,
        'default_file_storage': str(getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not set')),
        'aws_storage_bucket_name': getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'Not set'),
        'aws_s3_region_name': getattr(settings, 'AWS_S3_REGION_NAME', 'Not set'),
        'aws_access_key_id_set': bool(getattr(settings, 'AWS_ACCESS_KEY_ID', None)),
        'aws_secret_access_key_set': bool(getattr(settings, 'AWS_SECRET_ACCESS_KEY', None)),
    }
    
    # Get the most recent attendee registration
    try:
        latest_attendee = Attendee.objects.order_by('-created_at').first()
        if latest_attendee:
            config['latest_registration'] = {
                'email': latest_attendee.email,
                'created_at': latest_attendee.created_at.isoformat(),
                'resume_field': {
                    'has_resume': bool(latest_attendee.resume),
                    'resume_name': latest_attendee.resume.name if latest_attendee.resume else None,
                    'resume_url': latest_attendee.resume.url if latest_attendee.resume else None,
                }
            }
            
            # Check if file exists in storage
            if latest_attendee.resume:
                try:
                    exists = latest_attendee.resume.storage.exists(latest_attendee.resume.name)
                    config['latest_registration']['resume_field']['exists_in_storage'] = exists
                    if exists:
                        size = latest_attendee.resume.storage.size(latest_attendee.resume.name)
                        config['latest_registration']['resume_field']['file_size'] = size
                except Exception as e:
                    config['latest_registration']['resume_field']['storage_check_error'] = str(e)
        else:
            config['latest_registration'] = None
    except Exception as e:
        config['error'] = f"Error checking registration: {str(e)}"
    
    return Response(config)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_attendee_by_id(request, pk):
    """
    Delete attendee profile by ID.
    Deletes the attendee record from database and their resume from S3.
    """
    try:
        attendee = Attendee.objects.get(pk=pk)
        
        # Delete resume file from S3 if it exists
        if attendee.resume:
            try:
                resume_storage = attendee.resume.storage
                resume_name = attendee.resume.name
                if resume_storage.exists(resume_name):
                    resume_storage.delete(resume_name)
                    print(f"Deleted resume from storage: {resume_name}")
            except Exception as e:
                print(f"Warning: Could not delete resume file: {e}")
        
        # Delete the attendee record
        attendee.delete()
        
        return Response({'message': 'Profile deleted successfully'}, status=200)
    except Attendee.DoesNotExist:
        return Response({'error': 'Attendee not found'}, status=404)
    except Exception as e:
        print(f"Error deleting attendee: {e}")
        import traceback
        print(traceback.format_exc())
        return Response({'error': 'Failed to delete profile'}, status=500)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_attendee_by_email(request):
    """
    Delete attendee profile by email.
    Deletes the attendee record from database and their resume from S3.
    """
    email = request.GET.get('email')
    if not email:
        return Response({'error': 'Email parameter required'}, status=400)
    
    try:
        attendee = Attendee.objects.get(email=email)
        
        # Delete resume file from S3 if it exists
        if attendee.resume:
            try:
                resume_storage = attendee.resume.storage
                resume_name = attendee.resume.name
                if resume_storage.exists(resume_name):
                    resume_storage.delete(resume_name)
                    print(f"Deleted resume from storage: {resume_name}")
            except Exception as e:
                print(f"Warning: Could not delete resume file: {e}")
        
        # Delete the attendee record
        attendee.delete()
        
        return Response({'message': 'Profile deleted successfully'}, status=200)
    except Attendee.DoesNotExist:
        return Response({'error': 'Attendee not found'}, status=404)
    except Exception as e:
        print(f"Error deleting attendee: {e}")
        import traceback
        print(traceback.format_exc())
        return Response({'error': 'Failed to delete profile'}, status=500)


# Router for protected endpoints
router = DefaultRouter(trailing_slash=True)
router.register(r'attendees', AttendeeViewSet, basename='attendee')


