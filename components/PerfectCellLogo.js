'use client';

import React, { useState, useEffect, useRef } from 'react';

export function PerfectCellLogo() {
  const [isJumping, setIsJumping] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [isSmiling, setIsSmiling] = useState(false);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const logoRef = useRef(null);

  // Update logo position for fixed effects
  useEffect(() => {
    if (logoRef.current && (hearts.length > 0 || isJumping)) {
      const rect = logoRef.current.getBoundingClientRect();
      setLogoPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, [hearts, isJumping]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger jump
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 800);

    // ALWAYS show smile AND hearts!
    setIsSmiling(true);
    setTimeout(() => setIsSmiling(false), 1200);

    // Generate MORE hearts (5 instead of 3!)
    const newHearts = [
      { id: Date.now() + 1, delay: 0, offset: -15 },
      { id: Date.now() + 2, delay: 0.1, offset: 15 },
      { id: Date.now() + 3, delay: 0.2, offset: 0 },
      { id: Date.now() + 4, delay: 0.15, offset: -25 },
      { id: Date.now() + 5, delay: 0.25, offset: 25 }
    ];
    setHearts(newHearts);
    
    setTimeout(() => {
      setHearts([]);
    }, 2000);

    // Play happy sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(700, audioContext.currentTime + 0.1);
      oscillator.frequency.linearRampToValueAtTime(900, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.35);
      
      oscillator.type = 'sine';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.35);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  return (
    <>
      {/* Fixed container for hearts - prevents clipping on mobile */}
      {hearts.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
            overflow: 'visible'
          }}
        >
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute text-3xl"
              style={{
                left: `${logoPosition.x + heart.offset}px`,
                top: `${logoPosition.y - 20}px`,
                transform: 'translate(-50%, 0)',
                animation: `heart-float-super 1.8s ease-out forwards`,
                animationDelay: `${heart.delay}s`,
                textShadow: '0 0 10px rgba(34, 197, 94, 0.8)'
              }}
            >
              💚
            </div>
          ))}
        </div>
      )}

      {/* Fixed container for sparkles - prevents clipping */}
      {isJumping && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9998,
            overflow: 'visible'
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-yellow-400 text-xl"
              style={{
                left: `${logoPosition.x}px`,
                top: `${logoPosition.y}px`,
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-30px)`,
                animation: 'sparkle-pop 0.6s ease-out forwards',
                animationDelay: `${i * 0.05}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <div 
        ref={logoRef}
        className={`relative w-10 h-10 pixel-art cursor-pointer ${isJumping ? '' : 'animate-float'}`}
        onClick={handleClick}
        style={{
          animation: isJumping ? 'cell-super-jump 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : undefined,
          transition: 'transform 0.3s ease'
        }}
      >
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Perfect Cell inspired pixel art */}
          {/* Head outline - green */}
          <rect x="10" y="4" width="12" height="2" fill="#22c55e" />
          <rect x="8" y="6" width="16" height="2" fill="#22c55e" />
          <rect x="6" y="8" width="20" height="12" fill="#22c55e" />
          <rect x="8" y="20" width="16" height="2" fill="#22c55e" />
          <rect x="10" y="22" width="12" height="2" fill="#22c55e" />
          
          {/* Face - darker green */}
          <rect x="8" y="8" width="16" height="10" fill="#15803d" />
          
          {/* Eyes - glowing green (animated when smiling) */}
          {isSmiling ? (
            <>
              {/* BIG Happy eyes - curved */}
              <rect x="10" y="12" width="4" height="2" fill="#4ade80" className="animate-pulse" />
              <rect x="18" y="12" width="4" height="2" fill="#4ade80" className="animate-pulse" />
            </>
          ) : (
            <>
              {/* Normal eyes */}
              <rect x="11" y="11" width="3" height="3" fill="#4ade80" className="animate-pulse" />
              <rect x="18" y="11" width="3" height="3" fill="#4ade80" className="animate-pulse" />
            </>
          )}
          
          {/* Mouth/expression */}
          {isSmiling ? (
            <>
              {/* BIGGER smile */}
              <rect x="11" y="16" width="2" height="1" fill="#86efac" />
              <rect x="12" y="17" width="7" height="1" fill="#86efac" />
              <rect x="19" y="16" width="2" height="1" fill="#86efac" />
              <rect x="13" y="18" width="5" height="1" fill="#86efac" />
            </>
          ) : (
            <>
              {/* Normal mouth */}
              <rect x="13" y="16" width="6" height="1" fill="#86efac" />
            </>
          )}
          
          {/* Spots/details - yellow-green (pulse when smiling) */}
          <rect x="10" y="9" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="21" y="9" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="9" y="13" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="22" y="13" width="1" height="1" fill="#a3e635" className={isSmiling ? 'animate-pulse' : ''} />
          
          {/* Antennae - pulse faster when happy */}
          <rect x="12" y="2" width="2" height="2" fill="#22c55e" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="18" y="2" width="2" height="2" fill="#22c55e" className={isSmiling ? 'animate-pulse' : ''} />
          <rect x="13" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
          <rect x="19" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
        </svg>

        {/* Glow effect when clicked */}
        {isJumping && (
          <div 
            className="absolute inset-0 rounded-full bg-bio-green-500 blur-lg pointer-events-none"
            style={{ animation: 'glow-burst 0.8s ease-out forwards' }}
          />
        )}

        {/* Hover glow */}
        <div className="absolute inset-0 rounded-full bg-bio-green-500 opacity-0 hover:opacity-30 blur-md transition-opacity duration-300 pointer-events-none" />
      </div>

      <style jsx global>{`
        @keyframes cell-super-jump {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          25% {
            transform: translateY(-25px) rotate(-15deg) scale(1.2);
          }
          50% {
            transform: translateY(-35px) rotate(10deg) scale(1.25);
          }
          65% {
            transform: translateY(-20px) rotate(-8deg) scale(1.15);
          }
          80% {
            transform: translateY(-8px) rotate(5deg) scale(1.05);
          }
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
        }

        @keyframes heart-float-super {
          0% {
            transform: translate(-50%, 0) scale(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -10px) scale(1) rotate(10deg);
          }
          100% {
            transform: translate(-50%, -80px) scale(1.3) rotate(-20deg);
            opacity: 0;
          }
        }

        @keyframes sparkle-pop {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg) translateY(-20px) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(45deg) translateY(-50px) scale(1.5);
          }
        }

        @keyframes glow-burst {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(3);
          }
        }
      `}</style>
    </>
  );
}
