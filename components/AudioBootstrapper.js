'use client';

import { useEffect } from 'react';
import { unlockAudio } from '@/lib/audioManager';

// Ensures audio is unlocked as early as possible on mobile.
// This component attaches ONE global listener and initializes the shared AudioContext
// on the first user interaction.
export default function AudioBootstrapper() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      // Must be triggered by user gesture.
      // Also pre-play the click immediately so the first interaction has sound too.
      unlockAudio().then(() => {
        // no-op; playback handled by GlobalClickSound on subsequent taps
      });
    };

    // Use capture so we run before other handlers, and once so it doesn't add overhead.
    window.addEventListener('pointerdown', unlock, { capture: true, once: true, passive: true });
    window.addEventListener('touchstart', unlock, { capture: true, once: true, passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('touchstart', unlock, { capture: true });
    };
  }, []);

  return null;
}
