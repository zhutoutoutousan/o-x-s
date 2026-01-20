'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Achievement } from '../components/Gamification';

interface GamificationContextType {
  totalPoints: number;
  achievements: Achievement[];
  addPoints: (points: number) => void;
  unlockAchievement: (achievementId: string) => void;
  checkAndUnlockAchievements: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-visit',
    title: 'First Spark',
    description: 'You discovered your love story',
    icon: '✨',
    points: 10,
    unlocked: false,
    category: 'love'
  },
  {
    id: 'timeline-view',
    title: 'Memory Keeper',
    description: 'Viewed your timeline',
    icon: '📜',
    points: 25,
    unlocked: false,
    category: 'memory'
  },
  {
    id: 'chat-message',
    title: 'Sweet Words',
    description: 'Sent your first sweet message',
    icon: '💌',
    points: 30,
    unlocked: false,
    category: 'love'
  },
  {
    id: 'video-watch',
    title: 'Memory Keeper',
    description: 'Watched your memories together',
    icon: '🎬',
    points: 40,
    unlocked: false,
    category: 'memory'
  },
  {
    id: 'spell-cast',
    title: 'Wizard of Love',
    description: 'Cast your first love spell',
    icon: '🪄',
    points: 50,
    unlocked: false,
    category: 'magic'
  },
  {
    id: 'potion-brew',
    title: 'Potion Master',
    description: 'Brewed a love potion',
    icon: '🧪',
    points: 60,
    unlocked: false,
    category: 'magic'
  },
  {
    id: 'house-sorted',
    title: 'Hogwarts Student',
    description: 'Got sorted into a house',
    icon: '🎩',
    points: 35,
    unlocked: false,
    category: 'magic'
  },
  {
    id: 'montage-view',
    title: 'Storyteller',
    description: 'Watched the movie montage',
    icon: '🎞️',
    points: 45,
    unlocked: false,
    category: 'memory'
  },
  {
    id: '100-points',
    title: 'Growing Affection',
    description: 'Reached 100 love points',
    icon: '💕',
    points: 0,
    unlocked: false,
    category: 'love'
  },
  {
    id: '500-points',
    title: 'Deep Connection',
    description: 'Reached 500 love points',
    icon: '💖',
    points: 0,
    unlocked: false,
    category: 'love'
  },
  {
    id: '1000-points',
    title: 'Soulmates',
    description: 'Reached 1000 love points',
    icon: '💝',
    points: 0,
    unlocked: false,
    category: 'love'
  }
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalPoints, setTotalPoints] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lovePoints');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('achievements');
      if (saved) {
        const savedAchievements = JSON.parse(saved);
        return DEFAULT_ACHIEVEMENTS.map(ach => {
          const saved = savedAchievements.find((s: Achievement) => s.id === ach.id);
          return saved ? { ...ach, ...saved } : ach;
        });
      }
    }
    return DEFAULT_ACHIEVEMENTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lovePoints', totalPoints.toString());
    }
  }, [totalPoints]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('achievements', JSON.stringify(achievements));
    }
  }, [achievements]);

  const addPoints = useCallback((points: number) => {
    setTotalPoints(prev => prev + points);
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === achievementId && !ach.unlocked) {
        return {
          ...ach,
          unlocked: true,
          unlockedDate: new Date()
        };
      }
      return ach;
    }));
  }, []);

  const checkAndUnlockAchievements = useCallback(() => {
    // Check point-based achievements
    if (totalPoints >= 1000 && !achievements.find(a => a.id === '1000-points')?.unlocked) {
      unlockAchievement('1000-points');
      addPoints(100);
    } else if (totalPoints >= 500 && !achievements.find(a => a.id === '500-points')?.unlocked) {
      unlockAchievement('500-points');
      addPoints(50);
    } else if (totalPoints >= 100 && !achievements.find(a => a.id === '100-points')?.unlocked) {
      unlockAchievement('100-points');
      addPoints(25);
    }
  }, [totalPoints, achievements, unlockAchievement, addPoints]);

  useEffect(() => {
    checkAndUnlockAchievements();
  }, [totalPoints, checkAndUnlockAchievements]);

  return (
    <GamificationContext.Provider
      value={{
        totalPoints,
        achievements,
        addPoints,
        unlockAchievement,
        checkAndUnlockAchievements
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};
