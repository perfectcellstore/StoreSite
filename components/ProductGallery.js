'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn } from 'lucide-react';
import { Card } from '@/components/ui/card';

/**
 * ProductGallery Component
 * 
 * A full-featured product gallery for product detail pages with:
 * - Large main image with zoom capability
 * - Thumbnail navigation
 * - Swipe/touch support for mobile
 * - Safari/Chrome/Mobile compatible
 * - Smooth transitions
 * - Image error handling
 */

const FALLBACK_IMAGE = '/placeholder-product.svg';

// ImageWithFallback for broken images
function ImageWithFallback({ src, alt, className, fill, priority, sizes, onClick }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    console.warn(`[ProductGallery] Image failed to load: ${src}`);
    setHasError(true);
    setImgSrc(FALLBACK_IMAGE);
  };

  if (!src || src === '' || hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-800/50 cursor-pointer ${className}`}
        onClick={onClick}
      >
        <ImageOff className="w-24 h-24 text-gray-600" />
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || 'Product image'}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={handleError}
      onClick={onClick}
    />
  );
}

export function ProductGallery({ images, productName }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Filter valid images
  const validImages = (images || []).filter(img => img && img !== '');
  const imageList = validImages.length > 0 ? validImages : [FALLBACK_IMAGE];
  const hasMultipleImages = imageList.length > 1;

  // Navigation
  const goToImage = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % imageList.length);
  }, [imageList.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  }, [imageList.length]);

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'Escape') setIsZoomed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden bg-card/50 border-border/40 group">
        <div 
          className="aspect-square relative cursor-zoom-in"
          onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
          onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
          onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
        >
          <ImageWithFallback
            src={imageList[selectedIndex]}
            alt={productName}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-300"
            onClick={() => setIsZoomed(true)}
          />

          {/* Navigation Arrows */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Zoom indicator */}
          <div className="absolute bottom-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-5 h-5" />
          </div>

          {/* Image counter */}
          {hasMultipleImages && (
            <div className="absolute bottom-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
              {selectedIndex + 1} / {imageList.length}
            </div>
          )}
        </div>
      </Card>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-bio-green-500 scrollbar-track-gray-800">
          {imageList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => goToImage(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
                selectedIndex === idx
                  ? 'ring-2 ring-bio-green-500 ring-offset-2 ring-offset-background'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <div className="relative w-full h-full max-w-4xl max-h-[90vh] m-4">
            <ImageWithFallback
              src={imageList[selectedIndex]}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Dot indicators in zoom mode */}
          {hasMultipleImages && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {imageList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goToImage(idx); }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === selectedIndex ? 'bg-bio-green-500 w-6' : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
