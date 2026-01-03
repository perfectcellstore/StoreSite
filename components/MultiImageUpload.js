'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Plus, ImageOff, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * MultiImageUpload Component
 * 
 * Allows uploading multiple images for a product with:
 * - Drag and drop reordering (TODO)
 * - Image preview
 * - Remove individual images
 * - Max 5 images
 */

const MAX_IMAGES = 20;

export function MultiImageUpload({ value = [], onChange, mainImage }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Combine main image with additional images for display
  const allImages = mainImage ? [mainImage, ...value.filter(img => img !== mainImage)] : value;
  const canAddMore = allImages.length < MAX_IMAGES;

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check how many more we can add
    const slotsAvailable = MAX_IMAGES - allImages.length;
    if (slotsAvailable <= 0) {
      setError(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const filesToUpload = files.slice(0, slotsAvailable);
    setUploading(true);
    setError(null);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validate file
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Image must be less than 5MB');
        }

        // Convert to base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Upload to server
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 })
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();
        return data.url;
      });

      const newUrls = await Promise.all(uploadPromises);
      
      // Add new URLs to the images array
      const updatedImages = [...value, ...newUrls];
      onChange(updatedImages);

    } catch (err) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    // If removing from allImages, we need to figure out if it's the main image or additional
    const imageToRemove = allImages[indexToRemove];
    
    if (imageToRemove === mainImage) {
      // Can't remove main image from here - that's handled by the main ImageUpload
      return;
    }
    
    // Remove from the value array
    const newImages = value.filter(img => img !== imageToRemove);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      {/* Image Grid */}
      <div className="grid grid-cols-5 gap-2">
        {/* Main Image (if exists) - shown first but not editable here */}
        {mainImage && (
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-bio-green-500 bg-gray-800">
            <Image
              src={mainImage}
              alt="Main product image"
              fill
              className="object-cover"
            />
            <div className="absolute top-1 left-1 bg-bio-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
              Main
            </div>
          </div>
        )}

        {/* Additional Images */}
        {value.filter(img => img !== mainImage).map((img, idx) => (
          <div 
            key={idx} 
            className="relative aspect-square rounded-lg overflow-hidden border border-border bg-gray-800 group"
          >
            <Image
              src={img}
              alt={`Product image ${idx + 2}`}
              fill
              className="object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemoveImage(mainImage ? idx + 1 : idx)}
              className="absolute top-1 right-1 p-1 bg-destructive/90 hover:bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
              {mainImage ? idx + 2 : idx + 1}
            </div>
          </div>
        ))}

        {/* Add More Button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-bio-green-500 bg-gray-800/50 hover:bg-gray-800 flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-bio-green-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">Add</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        {allImages.length}/{MAX_IMAGES} images • Click + to add more images
      </p>
    </div>
  );
}

export default MultiImageUpload;
