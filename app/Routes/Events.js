import { Router } from 'express';
import { randomUUID } from 'crypto';
import { streamZip } from '../lib/zip.js';
import { validateEventName } from '../middleware/validation.js';

const router = Router();
// POST /api/events - Create a new event
router.post('/events', async (req, res) => {
    const db = req.app.locals.db;
    const { name, joinCode } = req.body;
    
    // Validate event name
    const nameValidation = validateEventName(name);
    if (!nameValidation.valid) {
        return res.status(400).json({
            error: 'INVALID_EVENT_NAME',
            message: nameValidation.error,
        });
    }
    
    try {
        const eventId = randomUUID();
        const hostToken = randomUUID();
        const createdAt = new Date().toISOString();
        const event = await db.createEvent({
            eventId,
            name: nameValidation.sanitized,
            joinCode,
            hostToken,
            createdAt,
        });
        // Never expose hostToken in response
        return res.status(201).json({
            eventId: event.eventId,
            joinCode: event.joinCode,
            name: event.name,
            createdAt: event.createdAt,
        });
    }
    catch (err) {
        console.error('Error creating event:', err);
        return res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: 'Failed to create event',
        });
    }
});
// GET /api/events/join/:joinCode - Look up event by join code
router.get('/events/join/:joinCode', async (req, res) => {
    const db = req.app.locals.db;
    const { joinCode } = req.params;
    try {
        const event = await db.getEventByJoinCode(joinCode.toUpperCase());
        if (!event) {
            return res.status(404).json({
                error: 'JOIN_CODE_NOT_FOUND',
                message: 'No event found with that join code',
            });
        }
        return res.json({
            eventId: event.eventId,
            name: event.name,
        });
    }
    catch (err) {
        console.error('Error looking up join code:', err);
        return res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: 'Failed to look up event',
        });
    }
});
// GET /api/events/:eventId - Get event details
router.get('/events/:eventId', async (req, res) => {
    const db = req.app.locals.db;
    const { eventId } = req.params;
    try {
        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'EVENT_NOT_FOUND',
                message: 'Event not found',
            });
        }
        return res.json({
            eventId: event.eventId,
            name: event.name,
            joinCode: event.joinCode,
            createdAt: event.createdAt,
        });
    }
    catch (err) {
        console.error('Error fetching event:', err);
        return res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: 'Failed to fetch event',
        });
    }
});
// GET /api/events/:eventId/download - Download all photos as ZIP
router.get('/events/:eventId/download', async (req, res) => {
    const db = req.app.locals.db;
    const storage = req.app.locals.storage;
    const { eventId } = req.params;
    try {
        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'EVENT_NOT_FOUND',
                message: 'Event not found',
            });
        }
        const photos = await db.getPhotosByEventId(eventId);
        await streamZip(res, event.name, photos, storage);
    }
    catch (err) {
        console.error('Error streaming ZIP:', err);
        if (!res.headersSent) {
            return res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'Failed to generate ZIP archive',
            });
        }
    }
});
// POST /api/events/:eventId/download-selected - Download selected photos as ZIP
router.post('/events/:eventId/download-selected', async (req, res) => {
    const db = req.app.locals.db;
    const storage = req.app.locals.storage;
    const { eventId } = req.params;
    const { photoIds } = req.body;
    if (!Array.isArray(photoIds)) {
        return res.status(400).json({
            error: 'INVALID_REQUEST',
            message: 'photoIds must be an array',
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
        // Fetch each photo, skip IDs that don't exist or don't belong to this event
        const validPhotos = [];
        for (const photoId of photoIds) {
            const photo = await db.getPhotoById(photoId);
            if (photo && photo.eventId === eventId) {
                validPhotos.push(photo);
            }
        }
        await streamZip(res, event.name, validPhotos, storage);
    }
    catch (err) {
        console.error('Error streaming selected ZIP:', err);
        if (!res.headersSent) {
            return res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'Failed to generate ZIP archive',
            });
        }
    }
});
export default router;
//# sourceMappingURL=events.js.map