import { NextResponse } from "next/server"
import Stripe from "stripe"
import { STRIPE_SECRET_KEY, CURRENCY } from "@/lib/stripe/config"
import { supabase } from "@/lib/supabase-client"

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

    // التحقق من صحة معرف السعر
    if (!priceId.startsWith('price_')) {
      console.error("Invalid price ID format:", priceId)
      return NextResponse.json(
        { error: "Invalid price ID format. Price ID should start with 'price_'" },
        { status: 400 }
      )
    }

    // الحصول على معلومات المستخدم الحالي من Supabase
    // ملاحظة: في بيئة الإنتاج، يجب استخدام طريقة أكثر أمانًا للتحقق من المستخدم
    const { data, error: authError } = await supabase.auth.getUser()

    // التحقق من وجود خطأ في المصادقة
    if (authError) {
      console.error("Authentication error:", authError)
      return NextResponse.json(
        { error: "Authentication error: " + authError.message },
        { status: 401 }
      )
    }

    // التحقق من وجود المستخدم
    if (!data.user) {
      console.error("User not authenticated")
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      )
    }

    const user = data.user

    // الحصول على معلومات العميل الحالي في Stripe أو إنشاء عميل جديد
    let customerId: string

    // البحث عن العميل في Stripe باستخدام البريد الإلكتروني
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    })

    if (customers.data.length > 0) {
      // استخدام العميل الموجود
      customerId = customers.data[0].id
    } else {
      // إنشاء عميل جديد
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id
    }

    // تكوين URLs إعادة التوجيه
    const success_url = new URL(process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || 'http://localhost:3001/admin/subscription/success')
    success_url.searchParams.append('session_id', '{CHECKOUT_SESSION_ID}')

    const cancel_url = new URL(process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || 'http://localhost:3001/admin/subscription/cancel')
    cancel_url.searchParams.append('reason', '{CHECKOUT_SESSION_STATUS}')

    // إنشاء جلسة Checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"], // يمكن إضافة طرق دفع أخرى هنا
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: success_url.toString(),
      cancel_url: cancel_url.toString(),
      metadata: {
        userId: user.id,
        planId,
        planName,
        billingCycle,
      },
      currency: CURRENCY,
      locale: "ar", // استخدام اللغة العربية لواجهة الدفع
      allow_promotion_codes: true, // السماح باستخدام رموز الخصم
      billing_address_collection: "required", // طلب عنوان الفوترة
      customer_email: user.email, // تعيين البريد الإلكتروني للعميل
    })

    // إرجاع معرف الجلسة
    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error("Error creating checkout session:", error)

    // تحديد نوع الخطأ ورمز الحالة المناسب
    let statusCode = 500
    let errorMessage = "Failed to create checkout session"

    if (error.type === 'StripeCardError') {
      statusCode = 400
      errorMessage = error.message || "Card error"
    } else if (error.type === 'StripeInvalidRequestError') {
      statusCode = 400
      errorMessage = error.message || "Invalid request"
    } else if (error.type === 'StripeAuthenticationError') {
      statusCode = 401
      errorMessage = "Authentication with Stripe failed"
    } else if (error.message) {
      errorMessage = error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}
