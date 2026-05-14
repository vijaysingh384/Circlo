import { useState, useRef, useCallback } from 'react';
import { api } from '../lib/api';
import { validateFiles, validateUserName } from '../lib/validation';
import type { UseUploadOptions, UseUploadReturn } from '../types';

export function useUpload({
  eventId,
  userName,
  sessionToken,
  onUploadStart,
  onUploadComplete,
  onError,
}: UseUploadOptions): UseUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);

      if (!files.length) return;

      // Validate user name
      const nameValidation = validateUserName(userName);
      if (!nameValidation.valid) {
        const errorMsg = nameValidation.error || 'Please enter your name first';
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Validate files
      const filesValidation = validateFiles(files);
      if (!filesValidation.valid) {
        const errorMsg = filesValidation.error || 'Invalid files';
        setError(errorMsg);
        onError?.(errorMsg);
        return;
      }

      // Create preview URLs
      const urls = files.map((file) => URL.createObjectURL(file));

      setSelectedFiles(files);
      setPreviewUrls(urls);
      setError('');
    },
    [userName, onError]
  );

  // Clear selected files
  const clearSelectedFiles = useCallback(() => {
    // Revoke object URLs to free memory
    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    setSelectedFiles([]);
    setPreviewUrls([]);
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrls]);

  // Remove a single preview
  const removePreview = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previewUrls[index]);

      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    },
    [previewUrls]
  );

  // Upload files
  const uploadFiles = useCallback(async () => {
    if (!eventId || selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setError('');

    const token = sessionToken || crypto.randomUUID();

    try {
      // Notify others that upload is starting
      onUploadStart?.(selectedFiles.length);

      // Upload each file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        await api.uploadPhoto(eventId, file, userName.trim(), token);
        
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      // Clear files after successful upload
      clearSelectedFiles();
      
      onUploadComplete?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [
    eventId,
    selectedFiles,
    sessionToken,
    userName,
    onUploadStart,
    onUploadComplete,
    onError,
    clearSelectedFiles,
  ]);

  return {
    uploading,
    uploadProgress,
    selectedFiles,
    previewUrls,
    error,
    fileInputRef,
    handleFileSelect,
    clearSelectedFiles,
    removePreview,
    uploadFiles,
  };
}
