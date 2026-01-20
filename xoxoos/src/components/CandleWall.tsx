import React, { useEffect, useRef } from 'react';

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
      glow: number;
    }> = [];

    const candleCount = Math.floor((canvas.width / 80) * intensity);
    for (let i = 0; i < candleCount; i++) {
      candles.push({
        x: (canvas.width / candleCount) * i + canvas.width / candleCount / 2,
        y: canvas.height - 30,
        height: 100 + Math.random() * 60,
        flicker: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        glow: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      candles.forEach(candle => {
        candle.flicker += candle.speed;
        candle.glow += 0.01;

        // Draw candle glow on wall
        const glowGradient = ctx.createRadialGradient(
          candle.x,
          candle.y - candle.height,
          0,
          candle.x,
          candle.y - candle.height,
          150 + Math.sin(candle.glow) * 30
        );
        glowGradient.addColorStop(0, `rgba(255, 235, 59, ${0.4 + Math.sin(candle.glow) * 0.2})`);
        glowGradient.addColorStop(0.5, `rgba(255, 152, 0, ${0.2 + Math.sin(candle.glow) * 0.1})`);
        glowGradient.addColorStop(1, 'rgba(255, 152, 0, 0)');

        ctx.fillStyle = glowGradient;
        ctx.fillRect(candle.x - 200, 0, 400, canvas.height);

        // Draw candle
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(candle.x - 10, candle.y - candle.height, 20, candle.height);

        // Draw flame
        const flickerOffset = Math.sin(candle.flicker) * 4;
        const flameHeight = 25 + Math.sin(candle.flicker * 2) * 8;

        const flameGradient = ctx.createRadialGradient(
          candle.x + flickerOffset,
          candle.y - candle.height - flameHeight / 2,
          0,
          candle.x + flickerOffset,
          candle.y - candle.height - flameHeight / 2,
          flameHeight
        );
        flameGradient.addColorStop(0, '#ffeb3b');
        flameGradient.addColorStop(0.3, '#ff9800');
        flameGradient.addColorStop(0.7, '#ff5722');
        flameGradient.addColorStop(1, 'rgba(255, 87, 34, 0)');

        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.ellipse(
          candle.x + flickerOffset,
          candle.y - candle.height - flameHeight / 2,
          10,
          flameHeight,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        pointerEvents: 'none',
        mixBlendMode: 'screen'
      }}
    />
  );
};
