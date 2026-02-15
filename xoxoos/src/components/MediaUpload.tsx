'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MediaUpload.css';

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface MediaUploadProps {
  onUploadComplete?: () => void;
}

export function MediaUpload({ onUploadComplete }: MediaUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggeredRefresh, setHasTriggeredRefresh] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setIsOpen(true);

    // Start uploading each file
    newFiles.forEach((uploadFile) => {
      uploadFileToCloudinary(uploadFile);
    });
  }, []);

  const uploadFileToCloudinary = async (uploadFile: UploadFile) => {
    const formData = new FormData();
    formData.append('file', uploadFile.file);

    // Update status to uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadFile.id ? { ...f, status: 'uploading', progress: 10 } : f
      )
    );

    try {
      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Simulate progress
        for (let progress = 20; progress <= 100; progress += 20) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, progress } : f
            )
          );
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        );
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id
            ? {
                ...f,
                status: 'error',
                error: error.message || 'Upload failed',
              }
            : f
        )
      );
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFileSelect]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setIsOpen(false);
    setHasTriggeredRefresh(false);
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) {
      return '🎬';
    }
    return '📷';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const allComplete = files.length > 0 && files.every((f) => f.status === 'success' || f.status === 'error');
  const hasErrors = files.some((f) => f.status === 'error');
  const allSuccessful = files.length > 0 && files.every((f) => f.status === 'success');

  // Only trigger refresh once when all files are complete
  useEffect(() => {
    if (allSuccessful && !hasTriggeredRefresh && onUploadComplete) {
      setHasTriggeredRefresh(true);
      // Wait a bit to ensure Cloudinary has processed all files
      setTimeout(() => {
        onUploadComplete();
        // Reset after refresh is triggered
        setTimeout(() => {
          setHasTriggeredRefresh(false);
        }, 2000);
      }, 1500);
    }
  }, [allSuccessful, hasTriggeredRefresh, onUploadComplete]);

  return (
    <>
      {/* Upload Button */}
      <motion.button
        className="upload-trigger"
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="upload-icon">📤</span>
        <span className="upload-text">Upload Memories</span>
      </motion.button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {/* Upload Modal */}
      <AnimatePresence>
        {isOpen && files.length > 0 && (
          <motion.div
            className="upload-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget && allComplete) {
                clearAll();
              }
            }}
          >
            <motion.div
              className="upload-modal"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="upload-modal-header">
                <h2 className="upload-modal-title">Uploading Memories</h2>
                {allComplete && (
                  <button
                    className="upload-close-btn"
                    onClick={clearAll}
                    aria-label="Close"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="upload-files-list">
                {files.map((uploadFile) => (
                  <motion.div
                    key={uploadFile.id}
                    className={`upload-file-item ${uploadFile.status}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="upload-file-info">
                      <span className="upload-file-icon">
                        {getFileIcon(uploadFile.file)}
                      </span>
                      <div className="upload-file-details">
                        <div className="upload-file-name">
                          {uploadFile.file.name}
                        </div>
                        <div className="upload-file-size">
                          {formatFileSize(uploadFile.file.size)}
                        </div>
                      </div>
                      {uploadFile.status === 'success' && (
                        <span className="upload-success-icon">✓</span>
                      )}
                      {uploadFile.status === 'error' && (
                        <button
                          className="upload-remove-btn"
                          onClick={() => removeFile(uploadFile.id)}
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {uploadFile.status === 'uploading' && (
                      <div className="upload-progress-bar">
                        <motion.div
                          className="upload-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadFile.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}

                    {uploadFile.status === 'error' && (
                      <div className="upload-error-message">
                        {uploadFile.error}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {allComplete && !hasErrors && (
                <motion.div
                  className="upload-complete-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  All uploads complete! Your memories are being added...
                </motion.div>
              )}

              {/* Drag and Drop Zone */}
              <div
                className={`upload-drop-zone ${isDragging ? 'dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="drop-zone-icon">📎</span>
                <span className="drop-zone-text">
                  {isDragging
                    ? 'Drop files here'
                    : 'Drag & drop more files or click to select'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
