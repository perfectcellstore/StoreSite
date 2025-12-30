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
import { Check } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: 'Iraq'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        shippingInfo: formData,
        total: getCartTotal(),
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
          title: 'Success!',
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
                        <Label htmlFor="country">{t('country')} *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="bg-background border-border focus:border-bio-green-500"
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
                  <div className="space-y-3 max-h-64 overflow-y-auto">
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
                  
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>{t('total')}</span>
                      <span className="text-bio-green-500">{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white text-lg py-6 btn-glow"
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
