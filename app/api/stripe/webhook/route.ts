import { NextResponse } from "next/server"
import Stripe from "stripe"
import { STRIPE_SECRET_KEY } from "@/lib/stripe/config"
import { supabase } from "@/lib/supabase-client"

// إنشاء كائن Stripe باستخدام المفتاح السري
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})

// هذا هو المفتاح السري للتحقق من صحة الأحداث الواردة من Stripe
// يجب تعيينه في متغيرات البيئة
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") || ""

    let event: Stripe.Event

    try {
      // التحقق من صحة الحدث باستخدام المفتاح السري
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    // معالجة الأحداث المختلفة
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case "payment.succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      case "payment.failed":
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}

// معالجة حدث إكمال جلسة الخروج
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log("Checkout session completed:", session.id)

    // الحصول على معلومات العميل
    const customerId = session.customer as string
    const customerEmail = session.customer_details?.email
    const subscriptionId = session.subscription as string
    const planId = session.metadata?.planId
    const billingCycle = session.metadata?.billingCycle

    if (!customerId || !subscriptionId || !planId) {
      console.error("Missing required data in session:", session.id)
      return
    }

    // الحصول على معلومات الاشتراك
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // التحقق من وجود المستخدم
    let userId: string | null = null

    if (customerEmail) {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerEmail)
        .single()

      userId = userData?.id || null
    }

    if (!userId) {
      console.error("User not found for email:", customerEmail)
      return
    }

    // تخزين معلومات الاشتراك
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })

    if (error) {
      console.error("Error storing subscription data:", error)
    }
  } catch (error) {
    console.error("Error handling checkout session completed:", error)
  }
}

// معالجة حدث نجاح الدفع
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment succeeded:", paymentIntent.id)

    // يمكن إضافة منطق إضافي هنا مثل إرسال بريد إلكتروني للتأكيد
  } catch (error) {
    console.error("Error handling payment succeeded:", error)
  }
}

// معالجة حدث فشل الدفع
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log("Payment failed:", paymentIntent.id)

    // يمكن إضافة منطق إضافي هنا مثل إرسال بريد إلكتروني للإشعار بالفشل
  } catch (error) {
    console.error("Error handling payment failed:", error)
  }
}
