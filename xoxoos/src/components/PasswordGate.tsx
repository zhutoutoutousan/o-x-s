'use client';

import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
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
      <div className="gate-container">
        <div className="gate-content">
          <h1 className="gate-title">
            Arrival
          </h1>
          
          <p className="gate-subtitle">
            Time is not a line, but a circle.
          </p>

          <p className="gate-description">
            To access this story, you must understand the language of time.
            <br />
            <span className="hint">The first picture sent via IM holds the key.</span>
          </p>

          <form onSubmit={handleSubmit} className="password-form">
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
              autoComplete="off"
            />
            
            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <button type="submit" className="password-submit">
              Begin
            </button>
          </form>

          {attempts > 0 && (
            <p className="attempts-hint">
              Attempts: {attempts}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
