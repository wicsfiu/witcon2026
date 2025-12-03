# attendees/authentication.py
"""
Custom JWT authentication for Attendee model.
Since Attendees don't have a direct relationship with Django User model,
we create custom JWT tokens that include attendee_id in the payload.
"""
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import Attendee


class AttendeeJWTAuthentication(authentication.BaseAuthentication):
    """
    Custom JWT authentication that validates tokens containing attendee_id.
    """
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header:
            return None
        
        # Extract token from "Bearer <token>"
        try:
            token_type, token = auth_header.split(' ')
            if token_type.lower() != 'bearer':
                return None
        except ValueError:
            return None
        
        try:
            # Decode and validate token
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
            
            # Extract attendee_id from token
            attendee_id = payload.get('attendee_id')
            if not attendee_id:
                raise exceptions.AuthenticationFailed('Invalid token: missing attendee_id')
            
            # Get attendee from database
            try:
                attendee = Attendee.objects.get(id=attendee_id)
            except Attendee.DoesNotExist:
                raise exceptions.AuthenticationFailed('Attendee not found')
            
            # Return attendee and token (Django REST Framework convention)
            return (attendee, token)
            
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed('Invalid token')
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Authentication failed: {str(e)}')


def generate_attendee_token(attendee):
    """
    Generate a JWT token for an attendee.
    
    Args:
        attendee: Attendee instance
        
    Returns:
        str: JWT token string
    """
    # Token expiration time (7 days)
    expiration = datetime.utcnow() + timedelta(days=7)
    
    # Create token payload
    payload = {
        'attendee_id': attendee.id,
        'email': attendee.email,
        'exp': expiration,
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    
    # Generate token
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    
    # jwt.encode returns bytes in older versions, string in newer versions
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
    return token


def generate_refresh_token(attendee):
    """
    Generate a refresh token for an attendee (valid for 30 days).
    
    Args:
        attendee: Attendee instance
        
    Returns:
        str: JWT refresh token string
    """
    expiration = datetime.utcnow() + timedelta(days=30)
    
    payload = {
        'attendee_id': attendee.id,
        'email': attendee.email,
        'exp': expiration,
        'iat': datetime.utcnow(),
        'type': 'refresh'
    }
    
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    
    return token


def verify_refresh_token(token):
    """
    Verify and decode a refresh token, returning the attendee.
    
    Args:
        token: Refresh token string
        
    Returns:
        Attendee: The attendee associated with the token
        
    Raises:
        exceptions.AuthenticationFailed: If token is invalid
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        
        if payload.get('type') != 'refresh':
            raise exceptions.AuthenticationFailed('Invalid token type')
        
        attendee_id = payload.get('attendee_id')
        if not attendee_id:
            raise exceptions.AuthenticationFailed('Invalid token: missing attendee_id')
        
        attendee = Attendee.objects.get(id=attendee_id)
        return attendee
        
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed('Refresh token has expired')
    except jwt.DecodeError:
        raise exceptions.AuthenticationFailed('Invalid refresh token')
    except Attendee.DoesNotExist:
        raise exceptions.AuthenticationFailed('Attendee not found')

