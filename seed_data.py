import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User
from assets.models import Category, Location, Asset
from datetime import date

# Create superuser if doesn't exist
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123', role='ADMIN')
    print('✓ Created admin user (admin/admin123)')

# Create categories
categories_data = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Phone', 'Tablet']
categories = {}
for cat_name in categories_data:
    cat, created = Category.objects.get_or_create(name=cat_name)
    categories[cat_name] = cat
    if created:
        print(f'✓ Created category: {cat_name}')

# Create locations
locations_data = [
    ('Main Office', 'Main office building'),
    ('Branch Office', 'Branch office location'),
    ('Warehouse', 'Storage warehouse'),
    ('IT Department', 'IT department room'),
]
locations = {}
for loc_name, loc_desc in locations_data:
    loc, created = Location.objects.get_or_create(name=loc_name, defaults={'description': loc_desc})
    locations[loc_name] = loc
    if created:
        print(f'✓ Created location: {loc_name}')

# Create assets
assets_data = [
    ('LT-001', 'Dell Latitude 5520', 'Laptop', 'ABC123456', 'Dell', 'Latitude 5520', 1200.00, 'Main Office', 'AVAILABLE'),
    ('LT-002', 'HP EliteBook 840', 'Laptop', 'XYZ789012', 'HP', 'EliteBook 840', 1350.00, 'Main Office', 'AVAILABLE'),
    ('DT-001', 'Dell OptiPlex 7080', 'Desktop', 'DEF345678', 'Dell', 'OptiPlex 7080', 950.00, 'IT Department', 'AVAILABLE'),
    ('MN-001', 'Samsung 27" Monitor', 'Monitor', 'MON111222', 'Samsung', '27" LED', 300.00, 'Main Office', 'AVAILABLE'),
    ('MN-002', 'LG 24" Monitor', 'Monitor', 'MON333444', 'LG', '24" LED', 250.00, 'Branch Office', 'AVAILABLE'),
    ('PR-001', 'HP LaserJet Pro', 'Printer', 'PRT555666', 'HP', 'LaserJet Pro M404', 400.00, 'Main Office', 'AVAILABLE'),
    ('PH-001', 'iPhone 13', 'Phone', 'IPH777888', 'Apple', 'iPhone 13', 800.00, 'Warehouse', 'AVAILABLE'),
    ('TB-001', 'iPad Pro', 'Tablet', 'IPD999000', 'Apple', 'iPad Pro 11"', 950.00, 'Warehouse', 'AVAILABLE'),
]

for asset_tag, name, cat_name, serial, brand, model, cost, loc_name, status in assets_data:
    if not Asset.objects.filter(asset_tag=asset_tag).exists():
        Asset.objects.create(
            asset_tag=asset_tag,
            name=name,
            category=categories[cat_name],
            serial_no=serial,
            brand=brand,
            model=model,
            unit_cost=cost,
            purchase_date=date.today(),
            status=status,
            current_location=locations[loc_name],
        )
        print(f'✓ Created asset: {asset_tag} - {name}')

print('\n✅ Database seeded successfully!')
print('\nLogin credentials:')
print('  Username: admin')
print('  Password: admin123')
