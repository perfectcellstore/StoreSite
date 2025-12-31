'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Performance tiers:
// - high: desktop / strong devices (full FX)
// - mid: typical phones/tablets (reduced FX)
// - low: low-end phones (minimal heavy FX; keep core UX + click sounds)

const PerfContext = createContext(null);

function detectPerfTier() {
  if (typeof window === 'undefined') return 'high';

  const w = window.innerWidth || 1024;
  const cores = navigator?.hardwareConcurrency || 4;
  const mem = navigator?.deviceMemory || 4;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  // Prefer reduced motion users: treat as low for effects.
  if (reducedMotion) return 'low';

  // Heuristics tuned for weak mobile devices.
  // - Very small screens + low cores/memory => low
  // - Regular phones => mid
  if (w < 420 && (cores <= 4 || mem <= 4)) return 'low';
  if (w < 768) return 'mid';
  if (cores <= 4 && mem <= 4) return 'mid';
  return 'high';
}

export function PerfProvider({ children }) {
  // Initialize from the client environment when available.
  const [tier, setTier] = useState(() => (typeof window === 'undefined' ? 'high' : detectPerfTier()));

  useEffect(() => {
    const onResize = () => {
      // Debounce via rAF
      requestAnimationFrame(() => setTier(detectPerfTier()));
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const value = useMemo(() => {
    const isLow = tier === 'low';
    const isMid = tier === 'mid';

    return {
      tier,
      isLow,
      isMid,
      isHigh: tier === 'high',

      // Feature gates (core features stay on; FX scale down)
      fx: {
        // Background extras
        allowBackgroundRibbons: !isLow,
        allowShootingStars: !isLow,

        // Click visuals
        allowClickBurst: !isLow,
        // Audio stays on in all tiers by requirement
        allowClickSound: true,

        // Celebration FX (order success)
        celebrationParticles: isLow ? 'low' : isMid ? 'mid' : 'high',
      },
    };
  }, [tier]);

  return <PerfContext.Provider value={value}>{children}</PerfContext.Provider>;
}

export function usePerf() {
  const ctx = useContext(PerfContext);
  if (!ctx) throw new Error('usePerf must be used within PerfProvider');
  return ctx;
}
