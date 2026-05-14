/**
 * Frontend validation utilities
 */

import type { ValidationResult, ValidationRules } from '../types';

export const VALIDATION_RULES: ValidationRules = {
  // File validation
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MIN_FILE_SIZE: 1024, // 1KB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.heic', '.heif'],
  MAX_FILES_PER_UPLOAD: 20,
  
  // Text validation
  MAX_EVENT_NAME_LENGTH: 100,
  MAX_USER_NAME_LENGTH: 50,
  MIN_NAME_LENGTH: 1,
};

/**
 * Validate file size
 */
export function validateFileSize(file: File): ValidationResult {
  if (file.size < VALIDATION_RULES.MIN_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" is too small. Minimum size is ${VALIDATION_RULES.MIN_FILE_SIZE / 1024}KB`,
    };
  }
  
  if (file.size > VALIDATION_RULES.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" is too large. Maximum size is ${VALIDATION_RULES.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate file type
 */
export function validateFileType(file: File): ValidationResult {
  // Check MIME type
  if (!VALIDATION_RULES.ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `File "${file.name}" has invalid type. Only images (JPEG, PNG, GIF, WebP) are allowed`,
    };
  }
  
  // Check file extension
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
  if (!extension || !VALIDATION_RULES.ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File "${file.name}" has invalid extension. Allowed: ${VALIDATION_RULES.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate multiple files
 */
export function validateFiles(files: File[]): ValidationResult {
  if (files.length === 0) {
    return {
      valid: false,
      error: 'No files selected',
    };
  }
  
  if (files.length > VALIDATION_RULES.MAX_FILES_PER_UPLOAD) {
    return {
      valid: false,
      error: `Too many files. Maximum ${VALIDATION_RULES.MAX_FILES_PER_UPLOAD} files per upload`,
    };
  }
  
  // Validate each file
  for (const file of files) {
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.valid) {
      return sizeValidation;
    }
    
    const typeValidation = validateFileType(file);
    if (!typeValidation.valid) {
      return typeValidation;
    }
  }
  
  return { valid: true };
}

/**
 * Validate event name
 */
export function validateEventName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'Event name is required',
    };
  }
  
  if (name.trim().length > VALIDATION_RULES.MAX_EVENT_NAME_LENGTH) {
    return {
      valid: false,
      error: `Event name is too long (max ${VALIDATION_RULES.MAX_EVENT_NAME_LENGTH} characters)`,
    };
  }
  
  // Check for malicious patterns
  if (/<script|javascript:|onerror=/i.test(name)) {
    return {
      valid: false,
      error: 'Event name contains invalid characters',
    };
  }
  
  return { valid: true };
}

/**
 * Validate user name
 */
export function validateUserName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: 'Your name is required',
    };
  }
  
  if (name.trim().length > VALIDATION_RULES.MAX_USER_NAME_LENGTH) {
    return {
      valid: false,
      error: `Name is too long (max ${VALIDATION_RULES.MAX_USER_NAME_LENGTH} characters)`,
    };
  }
  
  // Check for malicious patterns
  if (/<script|javascript:|onerror=/i.test(name)) {
    return {
      valid: false,
      error: 'Name contains invalid characters',
    };
  }
  
  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}
