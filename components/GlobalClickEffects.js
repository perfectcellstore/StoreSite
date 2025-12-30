'use client';

import React, { useEffect, useState } from 'react';

export function GlobalClickEffects() {
  const [sparks, setSparks] = useState([]);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      // Create spark effect
      const spark = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      
      setSparks(prev => [...prev, spark]);

      // Random chance for lightning flash (20% chance)
      if (Math.random() < 0.2) {
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }

      // Remove spark after animation
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== spark.id));
      }, 600);

      // Play spark sound (optional)
      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZRQ0PVKzn77BdGAg+ltryxnMnBSl+zPDajzsIGGS57OihUBALTaLj8bllHAU2jdXzzn4tBSt7yfDekjwJFmS67OmiUBALTKPj8LllHAU2jdXzzn4tBSt7yfDekjwJFmS67OmiUBALTKPj8LllHAU2jdXzzn4tBSt7yfDekjwJFmS67OmiUBALTKPj8LllHAU2jdXzzn4tBQ==');
        audio.volume = 0.1;
        audio.play().catch(() => {});
      } catch (e) {}
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {/* Lightning Flash Effect */}
      {flash && <div className="lightning-effect" />}

      {/* Spark Effects */}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: spark.x,
            top: spark.y,
          }}
        >
          {/* Central Burst */}
          <div className="absolute -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-bio-green-500 rounded-full animate-ping opacity-75" />
          </div>

          {/* Radial Sparks */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-bio-green-400 rounded-full"
              style={{
                left: '0',
                top: '0',
                transform: `rotate(${i * 45}deg) translateY(-20px)`,
                animation: `spark-fade 0.6s ease-out forwards`,
                animationDelay: `${i * 0.02}s`
              }}
            />
          ))}

          {/* Energy Ring */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-bio-green-400 rounded-full"
            style={{ animation: 'cell-spark 0.6s ease-out forwards' }}
          />

          {/* Inner Glow */}
          <div 
            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-bio-green-500 rounded-full blur-sm"
            style={{ animation: 'spark-burst 0.4s ease-out forwards' }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes spark-fade {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px);
          }
        }
      `}</style>
    </>
  );
}
