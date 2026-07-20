import type Database from "./database.js";
import type CloudinaryStorage from "./cloudinaryStorage.js";

export class CleanupService {
  private db: Database;
  private storage: CloudinaryStorage;
  private cleanupInterval: NodeJS.Timeout | null = null;

  // Delete photos after 1 hour
  private photoLifetime = 60 * 60 * 1000;

  constructor(db: Database, storage: CloudinaryStorage) {
    this.db = db;
    this.storage = storage;
  }

  // Start cleanup service
  start() {
    console.log("Cleanup service started");

    // Run immediately
    this.cleanupExpiredPhotos();

    // Run every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredPhotos();
    }, 10 * 60 * 1000);
  }

  // Stop cleanup service
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log("Cleanup service stopped");
    }
  }

  // Delete expired photos
  async cleanupExpiredPhotos() {
    try {
      const photos = await this.db.getAllPhotos();

      const expirationTime = Date.now() - this.photoLifetime;

      for (const photo of photos) {
        const uploadedTime = new Date(photo.uploadedAt).getTime();

        if (uploadedTime < expirationTime) {
          // Delete image from Cloudinary
          await this.storage.deletePhoto(
            photo.cloudinaryPublicId || "",
            photo.cloudinaryThumbnailPublicId || ""
          );

          // Delete record from database
          await this.db.deletePhoto(photo.photoId);

          console.log(`Deleted photo: ${photo.photoId}`);
        }
      }
    } catch (err) {
      console.error("Cleanup failed:", err);
    }
  }
}