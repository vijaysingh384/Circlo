import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import path from 'path';

import eventsRouter from './routes/Events.js';
import photosRouter from './routes/Photos.js';

import './config/mongoose-connection.js';
import Database from './lib/database.js';
import CloudinaryStorage from './lib/cloudinaryStorage.js';
import { initializeSocket } from './lib/socket.js';
import { CleanupService } from './lib/cleanup.js';

const app = express();
const httpServer = createServer(app);

// Initialize database and storage
const db = new Database();

// Use Cloudinary storage (cloud) or fallback to local storage
const storage = new CloudinaryStorage();
await storage.init();

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Initialize Cleanup Service (auto-delete photos after 1 hour)
const cleanupService = new CleanupService(db, storage);
cleanupService.start();

// Make db, storage, and io available to routes
app.locals.db = db;
app.locals.storage = storage;
app.locals.io = io;

// CORS configuration - allow multiple origins
// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    // Allow any Vercel preview/production deployment for this project
    const isVercel = /^https:\/\/circlo(-[a-z0-9]+)*(-vijaysingh384s-projects)?\.vercel\.app$/.test(origin);

    if (allowedOrigins.includes(origin) || isVercel) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve static files from public directory
const publicPath = path.join(process.cwd(), 'public');
console.log('📁 Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: db ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => {
  res.send('Circlo API Server');
});

app.use('/api', eventsRouter);
app.use('/api', photosRouter);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO initialized and ready`);
});