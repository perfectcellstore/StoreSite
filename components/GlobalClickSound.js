'use client';

import { useEffect } from 'react';
import { playClick } from '@/lib/audioManager';

// Ultra-light global click sound listener.
// Kept separate from heavy visual click effects so sound is available immediately
// (even if visual effects are lazy-loaded for performance).
export function GlobalClickSound() {
  useEffect(() => {
    let last = 0;

    const onTap = () => {
      // Prevent double-fire on browsers that emit both touchstart + pointerdown.
      const now = Date.now();
      if (now - last < 40) return;
      last = now;

      // Synchronous playback (WebAudio buffer source). No async work here.
      playClick();
    };

    // Earliest possible events on mobile.
    document.addEventListener('touchstart', onTap, { passive: true, capture: true });
    document.addEventListener('pointerdown', onTap, { passive: true, capture: true });

    return () => {
      document.removeEventListener('touchstart', onTap, { capture: true });
      document.removeEventListener('pointerdown', onTap, { capture: true });
    };
  }, []);

  return null;
}
