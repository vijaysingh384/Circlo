import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { getHostToken, getSessionToken } from '../lib/tokens';
import { copyToClipboard } from '../utils/clipboard';
import { api } from '../lib/api';
import { downloadBlob } from '../utils/download';
import type { Event, Photo } from '../types';

// Components
import { EventHeader } from '../components/EventHeader';
import { QRCodeModal } from '../components/QRCodeModal';
import { UploadSection } from '../components/UploadSection';
import { PhotoGallery } from '../components/PhotoGallery';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  
  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [userName, setUserName] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const isInitializedRef = useRef(false);
  
  // Tokens
  const hostToken = eventId ? getHostToken(eventId) : null;
  const sessionToken = eventId ? getSessionToken(eventId) : null;
  const isHost = Boolean(hostToken);

  // Load event and photos
  useEffect(() => {
    if (!eventId) return;

    const loadData = async () => {
      try {
        const [eventData, photosData] = await Promise.all([
          api.getEvent(eventId),
          api.getPhotos(eventId),
        ]);
        
        setEvent(eventData);
        setPhotos(photosData.photos || []);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId]);

  // Socket.IO connection
  useEffect(() => {
    if (!eventId || isInitializedRef.current) return;

    isInitializedRef.current = true;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join:event', { eventId, userName: userName || 'Anonymous' });
    });

    socket.on('photo:uploaded', (photo: Photo) => {
      setPhotos((prev) => {
        if (prev.some((p) => p.photoId === photo.photoId)) return prev;
        return [...prev, photo];
      });
    });

    socket.on('photo:deleted', (data: { photoId: string }) => {
      setPhotos((prev) => prev.filter((p) => p.photoId !== data.photoId));
      setSelectedPhotos((prev) => {
        const updated = new Set(prev);
        updated.delete(data.photoId);
        return updated;
      });
    });

    socket.on('users:online', (data: { count: number }) => {
      setOnlineUsers(data.count);
    });

    return () => {
      isInitializedRef.current = false;
      if (socket) {
        socket.emit('leave:event', { eventId });
        socket.disconnect();
      }
    };
  }, [eventId, userName]);

  // Handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !eventId || !userName.trim()) return;

    setUploading(true);
    setUploadProgress(0);

    const token = sessionToken || crypto.randomUUID();

    try {
      // Notify upload started
      if (socketRef.current) {
        socketRef.current.emit('upload:started', {
          eventId,
          userName: userName.trim(),
          fileCount: files.length,
        });
      }

      // Upload each file
      for (let i = 0; i < files.length; i++) {
        await api.uploadPhoto(eventId, files[i], userName.trim(), token);
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('Delete this photo?') || !eventId) return;

    try {
      await api.deletePhoto(eventId, photoId, sessionToken, hostToken);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const handleDownloadAll = async () => {
    if (!eventId) return;

    try {
      const blob = await api.downloadAll(eventId);
      downloadBlob(blob, `${event?.name || 'event'}_photos.zip`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Download failed');
    }
  };

  const handleDownloadSelected = async () => {
    if (!eventId || selectedPhotos.size === 0) return;

    try {
      const blob = await api.downloadSelected(eventId, Array.from(selectedPhotos));
      downloadBlob(blob, `${event?.name || 'event'}_selected_photos.zip`);
      setSelectedPhotos(new Set());
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Download failed');
    }
  };

  const toggleSelection = (photoId: string) => {
    setSelectedPhotos((prev) => {
      const updated = new Set(prev);
      if (updated.has(photoId)) {
        updated.delete(photoId);
      } else {
        updated.add(photoId);
      }
      return updated;
    });
  };

  const copyShareLink = async () => {
    if (!event) return;
    const link = `${window.location.origin}/join?code=${event.joinCode}`;
    await copyToClipboard(link);
    alert('Share link copied!');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <p className="text-red-400">Event not found</p>
        </div>
      </div>
    );
  }

  const joinLink = `${window.location.origin}/join?code=${event.joinCode}`;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <EventHeader
        eventName={event.name}
        photoCount={photos.length}
        isHost={isHost}
        selectedPhotosCount={selectedPhotos.size}
        onShowQR={() => setShowQR(true)}
        onDownloadAll={handleDownloadAll}
        onDownloadSelected={handleDownloadSelected}
      />

      {onlineUsers > 0 && (
        <div className="bg-[#0b1120] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-2 text-sm text-gray-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>
              {onlineUsers} {onlineUsers === 1 ? 'person' : 'people'} viewing
            </span>
          </div>
        </div>
      )}

      <QRCodeModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        joinCode={event.joinCode}
        joinLink={joinLink}
        onCopyLink={copyShareLink}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <UploadSection
          userName={userName}
          onUserNameChange={setUserName}
          uploading={uploading}
          uploadProgress={uploadProgress}
          photoCount={photos.length}
          eventJoinCode={event.joinCode}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
        />

        <PhotoGallery
          photos={photos}
          selectedPhotos={selectedPhotos}
          isHost={isHost}
          sessionToken={sessionToken}
          onToggleSelection={toggleSelection}
          onDelete={handleDelete}
          onClearSelection={() => setSelectedPhotos(new Set())}
        />
      </div>
    </div>
  );
}
