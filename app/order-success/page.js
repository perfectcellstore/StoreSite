'use client';

import React, { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import OrderCelebrationFX from '@/components/OrderCelebrationFX';
import { getVictoryCopy, makeSeededRng, pickVictoryQuote } from '@/lib/orderSuccessUtils';
import { useCart } from '@/lib/contexts/CartContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const { language } = useLanguage();
  const { cart } = useCart();
  const { formatPrice } = useCurrency();

  const itemsCount = cart?.reduce?.((sum, i) => sum + (i?.quantity || 0), 0) || 0;
  const totalFormatted = (() => {
    try {
      const total = cart?.reduce?.((sum, i) => sum + (i?.price || 0) * (i?.quantity || 0), 0) || 0;
      return total ? formatPrice(total) : null;
    } catch {
      return null;
    }
  })();

  const rng = useMemo(() => makeSeededRng(orderId || 'victory'), [orderId]);
  const quote = useMemo(() => pickVictoryQuote({ rng }), [rng]);
  const copy = useMemo(
    () =>
      getVictoryCopy({
        language,
        orderId,
        itemsCount: itemsCount || null,
        totalFormatted,
      }),
    [language, orderId, itemsCount, totalFormatted]
  );

  const isAr = language === 'ar';
  const quoteText = isAr ? quote?.ar : quote?.en;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="relative max-w-3xl mx-auto">
          {/* Fire + Ki + Aura FX */}
          <OrderCelebrationFX seed={orderId || 'victory'} className="rounded-2xl" />

          <Card className="relative overflow-hidden max-w-3xl mx-auto bg-card/55 border-border/40 backdrop-blur">
            {/* Decorative header strip */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500/60 via-bio-green-500/70 to-teal-400/60" />

            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-bio-green-500/10 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-bio-green-500 flex items-center justify-center animate-glow-pulse">
                    <Check className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <Sparkles className="h-5 w-5 text-bio-green-400" />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="gradient-text">{copy?.title}</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {copy?.subtitle}
              </p>

              {copy?.contextLine ? (
                <div className="text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-muted/40 border border-border/50">
                    <Sparkles className="h-4 w-4 text-bio-green-400" />
                    {copy.contextLine}
                  </span>
                </div>
              ) : null}

              {/* Quote block */}
              <div className="pt-2">
                <div className="mx-auto max-w-2xl rounded-xl border border-border/50 bg-black/20 p-5 md:p-6 text-left">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {copy?.quoteLabel}
                  </div>

                  <blockquote className={`text-lg md:text-xl font-semibold leading-relaxed ${isAr ? 'text-right' : 'text-left'}`}>
                    “{quoteText}”
                  </blockquote>

                  <div className={`mt-3 text-sm text-muted-foreground ${isAr ? 'text-right' : 'text-left'}`}>
                    — {quote?.character}
                  </div>
                </div>
              </div>

              {/* Extra appreciation lines */}
              <div className="space-y-2">
                {(copy?.extra || []).map((line, idx) => (
                  <p key={idx} className="text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>

              {orderId ? (
                <div className="bg-muted/35 p-4 rounded-lg border border-border/40">
                  <p className="text-sm text-muted-foreground mb-1">{copy?.orderIdLabel}:</p>
                  <p className="font-mono text-sm">{orderId}</p>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => router.push('/shop')}
                  className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white btn-glow"
                >
                  {isAr ? 'متابعة التسوق' : 'Continue Shopping'}
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full border-border hover:border-bio-green-500"
                >
                  {isAr ? 'العودة للرئيسية' : 'Back to Home'}
                </Button>
              </div>

              {/* Tiny “victory badge” */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-bio-green-500 animate-pulse" />
                  <span>{isAr ? 'تم تسجيل طلبك بنجاح — شكرًا لك' : 'Order registered — thank you'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
