import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  photoId: {
    type: String,
    required: true,
    unique: true,
  },
  eventId: {
    type: String,
    required: true,
    index: true,
  },
  storagePath: {
    type: String,
    required: true,
  },
  thumbnailPath: {
    type: String,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  uploadedByName: {
    type: String,
    required: true,
  },
  sessionToken: {
    type: String,
    required: true,
    index: true,
  },
  storageProvider: {
    type: String,
    enum: ['local', 'r2'],
    default: 'local',
  },
  publicUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
  },
  uploadedAt: {
    type: String,
    required: true,
  },
});

// Compound index for efficient queries
PhotoSchema.index({ eventId: 1, sessionToken: 1 });

export default mongoose.model('Photo', PhotoSchema);
