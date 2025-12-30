'use client';

import React from 'react';

export function PerfectCellLogo() {
  return (
    <div className="relative w-10 h-10 pixel-art animate-float">
      <svg
        viewBox="0 0 32 32"
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Perfect Cell inspired pixel art */}
        {/* Head outline - green */}
        <rect x="10" y="4" width="12" height="2" fill="#22c55e" />
        <rect x="8" y="6" width="16" height="2" fill="#22c55e" />
        <rect x="6" y="8" width="20" height="12" fill="#22c55e" />
        <rect x="8" y="20" width="16" height="2" fill="#22c55e" />
        <rect x="10" y="22" width="12" height="2" fill="#22c55e" />
        
        {/* Face - darker green */}
        <rect x="8" y="8" width="16" height="10" fill="#15803d" />
        
        {/* Eyes - glowing green */}
        <rect x="11" y="11" width="3" height="3" fill="#4ade80" className="animate-pulse" />
        <rect x="18" y="11" width="3" height="3" fill="#4ade80" className="animate-pulse" />
        
        {/* Mouth/expression - bright green */}
        <rect x="13" y="16" width="6" height="1" fill="#86efac" />
        
        {/* Spots/details - yellow-green */}
        <rect x="10" y="9" width="1" height="1" fill="#a3e635" />
        <rect x="21" y="9" width="1" height="1" fill="#a3e635" />
        <rect x="9" y="13" width="1" height="1" fill="#a3e635" />
        <rect x="22" y="13" width="1" height="1" fill="#a3e635" />
        
        {/* Antennae */}
        <rect x="12" y="2" width="2" height="2" fill="#22c55e" />
        <rect x="18" y="2" width="2" height="2" fill="#22c55e" />
        <rect x="13" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
        <rect x="19" y="0" width="1" height="2" fill="#4ade80" className="animate-pulse" />
      </svg>
    </div>
  );
}
