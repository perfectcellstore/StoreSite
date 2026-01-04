'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { ImageOff } from 'lucide-react';

/**
 * CollectionCard Component
 * 
 * A card for displaying collection/category with:
 * - Square 1:1 image with gradient overlay
 * - Proper image error handling
 * - Icon, name, and description
 * - Hover effects
 */

const FALLBACK_IMAGE = '/placeholders/product-default.svg';

function ImageWithFallback({ src, alt, className, fill }) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    console.warn(`[CollectionCard] Image failed to load: ${src}`);
    setHasError(true);
  };

  if (!src || src === '' || hasError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}>
        <ImageOff className="w-16 h-16 text-gray-600" />
      </div>
    );
  }

  return (
    <Image
      key={src} // Reset component when src changes
      src={src}
      alt={alt || 'Collection image'}
      fill={fill}
      className={className}
      onError={handleError}
    />
  );
}

export function CollectionCard({ collection }) {
  const { language } = useLanguage();
  
  const name = language === 'ar' && collection.nameAr ? collection.nameAr : collection.name;
  const description = language === 'ar' && collection.descriptionAr ? collection.descriptionAr : collection.description;

  return (
    <Link href={`/shop?category=${collection.name}`}>
      <Card className="group relative overflow-hidden bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover cursor-pointer">
        <div className="aspect-square relative">
          <ImageWithFallback
            src={collection.image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          {/* Hover tint */}
          <div className="absolute inset-0 bg-bio-green-500/0 group-hover:bg-bio-green-500/10 transition-colors"></div>
        </div>
        <CardContent className="absolute bottom-0 left-0 right-0 p-6">
          {collection.icon && (
            <div className="text-4xl mb-2">{collection.icon}</div>
          )}
          <h3 className="text-2xl font-bold text-white group-hover:text-bio-green-500 transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default CollectionCard;
