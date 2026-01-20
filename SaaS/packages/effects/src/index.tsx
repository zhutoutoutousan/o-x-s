import React from 'react';
import { CandleWall } from './CandleWall';
import { FireWall } from './FireWall';
import './Effects.css';

export interface EffectsProps {
  type: 'candles' | 'fire' | 'both';
  intensity?: number;
  className?: string;
}

export const Effects: React.FC<EffectsProps> = ({
  type,
  intensity = 1,
  className = ''
}) => {
  return (
    <div className={`effects-container ${className}`}>
      {(type === 'candles' || type === 'both') && (
        <CandleWall intensity={intensity} />
      )}
      {(type === 'fire' || type === 'both') && (
        <FireWall intensity={intensity} />
      )}
    </div>
  );
};

export { CandleWall } from './CandleWall';
export { FireWall } from './FireWall';
