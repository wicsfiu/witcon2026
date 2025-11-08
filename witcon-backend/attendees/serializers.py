# attendees/serializers.py
from rest_framework import serializers
from .models import Attendee
from django.core.validators import URLValidator
import json


class AttendeeSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', required=True)
    lastName = serializers.CharField(source='last_name', required=True)
    email = serializers.EmailField(required=True)
    confirmEmail = serializers.EmailField(write_only=True, required=False)

    dateOfBirth = serializers.DateField(source='date_of_birth', required=False, allow_null=True)
    country = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)

    gender = serializers.CharField(source='gender_identity', required=False, allow_blank=True)
    genderOther = serializers.CharField(source='gender_other', required=False, allow_blank=True)
    raceEthnicity = serializers.CharField(source='race_ethnicity', required=False, allow_blank=True)
    raceOther = serializers.CharField(source='race_other', required=False, allow_blank=True)
    levelOfStudy = serializers.CharField(source='level_of_study', required=False, allow_blank=True)
    yearLevel = serializers.CharField(source='year_level', required=False, allow_blank=True)
    studyOther = serializers.CharField(source='study_other', required=False, allow_blank=True)
    fieldOfStudy = serializers.CharField(source='field_of_study', required=False, allow_blank=True)
    fieldOther = serializers.CharField(source='field_other', required=False, allow_blank=True)
    school = serializers.CharField(required=False, allow_blank=True)
    schoolOther = serializers.CharField(source='school_other', required=False, allow_blank=True)
    pantherID = serializers.CharField(source='panther_id', required=False, allow_blank=True)

    linkedin = serializers.CharField(required=False, allow_blank=True)
    github = serializers.CharField(required=False, allow_blank=True)
    website = serializers.CharField(required=False, allow_blank=True)
    discord = serializers.CharField(required=False, allow_blank=True)
    resume = serializers.FileField(required=False, allow_null=True)

    shirtSize = serializers.CharField(source='shirt_size', required=False, allow_blank=True)
    codeOfConduct = serializers.BooleanField(source='code_of_conduct', required=False)
    photographyConsent = serializers.BooleanField(source='photography_consent', required=False)

    class Meta:
        model = Attendee
        fields = (
            'id', 'firstName', 'lastName', 'email', 'confirmEmail',
            'dateOfBirth', 'country', 'state',
            'gender', 'genderOther',
            'raceEthnicity', 'raceOther',
            'levelOfStudy', 'yearLevel', 'studyOther',
            'fieldOfStudy', 'fieldOther',
            'school', 'schoolOther', 'pantherID',
            'linkedin', 'github', 'website', 'discord',
            'shirtSize', 'codeOfConduct', 'photographyConsent',
            'resume', 'checked_in', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'checked_in')

    # normalize complex data
    def to_internal_value(self, data):
        data = data.copy()

        def normalize(value):
            # If the value is a string that looks like JSON, try to parse it
            if isinstance(value, str):
                s = value.strip()
                if s.startswith('[') or s.startswith('{'):
                    try:
                        parsed = json.loads(s)
                        return normalize(parsed)
                    except Exception:
                        pass
                return s

            # If it's a list or tuple, normalize each element and join them as comma-separated strings
            if isinstance(value, (list, tuple)):
                return ", ".join([normalize(v) for v in value if str(v).strip()])

            # If it's a dict, normalize its values and join as comma-separated strings
            if isinstance(value, dict):
                return ", ".join([normalize(v) for v in value.values() if str(v).strip()])

            # Fallback: convert anything else to string
            return str(value).strip()

        # Normalize all string fields in the serializer
        for field in self.fields:
            if field in data:
                raw = data.get(field)
                if raw is not None and raw != "":
                    data[field] = normalize(raw)

        return super().to_internal_value(data)

    def validate(self, attrs):
        """
        Clean list fields + check confirmEmail.
        """
        # confirm email check
        confirm = self.initial_data.get('confirmEmail')
        email = attrs.get('email')
        if confirm and email and confirm != email:
            raise serializers.ValidationError({'confirmEmail': 'Emails do not match'})
        attrs.pop('confirmEmail', None)

        # list cleanup
        for key, value in attrs.items():
            if isinstance(value, list):
                cleaned = []
                for i, item in enumerate(value):
                    if not isinstance(item, str):
                        raise serializers.ValidationError({
                            key: f"Item {i} in {key} must be a string."
                        })
                    cleaned.append(item.strip())
                attrs[key] = [i for i in cleaned if i]

        return attrs

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

    def validate_resume(self, value):
        if value and value.size > 600 * 1024:
            raise serializers.ValidationError("Resume size must be <= 600 KB")
        return value

    def create(self, validated_data):
        validated_data.pop('confirmEmail', None)
        attendee = Attendee(**validated_data)
        attendee.save()
        return attendee

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.resume:
            from .utils import generate_presigned_resume_url
            data['resume_url'] = generate_presigned_resume_url(instance.resume.name)
        else:
            data['resume_url'] = None
        return data
