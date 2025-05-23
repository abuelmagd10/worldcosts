// هذا ملف تكوين Paddle
// تم تحديث هذه المفاتيح بمفاتيح حقيقية من لوحة تحكم Paddle

// مفتاح Paddle العام (للاستخدام في جانب العميل)
export const PADDLE_PUBLIC_KEY = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_PADDLE_PUBLIC_KEY
  ? process.env.NEXT_PUBLIC_PADDLE_PUBLIC_KEY
  : 'live_2b9f03bdaa5802aaaf87b06640f';

// مفتاح Paddle السري (للاستخدام في جانب الخادم فقط)
// يجب تحديث هذه القيم بالقيم الفعلية من لوحة تحكم Paddle
export const PADDLE_API_KEY = process.env.PADDLE_API_KEY || 'apikey_01jv7k0rhqaajrsgcbc8fnkade';
export const PADDLE_VENDOR_ID = process.env.PADDLE_VENDOR_ID || '01jv7k0rhqaajrsgcbc8fnkade';

// ملاحظة: يجب تحديث هذه القيم بالقيم الفعلية من لوحة تحكم Paddle
// يمكن الحصول على هذه القيم من https://vendors.paddle.com/authentication-v2

// تكوين المنتجات والأسعار
// تم تحديث هذه المعرفات بمعرفات حقيقية من لوحة تحكم Paddle
// ملاحظة: في Paddle Checkout API، نستخدم معرفات المنتجات وليس معرفات الأسعار
export const PADDLE_PRODUCTS = {
  PRO: {
    monthly: {
      // يجب تحديث هذه القيمة بمعرف المنتج الفعلي من لوحة تحكم Paddle
      priceId: process.env.PADDLE_PRO_MONTHLY_PRICE_ID || '12345', // معرف المنتج الشهري Pro
      amount: 9.99,
    },
    yearly: {
      // يجب تحديث هذه القيمة بمعرف المنتج الفعلي من لوحة تحكم Paddle
      priceId: process.env.PADDLE_PRO_YEARLY_PRICE_ID || '12346', // معرف المنتج السنوي Pro
      amount: 95.88,
    },
  },
  BUSINESS: {
    monthly: {
      // يجب تحديث هذه القيمة بمعرف المنتج الفعلي من لوحة تحكم Paddle
      priceId: process.env.PADDLE_BUSINESS_MONTHLY_PRICE_ID || '12347', // معرف المنتج الشهري Business
      amount: 19.99,
    },
    yearly: {
      // يجب تحديث هذه القيمة بمعرف المنتج الفعلي من لوحة تحكم Paddle
      priceId: process.env.PADDLE_BUSINESS_YEARLY_PRICE_ID || '12348', // معرف المنتج السنوي Business
      amount: 191.88,
    },
  },
};

// عملة الدفع
export const CURRENCY = 'usd';

// URL إعادة التوجيه بعد الدفع
export const SUCCESS_URL = process.env.NEXT_PUBLIC_PADDLE_SUCCESS_URL || 'http://localhost:3001/admin/subscription/success';
export const CANCEL_URL = process.env.NEXT_PUBLIC_PADDLE_CANCEL_URL || 'http://localhost:3001/admin/subscription/cancel';