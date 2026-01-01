'use client';

import React, { useState } from 'react';

/**
 * Dark Souls Bonfire Easter Egg - FIXED VERSION
 * Appears in the bottom right corner of the mobile menu
 * When clicked, shows "Bonfire Restored" message with Dark Souls styling
 * 
 * Fixed issues:
 * - Sword now clearly visible and properly centered
 * - Proper color blending and layering
 * - Text moved above bonfire
 * - Subtle animations, performance optimized
 */
export function DarkSoulsBonfire() {
  const [isLit, setIsLit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    if (isLit) return; // Only allow one restoration

    setIsLit(true);
    setShowMessage(true);

    // Hide message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className="relative" style={{ width: '80px', height: '100px' }}>
      {/* Bonfire Message - MOVED ABOVE */}
      {showMessage && (
        <div 
          className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
          style={{
            animation: 'bonfire-message 3s ease-out forwards',
          }}
        >
          <div className="bg-black/90 border-2 border-amber-600 px-6 py-3 rounded-sm shadow-2xl">
            <p className="text-amber-400 font-bold text-base tracking-widest" style={{ 
              fontFamily: 'serif',
              textShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
            }}>
              BONFIRE RESTORED
            </p>
          </div>
        </div>
      )}

      {/* Main Bonfire Container */}
      <button
        onClick={handleClick}
        disabled={isLit}
        className={`relative group cursor-pointer transition-all duration-500 w-full h-full ${
          isLit ? '' : 'hover:scale-105'
        }`}
      >
        {/* Glow Effect Background - Behind everything */}
        {isLit && (
          <div className="absolute inset-0 -z-10">
            <div 
              className="w-full h-full bg-gradient-radial from-orange-500/40 via-yellow-500/20 to-transparent rounded-full blur-2xl"
              style={{ animation: 'glow-pulse 2s ease-in-out infinite' }}
            />
          </div>
        )}

        {/* Bonfire Base (Coals/Rocks) - Layer 1 (Bottom) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-6 z-10">
          {/* Coal arrangement - more visible */}
          <div className={`absolute bottom-0 left-1 w-4 h-3 rounded-sm transition-all duration-700 ${
            isLit 
              ? 'bg-gradient-to-br from-orange-500 via-red-600 to-red-800' 
              : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
          }`} 
          style={{ 
            boxShadow: isLit ? '0 0 12px rgba(234, 88, 12, 0.8), inset 0 -2px 4px rgba(0,0,0,0.5)' : 'inset 0 -2px 4px rgba(0,0,0,0.8)'
          }} />
          
          <div className={`absolute bottom-0 right-1 w-5 h-3 rounded-sm transition-all duration-700 ${
            isLit 
              ? 'bg-gradient-to-br from-orange-600 via-red-600 to-red-900' 
              : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
          }`}
          style={{ 
            boxShadow: isLit ? '0 0 12px rgba(234, 88, 12, 0.8), inset 0 -2px 4px rgba(0,0,0,0.5)' : 'inset 0 -2px 4px rgba(0,0,0,0.8)'
          }} />
          
          <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-4 rounded-sm transition-all duration-700 ${
            isLit 
              ? 'bg-gradient-to-br from-orange-400 via-orange-600 to-red-700' 
              : 'bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900'
          }`}
          style={{ 
            boxShadow: isLit ? '0 0 15px rgba(234, 88, 12, 0.9), inset 0 -2px 4px rgba(0,0,0,0.5)' : 'inset 0 -2px 4px rgba(0,0,0,0.8)'
          }} />
        </div>

        {/* SWORD - Layer 2 (Middle) - FIXED VISIBILITY */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-20">
          {/* Sword Blade - Much more visible now */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 bottom-0 transition-all duration-700`}
            style={{
              width: '6px',
              height: '50px',
              background: isLit 
                ? 'linear-gradient(to bottom, rgba(251, 191, 36, 0.9) 0%, rgba(209, 213, 219, 0.95) 20%, rgba(156, 163, 175, 1) 80%, rgba(107, 114, 128, 1) 100%)'
                : 'linear-gradient(to bottom, rgba(209, 213, 219, 0.8) 0%, rgba(156, 163, 175, 0.9) 50%, rgba(107, 114, 128, 1) 100%)',
              clipPath: 'polygon(45% 0%, 55% 0%, 52% 95%, 48% 95%)',
              transform: 'translateX(-50%) rotate(-8deg)',
              boxShadow: isLit 
                ? '0 0 20px rgba(251, 191, 36, 0.6), inset -1px 0 3px rgba(255,255,255,0.3)'
                : 'inset -1px 0 3px rgba(255,255,255,0.2)',
            }}
          />

          {/* Sword Crossguard - More prominent */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700`}
            style={{
              bottom: '32px',
              width: '24px',
              height: '4px',
              background: isLit 
                ? 'linear-gradient(to right, rgba(180, 83, 9, 1) 0%, rgba(217, 119, 6, 1) 50%, rgba(180, 83, 9, 1) 100%)'
                : 'linear-gradient(to right, rgba(75, 85, 99, 1) 0%, rgba(107, 114, 128, 1) 50%, rgba(75, 85, 99, 1) 100%)',
              transform: 'translateX(-50%) rotate(-8deg)',
              borderRadius: '2px',
              boxShadow: isLit 
                ? '0 0 10px rgba(217, 119, 6, 0.5)'
                : 'none',
            }}
          />

          {/* Sword Handle */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700`}
            style={{
              bottom: '20px',
              width: '6px',
              height: '14px',
              background: isLit 
                ? 'linear-gradient(to bottom, rgba(120, 53, 15, 1) 0%, rgba(92, 38, 11, 1) 100%)'
                : 'linear-gradient(to bottom, rgba(55, 65, 81, 1) 0%, rgba(31, 41, 55, 1) 100%)',
              transform: 'translateX(-50%) rotate(-8deg)',
              borderRadius: '2px',
            }}
          />

          {/* Sword Pommel */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700`}
            style={{
              bottom: '17px',
              width: '10px',
              height: '10px',
              background: isLit 
                ? 'radial-gradient(circle, rgba(180, 83, 9, 1) 0%, rgba(146, 64, 14, 1) 100%)'
                : 'radial-gradient(circle, rgba(75, 85, 99, 1) 0%, rgba(55, 65, 81, 1) 100%)',
              transform: 'translateX(-50%) rotate(-8deg)',
              borderRadius: '50%',
              boxShadow: isLit 
                ? '0 0 8px rgba(180, 83, 9, 0.5)'
                : 'none',
            }}
          />
        </div>

        {/* Flames - Layer 3 (Front) - Only when lit */}
        {isLit && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 z-30 pointer-events-none">
            {/* Main central flame */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0"
              style={{ 
                width: '20px',
                height: '35px',
                animation: 'flame-dance 1.5s ease-in-out infinite'
              }}
            >
              <div 
                className="w-full h-full opacity-90"
                style={{
                  background: 'linear-gradient(to top, rgba(234, 88, 12, 0.9) 0%, rgba(249, 115, 22, 0.8) 30%, rgba(251, 191, 36, 0.7) 60%, rgba(252, 211, 77, 0.4) 100%)',
                  clipPath: 'polygon(50% 0%, 35% 15%, 25% 35%, 20% 55%, 15% 75%, 10% 90%, 20% 100%, 40% 95%, 50% 85%, 60% 95%, 80% 100%, 90% 90%, 85% 75%, 80% 55%, 75% 35%, 65% 15%)',
                  filter: 'blur(1px)',
                }}
              />
            </div>

            {/* Left side flame */}
            <div 
              className="absolute bottom-0"
              style={{ 
                left: '-8px',
                width: '14px',
                height: '22px',
                animation: 'flame-dance 1.2s ease-in-out infinite 0.3s'
              }}
            >
              <div 
                className="w-full h-full opacity-80"
                style={{
                  background: 'linear-gradient(to top, rgba(234, 88, 12, 0.8) 0%, rgba(249, 115, 22, 0.7) 40%, rgba(251, 191, 36, 0.4) 100%)',
                  clipPath: 'polygon(50% 0%, 25% 40%, 20% 70%, 15% 100%, 50% 90%, 85% 100%, 80% 70%, 75% 40%)',
                  filter: 'blur(0.5px)',
                }}
              />
            </div>

            {/* Right side flame */}
            <div 
              className="absolute bottom-0"
              style={{ 
                right: '-8px',
                width: '14px',
                height: '22px',
                animation: 'flame-dance 1.3s ease-in-out infinite 0.6s'
              }}
            >
              <div 
                className="w-full h-full opacity-80"
                style={{
                  background: 'linear-gradient(to top, rgba(234, 88, 12, 0.8) 0%, rgba(249, 115, 22, 0.7) 40%, rgba(251, 191, 36, 0.4) 100%)',
                  clipPath: 'polygon(50% 0%, 25% 40%, 20% 70%, 15% 100%, 50% 90%, 85% 100%, 80% 70%, 75% 40%)',
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          </div>
        )}

        {/* Hover hint when not lit */}
        {!isLit && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/90 border border-amber-600/70 px-3 py-1.5 rounded-sm text-xs text-amber-400 whitespace-nowrap"
              style={{ fontFamily: 'serif' }}
            >
              Rest at Bonfire
            </div>
          </div>
        )}
      </button>

      {/* Animations - Optimized */}
      <style jsx>{`
        @keyframes flame-dance {
          0%, 100% {
            transform: translateY(0) scaleY(1) scaleX(1);
            opacity: 0.9;
          }
          25% {
            transform: translateY(-3px) scaleY(1.08) scaleX(0.96);
            opacity: 1;
          }
          50% {
            transform: translateY(-1px) scaleY(0.96) scaleX(1.04);
            opacity: 0.85;
          }
          75% {
            transform: translateY(-2px) scaleY(1.04) scaleX(0.98);
            opacity: 0.95;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes bonfire-message {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(15px) scale(0.9);
          }
          15% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          85% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-15px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
