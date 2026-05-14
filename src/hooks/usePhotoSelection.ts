import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { UsePhotoSelectionReturn } from '../types';

export function usePhotoSelection(eventId: string | undefined): UsePhotoSelectionReturn {
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((photoId: string) => {
    setSelectedPhotos((prev) => {
      const updated = new Set(prev);
      
      if (updated.has(photoId)) {
        updated.delete(photoId);
      } else {
        updated.add(photoId);
      }
      
      return updated;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPhotos(new Set());
  }, []);

  const selectAll = useCallback((photoIds: string[]) => {
    setSelectedPhotos(new Set(photoIds));
  }, []);

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = useCallback(
    async (eventName: string) => {
      if (!eventId) return;

      try {
        const blob = await api.downloadAll(eventId);
        downloadBlob(blob, `${eventName || 'event'}_photos.zip`);
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Download failed');
      }
    },
    [eventId]
  );

  const downloadSelected = useCallback(
    async (eventName: string) => {
      if (!eventId || selectedPhotos.size === 0) return;

      try {
        const blob = await api.downloadSelected(eventId, Array.from(selectedPhotos));
        downloadBlob(blob, `${eventName || 'event'}_selected_photos.zip`);
        clearSelection();
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Download failed');
      }
    },
    [eventId, selectedPhotos, clearSelection]
  );

  return {
    selectedPhotos,
    toggleSelection,
    clearSelection,
    selectAll,
    downloadAll,
    downloadSelected,
  };
}
