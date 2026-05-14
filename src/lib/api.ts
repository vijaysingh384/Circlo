import type {
  CreateEventResponse,
  JoinEventResponse,
  GetEventResponse,
  GetPhotosResponse,
  UploadPhotoResponse,
  ApiError,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Debug log for development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:');
  console.log('  VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('  Using API_BASE_URL:', API_BASE_URL);
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async createEvent(name: string, joinCode: string): Promise<CreateEventResponse> {
    return this.request<CreateEventResponse>('/api/events', {
      method: 'POST',
      body: JSON.stringify({ name, joinCode }),
    });
  }

  async joinEvent(joinCode: string): Promise<JoinEventResponse> {
    return this.request<JoinEventResponse>(`/api/events/join/${joinCode}`);
  }

  async getEvent(eventId: string): Promise<GetEventResponse> {
    return this.request<GetEventResponse>(`/api/events/${eventId}`);
  }

  async getPhotos(eventId: string): Promise<GetPhotosResponse> {
    return this.request<GetPhotosResponse>(`/api/events/${eventId}/photos`);
  }

  async uploadPhoto(
    eventId: string,
    file: File,
    uploadedByName: string,
    sessionToken: string,
    signal?: AbortSignal
  ): Promise<UploadPhotoResponse> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('uploadedByName', uploadedByName);

    const url = `${API_BASE_URL}/api/events/${eventId}/photos`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-session-token': sessionToken,
      },
      body: formData,
      signal,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async deletePhoto(
    eventId: string,
    photoId: string,
    sessionToken: string | null,
    hostToken: string | null
  ): Promise<void> {
    const headers: Record<string, string> = {};
    if (sessionToken) headers['x-session-token'] = sessionToken;
    if (hostToken) headers['x-host-token'] = hostToken;

    const url = `${API_BASE_URL}/api/events/${eventId}/photos/${photoId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'UNKNOWN_ERROR',
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.message || 'Delete failed');
    }
  }

  async downloadAll(eventId: string): Promise<Blob> {
    const url = `${API_BASE_URL}/api/events/${eventId}/download`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }

  async downloadSelected(eventId: string, photoIds: string[]): Promise<Blob> {
    const url = `${API_BASE_URL}/api/events/${eventId}/download-selected`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoIds }),
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  }
}

export const api = new ApiClient();
