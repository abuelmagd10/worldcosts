import { NextResponse } from "next/server"
import Stripe from "stripe"
import { STRIPE_SECRET_KEY, SUCCESS_URL, CANCEL_URL, CURRENCY } from "@/lib/stripe/config"

// إنشاء كائن Stripe باستخدام المفتاح السري
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // استخدم أحدث إصدار من API
})

export async function POST(request: Request) {
  try {
    // استخراج البيانات من الطلب
    const { priceId, planId, planName, billingCycle } = await request.json()

    // التحقق من وجود معرف السعر
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      )
    }

    // إنشاء جلسة Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // يمكن إضافة طرق دفع أخرى هنا
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
      metadata: {
        planId,
        planName,
        billingCycle,
      },
      currency: CURRENCY,
      locale: "ar", // استخدام اللغة العربية لواجهة الدفع
      allow_promotion_codes: true, // السماح باستخدام رموز الخصم
      billing_address_collection: "required", // طلب عنوان الفوترة
      customer_email: undefined, // يمكن تعيين البريد الإلكتروني للعميل هنا إذا كان معروفًا
    })

    // إرجاع معرف الجلسة
    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
