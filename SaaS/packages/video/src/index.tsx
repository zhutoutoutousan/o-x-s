import React, { useRef, useState } from 'react';
import './Video.css';

export interface VideoProps {
  src: string;
  poster?: string;
  harryPotterStyle?: boolean;
  className?: string;
}

export const Video: React.FC<VideoProps> = ({
  src,
  poster,
  harryPotterStyle = true,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className={`video-container ${harryPotterStyle ? 'harry-potter' : ''} ${className}`}>
      <div className="video-frame">
        {harryPotterStyle && (
          <>
            <div className="frame-decoration top-left"></div>
            <div className="frame-decoration top-right"></div>
            <div className="frame-decoration bottom-left"></div>
            <div className="frame-decoration bottom-right"></div>
            <div className="magic-particles"></div>
          </>
        )}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="video-element"
          controls
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </div>
      {harryPotterStyle && (
        <div className="video-overlay">
          <div className="spell-effect"></div>
        </div>
      )}
    </div>
  );
};
