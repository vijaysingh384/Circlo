# 📋 Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment

- [ ] Code is pushed to GitHub/GitLab/Bitbucket
- [ ] All dependencies are listed in `package.json` files
- [ ] Environment variables are documented in `.env.example` files
- [ ] `.gitignore` excludes sensitive files (`.env`, `node_modules`, etc.)
- [ ] MongoDB Atlas cluster is created and configured

## MongoDB Atlas Setup

- [ ] Free cluster created
- [ ] Database user created with strong password
- [ ] Network access configured (0.0.0.0/0 for Render)
- [ ] Connection string copied and saved securely
- [ ] Database name is set to `circlo`

## Backend Deployment (circlo-api)

- [ ] Web Service created on Render
- [ ] Repository connected
- [ ] Build command: `cd server && npm install`
- [ ] Start command: `cd server && npm start`
- [ ] Environment variables set:
  - [ ] `MONGODB_URI`
  - [ ] `BACKEND_URL`
  - [ ] `FRONTEND_URL`
  - [ ] `PORT` (default: 10000)
  - [ ] `NODE_ENV=production`
- [ ] Service deployed successfully
- [ ] Health check endpoint working: `/health`
- [ ] Backend URL copied for frontend configuration

## Frontend Deployment (circlo-frontend)

- [ ] Static Site created on Render
- [ ] Repository connected
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable set:
  - [ ] `VITE_API_BASE_URL` (backend URL)
- [ ] Rewrite rule added: `/* → /index.html`
- [ ] Site deployed successfully
- [ ] Frontend URL accessible in browser

## Post-Deployment Testing

- [ ] Frontend loads without errors
- [ ] Can create a new event
- [ ] Can join an event with code
- [ ] Can upload photos
- [ ] Photos display correctly
- [ ] Can download photos
- [ ] Real-time updates work (Socket.IO)
- [ ] QR code generation works
- [ ] Mobile responsive design works
- [ ] Multiple users can join same event

## CORS Configuration

- [ ] Backend `FRONTEND_URL` matches actual frontend URL
- [ ] Frontend can make API requests to backend
- [ ] Socket.IO connections work
- [ ] No CORS errors in browser console

## Performance & Monitoring

- [ ] Backend health check responds: `https://your-api.onrender.com/health`
- [ ] Response times are acceptable
- [ ] No errors in Render logs
- [ ] MongoDB connection is stable

## Security

- [ ] Environment variables are not exposed in frontend
- [ ] MongoDB connection string is secure
- [ ] CORS is properly configured
- [ ] File upload limits are enforced (5MB)
- [ ] No sensitive data in logs

## Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Render)
- [ ] Monitoring/alerts set up
- [ ] Backup strategy for MongoDB
- [ ] Cloud storage configured (S3/R2) for persistent files
- [ ] CDN configured for static assets
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics added (Google Analytics, etc.)

## Documentation

- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Known limitations documented
- [ ] Troubleshooting guide available

## Rollback Plan

- [ ] Previous working version tagged in Git
- [ ] Know how to redeploy previous version
- [ ] Database backup available
- [ ] Rollback procedure documented

## Free Tier Considerations

- [ ] Aware of 15-minute spin-down on free tier
- [ ] Users informed of potential cold start delays
- [ ] Aware of ephemeral file storage limitations
- [ ] MongoDB Atlas free tier limits understood (512MB)

## Production Readiness (Paid Plans)

If moving to production with paid plans:

- [ ] Render Starter plan or higher ($7+/month)
- [ ] MongoDB Atlas M2 or higher ($9+/month)
- [ ] Cloud storage configured (AWS S3/Cloudflare R2)
- [ ] Persistent disk storage enabled
- [ ] Auto-scaling configured
- [ ] Backup automation set up
- [ ] Monitoring and alerting active
- [ ] Load testing completed
- [ ] Security audit performed

## Support Resources

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Project Issues**: Create an issue in your repository

---

## Quick Commands

### View Backend Logs
```bash
# In Render Dashboard → circlo-api → Logs
```

### View Frontend Logs
```bash
# In Render Dashboard → circlo-frontend → Logs
```

### Redeploy Services
```bash
# In Render Dashboard → Service → Manual Deploy → Deploy latest commit
```

### Test Health Endpoint
```bash
curl https://your-api.onrender.com/health
```

### Test API
```bash
curl https://your-api.onrender.com/api/events
```

---

**Deployment Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

Last Updated: _____________
Deployed By: _____________
