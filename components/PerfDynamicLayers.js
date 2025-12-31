'use client';

import dynamic from 'next/dynamic';

// Heavy global FX are loaded lazily to improve TTI on mobile.
// - AnimatedBackground: canvas/particle layers
// - GlobalClickEffects: document-level listener + DOM burst creation

const AnimatedBackground = dynamic(
  () => import('@/components/AnimatedBackground').then((m) => m.AnimatedBackground),
  { ssr: false }
);

const GlobalClickEffects = dynamic(
  () => import('@/components/GlobalClickEffects').then((m) => m.GlobalClickEffects),
  { ssr: false }
);

export default function PerfDynamicLayers() {
  return (
    <>
      <AnimatedBackground />
      <GlobalClickEffects />
    </>
  );
}
