# 🔧 Vercel Environment Variable Setup

## The Problem

Your frontend code is correct and uses environment variables:

```typescript
// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

But when deployed to Vercel, `VITE_API_BASE_URL` is **not set**, so it falls back to `localhost:3001`.

## The Solution

Set the environment variable in Vercel.

## Step-by-Step Fix

### 1. Get Your Backend URL

First, find your Render backend URL:
- Go to [Render Dashboard](https://dashboard.render.com/)
- Click on your backend service: **circlo-api**
- Copy the URL (e.g., `https://circlo-api.onrender.com`)

### 2. Set Environment Variable in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **circlo1**
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New**

6. Add the variable:
   ```
   Name: VITE_API_BASE_URL
   Value: https://circlo-api.onrender.com
   ```
   ⚠️ **Replace with your actual Render backend URL!**
   ⚠️ **No trailing slash!**

7. Select environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

8. Click **Save**

### 3. Redeploy

**Option A: Automatic (Recommended)**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

**Option B: Manual**
1. Go to **Deployments** tab in Vercel
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### 4. Verify

1. Visit your Vercel URL: `https://circlo1.vercel.app`
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Try to create an event
5. Check the request URL - should be:
   ```
   https://circlo-api.onrender.com/api/events
   ```
   NOT:
   ```
   http://localhost:3001/api/events
   ```

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
NODE_ENV=production
```

## How Vite Environment Variables Work

### Build Time vs Runtime

Vite environment variables are **build-time** variables:
- They are replaced during the build process
- Not available at runtime
- Must start with `VITE_` to be exposed to client code

### Example:

**Code:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
```

**After Build (with env var set):**
```typescript
const API_BASE_URL = "https://circlo-api.onrender.com" || 'http://localhost:3001';
```

**After Build (without env var):**
```typescript
const API_BASE_URL = undefined || 'http://localhost:3001';
// Results in: 'http://localhost:3001'
```

## Troubleshooting

### Still seeing localhost in requests?

**Cause**: Environment variable not set or deployment not rebuilt

**Fix**:
1. Verify `VITE_API_BASE_URL` is set in Vercel Settings
2. Redeploy the application
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache

### Environment variable not working?

**Cause**: Variable name doesn't start with `VITE_`

**Fix**: Ensure the variable name is exactly `VITE_API_BASE_URL` (case-sensitive)

### CORS errors after setting env var?

**Cause**: Backend doesn't allow your Vercel domain

**Fix**: Already fixed! Your backend allows `https://circlo1.vercel.app`

### Different Vercel URL?

**Cause**: Vercel may assign different URLs (preview deployments)

**Fix**: 
1. Check your actual Vercel URL
2. Update backend CORS if needed
3. Set `FRONTEND_URL` in Render to match

## Verification Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL copied (e.g., `https://circlo-api.onrender.com`)
- [ ] `VITE_API_BASE_URL` set in Vercel
- [ ] Vercel redeployed
- [ ] Browser cache cleared
- [ ] Network tab shows correct backend URL
- [ ] No CORS errors
- [ ] Can create events
- [ ] Can upload photos
- [ ] Photos display correctly
- [ ] Real-time updates work

## Quick Test

Open browser console on your Vercel site and run:

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```

Should output:
```
https://circlo-api.onrender.com
```

NOT:
```
undefined
```

## Common Mistakes

❌ **Wrong variable name**: `API_BASE_URL` (missing `VITE_` prefix)
❌ **Trailing slash**: `https://circlo-api.onrender.com/`
❌ **Not redeploying**: Environment variables require rebuild
❌ **Wrong environment**: Only set for Production, not Preview/Development

✅ **Correct**: `VITE_API_BASE_URL=https://circlo-api.onrender.com`

---

**Status**: ⚠️ Action Required - Set environment variable in Vercel
**Priority**: High - Frontend won't work without this
**Date**: January 2026
