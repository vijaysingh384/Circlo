import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';

import eventsRouter from './Routes/Events.js';
import photosRouter from './Routes/Photos.js';

import './config/mongoose-connection.js';
import Database from './lib/database.js';
import LocalStorage from './lib/storage.js';

const app = express();

// Initialize database and storage
const db = new Database();
const storage = new LocalStorage('public/uploads');
await storage.init();

// Make db and storage available to routes
app.locals.db = db;
app.locals.storage = storage;

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (req, res) => {
  res.send('Circlo API Server');
});

app.use('/api', eventsRouter);
app.use('/api', photosRouter);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});