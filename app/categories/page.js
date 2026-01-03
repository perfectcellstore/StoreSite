'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { CollectionCard } from '@/components/CollectionCard';

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [collections, setCollections] = useState([]);
  
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections');
        const data = await response.json();
        if (data.collections) {
          setCollections(data.collections);
        }
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };
    
    fetchCollections();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('categories')}</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse our collection by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.length > 0 ? (
            collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-12">
              Loading collections...
            </div>
          )}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
