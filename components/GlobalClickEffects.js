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

      // 40% chance for lightning flash (even more impressive!)
      if (Math.random() < 0.4) {
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
      }

      // Remove spark after animation
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== spark.id));
      }, 1200);

      // Play AUTHENTIC Dragon Ball vanishing/instant transmission sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Main whoosh oscillator
        const oscillator1 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        
        // Secondary harmonic for richness
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        
        oscillator1.connect(gainNode1);
        gainNode1.connect(audioContext.destination);
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        
        // Main frequency sweep (sharp drop like instant transmission)
        oscillator1.frequency.setValueAtTime(2000, audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.4);
        
        // Secondary harmonic (adds depth)
        oscillator2.frequency.setValueAtTime(3000, audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(120, audioContext.currentTime + 0.4);
        
        // Volume envelopes
        gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode1.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.02);
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        // Use sawtooth for more "electric" feel
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'sine';
        
        oscillator1.start(audioContext.currentTime);
        oscillator2.start(audioContext.currentTime);
        oscillator1.stop(audioContext.currentTime + 0.4);
        oscillator2.stop(audioContext.currentTime + 0.4);
      } catch (e) {
        console.log('Audio not supported');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {/* Lightning Flash Effect - More Intense */}
      {flash && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <div className="absolute inset-0 bg-gradient-to-r from-bio-green-400 via-yellow-300 to-bio-green-400 opacity-25" 
               style={{ animation: 'lightning-flash 0.2s ease-out' }} />
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
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Central Flash - Reduced Brightness */}
          <div className="absolute">
            <div 
              className="w-6 h-6 bg-white rounded-full"
              style={{ 
                animation: 'super-flash 0.4s ease-out forwards',
                boxShadow: '0 0 20px 10px rgba(255, 255, 100, 0.5), 0 0 30px 15px rgba(34, 197, 94, 0.4)'
              }}
            />
          </div>

          {/* Expanding Energy Shockwave */}
          <div className="absolute">
            <div 
              className="w-6 h-6 bg-yellow-400 rounded-full blur-sm"
              style={{ animation: 'shockwave-expand 1s ease-out forwards' }}
            />
          </div>

          {/* Multiple Colored Energy Rings */}
          {[...Array(4)].map((_, ringIdx) => (
            <div
              key={`ring-${ringIdx}`}
              className="absolute border-2 rounded-full"
              style={{
                borderColor: ringIdx % 2 === 0 ? '#22c55e' : '#fbbf24',
                animation: `ring-expand-super-${ringIdx} 1s ease-out forwards`,
                animationDelay: `${ringIdx * 0.08}s`,
              }}
            />
          ))}

          {/* 16-Point Star Burst (MORE SPARKS!) */}
          {[...Array(16)].map((_, i) => (
            <div
              key={`spark-${i}`}
              className="absolute"
              style={{
                transform: `rotate(${i * 22.5}deg)`,
              }}
            >
              <div
                className={`w-2 h-2 rounded-full`}
                style={{
                  background: i % 2 === 0 ? '#22c55e' : '#fbbf24',
                  animation: `spark-shoot-super 0.8s ease-out forwards`,
                  animationDelay: `${i * 0.02}s`,
                  boxShadow: `0 0 8px 4px ${i % 2 === 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(251, 191, 36, 0.8)'}`
                }}
              />
            </div>
          ))}

          {/* Energy Particles with Color Variety */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                background: ['#22c55e', '#fbbf24', '#86efac', '#fcd34d'][i % 4],
                transform: `rotate(${i * 30}deg)`,
                animation: `particle-burst-super 0.9s ease-out forwards`,
                animationDelay: `${i * 0.025}s`,
                boxShadow: '0 0 6px 3px rgba(255, 255, 255, 0.5)'
              }}
            />
          ))}

          {/* Rotating Energy Spiral */}
          <div 
            className="absolute w-20 h-20 rounded-full"
            style={{ 
              animation: 'spiral-spin 1s ease-out forwards',
              background: 'conic-gradient(from 0deg, transparent, #22c55e, transparent, #fbbf24, transparent)',
              opacity: 0.6
            }}
          />

          {/* Dragon Ball Energy Aura */}
          <div 
            className="absolute w-24 h-24 border-4 border-bio-green-300 rounded-full"
            style={{ 
              animation: 'aura-pulse-super 1s ease-out forwards',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(251, 191, 36, 0.2) 50%, transparent 70%)',
              boxShadow: '0 0 30px 10px rgba(34, 197, 94, 0.4)'
            }}
          />

          {/* Electric Sparks */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`electric-${i}`}
              className="absolute w-1 h-6 bg-white"
              style={{
                transform: `rotate(${i * 45}deg)`,
                animation: `electric-spark 0.5s ease-out forwards`,
                animationDelay: `${i * 0.03}s`,
                boxShadow: '0 0 10px 4px rgba(255, 255, 255, 0.8)'
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
            transform: scale(5);
            opacity: 0;
          }
        }

        @keyframes shockwave-expand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(30);
            opacity: 0;
          }
        }

        @keyframes ring-expand-super-0 {
          0% {
            width: 30px;
            height: 30px;
            margin: -15px;
            opacity: 1;
          }
          100% {
            width: 160px;
            height: 160px;
            margin: -80px;
            opacity: 0;
          }
        }

        @keyframes ring-expand-super-1 {
          0% {
            width: 30px;
            height: 30px;
            margin: -15px;
            opacity: 1;
          }
          100% {
            width: 200px;
            height: 200px;
            margin: -100px;
            opacity: 0;
          }
        }

        @keyframes ring-expand-super-2 {
          0% {
            width: 30px;
            height: 30px;
            margin: -15px;
            opacity: 1;
          }
          100% {
            width: 240px;
            height: 240px;
            margin: -120px;
            opacity: 0;
          }
        }

        @keyframes ring-expand-super-3 {
          0% {
            width: 30px;
            height: 30px;
            margin: -15px;
            opacity: 1;
          }
          100% {
            width: 280px;
            height: 280px;
            margin: -140px;
            opacity: 0;
          }
        }

        @keyframes spark-shoot-super {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes particle-burst-super {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-70px) scale(0);
            opacity: 0;
          }
        }

        @keyframes spiral-spin {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(5) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes aura-pulse-super {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(5);
            opacity: 0;
          }
        }

        @keyframes electric-spark {
          0% {
            transform: translateY(0) scaleY(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scaleY(2);
            opacity: 0;
          }
        }

        @keyframes lightning-flash {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </>
  );
}
