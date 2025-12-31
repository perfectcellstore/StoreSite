'use client';

/* eslint-disable react/no-unknown-property */

import React, { useState } from 'react';
import { MessageCircle, Heart, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { playClick } from '@/lib/audioManager';

export function WhatsAppButton() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [emote, setEmote] = useState(null);
  const [clickEffect, setClickEffect] = useState([]);

  const emotes = [
    { icon: Heart, color: '#ff6b9d', label: '💚' },
    { icon: Sparkles, color: '#ffd93d', label: '✨' },
    { icon: Zap, color: '#22c55e', label: '⚡' }
  ];

  const handleClick = (e) => {
    // Prevent immediate navigation
    e.preventDefault();
    
    // Trigger animation
    setIsAnimating(true);
    
    // Random emote
    const randomEmote = emotes[Math.floor(Math.random() * emotes.length)];
    setEmote(randomEmote);

    // Create spark effect at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSpark = {
      id: Date.now(),
      x,
      y,
      angle: Math.random() * 360
    };
    
    setClickEffect([...clickEffect, newSpark]);

    // Play sound effect (shared low-latency WebAudio)
    // NOTE: GlobalClickSound already handles most taps, but keep this for reliability.
    try {
      playClick();
    } catch (e) {
      // ignore
    }

    // Reset after animation
    setTimeout(() => {
      setIsAnimating(false);
      setEmote(null);
      window.open('https://wa.me/9647733797713', '_blank');
    }, 600);

    // Remove spark after animation
    setTimeout(() => {
      setClickEffect(prev => prev.filter(s => s.id !== newSpark.id));
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Emote Display */}
      {emote && (
        <div 
          className="absolute -top-16 left-1/2 -translate-x-1/2 text-4xl animate-float pointer-events-none"
          style={{ animation: 'float 0.6s ease-out' }}
        >
          {emote.label}
        </div>
      )}

      {/* Spark Effects */}
      {clickEffect.map(spark => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{
            left: spark.x,
            top: spark.y,
            animation: 'spark-burst 0.6s ease-out forwards'
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-bio-green-500 rounded-full"
              style={{
                transform: `rotate(${spark.angle + i * 60}deg) translateY(-20px)`,
                animation: 'spark-fade 0.6s ease-out forwards'
              }}
            />
          ))}
        </div>
      ))}

      {/* Main Button */}
      <div className="relative">
        {/* Glow Ring Effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-bio-green-500/30 animate-ping" />
        )}
        
        <Button
          size="lg"
          onClick={handleClick}
          className={`
            relative rounded-full h-16 w-16 bg-bio-green-500 hover:bg-bio-green-600 
            shadow-lg hover:shadow-xl transition-all overflow-visible
            ${isAnimating ? 'scale-110 rotate-12' : ''}
          `}
          style={{
            transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: isAnimating 
              ? '0 0 40px rgba(34, 197, 94, 0.8), 0 0 80px rgba(34, 197, 94, 0.4)' 
              : '0 10px 40px rgba(34, 197, 94, 0.4)'
          }}
        >
          {/* Rotating Glow Effect */}
          <div className="absolute inset-0 rounded-full opacity-50">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent animate-spin-slow opacity-20" />
          </div>
          
          <MessageCircle 
            className={`h-7 w-7 text-white relative z-10 transition-transform ${isAnimating ? 'scale-125' : ''}`} 
          />
          
          {/* Pulse Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-bio-green-400 animate-ping opacity-75" />
        </Button>

        {/* Perfect Cell Energy Aura */}
        <div className="absolute -inset-2 rounded-full bg-gradient-radial from-bio-green-500/20 to-transparent animate-pulse pointer-events-none" />
      </div>

      <style jsx>{`
        @keyframes spark-burst {
          0% {
            opacity: 1;
            transform: scale(0);
          }
          100% {
            opacity: 0;
            transform: scale(2);
          }
        }
        
        @keyframes spark-fade {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px);
          }
        }

        @keyframes animate-spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: animate-spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
