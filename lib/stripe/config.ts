// هذا ملف تكوين Stripe
// في بيئة الإنتاج، يجب استبدال هذه المفاتيح بمفاتيح حقيقية من لوحة تحكم Stripe

// مفتاح Stripe العام (للاستخدام في جانب العميل)
// استخدام مفتاح اختبار لتجنب الأخطاء في بيئة التطوير
export const STRIPE_PUBLIC_KEY = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  : 'pk_test_51RMBEWBnPy08qUQBpHEcHfihqJFF5DXzZMaPDfvqtqYjHznvMcrYHGs6tRWGMAyZa9ZZBRePskjkxiXoZMUrmWI900PjWoOJ5e';

// مفتاح Stripe السري (للاستخدام في جانب الخادم فقط)
// يجب تعيين المفتاح السري في متغيرات البيئة
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_SECRET_KEY';

// تكوين المنتجات والأسعار
// ملاحظة: يجب استبدال معرفات الأسعار التالية بالمعرفات الحقيقية من لوحة تحكم Stripe الخاصة بك
export const STRIPE_PRODUCTS = {
  PRO: {
    monthly: {
      priceId: 'price_XXXXXXXXXXXXXXXXXXXXXXXX', // استبدل بمعرف السعر الشهري لخطة Pro
      amount: 9.99,
    },
    yearly: {
      priceId: 'price_XXXXXXXXXXXXXXXXXXXXXXXX', // استبدل بمعرف السعر السنوي لخطة Pro
      amount: 95.88,
    },
  },
  BUSINESS: {
    monthly: {
      priceId: 'price_XXXXXXXXXXXXXXXXXXXXXXXX', // استبدل بمعرف السعر الشهري لخطة Business
      amount: 19.99,
    },
    yearly: {
      priceId: 'price_XXXXXXXXXXXXXXXXXXXXXXXX', // استبدل بمعرف السعر السنوي لخطة Business
      amount: 191.88,
    },
  },
};

// عملة الدفع
export const CURRENCY = 'usd';

// URL إعادة التوجيه بعد الدفع
export const SUCCESS_URL = process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || 'http://localhost:3001/admin/subscription/success';
export const CANCEL_URL = process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || 'http://localhost:3001/admin/subscription/cancel';
