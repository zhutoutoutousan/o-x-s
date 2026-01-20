import React, { useEffect, useRef } from 'react';
import './FireWall.css';

interface FireWallProps {
  intensity?: number;
}

export const FireWall: React.FC<FireWallProps> = ({ intensity = 1 }) => {
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

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
    }> = [];

    const createParticle = () => {
      const x = Math.random() * canvas.width;
      return {
        x,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 3,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        size: 10 + Math.random() * 15
      };
    };

    for (let i = 0; i < 50 * intensity; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.1;
        p.life++;

        if (p.life >= p.maxLife || p.y < 0) {
          particles[i] = createParticle();
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = 1 - lifeRatio;
        const size = p.size * (1 - lifeRatio * 0.5);

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, size
        );
        gradient.addColorStop(0, `rgba(255, ${100 + lifeRatio * 155}, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(255, ${50 + lifeRatio * 100}, 0, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(139, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

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
      className="fire-wall"
      style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
    />
  );
};
