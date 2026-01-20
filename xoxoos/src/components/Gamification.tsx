import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Gamification.css';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedDate?: Date;
  category: 'love' | 'milestone' | 'magic' | 'memory';
}

export interface LoveLevel {
  level: number;
  name: string;
  pointsRequired: number;
  color: string;
  icon: string;
}

interface GamificationProps {
  achievements: Achievement[];
  totalPoints: number;
  onAchievementUnlock?: (achievement: Achievement) => void;
}

const LOVE_LEVELS: LoveLevel[] = [
  { level: 1, name: 'First Spark', pointsRequired: 0, color: '#d4af37', icon: '✨' },
  { level: 2, name: 'Growing Affection', pointsRequired: 100, color: '#ff6b9d', icon: '💕' },
  { level: 3, name: 'Deep Connection', pointsRequired: 250, color: '#c77dff', icon: '💖' },
  { level: 4, name: 'Soulmates', pointsRequired: 500, color: '#ffd700', icon: '💝' },
  { level: 5, name: 'Eternal Love', pointsRequired: 1000, color: '#ff1493', icon: '💗' },
  { level: 6, name: 'Legendary Bond', pointsRequired: 2000, color: '#9370db', icon: '💜' },
  { level: 7, name: 'Magical Union', pointsRequired: 5000, color: '#ff69b4', icon: '💞' },
];

export const Gamification: React.FC<GamificationProps> = ({
  achievements,
  totalPoints,
  onAchievementUnlock
}) => {
  const [showAchievements, setShowAchievements] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  const currentLevel = LOVE_LEVELS.reduce((level, lvl) => 
    totalPoints >= lvl.pointsRequired ? lvl : level
  , LOVE_LEVELS[0]);

  const nextLevel = LOVE_LEVELS.find(lvl => lvl.level > currentLevel.level) || LOVE_LEVELS[LOVE_LEVELS.length - 1];
  const progressToNext = nextLevel 
    ? ((totalPoints - currentLevel.pointsRequired) / (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100
    : 100;

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  useEffect(() => {
    const newUnlocks = achievements.filter(a => a.unlocked && a.unlockedDate && 
      new Date(a.unlockedDate).getTime() > Date.now() - 5000);
    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
      newUnlocks.forEach(ach => onAchievementUnlock?.(ach));
      setTimeout(() => setNewlyUnlocked([]), 5000);
    }
  }, [achievements, onAchievementUnlock]);

  return (
    <div className="gamification-container">
      <div className="love-level-card">
        <div className="level-header">
          <div className="level-icon">{currentLevel.icon}</div>
          <div className="level-info">
            <h3 className="level-name">{currentLevel.name}</h3>
            <p className="level-number">Level {currentLevel.level}</p>
          </div>
        </div>
        
        <div className="points-display">
          <div className="points-value">{totalPoints}</div>
          <div className="points-label">Love Points</div>
        </div>

        {nextLevel && (
          <div className="progress-section">
            <div className="progress-label">
              <span>Next: {nextLevel.name}</span>
              <span>{nextLevel.pointsRequired - totalPoints} points to go</span>
            </div>
            <div className="progress-bar-container">
              <motion.div
                className="progress-bar"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})` }}
              />
            </div>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAchievements(!showAchievements)}
        className="achievements-toggle"
      >
        🏆 Achievements ({unlockedAchievements.length}/{achievements.length})
      </motion.button>

      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="achievements-panel"
          >
            <h3 className="panel-title">Your Love Achievements</h3>
            
            <div className="achievements-grid">
              {unlockedAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="achievement-card unlocked"
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    <div className="achievement-points">+{achievement.points} points</div>
                  </div>
                  <div className="achievement-badge">✓</div>
                </motion.div>
              ))}

              {lockedAchievements.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.5 }}
                  className="achievement-card locked"
                >
                  <div className="achievement-icon">🔒</div>
                  <div className="achievement-info">
                    <h4>???</h4>
                    <p>Keep exploring to unlock this achievement</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {newlyUnlocked.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="achievement-notification"
          >
            <div className="notification-icon">{achievement.icon}</div>
            <div className="notification-content">
              <h4>Achievement Unlocked!</h4>
              <p>{achievement.title}</p>
              <span className="notification-points">+{achievement.points} points</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
