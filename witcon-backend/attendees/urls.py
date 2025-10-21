from django.contrib import admin
from django.urls import path, include
from attendees.views import AttendeeViewSet
from attendees.views import router 

urlpatterns = [
    path('', include(router.urls)), 
]



