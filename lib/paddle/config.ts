// هذا ملف تكوين Paddle
// في بيئة الإنتاج، يجب استبدال هذه المفاتيح بمفاتيح حقيقية من لوحة تحكم Paddle

// مفتاح Paddle العام (للاستخدام في جانب العميل)
// استخدام مفتاح اختبار لتجنب الأخطاء في بيئة التطوير
export const PADDLE_PUBLIC_KEY = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PADDLE_PUBLIC_KEY
  ? process.env.NEXT_PUBLIC_PADDLE_PUBLIC_KEY
  : 'PADDLE_PUBLIC_KEY_FROM_DASHBOARD';

// مفتاح Paddle السري (للاستخدام في جانب الخادم فقط)
// يجب تعيين المفتاح السري في متغيرات البيئة
export const PADDLE_API_KEY = process.env.PADDLE_API_KEY || 'PADDLE_API_KEY_FROM_DASHBOARD';
export const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID || 'PADDLE_VENDOR_ID_FROM_DASHBOARD';

// تكوين المنتجات والأسعار
// تم تحديث هذه المعرفات بالمعرفات الخاصة بك من لوحة تحكم Paddle
export const PADDLE_PRODUCTS = {
  PRO: {
    monthly: {
      priceId: process.env.PADDLE_PRO_MONTHLY_PRICE_ID || 'PRO_MONTHLY_PRICE_ID_FROM_PADDLE', // معرف المنتج الشهري Pro
      amount: 9.99,
    },
    yearly: {
      priceId: process.env.PADDLE_PRO_YEARLY_PRICE_ID || 'PRO_YEARLY_PRICE_ID_FROM_PADDLE', // معرف المنتج السنوي Pro
      amount: 95.88,
    },
  },
  BUSINESS: {
    monthly: {
      priceId: process.env.PADDLE_BUSINESS_MONTHLY_PRICE_ID || 'BUSINESS_MONTHLY_PRICE_ID_FROM_PADDLE', // معرف المنتج الشهري Business
      amount: 19.99,
    },
    yearly: {
      priceId: process.env.PADDLE_BUSINESS_YEARLY_PRICE_ID || 'BUSINESS_YEARLY_PRICE_ID_FROM_PADDLE', // معرف المنتج السنوي Business
      amount: 191.88,
    },
  },
};

// عملة الدفع
export const CURRENCY = 'usd';

// URL إعادة التوجيه بعد الدفع
export const SUCCESS_URL = process.env.NEXT_PUBLIC_PADDLE_SUCCESS_URL || 'http://localhost:3001/admin/subscription/success';
export const CANCEL_URL = process.env.NEXT_PUBLIC_PADDLE_CANCEL_URL || 'http://localhost:3001/admin/subscription/cancel';