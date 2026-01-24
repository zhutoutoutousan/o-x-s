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
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Helper to get the display URL for an image (converts HEIC to JPEG)
  const getDisplayUrl = (image: CloudinaryResource, fullSize: boolean = false) => {
    const isHeic = image.format?.toLowerCase() === 'heic' || 
                  image.format?.toLowerCase() === 'heif' ||
                  image.public_id?.toLowerCase().endsWith('.heic') ||
                  image.public_id?.toLowerCase().endsWith('.heif') ||
                  image.secure_url?.toLowerCase().includes('.heic') ||
                  image.secure_url?.toLowerCase().includes('.heif');
    
    if (isHeic) {
      return getCloudinaryImageUrl(image.public_id, {
        width: fullSize ? 1920 : 400,
        height: fullSize ? 1920 : 400,
        crop: fullSize ? 'fit' : 'fill',
        quality: 'auto',
        format: 'jpg',
        forceFormat: true
      }, image.format, image.secure_url);
    }
    
    return image.secure_url || getCloudinaryImageUrl(image.public_id, {
      width: fullSize ? 1920 : 400,
      height: fullSize ? 1920 : 400,
      crop: fullSize ? 'fit' : 'fill',
      quality: 'auto',
      format: 'auto'
    }, image.format, image.secure_url);
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
            onClick={() => setSelectedImage(getDisplayUrl(image, true))}
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
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <Image
                src={selectedImage}
                alt="Full size"
                width={1200}
                height={800}
                className="modal-image"
                style={{ objectFit: 'contain' }}
                unoptimized={false}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
