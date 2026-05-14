# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### WebSocket Connection Errors

**Error:**
```
WebSocket connection to 'ws://localhost:3001/socket.io/?EIO=4&transport=websocket' failed
```

**Cause:** The backend server is not running or not accessible.

**Solution:**

1. **Check if the server is running:**
   ```bash
   # Check if port 3001 is in use
   netstat -an | grep 3001
   # or
   lsof -i :3001
   ```

2. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

3. **Or start both frontend and backend together:**
   ```bash
   # From project root
   npm run dev:all
   ```

4. **Verify the server is running:**
   - You should see: `Server running on port 3001`
   - And: `Socket.IO initialized and ready`
   - And: `Connected to MongoDB`

5. **Refresh your browser** (the frontend at http://localhost:5173)

---

### MongoDB Connection Errors

**Error:**
```
Error connecting to MongoDB
```

**Solution:**

1. **Make sure MongoDB is running:**
   ```bash
   # Start MongoDB
   mongod
   
   # Or if using MongoDB as a service
   brew services start mongodb-community
   ```

2. **Check your connection string in `server/.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/circlo
   ```

3. **If using MongoDB Atlas:**
   - Make sure your IP is whitelisted
   - Check your connection string is correct
   - Ensure your database user has proper permissions

---

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**

1. **Find the process using the port:**
   ```bash
   lsof -i :3001
   ```

2. **Kill the process:**
   ```bash
   kill -9 <PID>
   # or
   pkill -f "node.*server.js"
   ```

3. **Restart the server:**
   ```bash
   cd server
   npm run dev
   ```

---

### CORS Errors

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**

1. **Check `FRONTEND_URL` in `server/.env`:**
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

2. **Make sure it matches your frontend URL** (no trailing slash)

3. **Restart the backend server** after changing .env

---

### File Upload Errors

**Error:**
```
File is too large. Maximum size is 5MB
```

**Solution:**

1. **Check file size** - Maximum is 5MB per file

2. **Check file type** - Only images are allowed:
   - JPEG (.jpg, .jpeg)
   - PNG (.png)
   - GIF (.gif)
   - WebP (.webp)
   - HEIC/HEIF (.heic, .heif)

3. **To change the limit**, edit `server/middleware/validation.js`:
   ```javascript
   MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
   ```

---

### TypeScript Errors

**Error:**
```
Cannot find module or its corresponding type declarations
```

**Solution:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Restart TypeScript server** in your IDE

3. **Check `tsconfig.json`** is properly configured

---

### Environment Variables Not Loading

**Error:**
```
undefined or null environment variables
```

**Solution:**

1. **Create `.env` files:**
   ```bash
   # Frontend
   cp .env.example .env
   
   # Backend
   cp server/.env.example server/.env
   ```

2. **Fill in the values:**
   ```env
   # Frontend .env
   VITE_API_BASE_URL=http://localhost:3001
   
   # Backend server/.env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/circlo
   FRONTEND_URL=http://localhost:5173
   ```

3. **Restart both servers** after changing .env files

---

### Photos Not Appearing in Real-Time

**Issue:** Photos upload but don't appear for other users

**Solution:**

1. **Check WebSocket connection** (see first issue above)

2. **Check browser console** for errors

3. **Make sure all users are on the same event page**

4. **Try refreshing the page**

5. **Check if Socket.IO is initialized:**
   - Backend should show: `Socket.IO initialized and ready`
   - Browser console should NOT show WebSocket errors

---

### Downloads Not Working

**Issue:** ZIP download fails or is empty

**Solution:**

1. **Check if photos exist** in the event

2. **Check server logs** for errors

3. **Make sure storage directory exists:**
   ```bash
   ls -la server/public/uploads/
   ```

4. **Check file permissions:**
   ```bash
   chmod -R 755 server/public/uploads/
   ```

---

## Quick Fixes

### Reset Everything

```bash
# Stop all processes
pkill -f "node"

# Clean node_modules
rm -rf node_modules server/node_modules

# Reinstall dependencies
npm run install:all

# Start fresh
npm run dev:all
```

### Clear MongoDB Data

```bash
# Connect to MongoDB
mongosh

# Use the database
use circlo

# Drop all collections
db.events.drop()
db.photos.drop()

# Exit
exit
```

### Check All Services

```bash
# Check MongoDB
mongosh --eval "db.adminCommand('ping')"

# Check backend
curl http://localhost:3001

# Check frontend
curl http://localhost:5173
```

---

## Getting Help

If you're still having issues:

1. **Check the logs:**
   - Backend: Look at the terminal running `npm run dev` in `server/`
   - Frontend: Check browser console (F12)

2. **Enable verbose logging:**
   ```javascript
   // In useSocketEvents.ts, uncomment:
   socket.on('connect', () => {
     console.log('Socket connected:', socket.id);
   });
   ```

3. **Test the API directly:**
   ```bash
   # Test backend health
   curl http://localhost:3001
   
   # Test creating an event
   curl -X POST http://localhost:3001/api/events \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Event","joinCode":"TEST123"}'
   ```

4. **Open an issue on GitHub** with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, MongoDB version)
   - Relevant logs

---

## Useful Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check MongoDB version
mongod --version

# Check running processes
ps aux | grep node

# Check open ports
netstat -an | grep LISTEN

# View backend logs
cd server && npm run dev

# View frontend logs
npm run dev

# Run both together
npm run dev:all
```

---

**Need more help?** Check the [README.md](README.md) or open an issue on GitHub.
