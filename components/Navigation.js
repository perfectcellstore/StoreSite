'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useEffects } from '@/lib/contexts/EffectsContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, User, LogOut, LayoutDashboard, Globe, DollarSign, Sparkles, Sword } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PerfectCellLogo } from '@/components/PerfectCellLogo';
import { SwordInStone } from '@/components/SwordInStone';
import { NotificationBell } from '@/components/NotificationBell';

export function Navigation() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { currency, toggleCurrency } = useCurrency();
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { effectsEnabled, toggleEffects, lowPowerMode, toggleLowPowerMode } = useEffects();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const cartCount = getCartCount();

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/shop', label: t('shop') },
    { href: '/categories', label: t('categories') },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Extra padding at top for mobile to show full jump animation */}
      <div className="h-8 md:h-4"></div>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo - Fixed size container to prevent layout shift */}
        <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 flex-shrink-0">
            <PerfectCellLogo />
          </div>
          <div className="relative flex-shrink-0">
            <div className="text-2xl font-bold gradient-text whitespace-nowrap">Perfect Sell</div>
            <div className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-bio-green-500 to-transparent animate-pulse"></div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-bio-green-500 ${
                pathname === link.href ? 'text-bio-green-500' : 'text-foreground/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="hidden sm:flex items-center gap-2 hover:bg-bio-green-500/10 hover:text-bio-green-500"
          >
            <Globe className="h-4 w-4" />
            {language === 'en' ? 'AR' : 'EN'}
          </Button>

          {/* Currency Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCurrency}
            className="hidden sm:flex items-center gap-2 hover:bg-bio-green-500/10 hover:text-bio-green-500"
          >
            <DollarSign className="h-4 w-4" />
            {currency}
          </Button>

          {/* Notification Bell - Only show when logged in */}
          {user && <NotificationBell />}

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="relative hover:bg-bio-green-500/10 hover:text-bio-green-500">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-bio-green-500 text-xs text-white flex items-center justify-center animate-glow-pulse">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-bio-green-500/10 hover:text-bio-green-500">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {t('myAccount')}
                  </Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('admin')}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm" className="bg-bio-green-500 hover:bg-bio-green-600 text-white btn-glow">
                {t('login')}
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="hover:bg-bio-green-500/10 hover:text-bio-green-500">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-card border-border">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-bio-green-500 ${
                      pathname === link.href ? 'text-bio-green-500' : 'text-foreground/80'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="w-full justify-start hover:bg-bio-green-500/10 hover:text-bio-green-500"
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    {language === 'en' ? 'العربية' : 'English'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleCurrency}
                    className="w-full justify-start hover:bg-bio-green-500/10 hover:text-bio-green-500"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    {currency}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleEffects}
                    className="w-full justify-start hover:bg-bio-green-500/10 hover:text-bio-green-500"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('clickEffects')}: {effectsEnabled ? t('on') : t('off')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLowPowerMode}
                    className="w-full justify-start hover:bg-bio-green-500/10 hover:text-bio-green-500"
                  >
                    <Zap className={`mr-2 h-4 w-4 ${lowPowerMode ? 'text-yellow-500' : ''}`} />
                    Low Power Mode: {lowPowerMode ? t('on') : t('off')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSheetOpen(false);
                      setTimeout(() => setShowEasterEgg(true), 300);
                    }}
                    className="w-full justify-start hover:bg-bio-green-500/10 hover:text-bio-green-500"
                  >
                    <Sword className="mr-2 h-4 w-4" />
                    {t('secret')}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Easter Egg Modal */}
      {showEasterEgg && <SwordInStone onClose={() => setShowEasterEgg(false)} />}
    </nav>
  );
}
