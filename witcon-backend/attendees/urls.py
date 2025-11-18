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
from .views import AttendeeCreateView, router, google_oauth_initiate, google_oauth_callback

urlpatterns = [
    # Admin panel
    # path('admin/', admin.site.urls),

    # Public registration endpoint
    path('attendees/create/', AttendeeCreateView.as_view(), name='attendee-create'),

    # Google OAuth endpoints
    path('auth/google/', google_oauth_initiate, name='google-oauth-initiate'),
    path('auth/google/callback/', google_oauth_callback, name='google-oauth-callback'),

    # Protected admin endpoints (attendees list, detail, etc.)
    path('', include(router.urls)),
]



