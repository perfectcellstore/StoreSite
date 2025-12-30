'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <Card className="max-w-2xl mx-auto bg-card/50 border-border/40">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-bio-green-500/10 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-bio-green-500 flex items-center justify-center animate-glow-pulse">
                <Check className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold">
              <span className="gradient-text">Order Placed Successfully!</span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Thank you for your order. We'll process it shortly and contact you via phone for delivery confirmation.
            </p>
            
            {orderId && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Order ID:</p>
                <p className="font-mono text-sm">{orderId}</p>
              </div>
            )}
            
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push('/shop')}
                className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full border-border hover:border-bio-green-500"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
