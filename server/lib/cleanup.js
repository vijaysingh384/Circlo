import fs from 'fs/promises';
import path from 'path';

/**
 * Cleanup service for automatically deleting old photos
 */
export class CleanupService {
  constructor(db, storage) {
    this.db = db;
    this.storage = storage;
    this.cleanupInterval = null;
    this.photoLifetimeMs = 60 * 60 * 1000; // 1 hour in milliseconds
  }

  /**
   * Start the cleanup service
   * Runs every 10 minutes to check for expired photos
   */
  start() {
    console.log('🧹 Cleanup service started - Photos will be deleted after 1 hour');
    
    // Run immediately on start
    this.cleanupExpiredPhotos();
    
    // Then run every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredPhotos();
    }, 10 * 60 * 1000); // 10 minutes
  }

  /**
   * Stop the cleanup service
   */
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('🧹 Cleanup service stopped');
    }
  }

  /**
   * Find and delete photos older than 1 hour
   */
  async cleanupExpiredPhotos() {
    try {
      const now = new Date();
      const expirationTime = new Date(now.getTime() - this.photoLifetimeMs);
      
      console.log(`🧹 Running cleanup check at ${now.toISOString()}`);
      console.log(`🧹 Deleting photos uploaded before ${expirationTime.toISOString()}`);

      // Get all photos from database
      const allPhotos = await this.db.getAllPhotos();
      
      let deletedCount = 0;
      let errorCount = 0;

      for (const photo of allPhotos) {
        const uploadedAt = new Date(photo.uploadedAt);
        
        // Check if photo is older than 1 hour
        if (uploadedAt < expirationTime) {
          try {
            // Delete from storage (Cloudinary or local)
            if (photo.storageProvider === 'cloudinary') {
              await this.storage.deletePhoto(photo.cloudinaryPublicId, photo.cloudinaryThumbnailPublicId);
            } else {
              // Fallback for local storage
              await this.storage.delete(photo.storagePath, photo.thumbnailPath);
            }
            
            // Delete from database
            await this.db.deletePhoto(photo.photoId);
            
            deletedCount++;
            console.log(`🗑️  Deleted expired photo: ${photo.photoId} (uploaded at ${photo.uploadedAt})`);
          } catch (err) {
            errorCount++;
            console.error(`❌ Failed to delete photo ${photo.photoId}:`, err.message);
          }
        }
      }

      if (deletedCount > 0) {
        console.log(`✅ Cleanup complete: Deleted ${deletedCount} expired photo(s)`);
      } else {
        console.log(`✅ Cleanup complete: No expired photos found`);
      }

      if (errorCount > 0) {
        console.log(`⚠️  ${errorCount} photo(s) failed to delete`);
      }

      // Only cleanup empty directories if using local storage
      if (this.storage.constructor.name !== 'CloudinaryStorage') {
        await this.cleanupEmptyDirectories();
      }
      
    } catch (err) {
      console.error('❌ Cleanup service error:', err);
    }
  }

  /**
   * Remove empty event directories from uploads folder
   */
  async cleanupEmptyDirectories() {
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      const entries = await fs.readdir(uploadsDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== '.gitkeep') {
          const dirPath = path.join(uploadsDir, entry.name);
          const files = await fs.readdir(dirPath);
          
          // If directory is empty, delete it
          if (files.length === 0) {
            await fs.rmdir(dirPath);
            console.log(`🗑️  Deleted empty directory: ${entry.name}`);
          }
        }
      }
    } catch (err) {
      console.error('❌ Failed to cleanup empty directories:', err.message);
    }
  }

  /**
   * Get statistics about photos
   */
  async getStats() {
    try {
      const allPhotos = await this.db.getAllPhotos();
      const now = new Date();
      const expirationTime = new Date(now.getTime() - this.photoLifetimeMs);

      const stats = {
        total: allPhotos.length,
        expired: 0,
        active: 0,
        oldestPhoto: null,
        newestPhoto: null,
      };

      for (const photo of allPhotos) {
        const uploadedAt = new Date(photo.uploadedAt);
        
        if (uploadedAt < expirationTime) {
          stats.expired++;
        } else {
          stats.active++;
        }

        if (!stats.oldestPhoto || uploadedAt < new Date(stats.oldestPhoto)) {
          stats.oldestPhoto = photo.uploadedAt;
        }

        if (!stats.newestPhoto || uploadedAt > new Date(stats.newestPhoto)) {
          stats.newestPhoto = photo.uploadedAt;
        }
      }

      return stats;
    } catch (err) {
      console.error('❌ Failed to get cleanup stats:', err);
      return null;
    }
  }
}
