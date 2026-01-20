import React, { useState, useRef } from 'react';
import { Memory } from './index';
import './MemoryUpload.css';

interface MemoryUploadProps {
  onUpload?: (memory: Memory) => void;
}

export const MemoryUpload: React.FC<MemoryUploadProps> = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      alert('Please select a file and enter a title');
      return;
    }

    setUploading(true);

    // Simulate file upload (in production, upload to cloud storage)
    setTimeout(() => {
      const memory: Memory = {
        id: `memory-${Date.now()}`,
        type: file.type.startsWith('image/') ? 'photo' : 'video',
        title,
        description,
        date: date || new Date().toISOString().split('T')[0],
        fileUrl: preview || URL.createObjectURL(file),
        tags: [],
      };

      onUpload?.(memory);
      
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setUploading(false);
      alert('Memory uploaded successfully!');
    }, 1000);
  };

  return (
    <div className="memory-upload">
      <div className="upload-card">
        <h3 className="upload-title">Add a Memory</h3>
        
        <div className="upload-preview">
          {preview ? (
            <div className="preview-container">
              {file?.type.startsWith('image/') ? (
                <img src={preview} alt="Preview" className="preview-image" />
              ) : (
                <video src={preview} controls className="preview-video" />
              )}
              <button
                className="remove-preview"
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <div
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">📷</div>
              <p className="upload-text">Click to select photo or video</p>
              <p className="upload-hint">Or drag and drop here</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="file-input"
          style={{ display: 'none' }}
        />

        <div className="upload-form">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="e.g., Family Reunion 2023"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Tell us about this memory..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !file || !title}
            className="upload-button"
          >
            {uploading ? 'Uploading...' : 'Save Memory'}
          </button>
        </div>
      </div>
    </div>
  );
};
