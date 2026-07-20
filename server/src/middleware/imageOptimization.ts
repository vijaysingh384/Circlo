import sharp from "sharp";
import { Request, Response, NextFunction } from "express";

export async function optimizeImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.file) {
    return next();
  }

  try {

    const optimizedImage = await sharp(req.file.buffer)
      .rotate()
      .resize(1920, 1920, {
        fit: "inside",
        withoutEnlargement: true
      })
      .jpeg({
        quality: 85
      })
      .toBuffer();

    req.file.buffer = optimizedImage;
    req.file.size = optimizedImage.length;
    req.file.mimetype = "image/jpeg";

    next();

  } catch (error) {

    return res.status(400).json({
      message: "Image processing failed."
    });

  }
}