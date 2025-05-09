import { NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase-client"
import { STRIPE_SECRET_KEY } from "@/lib/stripe/config"

// إنشاء كائن Stripe باستخدام المفتاح السري
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function GET(request: Request) {
  try {
    // الحصول على معرف الجلسة من معلمات البحث
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    // التحقق من وجود معرف الجلسة
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // الحصول على معلومات المستخدم الحالي من Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // التحقق من وجود خطأ في المصادقة
    if (authError) {
      console.error("Authentication error:", authError)
      return new Response(
        JSON.stringify({ error: "Authentication error: " + authError.message }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    // التحقق من وجود المستخدم
    if (!user) {
      console.error("User not authenticated")
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // جلب تفاصيل جلسة الدفع من Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // التحقق من وجود اشتراك
    if (!session.subscription) {
      return new Response(
        JSON.stringify({ error: "No subscription found for this session" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // جلب تفاصيل الاشتراك من Stripe
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    // جلب تفاصيل المنتج والسعر
    const priceId = subscription.items.data[0].price.id
    const price = await stripe.prices.retrieve(priceId)
    const productId = price.product as string
    const product = await stripe.products.retrieve(productId)

    // تحديد دورة الفوترة
    const billingCycle = price.recurring?.interval === 'year' ? 'yearly' : 'monthly'

    // تنسيق تواريخ الاشتراك
    const startDate = new Date(subscription.current_period_start * 1000).toLocaleDateString()
    const endDate = new Date(subscription.current_period_end * 1000).toLocaleDateString()

    // تحديث معلومات الاشتراك في قاعدة البيانات
    const { error: updateError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        plan_id: productId,
        plan_name: product.name,
        price_id: priceId,
        billing_cycle: billingCycle,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      })

    if (updateError) {
      console.error("Error updating subscription in database:", updateError)
    }

    // إرجاع تفاصيل الاشتراك
    return new Response(
      JSON.stringify({
        subscription_id: subscription.id,
        customer_id: subscription.customer,
        plan_id: productId,
        plan_name: product.name,
        price_id: priceId,
        billing_cycle: billingCycle,
        status: subscription.status,
        start_date: startDate,
        next_billing_date: endDate,
        cancel_at_period_end: subscription.cancel_at_period_end,
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error: any) {
    console.error("Error retrieving subscription details:", error)
    
    // تحديد نوع الخطأ ورمز الحالة المناسب
    let statusCode = 500
    let errorMessage = "Failed to retrieve subscription details"
    
    if (error.type === 'StripeInvalidRequestError') {
      statusCode = 400
      errorMessage = error.message || "Invalid request to Stripe API"
    } else if (error.type === 'StripeAuthenticationError') {
      statusCode = 401
      errorMessage = "Authentication with Stripe failed"
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
