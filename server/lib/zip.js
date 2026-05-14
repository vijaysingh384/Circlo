import { ZipArchive } from 'archiver';

/**
 * Stream a ZIP file containing photos to the response
 * @param {Object} res - Express response object
 * @param {string} eventName - Name of the event (used for ZIP filename)
 * @param {Array} photos - Array of photo objects with publicUrl and fileName
 * @param {Object} storage - Storage provider instance
 */
export async function streamZip(res, eventName, photos, storage) {
  // Set response headers
  const zipFileName = `${eventName.replace(/[^a-z0-9]/gi, '_')}_photos.zip`;
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

  // Create archiver instance
  const archive = new ZipArchive({
    zlib: { level: 6 } // Compression level
  });

  // Handle archiver errors
  archive.on('error', (err) => {
    console.error('Archiver error:', err);
    throw err;
  });

  // Pipe archive to response
  archive.pipe(res);

  // Add each photo to the archive
  for (const photo of photos) {
    try {
      if (storage && typeof storage.getStream === 'function') {
        // If storage provider has a getStream method, use it
        const stream = await storage.getStream(photo.storagePath);
        archive.append(stream, { name: photo.fileName });
      } else if (photo.publicUrl) {
        // Fallback: fetch from public URL
        const response = await fetch(photo.publicUrl);
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          archive.append(buffer, { name: photo.fileName });
        }
      }
    } catch (err) {
      console.error(`Error adding photo ${photo.fileName} to ZIP:`, err);
      // Continue with other photos
    }
  }

  // Finalize the archive
  await archive.finalize();
}
