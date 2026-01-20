'use client';

import React from 'react';
import { motion } from 'framer-motion';
import './LoadingMemories.css';

export const LoadingMemories: React.FC = () => {
  return (
    <div className="loading-memories">
      <div className="loading-container">
        {/* Circular time symbols */}
        <div className="time-circle">
          <motion.div
            className="circle-ring ring-1"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="circle-ring ring-2"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="circle-ring ring-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Tear drops */}
        <div className="tear-drops">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="tear-drop"
              style={{
                left: `${(i * 8.33) % 100}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, 100, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Glowing particles */}
        <div className="glow-particles">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="glow-particle"
              style={{
                left: `${20 + (i * 10)}%`,
                top: `${30 + (i % 4) * 20}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Text */}
        <motion.div
          className="loading-text-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="loading-title"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Accessing Memories
          </motion.h2>
          <motion.p
            className="loading-subtitle"
            animate={{
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            Across time and space...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
