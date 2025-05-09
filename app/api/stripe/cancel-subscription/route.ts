import { NextResponse } from "next/server"
import Stripe from "stripe"
import { supabase } from "@/lib/supabase-client"
import { STRIPE_SECRET_KEY } from "@/lib/stripe/config"

// إنشاء كائن Stripe باستخدام المفتاح السري
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

export async function POST(request: Request) {
  try {
    // استخراج البيانات من الطلب
    const { subscriptionId } = await request.json()

    // التحقق من وجود معرف الاشتراك
    if (!subscriptionId) {
      return new Response(
        JSON.stringify({ error: "Subscription ID is required" }),
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

    // التحقق من أن الاشتراك ينتمي للمستخدم الحالي
    const { data: subscription, error: subscriptionError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("stripe_subscription_id", subscriptionId)
      .single()

    if (subscriptionError) {
      console.error("Error fetching subscription:", subscriptionError)
      return new Response(
        JSON.stringify({ error: "Subscription not found or does not belong to the current user" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // إلغاء الاشتراك في نهاية فترة الفوترة الحالية
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // تحديث معلومات الاشتراك في قاعدة البيانات
    const { error: updateError } = await supabase
      .from("user_subscriptions")
      .update({
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("stripe_subscription_id", subscriptionId)

    if (updateError) {
      console.error("Error updating subscription in database:", updateError)
    }

    // إرجاع معلومات الاشتراك المحدثة
    return new Response(
      JSON.stringify({
        success: true,
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          cancel_at_period_end: updatedSubscription.cancel_at_period_end,
          current_period_end: updatedSubscription.current_period_end,
        },
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error: any) {
    console.error("Error canceling subscription:", error)
    
    // تحديد نوع الخطأ ورمز الحالة المناسب
    let statusCode = 500
    let errorMessage = "Failed to cancel subscription"
    
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
