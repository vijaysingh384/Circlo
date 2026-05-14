import sharp from 'sharp';

const IMAGE_CONFIG = {
  full: { maxWidth: 1920, maxHeight: 1920, quality: 85 },
  thumbnail: { width: 400, height: 400, quality: 80, fit: 'cover' },
};

export async function optimizeImage(req, res, next) {
  if (!req.file) return next();

  try {
    const originalBuffer = req.file.buffer;
    const originalSize = req.file.size;

    const metadata = await sharp(originalBuffer).metadata();
    const isTransparent = metadata.hasAlpha;
    const outputFormat = isTransparent ? 'png' : 'jpeg';

    // --- Full-size optimized image ---
    let fullPipeline = sharp(originalBuffer).resize(
      IMAGE_CONFIG.full.maxWidth,
      IMAGE_CONFIG.full.maxHeight,
      { fit: 'inside', withoutEnlargement: true }
    );
    fullPipeline = outputFormat === 'jpeg'
      ? fullPipeline.jpeg({ quality: IMAGE_CONFIG.full.quality, progressive: true, mozjpeg: true })
      : fullPipeline.png({ quality: IMAGE_CONFIG.full.quality, compressionLevel: 9 });

    const fullBuffer = await fullPipeline.toBuffer();

    // --- Thumbnail: reuse the already-decoded full buffer, not the raw upload ---
    const thumbnailBuffer = await sharp(fullBuffer)
      .resize(IMAGE_CONFIG.thumbnail.width, IMAGE_CONFIG.thumbnail.height, {
        fit: IMAGE_CONFIG.thumbnail.fit,
        position: 'center',
      })
      .jpeg({ quality: IMAGE_CONFIG.thumbnail.quality, progressive: true })
      .toBuffer();

    // Update filename extension if format changed
    const originalExt = req.file.originalname.split('.').pop().toLowerCase();
    const newExt = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
    if (originalExt !== newExt) {
      req.file.originalname = req.file.originalname.replace(/\.[^.]+$/, `.${newExt}`);
      req.file.mimetype = `image/${outputFormat}`;
    }

    req.file.buffer = fullBuffer;
    req.file.size = fullBuffer.length;
    req.file.thumbnail = thumbnailBuffer;
    req.file.thumbnailSize = thumbnailBuffer.length;

    const optimizedMetadata = await sharp(fullBuffer).metadata();
    req.file.optimization = {
      originalSize,
      optimizedSize: fullBuffer.length,
      thumbnailSize: thumbnailBuffer.length,
      compressionRatio: ((1 - fullBuffer.length / originalSize) * 100).toFixed(1),
      originalDimensions: `${metadata.width}x${metadata.height}`,
      optimizedDimensions: `${optimizedMetadata.width}x${optimizedMetadata.height}`,
    };

    console.log(`Image optimized: ${req.file.originalname}`);
    console.log(`  Original:  ${(originalSize / 1024).toFixed(1)}KB (${metadata.width}x${metadata.height})`);
    console.log(`  Optimized: ${(fullBuffer.length / 1024).toFixed(1)}KB (${optimizedMetadata.width}x${optimizedMetadata.height})`);
    console.log(`  Thumbnail: ${(thumbnailBuffer.length / 1024).toFixed(1)}KB (400x400)`);
    console.log(`  Saved: ${req.file.optimization.compressionRatio}%`);

    next();
  } catch (err) {
    console.error('Image optimization error:', err);
    return res.status(400).json({
      error: 'IMAGE_OPTIMIZATION_FAILED',
      message: 'Failed to process image',
    });
  }
}