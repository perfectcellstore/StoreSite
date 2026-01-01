'use client';

import React, { useState, useEffect } from 'react';

/**
 * Assassin's Creed Easter Egg - FIXED VERSION
 * 
 * Fixed:
 * 1. Accurate, recognizable symbols
 * 2. Position stability (no layout shifts)
 * 3. Correct quote logic (reversed)
 * 4. Smooth AC Rogue-style animation
 */
export function AssassinsCreedEasterEgg() {
  const [isTemplar, setIsTemplar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  const handleClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setShowQuote(false);

    // Toggle state
    setIsTemplar(!isTemplar);

    // Show quote after transformation completes
    setTimeout(() => {
      setShowQuote(true);
      setIsAnimating(false);
    }, prefersReducedMotion ? 300 : 700);

    // Hide quote after display time
    setTimeout(() => {
      setShowQuote(false);
    }, prefersReducedMotion ? 2300 : 3700);
  };

  const animationDuration = prefersReducedMotion ? '300ms' : '700ms';

  // CORRECTED LOGIC: Templar shows Templar quote, Assassin shows Assassin quote
  const currentQuote = isTemplar 
    ? '"May the Father of Understanding guide us."'  // Templar quote when showing Templar
    : '"Requiescat in pace."';  // Assassin quote when showing Assassin

  return (
    // Fixed-size container to prevent layout shifts
    <div className="flex flex-col items-center" style={{ width: '48px', height: '80px' }}>
      
      {/* Quote Display - Fixed height container (always present) */}
      <div 
        className="flex items-center justify-center"
        style={{ 
          height: '32px',
          width: '200px',
          marginBottom: '4px'
        }}
      >
        <p 
          className="text-xs text-gray-400 italic tracking-wide text-center px-2"
          style={{
            fontFamily: 'serif',
            opacity: showQuote ? 1 : 0,
            visibility: showQuote ? 'visible' : 'hidden',
            transition: 'opacity 0.5s ease-out',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          {currentQuote}
        </p>
      </div>

      {/* Symbol Container - Fixed size */}
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className="relative cursor-pointer group focus:outline-none"
        style={{
          width: '48px',
          height: '48px',
          perspective: '1000px',
        }}
        aria-label={isTemplar ? "Templar Symbol" : "Assassin's Creed Symbol"}
      >
        {/* 3D Rotating container */}
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: isTemplar ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transitionDuration: animationDuration,
            transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
          }}
        >
          {/* Assassin Symbol (Front) */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            <AccurateAssassinSymbol />
          </div>

          {/* Templar Symbol (Back) */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <AccurateTemplarSymbol />
          </div>
        </div>

        {/* Hover hint - doesn't affect layout */}
        <div 
          className="absolute left-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            bottom: '-20px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="text-[10px] text-gray-500 whitespace-nowrap">
            {isTemplar ? 'Assassin' : 'Templar'}
          </div>
        </div>
      </button>
    </div>
  );
}

/**
 * ACCURATE Assassin's Creed Insignia
 * Based on the iconic logo with proper proportions
 */
function AccurateAssassinSymbol() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-opacity group-hover:opacity-90"
    >
      {/* Accurate Assassin's Creed logo - sharp blade silhouette */}
      
      {/* Top point/hood peak */}
      <path
        d="M60 15 L48 42 L72 42 Z"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      
      {/* Left blade wing */}
      <path
        d="M48 42 L20 52 L25 68 L32 78 L45 68 L50 52 Z"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      
      {/* Right blade wing */}
      <path
        d="M72 42 L100 52 L95 68 L88 78 L75 68 L70 52 Z"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      
      {/* Center blade body - tapered */}
      <path
        d="M50 52 L45 68 L48 85 L52 100 L60 105 L68 100 L72 85 L75 68 L70 52 Z"
        fill="#d1d5db"
        stroke="#9ca3af"
        strokeWidth="1"
      />
      
      {/* Inner negative space detail */}
      <path
        d="M60 55 L55 65 L57 78 L60 85 L63 78 L65 65 Z"
        fill="#1f2937"
        opacity="0.6"
      />
      
      {/* Center accent */}
      <circle
        cx="60"
        cy="55"
        r="4"
        fill="#9ca3af"
      />
    </svg>
  );
}

/**
 * ACCURATE Templar Cross
 * Based on the Knights Templar cross with proper proportions
 */
function AccurateTemplarSymbol() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-opacity group-hover:opacity-90"
    >
      {/* Accurate Templar cross with pattée (flared) ends */}
      
      {/* Vertical bar with flare */}
      <path
        d="M52 15 L48 10 L60 8 L72 10 L68 15 L68 52 L52 52 Z"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1"
      />
      
      <path
        d="M52 68 L52 105 L48 110 L60 112 L72 110 L68 105 L68 68 Z"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1"
      />
      
      {/* Horizontal bar with flare */}
      <path
        d="M15 52 L10 48 L8 60 L10 72 L15 68 L52 68 L52 52 Z"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1"
      />
      
      <path
        d="M68 52 L105 52 L110 48 L112 60 L110 72 L105 68 L68 68 Z"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1"
      />
      
      {/* Center square */}
      <rect
        x="52"
        y="52"
        width="16"
        height="16"
        fill="#ef4444"
        stroke="#dc2626"
        strokeWidth="1"
      />
      
      {/* Center detail */}
      <circle
        cx="60"
        cy="60"
        r="6"
        fill="#dc2626"
        stroke="#b91c1c"
        strokeWidth="1"
      />
    </svg>
  );
}
