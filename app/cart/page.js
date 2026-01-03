'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { useCart } from '@/lib/contexts/CartContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';

// Cart item image with fallback
function CartItemImage({ src, alt }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800/50">
        <ImageOff className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt || 'Product'}
      fill
      className="object-cover"
      onError={() => setHasError(true)}
    />
  );
}

export default function CartPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-3xl font-bold mb-4">{t('emptyCart')}</h2>
          <p className="text-muted-foreground mb-8">Start adding items to your cart!</p>
          <Button
            onClick={() => router.push('/shop')}
            className="bg-bio-green-500 hover:bg-bio-green-600 text-white"
          >
            {t('continueShopping')}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          <span className="gradient-text">{t('yourCart')}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const itemName = language === 'ar' && item.nameAr ? item.nameAr : item.name;
              
              return (
                <Card key={item.id} className="bg-card/50 border-border/40">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 relative flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={item.image}
                          alt={itemName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-grow space-y-2">
                        <h3 className="font-semibold text-lg">{itemName}</h3>
                        <p className="text-bio-green-500 font-bold">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 border-border hover:border-bio-green-500"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 border-border hover:border-bio-green-500"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 border-border/40 sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold mb-4">{t('orderSummary')}</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('subtotal')}</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>{t('total')}</span>
                    <span className="text-bio-green-500">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white text-lg py-6 btn-glow"
                >
                  {t('proceedToCheckout')}
                </Button>
                
                <Button
                  onClick={() => router.push('/shop')}
                  variant="outline"
                  className="w-full border-border hover:border-bio-green-500"
                >
                  {t('continueShopping')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
