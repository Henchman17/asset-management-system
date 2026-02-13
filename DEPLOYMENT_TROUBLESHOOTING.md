# 🚨 Deployment Troubleshooting Guide

## Common Deployment Issues & Solutions

### 1. ❌ "Exited with status 1" Error

This error occurs when the deployment process fails. Here are the most common causes:

#### 🔧 Fix 1: Missing Environment Variables
**Problem**: Render can't find required database credentials
**Solution**: 
1. Go to Render Dashboard → Your Web Service → Environment Variables
2. Add these variables:
   ```
   DB_NAME=postgres
   DB_USER=your-supabase-user
   DB_PASSWORD=your-supabase-password
   DB_HOST=aws-1-ap-south-1.pooler.supabase.com
   DB_PORT=5432
   ALLOWED_HOSTS=your-app-name.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app
   ```

#### 🔧 Fix 2: Database Connection Issues
**Problem**: Can't connect to Supabase database
**Solution**:
1. Verify your Supabase credentials in `.env` file
2. Test connection locally first:
   ```bash
   python manage.py migrate
   ```
3. Check if your Supabase database allows connections from Render's IP ranges

#### 🔧 Fix 3: Build Process Failures
**Problem**: Dependencies not installing correctly
**Solution**:
1. Check `requirements.txt` for correct versions
2. Ensure all dependencies are compatible
3. Add build logs to see exact error:
   ```bash
   # In Render, check Logs tab for detailed error messages
   ```

### 2. 🔄 Deployment Steps (Correct Order)

#### Step 1: Deploy Backend to Render
1. Push code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `asset-management-api`
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python manage.py migrate && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 4`
6. Add Environment Variables (see above)
7. Click "Create Web Service"

#### Step 2: Update Frontend Configuration
1. Get your Render API URL (looks like: `https://asset-management-api-xxxx.onrender.com`)
2. Update `frontend/.env.production`:
   ```
   VITE_API_URL=https://asset-management-api-xxxx.onrender.com/api
   ```
3. Update `frontend/vercel.json`:
   ```json
   {
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "https://asset-management-api-xxxx.onrender.com/api/$1"
       }
     ]
   }
   ```

#### Step 3: Deploy Frontend to Vercel
1. Push frontend changes to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   ```
   VITE_API_URL=https://asset-management-api-xxxx.onrender.com/api
   ```
7. Click "Deploy"

### 3. 🛠️ Debugging Checklist

Before redeploying, verify:

- [ ] All environment variables are set correctly
- [ ] Database credentials are valid
- [ ] `requirements.txt` has all dependencies
- [ ] `package.json` has all frontend dependencies
- [ ] No syntax errors in configuration files
- [ ] `.env` file is NOT committed to git
- [ ] `Procfile` exists with correct start command
- [ ] `runtime.txt` specifies Python version

### 4. 📋 Quick Fix Commands

```bash
# Test locally first
cd asset_management_system
python manage.py migrate
python manage.py runserver

# Test frontend locally
cd frontend
npm install
npm run dev

# Check build
npm run build
```

### 5. 🆘 Emergency Recovery

If deployment keeps failing:

1. **Rollback to last working version**:
   - In Render: Go to your service → Manual Deploy → Previous successful deploy
   - In Vercel: Go to Deployments → Rollback to previous deployment

2. **Start fresh**:
   - Delete current Render service
   - Delete current Vercel project
   - Redeploy with minimal configuration
   - Add features incrementally

### 6. 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Django Deployment Guide](https://docs.djangoproject.com/en/5.0/howto/deployment/)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-supabase#connection-pooling)

### 7. 🎯 Next Steps After Successful Deployment

1. Create a superuser:
   ```bash
   # In Render shell or via SSH
   python manage.py createsuperuser
   ```

2. Test all API endpoints:
   - `GET /api/users/`
   - `GET /api/assets/`
   - `GET /api/categories/`
   - `GET /api/locations/`

3. Verify frontend functionality:
   - User login
   - Asset management
   - Dashboard charts
   - All CRUD operations

Need help? Check the logs in both Render and Vercel dashboards for specific error messages.