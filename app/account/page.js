'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useCurrency } from '@/lib/contexts/CurrencyContext';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, User as UserIcon } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { formatPrice } = useCurrency();
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login?redirect=/account');
      } else {
        fetchOrders();
      }
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'shipped': return 'text-purple-500';
      case 'delivered': return 'text-bio-green-500';
      case 'cancelled': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-bio-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">
          <span className="gradient-text">{t('myAccount')}</span>
        </h1>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="orders">{t('orderHistory')}</TabsTrigger>
            <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Orders</h2>
            </div>

            {orders.length === 0 ? (
              <Card className="bg-card/50 border-border/40">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                  <Button
                    onClick={() => router.push('/shop')}
                    className="bg-bio-green-500 hover:bg-bio-green-600 text-white"
                  >
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} className="bg-card/50 border-border/40">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-bio-green-500">{formatPrice(order.total)}</p>
                            <p className={`text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm text-muted-foreground mb-1">
                              <span>
                                {language === 'ar' && item.nameAr ? item.nameAr : item.name} x {item.quantity}
                              </span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-border pt-4 text-sm">
                          <p><span className="text-muted-foreground">Delivery to:</span> {order.shippingInfo.address}</p>
                          <p><span className="text-muted-foreground">City:</span> {order.shippingInfo.city}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-card/50 border-border/40">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-bio-green-500/10 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-bio-green-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-4 border-t border-border pt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-semibold capitalize">{user?.role}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-semibold">{new Date(user?.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="pt-6">
                    <Button
                      onClick={logout}
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
