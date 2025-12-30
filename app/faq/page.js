'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

const faqs = [
  {
    question: 'How do I place an order?',
    answer: 'Browse our shop, add items to your cart, and proceed to checkout. Fill in your shipping information and confirm your order. We only accept Cash on Delivery currently.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'Currently, we accept Cash on Delivery (COD). You pay when you receive your order. Qi Card payment will be available soon.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes 3-7 business days depending on your location within Iraq. We will contact you via phone to confirm delivery details.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within Iraq. International shipping will be available in the future.'
  },
  {
    question: 'Are the products authentic?',
    answer: 'Yes, all our products are carefully curated and verified for authenticity. We only sell genuine collectibles, replicas, and merchandise.'
  },
  {
    question: 'Can I cancel or modify my order?',
    answer: 'Yes, you can cancel or modify your order before it is shipped. Contact us immediately via WhatsApp at +964 773 379 7713.'
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery if the product is damaged or not as described. Contact us via WhatsApp to initiate a return.'
  },
  {
    question: 'How can I track my order?',
    answer: 'After your order is confirmed, we will contact you via phone with tracking information and delivery updates.'
  },
  {
    question: 'Do you offer warranties?',
    answer: 'Warranty depends on the product type. Collectibles and replicas typically do not have warranties, but we ensure all items are in perfect condition before shipping.'
  },
  {
    question: 'How can I contact customer support?',
    answer: 'You can reach us via WhatsApp at +964 773 379 7713 or follow us on Instagram @perfectsell_store. We respond within 24 hours.'
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            <span className="gradient-text">Frequently Asked Questions</span>
          </h1>
          <p className="text-center text-muted-foreground mb-12">
            Find answers to common questions about Perfect Sell
          </p>

          <Card className="bg-card/50 border-border/40">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-bio-green-500">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? Contact us directly!
            </p>
            <a
              href="https://wa.me/9647733797713"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-bio-green-500 hover:underline"
            >
              WhatsApp: +964 773 379 7713
            </a>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
