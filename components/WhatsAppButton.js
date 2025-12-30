'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/9647733797713"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        size="lg"
        className="rounded-full h-14 w-14 bg-bio-green-500 hover:bg-bio-green-600 shadow-lg hover:shadow-xl transition-all animate-glow-pulse"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    </a>
  );
}
