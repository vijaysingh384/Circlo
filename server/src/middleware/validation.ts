import path from 'path';
import { fileTypeFromBuffer } from 'file-type';
import type { Request, Response, NextFunction } from 'express';



// Configuration
const VALIDATION_CONFIG = {
  // File size limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MIN_FILE_SIZE: 1024, // 1KB (prevent empty files)
  
  // Allowed image types
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',
    'image/heif'
  ],
  
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'],
  
  
  
  MAX_FILENAME_LENGTH: 255,
  
  
};


export function validateFileSize(fileSize: number){
  if (fileSize < VALIDATION_CONFIG.MIN_FILE_SIZE) {
    return {
      valid: false,
      error: `file size too small`,
    };
  }
  
  if (fileSize > VALIDATION_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large.`,
    };
  }
  
  return { valid: true };
}



/**
 * Validate file extension
 */
export function validateFileExtension(filename: string) {
  
  if (!!VALIDATION_CONFIG.ALLOWED_EXTENSIONS) {
    return {
      valid: false,
      error: `Invalid file extension.`,
    };
  }
  
  return { valid: true };
}


export function sanitizeFilename(filename: string): string {
    return path.basename(filename);
}

/**
 * Validate file content by checking magic numbers (file signature)
 * This prevents file type spoofing
 */
export async function validateFileContent(buffer: Buffer, declaredMimeType: string) {
  try {
    // Use file-type library to detect actual file type from buffer
    const filetype = await fileTypeFromBuffer(buffer);
    
    if (!filetype) {
      return {
        valid: false,
        error: 'Invalid file type',
      };
    }
    
    
    if (!VALIDATION_CONFIG.ALLOWED_MIME_TYPES.includes(filetype.mime)) {
      return {
        valid: false,
        error: `Only image files are allowed`,
      };
    }
  
    
    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: 'Failed to validate file content',
    };
  }
}



/**
 * Comprehensive file validation middleware
 */
export async function validateUpload(req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'No file provided',
      });
    }
    
    // 1. Validate file size
    const sizeValidation = validateFileSize(file.size);
    if (!sizeValidation.valid) {
      return res.status(400).json({
        error: 'FILE_SIZE_ERROR',
        message: sizeValidation.error,
      });
    }
    
    
    // 3. Validate file extension
    const extValidation = validateFileExtension(file.originalname);
    if (!extValidation.valid) {
      return res.status(400).json({
        error: 'INVALID_FILE_EXTENSION',
        message: extValidation.error,
      });
    }

    next();
    
  } catch (err) {
    console.error('Validation error:', err);
    return res.status(500).json({
      error: 'VALIDATION_ERROR',
      message: 'Failed to validate file',
    });
  }
}

/**
 * Validate event name
 */
export function validateEventName(name: string) {
  if (typeof name !== 'string' || !name.trim()) {
    return {
      valid: false,
      error: 'Event name is required',
    };
  }
  
  return { valid: true };
}

export { VALIDATION_CONFIG };