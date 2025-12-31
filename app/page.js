'use client';

/* eslint-disable react/no-unknown-property */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { usePerf } from '@/lib/contexts/PerfContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/FooterSSR';
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
  const perf = usePerf();
  const isLow = perf?.tier === 'low';
  // NOTE: Avoid mount-gating the entire page; it causes extra renders and hurts performance.
  // This page only uses client-side hooks that are safe to render directly.


  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Kamehameha Energy Blast Background - CONCENTRATED BEAM */}
        {/* This layer is masked to fade out at the bottom, revealing the continuous global galaxy background (no seam). */}
        <div className="absolute inset-0 z-0 pointer-events-none mask-fade-bottom">
          {/* Base Dark Overlay (transparent enough to keep stars/galaxy visible) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-transparent"></div>

          {/* Main Beam */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
            style={{
              height: isLow ? '84px' : '128px',
              background: 'linear-gradient(to right, rgba(16, 185, 129, 0) 0%, rgba(16, 185, 129, 0.9) 20%, rgba(16, 185, 129, 0.9) 80%, rgba(16, 185, 129, 0) 100%)',
              boxShadow: isLow
                ? '0 0 40px 18px rgba(16, 185, 129, 0.45), 0 0 70px 28px rgba(16, 185, 129, 0.25)'
                : '0 0 80px 40px rgba(16, 185, 129, 0.6), 0 0 120px 60px rgba(16, 185, 129, 0.4)',
              animation: 'beamPulse 3s ease-in-out infinite',
              filter: isLow ? 'blur(10px)' : 'blur(20px)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Secondary Beam Core */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
            style={{
              height: isLow ? '42px' : '64px',
              background: 'linear-gradient(to right, rgba(59, 130, 246, 0) 0%, rgba(59, 130, 246, 1) 25%, rgba(16, 185, 129, 1) 50%, rgba(59, 130, 246, 1) 75%, rgba(59, 130, 246, 0) 100%)',
              boxShadow: isLow ? '0 0 28px 14px rgba(59, 130, 246, 0.55)' : '0 0 60px 30px rgba(59, 130, 246, 0.8)',
              animation: 'beamPulse 2s ease-in-out infinite',
              animationDelay: '0.5s',
              filter: isLow ? 'blur(6px)' : 'blur(10px)',
              willChange: 'transform, opacity',
            }}
          />

          {/* Bright inner core */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
            style={{
              height: isLow ? '12px' : '24px',
              background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 30%, rgba(255, 255, 255, 0.9) 70%, rgba(255, 255, 255, 0) 100%)',
              boxShadow: isLow
                ? '0 0 18px 10px rgba(255, 255, 255, 0.7), 0 0 38px 18px rgba(16, 185, 129, 0.4)'
                : '0 0 40px 20px rgba(255, 255, 255, 0.9), 0 0 80px 40px rgba(16, 185, 129, 0.6)',
              animation: 'beamIntensity 1.5s ease-in-out infinite',
              willChange: 'transform, opacity',
            }}
          />

          {/* Optional heavy layers (disabled on low-end devices) */}
          {!isLow && (
            <>
              {/* Energy Particles Along Beam */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-40"
                style={{
                  background: 'repeating-linear-gradient(90deg, transparent 0px, rgba(16, 185, 129, 0.3) 50px, transparent 100px)',
                  animation: 'particleFlow 2s linear infinite',
                  filter: 'blur(5px)',
                  willChange: 'transform',
                }}
              />

              {/* Blast Origin Glow - Left Side */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{
                  width: '300px',
                  height: '300px',
                  background: 'radial-gradient(circle, rgba(16, 185, 129, 1) 0%, rgba(59, 130, 246, 0.8) 30%, rgba(16, 185, 129, 0.4) 50%, transparent 70%)',
                  boxShadow: '0 0 150px 80px rgba(16, 185, 129, 0.8)',
                  animation: 'originPulse 2s ease-in-out infinite',
                  filter: 'blur(40px)',
                  willChange: 'transform, opacity',
                }}
              />

              {/* Energy Waves */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: '100%',
                  height: '400px',
                  background: 'radial-gradient(ellipse 100% 40% at 50% 50%, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.2) 40%, transparent 70%)',
                  animation: 'waveExpand 4s ease-out infinite',
                  filter: 'blur(60px)',
                  willChange: 'transform, opacity',
                }}
              />

              {/* Diagonal Energy Streaks */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(45deg, transparent 0%, rgba(16, 185, 129, 0.15) 48%, rgba(255, 255, 255, 0.3) 50%, rgba(16, 185, 129, 0.15) 52%, transparent 100%)',
                  animation: 'streakFlow 8s linear infinite',
                  filter: 'blur(15px)',
                  willChange: 'transform',
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(-45deg, transparent 0%, rgba(59, 130, 246, 0.15) 48%, rgba(255, 255, 255, 0.2) 50%, rgba(59, 130, 246, 0.15) 52%, transparent 100%)',
                  animation: 'streakFlow 6s linear infinite',
                  animationDelay: '2s',
                  filter: 'blur(15px)',
                  willChange: 'transform',
                }}
              />
            </>
          )}

          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70"></div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes beamPulse {
            0%, 100% { 
              opacity: 0.7;
              transform: translateY(-50%) scaleY(1);
            }
            50% { 
              opacity: 1;
              transform: translateY(-50%) scaleY(1.2);
            }
          }
          
          @keyframes beamIntensity {
            0%, 100% { 
              opacity: 0.8;
              filter: blur(0px);
            }
            50% { 
              opacity: 1;
              filter: blur(2px);
            }
          }
          
          @keyframes particleFlow {
            0% { 
              transform: translateX(0) translateY(-50%);
            }
            100% { 
              transform: translateX(-100px) translateY(-50%);
            }
          }
          
          @keyframes originPulse {
            0%, 100% { 
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.8;
            }
            50% { 
              transform: translate(-50%, -50%) scale(1.3);
              opacity: 1;
            }
          }
          
          @keyframes waveExpand {
            0% { 
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0;
            }
            50% { 
              opacity: 0.6;
            }
            100% { 
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }
          
          @keyframes streakFlow {
            0% { 
              transform: translateX(-100%);
            }
            100% { 
              transform: translateX(100%);
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
