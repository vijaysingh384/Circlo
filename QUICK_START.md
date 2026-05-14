# ⚡ Quick Start Guide

Get Circlo running in 5 minutes!

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/yourusername/circlo.git
cd circlo

# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Set Up Environment Variables

**Frontend (.env):**
```bash
# Copy the example file
cp .env.example .env

# Edit .env
VITE_API_BASE_URL=http://localhost:3001
```

**Backend (server/.env):**
```bash
# Copy the example file
cp server/.env.example server/.env

# Edit server/.env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/circlo
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

**Option 1: Local MongoDB**
```bash
mongod
```

**Option 2: MongoDB Atlas**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string
- Update `MONGODB_URI` in `server/.env`

### 4. Run the Application

**Option 1: Run both together (recommended)**
```bash
npm run dev:all
```

**Option 2: Run separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 5. Open in Browser

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🎉 You're Done!

Try it out:
1. Create an event
2. Share the QR code
3. Upload some photos
4. See them appear in real-time!

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides
- Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod

# Or check your connection string in server/.env
```

### Port Already in Use
```bash
# Change PORT in server/.env
PORT=3002

# Update VITE_API_BASE_URL in .env
VITE_API_BASE_URL=http://localhost:3002
```

### CORS Error
```bash
# Make sure FRONTEND_URL in server/.env matches your frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🎯 Common Commands

```bash
# Install dependencies
npm run install:all

# Run both frontend and backend
npm run dev:all

# Build frontend for production
npm run build

# Start backend in production
cd server && npm start

# Lint code
npm run lint
```

## 📁 Project Structure

```
circlo/
├── src/              # Frontend (React + TypeScript)
├── server/           # Backend (Node.js + Express)
├── public/           # Static assets
├── README.md         # Full documentation
├── DEPLOYMENT.md     # Deployment guide
└── .env.example      # Environment template
```

## 🎓 Learn More

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Express**: https://expressjs.com
- **MongoDB**: https://www.mongodb.com/docs
- **Socket.IO**: https://socket.io/docs

---

**Happy coding! 🚀**
