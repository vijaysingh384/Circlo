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
import LocalStorage from './lib/storage.js';
import { initializeSocket } from './lib/socket.js';
import { CleanupService } from './lib/cleanup.js';

const app = express();
const httpServer = createServer(app);

// Initialize database and storage
const db = new Database();
const storage = new LocalStorage('public/uploads');
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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://circlo1.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
  


app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(express.static(path.join(process.cwd(), 'public')));

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