# attendees/serializers.py
from rest_framework import serializers
from .models import Attendee
from django.core.validators import URLValidator
from django.core.files.uploadedfile import UploadedFile
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
                if isinstance(raw, UploadedFile):
                    continue
                if raw is None or raw == "":
                    continue
                if isinstance(raw, (str, list, tuple, dict)):
                    data[field] = normalize(raw)
                else:
                    data[field] = raw

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
        # Check S3 configuration
        from django.conf import settings
        print(f"S3 Configuration check:")
        print(f"  USE_S3: {hasattr(settings, 'USE_S3') and settings.USE_S3}")
        print(f"  DEFAULT_FILE_STORAGE: {getattr(settings, 'DEFAULT_FILE_STORAGE', 'Not set')}")
        print(f"  AWS_STORAGE_BUCKET_NAME: {getattr(settings, 'AWS_STORAGE_BUCKET_NAME', 'Not set')}")
        print(f"  AWS_ACCESS_KEY_ID present: {bool(getattr(settings, 'AWS_ACCESS_KEY_ID', None))}")
        
        validated_data.pop('confirmEmail', None)
        
        # Extract file separately to ensure proper handling with S3
        # First try to get from validated_data
        resume_file = validated_data.get('resume')
        
        # Fallback: try to get from request context if not in validated_data
        if not resume_file and hasattr(self, 'context') and 'request' in self.context:
            request = self.context['request']
            if 'resume' in request.FILES:
                resume_file = request.FILES['resume']
                print(f"Serializer create: Resume file found in request.FILES (fallback)")
        
        # Remove from validated_data if present
        if 'resume' in validated_data:
            del validated_data['resume']
        
        # Log resume file before creating attendee
        if resume_file:
            print(f"Serializer create: Resume file present - name={resume_file.name if hasattr(resume_file, 'name') else 'N/A'}, size={resume_file.size if hasattr(resume_file, 'size') else 'N/A'}, type={type(resume_file)}")
        else:
            print("Serializer create: WARNING - Resume file NOT in validated_data or request.FILES")
            print(f"  validated_data keys: {list(validated_data.keys())}")
            if hasattr(self, 'context') and 'request' in self.context:
                print(f"  request.FILES keys: {list(self.context['request'].FILES.keys())}")
        
        # Create attendee without file first
        attendee = Attendee(**validated_data)
        
        # Explicitly assign and save the file if present
        if resume_file:
            attendee.resume = resume_file
            print(f"Assigning resume file to attendee: name={resume_file.name if hasattr(resume_file, 'name') else 'N/A'}, size={resume_file.size if hasattr(resume_file, 'size') else 'N/A'}")
            print(f"  File field before save: {attendee.resume}")
            
            # Explicitly save the file field to ensure S3 upload happens
            # This is important - Django FileField needs save() called on the model for S3 upload
            try:
                # Save the model first to trigger file upload
                attendee.save()
                print(f"  Model saved, file should be uploaded to S3")
                
                # Verify the file was actually saved to S3
                if attendee.resume:
                    try:
                        file_exists = attendee.resume.storage.exists(attendee.resume.name)
                        print(f"  File exists in S3 storage: {file_exists}")
                        if not file_exists:
                            print(f"  WARNING: File path saved but file NOT found in S3!")
                            print(f"  Attempting to explicitly save file to S3...")
                            # Try to explicitly save the file
                            attendee.resume.save(attendee.resume.name, resume_file, save=False)
                            attendee.save()
                            file_exists = attendee.resume.storage.exists(attendee.resume.name)
                            print(f"  After explicit save, file exists in S3: {file_exists}")
                    except Exception as s3_error:
                        print(f"  ERROR checking S3: {s3_error}")
                        import traceback
                        print(f"  S3 Error Traceback: {traceback.format_exc()}")
            except Exception as e:
                print(f"ERROR saving attendee with file: {e}")
                import traceback
                print(f"Traceback: {traceback.format_exc()}")
                raise
        else:
            # No file, just save the attendee
            try:
                attendee.save()
                print(f"  Save completed successfully (no file)")
            except Exception as e:
                print(f"ERROR saving attendee: {e}")
                import traceback
                print(f"Traceback: {traceback.format_exc()}")
                raise
        
        # Log after save
        if attendee.resume:
            print(f"After save: Resume saved successfully")
            print(f"  File name: {attendee.resume.name}")
            print(f"  File storage: {type(attendee.resume.storage)}")
            print(f"  File path: {attendee.resume.path if hasattr(attendee.resume, 'path') else 'No path attribute'}")
            print(f"  File URL: {attendee.resume.url if hasattr(attendee.resume, 'url') else 'No url attribute'}")
            
            # Check if file actually exists in storage
            try:
                file_exists = attendee.resume.storage.exists(attendee.resume.name)
                print(f"  File exists in storage: {file_exists}")
                if file_exists:
                    file_size = attendee.resume.storage.size(attendee.resume.name)
                    print(f"  File size in storage: {file_size} bytes")
            except Exception as e:
                print(f"  Error checking file in storage: {e}")
            
            try:
                # Try to get URL to verify S3 upload worked
                from django.conf import settings
                if hasattr(settings, 'DEFAULT_FILE_STORAGE') and 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
                    from .utils import generate_presigned_resume_url
                    url = generate_presigned_resume_url(attendee.resume.name)
                    print(f"  Presigned S3 URL generated: {url}")
            except Exception as e:
                print(f"  Error generating presigned S3 URL: {e}")
                import traceback
                print(f"  Traceback: {traceback.format_exc()}")
        else:
            print("After save: WARNING - attendee.resume is None or empty")
            print(f"  This means the file was NOT saved to S3!")
        
        return attendee

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.resume:
            try:
                # Try to get the resume URL - use S3 if configured, otherwise use local file URL
                from django.conf import settings
                # Check if S3 is configured
                if hasattr(settings, 'DEFAULT_FILE_STORAGE') and 's3' in str(settings.DEFAULT_FILE_STORAGE).lower():
                    from .utils import generate_presigned_resume_url
                    data['resume_url'] = generate_presigned_resume_url(instance.resume.name)
                else:
                    # Local storage - use the file's URL property
                    data['resume_url'] = instance.resume.url if hasattr(instance.resume, 'url') else f"/media/{instance.resume.name}"
            except Exception as e:
                # Fallback - use the file name/path
                data['resume_url'] = f"/media/{instance.resume.name}" if instance.resume.name else None
        else:
            data['resume_url'] = None
        return data