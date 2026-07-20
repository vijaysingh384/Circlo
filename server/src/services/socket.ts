import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { PhotoPublic } from '../types/index.js';

let io: Server | null = null;

function updateOnlineUsers(eventId: string) {
    if (!io) return;

    const room = io.sockets.adapter.rooms.get(`event:${eventId}`);

    io.to(`event:${eventId}`).emit("users:online", {
        count: room ? room.size : 0,
    });
}

/**
 * Initialize Socket.IO server
 */
export function initializeSocket(httpServer: HTTPServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        process.env.FRONTEND_URL || '',
      ].filter((url) => url !== ''),
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log("Socket Connected");

    // Join event room
    socket.on('join:event', ({ eventId, userName }) => {
      socket.join(`event:${eventId}`);
      socket.data.eventId = eventId;
      socket.data.userName = userName || 'Anonymous';


      // Send current online users count
      updateOnlineUsers(eventId);
    });

    // Leave event room
    socket.on('leave:event', ({ eventId }) => {
      socket.leave(`event:${eventId}`);
    

      // Update online users count
      updateOnlineUsers(eventId);
    });


    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected`);
      
      if (socket.data.eventId) {
        const eventId = socket.data.eventId;

        // Update online users count
        updateOnlineUsers(eventId);
      }
    });
  });

  return io;
}

/**
 * Get Socket.IO instance
 */
export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
}

/**
 * Emit photo uploaded event to event room
 */
export function emitPhotoUploaded(eventId: string, photo: PhotoPublic): void {
  if (io) {
    io.to(`event:${eventId}`).emit('photo:uploaded', photo);
  }
}

/**
 * Emit photo deleted event to event room
 */
export function emitPhotoDeleted(eventId: string, photoId: string): void {
  if (io) {
    io.to(`event:${eventId}`).emit('photo:deleted', { photoId });
  }
}

/**
 * Emit event stats update
 */
export function emitEventStats(eventId: string, stats: { photoCount: number }): void {
  if (io) {
    io.to(`event:${eventId}`).emit('event:stats', stats);
  }
}
