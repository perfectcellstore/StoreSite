'use client';

import { useEffect } from 'react';
import { useEffects } from '@/lib/contexts/EffectsContext';

export function LowPowerModeWrapper() {
  const { lowPowerMode } = useEffects();

  useEffect(() => {
    if (lowPowerMode) {
      document.body.classList.add('low-power-mode');
    } else {
      document.body.classList.remove('low-power-mode');
    }
  }, [lowPowerMode]);

  return null;
}
