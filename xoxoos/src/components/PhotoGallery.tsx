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
            onClick={() => setSelectedImage(image.secure_url)}
          >
            <div className="gallery-image-wrapper">
              <Image
                src={getCloudinaryImageUrl(image.public_id, {
                  width: 400,
                  height: 400,
                  crop: 'fill',
                  quality: 'auto',
                  format: 'auto'
                })}
                alt={image.public_id}
                fill
                className="gallery-image"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
