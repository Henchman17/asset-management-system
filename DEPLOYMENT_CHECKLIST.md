# ✅ Deployment Checklist

## 🚀 Pre-Deployment (Local Testing)

- [ ] Test backend locally: `python manage.py runserver`
- [ ] Test database connection: `python manage.py migrate`
- [ ] Test frontend locally: `npm run dev` (in frontend directory)
- [ ] Verify all API endpoints work
- [ ] Check that `.env` file contains correct Supabase credentials
- [ ] Ensure no `.env` files are committed to git

## ☁️ Render Backend Deployment

- [ ] Push latest code to GitHub
- [ ] Go to [Render Dashboard](https://dashboard.render.com)
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set service name: `asset-management-api`
- [ ] Configure build command: `pip install -r requirements.txt`
- [ ] Configure start command: `python manage.py migrate && python manage.py collectstatic --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 4`
- [ ] Add Environment Variables:
  - [ ] `DB_NAME` = `postgres`
  - [ ] `DB_USER` = your Supabase user
  - [ ] `DB_PASSWORD` = your Supabase password
  - [ ] `DB_HOST` = `aws-1-ap-south-1.pooler.supabase.com`
  - [ ] `DB_PORT` = `5432`
  - [ ] `ALLOWED_HOSTS` = your-render-app-name.onrender.com
  - [ ] `CORS_ALLOWED_ORIGINS` = https://your-vercel-frontend.vercel.app
  - [ ] `CSRF_TRUSTED_ORIGINS` = https://your-vercel-frontend.vercel.app
  - [ ] `DJANGO_SECRET_KEY` = auto-generated or custom
  - [ ] `DJANGO_DEBUG` = `False`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete (check logs for errors)
- [ ] Note the deployed URL (e.g., `https://asset-management-api-xxxx.onrender.com`)

## 🌐 Vercel Frontend Deployment

- [ ] Update `frontend/.env.production` with API URL:
  ```
  VITE_API_URL=https://your-render-api-url.onrender.com/api
  ```
- [ ] Update `frontend/vercel.json` with correct API proxy URL
- [ ] Commit and push frontend changes to GitHub
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Create new project
- [ ] Import GitHub repository (frontend folder)
- [ ] Configure:
  - Framework: Vite
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Add Environment Variable:
  - [ ] `VITE_API_URL` = `https://your-render-api-url.onrender.com/api`
- [ ] Deploy project
- [ ] Note the frontend URL (e.g., `https://asset-management-frontend.vercel.app`)

## 🔍 Post-Deployment Testing

- [ ] Visit frontend URL in browser
- [ ] Test user login functionality
- [ ] Test asset creation/deletion
- [ ] Test category management
- [ ] Test location management
- [ ] Test transaction recording
- [ ] Verify dashboard charts load
- [ ] Check all API calls in browser dev tools
- [ ] Test mobile responsiveness

## 🛠️ Common Post-Deployment Tasks

- [ ] Create superuser account via Render shell:
  ```bash
  python manage.py createsuperuser
  ```
- [ ] Add initial categories via admin panel
- [ ] Add initial locations via admin panel
- [ ] Test all user roles and permissions
- [ ] Verify data persistence
- [ ] Test error handling
- [ ] Check performance and loading times

## 🆘 Troubleshooting

If anything fails:
1. Check Render logs for backend errors
2. Check Vercel logs for frontend errors
3. Verify environment variables are correct
4. Test database connection
5. Check CORS/CSRF configurations
6. Refer to `DEPLOYMENT_TROUBLESHOOTING.md` for detailed solutions

## 📝 Important Notes

- Render free tier may have cold start delays
- Vercel free tier has usage limits
- Database connections may need warming up
- First deployment may take longer than subsequent ones
- Keep your API and frontend URLs handy for configuration updates