import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { upload } from '../middleware/upload.js';
import { optimizeImage } from '../middleware/imageOptimization.js';
import { validateUpload } from '../middleware/validation.js';
import {
  emitPhotoUploaded,
  emitPhotoDeleted,
  emitEventStats,
} from '../services/socket.js';
import type Database from '../services/database.js';
import type CloudinaryStorage from '../services/cloudinaryStorage.js';

const router = Router();

const UPLOAD_LIMIT = 20;

// GET /api/events/:eventId/photos
router.get('/events/:eventId/photos', async (req: Request, res: Response) => {
  const db = req.app.locals.db as Database;
  const eventId = req.params.eventId as string;

  try {
    const event = await db.getEventById(eventId);

    if (!event) {
      return res.status(404).json({
        error: 'EVENT_NOT_FOUND',
        message: 'Event not found',
      });
    }

    const photos = await db.getPhotosByEventId(eventId);

    const publicPhotos = photos.map((photo) => ({
      photoId: photo.photoId,
      eventId: photo.eventId,
      fileName: photo.fileName,
      fileSize: photo.fileSize,
      uploadedByName: photo.uploadedByName,
      sessionToken: photo.sessionToken,
      publicUrl: photo.publicUrl,
      thumbnailUrl: photo.thumbnailUrl || photo.publicUrl,
      uploadedAt: photo.uploadedAt,
    }));

    return res.json({ photos: publicPhotos });

  } catch (err) {
    throw new Error("something went wrong"); 
  }
});

// POST /api/events/:eventId/photos
router.post(
  '/events/:eventId/photos',
  upload.single('photo'),
  validateUpload,
  optimizeImage,
  async (req: Request, res: Response) => {

    const db = req.app.locals.db as Database;
    const storage = req.app.locals.storage as CloudinaryStorage;

    const eventId = req.params.eventId as string;

    const sessionToken = req.headers['x-session-token'] as string | undefined;
    const uploadedByName = req.body.uploadedByName || 'Anonymous';

    if (!sessionToken) {
      return res.status(400).json({
        error: 'MISSING_SESSION_TOKEN',
        message: 'x-session-token header is required',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'NO_FILE',
        message: 'No file uploaded',
      });
    }

    try {
      const event = await db.getEventById(eventId);

      if (!event) {
        return res.status(404).json({
          error: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        });
      }

      const count = await db.countPhotosBySessionToken(
        eventId,
        sessionToken
      );

      if (count >= UPLOAD_LIMIT) {
        return res.status(403).json({
          error: 'UPLOAD_LIMIT_EXCEEDED',
          message: `Maximum ${UPLOAD_LIMIT} photos allowed.`,
        });
      }

      const {
        publicUrl,
        thumbnailUrl,
        publicId,
        thumbnailPublicId,
      } = await storage.uploadPhoto(
        req.file.buffer,
        eventId,
        req.file.originalname
      );

      const photoId = randomUUID();

      const photo = await db.createPhoto({
        photoId,
        eventId,
        storagePath: publicId,
        thumbnailPath: thumbnailPublicId,
        cloudinaryPublicId: publicId,
        cloudinaryThumbnailPublicId: thumbnailPublicId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        uploadedByName,
        sessionToken,
        storageProvider: 'cloudinary',
        publicUrl,
        thumbnailUrl,
        uploadedAt: new Date().toISOString(),
      });

      const publicPhoto = {
        photoId: photo.photoId,
        eventId: photo.eventId,
        fileName: photo.fileName,
        fileSize: photo.fileSize,
        uploadedByName: photo.uploadedByName,
        sessionToken: photo.sessionToken,
        publicUrl: photo.publicUrl,
        thumbnailUrl: photo.thumbnailUrl,
        uploadedAt: photo.uploadedAt,
      };

      emitPhotoUploaded(eventId, publicPhoto);

      const photos = await db.getPhotosByEventId(eventId);

      emitEventStats(eventId, {
        photoCount: photos.length,
      });

      return res.status(201).json(publicPhoto);

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to upload photo',
      });
    }
  }
);

// DELETE /api/events/:eventId/photos/:photoId
router.delete(
  '/events/:eventId/photos/:photoId',
  async (req: Request, res: Response) => {

    const db = req.app.locals.db as Database;
    const storage = req.app.locals.storage as CloudinaryStorage;

    const eventId = req.params.eventId as string;
    const photoId = req.params.photoId as string;

    const sessionToken = req.headers['x-session-token'] as string | undefined;
    const hostToken = req.headers['x-host-token'] as string | undefined;

    try {

      const photo = await db.getPhotoById(photoId);

      if (!photo) {
        return res.status(404).json({
          error: 'PHOTO_NOT_FOUND',
          message: 'Photo not found',
        });
      }

      if (photo.eventId !== eventId) {
        return res.status(404).json({
          error: 'PHOTO_NOT_FOUND',
          message: 'Photo not found in this event',
        });
      }

      const event = await db.getEventById(eventId);

      if (!event) {
        return res.status(404).json({
          error: 'EVENT_NOT_FOUND',
          message: 'Event not found',
        });
      }

      const isHost =
        hostToken &&
        hostToken === event.hostToken;

      const isOwner =
        sessionToken &&
        sessionToken === photo.sessionToken;

      if (!isHost && !isOwner) {
        return res.status(403).json({
          error: 'FORBIDDEN',
          message: 'You do not have permission to delete this photo',
        });
      }

      await storage.deletePhoto(
        photo.cloudinaryPublicId || '',
        photo.cloudinaryThumbnailPublicId || ''
      );

      await db.deletePhoto(photoId);

      emitPhotoDeleted(eventId, photoId);

      const photos = await db.getPhotosByEventId(eventId);

      emitEventStats(eventId, {
        photoCount: photos.length,
      });

      return res.json({
        success: true,
      });

    } catch (err) {
      console.error(err);

      return res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: 'Failed to delete photo',
      });
    }
  }
);

export default router;