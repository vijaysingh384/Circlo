import { ZipArchive } from "archiver";
import type { Response } from "express";
import type { Photo } from "../types/index.js";

export async function streamZip(
  res: Response,
  eventName: string,
  photos: Photo[]
) {
  const fileName = `${eventName.replace(/[^a-zA-Z0-9]/g, "_")}.zip`;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}"`
  );

  const archive = new ZipArchive({
    zlib: { level: 6 },
  });

  archive.pipe(res);

  archive.on("error", (err) => {
    console.error(err);
  });

  for (const photo of photos) {
    try {
      const response = await fetch(photo.publicUrl);

      if (!response.ok) {
        continue;
      }

      const buffer = Buffer.from(
        await response.arrayBuffer()
      );

      archive.append(buffer, {
        name: photo.fileName,
      });

    } catch (err) {
      console.error("Failed to download image");
    }
  }

  await archive.finalize();
}