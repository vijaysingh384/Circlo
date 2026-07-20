// Domain types

export interface Event {
  eventId: string;
  name: string;
  joinCode: string;
  createdAt: string;
}

export interface Photo {
  photoId: string;
  eventId: string;
  fileName: string;
  fileSize: number;
  uploadedByName: string;
  sessionToken: string;
  publicUrl: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}

// API request types

export interface CreateEventRequest {
  name: string;
  joinCode: string;
}

export interface UploadPhotoRequest {
  photo: File;
  uploadedByName: string;
  sessionToken: string;
}

// API response types

export interface CreateEventResponse {
  eventId: string;
  joinCode: string;
  name: string;
  createdAt: string;
}

export interface JoinEventResponse {
  eventId: string;
  name: string;
}

export interface GetEventResponse {
  eventId: string;
  name: string;
  joinCode: string;
  createdAt: string;
}

export interface GetPhotosResponse {
  photos: Photo[];
}

export interface UploadPhotoResponse extends Photo {}

export interface DeletePhotoResponse {
  success: boolean;
}

export interface ApiError {
  error: string;
  message: string;
}

// Validation types

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

export interface ValidationRules {
  MAX_EVENT_NAME_LENGTH: number;
}
