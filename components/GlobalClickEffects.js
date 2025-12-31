'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useEffects } from '@/lib/contexts/EffectsContext';

export function GlobalClickEffects() {
  const { effectsEnabled } = useEffects();
  const audioContextRef = useRef(null);
  const lastSoundTime = useRef(0);
  const soundCooldown = 100; // Only play sound every 100ms max

  // Initialize AudioContext once and reuse it
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.log('Audio not supported');
      }
    }
  }, []);

  const playSound = useCallback(() => {
    if (!audioContextRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      const now = Date.now();
      
      // Throttle sound to prevent audio stacking
      if (now - lastSoundTime.current < soundCooldown) return;
      lastSoundTime.current = now;

      // Main whoosh oscillator
      const oscillator1 = audioContext.createOscillator();
      const gainNode1 = audioContext.createGain();
      
      oscillator1.connect(gainNode1);
      gainNode1.connect(audioContext.destination);
      
      // Main frequency sweep (sharp drop like instant transmission)
      oscillator1.frequency.setValueAtTime(2000, audioContext.currentTime);
      oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.3);
      
      // Volume envelope
      gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode1.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.02);
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      // Use sawtooth for "electric" feel
      oscillator1.type = 'sawtooth';
      
      oscillator1.start(audioContext.currentTime);
      oscillator1.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      // Don't create effects if disabled
      if (!effectsEnabled) return;
      
      // Only play sound, no visual effects that cause re-renders
      playSound();
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [effectsEnabled, playSound]);

  // No render output - no visual effects that cause performance issues
  return null;
}
