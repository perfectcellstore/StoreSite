import { orderSuccessQuotes } from '@/lib/orderSuccessQuotes';

function xfnv1a(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function rng() {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeSeededRng(seedStr) {
  return mulberry32(xfnv1a(String(seedStr || '')));
}

export function pickOne(rng, arr) {
  if (!arr?.length) return null;
  const idx = Math.floor(rng() * arr.length);
  return arr[idx];
}

export function getVictoryCopy({ language = 'en', orderId, itemsCount, totalFormatted }) {
  const isAr = language === 'ar';

  const title = isAr ? 'تم تأكيد الطلب بنجاح!' : 'Order Confirmed!';
  const subtitle = isAr
    ? 'شكرًا لثقتك. تم تسجيل طلبك وسنتواصل معك قريبًا لتأكيد التوصيل.'
    : "Thank you for your purchase. Your order is locked in—we’ll contact you soon to confirm delivery.";

  const contextLine = (() => {
    if (!itemsCount && !totalFormatted) return null;
    if (isAr) {
      const parts = [];
      if (itemsCount) parts.push(`عدد المنتجات: ${itemsCount}`);
      if (totalFormatted) parts.push(`الإجمالي: ${totalFormatted}`);
      return parts.join(' • ');
    }
    const parts = [];
    if (itemsCount) parts.push(`Items: ${itemsCount}`);
    if (totalFormatted) parts.push(`Total: ${totalFormatted}`);
    return parts.join(' • ');
  })();

  const extra = isAr
    ? [
        'لقد وصلت الآن إلى شاشة النصر. استمتع باللحظة… ثم استعد للمرحلة التالية.',
        'مجموعتك تتطوّر. خطوة واحدة اليوم… عظمة غدًا.',
      ]
    : [
        'You just hit the Victory Screen. Take the W—then get ready for the next level.',
        'Your collection is evolving. One move today… greatness tomorrow.',
      ];

  const quoteLabel = isAr ? 'اقتباس اليوم' : 'Quote of the moment';

  return { title, subtitle, contextLine, extra, quoteLabel, orderIdLabel: isAr ? 'رقم الطلب' : 'Order ID' };
}

export function pickVictoryQuote({ rng }) {
  const picked = pickOne(rng, orderSuccessQuotes);
  if (!picked) {
    return {
      character: 'Perfect Sell',
      en: 'Thank you for evolving your collection with us.',
      ar: 'شكرًا لتطوير مجموعتك معنا.',
    };
  }
  return picked;
}
