'use client';

import React, { useEffect, useState } from 'react';
import { useCustomization } from '@/lib/contexts/CustomizationContext';
import { useEffects } from '@/lib/contexts/EffectsContext';

export function AnimatedBackground() {
  const { customization } = useCustomization();
  const { lowPowerMode } = useEffects();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Check if mobile
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get animation settings from customization (with defaults)
  const animationSettings = customization?.animation || {
    enabled: true,
    intensity: 'medium',
    speed: 'medium',
    opacity: 0.3,
    placement: 'global',
  };

  // Don't render if disabled, reduced motion preferred, low power mode, or not in specified placement
  if (!animationSettings.enabled || prefersReducedMotion || lowPowerMode) {
    return null;
  }

  // Adjust settings for mobile
  const effectiveIntensity = isMobile ? 'low' : animationSettings.intensity;
  const effectiveSpeed = isMobile ? 'slow' : animationSettings.speed;
  const effectiveOpacity = isMobile ? Math.min(animationSettings.opacity, 0.2) : animationSettings.opacity;

  // Map intensity to number of waves
  const waveCount = {
    low: 2,
    medium: 3,
    high: 5,
  }[effectiveIntensity];

  // Map speed to animation duration
  const animationDuration = {
    slow: '30s',
    medium: '20s',
    fast: '12s',
  }[effectiveSpeed];

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ 
        zIndex: 0,
        opacity: effectiveOpacity,
      }}
      aria-hidden="true"
    >
      {/* Energy Wave Layers */}
      {Array.from({ length: waveCount }).map((_, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at ${20 + index * 20}% ${30 + index * 15}%, 
              rgba(16, 185, 129, 0.4) 0%, 
              rgba(59, 130, 246, 0.3) 30%, 
              transparent 70%)`,
            animation: `energyWave${index} ${animationDuration} ease-in-out infinite`,
            animationDelay: `${index * 2}s`,
            filter: 'blur(40px)',
            transform: `scale(${1.2 + index * 0.3})`,
          }}
        />
      ))}

      {/* Pulsing Energy Core */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isMobile ? '200px' : '400px',
          height: isMobile ? '200px' : '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, transparent 70%)',
          animation: `energyPulse ${animationDuration} ease-in-out infinite`,
          filter: 'blur(60px)',
        }}
      />

      {/* Flowing Aura Streaks */}
      {effectiveIntensity !== 'low' && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 0%, rgba(16, 185, 129, 0.3) 50%, transparent 100%)',
              animation: `auraFlow1 ${animationDuration} linear infinite`,
              filter: 'blur(30px)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(-45deg, transparent 0%, rgba(59, 130, 246, 0.25) 50%, transparent 100%)',
              animation: `auraFlow2 ${animationDuration} linear infinite`,
              animationDelay: '5s',
              filter: 'blur(30px)',
            }}
          />
        </>
      )}

      {/* Light Beam Effect (High Intensity Only) */}
      {effectiveIntensity === 'high' && !isMobile && (
        <div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, 
              transparent 0deg, 
              rgba(16, 185, 129, 0.2) 60deg, 
              transparent 120deg, 
              rgba(59, 130, 246, 0.15) 180deg, 
              transparent 240deg, 
              rgba(16, 185, 129, 0.2) 300deg, 
              transparent 360deg)`,
            animation: `lightBeam ${animationDuration} linear infinite`,
            filter: 'blur(50px)',
          }}
        />
      )}

      {/* CSS Animations - Injected into page */}
      <style jsx>{`
        @keyframes energyWave0 {
          0%, 100% { 
            transform: scale(1.2) translate(0%, 0%); 
            opacity: 0.6;
          }
          50% { 
            transform: scale(1.5) translate(5%, 5%); 
            opacity: 0.8;
          }
        }

        @keyframes energyWave1 {
          0%, 100% { 
            transform: scale(1.5) translate(0%, 0%); 
            opacity: 0.5;
          }
          50% { 
            transform: scale(1.8) translate(-5%, 5%); 
            opacity: 0.7;
          }
        }

        @keyframes energyWave2 {
          0%, 100% { 
            transform: scale(1.8) translate(0%, 0%); 
            opacity: 0.4;
          }
          50% { 
            transform: scale(2.1) translate(3%, -5%); 
            opacity: 0.6;
          }
        }

        @keyframes energyWave3 {
          0%, 100% { 
            transform: scale(2.1) translate(0%, 0%); 
            opacity: 0.3;
          }
          50% { 
            transform: scale(2.4) translate(-3%, 3%); 
            opacity: 0.5;
          }
        }

        @keyframes energyWave4 {
          0%, 100% { 
            transform: scale(2.4) translate(0%, 0%); 
            opacity: 0.25;
          }
          50% { 
            transform: scale(2.7) translate(4%, -4%); 
            opacity: 0.4;
          }
        }

        @keyframes energyPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1); 
            opacity: 0.4;
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.3); 
            opacity: 0.7;
          }
        }

        @keyframes auraFlow1 {
          0% { 
            transform: translateX(-100%) rotate(45deg); 
          }
          100% { 
            transform: translateX(100%) rotate(45deg); 
          }
        }

        @keyframes auraFlow2 {
          0% { 
            transform: translateX(100%) rotate(-45deg); 
          }
          100% { 
            transform: translateX(-100%) rotate(-45deg); 
          }
        }

        @keyframes lightBeam {
          0% { 
            transform: rotate(0deg); 
          }
          100% { 
            transform: rotate(360deg); 
          }
        }

        /* Performance optimization - use GPU acceleration */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Further simplification on low-end devices */
        @media (max-width: 768px) {
          [style*="blur"] {
            filter: blur(20px) !important;
          }
        }
      `}</style>
    </div>
  );
}
