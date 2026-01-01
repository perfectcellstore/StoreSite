'use client';

import React, { useState } from 'react';
import { Flame } from 'lucide-react';

/**
 * Dark Souls Bonfire Easter Egg
 * Appears in the bottom right corner of the mobile menu
 * When clicked, shows "Bonfire Restored" message with Dark Souls styling
 */
export function DarkSoulsBonfire() {
  const [isLit, setIsLit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [flames, setFlames] = useState([]);

  const handleClick = () => {
    if (isLit) return; // Only allow one restoration

    setIsLit(true);
    setShowMessage(true);

    // Create flame particles
    const newFlames = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      angle: (i * 30) + Math.random() * 15,
      delay: i * 0.05,
    }));
    setFlames(newFlames);

    // Hide message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    // Clear flames after animation
    setTimeout(() => {
      setFlames([]);
    }, 1500);
  };

  return (
    <div className="relative">
      {/* Bonfire Message */}
      {showMessage && (
        <div 
          className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{
            animation: 'bonfire-message 3s ease-out forwards',
          }}
        >
          <div className="bg-gray-900/95 border-2 border-yellow-600/80 px-4 py-2 rounded shadow-2xl">
            <p className="text-yellow-400 font-bold text-sm tracking-wider" style={{ fontFamily: 'serif' }}>
              BONFIRE RESTORED
            </p>
          </div>
        </div>
      )}

      {/* Flame Particles */}
      {flames.map((flame) => (
        <div
          key={flame.id}
          className="absolute left-1/2 bottom-1/2 -translate-x-1/2"
          style={{
            animation: `flame-rise 1.2s ease-out forwards`,
            animationDelay: `${flame.delay}s`,
            transform: `rotate(${flame.angle}deg) translateY(0)`,
          }}
        >
          <Flame className="h-3 w-3 text-orange-500" fill="currentColor" />
        </div>
      ))}

      {/* Bonfire Container */}
      <button
        onClick={handleClick}
        disabled={isLit}
        className={`relative group cursor-pointer transition-all duration-300 ${
          isLit ? 'scale-110' : 'hover:scale-105'
        }`}
        style={{ width: '60px', height: '80px' }}
      >
        {/* Glow Effect */}
        {isLit && (
          <div className="absolute inset-0 blur-xl opacity-60 animate-pulse">
            <div className="w-full h-full bg-gradient-radial from-orange-500 via-yellow-500 to-transparent rounded-full" />
          </div>
        )}

        {/* Sword in Ground */}
        <div className="relative z-10">
          {/* Sword Blade */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 bottom-6 w-1.5 h-16 bg-gradient-to-b transition-all duration-500 ${
              isLit 
                ? 'from-orange-300 via-gray-300 to-gray-400 shadow-[0_0_20px_rgba(251,146,60,0.8)]' 
                : 'from-gray-400 via-gray-500 to-gray-600'
            }`}
            style={{
              transform: 'rotate(-5deg)',
              clipPath: 'polygon(45% 0%, 55% 0%, 52% 95%, 48% 95%)',
            }}
          />

          {/* Sword Crossguard */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 bottom-[52px] w-8 h-1.5 transition-all duration-500 ${
              isLit 
                ? 'bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.6)]' 
                : 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500'
            }`}
            style={{ transform: 'rotate(-5deg)' }}
          />

          {/* Sword Handle */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 bottom-[44px] w-2 h-8 transition-all duration-500 ${
              isLit 
                ? 'bg-gradient-to-b from-yellow-700 to-yellow-900' 
                : 'bg-gradient-to-b from-gray-700 to-gray-900'
            }`}
            style={{
              transform: 'rotate(-5deg)',
              borderRadius: '2px',
            }}
          />

          {/* Sword Pommel */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 bottom-[40px] w-3 h-3 rounded-full transition-all duration-500 ${
              isLit 
                ? 'bg-gradient-radial from-yellow-500 to-yellow-700 shadow-[0_0_10px_rgba(234,179,8,0.5)]' 
                : 'bg-gradient-radial from-gray-600 to-gray-800'
            }`}
            style={{ transform: 'rotate(-5deg)' }}
          />

          {/* Fire/Coals Base */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-6">
            {/* Rocks/Coals */}
            <div className={`absolute inset-0 transition-all duration-500 ${
              isLit ? 'opacity-100' : 'opacity-60'
            }`}>
              {/* Coal arrangement */}
              <div className={`absolute bottom-0 left-2 w-2.5 h-2.5 rounded-sm transition-all duration-500 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-600 to-red-700 shadow-[0_0_8px_rgba(234,88,12,0.8)]' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-900'
              }`} />
              <div className={`absolute bottom-0 right-2 w-3 h-2 rounded-sm transition-all duration-500 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_8px_rgba(234,88,12,0.8)]' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-900'
              }`} />
              <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-2.5 rounded-sm transition-all duration-500 ${
                isLit 
                  ? 'bg-gradient-to-br from-orange-600 to-red-700 shadow-[0_0_10px_rgba(234,88,12,0.9)]' 
                  : 'bg-gradient-to-br from-gray-700 to-gray-900'
              }`} />
            </div>

            {/* Animated Flames */}
            {isLit && (
              <>
                {/* Main flame */}
                <div 
                  className="absolute left-1/2 -translate-x-1/2 bottom-3 w-4 h-8"
                  style={{ animation: 'flame-flicker 0.8s ease-in-out infinite' }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-orange-600 via-yellow-500 to-yellow-300 opacity-80 blur-[2px]"
                    style={{
                      clipPath: 'polygon(50% 0%, 20% 40%, 30% 70%, 10% 100%, 50% 85%, 90% 100%, 70% 70%, 80% 40%)',
                    }}
                  />
                </div>

                {/* Side flames */}
                <div 
                  className="absolute left-1 bottom-2 w-3 h-5"
                  style={{ animation: 'flame-flicker 0.6s ease-in-out infinite 0.2s' }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-orange-600 to-yellow-400 opacity-70 blur-[1px]"
                    style={{
                      clipPath: 'polygon(50% 0%, 20% 60%, 30% 100%, 70% 100%, 80% 60%)',
                    }}
                  />
                </div>
                <div 
                  className="absolute right-1 bottom-2 w-3 h-5"
                  style={{ animation: 'flame-flicker 0.7s ease-in-out infinite 0.4s' }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-orange-600 to-yellow-400 opacity-70 blur-[1px]"
                    style={{
                      clipPath: 'polygon(50% 0%, 20% 60%, 30% 100%, 70% 100%, 80% 60%)',
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hover hint when not lit */}
        {!isLit && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900/90 border border-yellow-600/50 px-2 py-1 rounded text-xs text-yellow-400 whitespace-nowrap">
              Rest at Bonfire
            </div>
          </div>
        )}
      </button>

      {/* Animations */}
      <style jsx>{`
        @keyframes flame-flicker {
          0%, 100% {
            transform: scaleY(1) scaleX(1);
            opacity: 0.9;
          }
          25% {
            transform: scaleY(1.1) scaleX(0.95);
            opacity: 1;
          }
          50% {
            transform: scaleY(0.95) scaleX(1.05);
            opacity: 0.85;
          }
          75% {
            transform: scaleY(1.05) scaleX(0.98);
            opacity: 0.95;
          }
        }

        @keyframes flame-rise {
          0% {
            transform: translateY(0) translateX(-50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) translateX(-50%) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes bonfire-message {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
