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

    gender = serializers.CharField(source='gender_identity',required=False, allow_blank=True)
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
        child=serializers.CharField(),
        required=False,
        source='food_allergies',
        allow_empty=True,
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
            'gender', 'genderOther',
            'raceEthnicity', 'raceOther',
            'levelOfStudy', 'yearLevel', 'studyOther',
            'fieldOfStudy', 'fieldOther',
            'school', 'schoolOther', 'pantherID',
            'linkedin', 'github', 'website', 'discord',
            'foodAllergies', 'customAllergy',
            'shirtSize',
            'codeOfConduct', 'photographyConsent',
            'resume',
            'checked_in', 'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'checked_in')

    def to_internal_value(self, data):
        data = data.copy()
        raw = None
        if hasattr(data, 'getlist'):
            raw_list = data.getlist('foodAllergies')
            if raw_list:
                if len(raw_list) == 1:
                    raw = raw_list[0]
                else:
                    raw = raw_list
        if raw is None:
            raw = data.get('foodAllergies')

        if raw is not None:
            normalized = []

            def push(x):
                if isinstance(x, str):
                    s = x.strip()
                    if (s.startswith('[') or s.startswith('{')):
                        try:
                            parsed = json.loads(s)
                            push(parsed)
                            return
                        except Exception:
                            pass
                    if s != '':
                        normalized.append(s)
                    return

                if isinstance(x, (list, tuple)):
                    for item in x:
                        push(item)
                    return

                if isinstance(x, dict):
                    for item in x.values():
                        push(item)
                    return

                normalized.append(str(x))

            push(raw)

            normalized = [str(i).strip() for i in normalized if str(i).strip()]
            data['foodAllergies'] = normalized

        return super().to_internal_value(data)
    
    def validate_foodAllergies(self, value):
        # At this point value should be a list
        if value in (None, ''):
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError("foodAllergies must be a list.")
        cleaned = []
        for i, item in enumerate(value):
            if not isinstance(item, str):
                # per-index error style
                raise serializers.ValidationError({i: "Not a valid string."})
            cleaned.append(item.strip())
        return cleaned
    
    customAllergy = serializers.CharField(source='custom_allergy', required=False, allow_blank=True)

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
        attrs.pop('confirmEmail', None)
        return attrs


    # hash password and create Attendee
    def create(self, validated_data):
        validated_data.pop('confirmEmail', None)

        fa = validated_data.get("food_allergies")
        if isinstance(fa, str):
            try:
                validated_data["food_allergies"] = json.loads(fa)
            except Exception:
                validated_data["food_allergies"] = []

        pwd = validated_data.pop('password', None)
        attendee = Attendee(**validated_data)
        if pwd:
            import hashlib
            attendee.password = hashlib.sha256(pwd.encode()).hexdigest()
        attendee.save()
        print("✅ Allergies saved:", attendee.food_allergies)
        return attendee

    # small resume size validation
    def validate_resume(self, value):
        if value and value.size > 600 * 1024:
            raise serializers.ValidationError("Resume size must be <= 600 KB")
        return value