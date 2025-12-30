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

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 border-bio-green-500/30 shadow-2xl w-full max-w-sm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-bio-green-500 hover:bg-bio-green-600 text-white rounded-full p-2 shadow-lg z-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4 gradient-text">
            The Legendary Sword
          </h2>

          {/* Compact Sword in Stone */}
          <div className="relative h-48 flex items-end justify-center mb-4">
            {/* Glow */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isPulling || isPulled ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-32 h-32 bg-bio-green-500/20 rounded-full blur-2xl animate-pulse"></div>
            </div>

            {/* Stone - Smaller */}
            <svg viewBox="0 0 200 200" className="absolute bottom-0 w-32 h-32">
              <ellipse cx="100" cy="160" rx="80" ry="30" fill="#555" />
              <path d="M 40 160 L 30 100 Q 30 80 50 70 L 150 70 Q 170 80 170 100 L 160 160 Z" fill="#777" stroke="#555" strokeWidth="2" />
            </svg>

            {/* Sword - Smaller */}
            <svg
              viewBox="0 0 200 400"
              className={`w-16 h-48 transition-all duration-2000 ${
                isPulling ? 'translate-y-[-50px] animate-wiggle' : ''
              } ${
                isPulled ? 'translate-y-[-80px] scale-110 rotate-12' : ''
              }`}
              style={{ 
                filter: isPulled ? 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.8))' : 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))'
              }}
            >
              <defs>
                <linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c0c0c0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#c0c0c0" />
                </linearGradient>
              </defs>
              <path d="M 95 50 L 90 250 L 100 255 L 110 250 L 105 50 Z" fill="url(#blade)" stroke="#aaa" strokeWidth="1" />
              <rect x="70" y="250" width="60" height="15" fill="#ffd700" stroke="#d4af37" strokeWidth="2" rx="3" />
              <rect x="90" y="265" width="20" height="60" fill="#8B4513" stroke="#654321" strokeWidth="1" rx="2" />
              <circle cx="100" cy="335" r="12" fill="#ffd700" stroke="#d4af37" strokeWidth="2" />
              <circle cx="100" cy="335" r="6" fill="#22c55e" className={isPulled ? 'animate-pulse' : ''} />
            </svg>

            {/* Sparks when pulling */}
            {isPulling && (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-bio-green-500 rounded-full animate-ping"
                    style={{
                      left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%`,
                      top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}%`,
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
              
              {/* Promo Code */}
              <div className="bg-gray-800/50 border-2 border-bio-green-500 rounded-lg p-4 mt-3">
                <p className="text-xs text-gray-400 mb-1">Your Reward:</p>
                <p className="text-2xl font-bold text-bio-green-500 mb-2">20% OFF</p>
                <p className="text-xs text-gray-400 mb-3">Promo code:</p>
                
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
                  <p className="text-xs text-bio-green-500 mt-2">✓ Copied!</p>
                )}
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

      <style jsx>{`
        @keyframes wiggle {
          0%, 100% { transform: translateY(-50px) rotate(0deg); }
          25% { transform: translateY(-50px) rotate(-5deg); }
          75% { transform: translateY(-50px) rotate(5deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-wiggle { animation: wiggle 0.3s ease-in-out 6; }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
}
