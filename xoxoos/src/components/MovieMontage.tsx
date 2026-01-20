import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCloudinaryImageUrl, getCloudinaryVideoUrl } from '../utils/cloudinary';
import './MovieMontage.css';

export interface MontageItem {
  id: string;
  type: 'image' | 'video';
  publicId: string;
  title?: string;
  description?: string;
  duration?: number; // seconds
}

interface MovieMontageProps {
  items: MontageItem[];
  autoPlay?: boolean;
  transitionDuration?: number;
  showControls?: boolean;
}

export const MovieMontage: React.FC<MovieMontageProps> = ({
  items,
  autoPlay = true,
  transitionDuration = 3000,
  showControls = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!isPlaying || isPaused || items.length === 0) return;

    const current = items[currentIndex];
    const duration = current.duration || (current.type === 'video' ? 5000 : transitionDuration);

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, isPaused, items, transitionDuration]);

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
    if (currentItem?.type === 'video' && videoRef.current) {
      videoRef.current.play();
    }
  };

  const handlePause = () => {
    setIsPaused(true);
    if (currentItem?.type === 'video' && videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (items.length === 0) {
    return (
      <div className="montage-container">
        <div className="montage-placeholder">
          <div className="placeholder-icon">🎬</div>
          <p>Add your love story montage items</p>
        </div>
      </div>
    );
  }

  const imageUrl = currentItem?.type === 'image' 
    ? getCloudinaryImageUrl(currentItem.publicId, { width: 1920, quality: 'auto', format: 'auto' })
    : '';
  
  const videoUrl = currentItem?.type === 'video'
    ? getCloudinaryVideoUrl(currentItem.publicId, { quality: 'auto', format: 'auto' })
    : '';

  return (
    <div className="montage-container">
      <div className="montage-frame">
        <div className="frame-magic-border"></div>
        <div className="montage-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotateY: 15 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="montage-item"
            >
              {currentItem.type === 'image' ? (
                <img 
                  src={imageUrl} 
                  alt={currentItem.title || 'Montage image'} 
                  className="montage-media"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="montage-media"
                  autoPlay
                  muted
                  loop={false}
                  onEnded={handleNext}
                />
              )}
              
              {(currentItem.title || currentItem.description) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="montage-overlay"
                >
                  {currentItem.title && (
                    <h3 className="montage-title">{currentItem.title}</h3>
                  )}
                  {currentItem.description && (
                    <p className="montage-description">{currentItem.description}</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {showControls && (
          <div className="montage-controls">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrev}
              className="montage-btn prev-btn"
            >
              ⬅️
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={isPaused ? handlePlay : handlePause}
              className="montage-btn play-btn"
            >
              {isPaused ? '▶️' : '⏸️'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="montage-btn next-btn"
            >
              ➡️
            </motion.button>
          </div>
        )}

        <div className="montage-progress">
          {items.map((_, index) => (
            <motion.div
              key={index}
              className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>

      <div className="montage-spell-effects">
        <div className="spell-sparkle"></div>
        <div className="spell-sparkle"></div>
        <div className="spell-sparkle"></div>
      </div>
    </div>
  );
};
