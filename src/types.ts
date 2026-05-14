// API Response Types
export interface CreateEventResponse {
  eventId: string;
  joinCode: string;
  name: string;
  hostToken: string;
}

export interface JoinEventResponse {
  eventId: string;
  name: string;
  sessionToken: string;
}

export interface GetEventResponse {
  eventId: string;
  name: string;
  joinCode: string;
  createdAt: string;
  photoCount: number;
  guestCount: number;
}

export interface Photo {
  _id: string;
  eventId: string;
  filename: string;
  uploadedByName: string;
  uploadedAt: string;
  url: string;
}

export interface GetPhotosResponse {
  photos: Photo[];
}

export interface UploadPhotoResponse {
  photoId: string;
  url: string;
  message: string;
}

export interface ApiError {
  error: string;
  message: string;
}
