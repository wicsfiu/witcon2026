# attendees/serializers.py
from rest_framework import serializers
from .models import Attendee
from django.core.validators import URLValidator
import json

class AttendeeSerializer(serializers.ModelSerializer):
    # map frontend keys (camelCase) to model fields
    firstName = serializers.CharField(source='first_name', required=True)
    lastName = serializers.CharField(source='last_name', required=True)
    email = serializers.EmailField(required=True)
    confirmEmail = serializers.EmailField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    dateOfBirth = serializers.DateField(source='date_of_birth', required=False, allow_null=True)
    country = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)

    # lists -> JSONField in model
    genderIdentity = serializers.ListField(
        source='gender_identity',
        child=serializers.CharField(),
        required=False
    )
    genderOther = serializers.CharField(source='gender_other', required=False, allow_blank=True)

    raceEthnicity = serializers.CharField(source='race_ethnicity', required=False, allow_blank=True)
    raceOther = serializers.CharField(source='race_other', required=False, allow_blank=True)

    levelOfStudy = serializers.CharField(source='level_of_study', required=False, allow_blank=True)
    yearLevel = serializers.CharField(source='year_level', required=False, allow_blank=True)
    studyOther = serializers.CharField(source='study_other', required=False, allow_blank=True)

    fieldOfStudy = serializers.CharField(source='field_of_study', required=False, allow_blank=True)
    fieldOther = serializers.CharField(source='field_other', required=False, allow_blank=True)

    # school is same name in front & model; keep simple
    school = serializers.CharField(required=False, allow_blank=True)
    schoolOther = serializers.CharField(source='school_other', required=False, allow_blank=True)

    pantherID = serializers.CharField(source='panther_id', required=False, allow_blank=True)

    # social links - validate if provided
    linkedin = serializers.CharField(required=False, allow_blank=True)
    github = serializers.CharField(required=False, allow_blank=True)
    website = serializers.CharField(required=False, allow_blank=True)
    discord = serializers.CharField(required=False, allow_blank=True)

    resume = serializers.FileField(required=False, allow_null=True)

    foodAllergies = serializers.ListField(
        source='food_allergies',
        child=serializers.CharField(),
        required=False
    )

    shirtSize = serializers.CharField(source='shirt_size', required=False, allow_blank=True)

    codeOfConduct = serializers.BooleanField(source='code_of_conduct', required=False)
    photographyConsent = serializers.BooleanField(source='photography_consent', required=False)


    class Meta:
        model = Attendee
        # listing explicit API-facing field names (these are the keys your frontend sends)
        fields = (
            'id',
            'firstName', 
            'lastName', 
            'email', 'confirmEmail', 'password',
            'dateOfBirth', 'country', 'state',
            'genderIdentity', 'genderOther',
            'raceEthnicity', 'raceOther',
            'levelOfStudy', 'studyOther',
            'fieldOfStudy', 'fieldOther',
            'school', 'schoolOther', 'pantherID',
            'linkedin', 'github', 'website', 'discord',
            'foodAllergies', 
            'shirtSize',
            'codeOfConduct', 'photographyConsent',
            'resume',
            'checked_in', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'checked_in')

    # handle list fields that may arrive as JSON strings when multipart/form-data used
    def to_internal_value(self, data):
        # data may be a QueryDict or dict-like; copy to mutate safely
        data = data.copy()
        return super().to_internal_value(data)

        # if frontend sends arrays as JSON strings (common when FormData is used),
        # try to decode them into real lists
        for list_key in ('genderIdentity', 'foodAllergies'):
            val = data.get(list_key)
            if val is None:
                continue
            # If value is a string, try to parse JSON or comma-separated
            if isinstance(val, str):
                # try parse JSON
                try:
                    parsed = json.loads(val)
                    data[list_key] = parsed
                except Exception:
                    # fallback: comma separated values
                    data[list_key] = [x.strip() for x in val.split(',') if x.strip()]
        return super().to_internal_value(data)

    # validate URLs if present (allow empty)
    def validate_linkedin(self, value):
        if value:
            URLValidator()(value)
        return value

    def validate_github(self, value):
        if value:
            URLValidator()(value)
        return value

    def validate_website(self, value):
        if value:
            URLValidator()(value)
        return value

    # ensure confirm email matches email (confirmEmail is write-only)
    def validate(self, attrs):
        confirm = self.initial_data.get('confirmEmail')
        email = attrs.get('email')
        if confirm and email and confirm != email:
            raise serializers.ValidationError({'confirmEmail': 'Emails do not match'})
        # remove it early
        attrs.pop('confirmEmail', None)
        return attrs


    # hash password and create Attendee
    def create(self, validated_data):
    # Ensure confirmEmail doesn't sneak in
        validated_data.pop('confirmEmail', None)

        pwd = validated_data.pop('password', None)
        attendee = Attendee(**validated_data)
        if pwd:
            import hashlib
            attendee.password = hashlib.sha256(pwd.encode()).hexdigest()
        attendee.save()
        return attendee

    # small resume size validation
    def validate_resume(self, value):
        if value and value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Resume size must be <= 5 MB")
        return value
