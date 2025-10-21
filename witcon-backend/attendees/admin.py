from django.contrib import admin
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
            "fields": ("first_name", "last_name", "email", "password", "date_of_birth")
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
            "fields": ("panther_id", "linkedin", "github", "website", "discord")
        }),
        ("Additional Information", {
            "fields": ("food_allergies", "shirt_size")
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
