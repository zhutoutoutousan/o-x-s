'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { PasswordGate } from '@/src/components/PasswordGate';
import { PhotoGallery } from '@/src/components/PhotoGallery';
import { LoadingMemories } from '@/src/components/LoadingMemories';
import { DifficultMemories } from '@/src/components/DifficultMemories';
import { MediaUpload } from '@/src/components/MediaUpload';
import { QuickNavigation } from '@/src/components/QuickNavigation';
import { ChefOrder } from '@/src/components/ChefOrder';
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
      console.log('Fetching Cloudinary resources at:', new Date().toISOString(), 'timestamp:', timestamp);
      const response = await fetch(`/api/cloudinary?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });
      
      if (!response.ok) {
        console.error('Failed to fetch resources:', response.status, response.statusText);
        return;
      }
      const data = await response.json();
      
      console.log('Received data:', {
        imagesCount: data.images?.length || 0,
        videosCount: data.videos?.length || 0,
        timestamp: new Date().toISOString()
      });
      
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
          const isValid = video.secure_url && video.resource_type === 'video';
          if (!isValid) {
            console.log('Filtered out video:', video.public_id, 'reason: missing secure_url or wrong resource_type');
          }
          return isValid;
        });
        
        console.log(`Processing ${availableVideos.length} available videos out of ${data.videos.length} total`);
        
        const sortedVideos = availableVideos.sort((a: CloudinaryResource, b: CloudinaryResource) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        console.log('Setting videos:', sortedVideos.length, 'videos');
        console.log('Video public_ids:', sortedVideos.map((v: CloudinaryResource) => v.public_id));
        
        // Force state update - use functional update to ensure React detects the change
        setVideos(() => [...sortedVideos]);
        
        if (sortedVideos.length > 0) {
          // Randomly select a video for the hero
          const randomIndex = Math.floor(Math.random() * sortedVideos.length);
          setHeroVideo(sortedVideos[randomIndex]);
          console.log('Hero video set to:', sortedVideos[randomIndex].public_id);
        } else {
          setHeroVideo(null);
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
      <section id="hero" className="hero-section">
        <div className="hero-video-container">
              {heroVideo ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="hero-video"
              onError={(e) => {
                console.error('Video load error:', heroVideo.public_id);
                // Fallback: try using the generated URL with different quality
                const videoElement = e.currentTarget;
                const fallbackUrl = getCloudinaryVideoUrl(heroVideo.public_id, {
                  quality: 80,
                  format: 'mp4'
                });
                videoElement.src = fallbackUrl;
              }}
            >
              <source
                src={getCloudinaryVideoUrl(heroVideo.public_id, {
                  quality: 'auto',
                  format: 'mp4'
                })}
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
      <section id="memory" className="memory-section">
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
      <section id="photos" className="gallery-section">
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
        <PhotoGallery images={images} onImageDeleted={() => fetchCloudinaryResources()} />
      </section>

      {/* Additional Videos Section */}
      {videos.length > 0 && (
        <section id="videos" className="videos-section">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Memories in Motion
          </motion.h2>
          <div className="videos-grid">
            {videos.length > 0 ? (
              videos.map((video, index) => {
                const videoUrl = getCloudinaryVideoUrl(video.public_id, {
                  quality: 'auto',
                  format: 'mp4'
                });
                console.log(`Rendering video ${index + 1}/${videos.length}:`, video.public_id, 'URL:', videoUrl);
                
                return (
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
                      onLoadStart={() => {
                        console.log('Video load started:', video.public_id);
                      }}
                      onLoadedData={() => {
                        console.log('Video loaded successfully:', video.public_id);
                      }}
                      onError={(e) => {
                        console.error('Video load error:', video.public_id, 'Current src:', e.currentTarget.src);
                        // Fallback: try using the generated URL with different quality
                        const videoElement = e.currentTarget;
                        const fallbackUrl = getCloudinaryVideoUrl(video.public_id, {
                          quality: 80,
                          format: 'mp4'
                        });
                        console.log('Trying fallback URL:', fallbackUrl);
                        videoElement.src = fallbackUrl;
                      }}
                    >
                      <source
                        src={videoUrl}
                        type="video/mp4"
                      />
                    </video>
                  </motion.div>
                );
              })
            ) : (
              <div className="videos-empty">
                <p>All videos are displayed in the hero section above.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Difficult but Valuable Memories */}
      <section id="difficult-memories">
        <DifficultMemories />
      </section>

      {/* Final Narrative */}
      <section id="final" className="final-section">
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

      {/* Quick Navigation */}
      <QuickNavigation />

      {/* Media Upload Component */}
      <MediaUpload onUploadComplete={() => fetchCloudinaryResources()} />

      {/* Chef Order Component */}
      <ChefOrder role="customer" />
    </div>
  );
}
