'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/FooterSSR';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Instagram, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          <span className="gradient-text">Contact Us</span>
        </h1>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-card/50 border-border/40">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-bio-green-500 mb-4">Get in Touch</h2>
                
                <div className="space-y-4">
                  <a
                    href="https://wa.me/9647733797713"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-bio-green-500 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>+964 773 379 7713</span>
                  </a>
                  
                  <a
                    href="https://instagram.com/perfectsell_store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-bio-green-500 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>@perfectsell_store</span>
                  </a>
                  
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>Iraq</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/40">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Saturday - Thursday: 9:00 AM - 8:00 PM</p>
                  <p>Friday: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-bio-green-500 mb-4">Send us a Message</h2>
              
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="bg-background border-border focus:border-bio-green-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="bg-background border-border focus:border-bio-green-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Your message..."
                    rows={5}
                    className="bg-background border-border focus:border-bio-green-500"
                  />
                </div>
                
                <Button className="w-full bg-bio-green-500 hover:bg-bio-green-600 text-white btn-glow">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
