'use client';

import React, { useState } from 'react';

export function PerfectCellLogo() {
  const [isJumping, setIsJumping] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [isSmiling, setIsSmiling] = useState(false);
  const [hearts, setHearts] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger jump
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);

    // Random action: smile or hearts
    const action = Math.random();
    
    if (action < 0.5) {
      // Show smile
      setIsSmiling(true);
      setTimeout(() => setIsSmiling(false), 1000);
    } else {
      // Show hearts
      setShowHearts(true);
      const newHearts = [
        { id: Date.now() + 1, delay: 0 },
        { id: Date.now() + 2, delay: 0.1 },
        { id: Date.now() + 3, delay: 0.2 }
      ];
      setHearts(newHearts);
      
      setTimeout(() => {
        setShowHearts(false);
        setHearts([]);
      }, 1500);
    }

    // Play happy sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a cheerful beep
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Happy ascending tones
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.linearRampToValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.type = 'sine';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  return (
    <div 
      className={`relative w-10 h-10 pixel-art cursor-pointer ${isJumping ? '' : 'animate-float'}`}
      onClick={handleClick}
      style={{
        animation: isJumping ? 'cell-jump 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : undefined,
        transition: 'transform 0.3s ease'
      }}
    >
      {/* Flying Hearts */}
      {showHearts && hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-2xl"
          style={{
            left: '50%',
            top: '-10px',
            transform: 'translateX(-50%)',
            animation: `heart-float 1.5s ease-out forwards`,
            animationDelay: `${heart.delay}s`,
            pointerEvents: 'none'
          }}
        >
          💚
        </div>
      ))}

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
            {/* Happy eyes - curved */}
            <rect x="11" y="12" width="3" height="2" fill="#4ade80" className="animate-pulse" />
            <rect x="18" y="12" width="3" height="2" fill="#4ade80" className="animate-pulse" />
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
            {/* Big smile */}
            <rect x="12" y="16" width="2" height="1" fill="#86efac" />
            <rect x="13" y="17" width="4" height="1" fill="#86efac" />
            <rect x="18" y="16" width="2" height="1" fill="#86efac" />
          </>
        ) : (
          <>
            {/* Normal mouth */}
            <rect x="13" y="16" width="6" height="1" fill="#86efac" />
          </>
        )}
        
        {/* Spots/details - yellow-green */}
        <rect x="10" y="9" width="1" height="1" fill="#a3e635" />
        <rect x="21" y="9" width="1" height="1" fill="#a3e635" />
        <rect x="9" y="13" width="1" height="1" fill="#a3e635" />
        <rect x="22" y="13" width="1" height="1" fill="#a3e635" />
        
        {/* Antennae */}
        <rect x="12" y="2" width="2" height="2" fill="#22c55e" />
        <rect x="18" y="2" width="2" height="2" fill="#22c55e" />
        <rect x="13" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
        <rect x="19" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
      </svg>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-full bg-bio-green-500 opacity-0 hover:opacity-20 blur-md transition-opacity duration-300 pointer-events-none" />

      <style jsx>{`
        @keyframes cell-jump {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          30% {
            transform: translateY(-20px) rotate(-10deg) scale(1.1);
          }
          50% {
            transform: translateY(-30px) rotate(5deg) scale(1.15);
          }
          70% {
            transform: translateY(-15px) rotate(-5deg) scale(1.05);
          }
          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
        }

        @keyframes heart-float {
          0% {
            transform: translateX(-50%) translateY(0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(-60px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
