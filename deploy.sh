#!/bin/bash

# Asset Management System Deployment Script

echo "🚀 Starting deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Please create one from .env.example"
    exit 1
fi

# Build and start services
echo "📦 Building Docker images..."
docker-compose build

echo "🗄️ Starting database..."
docker-compose up -d db

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

echo "🚀 Starting backend and frontend..."
docker-compose up -d

echo "✅ Deployment complete!"
echo ""
echo "📋 Your application is running at:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📝 To create a superuser, run:"
echo "   docker-compose exec backend python manage.py createsuperuser"
echo ""
echo "🛑 To stop the application, run:"
echo "   docker-compose down"
