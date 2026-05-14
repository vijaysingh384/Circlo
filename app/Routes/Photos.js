import { Router } from 'express';
import { randomUUID } from 'crypto';
import { upload } from '../middleware/upload.js';
import { validateUpload, validateUserName } from '../middleware/validation.js';
import { emitPhotoUploaded, emitPhotoDeleted, emitEventStats } from '../lib/socket.js';

const router = Router();
const UPLOAD_LIMIT = 20;
// GET /api/events/:eventId/photos - List all photos for an event
router.get('/events/:eventId/photos', async (req, res) => {
    const db = req.app.locals.db;
    const { eventId } = req.params;
    try {
        // Verify event exists
        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'EVENT_NOT_FOUND',
                message: 'Event not found',
            });
        }
        const photos = await db.getPhotosByEventId(eventId);
        // Map to PhotoPublic shape (exclude internal fields)
        const publicPhotos = photos.map((photo) => ({
            photoId: photo.photoId,
            eventId: photo.eventId,
            fileName: photo.fileName,
            fileSize: photo.fileSize,
            uploadedByName: photo.uploadedByName,
            sessionToken: photo.sessionToken,
            publicUrl: photo.publicUrl,
            uploadedAt: photo.uploadedAt,
        }));
        return res.json({ photos: publicPhotos });
    }
    catch (err) {
        console.error('Error fetching photos:', err);
        return res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: 'Failed to fetch photos',
        });
    }
});
// POST /api/events/:eventId/photos - Upload a photo
router.post('/events/:eventId/photos', upload.single('photo'), validateUpload, async (req, res) => {
    const db = req.app.locals.db;
    const storage = req.app.locals.storage;
    const { eventId } = req.params;
    const sessionToken = req.headers['x-session-token'];
    const uploadedByName = req.body.uploadedByName || 'Anonymous';

    // Validate session token
    if (!sessionToken) {
        return res.status(400).json({
            error: 'MISSING_SESSION_TOKEN',
            message: 'x-session-token header is required',
        });
    }

    // Validate user name
    const nameValidation = validateUserName(uploadedByName);
    if (!nameValidation.valid) {
        return res.status(400).json({
            error: 'INVALID_USER_NAME',
            message: nameValidation.error,
        });
    }

    if (!req.file) {
        return res.status(400).json({
            error: 'NO_FILE',
            message: 'No file uploaded',
        });
    }
    try {
        // Verify event exists
        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'EVENT_NOT_FOUND',
                message: 'Event not found',
            });
        }
        // Check upload limit
        const count = await db.countPhotosBySessionToken(eventId, sessionToken);
        if (count >= UPLOAD_LIMIT) {
            return res.status(403).json({
                error: 'UPLOAD_LIMIT_EXCEEDED',
                message: `Maximum ${UPLOAD_LIMIT} photos per session`,
            });
        }
        // Save file to storage
        const { publicUrl, storagePath } = await storage.save({
            buffer: req.file.buffer,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            eventId,
        });
        // Persist photo record
        const photoId = randomUUID();
        const photo = await db.createPhoto({
            photoId,
            eventId,
            storagePath,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            uploadedByName,
            sessionToken,
            storageProvider: process.env.R2_BUCKET ? 'r2' : 'local',
            publicUrl,
            uploadedAt: new Date().toISOString(),
        });
        // Return PhotoPublic shape
        const publicPhoto = {
            photoId: photo.photoId,
            eventId: photo.eventId,
            fileName: photo.fileName,
            fileSize: photo.fileSize,
            uploadedByName: photo.uploadedByName,
            sessionToken: photo.sessionToken,
            publicUrl: photo.publicUrl,
            uploadedAt: photo.uploadedAt,
        };

        // Emit socket event for real-time update
        emitPhotoUploaded(eventId, publicPhoto);

        // Get updated photo count and emit stats
        const allPhotos = await db.getPhotosByEventId(eventId);
        emitEventStats(eventId, { photoCount: allPhotos.length });

        return res.status(201).json(publicPhoto);
    }
    catch (err) {
        console.error('Error uploading photo:', err);
        return res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: 'Failed to upload photo',
        });
    }
});
// DELETE /api/events/:eventId/photos/:photoId - Delete a photo
router.delete('/events/:eventId/photos/:photoId', async (req, res) => {
    const db = req.app.locals.db;
    const storage = req.app.locals.storage;
    const { eventId, photoId } = req.params;
    const sessionToken = req.headers['x-session-token'];
    const hostToken = req.headers['x-host-token'];
    try {
        // Fetch photo
        const photo = await db.getPhotoById(photoId);
        if (!photo) {
            return res.status(404).json({
                error: 'PHOTO_NOT_FOUND',
                message: 'Photo not found',
            });
        }
        // Verify photo belongs to this event
        if (photo.eventId !== eventId) {
            return res.status(404).json({
                error: 'PHOTO_NOT_FOUND',
                message: 'Photo not found in this event',
            });
        }
        // Fetch event to check host token
        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'EVENT_NOT_FOUND',
                message: 'Event not found',
            });
        }
        // Authorization: allow if host token matches OR session token matches
        const isHost = hostToken && hostToken === event.hostToken;
        const isOwner = sessionToken && sessionToken === photo.sessionToken;
        if (!isHost && !isOwner) {
            return res.status(403).json({
                error: 'FORBIDDEN',
                message: 'You do not have permission to delete this photo',
            });
        }
        // Delete from storage
        await storage.delete(photo.storagePath);
        // Delete from database
        await db.deletePhoto(photoId);

        // Emit socket event for real-time update
        emitPhotoDeleted(eventId, photoId);

        // Get updated photo count and emit stats
        const allPhotos = await db.getPhotosByEventId(eventId);
        emitEventStats(eventId, { photoCount: allPhotos.length });

        return res.status(200).json({ success: true });
    }
    catch (err) {
        console.error('Error deleting photo:', err);
        return res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: 'Failed to delete photo',
        });
    }
});
export default router;
//# sourceMappingURL=photos.js.map