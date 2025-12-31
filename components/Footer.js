'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-border/40 bg-card/50 mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold gradient-text">Perfect Sell</div>
            <p className="text-sm text-muted-foreground">
              {t('heroDescription')}
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/perfectsell_store"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bio-green-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/9647733797713"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-bio-green-500 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-bio-green-500">{t('shop')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
                  {t('categories')}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
                  {t('cart')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4 text-bio-green-500">{t('aboutUs')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-bio-green-500">{t('newsletter')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('subscribeNewsletter')}</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t('email')}
                className="bg-background border-border focus:border-bio-green-500"
              />
              <Button className="bg-bio-green-500 hover:bg-bio-green-600 text-white btn-glow">
                {t('subscribe')}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {year ?? 2025} Perfect Sell. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/policies" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
              {t('privacyPolicy')}
            </Link>
            <Link href="/policies" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
              {t('termsOfService')}
            </Link>
            <Link href="/policies" className="text-muted-foreground hover:text-bio-green-500 transition-colors">
              {t('returnPolicy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
