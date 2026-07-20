import { Request } from 'express';
import Database from '../services/database';
import CloudinaryStorage from '../services/cloudinaryStorage';
import { Server as SocketServer } from 'socket.io';

// ============================================
// DOMAIN TYPES
// ============================================

export interface Event {
  eventId: string;
  name: string;
  joinCode: string;
  hostToken: string;
  createdAt: string;
}

export interface Photo {
  photoId: string;
  eventId: string;
  storagePath: string;
  thumbnailPath?: string;
  fileName: string;
  fileSize: number;
  uploadedByName: string;
  sessionToken: string;
  storageProvider: 'local' | 'cloudinary' | 'r2';
  cloudinaryPublicId?: string;
  cloudinaryThumbnailPublicId?: string;
  publicUrl: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

export interface PhotoPublic {
  photoId: string;
  eventId: string;
  fileName: string;
  fileSize: number;
  uploadedByName: string;
  sessionToken: string;
  publicUrl: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

// ============================================
// REQUEST/RESPONSE TYPES
// ============================================

export interface CreateEventRequest {
  name: string;
  joinCode: string;
}

export interface CreateEventResponse {
  eventId: string;
  joinCode: string;
  name: string;
  createdAt: string;
}

export interface UploadPhotoRequest {
  uploadedByName?: string;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
  detectedType?: string;
}

// ============================================
// EXPRESS EXTENDED TYPES
// ============================================

export interface MulterFile extends Express.Multer.File {
  thumbnail?: Buffer;
  thumbnailSize?: number;
}

export interface AppLocals {
  db: Database;
  storage: CloudinaryStorage;
  io: SocketServer;
}

export interface RequestWithLocals extends Request {
  app: Request['app'] & {
    locals: AppLocals;
  };
  file?: MulterFile;
}

// ============================================
// SOCKET TYPES
// ============================================

export interface SocketData {
  eventId?: string;
  userName?: string;
}

export interface JoinEventPayload {
  eventId: string;
  userName?: string;
}

export interface LeaveEventPayload {
  eventId: string;
}

export interface UploadStartedPayload {
  eventId: string;
  userName: string;
  fileCount: number;
}

// ============================================
// CONFIG TYPES
// ============================================

export interface ImageConfig {
  full: {
    maxWidth: number;
    maxHeight: number;
    quality: number;
  };
  thumbnail: {
    width: number;
    height: number;
    quality: number;
    fit: string;
  };
}

export interface ValidationConfig {
  MAX_FILE_SIZE: number;
  MIN_FILE_SIZE: number;
  ALLOWED_MIME_TYPES: string[];
  ALLOWED_EXTENSIONS: string[];
  MAGIC_NUMBERS: Record<string, number[]>;
  MAX_FILENAME_LENGTH: number;
  FORBIDDEN_CHARS: RegExp;
  MAX_UPLOADS_PER_SESSION: number;
}

// ============================================
// CLEANUP SERVICE TYPES
// ============================================

export interface CleanupStats {
  total: number;
  expired: number;
  active: number;
  oldestPhoto: string | null;
  newestPhoto: string | null;
}
