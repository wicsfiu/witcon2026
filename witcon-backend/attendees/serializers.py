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
            'resume', 'resume_replacement_count', 'checked_in', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'checked_in', 'resume_replacement_count')

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
            # Store the original filename before Django generates a unique name
            if hasattr(resume_file, 'name') and hasattr(attendee, 'resume_original_name'):
                attendee.resume_original_name = resume_file.name
                print(f"Storing original filename: {resume_file.name}")
            print(f"Assigning resume file to attendee: name={resume_file.name if hasattr(resume_file, 'name') else 'N/A'}, size={resume_file.size if hasattr(resume_file, 'size') else 'N/A'}")
            print(f"  File field before save: {attendee.resume}")
            
            # Explicitly save the file field to ensure S3 upload happens
            # Django FileField needs save() called on the model for S3 upload
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
            # S3 storage doesn't support .path - it raises NotImplementedError
            # Wrap in try/except to avoid errors with remote storage backends
            try:
                file_path = attendee.resume.path
                print(f"  File path: {file_path}")
            except (NotImplementedError, AttributeError):
                print(f"  File path: N/A (remote storage - no local path)")
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
        
        # Add resume information
        if instance.resume and instance.resume.name:
            try:
                # Use the original filename if stored, otherwise extract from path
                if hasattr(instance, 'resume_original_name') and instance.resume_original_name:
                    data['resume_name'] = instance.resume_original_name
                else:
                    # Fallback: Extract just the filename from the path
                    # Remove the "resumes/" prefix and any Django-generated suffixes
                    resume_path = instance.resume.name
                    resume_filename = resume_path.split('/')[-1] if '/' in resume_path else resume_path
                    
                    # Try to extract original name from Django-generated filename
                    # Format is usually: original_name_randomSuffix.ext
                    if resume_filename and '_' in resume_filename:
                        parts = resume_filename.rsplit('_', 1)
                        if len(parts) == 2 and len(parts[1].split('.')[0]) >= 7:
                            ext = resume_filename.split('.')[-1]
                            potential_name = parts[0] + '.' + ext
                            data['resume_name'] = potential_name
                        else:
                            data['resume_name'] = resume_filename
                    else:
                        data['resume_name'] = resume_filename
                
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
                # Use original name if available, otherwise extract from path
                if instance.resume_original_name:
                    data['resume_name'] = instance.resume_original_name
                else:
                    data['resume_name'] = instance.resume.name.split('/')[-1] if instance.resume.name else None
        else:
            data['resume_url'] = None
            data['resume_name'] = None
        
        # Add replacement count info (handle missing field)
        replacement_count = getattr(instance, 'resume_replacement_count', 0)
        data['resume_replacement_count'] = replacement_count
        data['resume_replacements_remaining'] = max(0, 2 - replacement_count)
        
        return data
    
    def update(self, instance, validated_data):
        """Handle updating attendee, including resume replacement with limit checking"""
        # Check if resume is being updated
        resume_file = validated_data.pop('resume', None)
        
        if resume_file:
            # Check replacement limit (max 2 replacements, 3 total including initial registration)
            # Handle case where field doesn't exist yet 
            replacement_count = getattr(instance, 'resume_replacement_count', 0)
            if replacement_count >= 2:
                raise serializers.ValidationError({
                    'resume': 'You have reached the maximum number of resume replacements (2). You cannot replace your resume again.'
                })
            
            # Validate file size
            if resume_file.size > 600 * 1024:
                raise serializers.ValidationError({'resume': 'Resume size must be <= 600 KB'})
            
            # Store old resume info before replacing
            old_resume_name = None
            old_resume_storage = None
            if instance.resume:
                old_resume_name = instance.resume.name
                old_resume_storage = instance.resume.storage
                print(f"Resume replacement: Old resume will be deleted after new one is saved - {old_resume_name}")
            
            # Assign new resume and increment replacement count
            instance.resume = resume_file
            # Store the original filename before Django generates a unique name
            if hasattr(resume_file, 'name') and hasattr(instance, 'resume_original_name'):
                instance.resume_original_name = resume_file.name
                print(f"Storing original filename: {resume_file.name}")
            # Increment replacement count if field exists
            if hasattr(instance, 'resume_replacement_count'):
                instance.resume_replacement_count = getattr(instance, 'resume_replacement_count', 0) + 1
            
            print(f"Replacing resume - new file: {resume_file.name if hasattr(resume_file, 'name') else 'N/A'}, size: {resume_file.size if hasattr(resume_file, 'size') else 'N/A'}, replacement count: {instance.resume_replacement_count}")
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Save the instance (this will upload new resume to S3 if present)
        try:
            instance.save()
            
            # If resume was replaced, verify new file is in S3 and then delete old one
            if resume_file and instance.resume:
                print(f"  Model saved, verifying new resume upload to S3...")
                
                # Verify the new file exists in S3 before deleting old one
                try:
                    new_file_exists = instance.resume.storage.exists(instance.resume.name)
                    print(f"  New resume exists in S3 storage: {new_file_exists}")
                    
                    if new_file_exists:
                        # New file successfully saved to S3 - now safe to delete old one
                        if old_resume_name and old_resume_storage:
                            try:
                                # Double-check old file still exists before deleting
                                if old_resume_storage.exists(old_resume_name):
                                    old_resume_storage.delete(old_resume_name)
                                    print(f"  Successfully deleted old resume from S3: {old_resume_name}")
                                else:
                                    print(f"  Old resume already deleted or doesn't exist: {old_resume_name}")
                            except Exception as delete_error:
                                print(f"  WARNING: Could not delete old resume file: {delete_error}")
                                import traceback
                                print(f"  Delete error traceback: {traceback.format_exc()}")
                                # Don't fail the update if old file deletion fails - new file is already saved
                    else:
                        print(f"  ERROR: New resume file NOT found in S3 after save!")
                        print(f"  Keeping old resume ({old_resume_name}) - new file upload may have failed")
                        raise Exception("New resume file not found in S3 storage after save")
                        
                except Exception as verify_error:
                    print(f"  ERROR verifying resume upload: {verify_error}")
                    import traceback
                    print(f"  Verification error traceback: {traceback.format_exc()}")
                    # Re-raise to fail the update if verification fails
                    raise
            else:
                print(f"  Update completed successfully (no resume change)")
                
        except Exception as e:
            print(f"ERROR during resume update: {e}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            raise
        
        return instance