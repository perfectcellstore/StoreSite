'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    id: 'collectibles',
    name: 'Collectibles',
    nameAr: 'المقتنيات',
    description: 'Rare and valuable collectible items',
    descriptionAr: 'قطع مقتنيات نادرة وقيمة',
    image: 'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
  },
  {
    id: 'historical',
    name: 'Historical Items',
    nameAr: 'القطع التاريخية',
    description: 'Authentic historical artifacts and replicas',
    descriptionAr: 'القطع الأثرية التاريخية ونسخها',
    image: 'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg',
  },
  {
    id: 'cosplay',
    name: 'Cosplay & Gear',
    nameAr: 'الأزياء والمعدات',
    description: 'Professional cosplay costumes and accessories',
    descriptionAr: 'أزياء ومعدات تنكرية احترافية',
    image: 'https://images.pexels.com/photos/1480690/pexels-photo-1480690.jpeg',
  },
  {
    id: 'weapons',
    name: 'Weapon Replicas',
    nameAr: 'نسخ الأسلحة',
    description: 'High-quality weapon replicas and props',
    descriptionAr: 'نسخ أسلحة عالية الجودة',
    image: 'https://images.pexels.com/photos/6091649/pexels-photo-6091649.jpeg',
  },
  {
    id: 'figures',
    name: 'Figures & Statues',
    nameAr: 'التماثيل والمجسمات',
    description: 'Premium figures and statues',
    descriptionAr: 'تماثيل ومجسمات ممتازة',
    image: 'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
  },
  {
    id: 'masks',
    name: 'Masks',
    nameAr: 'الأقنعة',
    description: 'Detailed masks and face props',
    descriptionAr: 'أقنعة مفصلة',
    image: 'https://images.pexels.com/photos/4119179/pexels-photo-4119179.jpeg',
  },
  {
    id: 'toys',
    name: 'Toys',
    nameAr: 'الألعاب',
    description: 'Collectible toys and action figures',
    descriptionAr: 'ألعاب ومجسمات قابلة للتحريك',
    image: 'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
  },
  {
    id: 'rare',
    name: 'Rare Items',
    nameAr: 'القطع النادرة',
    description: 'Limited edition and rare collectibles',
    descriptionAr: 'قطع محدودة الإصدار ونادرة',
    image: 'https://images.pexels.com/photos/998641/pexels-photo-998641.jpeg',
  },
];

export default function CategoriesPage() {
  const { t, language } = useLanguage();

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
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.id}`}>
              <Card className="group relative overflow-hidden bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover cursor-pointer">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={category.image}
                    alt={language === 'ar' ? category.nameAr : category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-bio-green-500/0 group-hover:bg-bio-green-500/10 transition-colors"></div>
                </div>
                <CardContent className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-bio-green-500 transition-colors mb-2">
                    {language === 'ar' ? category.nameAr : category.name}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {language === 'ar' ? category.descriptionAr : category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
