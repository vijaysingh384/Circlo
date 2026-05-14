#!/bin/bash

# Circlo Build Script for Render Deployment
# This script builds both frontend and backend

set -e  # Exit on error

echo "🚀 Starting Circlo build process..."

# Build Frontend
echo "📦 Building frontend..."
npm install
npm run build

echo "✅ Frontend build complete!"

# Install Backend Dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install

echo "✅ Backend dependencies installed!"

echo "🎉 Build process complete!"
