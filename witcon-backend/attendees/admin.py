from django.contrib import admin
from django.db import models
from django.db import ProgrammingError
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Attendee

@admin.register(Attendee)
class AttendeeAdmin(admin.ModelAdmin):
    list_display = (
        "first_name", "last_name", "email", "school", "level_of_study",
        "checked_in", "created_at"
    )
    search_fields = (
        "first_name", "last_name", "email", "school", "field_of_study"
    )
    list_filter = (
        "level_of_study", "school", "checked_in", "created_at"
    )
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Basic Information", {
            "fields": ("first_name", "last_name", "email", "date_of_birth")
        }),
        ("Demographics", {
            "fields": ("country", "state", "gender_identity", "gender_other",
                       "race_ethnicity", "race_other")
        }),
        ("Academic Information", {
            "fields": ("level_of_study", "year_level", "study_other",
                       "field_of_study", "field_other", "school", "school_other")
        }),
        ("Social Profiles", {
            "fields": ("linkedin", "github", "website", "discord")
        }),
        ("Additional Information", {
            "fields": ("shirt_size",)
        }),
        ("Agreements", {
            "fields": ("code_of_conduct", "photography_consent")
        }),
        ("Files & Status", {
            "fields": ("resume", "checked_in")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at")
        }),
    )
    
    def get_queryset(self, request):
        """
        Override to prevent Django from querying the removed panther_id field.
        This ensures the admin works even if Django's schema cache still references it.
        """
        qs = super().get_queryset(request)
        return qs.defer('panther_id')
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """
        Override change_view to handle ProgrammingError if panther_id is still being queried.
        This is a workaround for Django's schema cache issue.
        """
        try:
            return super().change_view(request, object_id, form_url, extra_context)
        except ProgrammingError as e:
            if 'panther_id' in str(e):
                from django.contrib import messages
                from django.template.response import TemplateResponse
                messages.error(
                    request, 
                    'Database schema cache issue detected. The server needs to be restarted to clear the cache. '
                    'Contact your administrator to restart the Django service.'
                )
                # Redirect to list view
                return HttpResponseRedirect(reverse('admin:attendees_attendee_changelist'))
            # Re-raise if it's a different ProgrammingError
            raise
