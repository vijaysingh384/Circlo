// ============================================
// DOMAIN TYPES
// ============================================

/**
 * Event entity
 */
export interface Event {
  eventId: string;
  name: string;
  joinCode: string;
  createdAt: string;
}

/**
 * Photo entity
 */
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

// ============================================
// API REQUEST TYPES
// ============================================

export interface CreateEventRequest {
  name: string;
  joinCode: string;
}

export interface UploadPhotoRequest {
  photo: File;
  uploadedByName: string;
  sessionToken: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

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

// ============================================
// COMPONENT PROP TYPES
// ============================================

export interface EventHeaderProps {
  eventName: string;
  photoCount: number;
  isHost: boolean;
  selectedPhotosCount: number;
  onShowQR: () => void;
  onDownloadAll: () => void;
  onDownloadSelected: () => void;
}

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  joinCode: string;
  joinLink: string;
  onCopyLink: () => void;
}

export interface UploadSectionProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  uploading: boolean;
  uploadProgress: number;
  photoCount: number;
  eventJoinCode: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface PhotoGalleryProps {
  photos: Photo[];
  selectedPhotos: Set<string>;
  isHost: boolean;
  sessionToken: string | null;
  onToggleSelection: (photoId: string) => void;
  onDelete: (photoId: string) => void;
  onClearSelection: () => void;
}

// ============================================
// VALIDATION TYPES
// ============================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: string;
}

export interface ValidationRules {
  MAX_FILE_SIZE: number;
  MIN_FILE_SIZE: number;
  ALLOWED_FILE_TYPES: string[];
  ALLOWED_EXTENSIONS: string[];
  MAX_FILES_PER_UPLOAD: number;
  MAX_EVENT_NAME_LENGTH: number;
  MAX_USER_NAME_LENGTH: number;
  MIN_NAME_LENGTH: number;
}