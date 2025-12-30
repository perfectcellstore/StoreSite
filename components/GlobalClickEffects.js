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

      // Random chance for lightning flash (30% chance - increased!)
      if (Math.random() < 0.3) {
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
      }

      // Remove spark after animation
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== spark.id));
      }, 800);

      // Play Dragon Ball vanishing sound effect
      try {
        // Create audio context for better control
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create oscillator for the "whoosh" sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Start with high frequency and quickly drop (vanishing effect)
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        
        // Volume envelope
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.type = 'sine';
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        console.log('Audio not supported');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {/* Lightning Flash Effect */}
      {flash && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <div className="absolute inset-0 bg-bio-green-500 opacity-20 animate-lightning-flash" />
        </div>
      )}

      {/* Spark Effects */}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: spark.x,
            top: spark.y,
            transform: 'translate(-50%, -50%)', // CENTER THE EFFECT!
          }}
        >
          {/* Expanding Energy Wave */}
          <div className="absolute">
            <div 
              className="w-4 h-4 bg-bio-green-500 rounded-full blur-md"
              style={{ animation: 'energy-expand 0.8s ease-out forwards' }}
            />
          </div>

          {/* Central Bright Flash */}
          <div className="absolute">
            <div 
              className="w-6 h-6 bg-white rounded-full"
              style={{ 
                animation: 'flash-fade 0.3s ease-out forwards',
                boxShadow: '0 0 20px 10px rgba(34, 197, 94, 0.8)'
              }}
            />
          </div>

          {/* Multiple Energy Rings */}
          {[...Array(3)].map((_, ringIdx) => (
            <div
              key={`ring-${ringIdx}`}
              className="absolute border-2 border-bio-green-400 rounded-full"
              style={{
                animation: `ring-expand-${ringIdx} 0.8s ease-out forwards`,
                animationDelay: `${ringIdx * 0.1}s`,
                opacity: 1 - (ringIdx * 0.2)
              }}
            />
          ))}

          {/* 12-Point Star Sparks (more impressive!) */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`spark-${i}`}
              className="absolute"
              style={{
                transform: `rotate(${i * 30}deg)`,
              }}
            >
              <div
                className="w-1.5 h-1.5 bg-bio-green-400 rounded-full"
                style={{
                  animation: `spark-shoot 0.6s ease-out forwards`,
                  animationDelay: `${i * 0.02}s`,
                  boxShadow: '0 0 4px 2px rgba(34, 197, 94, 0.6)'
                }}
              />
            </div>
          ))}

          {/* Energy Particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg)`,
                animation: `particle-burst 0.7s ease-out forwards`,
                animationDelay: `${i * 0.03}s`
              }}
            />
          ))}

          {/* Rotating Energy Aura */}
          <div 
            className="absolute w-16 h-16 border-2 border-bio-green-300 rounded-full"
            style={{ 
              animation: 'aura-spin 0.8s ease-out forwards',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)'
            }}
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes energy-expand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(20);
            opacity: 0;
          }
        }

        @keyframes flash-fade {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes ring-expand-0 {
          0% {
            width: 20px;
            height: 20px;
            margin: -10px;
            opacity: 1;
          }
          100% {
            width: 120px;
            height: 120px;
            margin: -60px;
            opacity: 0;
          }
        }

        @keyframes ring-expand-1 {
          0% {
            width: 20px;
            height: 20px;
            margin: -10px;
            opacity: 1;
          }
          100% {
            width: 150px;
            height: 150px;
            margin: -75px;
            opacity: 0;
          }
        }

        @keyframes ring-expand-2 {
          0% {
            width: 20px;
            height: 20px;
            margin: -10px;
            opacity: 1;
          }
          100% {
            width: 180px;
            height: 180px;
            margin: -90px;
            opacity: 0;
          }
        }

        @keyframes spark-shoot {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes particle-burst {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) scale(0);
            opacity: 0;
          }
        }

        @keyframes aura-spin {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(4) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes lightning-flash {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </>
  );
}
