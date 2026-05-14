# 🚀 Vercel Deployment Guide

Deploy your Circlo frontend to Vercel in minutes!

## Current Setup

Based on your error, you have:
- ✅ Frontend deployed on Vercel: `https://circlo1.vercel.app`
- ❌ Frontend pointing to local backend: `http://localhost:3001`
- ❌ CORS not configured for Vercel domain

## Quick Fix

### Step 1: Update Frontend Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `circlo1`
3. Go to **Settings** → **Environment Variables**
4. Update or add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```
   Replace with your actual Render backend URL

5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment

### Step 2: Update Backend CORS (Already Done ✅)

The backend has been updated to allow your Vercel domain:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://circlo1.vercel.app',  // ← Your Vercel domain
  process.env.FRONTEND_URL
];
```

### Step 3: Deploy Backend Changes

```bash
git add server/server.js
git commit -m "Add Vercel domain to CORS allowed origins"
git push origin main
```

Render will automatically redeploy.

## Complete Vercel Deployment (From Scratch)

### Prerequisites
- GitHub repository with your code
- Backend deployed on Render (or another platform)
- MongoDB Atlas database

### Deploy to Vercel

1. **Go to [Vercel](https://vercel.com)**
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variable**:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

6. Click **"Deploy"**

### After Deployment

1. **Get your Vercel URL** (e.g., `https://circlo1.vercel.app`)

2. **Update Backend CORS**:
   - Add your Vercel URL to `allowedOrigins` in `server/server.js`
   - Push changes to trigger Render redeploy

3. **Update Backend Environment Variable**:
   - In Render dashboard, update `FRONTEND_URL` to your Vercel URL
   - This ensures CORS works correctly

## Environment Variables

### Frontend (Vercel)
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### Backend (Render)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/circlo
BACKEND_URL=https://your-backend-url.onrender.com
FRONTEND_URL=https://circlo1.vercel.app
```

## Troubleshooting

### CORS Error: "No 'Access-Control-Allow-Origin' header"

**Cause**: Backend doesn't allow your Vercel domain

**Fix**:
1. Add your Vercel URL to `allowedOrigins` in `server/server.js`
2. Push changes to redeploy backend

### Frontend connects to localhost instead of production

**Cause**: `VITE_API_BASE_URL` not set or set to localhost

**Fix**:
1. Go to Vercel → Settings → Environment Variables
2. Set `VITE_API_BASE_URL` to your backend URL
3. Redeploy

### Photos not displaying

**Cause**: `BACKEND_URL` not set correctly

**Fix**:
1. Go to Render → Backend Service → Environment
2. Set `BACKEND_URL=https://your-backend-url.onrender.com`
3. Redeploy

### Socket.IO not connecting

**Cause**: WebSocket connection blocked or wrong URL

**Fix**:
1. Verify `VITE_API_BASE_URL` is correct
2. Check browser console for connection errors
3. Ensure backend allows WebSocket connections

## Custom Domain

### Add Custom Domain to Vercel

1. Go to Vercel → Project → Settings → Domains
2. Add your domain (e.g., `circlo.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update backend `FRONTEND_URL` to your custom domain

### Add Custom Domain to Render

1. Go to Render → Service → Settings → Custom Domain
2. Add your domain (e.g., `api.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update frontend `VITE_API_BASE_URL` to your custom domain

## Deployment Checklist

- [ ] Backend deployed on Render
- [ ] MongoDB Atlas configured
- [ ] Frontend deployed on Vercel
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Vercel domain added to backend CORS
- [ ] `FRONTEND_URL` set in Render
- [ ] `BACKEND_URL` set in Render
- [ ] Test: Can create event
- [ ] Test: Can upload photos
- [ ] Test: Photos display correctly
- [ ] Test: Real-time updates work
- [ ] Test: Download works

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                     │
│                                                          │
│  https://circlo1.vercel.app                             │
│  - React SPA                                            │
│  - Static hosting                                       │
│  - Automatic HTTPS                                      │
│  - Global CDN                                           │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ HTTPS + WebSocket
                   │
┌──────────────────▼──────────────────────────────────────┐
│                  Render (Backend)                        │
│                                                          │
│  https://circlo-api.onrender.com                        │
│  - Express API                                          │
│  - Socket.IO                                            │
│  - File uploads                                         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ MongoDB Protocol
                   │
┌──────────────────▼──────────────────────────────────────┐
│                MongoDB Atlas                             │
│                                                          │
│  - Database                                             │
│  - Free tier: 512MB                                     │
└─────────────────────────────────────────────────────────┘
```

## Cost

### Free Tier
- **Vercel**: Free (Hobby plan)
  - 100GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  
- **Render**: Free
  - Spins down after 15 min
  - 750 hours/month
  
- **MongoDB Atlas**: Free
  - 512MB storage

**Total**: $0/month

### Production
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **MongoDB M2**: $9/month

**Total**: $36/month

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Your Circlo app is now live!** 🎉

Frontend: https://circlo1.vercel.app
Backend: https://your-backend-url.onrender.com
