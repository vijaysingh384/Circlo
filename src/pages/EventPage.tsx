import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { api } from '../lib/api';
import { getHostToken, getSessionToken } from '../lib/tokens';

import type { Photo } from '../types';

import { EventHeader } from '../components/EventHeader';
import { QRCodeModal } from '../components/QRCodeModal';
import { UploadSection } from '../components/UploadSection';
import { PhotoGallery } from '../components/PhotoGallery';
import { ToastContainer } from '../components/Toast';

import { useSocket } from '../hooks/useSocket';

export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [event, setEvent] = useState<any>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [showQR, setShowQR] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);

  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type?: 'info' | 'success' | 'warning';
    }>
  >([]);

  const hostToken = eventId ? getHostToken(eventId) : null;
  const sessionToken = eventId ? getSessionToken(eventId) : null;

  const isHost = Boolean(hostToken);

  // ---------------- TOASTS ----------------

  const addToast = useCallback(
    (
      message: string,
      type: 'info' | 'success' | 'warning' = 'info'
    ) => {
      setToasts((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          message,
          type,
        },
      ]);
    },
    []
  );

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ---------------- LOAD DATA ----------------

  const loadEvent = async () => {
    if (!eventId) return;

    try {
      const data = await api.getEvent(eventId);
      setEvent(data);
    } catch {
      setError('Failed to load event');
    }
  };

  const loadPhotos = async () => {
    if (!eventId) return;

    try {
      const data = await api.getPhotos(eventId);
      setPhotos(data.photos || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvent();
    loadPhotos();
  }, [eventId]);

  // ---------------- SOCKET ----------------

  const { notifyUploadStarted } = useSocket({
    eventId: eventId || '',
    userName,

    onPhotoUploaded: (photo: Photo) => {
      setPhotos((prev) => {
        if (prev.some((p) => p.photoId === photo.photoId)) {
          return prev;
        }

        return [...prev, photo];
      });

      if (photo.uploadedByName !== userName) {
        addToast(`📸 ${photo.uploadedByName} uploaded a photo`, 'success');
      }
    },

    onPhotoDeleted: ({ photoId }) => {
      setPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
    },

    onUserJoined: ({ userName: joinedUser }) => {
      if (joinedUser !== userName) {
        addToast(`🟢 ${joinedUser} joined`);
      }
    },

    onUserLeft: ({ userName: leftUser }) => {
      if (leftUser !== userName) {
        addToast(`⚪ ${leftUser} left`);
      }
    },

    onUsersOnline: ({ count }) => {
      setOnlineUsers(count);
    },

    onUploadStarted: ({ userName: uploader, fileCount }) => {
      if (uploader !== userName) {
        addToast(
          `${uploader} is uploading ${fileCount} photo${
            fileCount > 1 ? 's' : ''
          }...`
        );
      }
    },
  });

  // ---------------- FILE HANDLING ----------------

  const clearSelectedFiles = () => {
    previewUrls.forEach(URL.revokeObjectURL);

    setSelectedFiles([]);
    setPreviewUrls([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (!userName.trim()) {
      setError('Please enter your name first');
      return;
    }

    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));

    setError('');
  };

  // const handleRemovePreview = (index: number) => {
  //   URL.revokeObjectURL(previewUrls[index]);

  //   setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

  //   setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  // };

  // ---------------- UPLOAD ----------------

  // const handleUpload = async () => {
  //   if (!eventId || !selectedFiles.length) return;

  //   setUploading(true);
  //   setUploadProgress(0);

  //   try {
  //     notifyUploadStarted(selectedFiles.length);

  //     const token = sessionToken || crypto.randomUUID();

  //     for (let i = 0; i < selectedFiles.length; i++) {
  //       await api.uploadPhoto(
  //         eventId,
  //         selectedFiles[i],
  //         userName.trim(),
  //         token
  //       );

  //       setUploadProgress(
  //         Math.round(((i + 1) / selectedFiles.length) * 100)
  //       );
  //     }

  //     addToast('Photos uploaded successfully', 'success');

  //     clearSelectedFiles();
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'Upload failed');
  //     addToast('Upload failed', 'warning');
  //   } finally {
  //     setUploading(false);
  //     setUploadProgress(0);
  //   }
  // };

  // ---------------- DELETE ----------------

  const handleDelete = async (photoId: string) => {
    if (!eventId || !confirm('Delete this photo?')) return;

    try {
      await api.deletePhoto(
        eventId,
        photoId,
        sessionToken,
        hostToken
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  // ---------------- DOWNLOAD ----------------

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    if (!eventId) return;

    try {
      const blob = await api.downloadAll(eventId);

      downloadBlob(
        blob,
        `${event?.name || 'event'}_photos.zip`
      );
    } catch {
      setError('Download failed');
    }
  };

  const handleDownloadSelected = async () => {
    if (!eventId || !selectedPhotos.size) return;

    try {
      const blob = await api.downloadSelected(
        eventId,
        [...selectedPhotos]
      );

      downloadBlob(
        blob,
        `${event?.name || 'event'}_selected_photos.zip`
      );

      setSelectedPhotos(new Set());
    } catch {
      setError('Download failed');
    }
  };

  // ---------------- PHOTO SELECTION ----------------

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos((prev) => {
      const updated = new Set(prev);

      updated.has(photoId)
        ? updated.delete(photoId)
        : updated.add(photoId);

      return updated;
    });
  };

  // ---------------- SHARE ----------------

  const copyShareLink = async () => {
    if (!event) return;

    const link = `${window.location.origin}/join?code=${event.joinCode}`;

    await navigator.clipboard.writeText(link);

    addToast('Share link copied!', 'success');
  };

  // ---------------- LOADING ----------------

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  const joinLink = `${window.location.origin}/join?code=${event.joinCode}`;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />

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
          error={error}
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
          onToggleSelection={togglePhotoSelection}
          onDelete={handleDelete}
          onClearSelection={() => setSelectedPhotos(new Set())}
        />
      </div>
    </div>
  );
}