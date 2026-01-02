'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';

export default function CategoriesPage() {
  const { t, language } = useLanguage();
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
              <Link key={collection.id} href={`/shop?category=${collection.name}`}>
                <Card className="group relative overflow-hidden bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover cursor-pointer">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={collection.image}
                      alt={language === 'ar' ? collection.nameAr : collection.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-bio-green-500/0 group-hover:bg-bio-green-500/10 transition-colors"></div>
                  </div>
                  <CardContent className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="text-4xl mb-2">{collection.icon}</div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-bio-green-500 transition-colors mb-2">
                      {language === 'ar' ? collection.nameAr : collection.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {language === 'ar' ? collection.descriptionAr : collection.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
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
