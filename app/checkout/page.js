'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { useCart } from '@/lib/contexts/CartContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Check, Tag } from 'lucide-react';

const SHIPPING_COST_IQD = 5000;
const SHIPPING_COST_USD = SHIPPING_COST_IQD / 1400;

// Promo codes
const PROMO_CODES = {
  'PERFECT10': { discount: 0.10, description: '10% off' },
  'CELL20': { discount: 0.20, description: '20% off' },
  'WELCOME': { discount: 0.05, description: '5% off for new customers' },
  '2026': { discount: 0.20, description: '20% off - New Year Special!' }
};

export default function CheckoutPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { formatPrice, currency } = useCurrency();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, ...PROMO_CODES[code] });
      toast({
        title: 'Promo Code Applied! 🎉',
        description: `You got ${PROMO_CODES[code].description}!`
      });
    } else {
      toast({
        title: 'Invalid Code',
        description: 'This promo code is not valid',
        variant: 'destructive'
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast({
      title: 'Promo Code Removed',
      description: 'Discount has been removed'
    });
  };

  const calculateTotal = () => {
    const subtotal = getCartTotal();
    const shipping = currency === 'IQD' ? SHIPPING_COST_IQD : SHIPPING_COST_USD;
    const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
    return subtotal + shipping - discount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: 'Error',
        description: 'Your cart is empty',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const subtotal = getCartTotal();
      const shipping = currency === 'IQD' ? SHIPPING_COST_IQD : SHIPPING_COST_USD;
      const discount = appliedPromo ? subtotal * appliedPromo.discount : 0;
      const total = subtotal + shipping - discount;

      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingInfo: formData,
        subtotal,
        shipping,
        discount,
        promoCode: appliedPromo?.code || null,
        total,
        userId: user?.id || null
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        toast({
          title: 'Order Placed! 🎉',
          description: 'Your order has been placed successfully'
        });
        router.push(`/order-success?orderId=${data.order.id}`);
      } else {
        throw new Error(data.error || 'Failed to place order');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
          <Button onClick={() => router.push('/shop')}>Go to Shop</Button>
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
          <span className="gradient-text">{t('checkout')}</span>
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card/50 border-border/40">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">{t('shippingInformation')}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">{t('fullName')} *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="bg-background border-border focus:border-bio-green-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">{t('email')} *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-background border-border focus:border-bio-green-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">{t('phone')} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="bg-background border-border focus:border-bio-green-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">{t('address')} *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="bg-background border-border focus:border-bio-green-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">{t('city')} *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="bg-background border-border focus:border-bio-green-500"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="province">Province *</Label>
                        <Input
                          id="province"
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          required
                          className="bg-background border-border focus:border-bio-green-500"
                          placeholder="e.g., Baghdad, Basra, Erbil"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-card/50 border-border/40">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">{t('paymentMethod')}</h2>
                  
                  <div className="flex items-center gap-3 p-4 border-2 border-bio-green-500 rounded-lg bg-bio-green-500/5">
                    <div className="w-6 h-6 rounded-full bg-bio-green-500 flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{t('cashOnDelivery')}</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-card/50 border-border/40 sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold mb-4">{t('orderSummary')}</h2>
                  
                  {/* Items */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item) => {
                      const itemName = language === 'ar' && item.nameAr ? item.nameAr : item.name;
                      return (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {itemName} x {item.quantity}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t border-border pt-4 space-y-3">
                    {/* Promo Code */}
                    <div className="space-y-2">
                      <Label className="text-sm">Promo Code</Label>
                      {!appliedPromo ? (
                        <div className="flex gap-2">
                          <Input
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="bg-background border-border focus:border-bio-green-500"
                          />
                          <Button
                            onClick={handleApplyPromo}
                            variant="outline"
                            className="border-bio-green-500 text-bio-green-500 hover:bg-bio-green-500 hover:text-white"
                          >
                            <Tag className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-bio-green-500/10 border border-bio-green-500 rounded-lg">
                          <div>
                            <p className="text-sm font-semibold text-bio-green-500">{appliedPromo.code}</p>
                            <p className="text-xs text-muted-foreground">{appliedPromo.description}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleRemovePromo}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{t('subtotal')}</span>
                        <span>{formatPrice(getCartTotal())}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Shipping (All Iraq)</span>
                        <span>{formatPrice(currency === 'IQD' ? SHIPPING_COST_IQD : SHIPPING_COST_USD, true)}</span>
                      </div>
                      {appliedPromo && (
                        <div className="flex justify-between text-bio-green-500">
                          <span>Discount ({appliedPromo.description})</span>
                          <span>-{formatPrice(getCartTotal() * appliedPromo.discount)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>{t('total')}</span>
                      <span className="text-bio-green-500">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white text-lg py-6 btn-glow animate-glow-pulse"
                  >
                    {loading ? 'Processing...' : t('placeOrder')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
