import path from 'path';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Comprehensive validation middleware for file uploads
 */

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
  
  // Magic number signatures for image validation
  MAGIC_NUMBERS: {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'image/gif': [0x47, 0x49, 0x46],
    'image/webp': [0x52, 0x49, 0x46, 0x46],
  },
  
  // Filename restrictions
  MAX_FILENAME_LENGTH: 255,
  FORBIDDEN_CHARS: /[<>:"|?*\x00-\x1f]/g,
  
  // Upload limits per session
  MAX_UPLOADS_PER_SESSION: 100,
};

/**
 * Validate file size
 */
export function validateFileSize(fileSize) {
  if (!fileSize || fileSize < VALIDATION_CONFIG.MIN_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too small. Minimum size is ${VALIDATION_CONFIG.MIN_FILE_SIZE / 1024}KB`,
    };
  }
  
  if (fileSize > VALIDATION_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${VALIDATION_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate MIME type
 */
export function validateMimeType(mimetype) {
  if (!mimetype || !VALIDATION_CONFIG.ALLOWED_MIME_TYPES.includes(mimetype.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${VALIDATION_CONFIG.ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }
  
  return { valid: true };
}

/**
 * Validate file extension
 */
export function validateFileExtension(filename) {
  const ext = path.extname(filename).toLowerCase();
  
  if (!ext || !VALIDATION_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed extensions: ${VALIDATION_CONFIG.ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }
  
  return { valid: true };
}

/**
 * Sanitize filename - remove dangerous characters
 */
export function sanitizeFilename(filename) {
  // Remove path traversal attempts
  let sanitized = path.basename(filename);
  
  // Remove forbidden characters
  sanitized = sanitized.replace(VALIDATION_CONFIG.FORBIDDEN_CHARS, '_');
  
  // Remove multiple dots (except the extension)
  const ext = path.extname(sanitized);
  const name = path.basename(sanitized, ext);
  sanitized = name.replace(/\.+/g, '_') + ext;
  
  // Limit filename length
  if (sanitized.length > VALIDATION_CONFIG.MAX_FILENAME_LENGTH) {
    const extLength = ext.length;
    const maxNameLength = VALIDATION_CONFIG.MAX_FILENAME_LENGTH - extLength;
    sanitized = sanitized.substring(0, maxNameLength) + ext;
  }
  
  // Ensure filename is not empty
  if (!sanitized || sanitized === ext) {
    sanitized = `upload_${Date.now()}${ext}`;
  }
  
  return sanitized;
}

/**
 * Validate file content by checking magic numbers (file signature)
 * This prevents file type spoofing
 */
export async function validateFileContent(buffer, declaredMimeType) {
  try {
    // Use file-type library to detect actual file type from buffer
    const detectedType = await fileTypeFromBuffer(buffer);
    
    if (!detectedType) {
      return {
        valid: false,
        error: 'Unable to determine file type. File may be corrupted or invalid.',
      };
    }
    
    // Check if detected type matches declared type
    const detectedMime = detectedType.mime;
    
    if (!VALIDATION_CONFIG.ALLOWED_MIME_TYPES.includes(detectedMime)) {
      return {
        valid: false,
        error: `File content does not match an allowed image type. Detected: ${detectedMime}`,
      };
    }
    
    // Verify declared type matches detected type (prevent spoofing)
    if (declaredMimeType && !detectedMime.startsWith(declaredMimeType.split('/')[0])) {
      return {
        valid: false,
        error: `File type mismatch. Declared: ${declaredMimeType}, Detected: ${detectedMime}`,
      };
    }
    
    return { valid: true, detectedType: detectedMime };
  } catch (err) {
    return {
      valid: false,
      error: 'Failed to validate file content',
    };
  }
}

/**
 * Check for malicious patterns in filename
 */
export function checkMaliciousFilename(filename) {
  const maliciousPatterns = [
    /\.\.[\\/]/,           // Path traversal
    /^[\/\\]/,             // Absolute paths
    /\0/,                  // Null bytes
    /[<>]/,                // HTML/XML tags
    /\$\{/,                // Template injection
    /%00/,                 // URL encoded null
    /\.php$/i,             // PHP files
    /\.exe$/i,             // Executables
    /\.sh$/i,              // Shell scripts
    /\.bat$/i,             // Batch files
    /\.cmd$/i,             // Command files
  ];
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(filename)) {
      return {
        valid: false,
        error: 'Filename contains potentially malicious patterns',
      };
    }
  }
  
  return { valid: true };
}

/**
 * Comprehensive file validation middleware
 */
export async function validateUpload(req, res, next) {
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
    
    // 2. Validate MIME type
    const mimeValidation = validateMimeType(file.mimetype);
    if (!mimeValidation.valid) {
      return res.status(400).json({
        error: 'INVALID_FILE_TYPE',
        message: mimeValidation.error,
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
    
    // 4. Check for malicious filename patterns
    const maliciousCheck = checkMaliciousFilename(file.originalname);
    if (!maliciousCheck.valid) {
      return res.status(400).json({
        error: 'MALICIOUS_FILENAME',
        message: maliciousCheck.error,
      });
    }
    
    // 5. Validate file content (magic numbers)
    const contentValidation = await validateFileContent(file.buffer, file.mimetype);
    if (!contentValidation.valid) {
      return res.status(400).json({
        error: 'INVALID_FILE_CONTENT',
        message: contentValidation.error,
      });
    }
    
    // 6. Sanitize filename
    file.originalname = sanitizeFilename(file.originalname);
    
    // 7. Update mimetype to detected type (prevent spoofing)
    if (contentValidation.detectedType) {
      file.mimetype = contentValidation.detectedType;
    }
    
    // All validations passed
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
export function validateEventName(name) {
  if (!name || typeof name !== 'string') {
    return {
      valid: false,
      error: 'Event name is required',
    };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'Event name cannot be empty',
    };
  }
  
  if (trimmed.length > 100) {
    return {
      valid: false,
      error: 'Event name is too long (max 100 characters)',
    };
  }
  
  // Check for malicious patterns
  if (/<script|javascript:|onerror=/i.test(trimmed)) {
    return {
      valid: false,
      error: 'Event name contains invalid characters',
    };
  }
  
  return { valid: true, sanitized: trimmed };
}

/**
 * Validate user name
 */
export function validateUserName(name) {
  if (!name || typeof name !== 'string') {
    return {
      valid: false,
      error: 'User name is required',
    };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: 'User name cannot be empty',
    };
  }
  
  if (trimmed.length > 50) {
    return {
      valid: false,
      error: 'User name is too long (max 50 characters)',
    };
  }
  
  // Check for malicious patterns
  if (/<script|javascript:|onerror=/i.test(trimmed)) {
    return {
      valid: false,
      error: 'User name contains invalid characters',
    };
  }
  
  return { valid: true, sanitized: trimmed };
}

export { VALIDATION_CONFIG };