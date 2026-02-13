# Deployment Guide

## Quick Deploy to Render (Recommended - Free)

### Step 1: Deploy Backend to Render

1. Go to https://dashboard.render.com
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo: `Henchman17/asset-management-system`
5. Configure:
   - **Name**: asset-management-api
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python manage.py migrate && gunicorn config.wsgi:application`
6. Click "Advanced" and add environment variables:

```
DJANGO_SECRET_KEY=your-random-secret-key-here
DJANGO_DEBUG=False
DB_NAME=postgres
DB_USER=postgres.ffnfzcltvrdxukgwwful
DB_PASSWORD=assettracker123!
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=5432
ALLOWED_HOSTS=your-service-name.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend-url.vercel.app
```

7. Click "Create Web Service"

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your GitHub repo
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: npm run build
   - **Output Directory**: dist
6. Add Environment Variable:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com/api
   ```
7. Click "Deploy"

### Step 3: Update CORS (After Deployment)

Once both are deployed, update the Render environment variables with your actual frontend URL:

```
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app
```

Then redeploy the backend.

## Alternative: Deploy with Docker

If you have a server with Docker installed:

```bash
# Clone your repo
git clone https://github.com/Henchman17/asset-management-system.git
cd asset-management-system

# Create .env file with your Supabase credentials
cp .env.example .env
# Edit .env with your values

# Deploy with Docker Compose
docker-compose -f docker-compose.supabase.yml up -d
```

## Access Your Deployed App

- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-api.onrender.com/api
- **Admin Panel**: https://your-api.onrender.com/admin

## Login Credentials

- **Username**: admin
- **Password**: admin123

## Troubleshooting

1. **Database connection failed**: Check Supabase credentials in environment variables
2. **CORS errors**: Update CORS_ALLOWED_ORIGINS with your frontend URL
3. **Static files not loading**: Run `python manage.py collectstatic` in build command
