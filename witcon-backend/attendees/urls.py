# from django.contrib import admin
# from django.urls import path, include
# from attendees.views import AttendeeViewSet
# from attendees.views import router 

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('', include(router.urls)), 
# ]

# attendees/urls.py
from django.contrib import admin
from django.urls import path, include
from .views import (
    AttendeeCreateView, router, google_oauth_initiate, google_oauth_callback,
    get_current_attendee_profile, get_token_by_email, refresh_attendee_token,
    debug_s3_config, delete_attendee_by_id, delete_attendee_by_email,
    delete_current_attendee_profile
)

urlpatterns = [
    # Admin panel
    # path('admin/', admin.site.urls),

    # Public registration endpoint
    path('attendees/create/', AttendeeCreateView.as_view(), name='attendee-create'),

    # Google OAuth endpoints
    path('auth/google/', google_oauth_initiate, name='google-oauth-initiate'),
    path('auth/google/callback/', google_oauth_callback, name='google-oauth-callback'),

    # Token-based profile endpoint (requires Bearer token)
    path('attendees/me/', get_current_attendee_profile, name='attendee-profile'),
    path('attendees/me/delete/', delete_current_attendee_profile, name='delete-attendee-profile'),
    
    # Token management endpoints
    path('auth/token/', get_token_by_email, name='get-token-by-email'),
    path('auth/token/refresh/', refresh_attendee_token, name='refresh-token'),

    # Admin-only delete profile endpoints
    path('attendees/<int:pk>/delete/', delete_attendee_by_id, name='delete-attendee-by-id'),
    path('attendees/delete-by-email/', delete_attendee_by_email, name='delete-attendee-by-email'),

    # Debug endpoint (temporary - for diagnosing S3 issues)
    path('debug/s3-config/', debug_s3_config, name='debug-s3-config'),

    # Protected admin endpoints (attendees list, detail, etc.)
    path('', include(router.urls)),
]



