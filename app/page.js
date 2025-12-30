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
        {/* Kamehameha Energy Waves Background - ANIMATED */}
        <div className="absolute inset-0 z-0">
          {/* Base Dark Background */}
          <div className="absolute inset-0 bg-black"></div>
          
          {/* Energy Wave Layer 1 - Main Kamehameha Beam */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(16, 185, 129, 0.6) 0%, rgba(59, 130, 246, 0.4) 30%, transparent 60%)',
              animation: 'kamehamehaWave1 8s ease-in-out infinite',
              filter: 'blur(60px)',
            }}
          />
          
          {/* Energy Wave Layer 2 - Secondary Pulse */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 60% at 40% 50%, rgba(16, 185, 129, 0.5) 0%, rgba(6, 182, 212, 0.3) 40%, transparent 70%)',
              animation: 'kamehamehaWave2 6s ease-in-out infinite',
              animationDelay: '1s',
              filter: 'blur(50px)',
            }}
          />
          
          {/* Energy Wave Layer 3 - Outer Aura */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.4) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 80%)',
              animation: 'kamehamehaWave3 10s ease-in-out infinite',
              animationDelay: '2s',
              filter: 'blur(80px)',
            }}
          />
          
          {/* Flowing Energy Streaks */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 0%, rgba(16, 185, 129, 0.3) 30%, rgba(59, 130, 246, 0.3) 60%, transparent 100%)',
              animation: 'energyFlow1 15s linear infinite',
              filter: 'blur(40px)',
            }}
          />
          
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(-45deg, transparent 0%, rgba(6, 182, 212, 0.25) 40%, rgba(16, 185, 129, 0.25) 70%, transparent 100%)',
              animation: 'energyFlow2 12s linear infinite',
              animationDelay: '3s',
              filter: 'blur(40px)',
            }}
          />
          
          {/* Central Energy Core */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(16, 185, 129, 0.7) 0%, rgba(59, 130, 246, 0.5) 30%, transparent 60%)',
              animation: 'energyCorePulse 5s ease-in-out infinite',
              filter: 'blur(100px)',
            }}
          />
          
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background"></div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes kamehamehaWave1 {
            0%, 100% { 
              transform: scale(1) translate(0, 0);
              opacity: 0.6;
            }
            50% { 
              transform: scale(1.4) translate(5%, 0);
              opacity: 0.9;
            }
          }
          
          @keyframes kamehamehaWave2 {
            0%, 100% { 
              transform: scale(1.2) translate(0, 0);
              opacity: 0.5;
            }
            50% { 
              transform: scale(1.6) translate(-5%, 0);
              opacity: 0.8;
            }
          }
          
          @keyframes kamehamehaWave3 {
            0%, 100% { 
              transform: scale(1) rotate(0deg);
              opacity: 0.4;
            }
            50% { 
              transform: scale(1.3) rotate(10deg);
              opacity: 0.7;
            }
          }
          
          @keyframes energyFlow1 {
            0% { 
              transform: translateX(-100%) rotate(45deg); 
            }
            100% { 
              transform: translateX(100%) rotate(45deg); 
            }
          }
          
          @keyframes energyFlow2 {
            0% { 
              transform: translateX(100%) rotate(-45deg); 
            }
            100% { 
              transform: translateX(-100%) rotate(-45deg); 
            }
          }
          
          @keyframes energyCorePulse {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.7;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 1;
            }
          }
        `}</style>

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

        {/* Animated Scroll Indicator - Properly Centered on All Devices */}
        <div 
          className="absolute bottom-8 z-10"
          style={{
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-bio-green-500/50 rounded-full flex justify-center items-start pt-2">
              <div className="w-1 h-3 bg-bio-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover">
            <CardContent className={`p-6 text-center space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className={`w-16 h-16 ${language === 'ar' ? 'mr-auto' : 'mx-auto'} rounded-full bg-bio-green-500/10 flex items-center justify-center`}>
                <Shield className="h-8 w-8 text-bio-green-500" />
              </div>
              <h3 className="text-xl font-bold">{t('authenticQuality')}</h3>
              <p className="text-muted-foreground">
                {t('authenticQualityDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover">
            <CardContent className={`p-6 text-center space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className={`w-16 h-16 ${language === 'ar' ? 'mr-auto' : 'mx-auto'} rounded-full bg-bio-green-500/10 flex items-center justify-center`}>
                <Zap className="h-8 w-8 text-bio-green-500" />
              </div>
              <h3 className="text-xl font-bold">{t('fastDelivery')}</h3>
              <p className="text-muted-foreground">
                {t('fastDeliveryDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40 hover:border-bio-green-500/50 transition-all card-hover">
            <CardContent className={`p-6 text-center space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className={`w-16 h-16 ${language === 'ar' ? 'mr-auto' : 'mx-auto'} rounded-full bg-bio-green-500/10 flex items-center justify-center`}>
                <TrendingUp className="h-8 w-8 text-bio-green-500" />
              </div>
              <h3 className="text-xl font-bold">{t('rareFinds')}</h3>
              <p className="text-muted-foreground">
                {t('rareFindsDesc')}
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
            {t('exploreCuratedCollections')}
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
              {t('viewAllCategories')}
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
              {t('readyToEvolve')}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('joinThousands')}
            </p>
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-bio-green-500 hover:bg-bio-green-600 text-white text-lg px-8 py-6 rounded-lg btn-glow"
              >
                {t('startShopping')}
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
