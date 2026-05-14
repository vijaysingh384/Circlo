# 🚀 Render Deployment - Quick Start

Deploy Circlo to Render in 5 minutes!

## Prerequisites
- [ ] GitHub/GitLab account with your code pushed
- [ ] Render account (sign up at [render.com](https://render.com))
- [ ] MongoDB Atlas account (sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))

## Step 1: MongoDB Setup (2 minutes)

1. Create a free MongoDB Atlas cluster
2. Create a database user
3. Whitelist IP: `0.0.0.0/0` (allow all)
4. Copy your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/circlo
   ```

## Step 2: Deploy Backend (2 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your repository
4. Configure:
   ```
   Name: circlo-api
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/circlo
   BACKEND_URL=https://circlo-api.onrender.com
   FRONTEND_URL=https://circlo-frontend.onrender.com
   ```
6. Click **Create Web Service**
7. **Copy your backend URL** (e.g., `https://circlo-api.onrender.com`)

## Step 3: Deploy Frontend (1 minute)

1. Click **New +** → **Static Site**
2. Connect your repository
3. Configure:
   ```
   Name: circlo-frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
4. Add Environment Variable:
   ```
   VITE_API_BASE_URL=https://circlo-api.onrender.com
   ```
   (Use the URL from Step 2)
5. Add Rewrite Rule:
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```
6. Click **Create Static Site**

## Step 4: Update Backend CORS

1. Go back to your backend service (circlo-api)
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL
3. Click **Save Changes** (service will redeploy)

## Step 5: Test! 🎉

1. Visit your frontend URL
2. Create an event
3. Upload photos
4. Share with friends!

## ⚠️ Important Notes

### Free Tier Limitations
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Uploaded files are stored temporarily (lost on restart)

### For Production
Consider upgrading to:
- Render Starter Plan ($7/month) - No spin-down
- Cloud storage (AWS S3/Cloudflare R2) for persistent files

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB connection string
- Verify all environment variables are set
- Check Render logs for specific errors
- **Linux is case-sensitive**: Ensure import paths match exact file names

**Frontend can't connect?**
- Verify `VITE_API_BASE_URL` matches your backend URL
- Check backend is running (visit backend URL in browser)

**Photos not showing?**
- Verify `BACKEND_URL` environment variable is set
- Check browser console for errors

**Module not found errors?**
- File imports are case-sensitive on Linux
- Check that route file names match imports exactly

## 📚 Need More Help?

See the full [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.

---

**That's it!** Your Circlo app is now live! 🎊
