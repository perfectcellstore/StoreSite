'use client';

import React, { useState } from 'react';

/**
 * Dark Souls Bonfire Easter Egg - PROPER STRUCTURE
 * 
 * Structure (bottom to top):
 * 1. Tight rock cluster base
 * 2. Wood logs stacked on rocks
 * 3. Sword embedded vertically through center
 * 4. Fire wrapping around sword base
 * 
 * Everything compact, grounded, and cohesive.
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
    <div className="relative w-full flex flex-col items-center py-4" style={{ minHeight: '160px' }}>
      
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

      {/* Main Bonfire Container - Increased size */}
      <div className="relative" style={{ width: '110px', height: '110px' }}>
        
        <button
          onClick={handleClick}
          disabled={isLit}
          className={`absolute inset-0 cursor-pointer transition-all duration-500 ${
            isLit ? '' : 'hover:scale-105'
          }`}
        >
          {/* Glow effect - Behind everything */}
          {isLit && (
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.5) 0%, rgba(251, 191, 36, 0.25) 30%, transparent 60%)',
                filter: 'blur(25px)',
                animation: 'glow-pulse 2s ease-in-out infinite',
                zIndex: 0,
              }}
            />
          )}

          {/* LAYER 1: TIGHT ROCK BASE - Foundation (z: 1) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full" style={{ zIndex: 1 }}>
            {/* Bottom rock layer - tight cluster */}
            
            {/* Center bottom rock - largest */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-800 to-black'
              }`}
              style={{
                bottom: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '28px',
                height: '12px',
                clipPath: 'polygon(20% 5%, 80% 0%, 95% 30%, 98% 70%, 90% 100%, 10% 100%, 2% 70%, 5% 30%)',
                boxShadow: 'inset -2px -3px 6px rgba(0,0,0,0.8)',
              }}
            />

            {/* Left bottom rock */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-900 to-black'
              }`}
              style={{
                bottom: '1px',
                left: 'calc(50% - 22px)',
                width: '20px',
                height: '10px',
                clipPath: 'polygon(15% 10%, 75% 0%, 95% 35%, 90% 80%, 60% 100%, 10% 90%)',
                boxShadow: 'inset -2px -3px 6px rgba(0,0,0,0.8)',
              }}
            />

            {/* Right bottom rock */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-700 via-gray-900 to-black'
              }`}
              style={{
                bottom: '1px',
                left: 'calc(50% + 2px)',
                width: '20px',
                height: '10px',
                clipPath: 'polygon(25% 0%, 85% 10%, 90% 90%, 40% 100%, 10% 80%, 5% 35%)',
                boxShadow: 'inset -2px -3px 6px rgba(0,0,0,0.8)',
              }}
            />
          </div>

          {/* LAYER 2: WOOD LOGS - Stacked on rocks (z: 2) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full" style={{ zIndex: 2 }}>
            {/* Left wood log */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-900 via-amber-950 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
              }`}
              style={{
                bottom: '0px',
                left: 'calc(50% - 16px)',
                width: '28px',
                height: '8px',
                transform: 'rotate(-25deg)',
                borderRadius: '4px',
                boxShadow: isLit 
                  ? '0 0 8px rgba(234, 88, 12, 0.4), inset 0 -2px 4px rgba(0,0,0,0.7)' 
                  : 'inset 0 -2px 4px rgba(0,0,0,0.9)',
              }}
            />

            {/* Right wood log */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-amber-950 via-orange-900 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
              }`}
              style={{
                bottom: '0px',
                left: 'calc(50% - 12px)',
                width: '30px',
                height: '8px',
                transform: 'rotate(20deg)',
                borderRadius: '4px',
                boxShadow: isLit 
                  ? '0 0 8px rgba(234, 88, 12, 0.4), inset 0 -2px 4px rgba(0,0,0,0.7)' 
                  : 'inset 0 -2px 4px rgba(0,0,0,0.9)',
              }}
            />

            {/* Center wood log - horizontal */}
            <div 
              className={`absolute transition-all duration-700 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-800 via-amber-900 to-gray-900' 
                  : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
              }`}
              style={{
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '36px',
                height: '9px',
                borderRadius: '4px',
                boxShadow: isLit 
                  ? '0 0 10px rgba(234, 88, 12, 0.5), inset 0 -3px 5px rgba(0,0,0,0.6)' 
                  : 'inset 0 -3px 5px rgba(0,0,0,0.9)',
              }}
            />
          </div>

          {/* LAYER 3: HOT COALS/EMBERS - On top of wood (z: 3) */}
          {isLit && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2" style={{ zIndex: 3 }}>
              {/* Center coal - brightest */}
              <div 
                className="absolute transition-all duration-700 bg-gradient-to-br from-orange-400 via-red-600 to-red-900"
                style={{
                  bottom: '0px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '18px',
                  height: '10px',
                  clipPath: 'polygon(25% 5%, 75% 0%, 95% 40%, 90% 85%, 50% 100%, 10% 85%, 5% 40%)',
                  boxShadow: '0 0 16px rgba(251, 146, 60, 1), inset -2px -3px 6px rgba(0,0,0,0.3)',
                }}
              />

              {/* Left coal */}
              <div 
                className="absolute transition-all duration-700 bg-gradient-to-br from-orange-600 via-red-700 to-red-900"
                style={{
                  bottom: '1px',
                  left: 'calc(50% - 14px)',
                  width: '12px',
                  height: '7px',
                  clipPath: 'polygon(20% 10%, 80% 0%, 95% 60%, 70% 100%, 10% 80%)',
                  boxShadow: '0 0 12px rgba(234, 88, 12, 0.8)',
                }}
              />

              {/* Right coal */}
              <div 
                className="absolute transition-all duration-700 bg-gradient-to-br from-red-600 via-red-700 to-red-900"
                style={{
                  bottom: '1px',
                  left: 'calc(50% + 2px)',
                  width: '12px',
                  height: '7px',
                  clipPath: 'polygon(20% 0%, 90% 10%, 95% 80%, 60% 100%, 5% 60%)',
                  boxShadow: '0 0 12px rgba(220, 38, 38, 0.8)',
                }}
              />
            </div>
          )}

          {/* LAYER 4: SWORD - Embedded vertically through center (z: 10) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2" style={{ zIndex: 10 }}>
            {/* Sword Blade - Vertical, embedded */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 transition-all duration-700"
              style={{
                width: '9px',
                height: '60px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(251, 191, 36, 0.95) 0%, rgba(241, 245, 249, 1) 6%, rgba(226, 232, 240, 1) 20%, rgba(203, 213, 225, 1) 45%, rgba(148, 163, 184, 1) 70%, rgba(100, 116, 139, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(226, 232, 240, 0.9) 0%, rgba(203, 213, 225, 1) 20%, rgba(148, 163, 184, 1) 60%, rgba(100, 116, 139, 1) 100%)',
                clipPath: 'polygon(50% 0%, 48% 2%, 46% 7%, 45% 12%, 44% 25%, 43% 45%, 42% 70%, 40% 95%, 38% 100%, 62% 100%, 60% 95%, 58% 70%, 57% 45%, 56% 25%, 55% 12%, 54% 7%, 52% 2%)',
                boxShadow: isLit
                  ? '0 0 20px rgba(251, 191, 36, 0.6), inset -1.5px 0 5px rgba(255,255,255,0.5), inset 1.5px 0 3px rgba(0,0,0,0.3)'
                  : 'inset -1.5px 0 4px rgba(255,255,255,0.4), inset 1.5px 0 3px rgba(0,0,0,0.4)',
              }}
            />

            {/* Fuller (blade groove) */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '10px',
                width: '2px',
                height: '42px',
                background: isLit
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(100, 116, 139, 0.4) 15%, rgba(71, 85, 105, 0.5) 75%, transparent 100%)'
                  : 'linear-gradient(to bottom, transparent 0%, rgba(71, 85, 105, 0.3) 15%, rgba(51, 65, 85, 0.4) 75%, transparent 100%)',
                opacity: 0.6,
              }}
            />

            {/* Crossguard */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '38px',
                width: '32px',
                height: '6px',
                background: isLit
                  ? 'linear-gradient(to right, rgba(120, 53, 15, 1) 0%, rgba(146, 64, 14, 1) 15%, rgba(180, 83, 9, 1) 35%, rgba(194, 120, 3, 1) 50%, rgba(180, 83, 9, 1) 65%, rgba(146, 64, 14, 1) 85%, rgba(120, 53, 15, 1) 100%)'
                  : 'linear-gradient(to right, rgba(55, 65, 81, 1) 0%, rgba(75, 85, 99, 1) 15%, rgba(107, 114, 128, 1) 50%, rgba(75, 85, 99, 1) 85%, rgba(55, 65, 81, 1) 100%)',
                borderRadius: '3px',
                clipPath: 'polygon(0% 20%, 5% 0%, 15% 0%, 20% 20%, 80% 20%, 85% 0%, 95% 0%, 100% 20%, 100% 80%, 95% 100%, 85% 100%, 80% 80%, 20% 80%, 15% 100%, 5% 100%, 0% 80%)',
                boxShadow: isLit
                  ? '0 0 12px rgba(194, 120, 3, 0.7), inset 0 2px 3px rgba(255,255,255,0.3), inset 0 -2px 3px rgba(0,0,0,0.4)'
                  : 'inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -2px 3px rgba(0,0,0,0.5)',
              }}
            />

            {/* Handle */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '22px',
                width: '8px',
                height: '18px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(120, 53, 15, 1) 0%, rgba(92, 38, 11, 1) 50%, rgba(120, 53, 15, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(55, 65, 81, 1) 0%, rgba(31, 41, 55, 1) 50%, rgba(55, 65, 81, 1) 100%)',
                borderRadius: '2px',
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5)',
              }}
            />

            {/* Leather wrap lines */}
            <div className="absolute left-1/2 -translate-x-1/2 opacity-40" style={{ bottom: '33px', width: '8px', height: '2px', background: 'rgba(0,0,0,0.5)' }} />
            <div className="absolute left-1/2 -translate-x-1/2 opacity-40" style={{ bottom: '27px', width: '8px', height: '2px', background: 'rgba(0,0,0,0.5)' }} />

            {/* Pommel */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '18px',
                width: '13px',
                height: '13px',
                background: isLit
                  ? 'radial-gradient(circle at 35% 35%, rgba(194, 120, 3, 1) 0%, rgba(180, 83, 9, 1) 40%, rgba(146, 64, 14, 1) 80%, rgba(120, 53, 15, 1) 100%)'
                  : 'radial-gradient(circle at 35% 35%, rgba(107, 114, 128, 1) 0%, rgba(75, 85, 99, 1) 50%, rgba(55, 65, 81, 1) 100%)',
                borderRadius: '50%',
                boxShadow: isLit
                  ? '0 0 10px rgba(180, 83, 9, 0.7), inset 2px 2px 4px rgba(255,255,255,0.3), inset -2px -2px 4px rgba(0,0,0,0.5)'
                  : 'inset 2px 2px 3px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.6)',
              }}
            />
          </div>

          {/* LAYER 5: FLAMES - Wrapping around sword base (z: 11 & 9) */}
          {isLit && (
            <>
              {/* Flames behind sword (z: 9) */}
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 9 }}>
                {/* Back flame - wider */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '0px',
                    width: '32px',
                    height: '38px',
                    animation: 'flame-dance 1.8s ease-in-out infinite',
                  }}
                >
                  <div 
                    className="w-full h-full opacity-75"
                    style={{
                      background: 'linear-gradient(to top, rgba(234, 88, 12, 0.85) 0%, rgba(249, 115, 22, 0.75) 25%, rgba(251, 191, 36, 0.6) 55%, rgba(252, 211, 77, 0.3) 100%)',
                      clipPath: 'polygon(50% 0%, 35% 15%, 25% 35%, 20% 55%, 18% 70%, 15% 85%, 20% 95%, 40% 90%, 50% 85%, 60% 90%, 80% 95%, 85% 85%, 82% 70%, 80% 55%, 75% 35%, 65% 15%)',
                      filter: 'blur(1.5px)',
                    }}
                  />
                </div>
              </div>

              {/* Flames in front of sword (z: 11) */}
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 11 }}>
                {/* Front center flame */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: '0px',
                    width: '24px',
                    height: '35px',
                    animation: 'flame-dance 1.4s ease-in-out infinite 0.3s',
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

                {/* Left front flame */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '-12px',
                    bottom: '0px',
                    width: '18px',
                    height: '26px',
                    animation: 'flame-dance 1.2s ease-in-out infinite 0.6s',
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

                {/* Right front flame */}
                <div 
                  style={{
                    position: 'absolute',
                    right: '-12px',
                    bottom: '0px',
                    width: '18px',
                    height: '26px',
                    animation: 'flame-dance 1.3s ease-in-out infinite 0.9s',
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
            </>
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
            transform: translateY(-5px) scaleY(1.12) scaleX(0.94);
            opacity: 1;
          }
          50% {
            transform: translateY(-2px) scaleY(0.92) scaleX(1.08);
            opacity: 0.85;
          }
          75% {
            transform: translateY(-4px) scaleY(1.06) scaleX(0.96);
            opacity: 0.95;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.12);
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
