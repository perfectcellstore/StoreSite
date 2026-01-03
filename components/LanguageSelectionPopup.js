'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useEffects } from '@/lib/contexts/EffectsContext';

const STORAGE_KEY = 'perfect_sell_language_selected';
const AUDIO_STORAGE_KEY = 'perfect_sell_audio_selected';

export function LanguageSelectionPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('hidden'); // 'hidden' | 'burst' | 'visible' | 'exit'
  const [step, setStep] = useState('language'); // 'language' | 'music' | 'effects'
  const { language, toggleLanguage } = useLanguage();
  const { effectsEnabled, toggleEffects } = useEffects();
  const popupRef = useRef(null);
  const prefersReducedMotion = useRef(false);
  const selectedLanguageRef = useRef('en');

  // Check for first visit and reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check reduced motion preference
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
          }, prefersReducedMotion.current ? 50 : 250);
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLanguageSelect = useCallback((selectedLang) => {
    // Save selection to localStorage
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem('language', selectedLang);
    selectedLanguageRef.current = selectedLang;

    // Apply language and direction
    if (selectedLang !== language) {
      toggleLanguage();
    }

    // Transition to music question
    setAnimationPhase('exit');
    setTimeout(() => {
      setStep('music');
      setAnimationPhase('burst');
      setTimeout(() => {
        setAnimationPhase('visible');
      }, prefersReducedMotion.current ? 50 : 250);
    }, prefersReducedMotion.current ? 50 : 200);
  }, [language, toggleLanguage]);

  const handleMusicSelect = useCallback(async (wantMusic) => {
    // Mark audio selection as done
    localStorage.setItem(AUDIO_STORAGE_KEY, 'true');
    localStorage.setItem('musicEnabled', wantMusic.toString());

    // Import and initialize audio with user gesture (Safari-safe)
    try {
      const { initAudioWithUserGesture } = await import('@/lib/audioManager');
      initAudioWithUserGesture(wantMusic);
    } catch (err) {
      console.error('Failed to initialize audio:', err);
    }

    if (wantMusic) {
      // User wants music - close popup, music will play
      setAnimationPhase('exit');
      setTimeout(() => {
        setShowPopup(false);
      }, prefersReducedMotion.current ? 50 : 200);
    } else {
      // User doesn't want music - ask about click effects
      // This is needed because Safari blocks all audio until user gesture
      setAnimationPhase('exit');
      setTimeout(() => {
        setStep('effects');
        setAnimationPhase('burst');
        setTimeout(() => {
          setAnimationPhase('visible');
        }, prefersReducedMotion.current ? 50 : 250);
      }, prefersReducedMotion.current ? 50 : 200);
    }
  }, []);

  const handleEffectsSelect = useCallback((wantEffects) => {
    // Save effects preference
    localStorage.setItem('effectsEnabled', wantEffects.toString());
    
    // If current state doesn't match desired, toggle
    if (wantEffects !== effectsEnabled) {
      toggleEffects();
    }

    // Close popup
    setAnimationPhase('exit');
    setTimeout(() => {
      setShowPopup(false);
    }, prefersReducedMotion.current ? 50 : 200);
  }, [effectsEnabled, toggleEffects]);

  if (!showPopup) return null;

  const isReduced = prefersReducedMotion.current;
  const isArabic = selectedLanguageRef.current === 'ar';

  // Text content based on selected language
  const content = {
    language: {
      title: 'Choose Your Language',
      titleAr: 'اختر لغتك',
      subtitle: 'Select your preferred language to continue',
      footer: 'You can change this later in settings',
    },
    music: {
      title: isArabic ? 'هل تريد موسيقى الخلفية؟' : 'Enable Background Music?',
      subtitle: isArabic ? 'موسيقى هادئة ومريحة أثناء التصفح' : 'Calm ambient music while you browse',
      yes: isArabic ? 'نعم، شغّل الموسيقى' : 'Yes, play music',
      no: isArabic ? 'لا، بدون موسيقى' : 'No, skip music',
      footer: isArabic ? 'يمكنك تغيير هذا لاحقاً من القائمة' : 'You can change this later in the menu',
    },
    effects: {
      title: isArabic ? 'هل تريد أصوات النقر؟' : 'Enable Click Sound Effects?',
      subtitle: isArabic ? 'أصوات خفيفة عند النقر على العناصر' : 'Subtle sound feedback when clicking',
      yes: isArabic ? 'نعم، شغّل الأصوات' : 'Yes, enable sounds',
      no: isArabic ? 'لا، بدون أصوات' : 'No, keep silent',
      footer: isArabic ? 'يمكنك تغيير هذا لاحقاً من القائمة' : 'You can change this later in the menu',
    },
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        backgroundColor: animationPhase === 'hidden' ? 'transparent' : 'rgba(0, 0, 0, 0.7)',
        transition: isReduced ? 'none' : 'background-color 200ms ease-out',
        pointerEvents: animationPhase === 'hidden' ? 'none' : 'auto',
      }}
      dir={isArabic && step !== 'language' ? 'rtl' : 'ltr'}
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
        {/* Energy Burst Ring - Outer Glow */}
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

        {/* Energy Burst Ring - Inner Glow */}
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
          {/* STEP 1: Language Selection */}
          {step === 'language' && (
            <>
              {/* Icon/Logo */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full bg-bio-green-500/20 border border-bio-green-500/40 flex items-center justify-center"
                  style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
                >
                  <svg className="w-8 h-8 text-bio-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                {content.language.title}
              </h2>
              <p className="text-center text-gray-400 mb-2">
                {content.language.titleAr}
              </p>
              <p className="text-center text-sm text-gray-500 mb-8">
                {content.language.subtitle}
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
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-bio-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-bio-green-500 transition-colors rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-center text-xs text-gray-500 mt-6">
                {content.language.footer}
              </p>
            </>
          )}

          {/* STEP 2: Music Selection */}
          {step === 'music' && (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full bg-bio-green-500/20 border border-bio-green-500/40 flex items-center justify-center"
                  style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
                >
                  <svg className="w-8 h-8 text-bio-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                {content.music.title}
              </h2>
              <p className="text-center text-sm text-gray-400 mb-8">
                {content.music.subtitle}
              </p>

              {/* Music Buttons */}
              <div className="space-y-3">
                {/* Yes Button */}
                <button
                  onClick={() => handleMusicSelect(true)}
                  className="w-full py-4 px-6 bg-bio-green-500/20 hover:bg-bio-green-500/30 border border-bio-green-500/50 hover:border-bio-green-500 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                >
                  <svg className="w-6 h-6 text-bio-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="text-white font-semibold">{content.music.yes}</span>
                </button>

                {/* No Button */}
                <button
                  onClick={() => handleMusicSelect(false)}
                  className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  <span className="text-gray-300 font-semibold">{content.music.no}</span>
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-center text-xs text-gray-500 mt-6">
                {content.music.footer}
              </p>
            </>
          )}

          {/* STEP 3: Click Effects Selection (Only shown if NO music) */}
          {step === 'effects' && (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full bg-bio-green-500/20 border border-bio-green-500/40 flex items-center justify-center"
                  style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}
                >
                  <svg className="w-8 h-8 text-bio-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-center text-white mb-2">
                {content.effects.title}
              </h2>
              <p className="text-center text-sm text-gray-400 mb-8">
                {content.effects.subtitle}
              </p>

              {/* Effects Buttons */}
              <div className="space-y-3">
                {/* Yes Button */}
                <button
                  onClick={() => handleEffectsSelect(true)}
                  className="w-full py-4 px-6 bg-bio-green-500/20 hover:bg-bio-green-500/30 border border-bio-green-500/50 hover:border-bio-green-500 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                >
                  <svg className="w-6 h-6 text-bio-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white font-semibold">{content.effects.yes}</span>
                </button>

                {/* No Button */}
                <button
                  onClick={() => handleEffectsSelect(false)}
                  className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                >
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-300 font-semibold">{content.effects.no}</span>
                </button>
              </div>

              {/* Footer Note */}
              <p className="text-center text-xs text-gray-500 mt-6">
                {content.effects.footer}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
