# 🚀 Deployment Guide

This guide covers deploying Circlo to production using popular hosting platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- A MongoDB database (MongoDB Atlas recommended)
- A GitHub repository with your code
- Accounts on your chosen hosting platforms

## 🗄️ MongoDB Atlas Setup

1. **Create a free cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up or log in
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

2. **Configure database access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create a username and password
   - Set permissions to "Read and write to any database"
   - Click "Add User"

3. **Configure network access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

4. **Get connection string**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `circlo`

## 🖥️ Backend Deployment

### Option 1: Railway

1. **Sign up at [Railway](https://railway.app)**

2. **Create a new project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your Circlo repository

3. **Configure the service**
   - Railway will auto-detect Node.js
   - Set the root directory to `server`
   - Set the start command to `npm start`

4. **Add environment variables**
   ```
   PORT=3001
   MONGODB_URI=your-mongodb-atlas-connection-string
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Copy the generated URL (e.g., `https://circlo-production.up.railway.app`)

### Option 2: Render

1. **Sign up at [Render](https://render.com)**

2. **Create a new Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your Circlo repository

3. **Configure the service**
   - Name: `circlo-server`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add environment variables**
   ```
   PORT=3001
   MONGODB_URI=your-mongodb-atlas-connection-string
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the generated URL

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a new app**
   ```bash
   cd server
   heroku create circlo-server
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your-mongodb-atlas-connection-string
   heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Sign up at [Vercel](https://vercel.com)**

2. **Import your repository**
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure the project**
   - Framework Preset: Vite
   - Root Directory: `./` (leave as root)
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add environment variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the generated URL

### Option 2: Netlify

1. **Sign up at [Netlify](https://netlify.com)**

2. **Import your repository**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add environment variables**
   - Go to "Site settings" → "Environment variables"
   - Add: `VITE_API_BASE_URL=https://your-backend-url.railway.app`

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete

## 🔄 Update Backend with Frontend URL

After deploying the frontend, update your backend environment variables:

**Railway:**
- Go to your project → Variables
- Update `FRONTEND_URL` with your Vercel/Netlify URL

**Render:**
- Go to your service → Environment
- Update `FRONTEND_URL` with your Vercel/Netlify URL

**Heroku:**
```bash
heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
```

## ✅ Verify Deployment

1. **Test the frontend**
   - Visit your frontend URL
   - Create a test event
   - Upload a photo

2. **Test real-time features**
   - Open the event in two browser tabs
   - Upload a photo in one tab
   - Verify it appears in the other tab

3. **Test downloads**
   - Upload multiple photos
   - Try downloading all photos as ZIP
   - Try downloading selected photos

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is set correctly in backend
- Check that the URL doesn't have a trailing slash

### Socket.IO Connection Issues
- Verify WebSocket support is enabled on your hosting platform
- Check that the backend URL is correct in frontend env vars

### File Upload Issues
- Ensure your hosting platform supports file uploads
- Check file size limits on your hosting platform
- Verify storage directory permissions

### MongoDB Connection Issues
- Verify connection string is correct
- Check that IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

## 📊 Monitoring

### Railway
- View logs in the Railway dashboard
- Set up log drains for external monitoring

### Render
- View logs in the Render dashboard
- Set up health checks

### Vercel
- View deployment logs in Vercel dashboard
- Set up analytics

## 💰 Cost Estimates

### Free Tier Limits

**MongoDB Atlas (Free)**
- 512 MB storage
- Shared RAM
- Good for ~1000 events

**Railway (Free)**
- $5 credit per month
- ~500 hours of runtime

**Render (Free)**
- 750 hours per month
- Spins down after 15 min of inactivity

**Vercel (Free)**
- 100 GB bandwidth
- Unlimited deployments

**Netlify (Free)**
- 100 GB bandwidth
- 300 build minutes

## 🔐 Security Checklist

- [ ] MongoDB connection string is not exposed in code
- [ ] Environment variables are set correctly
- [ ] CORS is configured properly
- [ ] File upload validation is enabled
- [ ] Rate limiting is considered (optional)
- [ ] HTTPS is enabled (automatic on most platforms)

## 🚀 Continuous Deployment

All platforms support automatic deployments:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments (Vercel/Netlify)

## 📝 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records as instructed

### Railway/Render
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

**Need help?** Open an issue on GitHub or check the platform-specific documentation.
