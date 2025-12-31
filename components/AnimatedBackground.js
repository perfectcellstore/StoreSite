'use client';

/* eslint-disable react/no-unknown-property, react-hooks/purity */

import React, { useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useCustomization } from '@/lib/contexts/CustomizationContext';
import { usePerf } from '@/lib/contexts/PerfContext';

export function AnimatedBackground() {
  const pathname = usePathname();
  const { customization } = useCustomization();
  const perf = usePerf();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 0 at top of homepage, approaches 1 as you scroll past the hero.
  // Used to fade the green aurora smoothly into the global galaxy background.
  const [scrollFade, setScrollFade] = useState(1);
  const [isLowPowerMobile, setIsLowPowerMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    setIsMobile(window.innerWidth < 768);

    // Perf tier integration: treat low tier as low-power for effects.
    try {
      const cores = navigator?.hardwareConcurrency || 4;
      const mem = navigator?.deviceMemory || 4;
      const low = perf?.tier === 'low' || (window.innerWidth < 420 && (cores <= 4 || mem <= 4));
      setIsLowPowerMobile(!!low);
    } catch {
      setIsLowPowerMobile(perf?.tier === 'low');
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      try {
        const cores = navigator?.hardwareConcurrency || 4;
        const mem = navigator?.deviceMemory || 4;
        const low = perf?.tier === 'low' || (window.innerWidth < 420 && (cores <= 4 || mem <= 4));
        setIsLowPowerMobile(!!low);
      } catch {
        // ignore
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [perf?.tier]);

  const isHomepage = pathname === '/';

  useEffect(() => {
    if (prefersReducedMotion) return;

    // On non-home pages, keep only the subtle residual aurora tint.
    if (!isHomepage) {
      setScrollFade(1);
      return;
    }

    let raf = null;

    const clamp01 = (v) => Math.min(1, Math.max(0, v));
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const heroHeight = window.innerHeight || 1;
        const y = window.scrollY || 0;
        // Fade mostly through the first ~1.2 screens for a seam-free transition.
        const t = clamp01(y / (heroHeight * 1.2));
        setScrollFade(t);
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isHomepage, prefersReducedMotion]);

  // Generate stable star positions (memoized to prevent re-renders)
  const stars = useMemo(() => {
    const starCount = isMobile ? (isLowPowerMobile ? 20 : 40) : 80;
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      brightness: Math.random() > 0.8 ? 1 : 0.6,
    }));
  }, [isMobile, isLowPowerMobile]);

  // Shooting stars (fewer, more impactful)
  const shootingStars = useMemo(() => {
    if (isMobile) return [];
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      delay: i * 8 + Math.random() * 4,
      duration: 1.5 + Math.random(),
      startX: 10 + Math.random() * 30,
      startY: Math.random() * 40,
    }));
  }, [isMobile]);

  const animationSettings = customization?.animation || {
    enabled: true,
    intensity: 'medium',
    speed: 'medium',
    opacity: 0.4,
    placement: 'global',
  };

  if (!animationSettings.enabled || prefersReducedMotion) {
    return null;
  }

  const effectiveIntensity = isMobile ? 'low' : animationSettings.intensity;

  // Homepage: stronger aurora at the top, smoothly fading as you scroll.
  // Site-wide: keep a subtle residual green tint.
  const auroraStart = isMobile ? 0.5 : 0.75;
  const auroraResidual = isMobile ? 0.14 : 0.18;
  const smoothstep = (t) => t * t * (3 - 2 * t);
  const fadeT = smoothstep(isHomepage ? scrollFade : 1);
  const auroraOpacity = auroraStart * (1 - fadeT) + auroraResidual * fadeT;

  const baseDuration = isMobile ? 35 : 25;

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Deep Space Base Layer */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(88, 28, 135, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(15, 23, 42, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(30, 41, 59, 0.2) 0%, transparent 70%)
          `,
        }}
      />

      {/* Twinkling Stars Layer */}
      <div className="absolute inset-0" style={{ opacity: 0.9 }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.brightness > 0.8 ? '#fff' : 'rgba(255,255,255,0.7)',
              boxShadow: star.brightness > 0.8 
                ? '0 0 6px 2px rgba(255,255,255,0.4), 0 0 12px 4px rgba(147,197,253,0.2)' 
                : '0 0 3px 1px rgba(255,255,255,0.3)',
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
              willChange: 'opacity',
            }}
          />
        ))}
      </div>

      {/* Aurora/Nebula Layer 1 - Green Energy (strong at hero, fades smoothly on scroll) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: auroraOpacity,
          background: `
            radial-gradient(ellipse 85% 55% at 18% 38%,
              rgba(16, 185, 129, 0.55) 0%,
              rgba(5, 150, 105, 0.28) 28%,
              rgba(16, 185, 129, 0.12) 46%,
              transparent 72%)
          `,
          animation: `nebulaDrift1 ${baseDuration}s ease-in-out infinite`,
          filter: isMobile ? 'blur(40px)' : 'blur(60px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Aurora/Nebula Layer 2 - Purple/Pink (subtle, supports galaxy depth) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: Math.max(0.08, auroraOpacity * 0.55),
          background: `
            radial-gradient(ellipse 75% 65% at 78% 28%,
              rgba(139, 92, 246, 0.32) 0%,
              rgba(168, 85, 247, 0.18) 30%,
              transparent 66%)
          `,
          animation: `nebulaDrift2 ${baseDuration * 1.2}s ease-in-out infinite`,
          animationDelay: '-5s',
          filter: isMobile ? 'blur(50px)' : 'blur(70px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Aurora/Nebula Layer 3 - Cyan/Blue (ki shimmer) */}
      <div
        className="absolute inset-0"
        style={{
          opacity: Math.max(0.06, auroraOpacity * 0.45),
          background: `
            radial-gradient(ellipse 65% 75% at 62% 72%,
              rgba(34, 211, 238, 0.28) 0%,
              rgba(59, 130, 246, 0.18) 35%,
              transparent 62%)
          `,
          animation: `nebulaDrift3 ${baseDuration * 0.9}s ease-in-out infinite`,
          animationDelay: '-10s',
          filter: isMobile ? 'blur(45px)' : 'blur(65px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Galaxy Core Glow */}
      <div
        className="absolute"
        style={{
          top: '30%',
          left: '25%',
          width: isMobile ? '300px' : '500px',
          height: isMobile ? '300px' : '500px',
          background: `
            radial-gradient(circle at center,
              rgba(16, 185, 129, 0.25) 0%,
              rgba(52, 211, 153, 0.15) 20%,
              rgba(34, 197, 94, 0.08) 40%,
              transparent 70%)
          `,
          animation: `coreGlow ${baseDuration * 0.8}s ease-in-out infinite`,
          filter: isMobile ? 'blur(30px)' : 'blur(50px)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Flowing Aurora Ribbon 1 */}
      {effectiveIntensity !== 'low' && !isLowPowerMobile && perf?.fx?.allowBackgroundRibbons && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.4,
            background: `
              linear-gradient(135deg, 
                transparent 0%, 
                transparent 35%,
                rgba(16, 185, 129, 0.3) 45%,
                rgba(52, 211, 153, 0.2) 50%,
                rgba(34, 211, 238, 0.15) 55%,
                transparent 65%,
                transparent 100%)
            `,
            backgroundSize: '200% 200%',
            animation: `auroraFlow ${baseDuration * 1.5}s ease-in-out infinite`,
            filter: 'blur(20px)',
            willChange: 'background-position',
          }}
        />
      )}

      {/* Flowing Aurora Ribbon 2 */}
      {effectiveIntensity !== 'low' && !isLowPowerMobile && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.35,
            background: `
              linear-gradient(-135deg, 
                transparent 0%, 
                transparent 40%,
                rgba(139, 92, 246, 0.25) 48%,
                rgba(168, 85, 247, 0.15) 52%,
                transparent 60%,
                transparent 100%)
            `,
            backgroundSize: '200% 200%',
            animation: `auroraFlow2 ${baseDuration * 1.3}s ease-in-out infinite`,
            animationDelay: '-8s',
            filter: 'blur(25px)',
            willChange: 'background-position',
          }}
        />
      )}

      {/* Shooting Stars */}
      {!isLowPowerMobile && shootingStars.map((star) => (
        <div
          key={`shooting-${star.id}`}
          className="absolute"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: '2px',
            height: '2px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            boxShadow: `
              0 0 6px 2px rgba(255,255,255,0.8),
              0 0 12px 4px rgba(147,197,253,0.4),
              -20px 0 15px 2px rgba(255,255,255,0.3),
              -40px 0 25px 1px rgba(147,197,253,0.2)
            `,
            animation: `shootingStar ${star.duration}s ease-out ${star.delay}s infinite`,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Cosmic Dust Particles (Desktop only) */}
      {effectiveIntensity === 'high' && !isMobile && (
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.3,
            background: `
              radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.8) 0%, transparent 100%),
              radial-gradient(1px 1px at 30% 60%, rgba(255,255,255,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 50% 30%, rgba(255,255,255,0.7) 0%, transparent 100%),
              radial-gradient(1px 1px at 70% 80%, rgba(255,255,255,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 90% 40%, rgba(255,255,255,0.6) 0%, transparent 100%),
              radial-gradient(2px 2px at 25% 75%, rgba(147,197,253,0.4) 0%, transparent 100%),
              radial-gradient(2px 2px at 75% 25%, rgba(167,139,250,0.4) 0%, transparent 100%)
            `,
            animation: `dustDrift ${baseDuration * 2}s linear infinite`,
            willChange: 'transform',
          }}
        />
      )}

      {/* Galactic Spiral Hint (High intensity only) */}
      {effectiveIntensity === 'high' && !isMobile && (
        <div
          className="absolute"
          style={{
            top: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: `
              conic-gradient(from 0deg at 50% 50%,
                transparent 0deg,
                rgba(16, 185, 129, 0.08) 30deg,
                transparent 60deg,
                rgba(139, 92, 246, 0.06) 120deg,
                transparent 150deg,
                rgba(34, 211, 238, 0.05) 210deg,
                transparent 240deg,
                rgba(16, 185, 129, 0.07) 300deg,
                transparent 330deg,
                transparent 360deg)
            `,
            animation: `spiralRotate ${baseDuration * 3}s linear infinite`,
            filter: 'blur(30px)',
            willChange: 'transform',
          }}
        />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes nebulaDrift1 {
          0%, 100% { 
            transform: translate(0%, 0%) scale(1);
            opacity: ${auroraOpacity};
          }
          25% { 
            transform: translate(5%, 3%) scale(1.05);
            opacity: ${Math.min(1, auroraOpacity * 1.15)};
          }
          50% { 
            transform: translate(3%, -2%) scale(1.1);
            opacity: ${auroraOpacity * 0.92};
          }
          75% { 
            transform: translate(-3%, 2%) scale(1.02);
            opacity: ${Math.min(1, auroraOpacity * 1.08)};
          }
        }

        @keyframes nebulaDrift2 {
          0%, 100% { 
            transform: translate(0%, 0%) scale(1);
            opacity: ${Math.max(0.08, auroraOpacity * 0.55)};
          }
          33% { 
            transform: translate(-4%, 4%) scale(1.08);
            opacity: ${Math.max(0.08, auroraOpacity * 0.62)};
          }
          66% { 
            transform: translate(4%, -3%) scale(0.95);
            opacity: ${Math.max(0.06, auroraOpacity * 0.5)};
          }
        }

        @keyframes nebulaDrift3 {
          0%, 100% { 
            transform: translate(0%, 0%) scale(1);
            opacity: ${Math.max(0.06, auroraOpacity * 0.45)};
          }
          40% { 
            transform: translate(3%, -4%) scale(1.06);
            opacity: ${Math.max(0.06, auroraOpacity * 0.52)};
          }
          70% { 
            transform: translate(-2%, 3%) scale(0.98);
            opacity: ${Math.max(0.05, auroraOpacity * 0.4)};
          }
        }

        @keyframes coreGlow {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.15);
            opacity: 1;
          }
        }

        @keyframes auroraFlow {
          0% { background-position: 0% 100%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 100%; }
        }

        @keyframes auroraFlow2 {
          0% { background-position: 100% 100%; }
          50% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }

        @keyframes shootingStar {
          0% { 
            transform: translate(0, 0) rotate(35deg);
            opacity: 0;
          }
          5% { 
            opacity: 1;
          }
          30% { 
            opacity: 1;
          }
          100% { 
            transform: translate(400px, 250px) rotate(35deg);
            opacity: 0;
          }
        }

        @keyframes dustDrift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-20px, 20px); }
        }

        @keyframes spiralRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Performance: GPU acceleration */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* Mobile optimizations */
        @media (max-width: 768px) {
          [style*="blur"] {
            filter: blur(30px) !important;
          }
        }
      `}</style>
    </div>
  );
}
