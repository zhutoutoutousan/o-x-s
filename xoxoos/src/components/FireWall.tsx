import React, { useEffect, useRef } from 'react';

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
      baseX: number;
    }> = [];

    const createParticle = (baseX?: number) => {
      const x = baseX !== undefined ? baseX : Math.random() * canvas.width;
      return {
        x,
        baseX: x,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: -3 - Math.random() * 4,
        life: 0,
        maxLife: 80 + Math.random() * 60,
        size: 15 + Math.random() * 20
      };
    };

    // Create fire sources along the bottom
    const fireSources = 8;
    for (let i = 0; i < fireSources; i++) {
      const baseX = (canvas.width / fireSources) * i + canvas.width / fireSources / 2;
      for (let j = 0; j < 15 * intensity; j++) {
        particles.push(createParticle(baseX));
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Sway back towards base position
        p.x += (p.baseX - p.x) * 0.05;
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.15;
        p.life++;

        if (p.life >= p.maxLife || p.y < -50) {
          particles[i] = createParticle(p.baseX);
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = (1 - lifeRatio) * 0.8;
        const size = p.size * (1 - lifeRatio * 0.6);

        // Create fire gradient
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, size
        );
        gradient.addColorStop(0, `rgba(255, ${200 + lifeRatio * 55}, 0, ${alpha})`);
        gradient.addColorStop(0.3, `rgba(255, ${150 + lifeRatio * 105}, 0, ${alpha * 0.8})`);
        gradient.addColorStop(0.6, `rgba(255, 50, 0, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(139, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Add wall lighting effect
        if (p.y < canvas.height * 0.3) {
          const wallGradient = ctx.createLinearGradient(
            p.x - size, 0,
            p.x + size, 0
          );
          wallGradient.addColorStop(0, `rgba(255, ${150 + lifeRatio * 105}, 0, ${alpha * 0.3})`);
          wallGradient.addColorStop(0.5, `rgba(255, ${200 + lifeRatio * 55}, 0, ${alpha * 0.5})`);
          wallGradient.addColorStop(1, `rgba(255, ${150 + lifeRatio * 105}, 0, ${alpha * 0.3})`);

          ctx.fillStyle = wallGradient;
          ctx.fillRect(p.x - size, 0, size * 2, canvas.height * 0.3);
        }
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2,
        pointerEvents: 'none',
        mixBlendMode: 'screen'
      }}
    />
  );
};
