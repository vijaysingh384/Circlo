import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';

/**
 * Local file storage provider
 */
class LocalStorage {
  constructor(uploadDir = 'public/uploads') {
    this.uploadDir = uploadDir;
  }

  async init() {
    // Ensure upload directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });
  }

  /**
   * Save a file to local storage
   * @param {Object} options
   * @param {Buffer} options.buffer - File buffer
   * @param {string} options.fileName - Original filename
   * @param {string} options.mimeType - MIME type
   * @param {string} options.eventId - Event ID
   * @returns {Promise<{publicUrl: string, storagePath: string}>}
   */
  async save({ buffer, fileName, mimeType, eventId }) {
    // Create event-specific directory
    const eventDir = path.join(this.uploadDir, eventId);
    await fs.mkdir(eventDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const uniqueFileName = `${baseName}_${timestamp}${ext}`;
    
    const storagePath = path.join(eventDir, uniqueFileName);
    
    // Write file
    await fs.writeFile(storagePath, buffer);

    // Generate public URL
    const publicUrl = `/${storagePath.replace(/\\/g, '/')}`;

    return {
      publicUrl,
      storagePath,
    };
  }

  /**
   * Delete a file from storage
   * @param {string} storagePath - Path to the file
   */
  async delete(storagePath) {
    try {
      await fs.unlink(storagePath);
    } catch (err) {
      console.error(`Error deleting file ${storagePath}:`, err);
    }
  }

  /**
   * Get a read stream for a file
   * @param {string} storagePath - Path to the file
   * @returns {ReadStream}
   */
  async getStream(storagePath) {
    return createReadStream(storagePath);
  }
}

export default LocalStorage;
