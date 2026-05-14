import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getHostToken, getSessionToken } from '../lib/tokens';
import { copyToClipboard } from '../utils/clipboard';

// Components
import { EventHeader } from '../components/EventHeader';
import { QRCodeModal } from '../components/QRCodeModal';
import { UploadSection } from '../components/UploadSection';
import { PhotoGallery } from '../components/PhotoGallery';
import { ToastContainer } from '../components/Toast';

// Custom Hooks
import { useEvent } from '../hooks/useEvent';
import { usePhotos } from '../hooks/usePhotos';
import { useUpload } from '../hooks/useUpload';
import { useToasts } from '../hooks/useToasts';
import { usePhotoSelection } from '../hooks/usePhotoSelection';
import { useSocketEvents } from '../hooks/useSocketEvents';

export function EventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  
  // Local state
  const [userName, setUserName] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  // Tokens
  const hostToken = eventId ? getHostToken(eventId) : null;
  const sessionToken = eventId ? getSessionToken(eventId) : null;
  const isHost = Boolean(hostToken);

  // Custom hooks
  const { event, loading: eventLoading, error: eventError } = useEvent(eventId);
  
  const {
    photos,
    addPhoto,
    removePhoto,
    deletePhoto,
  } = usePhotos(eventId);

  const { toasts, addToast, removeToast } = useToasts();

  const {
    selectedPhotos,
    toggleSelection,
    clearSelection,
    downloadAll,
    downloadSelected,
  } = usePhotoSelection(eventId);

  const {
    uploading,
    uploadProgress,
    error: uploadError,
    fileInputRef,
    handleFileSelect,
  } = useUpload({
    eventId,
    userName,
    sessionToken,
    onUploadStart: (fileCount) => {
      notifyUploadStarted(fileCount);
    },
    onUploadComplete: () => {
      addToast('Photos uploaded successfully!', 'success');
    },
    onError: (error) => {
      addToast(error, 'warning');
    },
  });

  const { onlineUsers, notifyUploadStarted } = useSocketEvents({
    eventId: eventId || '',
    userName,
    onPhotoUploaded: addPhoto,
    onPhotoDeleted: removePhoto,
    onToast: addToast,
  });

  // Handlers
  const handleDelete = async (photoId: string) => {
    if (!confirm('Delete this photo?')) return;

    try {
      await deletePhoto(photoId, sessionToken, hostToken);
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Delete failed', 'warning');
    }
  };

  const handleDownloadAll = async () => {
    try {
      await downloadAll(event?.name || 'event');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Download failed', 'warning');
    }
  };

  const handleDownloadSelected = async () => {
    try {
      await downloadSelected(event?.name || 'event');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Download failed', 'warning');
    }
  };

  const copyShareLink = async () => {
    if (!event) return;

    const link = `${window.location.origin}/join?code=${event.joinCode}`;
    await copyToClipboard(link);
    addToast('Share link copied!', 'success');
  };

  // Loading state
  if (eventLoading) {
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
  if (eventError || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e]">
        <div className="text-center">
          <p className="text-red-400">{eventError || 'Event not found'}</p>
        </div>
      </div>
    );
  }

  const joinLink = `${window.location.origin}/join?code=${event.joinCode}`;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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
          error={uploadError}
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
          onClearSelection={clearSelection}
        />
      </div>
    </div>
  );
}
