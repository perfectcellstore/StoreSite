'use client';

import React, { useState } from 'react';

/**
 * Dark Souls Bonfire Easter Egg - ENHANCED SWORD & ROCKS
 * 
 * Improvements:
 * - Sword now has proper pointed tip and blade shape
 * - Better crossguard design
 * - More realistic rock/coal formation
 * - Improved overall Dark Souls aesthetic
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
    <div className="relative w-full flex flex-col items-center py-4" style={{ minHeight: '140px' }}>
      
      {/* Text Container - Above bonfire */}
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

      {/* Bonfire Container */}
      <div className="relative" style={{ width: '90px', height: '90px' }}>
        
        <button
          onClick={handleClick}
          disabled={isLit}
          className={`absolute inset-0 cursor-pointer transition-all duration-500 ${
            isLit ? '' : 'hover:scale-105'
          }`}
          style={{ zIndex: 1 }}
        >
          {/* Glow effect */}
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

          {/* CLUMPED WOOD & ROCK BONFIRE BASE - Realistic pile */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-12">
            {/* Back wood log - diagonal */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-900 via-amber-950 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
              }`}
              style={{
                bottom: '8px',
                left: '18px',
                width: '24px',
                height: '8px',
                transform: 'rotate(-15deg)',
                borderRadius: '4px',
                boxShadow: isLit 
                  ? '0 0 10px rgba(234, 88, 12, 0.5), inset 0 -2px 4px rgba(0,0,0,0.7)' 
                  : 'inset 0 -2px 4px rgba(0,0,0,0.9)',
              }}
            />

            {/* Back wood log - opposite angle */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-amber-950 via-orange-900 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
              }`}
              style={{
                bottom: '7px',
                right: '16px',
                width: '26px',
                height: '7px',
                transform: 'rotate(18deg)',
                borderRadius: '3px',
                boxShadow: isLit 
                  ? '0 0 10px rgba(234, 88, 12, 0.5), inset 0 -2px 4px rgba(0,0,0,0.7)' 
                  : 'inset 0 -2px 4px rgba(0,0,0,0.9)',
              }}
            />

            {/* Left rock - overlapping wood */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-600 via-red-700 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-800 to-black'
              }`}
              style={{
                bottom: '3px',
                left: '8px',
                width: '18px',
                height: '12px',
                clipPath: 'polygon(15% 5%, 70% 0%, 90% 20%, 95% 60%, 85% 95%, 40% 100%, 10% 80%, 5% 35%)',
                boxShadow: isLit 
                  ? '0 0 14px rgba(234, 88, 12, 0.8), inset -2px -3px 6px rgba(0,0,0,0.5)' 
                  : 'inset -2px -3px 6px rgba(0,0,0,0.8)',
              }}
            />

            {/* Right rock - overlapping wood */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-500 via-red-600 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-800 to-black'
              }`}
              style={{
                bottom: '2px',
                right: '6px',
                width: '20px',
                height: '13px',
                clipPath: 'polygon(20% 0%, 75% 5%, 95% 30%, 98% 70%, 88% 95%, 35% 100%, 8% 85%, 5% 40%)',
                boxShadow: isLit 
                  ? '0 0 14px rgba(234, 88, 12, 0.8), inset -2px -3px 6px rgba(0,0,0,0.5)' 
                  : 'inset -2px -3px 6px rgba(0,0,0,0.8)',
              }}
            />

            {/* Front wood log - horizontal */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-800 via-amber-900 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
              }`}
              style={{
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%) rotate(-5deg)',
                width: '32px',
                height: '9px',
                borderRadius: '4px',
                boxShadow: isLit 
                  ? '0 0 12px rgba(234, 88, 12, 0.7), inset 0 -3px 5px rgba(0,0,0,0.6)' 
                  : 'inset 0 -3px 5px rgba(0,0,0,0.9)',
              }}
            />

            {/* Center rock - on top of logs */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-400 via-orange-600 to-red-800' 
                  : 'bg-gradient-to-br from-gray-600 via-gray-800 to-gray-900'
              }`}
              style={{
                bottom: '5px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '22px',
                height: '14px',
                clipPath: 'polygon(25% 3%, 70% 0%, 95% 22%, 98% 60%, 90% 90%, 50% 100%, 10% 90%, 2% 60%, 5% 22%)',
                boxShadow: isLit 
                  ? '0 0 18px rgba(251, 146, 60, 0.9), inset -3px -4px 8px rgba(0,0,0,0.4)' 
                  : 'inset -3px -4px 8px rgba(0,0,0,0.8)',
              }}
            />

            {/* Small left coal - filling gaps */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-red-600 via-red-800 to-black' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-900 to-black'
              }`}
              style={{
                bottom: '1px',
                left: '25px',
                width: '10px',
                height: '7px',
                clipPath: 'polygon(20% 10%, 75% 0%, 95% 40%, 90% 85%, 50% 100%, 10% 80%)',
                boxShadow: isLit 
                  ? '0 0 10px rgba(185, 28, 28, 0.7)' 
                  : 'none',
              }}
            />

            {/* Small right coal - filling gaps */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-red-700 via-red-800 to-black' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-900 to-black'
              }`}
              style={{
                bottom: '1px',
                right: '22px',
                width: '11px',
                height: '8px',
                clipPath: 'polygon(25% 5%, 80% 0%, 95% 50%, 85% 95%, 40% 100%, 10% 75%)',
                boxShadow: isLit 
                  ? '0 0 10px rgba(185, 28, 28, 0.7)' 
                  : 'none',
              }}
            />
          </div>

          {/* IMPROVED SWORD - More realistic blade shape */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8" style={{ zIndex: 2 }}>
            {/* Blade - Improved with taper and point */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 transition-all duration-700"
              style={{
                width: '8px',
                height: '52px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(251, 191, 36, 0.95) 0%, rgba(241, 245, 249, 1) 8%, rgba(226, 232, 240, 1) 25%, rgba(203, 213, 225, 1) 50%, rgba(148, 163, 184, 1) 75%, rgba(100, 116, 139, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(226, 232, 240, 0.9) 0%, rgba(203, 213, 225, 1) 25%, rgba(148, 163, 184, 1) 65%, rgba(100, 116, 139, 1) 100%)',
                clipPath: 'polygon(50% 0%, 48% 2%, 46% 8%, 45% 15%, 44% 30%, 43% 50%, 42% 75%, 40% 95%, 38% 100%, 62% 100%, 60% 95%, 58% 75%, 57% 50%, 56% 30%, 55% 15%, 54% 8%, 52% 2%)',
                transform: 'translateX(-50%) rotate(-12deg)',
                boxShadow: isLit
                  ? '0 0 25px rgba(251, 191, 36, 0.7), inset -1.5px 0 5px rgba(255,255,255,0.5), inset 1.5px 0 3px rgba(0,0,0,0.3)'
                  : 'inset -1.5px 0 4px rgba(255,255,255,0.4), inset 1.5px 0 3px rgba(0,0,0,0.4)',
              }}
            />

            {/* Fuller (groove in blade) - adds realism */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '8px',
                width: '2px',
                height: '38px',
                background: isLit
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(100, 116, 139, 0.4) 20%, rgba(71, 85, 105, 0.5) 80%, transparent 100%)'
                  : 'linear-gradient(to bottom, transparent 0%, rgba(71, 85, 105, 0.3) 20%, rgba(51, 65, 85, 0.4) 80%, transparent 100%)',
                transform: 'translateX(-50%) rotate(-12deg)',
                opacity: 0.6,
              }}
            />

            {/* Crossguard - Improved medieval style */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '34px',
                width: '30px',
                height: '6px',
                background: isLit
                  ? 'linear-gradient(to right, rgba(120, 53, 15, 1) 0%, rgba(146, 64, 14, 1) 15%, rgba(180, 83, 9, 1) 35%, rgba(194, 120, 3, 1) 50%, rgba(180, 83, 9, 1) 65%, rgba(146, 64, 14, 1) 85%, rgba(120, 53, 15, 1) 100%)'
                  : 'linear-gradient(to right, rgba(55, 65, 81, 1) 0%, rgba(75, 85, 99, 1) 15%, rgba(107, 114, 128, 1) 50%, rgba(75, 85, 99, 1) 85%, rgba(55, 65, 81, 1) 100%)',
                transform: 'translateX(-50%) rotate(-12deg)',
                borderRadius: '3px',
                clipPath: 'polygon(0% 20%, 5% 0%, 15% 0%, 20% 20%, 80% 20%, 85% 0%, 95% 0%, 100% 20%, 100% 80%, 95% 100%, 85% 100%, 80% 80%, 20% 80%, 15% 100%, 5% 100%, 0% 80%)',
                boxShadow: isLit
                  ? '0 0 15px rgba(194, 120, 3, 0.7), inset 0 2px 3px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.4)'
                  : 'inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -2px 3px rgba(0,0,0,0.5)',
              }}
            />

            {/* Handle - Leather wrapped */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '19px',
                width: '7px',
                height: '17px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(120, 53, 15, 1) 0%, rgba(92, 38, 11, 1) 50%, rgba(120, 53, 15, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(55, 65, 81, 1) 0%, rgba(31, 41, 55, 1) 50%, rgba(55, 65, 81, 1) 100%)',
                transform: 'translateX(-50%) rotate(-12deg)',
                borderRadius: '2px',
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5)',
              }}
            />

            {/* Handle wrapping lines - leather texture */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 opacity-40"
              style={{
                bottom: '29px',
                width: '7px',
                height: '2px',
                background: 'rgba(0,0,0,0.5)',
                transform: 'translateX(-50%) rotate(-12deg)',
              }}
            />
            <div 
              className="absolute left-1/2 -translate-x-1/2 opacity-40"
              style={{
                bottom: '24px',
                width: '7px',
                height: '2px',
                background: 'rgba(0,0,0,0.5)',
                transform: 'translateX(-50%) rotate(-12deg)',
              }}
            />

            {/* Pommel - Round medieval style */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '15px',
                width: '12px',
                height: '12px',
                background: isLit
                  ? 'radial-gradient(circle at 35% 35%, rgba(194, 120, 3, 1) 0%, rgba(180, 83, 9, 1) 40%, rgba(146, 64, 14, 1) 80%, rgba(120, 53, 15, 1) 100%)'
                  : 'radial-gradient(circle at 35% 35%, rgba(107, 114, 128, 1) 0%, rgba(75, 85, 99, 1) 50%, rgba(55, 65, 81, 1) 100%)',
                transform: 'translateX(-50%) rotate(-12deg)',
                borderRadius: '50%',
                boxShadow: isLit
                  ? '0 0 12px rgba(180, 83, 9, 0.7), inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.5)'
                  : 'inset 2px 2px 3px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.6)',
              }}
            />
          </div>

          {/* FLAMES - When lit */}
          {isLit && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-10 pointer-events-none" style={{ zIndex: 3 }}>
              {/* Main flame */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bottom-0"
                style={{
                  width: '26px',
                  height: '42px',
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
                  left: '-12px',
                  width: '18px',
                  height: '28px',
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
                  right: '-12px',
                  width: '18px',
                  height: '28px',
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
