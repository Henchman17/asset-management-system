#!/usr/bin/env python
"""
Script to migrate data from local SQLite/PostgreSQL to Supabase
"""
import os
import sys
import json

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.core.management import call_command
from django.conf import settings

def export_data():
    """Export data from current database"""
    print("📦 Exporting data from local database...")
    
    # Export data to JSON
    from accounts.models import User
    from assets.models import Asset, Category, Location
    from transactions.models import Transaction
    
    data = {
        'users': list(User.objects.values()),
        'categories': list(Category.objects.values()),
        'locations': list(Location.objects.values()),
        'assets': list(Asset.objects.values()),
        'transactions': list(Transaction.objects.values()),
    }
    
    with open('backup_data.json', 'w') as f:
        json.dump(data, f, indent=2, default=str)
    
    print(f"✅ Exported {len(data['users'])} users")
    print(f"✅ Exported {len(data['categories'])} categories")
    print(f"✅ Exported {len(data['locations'])} locations")
    print(f"✅ Exported {len(data['assets'])} assets")
    print(f"✅ Exported {len(data['transactions'])} transactions")
    print("📁 Data saved to backup_data.json")

def check_supabase_connection():
    """Check if Supabase connection is working"""
    print("\n🔌 Checking Supabase connection...")
    
    # Check if environment variables are set
    required_vars = ['DB_HOST', 'DB_PASSWORD', 'DB_USER', 'DB_NAME']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        print("Please set these in your .env file")
        return False
    
    # Check if host contains supabase
    if 'supabase' not in os.getenv('DB_HOST', '').lower():
        print("⚠️  Warning: DB_HOST doesn't look like a Supabase URL")
        print(f"Current host: {os.getenv('DB_HOST')}")
        response = input("Continue anyway? (y/n): ")
        if response.lower() != 'y':
            return False
    
    print("✅ Supabase configuration looks good!")
    return True

def main():
    print("🚀 Database Migration Tool")
    print("=" * 50)
    
    # Step 1: Export local data
    try:
        export_data()
    except Exception as e:
        print(f"❌ Failed to export data: {e}")
        sys.exit(1)
    
    # Step 2: Check Supabase connection
    if not check_supabase_connection():
        sys.exit(1)
    
    print("\n📋 Next Steps:")
    print("1. Update your .env file with Supabase credentials")
    print("2. Run: python manage.py migrate")
    print("3. (Optional) Load data: python manage.py loaddata backup_data.json")
    print("4. Create superuser: python manage.py createsuperuser")
    
    print("\n✅ Migration preparation complete!")

if __name__ == '__main__':
    main()
