# Circlo - Render Deployment Guide

This guide will help you deploy the Circlo photo-sharing application to Render.

## Architecture

Circlo consists of two services:
1. **Backend API** - Node.js/Express server with Socket.IO
2. **Frontend** - React SPA built with Vite

## Prerequisites

1. A [Render](https://render.com) account (free tier available)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier available)
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with a password
4. Whitelist all IP addresses (0.0.0.0/0) for Render access
5. Get your connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/circlo`)

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **"New +"** → **"Blueprint"**
4. Connect your repository
5. Render will detect the `render.yaml` file
6. Set the following environment variables:

#### Backend Service (circlo-api):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/circlo
BACKEND_URL=https://circlo-api.onrender.com
FRONTEND_URL=https://circlo-frontend.onrender.com
```

#### Frontend Service (circlo-frontend):
```
VITE_API_BASE_URL=https://circlo-api.onrender.com
```

7. Click **"Apply"** to deploy both services

### Option B: Manual Deployment

#### Deploy Backend:

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Configure:
   - **Name**: `circlo-api`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/circlo
   BACKEND_URL=https://circlo-api.onrender.com
   FRONTEND_URL=https://circlo-frontend.onrender.com
   ```

6. Click **"Create Web Service"**

#### Deploy Frontend:

1. Go to Render Dashboard
2. Click **"New +"** → **"Static Site"**
3. Connect your repository
4. Configure:
   - **Name**: `circlo-frontend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://circlo-api.onrender.com
   ```

6. Add Rewrite Rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: Rewrite

7. Click **"Create Static Site"**

## Step 3: Update CORS Configuration

After deployment, update the backend's CORS configuration if needed. The current setup in `server/server.js` already includes `process.env.FRONTEND_URL`.

## Step 4: Test Your Deployment

1. Visit your frontend URL: `https://circlo-frontend.onrender.com`
2. Create a test event
3. Upload some photos
4. Test real-time updates by opening the event in multiple browser tabs

## Important Notes

### Free Tier Limitations

- **Backend**: Spins down after 15 minutes of inactivity (first request may take 30-60 seconds)
- **Frontend**: Always available (static hosting)
- **MongoDB Atlas**: 512MB storage limit on free tier

### File Storage

The current implementation uses local file storage (`server/public/uploads`). On Render's free tier:
- Files are stored in ephemeral storage
- Files will be deleted when the service restarts
- For production, consider using cloud storage (AWS S3, Cloudflare R2, etc.)

### Environment Variables

Make sure all environment variables are set correctly:

**Backend:**
- `MONGODB_URI` - Your MongoDB connection string
- `BACKEND_URL` - Your backend service URL (e.g., `https://circlo-api.onrender.com`)
- `FRONTEND_URL` - Your frontend URL (e.g., `https://circlo-frontend.onrender.com`)
- `PORT` - Set to `10000` (Render default)

**Frontend:**
- `VITE_API_BASE_URL` - Your backend service URL (e.g., `https://circlo-api.onrender.com`)

### Custom Domains

To use custom domains:
1. Go to your service settings in Render
2. Click **"Custom Domain"**
3. Follow the instructions to add your domain
4. Update environment variables with your custom domain URLs

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all environment variables are set
- **Case sensitivity**: Linux is case-sensitive for file names. Ensure import paths match exact file names (e.g., `Events.js` not `events.js`)

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS configuration in `server/server.js`
- Ensure backend service is running

### Photos not displaying
- Check that `BACKEND_URL` environment variable is set correctly
- Verify image URLs in the browser network tab
- Note: On free tier, uploaded files may be lost on service restart

### Socket.IO connection issues
- Ensure WebSocket connections are allowed
- Check browser console for connection errors
- Verify backend URL is accessible

### Module not found errors
- Ensure all import paths use correct case (Linux is case-sensitive)
- Check that all route files exist in the correct location
- Verify file extensions are included in imports (.js)

## Upgrading to Paid Plans

For production use, consider:
- **Render Starter Plan** ($7/month) - Persistent storage, no spin-down
- **MongoDB Atlas M2** ($9/month) - 2GB storage, better performance
- **Cloud Storage** - AWS S3 or Cloudflare R2 for reliable file storage

## Support

For issues specific to:
- **Render**: Check [Render Docs](https://render.com/docs)
- **MongoDB Atlas**: Check [MongoDB Docs](https://docs.atlas.mongodb.com/)
- **Circlo**: Check the project README or create an issue

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure automatic backups for MongoDB
3. Implement cloud storage for photos
4. Set up a custom domain
5. Add analytics (optional)

---

**Congratulations!** 🎉 Your Circlo app is now live on Render!
