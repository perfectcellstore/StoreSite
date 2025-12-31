'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
            <span className="gradient-text">Policies</span>
          </h1>

          <Tabs defaultValue="privacy" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
              <TabsTrigger value="terms">Terms of Service</TabsTrigger>
              <TabsTrigger value="return">Return Policy</TabsTrigger>
            </TabsList>

            {/* Privacy Policy */}
            <TabsContent value="privacy">
              <Card className="bg-card/50 border-border/40">
                <CardContent className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-bio-green-500">Privacy Policy</h2>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Information Collection</h3>
                      <p>We collect information you provide when creating an account, placing orders, or contacting us. This includes your name, email, phone number, and shipping address.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">How We Use Your Information</h3>
                      <p>We use your information to process orders, communicate about your purchases, improve our services, and send promotional materials (if you opt in).</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Data Security</h3>
                      <p>We implement security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Cookies</h3>
                      <p>We use cookies to enhance your browsing experience and remember your preferences.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Third Parties</h3>
                      <p>We do not sell or share your personal information with third parties except as necessary to fulfill your orders.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
                      <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Terms of Service */}
            <TabsContent value="terms">
              <Card className="bg-card/50 border-border/40">
                <CardContent className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-bio-green-500">Terms of Service</h2>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Acceptance of Terms</h3>
                      <p>By using Perfect Sell, you agree to these terms and conditions. If you do not agree, please do not use our services.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Product Information</h3>
                      <p>We strive to provide accurate product descriptions and images. However, we do not guarantee that all information is error-free or complete.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Pricing</h3>
                      <p>All prices are listed in USD and IQD. Prices are subject to change without notice. The price at the time of order placement applies.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Order Acceptance</h3>
                      <p>We reserve the right to refuse or cancel any order for any reason, including product availability, errors in pricing, or suspected fraud.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Prohibited Uses</h3>
                      <p>You may not use our site for any illegal purpose or to violate any laws. You may not attempt to gain unauthorized access to our systems.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Intellectual Property</h3>
                      <p>All content on Perfect Sell, including text, graphics, logos, and images, is our property and protected by copyright laws.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Limitation of Liability</h3>
                      <p>Perfect Sell is not liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Return Policy */}
            <TabsContent value="return">
              <Card className="bg-card/50 border-border/40">
                <CardContent className="p-8 space-y-6">
                  <h2 className="text-2xl font-bold text-bio-green-500">Return Policy</h2>
                  
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Return Period</h3>
                      <p>You may return items within 7 days of delivery if the product is damaged, defective, or not as described.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Return Conditions</h3>
                      <p>Items must be in original condition, unused, and in original packaging. Custom or personalized items cannot be returned unless defective.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">How to Return</h3>
                      <p>Contact us via WhatsApp at +964 773 379 7713 within the return period. Provide your order number and reason for return. We will guide you through the process.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Refunds</h3>
                      <p>Refunds will be processed within 5-7 business days after we receive and inspect the returned item. Refunds will be issued to your original payment method.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Exchanges</h3>
                      <p>We offer exchanges for damaged or defective items. Contact us to arrange an exchange.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Non-Returnable Items</h3>
                      <p>Gift cards, downloadable products, and items marked as final sale cannot be returned.</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Return Shipping</h3>
                      <p>For defective or damaged items, we cover return shipping costs. For other returns, the customer is responsible for return shipping.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
