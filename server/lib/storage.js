import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';

class LocalStorage {
  constructor(uploadDir = 'public/uploads') {
    this.uploadDir = path.resolve(uploadDir); // always absolute
    this.publicRoot = path.resolve('public');  // Express static root
  }

  async init() {
    await fs.mkdir(this.uploadDir, { recursive: true });
  }

  /** Sanitize a filename for safe use in URLs */
  _sanitize(name) {
    return name
      .replace(/[^\w.\-]/g, '_') // replace spaces & special chars with _
      .replace(/_+/g, '_');       // collapse multiple underscores
  }

  /** Convert an absolute disk path to a public URL */
  _toUrl(absolutePath) {
    // Get path relative to the public/ root, then prefix with /
    const rel = path.relative(this.publicRoot, absolutePath);
    return '/' + rel.replace(/\\/g, '/');
  }

  async save({ buffer, thumbnail, fileName, mimeType, eventId }) {
    const eventDir = path.join(this.uploadDir, eventId);
    await fs.mkdir(eventDir, { recursive: true });

    const timestamp = Date.now();
    const ext = path.extname(fileName);
    const baseName = this._sanitize(path.basename(fileName, ext));
    const uniqueFileName = `${baseName}_${timestamp}${ext}`;

    const storagePath = path.join(eventDir, uniqueFileName);
    await fs.writeFile(storagePath, buffer);
    const publicUrl = this._toUrl(storagePath);

    let thumbnailUrl = publicUrl;
    let thumbnailPath = storagePath;

    if (thumbnail) {
      const thumbnailFileName = `${baseName}_${timestamp}_thumb.jpg`;
      thumbnailPath = path.join(eventDir, thumbnailFileName);
      await fs.writeFile(thumbnailPath, thumbnail);
      thumbnailUrl = this._toUrl(thumbnailPath);
    }

    return { publicUrl, thumbnailUrl, storagePath, thumbnailPath };
  }

  async delete(storagePath, thumbnailPath) {
    try {
      await fs.unlink(storagePath);
      if (thumbnailPath && thumbnailPath !== storagePath) {
        await fs.unlink(thumbnailPath).catch(err =>
          console.error(`Error deleting thumbnail ${thumbnailPath}:`, err)
        );
      }
    } catch (err) {
      console.error(`Error deleting file ${storagePath}:`, err);
    }
  }

  async getStream(storagePath) {
    return createReadStream(storagePath);
  }
}

export default LocalStorage;