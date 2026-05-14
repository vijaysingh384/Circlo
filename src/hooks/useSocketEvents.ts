import { useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import type { Photo, UseSocketEventsOptions, UseSocketEventsReturn } from '../types';

export function useSocketEvents({
  eventId,
  userName,
  onPhotoUploaded,
  onPhotoDeleted,
  onToast,
}: UseSocketEventsOptions): UseSocketEventsReturn {
  const [onlineUsers, setOnlineUsers] = useState(0);

  const handlePhotoUploaded = useCallback(
    (photo: Photo) => {
      onPhotoUploaded?.(photo);

      // Show toast if uploaded by someone else
      if (photo.uploadedByName !== userName) {
        onToast?.(`📸 ${photo.uploadedByName} uploaded a photo`, 'success');
      }
    },
    [userName, onPhotoUploaded, onToast]
  );

  const handlePhotoDeleted = useCallback(
    (data: { photoId: string }) => {
      onPhotoDeleted?.(data.photoId);
      onToast?.('Photo deleted', 'info');
    },
    [onPhotoDeleted, onToast]
  );

  const handleUserJoined = useCallback(
    (data: { userName: string }) => {
      if (data.userName !== userName) {
        onToast?.(`🟢 ${data.userName} joined`, 'info');
      }
    },
    [userName, onToast]
  );

  const handleUserLeft = useCallback(
    (data: { userName: string }) => {
      if (data.userName !== userName) {
        onToast?.(`⚪ ${data.userName} left`, 'info');
      }
    },
    [userName, onToast]
  );

  const handleUsersOnline = useCallback((data: { count: number }) => {
    setOnlineUsers(data.count);
  }, []);

  const handleUploadStarted = useCallback(
    (data: { userName: string; fileCount: number }) => {
      if (data.userName !== userName) {
        onToast?.(
          `${data.userName} is uploading ${data.fileCount} photo${
            data.fileCount > 1 ? 's' : ''
          }...`,
          'info'
        );
      }
    },
    [userName, onToast]
  );

  const { notifyUploadStarted } = useSocket({
    eventId,
    userName,
    onPhotoUploaded: handlePhotoUploaded,
    onPhotoDeleted: handlePhotoDeleted,
    onUserJoined: handleUserJoined,
    onUserLeft: handleUserLeft,
    onUsersOnline: handleUsersOnline,
    onUploadStarted: handleUploadStarted,
  });

  return {
    onlineUsers,
    notifyUploadStarted,
  };
}
