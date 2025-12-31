'use client';

import { useEffect } from 'react';
import { playClick } from '@/lib/audioManager';

// Ultra-light global click sound listener.
// Kept separate from heavy visual click effects so sound is available immediately
// (even if visual effects are lazy-loaded for performance).
export function GlobalClickSound() {
  useEffect(() => {
    const onPointerDown = () => {
      // Synchronous playback (WebAudio buffer source). No async work here.
      playClick();
    };

    // Capture so it runs before navigation handlers.
    document.addEventListener('pointerdown', onPointerDown, { passive: true, capture: true });
    return () => document.removeEventListener('pointerdown', onPointerDown, { capture: true });
  }, []);

  return null;
}
