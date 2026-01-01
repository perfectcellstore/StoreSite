'use client';

/* eslint-disable react/no-unknown-property */

import React, { useState, useEffect, useRef } from 'react';
import { playRobot } from '@/lib/audioManager';

// Diverse quotes from video games, movies, shows, and historical figures
const QUOTES = [
  // Video Games
  { text: "It's-a me, Mario!", source: "Mario - Super Mario" },
  { text: "The cake is a lie.", source: "Portal" },
  { text: "War. War never changes.", source: "Fallout" },
  { text: "All we had to do, was follow the damn train!", source: "Big Smoke - GTA San Andreas" },
  { text: "Do a barrel roll!", source: "Peppy - Star Fox" },
  { text: "Would you kindly?", source: "BioShock" },
  { text: "I used to be an adventurer like you...", source: "Skyrim Guard" },
  { text: "Stay awhile and listen!", source: "Deckard Cain - Diablo" },
  { text: "The right man in the wrong place...", source: "G-Man - Half-Life" },
  { text: "Remember, no Russian.", source: "Call of Duty: MW2" },
  
  // Movies & Shows
  { text: "May the Force be with you.", source: "Star Wars" },
  { text: "I am inevitable.", source: "Thanos - Avengers" },
  { text: "You shall not pass!", source: "Gandalf - LOTR" },
  { text: "I'll be back.", source: "Terminator" },
  { text: "Winter is coming.", source: "Game of Thrones" },
  { text: "With great power comes great responsibility.", source: "Spider-Man" },
  { text: "I am Iron Man.", source: "Tony Stark" },
  { text: "No, I am your father.", source: "Darth Vader" },
  { text: "To infinity and beyond!", source: "Buzz Lightyear" },
  { text: "Why so serious?", source: "Joker - The Dark Knight" },
  
  // Historical Figures
  { text: "I came, I saw, I conquered.", source: "Julius Caesar" },
  { text: "Give me liberty, or give me death!", source: "Patrick Henry" },
  { text: "I think, therefore I am.", source: "René Descartes" },
  { text: "Be the change you wish to see.", source: "Gandhi" },
  { text: "The only thing we have to fear is fear itself.", source: "FDR" },
  { text: "Knowledge is power.", source: "Francis Bacon" },
  { text: "I have a dream.", source: "Martin Luther King Jr." },
  { text: "Et tu, Brute?", source: "Julius Caesar" },
  { text: "One small step for man...", source: "Neil Armstrong" },
  { text: "Ask not what your country can do for you...", source: "JFK" }
];

export function PerfectCellLogo() {
  const [isJumping, setIsJumping] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [isSmiling, setIsSmiling] = useState(false);
  const [logoPosition, setLogoPosition] = useState({ x: 0, y: 0 });
  const [currentQuote, setCurrentQuote] = useState(null);
  const [showQuote, setShowQuote] = useState(false);
  const [quotePosition, setQuotePosition] = useState({ placement: 'below', style: {} });
  const logoRef = useRef(null);
  const quoteRef = useRef(null);

  // Update logo position for fixed effects
  useEffect(() => {
    if (logoRef.current && (hearts.length > 0 || isJumping)) {
      const rect = logoRef.current.getBoundingClientRect();
      setLogoPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
  }, [hearts, isJumping]);

  // Calculate optimal quote position (responsive for mobile)
  useEffect(() => {
    if (showQuote && logoRef.current && currentQuote) {
      const calculatePosition = () => {
        const robotRect = logoRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Safe padding from edges (more on mobile)
        const isMobile = viewportWidth < 640;
        const edgePadding = isMobile ? 16 : 24;
        const quoteMaxWidth = isMobile ? viewportWidth - (edgePadding * 2) : 280;
        
        // Estimate quote height (rough calculation)
        const estimatedQuoteHeight = isMobile ? 120 : 100;
        
        // Robot center position
        const robotCenterX = robotRect.left + robotRect.width / 2;
        const robotCenterY = robotRect.top + robotRect.height / 2;
        
        // Space available in each direction
        const spaceAbove = robotRect.top;
        const spaceBelow = viewportHeight - robotRect.bottom;
        const spaceLeft = robotRect.left;
        const spaceRight = viewportWidth - robotRect.right;
        
        let placement = 'below';
        let style = {};
        
        // Determine vertical placement (above or below)
        if (spaceBelow >= estimatedQuoteHeight + 20) {
          // Enough space below - place below
          placement = 'below';
          style.top = `${robotRect.bottom + 12}px`;
        } else if (spaceAbove >= estimatedQuoteHeight + 20) {
          // Not enough space below but space above - place above
          placement = 'above';
          style.top = `${robotRect.top - estimatedQuoteHeight - 12}px`;
        } else {
          // Very tight space - place below with scroll
          placement = 'below';
          style.top = `${robotRect.bottom + 12}px`;
        }
        
        // Determine horizontal positioning
        // Try to center on robot, but keep within safe bounds
        let leftPosition = robotCenterX - (quoteMaxWidth / 2);
        
        // Check if it would go off the left edge
        if (leftPosition < edgePadding) {
          leftPosition = edgePadding;
        }
        
        // Check if it would go off the right edge
        if (leftPosition + quoteMaxWidth > viewportWidth - edgePadding) {
          leftPosition = viewportWidth - quoteMaxWidth - edgePadding;
        }
        
        style.left = `${leftPosition}px`;
        style.maxWidth = `${quoteMaxWidth}px`;
        
        setQuotePosition({ placement, style });
      };
      
      // Calculate immediately
      calculatePosition();
      
      // Recalculate on resize (debounced)
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(calculatePosition, 100);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimeout);
      };
    }
  }, [showQuote, currentQuote]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger jump
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 800);

    // ALWAYS show smile AND hearts!
    setIsSmiling(true);
    setTimeout(() => setIsSmiling(false), 1200);

    // Generate fewer hearts for better mobile performance
    const newHearts = [
      { id: Date.now() + 1, delay: 0, offset: -12 },
      { id: Date.now() + 2, delay: 0.1, offset: 12 },
      { id: Date.now() + 3, delay: 0.2, offset: 0 }
    ];
    setHearts(newHearts);
    
    setTimeout(() => {
      setHearts([]);
    }, 2000);

    // Pick random quote
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setCurrentQuote(randomQuote);
    setShowQuote(true);

    // Hide quote after 4 seconds
    setTimeout(() => {
      setShowQuote(false);
    }, 4000);

    // Play robot sound (shared audio manager)
    playRobot();
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
          {[...Array(5)].map((_, i) => (
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

      {/* Quote Bubble - appears after click (RESPONSIVE) */}
      {showQuote && currentQuote && (
        <div
          ref={quoteRef}
          className="fixed z-[10000] pointer-events-none"
          style={{
            ...quotePosition.style,
            width: 'auto',
          }}
        >
          <div 
            className="relative bg-gradient-to-br from-bio-green-500/95 to-emerald-600/95 text-white rounded-2xl shadow-2xl border-2 border-bio-green-400 w-full"
            style={{
              animation: 'quote-pop-in 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
              padding: 'clamp(12px, 3vw, 16px)',
            }}
          >
            {/* Speech bubble arrow - positioned based on placement */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
              style={{
                [quotePosition.placement === 'above' ? 'bottom' : 'top']: '-10px',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                [quotePosition.placement === 'above' ? 'borderTop' : 'borderBottom']: '10px solid rgb(34 197 94)',
              }}
            />
            
            {/* Quote text - responsive sizing */}
            <p 
              className="font-semibold mb-1.5 leading-tight break-words"
              style={{
                fontSize: 'clamp(13px, 3.5vw, 15px)',
                lineHeight: '1.4',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
              }}
            >
              &ldquo;{currentQuote.text}&rdquo;
            </p>
            
            {/* Source - responsive sizing */}
            <p 
              className="opacity-90 italic break-words"
              style={{
                fontSize: 'clamp(11px, 3vw, 13px)',
                lineHeight: '1.3',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              &mdash; {currentQuote.source}
            </p>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-bio-green-400 to-emerald-400 opacity-30 blur-xl -z-10 animate-pulse" />
          </div>
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

        @keyframes quote-pop-in {
          0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.5) translateY(-20px);
          }
          60% {
            opacity: 1;
            transform: translateX(-50%) scale(1.05) translateY(0);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
