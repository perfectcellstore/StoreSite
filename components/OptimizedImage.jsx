'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';

// A safe image wrapper for performance:
// - Uses next/image (AVIF/WebP + responsive sizing) for known allowed remote hosts + local images.
// - Falls back to <img loading="lazy"> for unknown remote hosts to avoid Next.js hostname restrictions.
// This prevents runtime crashes when admins paste arbitrary image URLs.

const ALLOWED_REMOTE_HOSTS = new Set([
  'images.pexels.com',
]);

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  priority,
  quality,
  style,
  onClick,
}) {
  const mode = useMemo(() => {
    if (!src || typeof src !== 'string') return 'img';

    // local paths like /something.png are safe for next/image
    if (src.startsWith('/')) return 'next';

    try {
      const u = new URL(src);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return 'img';
      return ALLOWED_REMOTE_HOSTS.has(u.hostname) ? 'next' : 'img';
    } catch {
      return 'img';
    }
  }, [src]);

  if (mode === 'next') {
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={!!fill}
        sizes={sizes}
        className={className}
        priority={priority}
        quality={quality}
        style={style}
        onClick={onClick}
      />
    );
  }

  // Fallback: still performant (lazy + async decode), but no Next optimization for unknown hosts.
  // Keep width/height when provided to avoid layout shift.
  return (
    <img
      src={src}
      alt={alt || ''}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      style={style}
      onClick={onClick}
    />
  );
}
