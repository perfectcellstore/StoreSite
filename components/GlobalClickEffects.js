'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useEffects } from '@/lib/contexts/EffectsContext';

export function GlobalClickEffects() {
  const { effectsEnabled } = useEffects();
  const audioContextRef = useRef(null);
  const lastSoundTime = useRef(0);
  const soundCooldown = 100; // Only play sound every 100ms max

  // Initialize AudioContext once and reuse it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.log('Audio not supported');
      }
    }
  }, []);

  const playSound = useCallback(() => {
    if (!audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      const now = Date.now();
      
      // Throttle sound to prevent audio stacking
      if (now - lastSoundTime.current < soundCooldown) return;
      lastSoundTime.current = now;

      // Main whoosh oscillator
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      
      // Main frequency sweep (sharp drop like instant transmission)
      oscillator1.frequency.setValueAtTime(2000, audioContext.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.3);
      
      // Volume envelope
      gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode1.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      // Use sawtooth for "electric" feel
      oscillator1.type = 'sawtooth';
      
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      // Don't create effects if disabled
      if (!effectsEnabled) return;
      
      // Only play sound, no visual effects that cause re-renders
      playSound();
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [effectsEnabled, playSound]);

  // No render output - no visual effects that cause performance issues
  return null;
}

  return (
    <>
      {/* Lightning Flash Effect - Ultra-Reduced Intensity */}
      {flash && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <div className="absolute inset-0 bg-gradient-to-r from-bio-green-400 via-yellow-300 to-bio-green-400 opacity-[0.02]" 
               style={{ animation: 'lightning-flash 0.1s ease-out' }} />
        </div>
      )}

      {/* Spark Effects - Responsive */}
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: spark.x,
            top: spark.y,
            transform: `translate(-50%, -50%) scale(${spark.scale})`,
          }}
        >
          {/* Central Flash - Responsive Size */}
          <div className="absolute">
            <div 
              className="w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full"
              style={{ 
                animation: 'super-flash 0.4s ease-out forwards',
                boxShadow: '0 0 15px 8px rgba(255, 255, 100, 0.5), 0 0 25px 12px rgba(34, 197, 94, 0.4)'
              }}
            />
          </div>

          {/* Expanding Energy Shockwave - Responsive */}
          <div className="absolute">
            <div 
              className="w-3 h-3 sm:w-5 sm:h-5 bg-yellow-400 rounded-full blur-sm opacity-60"
              style={{ animation: 'shockwave-expand 1s ease-out forwards' }}
            />
          </div>

          {/* Multiple Colored Energy Rings - Responsive */}
          {[...Array(4)].map((_, ringIdx) => (
            <div
              key={`ring-${ringIdx}`}
              className="absolute border-2 rounded-full"
              style={{
                borderColor: ringIdx % 2 === 0 ? '#22c55e' : '#fbbf24',
                animation: `ring-expand-responsive-${ringIdx} 1s ease-out forwards`,
                animationDelay: `${ringIdx * 0.08}s`,
              }}
            />
          ))}

          {/* 12-Point Star Burst - Reduced for mobile */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`spark-${i}`}
              className="absolute"
              style={{
                transform: `rotate(${i * 30}deg)`,
              }}
            >
              <div
                className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#22c55e' : '#fbbf24',
                  animation: `spark-shoot-responsive 0.8s ease-out forwards`,
                  animationDelay: `${i * 0.02}s`,
                  boxShadow: `0 0 4px 2px ${i % 2 === 0 ? 'rgba(34, 197, 94, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`
                }}
              />
            </div>
          ))}

          {/* Energy Particles - Responsive */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
              style={{
                background: ['#22c55e', '#fbbf24', '#86efac', '#fcd34d'][i % 4],
                transform: `rotate(${i * 45}deg)`,
                animation: `particle-burst-responsive 0.9s ease-out forwards`,
                animationDelay: `${i * 0.025}s`,
                boxShadow: '0 0 3px 1px rgba(255, 255, 255, 0.3)'
              }}
            />
          ))}

          {/* Electric Sparks - Responsive */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`electric-${i}`}
              className="absolute w-0.5 h-3 sm:h-4 bg-white opacity-60"
              style={{
                transform: `rotate(${i * 60}deg)`,
                animation: `electric-spark 0.5s ease-out forwards`,
                animationDelay: `${i * 0.03}s`,
                boxShadow: '0 0 5px 2px rgba(255, 255, 255, 0.4)'
              }}
            />
          ))}
        </div>
      ))}

      <style jsx>{`
        @keyframes super-flash {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes shockwave-expand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(20);
            opacity: 0;
          }
        }

        /* Responsive ring animations - scaled for all devices */
        @keyframes ring-expand-responsive-0 {
          0% {
            width: 20px;
            height: 20px;
            margin: -10px;
            opacity: 1;
          }
          100% {
            width: min(120px, 30vw);
            height: min(120px, 30vw);
            margin: min(-60px, -15vw);
            opacity: 0;
          }
        }

        @keyframes ring-expand-responsive-1 {
          0% {
            width: 20px;
            height: 20px;
            margin: -10px;
            opacity: 1;
          }
          100% {
            width: min(150px, 40vw);
            height: min(150px, 40vw);
            margin: min(-75px, -20vw);
            opacity: 0;
          }
        }

        @keyframes ring-expand-responsive-2 {
          0% {
            width: 20px;
            height: 20px;
            margin: -10px;
            opacity: 1;
          }
          100% {
            width: min(180px, 50vw);
            height: min(180px, 50vw);
            margin: min(-90px, -25vw);
            opacity: 0;
          }
        }

        @keyframes ring-expand-responsive-3 {
          0% {
            width: 20px;
            height: 20px;
            margin: -10px;
            opacity: 1;
          }
          100% {
            width: min(210px, 60vw);
            height: min(210px, 60vw);
            margin: min(-105px, -30vw);
            opacity: 0;
          }
        }

        @keyframes spark-shoot-responsive {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(min(-60px, -15vw)) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes particle-burst-responsive {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(min(-50px, -12vw)) scale(0);
            opacity: 0;
          }
        }

        @keyframes electric-spark {
          0% {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
          100% {
            transform: translateY(min(-30px, -8vw)) scaleY(2);
            opacity: 0;
          }
        }

        @keyframes lightning-flash {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.08;
          }
        }
      `}</style>
    </>
  );
}
