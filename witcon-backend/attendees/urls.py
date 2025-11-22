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
from .views import AttendeeCreateView, router, google_oauth_initiate, google_oauth_callback, get_attendee_by_email, debug_s3_config

urlpatterns = [
    # Admin panel
    # path('admin/', admin.site.urls),

    # Public registration endpoint
    path('attendees/create/', AttendeeCreateView.as_view(), name='attendee-create'),

    # Google OAuth endpoints
    path('auth/google/', google_oauth_initiate, name='google-oauth-initiate'),
    path('auth/google/callback/', google_oauth_callback, name='google-oauth-callback'),

    # Public profile endpoint (by email)
    path('attendees/by-email/', get_attendee_by_email, name='attendee-by-email'),

    # Debug endpoint (temporary - for diagnosing S3 issues)
    path('debug/s3-config/', debug_s3_config, name='debug-s3-config'),

    # Protected admin endpoints (attendees list, detail, etc.)
    path('', include(router.urls)),
]



