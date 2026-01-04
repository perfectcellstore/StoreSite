'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { useCart } from '@/lib/contexts/CartContext';

/**
 * ProductCard Component
 * 
 * A production-ready product card with:
 * - Multi-image gallery with swipe/scroll support
 * - Square 1:1 aspect ratio images
 * - Image error handling with fallback
 * - Safari/Chrome/Mobile compatible
 * - Smooth transitions and indicators
 * - Lazy loading for performance
 */

// Default placeholder for broken images
const FALLBACK_IMAGE = '/placeholders/product-default.svg';

// ImageWithFallback: Handles broken images gracefully
function ImageWithFallback({ src, alt, className, fill, priority, sizes, onLoad }) {
  const [hasError, setHasError] = useState(false);
  
  // Use src as key to reset state when image changes
  const imgSrc = hasError ? FALLBACK_IMAGE : src;

  const handleError = () => {
    console.warn(`[ProductCard] Image failed to load: ${src}`);
    setHasError(true);
  };

  // If image is empty or undefined, show fallback immediately
  if (!src || src === '') {
    return (
      <div className={`flex items-center justify-center bg-gray-800/50 ${className}`}>
        <ImageOff className="w-16 h-16 text-gray-600" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-800/50 ${className}`}>
        <ImageOff className="w-16 h-16 text-gray-600" />
      </div>
    );
  }

  return (
    <Image
      key={src} // Reset component when src changes
      src={imgSrc}
      alt={alt || 'Product image'}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={handleError}
      onLoad={onLoad}
    />
  );
}

// ImageGallery: Swipeable multi-image gallery
function ImageGallery({ images, productName, priority = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Filter out empty/invalid images
  const validImages = (images || []).filter(img => img && img !== '');
  const imageList = validImages.length > 0 ? validImages : [FALLBACK_IMAGE];
  const hasMultipleImages = imageList.length > 1;

  // Navigate to next/prev image
  const goToImage = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning]);

  const nextImage = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    goToImage((currentIndex + 1) % imageList.length);
  }, [currentIndex, imageList.length, goToImage]);

  const prevImage = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    goToImage((currentIndex - 1 + imageList.length) % imageList.length);
  }, [currentIndex, imageList.length, goToImage]);

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        nextImage(e);
      } else {
        // Swipe right - prev image
        prevImage(e);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square overflow-hidden bg-gray-900/50"
      onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
      onTouchMove={hasMultipleImages ? handleTouchMove : undefined}
      onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
    >
      {/* Main Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={imageList[currentIndex]}
          alt={productName}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {/* Navigation Arrows - Only show if multiple images */}
      {hasMultipleImages && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot Indicators - Only show if multiple images */}
      {hasMultipleImages && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
          {imageList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToImage(idx);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                idx === currentIndex 
                  ? 'bg-bio-green-500 w-4' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * ProductCard Component
 * 
 * Props:
 * - product: Product object with id, name, nameAr, price, image, images, stock, etc.
 * - priority: Whether to prioritize image loading (for above-the-fold products)
 */
export function ProductCard({ product, priority = false }) {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  // Get product name based on language
  const productName = language === 'ar' && product.nameAr ? product.nameAr : product.name;
  
  // Get images array (fallback to single image if images array doesn't exist)
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Card className="group bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover overflow-hidden">
      <Link href={`/product/${product.id}`}>
        {/* Image Gallery Container - Square 1:1 aspect ratio */}
        <div className="relative">
          <ImageGallery 
            images={productImages} 
            productName={productName}
            priority={priority}
          />
          
          {/* Coming Soon Badge - Top Left (priority over discount) */}
          {product.comingSoon ? (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg">
                🚀 Coming Soon
              </div>
            </div>
          ) : (
            /* Discount Badge - Top Left */
            product.onSale && product.discountPercentage > 0 && (
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                <div className="bg-destructive text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg animate-pulse">
                  {product.discountPercentage}% OFF
                </div>
                {product.dealLabel && (
                  <div className="bg-bio-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-lg">
                    {product.dealLabel}
                  </div>
                )}
              </div>
            )
          )}
          
          {/* Stock Badge - Top Right (Only for low stock, not for coming soon) */}
          {!product.comingSoon && product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded shadow-lg">
              Only {product.stock} left
            </div>
          )}
          
          {/* Out of Stock Badge (not for coming soon) */}
          {!product.comingSoon && product.stock === 0 && (
            <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-destructive text-white text-xs font-medium rounded shadow-lg">
              {t('outOfStock')}
            </div>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <CardContent className="p-4 space-y-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg group-hover:text-bio-green-500 transition-colors line-clamp-2">
            {productName}
          </h3>
        </Link>
        
        {/* Price section - different for Coming Soon */}
        {product.comingSoon ? (
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-amber-500">
              Price TBD
            </p>
          </div>
        ) : (
          <>
            {/* Price with discount */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.onSale && product.originalPrice ? (
                <>
                  <p className="text-2xl font-bold text-bio-green-500">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-bio-green-500">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>
            
            {/* Savings */}
            {product.onSale && product.originalPrice && (
              <p className="text-xs text-destructive font-semibold">
                Save {formatPrice(product.originalPrice - product.price)}!
              </p>
            )}
          </>
        )}
        
        {/* Add to Cart Button or Notify Button for Coming Soon */}
        {product.comingSoon ? (
          <Button
            disabled
            className="w-full bg-amber-500/20 text-amber-500 border border-amber-500/50 cursor-not-allowed"
          >
            🔔 Coming Soon
          </Button>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white btn-glow"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {t('addToCart')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ProductCard;
