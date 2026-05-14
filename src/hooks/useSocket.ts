import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { UseSocketOptions, UseSocketReturn } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function useSocket(options: UseSocketOptions): UseSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const {
    eventId,
    userName,
    onPhotoUploaded,
    onPhotoDeleted,
    onUserJoined,
    onUserLeft,
    onUsersOnline,
    onUploadStarted,
    onEventStats,
  } = options;

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      // Join event room
      socket.emit('join:event', { eventId, userName: userName || 'Anonymous' });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Event listeners
    if (onPhotoUploaded) {
      socket.on('photo:uploaded', onPhotoUploaded);
    }

    if (onPhotoDeleted) {
      socket.on('photo:deleted', onPhotoDeleted);
    }

    if (onUserJoined) {
      socket.on('user:joined', onUserJoined);
    }

    if (onUserLeft) {
      socket.on('user:left', onUserLeft);
    }

    if (onUsersOnline) {
      socket.on('users:online', onUsersOnline);
    }

    if (onUploadStarted) {
      socket.on('upload:started', onUploadStarted);
    }

    if (onEventStats) {
      socket.on('event:stats', onEventStats);
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit('leave:event', { eventId });
        socket.disconnect();
      }
    };
  }, [eventId, userName, onPhotoUploaded, onPhotoDeleted, onUserJoined, onUserLeft, onUsersOnline, onUploadStarted, onEventStats]);

  // Helper function to emit upload started event
  const notifyUploadStarted = (fileCount: number) => {
    if (socketRef.current) {
      socketRef.current.emit('upload:started', {
        eventId,
        userName: userName || 'Anonymous',
        fileCount,
      });
    }
  };

  return {
    socket: socketRef.current,
    notifyUploadStarted,
  };
}
