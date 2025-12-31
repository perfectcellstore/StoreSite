'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useEffects } from '@/lib/contexts/EffectsContext';

export function GlobalClickEffects() {
  const { effectsEnabled } = useEffects();
  const audioContextRef = useRef(null);
  const lastSoundTime = useRef(0);
  const lastBurstTime = useRef(0);
  const soundCooldown = 100; // Only play sound every 100ms max
  const burstCooldown = 150; // Throttle visual effect to prevent stacking
  const prefersReducedMotion = useRef(false);

  // Check for reduced motion preference once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Initialize AudioContext
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

  // Create lightweight energy burst at click position
  const createEnergyBurst = useCallback((x, y) => {
    // Skip if reduced motion is preferred
    if (prefersReducedMotion.current) return;
    
    // Throttle to prevent stacking
    const now = Date.now();
    if (now - lastBurstTime.current < burstCooldown) return;
    lastBurstTime.current = now;

    // Create container element - positioned at click location
    const burst = document.createElement('div');
    burst.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 9998;
    `;

    // Layer 1: Outer ring (largest, fades first)
    const ring1 = document.createElement('div');
    ring1.style.cssText = `
      position: absolute;
      left: -40px;
      top: -40px;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.1) 50%, transparent 70%);
      transform: scale(0);
      opacity: 1;
      will-change: transform, opacity;
      filter: blur(2px);
    `;

    // Layer 2: Middle ring (medium, slightly delayed)
    const ring2 = document.createElement('div');
    ring2.style.cssText = `
      position: absolute;
      left: -25px;
      top: -25px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, rgba(34, 197, 94, 0.3) 40%, transparent 70%);
      transform: scale(0);
      opacity: 1;
      will-change: transform, opacity;
      filter: blur(1px);
    `;

    // Layer 3: Inner core (smallest, brightest)
    const core = document.createElement('div');
    core.style.cssText = `
      position: absolute;
      left: -12px;
      top: -12px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(34, 197, 94, 0.6) 50%, transparent 80%);
      transform: scale(0);
      opacity: 1;
      will-change: transform, opacity;
    `;

    burst.appendChild(ring1);
    burst.appendChild(ring2);
    burst.appendChild(core);
    document.body.appendChild(burst);

    // Use requestAnimationFrame for smooth GPU-accelerated animation
    requestAnimationFrame(() => {
      // Animate Layer 1 (outer) - scale 0 to 1.5, opacity 1 to 0
      ring1.style.transition = 'transform 180ms ease-out, opacity 180ms ease-out';
      ring1.style.transform = 'scale(1.5)';
      ring1.style.opacity = '0';

      // Animate Layer 2 (middle) - scale 0 to 1.3, opacity 1 to 0
      ring2.style.transition = 'transform 150ms ease-out, opacity 150ms ease-out';
      ring2.style.transform = 'scale(1.3)';
      ring2.style.opacity = '0';

      // Animate Layer 3 (core) - scale 0 to 1, opacity 1 to 0
      core.style.transition = 'transform 120ms ease-out, opacity 120ms ease-out';
      core.style.transform = 'scale(1)';
      core.style.opacity = '0';
    });

    // Remove DOM node immediately after animation completes (200ms max)
    setTimeout(() => {
      if (burst.parentNode) {
        burst.parentNode.removeChild(burst);
      }
    }, 200);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      // Don't create effects if disabled
      if (!effectsEnabled) return;
      
      // Play sound
      playSound();
      
      // Create energy burst at click position
      createEnergyBurst(e.clientX, e.clientY);
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [effectsEnabled, playSound, createEnergyBurst]);

  // No render output - visual effects created via DOM manipulation
  return null;
}
