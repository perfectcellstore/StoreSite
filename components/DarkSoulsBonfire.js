'use client';

import React, { useState } from 'react';

/**
 * Dark Souls Bonfire - PHYSICALLY ACCURATE REBUILD
 * 
 * STRICT RULES:
 * - Single baseline (ground line) at container bottom
 * - All elements anchored to ground
 * - Stones → Wood → Sword → Fire (layered stack)
 * - Nothing floats, nothing hides sword
 * - Compact, dense, grounded
 */
export function DarkSoulsBonfire() {
  const [isLit, setIsLit] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    if (isLit) return;
    setIsLit(true);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className="relative w-full flex flex-col items-center py-4" style={{ minHeight: '150px' }}>
      
      {/* Message - Above bonfire */}
      <div className="w-full flex justify-center mb-3" style={{ minHeight: '36px' }}>
        {showMessage && (
          <div 
            className="px-4 py-2 bg-black/95 border-2 border-amber-600 rounded-sm"
            style={{ animation: 'message-fade 3s ease-out forwards' }}
          >
            <p className="text-amber-400 font-bold text-sm tracking-widest" style={{ fontFamily: 'serif' }}>
              BONFIRE RESTORED
            </p>
          </div>
        )}
      </div>

      {/* BONFIRE CONTAINER - Physical space with ground line */}
      <div className="relative" style={{ width: '100px', height: '100px' }}>
        
        {/* Background glow (when lit) */}
        {isLit && (
          <div 
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: '8px',
              width: '110px',
              height: '110px',
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(251, 191, 36, 0.2) 35%, transparent 65%)',
              filter: 'blur(20px)',
              animation: 'glow 2s ease-in-out infinite',
              zIndex: 0,
            }}
          />
        )}

        <button
          onClick={handleClick}
          disabled={isLit}
          className="absolute inset-0 cursor-pointer group"
        >
          {/* ═══════════════════════════════════════════ */}
          {/* LAYER 1: STONES - Ground level (z: 1) */}
          {/* ═══════════════════════════════════════════ */}
          
          {/* All stones positioned from bottom: 0 */}
          
          {/* Center stone - largest, main base */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ${
              isLit ? 'bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700' : 'bg-gradient-to-t from-black via-gray-900 to-gray-800'
            }`}
            style={{
              bottom: '0px',
              width: '32px',
              height: '14px',
              clipPath: 'polygon(25% 8%, 75% 0%, 95% 35%, 100% 70%, 85% 100%, 15% 100%, 0% 70%, 5% 35%)',
              boxShadow: 'inset -2px -4px 6px rgba(0,0,0,0.8)',
              zIndex: 1,
            }}
          />

          {/* Left stone - touching center */}
          <div 
            className={`absolute transition-all duration-700 ${
              isLit ? 'bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700' : 'bg-gradient-to-t from-black via-gray-900 to-gray-800'
            }`}
            style={{
              bottom: '0px',
              left: 'calc(50% - 24px)',
              width: '22px',
              height: '11px',
              clipPath: 'polygon(20% 15%, 75% 0%, 95% 45%, 85% 90%, 50% 100%, 10% 85%)',
              boxShadow: 'inset -2px -3px 5px rgba(0,0,0,0.8)',
              zIndex: 1,
            }}
          />

          {/* Right stone - touching center */}
          <div 
            className={`absolute transition-all duration-700 ${
              isLit ? 'bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700' : 'bg-gradient-to-t from-black via-gray-900 to-gray-800'
            }`}
            style={{
              bottom: '0px',
              left: 'calc(50% + 2px)',
              width: '22px',
              height: '11px',
              clipPath: 'polygon(25% 0%, 80% 15%, 90% 85%, 50% 100%, 15% 90%, 5% 45%)',
              boxShadow: 'inset -2px -3px 5px rgba(0,0,0,0.8)',
              zIndex: 1,
            }}
          />

          {/* ═══════════════════════════════════════════ */}
          {/* LAYER 2: WOOD - On stones (z: 2) */}
          {/* ═══════════════════════════════════════════ */}
          
          {/* Wood positioned just above stones (bottom: 10px) */}

          {/* Left log - angled */}
          <div 
            className={`absolute transition-all duration-700 ${
              isLit ? 'bg-gradient-to-br from-orange-900 via-amber-950 to-gray-900' : 'bg-gradient-to-br from-gray-900 via-gray-900 to-black'
            }`}
            style={{
              bottom: '10px',
              left: 'calc(50% - 18px)',
              width: '30px',
              height: '7px',
              transform: 'rotate(-20deg)',
              borderRadius: '3px',
              boxShadow: isLit ? 'inset 0 -2px 4px rgba(0,0,0,0.7)' : 'inset 0 -2px 4px rgba(0,0,0,0.9)',
              zIndex: 2,
            }}
          />

          {/* Right log - angled opposite */}
          <div 
            className={`absolute transition-all duration-700 ${
              isLit ? 'bg-gradient-to-br from-amber-950 via-orange-900 to-gray-900' : 'bg-gradient-to-br from-gray-900 via-gray-900 to-black'
            }`}
            style={{
              bottom: '10px',
              left: 'calc(50% - 12px)',
              width: '30px',
              height: '7px',
              transform: 'rotate(18deg)',
              borderRadius: '3px',
              boxShadow: isLit ? 'inset 0 -2px 4px rgba(0,0,0,0.7)' : 'inset 0 -2px 4px rgba(0,0,0,0.9)',
              zIndex: 2,
            }}
          />

          {/* Center log - horizontal, main support */}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ${
              isLit ? 'bg-gradient-to-t from-gray-900 via-orange-900 to-orange-800' : 'bg-gradient-to-t from-black via-gray-900 to-gray-800'
            }`}
            style={{
              bottom: '12px',
              width: '38px',
              height: '8px',
              borderRadius: '4px',
              boxShadow: isLit ? 'inset 0 -3px 5px rgba(0,0,0,0.6)' : 'inset 0 -3px 5px rgba(0,0,0,0.9)',
              zIndex: 2,
            }}
          />

          {/* ═══════════════════════════════════════════ */}
          {/* LAYER 3: EMBERS - On wood (when lit) (z: 3) */}
          {/* ═══════════════════════════════════════════ */}
          
          {isLit && (
            <>
              {/* Center ember - brightest */}
              <div 
                className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-t from-orange-600 via-orange-400 to-red-600"
                style={{
                  bottom: '18px',
                  width: '20px',
                  height: '8px',
                  clipPath: 'polygon(30% 10%, 70% 0%, 95% 50%, 85% 100%, 15% 100%, 5% 50%)',
                  boxShadow: '0 0 12px rgba(251, 146, 60, 0.9)',
                  zIndex: 3,
                }}
              />

              {/* Left ember */}
              <div 
                className="absolute bg-gradient-to-t from-red-700 via-orange-600 to-red-700"
                style={{
                  bottom: '18px',
                  left: 'calc(50% - 16px)',
                  width: '14px',
                  height: '6px',
                  clipPath: 'polygon(25% 20%, 80% 0%, 95% 70%, 60% 100%, 10% 80%)',
                  boxShadow: '0 0 8px rgba(234, 88, 12, 0.7)',
                  zIndex: 3,
                }}
              />

              {/* Right ember */}
              <div 
                className="absolute bg-gradient-to-t from-red-700 via-orange-600 to-red-700"
                style={{
                  bottom: '18px',
                  left: 'calc(50% + 2px)',
                  width: '14px',
                  height: '6px',
                  clipPath: 'polygon(20% 0%, 75% 20%, 90% 80%, 40% 100%, 5% 70%)',
                  boxShadow: '0 0 8px rgba(234, 88, 12, 0.7)',
                  zIndex: 3,
                }}
              />
            </>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* LAYER 4: SWORD - Embedded center (z: 5) */}
          {/* ═══════════════════════════════════════════ */}
          
          {/* Sword starts from wood level (bottom: 14px) */}
          
          <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '14px', zIndex: 5 }}>
            {/* Blade - tapered with point */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 bottom-0 transition-all duration-700"
              style={{
                width: '10px',
                height: '56px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(251, 191, 36, 0.9) 0%, rgba(241, 245, 249, 1) 8%, rgba(203, 213, 225, 1) 40%, rgba(148, 163, 184, 1) 75%, rgba(100, 116, 139, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(226, 232, 240, 0.95) 0%, rgba(203, 213, 225, 1) 25%, rgba(148, 163, 184, 1) 65%, rgba(100, 116, 139, 1) 100%)',
                clipPath: 'polygon(50% 0%, 47% 3%, 45% 10%, 44% 20%, 43% 40%, 42% 65%, 40% 90%, 38% 100%, 62% 100%, 60% 90%, 58% 65%, 57% 40%, 56% 20%, 55% 10%, 53% 3%)',
                boxShadow: isLit
                  ? '0 0 15px rgba(251, 191, 36, 0.5), inset -2px 0 4px rgba(255,255,255,0.4), inset 2px 0 3px rgba(0,0,0,0.3)'
                  : 'inset -2px 0 4px rgba(255,255,255,0.3), inset 2px 0 3px rgba(0,0,0,0.4)',
              }}
            />

            {/* Fuller groove */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 opacity-50"
              style={{
                bottom: '8px',
                width: '2px',
                height: '40px',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(71, 85, 105, 0.5) 20%, rgba(51, 65, 85, 0.6) 80%, transparent 100%)',
              }}
            />

            {/* Crossguard */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '36px',
                width: '34px',
                height: '6px',
                background: isLit
                  ? 'linear-gradient(to right, rgba(120, 53, 15, 1) 0%, rgba(180, 83, 9, 1) 30%, rgba(194, 120, 3, 1) 50%, rgba(180, 83, 9, 1) 70%, rgba(120, 53, 15, 1) 100%)'
                  : 'linear-gradient(to right, rgba(55, 65, 81, 1) 0%, rgba(107, 114, 128, 1) 50%, rgba(55, 65, 81, 1) 100%)',
                borderRadius: '2px',
                boxShadow: isLit ? '0 0 8px rgba(194, 120, 3, 0.5)' : 'none',
              }}
            />

            {/* Handle */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '21px',
                width: '9px',
                height: '17px',
                background: isLit
                  ? 'linear-gradient(to bottom, rgba(120, 53, 15, 1) 0%, rgba(92, 38, 11, 1) 50%, rgba(120, 53, 15, 1) 100%)'
                  : 'linear-gradient(to bottom, rgba(55, 65, 81, 1) 0%, rgba(31, 41, 55, 1) 50%, rgba(55, 65, 81, 1) 100%)',
                borderRadius: '2px',
              }}
            />

            {/* Pommel */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
              style={{
                bottom: '17px',
                width: '14px',
                height: '14px',
                background: isLit
                  ? 'radial-gradient(circle at 35% 35%, rgba(194, 120, 3, 1) 0%, rgba(180, 83, 9, 1) 50%, rgba(146, 64, 14, 1) 100%)'
                  : 'radial-gradient(circle at 35% 35%, rgba(107, 114, 128, 1) 0%, rgba(75, 85, 99, 1) 60%, rgba(55, 65, 81, 1) 100%)',
                borderRadius: '50%',
                boxShadow: isLit ? '0 0 6px rgba(180, 83, 9, 0.5)' : 'none',
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════ */}
          {/* LAYER 5: FIRE - Around sword base (z: 4 & 6) */}
          {/* ═══════════════════════════════════════════ */}
          
          {isLit && (
            <>
              {/* Back flame (behind sword) - z: 4 */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '22px', zIndex: 4 }}>
                <div 
                  style={{
                    width: '36px',
                    height: '32px',
                    animation: 'flame 1.6s ease-in-out infinite',
                  }}
                >
                  <div 
                    className="w-full h-full opacity-70"
                    style={{
                      background: 'linear-gradient(to top, rgba(234, 88, 12, 0.8) 0%, rgba(249, 115, 22, 0.7) 30%, rgba(251, 191, 36, 0.5) 70%, transparent 100%)',
                      clipPath: 'polygon(50% 0%, 32% 18%, 22% 40%, 18% 65%, 20% 85%, 40% 95%, 50% 88%, 60% 95%, 80% 85%, 82% 65%, 78% 40%, 68% 18%)',
                      filter: 'blur(1.5px)',
                    }}
                  />
                </div>
              </div>

              {/* Front flames (in front of sword base) - z: 6 */}
              <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '22px', zIndex: 6 }}>
                {/* Center front flame */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '22px',
                    height: '28px',
                    animation: 'flame 1.3s ease-in-out infinite 0.2s',
                  }}
                >
                  <div 
                    className="w-full h-full opacity-85"
                    style={{
                      background: 'linear-gradient(to top, rgba(234, 88, 12, 0.9) 0%, rgba(249, 115, 22, 0.8) 35%, rgba(251, 191, 36, 0.6) 75%, transparent 100%)',
                      clipPath: 'polygon(50% 0%, 35% 15%, 25% 35%, 20% 60%, 18% 80%, 30% 95%, 50% 90%, 70% 95%, 82% 80%, 80% 60%, 75% 35%, 65% 15%)',
                      filter: 'blur(0.8px)',
                    }}
                  />
                </div>

                {/* Left side flame */}
                <div 
                  style={{
                    position: 'absolute',
                    left: '-10px',
                    width: '16px',
                    height: '22px',
                    animation: 'flame 1.1s ease-in-out infinite 0.5s',
                  }}
                >
                  <div 
                    className="w-full h-full opacity-75"
                    style={{
                      background: 'linear-gradient(to top, rgba(234, 88, 12, 0.85) 0%, rgba(249, 115, 22, 0.7) 40%, rgba(251, 191, 36, 0.4) 100%)',
                      clipPath: 'polygon(50% 0%, 28% 35%, 20% 70%, 25% 100%, 60% 92%, 80% 100%, 82% 70%, 72% 35%)',
                      filter: 'blur(0.5px)',
                    }}
                  />
                </div>

                {/* Right side flame */}
                <div 
                  style={{
                    position: 'absolute',
                    right: '-10px',
                    width: '16px',
                    height: '22px',
                    animation: 'flame 1.2s ease-in-out infinite 0.7s',
                  }}
                >
                  <div 
                    className="w-full h-full opacity-75"
                    style={{
                      background: 'linear-gradient(to top, rgba(234, 88, 12, 0.85) 0%, rgba(249, 115, 22, 0.7) 40%, rgba(251, 191, 36, 0.4) 100%)',
                      clipPath: 'polygon(50% 0%, 28% 35%, 18% 70%, 20% 100%, 40% 92%, 75% 100%, 80% 70%, 72% 35%)',
                      filter: 'blur(0.5px)',
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Hover hint */}
          {!isLit && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-black/95 border border-amber-600/70 px-3 py-1 rounded-sm text-xs text-amber-400" style={{ fontFamily: 'serif' }}>
                Rest at Bonfire
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes flame {
          0%, 100% {
            transform: translateY(0) scaleY(1) scaleX(1);
            opacity: 0.85;
          }
          30% {
            transform: translateY(-3px) scaleY(1.08) scaleX(0.96);
            opacity: 0.95;
          }
          60% {
            transform: translateY(-1px) scaleY(0.94) scaleX(1.04);
            opacity: 0.8;
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes message-fade {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          10% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
