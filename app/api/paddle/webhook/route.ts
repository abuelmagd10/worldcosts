import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { PADDLE_API_KEY } from "@/lib/paddle/config"

// إنشاء عميل Supabase باستخدام مفتاح الخدمة
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// هذا هو المفتاح السري للتحقق من صحة الأحداث الواردة من Paddle
const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  try {
    // التحقق من وجود متغيرات البيئة المطلوبة
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL is not defined" },
        { status: 500 }
      )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: "SUPABASE_SERVICE_ROLE_KEY is not defined",
          message: "Please add SUPABASE_SERVICE_ROLE_KEY to your environment variables"
        },
        { status: 500 }
      )
    }

    // قراءة بيانات الطلب
    const body = await request.text()
    const signature = request.headers.get("paddle-signature") || ""

    // التحقق من صحة التوقيع (في بيئة الإنتاج)
    // في بيئة التطوير، يمكن تخطي هذه الخطوة
    if (process.env.NODE_ENV === 'production' && webhookSecret) {
      // هنا يجب إضافة كود للتحقق من صحة التوقيع
      // باستخدام مكتبة مثل crypto
    }

    // تحليل بيانات الطلب
    let event
    try {
      event = JSON.parse(body)
    } catch (error) {
      console.error("Error parsing webhook body:", error)
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      )
    }

    // التحقق من نوع الحدث
    const eventType = event.event_type
    if (!eventType) {
      console.error("Missing event type:", event)
      return NextResponse.json(
        { error: "Missing event type" },
        { status: 400 }
      )
    }

    console.log(`Processing Paddle webhook: ${eventType}`)

    // معالجة الأحداث المختلفة
    switch (eventType) {
      case "subscription.created":
        await handleSubscriptionCreated(event.data)
        break
      case "subscription.updated":
        await handleSubscriptionUpdated(event.data)
        break
      case "subscription.canceled":
        await handleSubscriptionCanceled(event.data)
        break
      case "subscription.payment.succeeded":
        await handlePaymentSucceeded(event.data)
        break
      case "subscription.payment.failed":
        await handlePaymentFailed(event.data)
        break
      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// معالجة حدث إنشاء اشتراك جديد
async function handleSubscriptionCreated(data: any) {
  try {
    console.log("Subscription created:", data)

    // استخراج البيانات المهمة
    const subscriptionId = data.id
    const customerId = data.customer.id
    const customerEmail = data.customer.email
    const status = data.status
    const currentPeriodStart = data.current_billing_period?.starts_at
    const currentPeriodEnd = data.current_billing_period?.ends_at
    const planId = data.items[0]?.price.product_id
    const planName = data.items[0]?.price.product_name
    const billingCycle = data.items[0]?.price.billing_cycle === 'month' ? 'monthly' : 'yearly'
    const customData = data.custom_data || {}

    // الحصول على معرف المستخدم من البيانات المخصصة أو البحث عنه باستخدام البريد الإلكتروني
    let userId = customData.userId

    if (!userId && customerEmail) {
      // البحث عن المستخدم باستخدام البريد الإلكتروني
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers({
        filter: {
          email: customerEmail
        }
      })

      if (userError) {
        throw userError
      }

      if (userData.users.length > 0) {
        userId = userData.users[0].id
      }
    }

    if (!userId) {
      throw new Error("User not found")
    }

    // حفظ معلومات الاشتراك في قاعدة البيانات
    const { data: subscription, error } = await supabaseAdmin
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        subscription_id: subscriptionId,
        customer_id: customerId,
        plan_id: planId,
        plan_name: planName,
        billing_cycle: billingCycle,
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end: false,
        metadata: data
      }, {
        onConflict: "user_id,subscription_id",
        returning: "representation"
      })

    if (error) {
      throw error
    }

    console.log("Subscription saved:", subscription)
  } catch (error) {
    console.error("Error handling subscription created:", error)
    throw error
  }
}

// معالجة حدث تحديث اشتراك
async function handleSubscriptionUpdated(data: any) {
  try {
    console.log("Subscription updated:", data)

    // استخراج البيانات المهمة
    const subscriptionId = data.id
    const status = data.status
    const currentPeriodStart = data.current_billing_period?.starts_at
    const currentPeriodEnd = data.current_billing_period?.ends_at
    const cancelAtPeriodEnd = data.scheduled_change?.action === "cancel"

    // تحديث معلومات الاشتراك في قاعدة البيانات
    const { data: subscription, error } = await supabaseAdmin
      .from("user_subscriptions")
      .update({
        status,
        current_period_start,
        current_period_end,
        cancel_at_period_end: cancelAtPeriodEnd,
        updated_at: new Date().toISOString(),
        metadata: data
      })
      .eq("subscription_id", subscriptionId)
      .select()

    if (error) {
      throw error
    }

    console.log("Subscription updated:", subscription)
  } catch (error) {
    console.error("Error handling subscription updated:", error)
    throw error
  }
}

// معالجة حدث إلغاء اشتراك
async function handleSubscriptionCanceled(data: any) {
  try {
    console.log("Subscription canceled:", data)

    // استخراج البيانات المهمة
    const subscriptionId = data.id

    // تحديث معلومات الاشتراك في قاعدة البيانات
    const { data: subscription, error } = await supabaseAdmin
      .from("user_subscriptions")
      .update({
        status: "canceled",
        cancel_at_period_end: true,
        updated_at: new Date().toISOString(),
        metadata: data
      })
      .eq("subscription_id", subscriptionId)
      .select()

    if (error) {
      throw error
    }

    console.log("Subscription canceled:", subscription)
  } catch (error) {
    console.error("Error handling subscription canceled:", error)
    throw error
  }
}

// معالجة حدث نجاح الدفع
async function handlePaymentSucceeded(data: any) {
  // يمكن إضافة منطق إضافي هنا مثل إرسال بريد إلكتروني للتأكيد
  console.log("Payment succeeded:", data)
}

// معالجة حدث فشل الدفع
async function handlePaymentFailed(data: any) {
  // يمكن إضافة منطق إضافي هنا مثل إرسال بريد إلكتروني للإشعار بالفشل
  console.log("Payment failed:", data)
}
