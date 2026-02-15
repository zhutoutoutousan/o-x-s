'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getCloudinaryImageUrl } from '@/src/utils/cloudinary';
import './PhotoGallery.css';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

interface PhotoGalleryProps {
  images: CloudinaryResource[];
  onImageDeleted?: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, onImageDeleted }) => {
  const [selectedImage, setSelectedImage] = useState<CloudinaryResource | null>(null);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Helper to get the display URL for an image (converts HEIC to JPEG)
  const getDisplayUrl = (image: CloudinaryResource, fullSize: boolean = false, transforms?: string) => {
    const isHeic = image.format?.toLowerCase() === 'heic' || 
                  image.format?.toLowerCase() === 'heif' ||
                  image.public_id?.toLowerCase().endsWith('.heic') ||
                  image.public_id?.toLowerCase().endsWith('.heif') ||
                  image.secure_url?.toLowerCase().includes('.heic') ||
                  image.secure_url?.toLowerCase().includes('.heif');
    
    // For transformed images, don't set width/height to preserve aspect ratio
    const baseOptions = {
      ...(fullSize && !transforms ? {
        width: 1920,
        height: 1920,
        crop: 'fit' as const,
      } : fullSize ? {
        crop: 'fit' as const,
      } : {
        width: 400,
        height: 400,
        crop: 'fill' as const,
      }),
      quality: 'auto' as const,
      transformation: transforms || '',
    };
    
    if (isHeic) {
      return getCloudinaryImageUrl(image.public_id, {
        ...baseOptions,
        format: 'jpg',
        forceFormat: true
      }, image.format, image.secure_url);
    }
    
    return image.secure_url || getCloudinaryImageUrl(image.public_id, {
      ...baseOptions,
      format: 'auto'
    }, image.format, image.secure_url);
  };

  // Get transformed URL for preview
  const getTransformedUrl = () => {
    if (!selectedImage) return '';
    
    const transforms: string[] = [];
    
    // Apply flips first (they're applied before rotation in Cloudinary)
    if (flipHorizontal) {
      transforms.push('fl_horizontal');
    }
    if (flipVertical) {
      transforms.push('fl_vertical');
    }
    
    // Then apply rotation
    if (rotation !== 0) {
      // Cloudinary rotation: a_90 means rotate 90 degrees clockwise
      // Normalize rotation to 0-360 range
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      if (normalizedRotation !== 0) {
        transforms.push(`a_${normalizedRotation}`);
      }
    }
    
    // If no transformations, return original
    if (transforms.length === 0) {
      return getDisplayUrl(selectedImage, true);
    }
    
    // Build transformation string - transformations come first, then crop/quality
    const transformString = `${transforms.join(',')},c_fit,q_auto`;
    
    // Build URL manually to ensure correct format
    const CLOUD_NAME = 'drasvxb0d'; // Use the cloud name directly
    const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}`;
    
    // Extract public_id from secure_url or use public_id directly
    const publicId = selectedImage.public_id;
    
    // Build the transformed URL
    const url = `${BASE_URL}/image/upload/${transformString}/${publicId}`;
    
    return url;
  };

  // Delete image
  const handleDelete = async () => {
    if (!selectedImage || !confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `/api/cloudinary/delete?public_id=${encodeURIComponent(selectedImage.public_id)}&resource_type=image`,
        { method: 'DELETE' }
      );

      const result = await response.json();
      if (result.success) {
        setSelectedImage(null);
        if (onImageDeleted) {
          onImageDeleted();
        }
      } else {
        alert('Failed to delete image: ' + result.error);
      }
    } catch (error: any) {
      alert('Error deleting image: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reupload transformed image
  const handleReupload = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    try {
      // Get the transformed image URL
      const transformedUrl = getTransformedUrl();
      
      // Fetch the transformed image as a blob
      const response = await fetch(transformedUrl);
      const blob = await response.blob();
      
      // Create a File from the blob
      const file = new File([blob], `${selectedImage.public_id.split('/').pop() || 'image'}.${selectedImage.format || 'jpg'}`, {
        type: blob.type || 'image/jpeg',
      });

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResult.success) {
        alert('Image reuploaded successfully!');
        setSelectedImage(null);
        setRotation(0);
        setFlipHorizontal(false);
        setFlipVertical(false);
        setShowEditMenu(false);
        if (onImageDeleted) {
          onImageDeleted();
        }
      } else {
        alert('Failed to reupload image: ' + uploadResult.error);
      }
    } catch (error: any) {
      alert('Error reuploading image: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset transforms
  const resetTransforms = () => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  };

  if (images.length === 0) {
    return (
      <div className="gallery-empty">
        <p>No images found. Upload images to Cloudinary to see them here.</p>
      </div>
    );
  }

  return (
    <>
      <div className="photo-gallery">
        {images.map((image, index) => (
          <motion.div
            key={image.public_id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="gallery-item"
            onClick={() => {
              setSelectedImage(image);
              resetTransforms();
              setShowEditMenu(false);
            }}
          >
            <div className="gallery-image-wrapper">
              <Image
                src={getDisplayUrl(image, false)}
                alt={image.public_id}
                fill
                className="gallery-image"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                unoptimized={false}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="image-modal"
            onClick={() => {
              setSelectedImage(null);
              resetTransforms();
              setShowEditMenu(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <button
                  className="modal-close"
                  onClick={() => {
                    setSelectedImage(null);
                    resetTransforms();
                    setShowEditMenu(false);
                  }}
                >
                  ×
                </button>
                <div className="modal-actions">
                  <button
                    className="modal-action-btn edit"
                    onClick={() => setShowEditMenu(!showEditMenu)}
                    disabled={isProcessing}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="modal-action-btn delete"
                    onClick={handleDelete}
                    disabled={isProcessing}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <div className="modal-image-container">
                <Image
                  src={getTransformedUrl()}
                  alt="Full size"
                  width={1200}
                  height={800}
                  className="modal-image"
                  style={{ objectFit: 'contain' }}
                  unoptimized={false}
                />
              </div>

              {/* Edit Menu */}
              <AnimatePresence>
                {showEditMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="edit-menu"
                  >
                    <h3 className="edit-menu-title">Transform Image</h3>
                    
                    <div className="edit-controls">
                      <div className="edit-control-group">
                        <label>Rotate</label>
                        <div className="rotate-controls">
                          <button
                            className="edit-btn"
                            onClick={() => setRotation((r) => (r - 90) % 360)}
                            disabled={isProcessing}
                          >
                            ↺ -90°
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() => setRotation((r) => (r + 90) % 360)}
                            disabled={isProcessing}
                          >
                            ↻ +90°
                          </button>
                          <span className="rotation-display">{rotation}°</span>
                        </div>
                      </div>

                      <div className="edit-control-group">
                        <label>Flip</label>
                        <div className="flip-controls">
                          <button
                            className={`edit-btn ${flipHorizontal ? 'active' : ''}`}
                            onClick={() => setFlipHorizontal(!flipHorizontal)}
                            disabled={isProcessing}
                          >
                            ↔️ Horizontal
                          </button>
                          <button
                            className={`edit-btn ${flipVertical ? 'active' : ''}`}
                            onClick={() => setFlipVertical(!flipVertical)}
                            disabled={isProcessing}
                          >
                            ↕️ Vertical
                          </button>
                        </div>
                      </div>

                      <div className="edit-actions">
                        <button
                          className="edit-btn reset"
                          onClick={resetTransforms}
                          disabled={isProcessing}
                        >
                          Reset
                        </button>
                        <button
                          className="edit-btn reupload"
                          onClick={handleReupload}
                          disabled={isProcessing || (rotation === 0 && !flipHorizontal && !flipVertical)}
                        >
                          {isProcessing ? 'Processing...' : 'Reupload'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
