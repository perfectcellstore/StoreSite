'use client';

import React, { useState } from 'react';

/**
 * Dark Souls Bonfire Easter Egg - FULLY FIXED VERSION
 * 
 * Fixes:
 * - Dedicated container with proper overflow handling
 * - Correct sizing without cropping
 * - Sword clearly visible and properly centered
 * - Text positioned above bonfire with no overlap
 * - Proper layering and z-index
 * - Mobile-responsive and lightweight
 */
export function DarkSoulsBonfire() {
  const [isLit, setIsLit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    if (isLit) return;

    setIsLit(true);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    // Dedicated container - prevents menu cropping
    <div className="relative w-full flex flex-col items-center py-4" style={{ minHeight: '140px' }}>
      
      {/* Text Container - Above bonfire, no overlap */}
      <div className="w-full flex justify-center mb-2" style={{ minHeight: '40px' }}>
        {showMessage && (
          <div 
            className="px-4 py-2 bg-black/95 border-2 border-amber-600 rounded-sm shadow-2xl"
            style={{
              animation: 'bonfire-message-fade 3s ease-out forwards',
            }}
          >
            <p 
              className="text-amber-400 font-bold text-sm tracking-widest whitespace-nowrap"
              style={{ 
                fontFamily: 'serif',
                textShadow: '0 0 8px rgba(251, 191, 36, 0.5)'
              }}
            >
              BONFIRE RESTORED
            </p>
          </div>
        )}
      </div>

      {/* Bonfire Container - Properly sized, centered */}
      <div className="relative" style={{ width: '90px', height: '90px' }}>
        
        {/* Click target */}
        <button
          onClick={handleClick}
          disabled={isLit}
          className={`absolute inset-0 cursor-pointer transition-all duration-500 ${
            isLit ? '' : 'hover:scale-105'
          }`}
          style={{ zIndex: 1 }}
        >
          {/* Glow effect - behind everything */}
          {isLit && (
            <div 
              className="absolute inset-0 -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)',
                filter: 'blur(20px)',
                animation: 'glow-pulse 2s ease-in-out infinite',
              }}
            />
          )}

          {/* Coals Base - Layer 1 */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-8">
            {/* Left coal */}
            <div 
              className={`absolute bottom-0 left-1 w-5 h-4 rounded-sm transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-500 via-red-600 to-red-900' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
              }`}
              style={{
                boxShadow: isLit 
                  ? '0 0 15px rgba(234, 88, 12, 0.8), inset 0 -2px 6px rgba(0,0,0,0.5)' 
                  : 'inset 0 -2px 6px rgba(0,0,0,0.8)',
              }}
            />
            
            {/* Right coal */}
            <div 
              className={`absolute bottom-0 right-1 w-6 h-4 rounded-sm transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-600 via-red-600 to-red-900' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
              }`}
              style={{
                boxShadow: isLit 
                  ? '0 0 15px rgba(234, 88, 12, 0.8), inset 0 -2px 6px rgba(0,0,0,0.5)' 
                  : 'inset 0 -2px 6px rgba(0,0,0,0.8)',
              }}
            />
            
            {/* Center coal (front) */}
            <div 
              className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-7 h-5 rounded-sm transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-400 via-orange-600 to-red-800' 
                  : 'bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900'
              }`}
              style={{
                boxShadow: isLit 
                  ? '0 0 18px rgba(234, 88, 12, 0.9), inset 0 -2px 6px rgba(0,0,0,0.5)' 
                  : 'inset 0 -2px 6px rgba(0,0,0,0.8)',
              }}
            />
          </div>

          {/* SWORD - Layer 2 - Properly visible and centered */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-6" style={{ zIndex: 2 }}>
            {/* Blade */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 transition-all duration-700"
              style={{
                width: '7px',
                height: '55px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(251, 191, 36, 0.95) 0%, rgba(229, 231, 235, 1) 15%, rgba(209, 213, 219, 1) 50%, rgba(156, 163, 175, 1) 85%, rgba(107, 114, 128, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(229, 231, 235, 0.9) 0%, rgba(209, 213, 219, 1) 30%, rgba(156, 163, 175, 1) 70%, rgba(107, 114, 128, 1) 100%)',
                clipPath: 'polygon(48% 0%, 52% 0%, 51% 96%, 49% 96%)',
                transform: 'translateX(-50%) rotate(-10deg)',
                boxShadow: isLit
                  ? '0 0 25px rgba(251, 191, 36, 0.7), inset -1px 0 4px rgba(255,255,255,0.4)'
                  : 'inset -1px 0 3px rgba(255,255,255,0.3)',
              }}
            />

            {/* Crossguard */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '36px',
                width: '28px',
                height: '5px',
                background: isLit
                  ? 'linear-gradient(to right, rgba(146, 64, 14, 1) 0%, rgba(194, 120, 3, 1) 50%, rgba(146, 64, 14, 1) 100%)'
                  : 'linear-gradient(to right, rgba(75, 85, 99, 1) 0%, rgba(107, 114, 128, 1) 50%, rgba(75, 85, 99, 1) 100%)',
                transform: 'translateX(-50%) rotate(-10deg)',
                borderRadius: '2px',
                boxShadow: isLit
                  ? '0 0 12px rgba(194, 120, 3, 0.6), inset 0 1px 2px rgba(255,255,255,0.2)'
                  : 'inset 0 1px 2px rgba(0,0,0,0.3)',
              }}
            />

            {/* Handle */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '22px',
                width: '7px',
                height: '16px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(120, 53, 15, 1) 0%, rgba(92, 38, 11, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(55, 65, 81, 1) 0%, rgba(31, 41, 55, 1) 100%)',
                transform: 'translateX(-50%) rotate(-10deg)',
                borderRadius: '2px',
              }}
            />

            {/* Pommel */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '18px',
                width: '11px',
                height: '11px',
                background: isLit
                  ? 'radial-gradient(circle, rgba(180, 83, 9, 1) 0%, rgba(146, 64, 14, 1) 100%)'
                  : 'radial-gradient(circle, rgba(75, 85, 99, 1) 0%, rgba(55, 65, 81, 1) 100%)',
                transform: 'translateX(-50%) rotate(-10deg)',
                borderRadius: '50%',
                boxShadow: isLit
                  ? '0 0 10px rgba(180, 83, 9, 0.6)'
                  : 'none',
              }}
            />
          </div>

          {/* FLAMES - Layer 3 - Only when lit */}
          {isLit && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 pointer-events-none" style={{ zIndex: 3 }}>
              {/* Main flame */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0"
                style={{
                  width: '24px',
                  height: '40px',
                  animation: 'flame-dance 1.5s ease-in-out infinite',
                }}
              >
                <div 
                  className="w-full h-full opacity-90"
                  style={{
                    background: 'linear-gradient(to top, rgba(234, 88, 12, 0.95) 0%, rgba(249, 115, 22, 0.85) 25%, rgba(251, 191, 36, 0.75) 55%, rgba(252, 211, 77, 0.4) 100%)',
                    clipPath: 'polygon(50% 0%, 38% 12%, 30% 28%, 25% 45%, 22% 62%, 18% 78%, 15% 88%, 25% 98%, 45% 92%, 50% 85%, 55% 92%, 75% 98%, 85% 88%, 82% 78%, 78% 62%, 75% 45%, 70% 28%, 62% 12%)',
                    filter: 'blur(1px)',
                  }}
                />
              </div>

              {/* Left flame */}
              <div 
                className="absolute bottom-0"
                style={{
                  left: '-10px',
                  width: '16px',
                  height: '26px',
                  animation: 'flame-dance 1.2s ease-in-out infinite 0.3s',
                }}
              >
                <div 
                  className="w-full h-full opacity-80"
                  style={{
                    background: 'linear-gradient(to top, rgba(234, 88, 12, 0.9) 0%, rgba(249, 115, 22, 0.75) 35%, rgba(251, 191, 36, 0.5) 100%)',
                    clipPath: 'polygon(50% 0%, 30% 30%, 25% 60%, 20% 85%, 15% 100%, 50% 88%, 85% 100%, 80% 85%, 75% 60%, 70% 30%)',
                    filter: 'blur(0.5px)',
                  }}
                />
              </div>

              {/* Right flame */}
              <div 
                className="absolute bottom-0"
                style={{
                  right: '-10px',
                  width: '16px',
                  height: '26px',
                  animation: 'flame-dance 1.3s ease-in-out infinite 0.6s',
                }}
              >
                <div 
                  className="w-full h-full opacity-80"
                  style={{
                    background: 'linear-gradient(to top, rgba(234, 88, 12, 0.9) 0%, rgba(249, 115, 22, 0.75) 35%, rgba(251, 191, 36, 0.5) 100%)',
                    clipPath: 'polygon(50% 0%, 30% 30%, 25% 60%, 20% 85%, 15% 100%, 50% 88%, 85% 100%, 80% 85%, 75% 60%, 70% 30%)',
                    filter: 'blur(0.5px)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Hover tooltip */}
          {!isLit && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div 
                className="bg-black/95 border border-amber-600/80 px-3 py-1.5 rounded-sm text-xs text-amber-400 whitespace-nowrap"
                style={{ fontFamily: 'serif' }}
              >
                Rest at Bonfire
              </div>
            </div>
          )}
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes flame-dance {
          0%, 100% {
            transform: translateY(0) scaleY(1) scaleX(1);
            opacity: 0.9;
          }
          25% {
            transform: translateY(-4px) scaleY(1.1) scaleX(0.95);
            opacity: 1;
          }
          50% {
            transform: translateY(-2px) scaleY(0.94) scaleX(1.06);
            opacity: 0.85;
          }
          75% {
            transform: translateY(-3px) scaleY(1.05) scaleX(0.97);
            opacity: 0.95;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.65;
            transform: scale(1.15);
          }
        }

        @keyframes bonfire-message-fade {
          0% {
            opacity: 0;
            transform: translateY(12px) scale(0.92);
          }
          12% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          88% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-12px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
