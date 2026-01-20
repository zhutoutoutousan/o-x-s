import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CandleWall } from './components/CandleWall';
import { FireWall } from './components/FireWall';
import { Timeline } from './components/Timeline';
import { Chat } from './components/Chat';
import { VideoPlayer } from './components/VideoPlayer';
import { MovieMontage, MontageItem } from './components/MovieMontage';
import { Gamification } from './components/Gamification';
import { HarryPotterMagic, Spell, Potion } from './components/HarryPotterMagic';
import { useGamification } from './context/GamificationContext';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [showEffects, setShowEffects] = useState(true);
  const { totalPoints, achievements, addPoints, unlockAchievement } = useGamification();
  
  // Track first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      unlockAchievement('first-visit');
      addPoints(10);
      localStorage.setItem('hasVisited', 'true');
    }
  }, [unlockAchievement, addPoints]);

  // Track section views for achievements
  useEffect(() => {
    if (activeSection === 'timeline') {
      const timelineViewed = localStorage.getItem('timelineViewed');
      if (!timelineViewed) {
        unlockAchievement('timeline-view');
        addPoints(25);
        localStorage.setItem('timelineViewed', 'true');
      }
    }
  }, [activeSection, unlockAchievement, addPoints]);

  // Montage items - add your Cloudinary public IDs
  const montageItems: MontageItem[] = [
    {
      id: '1',
      type: 'image',
      publicId: 'montage/moment1',
      title: 'First Glance',
      description: 'The moment that started it all',
      duration: 4
    },
    {
      id: '2',
      type: 'image',
      publicId: 'montage/moment2',
      title: 'Together',
      description: 'Every moment with you is magical',
      duration: 4
    },
    {
      id: '3',
      type: 'video',
      publicId: 'montage/memory1',
      title: 'Our Story',
      description: 'A love story written in the stars',
      duration: 8
    }
  ];

  // Timeline events with Cloudinary image public IDs
  // Upload images to Cloudinary and use the public ID (e.g., 'timeline/first-spark')
  // Or use full URLs if hosting elsewhere
  const timelineEvents = [
    {
      id: '1',
      date: '2023-06-15',
      title: 'First Spark',
      description: 'The moment our eyes met across the room, and everything changed.',
      image: 'timeline/first-spark', // Cloudinary public ID - upload your image to Cloudinary
      color: '#d4af37'
    },
    {
      id: '2',
      date: '2023-07-20',
      title: 'First Date',
      description: 'Coffee turned into dinner, dinner turned into stargazing. Time stood still.',
      image: 'timeline/first-date', // Cloudinary public ID
      color: '#ff6b9d'
    },
    {
      id: '3',
      date: '2023-09-14',
      title: 'I Love You',
      description: 'Three words that changed everything. The most beautiful moment of our lives.',
      image: 'timeline/i-love-you', // Cloudinary public ID
      color: '#c77dff'
    },
    {
      id: '4',
      date: '2024-01-01',
      title: 'New Year Together',
      description: 'Starting a new year with you by my side. Our first of many.',
      image: 'timeline/new-year', // Cloudinary public ID
      color: '#ffd700'
    }
  ];

  return (
    <div className="app">
      {showEffects && (
        <>
          <CandleWall intensity={1.2} />
          <FireWall intensity={0.8} />
        </>
      )}
      
      <nav className="main-nav">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveSection('home')}
          className={activeSection === 'home' ? 'active' : ''}
        >
          Home
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveSection('timeline')}
          className={activeSection === 'timeline' ? 'active' : ''}
        >
          Our Story
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveSection('chat')}
          className={activeSection === 'chat' ? 'active' : ''}
        >
          Sweet Moments
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveSection('video');
            unlockAchievement('video-watch');
            addPoints(40);
          }}
          className={activeSection === 'video' ? 'active' : ''}
        >
          Together
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveSection('montage');
            unlockAchievement('montage-view');
            addPoints(45);
          }}
          className={activeSection === 'montage' ? 'active' : ''}
        >
          🎬 Montage
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveSection('magic');
            unlockAchievement('house-sorted');
            addPoints(35);
          }}
          className={activeSection === 'magic' ? 'active' : ''}
        >
          🪄 Magic
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveSection('gamification');
          }}
          className={activeSection === 'gamification' ? 'active' : ''}
        >
          🏆 Progress
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowEffects(!showEffects)}
          className="effects-toggle"
        >
          {showEffects ? '✨' : '🌙'}
        </motion.button>
      </nav>

      <main className="main-content">
        {activeSection === 'home' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="hero-section"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-title"
            >
              Sue & Owen
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hero-subtitle"
            >
              A Love Story Written in the Stars
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="heart-decoration"
            >
              ❤️
            </motion.div>
          </motion.section>
        )}

        {activeSection === 'timeline' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section"
          >
            <h2 className="section-title">Our Journey</h2>
            <Timeline events={timelineEvents} />
          </motion.section>
        )}

        {activeSection === 'chat' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section chat-section"
          >
            <h2 className="section-title">Sweet Moments</h2>
            <Chat 
              user1Name="Sue" 
              user2Name="Owen"
              onSendMessage={(text) => {
                if (text.toLowerCase().includes('love') || text.toLowerCase().includes('❤️')) {
                  unlockAchievement('chat-message');
                  addPoints(30);
                }
              }}
            />
          </motion.section>
        )}

        {activeSection === 'video' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section video-section"
          >
            <h2 className="section-title">Our Memories Together</h2>
            <VideoPlayer 
              videoPublicId="memories/together" // Upload your video to Cloudinary and use the public ID
              posterPublicId="memories/together-poster" // Optional: poster image for the video
            />
          </motion.section>
        )}

        {activeSection === 'montage' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section"
          >
            <h2 className="section-title">Our Love Story Montage</h2>
            <MovieMontage 
              items={montageItems}
              autoPlay={true}
              transitionDuration={4000}
              showControls={true}
            />
          </motion.section>
        )}

        {activeSection === 'magic' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section"
          >
            <h2 className="section-title">Hogwarts Love Magic</h2>
            <HarryPotterMagic
              onSpellCast={(spell: Spell) => {
                unlockAchievement('spell-cast');
                addPoints(50);
              }}
              onPotionBrew={(potion: Potion) => {
                unlockAchievement('potion-brew');
                addPoints(60);
                if (potion.id === 'love-potion') {
                  addPoints(50);
                } else if (potion.id === 'bond-potion') {
                  addPoints(100);
                }
              }}
            />
          </motion.section>
        )}

        {activeSection === 'gamification' && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="section"
          >
            <h2 className="section-title">Your Love Progress</h2>
            <Gamification
              achievements={achievements}
              totalPoints={totalPoints}
              onAchievementUnlock={(achievement) => {
                addPoints(achievement.points);
              }}
            />
          </motion.section>
        )}
      </main>
    </div>
  );
}

export default App;
