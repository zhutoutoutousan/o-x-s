import React, { useEffect, useRef } from 'react';
import './CandleWall.css';

interface CandleWallProps {
  intensity?: number;
}

export const CandleWall: React.FC<CandleWallProps> = ({ intensity = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const candles: Array<{
      x: number;
      y: number;
      height: number;
      flicker: number;
      speed: number;
    }> = [];

    const candleCount = Math.floor((canvas.width / 100) * intensity);
    for (let i = 0; i < candleCount; i++) {
      candles.push({
        x: (canvas.width / candleCount) * i + canvas.width / candleCount / 2,
        y: canvas.height - 50,
        height: 80 + Math.random() * 40,
        flicker: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03
      });
    }

    const animate = () => {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      candles.forEach(candle => {
        candle.flicker += candle.speed;

        // Draw candle
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(candle.x - 8, candle.y - candle.height, 16, candle.height);

        // Draw flame
        const flickerOffset = Math.sin(candle.flicker) * 3;
        const flameHeight = 20 + Math.sin(candle.flicker * 2) * 5;

        const gradient = ctx.createRadialGradient(
          candle.x + flickerOffset,
          candle.y - candle.height - flameHeight / 2,
          0,
          candle.x + flickerOffset,
          candle.y - candle.height - flameHeight / 2,
          flameHeight
        );
        gradient.addColorStop(0, '#ffeb3b');
        gradient.addColorStop(0.5, '#ff9800');
        gradient.addColorStop(1, 'rgba(255, 152, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(
          candle.x + flickerOffset,
          candle.y - candle.height - flameHeight / 2,
          8,
          flameHeight,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Draw glow
        const glowGradient = ctx.createRadialGradient(
          candle.x,
          candle.y - candle.height,
          0,
          candle.x,
          candle.y - candle.height,
          60
        );
        glowGradient.addColorStop(0, 'rgba(255, 235, 59, 0.3)');
        glowGradient.addColorStop(1, 'rgba(255, 235, 59, 0)');

        ctx.fillStyle = glowGradient;
        ctx.fillRect(candle.x - 60, candle.y - candle.height - 60, 120, 120);
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="candle-wall"
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
    />
  );
};
