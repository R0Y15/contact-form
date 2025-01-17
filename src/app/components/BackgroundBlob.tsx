'use client';

import { useEffect, useState } from 'react';

export default function BackgroundBlob() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Add some lag to make movement smoother
      const lag = 0.5;
      setPosition(prev => ({
        x: prev.x + (e.clientX - prev.x) * lag,
        y: prev.y + (e.clientY - prev.y) * lag,
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 transition-opacity bg-white"
      aria-hidden="true"
    >
      <div
        className="absolute blur-[120px] opacity-40"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #F9A8D4)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          transform: `translate(${position.x - 300}px, ${position.y - 300}px)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
} 