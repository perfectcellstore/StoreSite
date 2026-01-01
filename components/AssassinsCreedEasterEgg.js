'use client';

import React, { useState, useEffect } from 'react';

/**
 * Assassin's Creed Easter Egg
 * 
 * Authentic transformation between Assassin and Templar symbols
 * Inspired by AC Rogue home screen transition
 * 
 * Features:
 * - Smooth Y-axis rotation morph
 * - Contextual quotes based on state
 * - Subtle, hidden placement
 * - Performance optimized
 */
export function AssassinsCreedEasterEgg() {
  const [isTemplar, setIsTemplar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
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

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Quote Display - Above symbol */}
      <div className="h-6 flex items-center justify-center">
        {showQuote && (
          <p 
            className="text-xs text-gray-400 italic tracking-wide text-center px-4"
            style={{
              fontFamily: 'serif',
              animation: 'quote-fade 0.5s ease-out forwards',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {isTemplar 
              ? '"Requiescat in pace."'
              : '"May the Father of Understanding guide us."'
            }
          </p>
        )}
      </div>

      {/* Symbol Container */}
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className="relative cursor-pointer group focus:outline-none"
        style={{
          width: '48px',
          height: '48px',
          perspective: '1000px',
        }}
        aria-label={isTemplar ? "Assassin's Creed Symbol" : "Templar Symbol"}
      >
        {/* Rotating container for 3D effect */}
        <div
          className="relative w-full h-full transition-transform"
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
            <AssassinSymbol />
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
            <TemplarSymbol />
          </div>
        </div>

        {/* Subtle hover hint */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="text-[10px] text-gray-500 whitespace-nowrap">
            {isTemplar ? 'Assassin' : 'Templar'}
          </div>
        </div>
      </button>

      {/* Animations */}
      <style jsx>{`
        @keyframes quote-fade {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Assassin's Creed Insignia
 * Clean, accurate representation
 */
function AssassinSymbol() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-opacity group-hover:opacity-90"
    >
      {/* Assassin insignia - simplified but recognizable */}
      {/* Top triangle/point */}
      <path
        d="M50 10 L35 40 L65 40 Z"
        fill="currentColor"
        className="text-gray-300"
      />
      
      {/* Left wing */}
      <path
        d="M35 40 L10 50 L20 70 L40 55 Z"
        fill="currentColor"
        className="text-gray-300"
      />
      
      {/* Right wing */}
      <path
        d="M65 40 L90 50 L80 70 L60 55 Z"
        fill="currentColor"
        className="text-gray-300"
      />
      
      {/* Center body */}
      <path
        d="M40 55 L35 90 L50 85 L65 90 L60 55 Z"
        fill="currentColor"
        className="text-gray-300"
      />
      
      {/* Center detail */}
      <circle
        cx="50"
        cy="50"
        r="6"
        fill="currentColor"
        className="text-gray-400"
      />
    </svg>
  );
}

/**
 * Templar Cross
 * Clean, accurate representation
 */
function TemplarSymbol() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-opacity group-hover:opacity-90"
    >
      {/* Templar cross - recognizable design */}
      {/* Vertical bar */}
      <rect
        x="42"
        y="10"
        width="16"
        height="80"
        fill="currentColor"
        className="text-red-400"
      />
      
      {/* Horizontal bar */}
      <rect
        x="20"
        y="35"
        width="60"
        height="16"
        fill="currentColor"
        className="text-red-400"
      />
      
      {/* Top flare */}
      <path
        d="M42 10 L38 5 L50 5 L62 5 L58 10 Z"
        fill="currentColor"
        className="text-red-400"
      />
      
      {/* Left flare */}
      <path
        d="M20 35 L15 39 L15 43 L15 47 L20 51 Z"
        fill="currentColor"
        className="text-red-400"
      />
      
      {/* Right flare */}
      <path
        d="M80 35 L85 39 L85 43 L85 47 L80 51 Z"
        fill="currentColor"
        className="text-red-400"
      />
      
      {/* Bottom flare */}
      <path
        d="M42 90 L38 95 L50 95 L62 95 L58 90 Z"
        fill="currentColor"
        className="text-red-400"
      />
      
      {/* Center circle */}
      <circle
        cx="50"
        cy="43"
        r="8"
        fill="currentColor"
        className="text-red-500"
      />
    </svg>
  );
}
