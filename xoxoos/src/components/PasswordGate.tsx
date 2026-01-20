'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PasswordGate.css';

interface PasswordGateProps {
  onUnlock: () => void;
}

const CORRECT_PASSWORD = '7C40-6A1B-7C4E-CBE8';

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already unlocked in this session
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem('arrival_unlocked');
      if (unlocked === 'true') {
        setIsUnlocked(true);
        onUnlock();
      }
    }
  }, [onUnlock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.trim() === CORRECT_PASSWORD) {
      setIsUnlocked(true);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('arrival_unlocked', 'true');
      }
      setError('');
      setTimeout(() => {
        onUnlock();
      }, 500);
    } else {
      setAttempts(prev => prev + 1);
      setError('Incorrect. The answer lies in the first picture sent via IM.');
      setPassword('');
    }
  };

  if (isUnlocked) {
    return null;
  }

  return (
    <div className="password-gate">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gate-container"
      >
        <div className="gate-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gate-title"
          >
            Arrival
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="gate-subtitle"
          >
            Time is not a line, but a circle.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="gate-description"
          >
            To access this story, you must understand the language of time.
            <br />
            <span className="hint">The first picture sent via IM holds the key.</span>
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            onSubmit={handleSubmit}
            className="password-form"
          >
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter the code"
              className="password-input"
              autoFocus
            />
            
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="error-message"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="password-submit"
            >
              Begin
            </motion.button>
          </motion.form>

          {attempts > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="attempts-hint"
            >
              Attempts: {attempts}
            </motion.p>
          )}
        </div>

          {mounted && (
            <div className="gate-particles">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="particle"
                  initial={{
                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
                    opacity: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}
      </motion.div>
    </div>
  );
};
