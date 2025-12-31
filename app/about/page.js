'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          <span className="gradient-text">About Perfect Sell</span>
        </h1>

        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-bio-green-500">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Perfect Sell was born from a passion for rare and authentic collectibles. Inspired by the concept of evolution and perfection, we curate a unique collection of items that spans history, fiction, and reality.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From historical artifacts to premium cosplay gear, weapon replicas to limited edition figures, we bring you the finest collectibles from around the world.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-bio-green-500">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To provide collectors, enthusiasts, and fans with access to premium, authentic, and rare items that help them express their passion and evolve their collections.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold text-bio-green-500">Why Choose Us</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-bio-green-500 font-bold">•</span>
                  <span>Authentic and verified products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bio-green-500 font-bold">•</span>
                  <span>Curated selection of rare items</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bio-green-500 font-bold">•</span>
                  <span>Fast and secure delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bio-green-500 font-bold">•</span>
                  <span>Excellent customer service</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-bio-green-500 font-bold">•</span>
                  <span>Cash on delivery available</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
