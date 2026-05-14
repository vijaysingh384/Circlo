import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

/**
 * Cloudinary Storage Service
 * Handles photo uploads, thumbnail generation, and deletion
 */
class CloudinaryStorage {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    this.cloudinary = cloudinary;
    this.initialized = false;
  }

  /**
   * Initialize storage (check configuration)
   */
  async init() {
    try {
      // Verify Cloudinary configuration
      if (!process.env.CLOUDINARY_CLOUD_NAME || 
          !process.env.CLOUDINARY_API_KEY || 
          !process.env.CLOUDINARY_API_SECRET) {
        throw new Error('Cloudinary credentials not configured');
      }

      // Test connection by pinging Cloudinary
      await this.cloudinary.api.ping();
      
      this.initialized = true;
      console.log('✅ Cloudinary storage initialized');
      console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    } catch (err) {
      console.error('❌ Cloudinary initialization failed:', err.message);
      throw err;
    }
  }

  /**
   * Upload photo and generate thumbnail
   * @param {Buffer} buffer - Image buffer
   * @param {string} eventId - Event ID for folder organization
   * @param {string} filename - Original filename
   * @returns {Promise<{publicUrl: string, thumbnailUrl: string, publicId: string, thumbnailPublicId: string}>}
   */
  async uploadPhoto(buffer, eventId, filename) {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const baseFilename = sanitizedFilename.replace(/\.[^/.]+$/, '');
      
      // Folder structure: circlo/events/{eventId}/
      const folder = `circlo/events/${eventId}`;

      // 1. Optimize full-size image
      const optimizedBuffer = await sharp(buffer)
        .resize(1920, 1920, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();

      // 2. Upload full-size image to Cloudinary
      const fullImageResult = await new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: `${baseFilename}_${timestamp}`,
            resource_type: 'image',
            format: 'jpg',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(optimizedBuffer);
      });

      // 3. Generate thumbnail
      const thumbnailBuffer = await sharp(buffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center',
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      // 4. Upload thumbnail to Cloudinary
      const thumbnailResult = await new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: folder,
            public_id: `${baseFilename}_${timestamp}_thumb`,
            resource_type: 'image',
            format: 'jpg',
            transformation: [
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(thumbnailBuffer);
      });

      return {
        publicUrl: fullImageResult.secure_url,
        thumbnailUrl: thumbnailResult.secure_url,
        publicId: fullImageResult.public_id,
        thumbnailPublicId: thumbnailResult.public_id,
        width: fullImageResult.width,
        height: fullImageResult.height,
        format: fullImageResult.format,
        bytes: fullImageResult.bytes,
      };
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw new Error(`Failed to upload to Cloudinary: ${err.message}`);
    }
  }

  /**
   * Delete photo and thumbnail from Cloudinary
   * @param {string} publicId - Cloudinary public ID of the full image
   * @param {string} thumbnailPublicId - Cloudinary public ID of the thumbnail
   */
  async deletePhoto(publicId, thumbnailPublicId) {
    try {
      const deletePromises = [];

      // Delete full-size image
      if (publicId) {
        deletePromises.push(
          this.cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
        );
      }

      // Delete thumbnail
      if (thumbnailPublicId) {
        deletePromises.push(
          this.cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: 'image' })
        );
      }

      await Promise.all(deletePromises);
      console.log(`✅ Deleted from Cloudinary: ${publicId}`);
    } catch (err) {
      console.error('Cloudinary delete error:', err);
      // Don't throw - deletion failures shouldn't break the app
    }
  }

  /**
   * Delete all photos for an event
   * @param {string} eventId - Event ID
   */
  async deleteEventPhotos(eventId) {
    try {
      const folder = `circlo/events/${eventId}`;
      
      // Delete all resources in the folder
      await this.cloudinary.api.delete_resources_by_prefix(folder, {
        resource_type: 'image'
      });

      // Delete the folder itself
      await this.cloudinary.api.delete_folder(folder);
      
      console.log(`✅ Deleted all photos for event: ${eventId}`);
    } catch (err) {
      console.error('Cloudinary delete event photos error:', err);
      // Don't throw - deletion failures shouldn't break the app
    }
  }

  /**
   * Get storage info
   */
  async getStorageInfo() {
    try {
      const usage = await this.cloudinary.api.usage();
      return {
        used: usage.resources,
        limit: usage.limit,
        percentage: (usage.resources / usage.limit) * 100,
      };
    } catch (err) {
      console.error('Failed to get storage info:', err);
      return null;
    }
  }

  /**
   * Check if storage is initialized
   */
  isInitialized() {
    return this.initialized;
  }
}

export default CloudinaryStorage;
