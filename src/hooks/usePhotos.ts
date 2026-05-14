import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { Photo, UsePhotosReturn } from '../types';

export function usePhotos(eventId: string | undefined): UsePhotosReturn {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getPhotos(eventId);
      setPhotos(data.photos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  // Add photo (from socket event)
  const addPhoto = useCallback((photo: Photo) => {
    setPhotos((prev) => {
      // Avoid duplicates
      if (prev.some((p) => p.photoId === photo.photoId)) {
        return prev;
      }
      return [...prev, photo];
    });
  }, []);

  // Remove photo (from socket event)
  const removePhoto = useCallback((photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.photoId !== photoId));
  }, []);

  // Delete photo (API call)
  const deletePhoto = useCallback(
    async (
      photoId: string,
      sessionToken: string | null,
      hostToken: string | null
    ) => {
      if (!eventId) return;

      try {
        await api.deletePhoto(eventId, photoId, sessionToken, hostToken);
        // Photo will be removed via socket event
      } catch (err) {
        throw new Error(err instanceof Error ? err.message : 'Delete failed');
      }
    },
    [eventId]
  );

  return {
    photos,
    loading,
    error,
    addPhoto,
    removePhoto,
    deletePhoto,
    refreshPhotos: loadPhotos,
  };
}
