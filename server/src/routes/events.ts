import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { streamZip } from '../services/zip.js';
import { validateEventName } from '../middleware/validation.js';
import type Database from '../services/database.js';
import type CloudinaryStorage from '../services/cloudinaryStorage.js';


const router = Router();

// POST /api/events - Create a new event
router.post('/events', async (req: Request, res: Response) => {
    const db = req.app.locals.db as Database;
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
            name,
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
router.get('/events/join/:joinCode', async (req: Request, res: Response) => {
    const db = req.app.locals.db as Database;
    const joinCode = req.params.joinCode as string;
    
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
router.get('/events/:eventId', async (req: Request, res: Response) => {
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
router.get('/events/:eventId/download', async (req: Request, res: Response) => {
    const db = req.app.locals.db as Database;
    const storage = req.app.locals.storage as CloudinaryStorage;
    const { eventId } = req.body;    
    try {
        const event = await db.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                error: 'EVENT_NOT_FOUND',
                message: 'Event not found',
            });
        }
        const photos = await db.getPhotosByEventId(eventId);
        await streamZip(res, event.name, photos);
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



export default router;