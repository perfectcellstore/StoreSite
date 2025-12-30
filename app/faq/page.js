'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

export default function FAQPage() {
  const { t, language } = useLanguage();

  const faqs = [
    {
      question: t('howDoIPlaceOrder'),
      answer: language === 'ar' 
        ? 'تصفح متجرنا، أضف المنتجات إلى سلتك، وانتقل إلى الدفع. املأ معلومات الشحن وأكد طلبك. نقبل الدفع عند الاستلام حالياً.'
        : 'Browse our shop, add items to your cart, and proceed to checkout. Fill in your shipping information and confirm your order. We accept Cash on Delivery currently.'
    },
    {
      question: t('whatPaymentMethods'),
      answer: language === 'ar'
        ? 'حالياً، نقبل الدفع عند الاستلام (COD). ستتوفر بطاقة Visa وبطاقة Qi وطرق دفع أخرى قريباً!'
        : 'Currently, we accept Cash on Delivery (COD). Visa, Qi Card, and other payment methods will be available soon!'
    },
    {
      question: t('howLongDelivery'),
      answer: language === 'ar'
        ? 'يستغرق التوصيل عادةً من 1-3 أيام داخل العراق. سنتصل بك عبر الهاتف لتأكيد تفاصيل التوصيل.'
        : 'Delivery typically takes 1-3 days within Iraq. We will contact you via phone to confirm delivery details.'
    },
    {
      question: t('howMuchShipping'),
      answer: language === 'ar'
        ? 'الشحن بسعر ثابت 5,000 دينار عراقي لجميع المحافظات في العراق.'
        : 'Shipping is a fixed rate of 5,000 IQD to all provinces in Iraq.'
    },
    {
      question: t('doYouShipInternational'),
      answer: language === 'ar'
        ? 'حالياً، نشحن فقط داخل العراق. سيتوفر الشحن الدولي في المستقبل.'
        : 'Currently, we only ship within Iraq. International shipping will be available in the future.'
    },
    {
      question: t('areProductsAuthentic'),
      answer: language === 'ar'
        ? 'نعم! جميع منتجاتنا منتقاة بعناية ومعتمدة. نبيع مقتنيات أصلية ونسخ ممتازة وبضائع مرخصة رسمياً.'
        : 'Yes! All our products are carefully curated and verified. We sell authentic collectibles, premium replicas, and officially licensed merchandise.'
    },
    {
      question: t('canICancelOrder'),
      answer: language === 'ar'
        ? 'نعم، يمكنك إلغاء أو تعديل طلبك قبل شحنه. اتصل بنا فوراً عبر واتساب على +964 773 379 7713.'
        : 'Yes, you can cancel or modify your order before it is shipped. Contact us immediately via WhatsApp at +964 773 379 7713.'
    },
    {
      question: t('whatIsReturnPolicy'),
      answer: language === 'ar'
        ? 'نقبل الإرجاع خلال 7 أيام من التوصيل إذا كان المنتج تالفاً أو غير مطابق للوصف. اتصل بنا عبر واتساب لبدء عملية الإرجاع.'
        : 'We accept returns within 7 days of delivery if the product is damaged or not as described. Contact us via WhatsApp to initiate a return.'
    },
    {
      question: t('howTrackOrder'),
      answer: language === 'ar'
        ? 'بعد تأكيد طلبك، سنتصل بك عبر الهاتف بمعلومات التتبع وتحديثات التوصيل.'
        : 'After your order is confirmed, we will contact you via phone with tracking information and delivery updates.'
    },
    {
      question: t('doYouHavePromoCodes'),
      answer: language === 'ar'
        ? 'نعم! نقدم بانتظام أكواد خصم. تابعنا على إنستغرام @perfectsell_store للحصول على أحدث الأكواد والعروض الخاصة!'
        : 'Yes! We regularly offer promo codes for discounts. Follow us on Instagram @perfectsell_store for the latest codes and special offers!'
    },
    {
      question: t('howContactSupport'),
      answer: language === 'ar'
        ? 'يمكنك التواصل معنا عبر واتساب على +964 773 379 7713 أو متابعتنا على إنستغرام @perfectsell_store. نرد خلال 24 ساعة.'
        : 'You can reach us via WhatsApp at +964 773 379 7713 or follow us on Instagram @perfectsell_store. We respond within 24 hours.'
    }
  ];

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
