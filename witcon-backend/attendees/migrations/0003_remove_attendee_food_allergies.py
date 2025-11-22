# Generated manually to remove food_allergies and custom_allergy fields
# This migration safely removes fields only if they exist in the database

from django.db import migrations, connection


def remove_fields_if_exist(apps, schema_editor):
    """Remove food_allergies and custom_allergy columns only if they exist"""
    db_table = 'attendees_attendee'
    
    with connection.cursor() as cursor:
        # Get list of existing columns
        if connection.vendor == 'postgresql':
            cursor.execute("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = %s
            """, [db_table])
            existing_columns = [row[0] for row in cursor.fetchall()]
            
            # Remove food_allergies if it exists
            if 'food_allergies' in existing_columns:
                cursor.execute('ALTER TABLE attendees_attendee DROP COLUMN food_allergies')
            
            # Remove custom_allergy if it exists
            if 'custom_allergy' in existing_columns:
                cursor.execute('ALTER TABLE attendees_attendee DROP COLUMN custom_allergy')
        elif connection.vendor == 'sqlite':
            # SQLite doesn't support DROP COLUMN easily, but this migration
            # should only run on PostgreSQL (production)
            pass


def reverse_operation(apps, schema_editor):
    """Reverse operation - add fields back if needed"""
    # This is a no-op since we're removing fields that shouldn't exist
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('attendees', '0002_attendee_code_of_conduct_attendee_country_and_more'),
    ]

    operations = [
        migrations.RunPython(remove_fields_if_exist, reverse_operation),
    ]

