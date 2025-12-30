'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function SwordInStone({ onClose }) {
  const { t } = useLanguage();
  const [isPulling, setIsPulling] = useState(false);
  const [isPulled, setIsPulled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handlePull = () => {
    if (isPulled) return;
    
    setIsPulling(true);
    
    // Play sword pull sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 1.5);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
      oscillator.type = 'sawtooth';
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1.5);
    } catch (e) {
      console.log('Audio not supported');
    }

    setTimeout(() => {
      setIsPulling(false);
      setIsPulled(true);
      setShowMessage(true);
    }, 2000);
  };

  const handleCopyPromo = () => {
    navigator.clipboard.writeText('2026');
    setCopiedPromo(true);
    setTimeout(() => setCopiedPromo(false), 2000);
  };

  if (!mounted) return null;

  const modalContent = (
    <>
      {/* Full-screen backdrop */}
      <div 
        className="modal-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 9999,
        }}
      />
      
      {/* Modal container - perfectly centered */}
      <div 
        className="modal-container"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10000,
          width: '90%',
          maxWidth: '380px',
        }}
      >
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 border-bio-green-500/30 shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 bg-bio-green-500 hover:bg-bio-green-600 text-white rounded-full p-2 shadow-lg z-50 transition-all hover:scale-110"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center mb-4 gradient-text">
              The Legendary Sword
            </h2>

            {/* Compact Sword in Stone - FLIPPED */}
            <div className="relative h-56 flex items-center justify-center mb-4">
              {/* Glow */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isPulling || isPulled ? 'opacity-100' : 'opacity-0'}`}>
                <div className="w-32 h-32 bg-bio-green-500/20 rounded-full blur-2xl animate-pulse"></div>
              </div>

              {/* Stone - Positioned higher */}
              <svg viewBox="0 0 200 200" className="absolute top-8 w-32 h-32">
                <ellipse cx="100" cy="160" rx="80" ry="30" fill="#555" />
                <path d="M 40 160 L 30 100 Q 30 80 50 70 L 150 70 Q 170 80 170 100 L 160 160 Z" fill="#777" stroke="#555" strokeWidth="2" />
              </svg>

              {/* Sword - FLIPPED UPSIDE DOWN with handle on top */}
              <svg
                viewBox="0 0 200 400"
                className={`absolute w-16 h-48 transition-all duration-2000 ${
                  isPulling ? 'translate-y-[-10px] animate-wiggle' : ''
                } ${
                  isPulled ? 'translate-y-[-60px] scale-110' : ''
                }`}
                style={{ 
                  filter: isPulled ? 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.8))' : 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))',
                  top: '20px'
                }}
              >
                <defs>
                  <linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c0c0c0" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#c0c0c0" />
                  </linearGradient>
                  <clipPath id="hideInStone">
                    {/* Only show the part ABOVE y=180 (handle part) when NOT pulled */}
                    <rect x="0" y="0" width="200" height="180" />
                  </clipPath>
                </defs>
                
                <g clipPath={isPulled ? 'none' : 'url(#hideInStone)'}>
                  {/* Pommel at TOP */}
                  <circle cx="100" cy="65" r="12" fill="#ffd700" stroke="#d4af37" strokeWidth="2" />
                  <circle cx="100" cy="65" r="6" fill="#22c55e" className={isPulled ? 'animate-pulse' : ''} />
                  
                  {/* Handle below pommel */}
                  <rect x="90" y="75" width="20" height="60" fill="#8B4513" stroke="#654321" strokeWidth="1" rx="2" />
                  
                  {/* Guard */}
                  <rect x="70" y="135" width="60" height="15" fill="#ffd700" stroke="#d4af37" strokeWidth="2" rx="3" />
                  
                  {/* Blade pointing DOWN - from guard downward - FULL BLADE VISIBLE WHEN PULLED */}
                  <path d="M 95 150 L 90 350 L 100 355 L 110 350 L 105 150 Z" fill="url(#blade)" stroke="#aaa" strokeWidth="1" className={isPulled ? 'animate-pulse' : ''} />
                </g>
              </svg>

              {/* Flames coming out of stone when pulling */}
              {isPulling && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={`flame-${i}`}
                      className="absolute animate-flame"
                      style={{
                        left: `${45 + (i * 3)}%`,
                        top: '50%',
                        animationDelay: `${i * 0.1}s`,
                      }}
                    >
                      <div 
                        className="flame-particle"
                        style={{
                          width: '4px',
                          height: '16px',
                          background: 'linear-gradient(to top, #fbbf24, #f59e0b, transparent)',
                          borderRadius: '50% 50% 0 0',
                          filter: 'blur(1px)',
                        }}
                      />
                    </div>
                  ))}
                </>
              )}

              {/* Energy burst when pulled */}
              {isPulled && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={`burst-${i}`}
                      className="absolute animate-burst"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `rotate(${i * 30}deg)`,
                      }}
                    >
                      <div
                        style={{
                          width: '3px',
                          height: '20px',
                          background: 'linear-gradient(to top, transparent, #22c55e, transparent)',
                          boxShadow: '0 0 8px #22c55e',
                        }}
                      />
                    </div>
                  ))}
                </>
              )}

              {/* Sparks when pulling */}
              {isPulling && (
                <>
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1.5 h-1.5 bg-bio-green-500 rounded-full animate-ping"
                      style={{
                        left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 50}%`,
                        top: `${40 + Math.sin(i * 45 * Math.PI / 180) * 50}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Message/Button */}
            {showMessage ? (
              <div className="text-center space-y-3 animate-fade-in">
                <p className="text-xl font-bold text-bio-green-500">⚔️ You Are Worthy! ⚔️</p>
                <p className="text-sm text-gray-300">The legendary blade recognizes your spirit!</p>
                <p className="text-xs text-gray-400 italic">
                  The ancient power flows through you. This sacred sword, forged in the fires of evolution, 
                  has chosen its champion. With this blade comes great responsibility and even greater rewards.
                </p>
                
                {/* Promo Code */}
                <div className="bg-gray-800/50 border-2 border-bio-green-500 rounded-lg p-4 mt-3">
                  <p className="text-xs text-gray-400 mb-1">🎁 Your Legendary Reward:</p>
                  <p className="text-2xl font-bold text-bio-green-500 mb-2">20% OFF</p>
                  <p className="text-xs text-gray-400 mb-3">Sacred promo code revealed:</p>
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="bg-gray-900 border border-bio-green-500/50 rounded px-4 py-2">
                      <span className="text-xl font-mono font-bold text-white">2026</span>
                    </div>
                    <button
                      onClick={handleCopyPromo}
                      className="bg-bio-green-500 hover:bg-bio-green-600 text-white p-2 rounded transition-all"
                      title="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {copiedPromo && (
                    <p className="text-xs text-bio-green-500 mt-2">✓ Copied to your inventory!</p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-3">
                    ⚡ Use this code at checkout to unlock your discount
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={handlePull}
                  disabled={isPulling}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    isPulling ? 'bg-gray-600' : 'bg-bio-green-500 hover:bg-bio-green-600'
                  } text-white`}
                >
                  {isPulling ? 'Pulling...' : 'Pull the Sword! ⚔️'}
                </button>
                <p className="text-xs text-gray-400 mt-2">Only the worthy can pull this blade...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(-10px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(-3deg); }
          75% { transform: translateY(-10px) rotate(3deg); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes flame {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(0.5);
            opacity: 0;
          }
        }
        
        @keyframes burst {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-30px) scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-wiggle { animation: wiggle 0.3s ease-in-out 6; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-flame { animation: flame 1s ease-out infinite; }
        .animate-burst { animation: burst 0.8s ease-out forwards; }
      `}</style>
    </>
  );

  // Render at body level using portal
  return createPortal(modalContent, document.body);
}
