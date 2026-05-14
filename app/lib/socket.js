import { Server } from 'socket.io';

let io = null;

/**
 * Initialize Socket.IO server
 * @param {import('http').Server} httpServer - HTTP server instance
 */
export function initializeSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        process.env.FRONTEND_URL,
      ].filter(Boolean),
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join event room
    socket.on('join:event', ({ eventId, userName }) => {
      socket.join(`event:${eventId}`);
      socket.data.eventId = eventId;
      socket.data.userName = userName || 'Anonymous';

      console.log(`${socket.data.userName} joined event ${eventId}`);

      // Notify others that user joined
      socket.to(`event:${eventId}`).emit('user:joined', {
        userName: socket.data.userName,
        timestamp: new Date().toISOString(),
      });

      // Send current online users count
      const room = io.sockets.adapter.rooms.get(`event:${eventId}`);
      const onlineCount = room ? room.size : 0;
      io.to(`event:${eventId}`).emit('users:online', { count: onlineCount });
    });

    // Leave event room
    socket.on('leave:event', ({ eventId }) => {
      socket.leave(`event:${eventId}`);
      console.log(`${socket.data.userName} left event ${eventId}`);

      // Notify others that user left
      socket.to(`event:${eventId}`).emit('user:left', {
        userName: socket.data.userName,
        timestamp: new Date().toISOString(),
      });

      // Update online users count
      const room = io.sockets.adapter.rooms.get(`event:${eventId}`);
      const onlineCount = room ? room.size : 0;
      io.to(`event:${eventId}`).emit('users:online', { count: onlineCount });
    });

    // Upload started notification
    socket.on('upload:started', ({ eventId, userName, fileCount }) => {
      socket.to(`event:${eventId}`).emit('upload:started', {
        userName,
        fileCount,
        timestamp: new Date().toISOString(),
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      
      if (socket.data.eventId) {
        const eventId = socket.data.eventId;
        
        // Notify others that user left
        socket.to(`event:${eventId}`).emit('user:left', {
          userName: socket.data.userName,
          timestamp: new Date().toISOString(),
        });

        // Update online users count
        const room = io.sockets.adapter.rooms.get(`event:${eventId}`);
        const onlineCount = room ? room.size : 0;
        io.to(`event:${eventId}`).emit('users:online', { count: onlineCount });
      }
    });
  });

  return io;
}

/**
 * Get Socket.IO instance
 * @returns {Server} Socket.IO server instance
 */
export function getIO() {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initializeSocket first.');
  }
  return io;
}

/**
 * Emit photo uploaded event to event room
 */
export function emitPhotoUploaded(eventId, photo) {
  if (io) {
    io.to(`event:${eventId}`).emit('photo:uploaded', photo);
  }
}

/**
 * Emit photo deleted event to event room
 */
export function emitPhotoDeleted(eventId, photoId) {
  if (io) {
    io.to(`event:${eventId}`).emit('photo:deleted', { photoId });
  }
}

/**
 * Emit event stats update
 */
export function emitEventStats(eventId, stats) {
  if (io) {
    io.to(`event:${eventId}`).emit('event:stats', stats);
  }
}
