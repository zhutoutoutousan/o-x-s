import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getCloudinaryVideoUrl, getCloudinaryImageUrl } from '../utils/cloudinary';
import './VideoPlayer.css';

interface VideoPlayerProps {
  videoPublicId?: string;
  posterPublicId?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoPublicId,
  posterPublicId 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const videoUrl = videoPublicId 
    ? getCloudinaryVideoUrl(videoPublicId, { quality: 'auto', format: 'auto' })
    : '';
  
  const posterUrl = posterPublicId
    ? getCloudinaryImageUrl(posterPublicId, { width: 1920, quality: 'auto', format: 'auto' })
    : '';

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="video-container">
      <div className="video-frame harry-potter">
        <div className="frame-decoration top-left"></div>
        <div className="frame-decoration top-right"></div>
        <div className="frame-decoration bottom-left"></div>
        <div className="frame-decoration bottom-right"></div>
        <div className="magic-particles"></div>
        
        <div
          className="video-wrapper"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {videoUrl ? (
            <video
              ref={videoRef}
              className="video-element"
              controls={showControls}
              onPlay={handlePlay}
              onPause={handlePause}
              poster={posterUrl}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="video-placeholder"
            >
              <div className="placeholder-icon">🎬</div>
              <p>Add your video here</p>
              <p className="placeholder-subtitle">Upload to Cloudinary and set videoPublicId prop</p>
              <p className="placeholder-hint">Example: &lt;VideoPlayer videoPublicId="memories/together" /&gt;</p>
            </motion.div>
          )}
        </div>
        
        <div className="video-overlay">
          <div className="spell-effect"></div>
        </div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="video-description"
      >
        Our magical moments captured in time, like memories in a pensieve ✨
      </motion.p>
    </div>
  );
};
