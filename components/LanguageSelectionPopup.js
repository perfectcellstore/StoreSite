'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const STORAGE_KEY = 'perfect_sell_language_selected';

export function LanguageSelectionPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('hidden'); // 'hidden' | 'burst' | 'visible' | 'exit'
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const popupRef = useRef(null);

  // Check for first visit and reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check reduced motion preference
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    // Check if user has already selected a language
    const hasSelectedLanguage = localStorage.getItem(STORAGE_KEY);
    
    if (!hasSelectedLanguage) {
      // Small delay to not block initial page render
      const timer = setTimeout(() => {
        setShowPopup(true);
        // Start animation after popup mounts
        requestAnimationFrame(() => {
          setAnimationPhase('burst');
          // Transition to visible state after burst animation
          setTimeout(() => {
            setAnimationPhase('visible');
          }, prefersReducedMotion ? 50 : 250);
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = useCallback((selectedLang) => {
    // Save selection to localStorage
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem('language', selectedLang);

    // Apply language and direction
    if (selectedLang !== language) {
      toggleLanguage();
    }

    // Exit animation
    setAnimationPhase('exit');
    
    // Remove popup after exit animation
    setTimeout(() => {
      setShowPopup(false);
    }, prefersReducedMotion ? 50 : 200);
  }, [language, toggleLanguage]);

  if (!showPopup) return null;

  const isReduced = prefersReducedMotion.current;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: animationPhase === 'hidden' ? 'transparent' : 'rgba(0, 0, 0, 0.7)',
        transition: isReduced ? 'none' : 'background-color 200ms ease-out',
        pointerEvents: animationPhase === 'hidden' ? 'none' : 'auto',
      }}
    >
      {/* Popup Container with Energy Burst Animation */}
      <div
        ref={popupRef}
        className="relative"
        style={{
          transform: animationPhase === 'hidden' ? 'scale(0)' :
                     animationPhase === 'burst' ? 'scale(1.05)' :
                     animationPhase === 'exit' ? 'scale(0.95)' : 'scale(1)',
          opacity: animationPhase === 'hidden' ? 0 :
                   animationPhase === 'exit' ? 0 : 1,
          transition: isReduced ? 'opacity 50ms ease-out' :
                      animationPhase === 'burst' ? 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 100ms ease-out' :
                      'transform 100ms ease-out, opacity 150ms ease-out',
          willChange: 'transform, opacity',
        }}
      >
        {/* Energy Burst Ring - Outer Glow (pseudo-element 1) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            transform: animationPhase === 'burst' ? 'scale(1.3)' : 'scale(1)',
            opacity: animationPhase === 'burst' ? 0.8 : 0,
            background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.6) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
            transition: isReduced ? 'none' : 'transform 200ms ease-out, opacity 200ms ease-out',
            willChange: 'transform, opacity',
            zIndex: -1,
          }}
        />

        {/* Energy Burst Ring - Inner Glow (pseudo-element 2) */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            transform: animationPhase === 'burst' ? 'scale(1.15)' : 'scale(1)',
            opacity: animationPhase === 'burst' ? 1 : 0,
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(34, 197, 94, 0.3) 30%, transparent 60%)',
            transition: isReduced ? 'none' : 'transform 180ms ease-out, opacity 180ms ease-out',
            willChange: 'transform, opacity',
            zIndex: -1,
          }}
        />

        {/* Main Popup Card */}
        <div 
          className="relative bg-gray-900/95 backdrop-blur-sm border border-bio-green-500/30 rounded-2xl p-8 max-w-md mx-4"
          style={{
            boxShadow: animationPhase === 'visible' ? '0 0 40px rgba(34, 197, 94, 0.2), 0 0 80px rgba(34, 197, 94, 0.1)' :
                       animationPhase === 'burst' ? '0 0 60px rgba(34, 197, 94, 0.4), 0 0 120px rgba(34, 197, 94, 0.2)' :
                       'none',
            transition: isReduced ? 'none' : 'box-shadow 250ms ease-out',
          }}
        >
          {/* Icon/Logo */}
          <div className="flex justify-center mb-6">
            <div 
              className="w-16 h-16 rounded-full bg-bio-green-500/20 border border-bio-green-500/40 flex items-center justify-center"
              style={{
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
              }}
            >
              <svg 
                className="w-8 h-8 text-bio-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" 
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-white mb-2">
            Choose Your Language
          </h2>
          <p className="text-center text-gray-400 mb-2">
            اختر لغتك
          </p>
          <p className="text-center text-sm text-gray-500 mb-8">
            Select your preferred language to continue
          </p>

          {/* Language Buttons */}
          <div className="space-y-3">
            {/* English Button */}
            <button
              onClick={() => handleLanguageSelect('en')}
              className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-bio-green-500/50 rounded-xl transition-all duration-200 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇺🇸</span>
                <div className="text-left">
                  <p className="text-white font-semibold">English</p>
                  <p className="text-sm text-gray-400">Continue in English</p>
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-gray-500 group-hover:text-bio-green-500 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Arabic Button */}
            <button
              onClick={() => handleLanguageSelect('ar')}
              className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-bio-green-500/50 rounded-xl transition-all duration-200 flex items-center justify-between group"
              dir="rtl"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇶</span>
                <div className="text-right">
                  <p className="text-white font-semibold">العربية</p>
                  <p className="text-sm text-gray-400">المتابعة بالعربية</p>
                </div>
              </div>
              <svg 
                className="w-5 h-5 text-gray-500 group-hover:text-bio-green-500 transition-colors rotate-180" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            You can change this later in settings
          </p>
        </div>
      </div>
    </div>
  );
}
