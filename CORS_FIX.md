# 🔧 CORS Error Fix

## Your Current Issue

```
Access to fetch at 'http://localhost:3001/api/events' from origin 'https://circlo1.vercel.app' 
has been blocked by CORS policy
```

## Problem Analysis

1. ❌ **Frontend** (Vercel): `https://circlo1.vercel.app`
2. ❌ **Trying to connect to**: `http://localhost:3001` (your local machine)
3. ❌ **Should connect to**: Your deployed backend on Render

## Quick Fix (3 Steps)

### Step 1: Update Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project: **circlo1**
3. Go to **Settings** → **Environment Variables**
4. Find `VITE_API_BASE_URL` or add it:
   ```
   Name: VITE_API_BASE_URL
   Value: https://your-backend-url.onrender.com
   ```
   ⚠️ Replace with your actual Render backend URL

5. Click **Save**

### Step 2: Redeploy Frontend

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 3: Deploy Backend CORS Fix

The backend code has been updated to allow your Vercel domain.

```bash
# Commit and push the changes
git add server/server.js
git commit -m "Fix: Add Vercel domain to CORS allowed origins"
git push origin main
```

Render will automatically redeploy.

## Verify the Fix

### 1. Check Frontend Environment
Visit: `https://circlo1.vercel.app`

Open browser console (F12) and check:
- Network tab should show requests to your Render backend (not localhost)
- No CORS errors

### 2. Check Backend CORS
Your backend now allows these origins:
- `http://localhost:5173` (local dev)
- `https://circlo1.vercel.app` (Vercel)
- Any URL set in `FRONTEND_URL` environment variable

### 3. Test Functionality
- ✅ Create an event
- ✅ Upload photos
- ✅ Photos display correctly
- ✅ Real-time updates work

## What Was Changed

### Backend (`server/server.js`)
```javascript
// Before
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

// After
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://circlo1.vercel.app',  // ← Added your Vercel domain
  process.env.FRONTEND_URL
];
```

## Common Issues

### Issue: Still seeing localhost in requests

**Cause**: Frontend environment variable not updated or not redeployed

**Fix**:
1. Verify `VITE_API_BASE_URL` is set in Vercel
2. Redeploy frontend
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: CORS error persists

**Cause**: Backend not redeployed with new CORS settings

**Fix**:
1. Push backend changes to GitHub
2. Wait for Render to redeploy
3. Check Render logs for "Server running on port..."

### Issue: Different Vercel URL

**Cause**: Vercel may have assigned a different URL

**Fix**:
1. Check your actual Vercel URL in Vercel dashboard
2. Update `allowedOrigins` in `server/server.js` with correct URL
3. Push and redeploy

## Environment Variables Summary

### Vercel (Frontend)
```env
VITE_API_BASE_URL=https://circlo-api.onrender.com
```

### Render (Backend)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/circlo
BACKEND_URL=https://circlo-api.onrender.com
FRONTEND_URL=https://circlo1.vercel.app
```

## Need More Help?

See the complete guides:
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Full Vercel deployment guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [RENDER_QUICKSTART.md](./RENDER_QUICKSTART.md) - Render quick start

---

**Status**: ✅ Fix Applied - Deploy to resolve
**Date**: January 2025
