import { v2 as cloudinary } from "cloudinary";

class CloudinaryStorage {
  private initialized = false;

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Initialize Cloudinary
  async init() {
    try {
      await cloudinary.api.ping();
      this.initialized = true;
      console.log("Cloudinary initialized");
    } catch (err) {
      console.error("Failed to initialize Cloudinary");
      throw err;
    }
  }

  // Upload Photo
  async uploadPhoto(
    buffer: Buffer,
    eventId: string,
    fileName: string
  ) {
    if (!this.initialized) {
      throw new Error("Cloudinary is not initialized");
    }

    const image = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `events/${eventId}`,
          public_id: Date.now() + "_" + fileName,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return {
      publicUrl: image.secure_url,
      thumbnailUrl: image.secure_url,
      publicId: image.public_id,
      thumbnailPublicId: image.public_id,
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes,
    };
  }

  // Delete Photo
  async deletePhoto(
    publicId: string,
    thumbnailPublicId: string
  ) {
    if (!this.initialized) {
      return;
    }

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    if (
      thumbnailPublicId &&
      thumbnailPublicId !== publicId
    ) {
      await cloudinary.uploader.destroy(thumbnailPublicId);
    }
  }

  // Check initialization
  isInitialized() {
    return this.initialized;
  }
}

export default CloudinaryStorage;