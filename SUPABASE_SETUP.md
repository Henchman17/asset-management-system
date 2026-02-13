# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Enter project details:
   - Name: `asset-management-system`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
4. Click "Create New Project"
5. Wait for project to be created (2-3 minutes)

## Step 2: Get Connection Details

1. In your Supabase dashboard, go to "Settings" → "Database"
2. Find "Connection string" section
3. Copy the "URI" connection string
4. It looks like: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

## Step 3: Update Environment Variables

Update your `.env` file with Supabase credentials:

```env
# Database Settings (Supabase)
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-supabase-db-password
DB_HOST=db.your-project-ref.supabase.co
DB_PORT=5432
```

## Step 4: Run Migrations

```bash
# Activate virtual environment
.venv\Scripts\activate

# Install psycopg2 if not installed
pip install psycopg2-binary

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed data (optional)
python seed_data.py
```

## Step 5: Deploy

Your database is now on Supabase! You can deploy your backend anywhere and it will connect to Supabase.

### For Docker Deployment:
Update `docker-compose.yml` to remove the local db service and use Supabase instead.
