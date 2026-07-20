import multer from 'multer';
import type { Request } from 'express';
import { VALIDATION_CONFIG } from './validation';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
 
  if (VALIDATION_CONFIG.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed.'));
  }
};


export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: VALIDATION_CONFIG.MAX_FILE_SIZE,
  },
});