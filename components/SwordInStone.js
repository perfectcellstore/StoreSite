'use client';

import React, { useState } from 'react';
import { X, Copy } from 'lucide-react';

export function SwordInStone({ onClose }) {
  const [isPulling, setIsPulling] = useState(false);
  const [isPulled, setIsPulled] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);

  const handlePull = () => {
    if (isPulled) return;
    
    setIsPulling(true);
    
    // Play sword pull sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create sword pulling sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Rising metallic sound
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

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-[10001] bg-bio-green-500 hover:bg-bio-green-600 text-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Main Container */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg p-4 sm:p-8 border-2 border-bio-green-500/30 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">
            <span className="gradient-text">The Legendary Sword</span>
          </h2>

          {/* SVG Sword in Stone - Smaller for mobile */}
          <div className="relative flex justify-center items-end h-64 sm:h-96 mb-4 sm:mb-6">
            {/* Mystical Glow */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isPulling || isPulled ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-64 h-64 bg-bio-green-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Stone */}
            <svg
              viewBox="0 0 200 200"
              className="absolute bottom-0 w-48 h-48 sm:w-64 sm:h-64"
            >
              {/* Stone base */}
              <ellipse cx="100" cy="160" rx="80" ry="30" fill="#555" />
              <path
                d="M 40 160 L 30 100 Q 30 80 50 70 L 150 70 Q 170 80 170 100 L 160 160 Z"
                fill="#777"
                stroke="#555"
                strokeWidth="2"
              />
              <path
                d="M 50 90 L 45 100 L 55 95 Z"
                fill="#666"
              />
              <path
                d="M 140 85 L 145 95 L 135 90 Z"
                fill="#666"
              />
            </svg>

            {/* Sword */}
            <svg
              viewBox="0 0 200 400"
              className={`w-24 h-64 sm:w-32 sm:h-96 transition-all duration-2000 z-10 ${
                isPulling ? 'translate-y-[-80px] sm:translate-y-[-120px] animate-wiggle' : ''
              } ${
                isPulled ? 'translate-y-[-120px] sm:translate-y-[-200px] scale-110 rotate-12' : ''
              }`}
              style={{ 
                filter: isPulled ? 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))' : 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))'
              }}
            >
              {/* Blade */}
              <defs>
                <linearGradient id="bladeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c0c0c0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#c0c0c0" />
                </linearGradient>
                <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(34, 197, 94, 0)" />
                  <stop offset="50%" stopColor="rgba(34, 197, 94, 0.8)" />
                  <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
                </linearGradient>
              </defs>
              
              <path
                d="M 95 50 L 90 250 L 100 255 L 110 250 L 105 50 Z"
                fill="url(#bladeGradient)"
                stroke="#aaa"
                strokeWidth="1"
                className={isPulled ? 'animate-pulse' : ''}
              />
              
              {/* Blade edge glow */}
              <line
                x1="100"
                y1="50"
                x2="100"
                y2="250"
                stroke="url(#edgeGlow)"
                strokeWidth="2"
                className={isPulled ? 'animate-pulse' : ''}
              />
              
              {/* Guard */}
              <rect
                x="70"
                y="250"
                width="60"
                height="15"
                fill="#ffd700"
                stroke="#d4af37"
                strokeWidth="2"
                rx="3"
              />
              
              {/* Handle */}
              <rect
                x="90"
                y="265"
                width="20"
                height="60"
                fill="#8B4513"
                stroke="#654321"
                strokeWidth="1"
                rx="2"
              />
              
              {/* Pommel */}
              <circle
                cx="100"
                cy="335"
                r="12"
                fill="#ffd700"
                stroke="#d4af37"
                strokeWidth="2"
              />
              
              {/* Decorative gem */}
              <circle
                cx="100"
                cy="335"
                r="6"
                fill="#22c55e"
                className={isPulled ? 'animate-pulse' : ''}
              />
            </svg>

            {/* Energy sparks when pulling */}
            {isPulling && (
              <>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-bio-green-500 rounded-full animate-ping"
                    style={{
                      left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 80}%`,
                      top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 80}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Message */}
          {showMessage ? (
            <div className="text-center space-y-4 animate-fade-in">
              <p className="text-2xl font-bold text-bio-green-500">
                ⚔️ You Are Worthy! ⚔️
              </p>
              <p className="text-lg text-gray-300">
                The legendary blade recognizes your spirit!
              </p>
              <p className="text-sm text-gray-400 mb-4">
                You have discovered the secret of Perfect Sell
              </p>
              
              {/* Promo Code Reveal */}
              <div className="bg-gray-800/50 border-2 border-bio-green-500 rounded-lg p-6 mt-6">
                <p className="text-sm text-gray-400 mb-2">Your Reward:</p>
                <p className="text-3xl font-bold text-bio-green-500 mb-2">20% OFF</p>
                <p className="text-sm text-gray-400 mb-4">Use this exclusive promo code:</p>
                
                <div className="flex items-center justify-center gap-2">
                  <div className="bg-gray-900 border border-bio-green-500/50 rounded px-6 py-3">
                    <span className="text-2xl font-mono font-bold text-white tracking-wider">2026</span>
                  </div>
                  <button
                    onClick={handleCopyPromo}
                    className="bg-bio-green-500 hover:bg-bio-green-600 text-white p-3 rounded transition-all hover:scale-105"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
                
                {copiedPromo && (
                  <p className="text-sm text-bio-green-500 mt-2 animate-fade-in">
                    ✓ Copied to clipboard!
                  </p>
                )}
                
                <p className="text-xs text-gray-500 mt-4">
                  Use this code at checkout to get your discount
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handlePull}
                disabled={isPulling}
                className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                  isPulling
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-bio-green-500 hover:bg-bio-green-600 hover:scale-105 btn-glow'
                } text-white`}
              >
                {isPulling ? 'Pulling...' : 'Pull the Sword! ⚔️'}
              </button>
              <p className="text-sm text-gray-400 mt-4">
                Only the worthy can pull this legendary blade...
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% {
            transform: translateY(-120px) rotate(0deg);
          }
          25% {
            transform: translateY(-120px) rotate(-5deg);
          }
          75% {
            transform: translateY(-120px) rotate(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out 6;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
