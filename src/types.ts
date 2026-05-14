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
  uploadedAt: string;
}

/**
 * Toast notification
 */
export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
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
// SOCKET EVENT TYPES
// ============================================

export interface SocketPhotoUploadedEvent {
  photo: Photo;
}

export interface SocketPhotoDeletedEvent {
  photoId: string;
}

export interface SocketUserJoinedEvent {
  userName: string;
  timestamp: string;
}

export interface SocketUserLeftEvent {
  userName: string;
  timestamp: string;
}

export interface SocketUsersOnlineEvent {
  count: number;
}

export interface SocketUploadStartedEvent {
  userName: string;
  fileCount: number;
  timestamp: string;
}

export interface SocketEventStatsEvent {
  photoCount: number;
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
  error: string;
  photoCount: number;
  eventJoinCode: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedFiles?: File[];
  previewUrls?: string[];
  onUpload?: () => void;
  onCancelUpload?: () => void;
  onRemovePreview?: (index: number) => void;
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

export interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning';
  duration?: number;
  onClose: () => void;
}

export interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

// ============================================
// HOOK TYPES
// ============================================

export interface UseEventReturn {
  event: Event | null;
  loading: boolean;
  error: string | null;
}

export interface UsePhotosReturn {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  addPhoto: (photo: Photo) => void;
  removePhoto: (photoId: string) => void;
  deletePhoto: (photoId: string, sessionToken: string | null, hostToken: string | null) => Promise<void>;
  refreshPhotos: () => Promise<void>;
}

export interface UseUploadOptions {
  eventId: string | undefined;
  userName: string;
  sessionToken: string | null;
  onUploadStart?: (fileCount: number) => void;
  onUploadComplete?: () => void;
  onError?: (error: string) => void;
}

export interface UseUploadReturn {
  uploading: boolean;
  uploadProgress: number;
  selectedFiles: File[];
  previewUrls: string[];
  error: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSelectedFiles: () => void;
  removePreview: (index: number) => void;
  uploadFiles: () => Promise<void>;
}

export interface UseToastsReturn {
  toasts: Toast[];
  addToast: (message: string, type?: 'info' | 'success' | 'warning') => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface UsePhotoSelectionReturn {
  selectedPhotos: Set<string>;
  toggleSelection: (photoId: string) => void;
  clearSelection: () => void;
  selectAll: (photoIds: string[]) => void;
  downloadAll: (eventName: string) => Promise<void>;
  downloadSelected: (eventName: string) => Promise<void>;
}

export interface UseSocketEventsOptions {
  eventId: string;
  userName: string;
  onPhotoUploaded?: (photo: Photo) => void;
  onPhotoDeleted?: (photoId: string) => void;
  onToast?: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

export interface UseSocketEventsReturn {
  onlineUsers: number;
  notifyUploadStarted: (fileCount: number) => void;
}

export interface UseSocketOptions {
  eventId: string;
  userName?: string;
  onPhotoUploaded?: (photo: Photo) => void;
  onPhotoDeleted?: (data: { photoId: string }) => void;
  onUserJoined?: (data: { userName: string; timestamp: string }) => void;
  onUserLeft?: (data: { userName: string; timestamp: string }) => void;
  onUsersOnline?: (data: { count: number }) => void;
  onUploadStarted?: (data: { userName: string; fileCount: number; timestamp: string }) => void;
  onEventStats?: (stats: { photoCount: number }) => void;
}

export interface UseSocketReturn {
  socket: any; // Socket.IO client instance
  notifyUploadStarted: (fileCount: number) => void;
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

// ============================================
// UTILITY TYPES
// ============================================

export type ToastType = 'info' | 'success' | 'warning';

export type StorageProvider = 'local' | 'r2' | 's3';

export type FileValidationError =
  | 'FILE_TOO_LARGE'
  | 'FILE_TOO_SMALL'
  | 'INVALID_FILE_TYPE'
  | 'INVALID_EXTENSION'
  | 'MALICIOUS_FILENAME'
  | 'INVALID_CONTENT';

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'FILE_SIZE_ERROR'
  | 'INVALID_FILE_TYPE'
  | 'INVALID_FILE_EXTENSION'
  | 'INVALID_FILE_CONTENT'
  | 'MALICIOUS_FILENAME'
  | 'INVALID_EVENT_NAME'
  | 'INVALID_USER_NAME'
  | 'EVENT_NOT_FOUND'
  | 'PHOTO_NOT_FOUND'
  | 'MISSING_SESSION_TOKEN'
  | 'UPLOAD_LIMIT_EXCEEDED'
  | 'FORBIDDEN'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN_ERROR';

