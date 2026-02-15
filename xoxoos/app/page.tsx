'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PasswordGate } from '@/src/components/PasswordGate';
import { PhotoGallery } from '@/src/components/PhotoGallery';
import { LoadingMemories } from '@/src/components/LoadingMemories';
import { DifficultMemories } from '@/src/components/DifficultMemories';
import { MediaUpload } from '@/src/components/MediaUpload';
import { getCloudinaryVideoUrl, getCloudinaryImageUrl } from '@/src/utils/cloudinary';
import '@/src/index.css';
import './page.css';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

export default function HomePage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [images, setImages] = useState<CloudinaryResource[]>([]);
  const [videos, setVideos] = useState<CloudinaryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroVideo, setHeroVideo] = useState<CloudinaryResource | null>(null);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [showNarrative, setShowNarrative] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  useEffect(() => {
    if (isUnlocked) {
      fetchCloudinaryResources();
      // Auto-refresh every 30 seconds to detect new uploads
      const refreshInterval = setInterval(() => {
        fetchCloudinaryResources(true); // Silent refresh
      }, 30000);

      return () => clearInterval(refreshInterval);
    }
  }, [isUnlocked]);

  const fetchCloudinaryResources = async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      
      // Add cache-busting timestamp to ensure fresh data
      const timestamp = Date.now();
      const response = await fetch(`/api/cloudinary?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      
      if (data.images) {
        // Filter out any PDFs that might have slipped through (safety check)
        const filteredImages = data.images.filter((img: CloudinaryResource) => {
          const isPdf = 
            img.format === 'pdf' || 
            img.format === 'PDF' || 
            img.secure_url?.toLowerCase().endsWith('.pdf') ||
            img.public_id?.toLowerCase().endsWith('.pdf') ||
            img.public_id?.toLowerCase().includes('.pdf');
          return !isPdf;
        });
        
        // Sort by creation date (newest first)
        const sortedImages = filteredImages.sort((a: CloudinaryResource, b: CloudinaryResource) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setImages(sortedImages);
      }
      if (data.videos) {
        // Filter out videos that are still processing (status: 'pending' or 'processing')
        const availableVideos = data.videos.filter((video: CloudinaryResource) => {
          // Use secure_url directly - it's already authenticated
          return video.secure_url && video.resource_type === 'video';
        });
        
        const sortedVideos = availableVideos.sort((a: CloudinaryResource, b: CloudinaryResource) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setVideos(sortedVideos);
        if (sortedVideos.length > 0) {
          // Randomly select a video for the hero
          const randomIndex = Math.floor(Math.random() * sortedVideos.length);
          setHeroVideo(sortedVideos[randomIndex]);
        }
      }
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error('Error fetching Cloudinary resources:', error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const narratives = [
    {
      text: "Time is not a line, but a circle.",
      delay: 0
    },
    {
      text: "Every moment exists simultaneously—past, present, future.",
      delay: 3000
    },
    {
      text: "I have seen our entire story, and I choose it anyway.",
      delay: 6000
    },
    {
      text: "The joy is worth the pain. The love is worth the loss.",
      delay: 9000
    }
  ];

  if (!isUnlocked) {
    return <PasswordGate onUnlock={() => setIsUnlocked(true)} />;
  }

  if (loading) {
    return <LoadingMemories />;
  }

  return (
    <div className="arrival-app">
      {/* Hero Section with MP4 Video */}
      <section className="hero-section">
        <div className="hero-video-container">
          {heroVideo?.secure_url ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="hero-video"
              onError={(e) => {
                console.error('Video load error:', e);
                // Fallback: try using the generated URL if secure_url fails
                const videoElement = e.currentTarget;
                const fallbackUrl = getCloudinaryVideoUrl(heroVideo.public_id, {
                  quality: 'auto',
                  format: 'mp4'
                });
                videoElement.src = fallbackUrl;
              }}
            >
              <source
                src={heroVideo.secure_url}
                type="video/mp4"
              />
            </video>
          ) : (
            <div className="hero-placeholder">
              <p>Loading memories...</p>
            </div>
          )}
          <div className="hero-overlay">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="hero-title"
            >
              Sue & Owen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="hero-subtitle"
            >
              A Love Story in Non-Linear Time
            </motion.p>
          </div>
        </div>

        {/* Non-linear narrative overlay */}
        <AnimatePresence>
          {showNarrative && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="narrative-overlay"
            >
              {narratives.map((narrative, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                  transition={{
                    delay: narrative.delay / 1000,
                    duration: 3,
                    times: [0, 0.2, 0.8, 1]
                  }}
                  className="narrative-text"
                >
                  {narrative.text}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Arrival-style Memory Section */}
      <section className="memory-section">
        <div className="memory-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="memory-frame"
          >
            <div className="frame-glow"></div>
            <div className="memory-content">
              <h2 className="section-title">The Choice</h2>
              <p className="memory-text">
                I have seen our entire story unfold—every moment of joy, every moment of pain.
                <br /><br />
                I have seen the beginning and the end, the laughter and the tears, the togetherness and the separation.
                <br /><br />
                And still, I choose this path. I choose you. I choose us.
                <br /><br />
                <span className="emphasis">Because every moment, good or bad, holds infinite value.</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery - Memories in Time */}
      <section className="gallery-section">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gallery-title"
        >
          Moments Across Time
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="gallery-subtitle"
        >
          Past, present, and future—all existing simultaneously
        </motion.p>
        <PhotoGallery images={images} />
      </section>

      {/* Additional Videos Section */}
      {videos.length > 0 && (
        <section className="videos-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Memories in Motion
          </motion.h2>
          <div className="videos-grid">
            {videos.length > 1 ? (
              videos.slice(1).map((video, index) => (
                <motion.div
                  key={video.public_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="video-card"
                >
                  <video
                    controls
                    className="video-element"
                    preload="metadata"
                    onError={(e) => {
                      console.error('Video load error:', video.public_id);
                      // Fallback: try using the generated URL if secure_url fails
                      const videoElement = e.currentTarget;
                      const fallbackUrl = getCloudinaryVideoUrl(video.public_id, {
                        quality: 'auto',
                        format: 'mp4'
                      });
                      videoElement.src = fallbackUrl;
                    }}
                  >
                    <source
                      src={video.secure_url || getCloudinaryVideoUrl(video.public_id, {
                        quality: 'auto',
                        format: 'mp4'
                      })}
                      type="video/mp4"
                    />
                  </video>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="video-card"
              >
                <video
                  controls
                  className="video-element"
                  preload="metadata"
                  onError={(e) => {
                    console.error('Video load error:', videos[0].public_id);
                    // Fallback: try using the generated URL if secure_url fails
                    const videoElement = e.currentTarget;
                    const fallbackUrl = getCloudinaryVideoUrl(videos[0].public_id, {
                      quality: 'auto',
                      format: 'mp4'
                    });
                    videoElement.src = fallbackUrl;
                  }}
                >
                  <source
                    src={videos[0].secure_url || getCloudinaryVideoUrl(videos[0].public_id, {
                      quality: 'auto',
                      format: 'mp4'
                    })}
                    type="video/mp4"
                  />
                </video>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Difficult but Valuable Memories */}
      <DifficultMemories />

      {/* Final Narrative */}
      <section className="final-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="final-narrative"
        >
          <p className="final-text">
            This is not a story with a beginning and an end.
            <br />
            It is a circle, where every moment touches every other moment.
            <br />
            <br />
            The arrival is not the beginning—it is the acceptance.
            <br />
            The choice to love, knowing what comes.
            <br />
            <br />
            <span className="final-emphasis">And it is beautiful.</span>
          </p>
        </motion.div>
      </section>

      {/* Media Upload Component */}
      <MediaUpload onUploadComplete={() => fetchCloudinaryResources()} />
    </div>
  );
}
