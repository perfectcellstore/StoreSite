'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp } from 'lucide-react';

const categories = [
  {
    id: 'collectibles',
    name: 'Collectibles',
    nameAr: 'المقتنيات',
    image: 'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
  },
  {
    id: 'weapons',
    name: 'Weapon Replicas',
    nameAr: 'نسخ الأسلحة',
    image: 'https://images.pexels.com/photos/6091649/pexels-photo-6091649.jpeg',
  },
  {
    id: 'figures',
    name: 'Figures & Statues',
    nameAr: 'التماثيل',
    image: 'https://images.pexels.com/photos/1812237/pexels-photo-1812237.jpeg',
  },
  {
    id: 'masks',
    name: 'Masks',
    nameAr: 'الأقنعة',
    image: 'https://images.pexels.com/photos/4119179/pexels-photo-4119179.jpeg',
  },
];

export default function HomePage() {
  const { t, language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/8108531/pexels-photo-8108531.jpeg"
            alt="Hero Background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 z-0 bg-pattern"></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bio-green-500/10 border border-bio-green-500/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-bio-green-500" />
              <span className="text-sm text-bio-green-500 font-medium">Premium Collection</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text">{t('heroTitle')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl font-semibold text-foreground/90">
              {t('heroSubtitle')}
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fadeIn">
              {t('heroDescription')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fadeIn">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-bio-green-500 hover:bg-bio-green-600 text-white text-lg px-8 py-6 rounded-lg btn-glow animate-glow-pulse transform hover:scale-105 transition-transform"
                >
                  {t('shopNow')}
                  <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 rounded-lg border-bio-green-500/50 hover:bg-bio-green-500/10 hover:border-bio-green-500 transform hover:scale-105 transition-transform"
                >
                  {t('exploreCollections')}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-bio-green-500/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-bio-green-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-bio-green-500/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-bio-green-500" />
              </div>
              <h3 className="text-xl font-bold">Authentic Quality</h3>
              <p className="text-muted-foreground">
                Every item verified for authenticity and premium quality
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-bio-green-500/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-bio-green-500" />
              </div>
              <h3 className="text-xl font-bold">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Quick and secure delivery to your location
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-bio-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-bio-green-500" />
              </div>
              <h3 className="text-xl font-bold">Rare Finds</h3>
              <p className="text-muted-foreground">
                Exclusive and limited edition collectibles
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('categories')}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collections of rare and premium items
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.id}`}>
              <Card className="group relative overflow-hidden bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover cursor-pointer">
                <div className="aspect-square relative">
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
                  <h3 className="text-2xl font-bold text-white group-hover:text-bio-green-500 transition-colors">
                    {language === 'ar' ? category.nameAr : category.name}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/categories">
            <Button
              size="lg"
              variant="outline"
              className="border-bio-green-500/50 hover:bg-bio-green-500/10 hover:border-bio-green-500"
            >
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="relative overflow-hidden bg-gradient-to-r from-bio-green-500/10 to-bio-green-600/10 border-bio-green-500/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Evolve Your Collection?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of collectors who trust Perfect Sell for authentic, rare, and premium items
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-bio-green-500 hover:bg-bio-green-600 text-white text-lg px-8 py-6 rounded-lg btn-glow"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
