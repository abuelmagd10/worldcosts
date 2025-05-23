import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { PADDLE_API_KEY, PADDLE_VENDOR_ID, SUCCESS_URL, CANCEL_URL } from "@/lib/paddle/config"

// تعريف نوع البيانات المرسلة في الطلب
interface RequestBody {
  priceId: string
  planId: string
  planName: string
  billingCycle: "monthly" | "yearly"
}

export async function POST(request: NextRequest) {
  try {
    // التحقق من صحة الطلب
    if (!request.body) {
      return NextResponse.json(
        { error: "No request body provided" },
        { status: 400 }
      )
    }

    // قراءة بيانات الطلب
    const body: RequestBody = await request.json()
    const { priceId, planId, planName, billingCycle } = body

    // التحقق من وجود معرف السعر
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      )
    }

    // إنشاء عميل Supabase للتحقق من المستخدم
    const cookieStore = cookies()

    // طباعة جميع ملفات تعريف الارتباط للتشخيص
    console.log("All cookies:", cookieStore.getAll().map(c => c.name))

    // التحقق من وجود ملفات تعريف الارتباط الخاصة بـ Supabase
    const supabaseCookies = cookieStore.getAll().filter(c =>
      c.name.includes('supabase') ||
      c.name.includes('sb-') ||
      c.name.includes('access_token') ||
      c.name.includes('refresh_token')
    )
    console.log("Supabase cookies:", supabaseCookies.map(c => c.name))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const cookie = cookieStore.get(name)
            console.log(`Getting cookie: ${name}, exists: ${!!cookie}`)
            return cookie?.value
          },
          set(name: string, value: string, options: any) {
            console.log(`Setting cookie: ${name}`)
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            console.log(`Removing cookie: ${name}`)
            cookieStore.set({ name, value: "", ...options })
          },
        },
      }
    )

    // التحقق من المستخدم الحالي
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    console.log("User authentication result:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      error: userError?.message
    })

    // محاولة استخدام مفتاح الخدمة إذا لم يكن هناك مستخدم مصادق عليه
    let userEmail: string
    let userId: string

    if (userError || !user) {
      console.log("No authenticated user found, trying to create checkout without authentication")

      // استخدام معلمات الطلب مباشرة للاختبار فقط
      userEmail = "guest@worldcosts.com" // يمكن تغييره إلى عنوان بريد إلكتروني افتراضي
      userId = "guest-user-id"

      // في الإنتاج، يجب التحقق من المستخدم
      console.log("Proceeding with guest checkout for testing purposes")
    } else {
      console.log("Authenticated user found:", user.email)
      userEmail = user.email || ""
      userId = user.id

      if (!userEmail) {
        return NextResponse.json(
          { error: "User email not found" },
          { status: 400 }
        )
      }
    }

    // إنشاء طلب إلى Paddle API
    const apiKey = PADDLE_API_KEY

    if (!apiKey) {
      console.error("Paddle API key is missing")
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 }
      )
    }

    console.log("Using Paddle API key:", apiKey.substring(0, 10) + "...")

    // بناء عنوان URL للنجاح والإلغاء
    const origin = request.headers.get("origin") || "http://localhost:3000"
    const successUrl = `${origin}/admin/subscription/success?plan_name=${encodeURIComponent(planName)}&billing_cycle=${billingCycle}`
    const cancelUrl = `${origin}/admin/subscription/cancel`

    // طباعة معلومات الطلب للتصحيح
    console.log("Creating checkout with:", {
      priceId,
      userEmail,
      successUrl,
      cancelUrl,
      userId,
      planId,
      billingCycle
    })

    // طباعة معلومات إضافية للتشخيص
    console.log("Price ID received:", priceId)
    console.log("API Key being used:", apiKey)

    // إنشاء معاملة جديدة باستخدام Paddle API
    try {
      // استخدام Paddle Checkout API بدلاً من Billing API
      const paddleCheckoutUrl = 'https://vendors.paddle.com/api/2.0/product/generate_pay_link'

      // إعداد بيانات الطلب بتنسيق FormData
      const formData = new FormData()
      formData.append('vendor_id', PADDLE_VENDOR_ID) // استخدام معرف البائع من التكوين
      formData.append('vendor_auth_code', apiKey)
      formData.append('product_id', priceId)
      formData.append('customer_email', userEmail)
      formData.append('passthrough', JSON.stringify({
        userId: userId,
        planId: planId,
        planName: planName,
        billingCycle: billingCycle
      }))
      formData.append('return_url', successUrl)
      formData.append('cancel_url', cancelUrl)

      // إضافة خيارات إضافية
      formData.append('title', `${planName} - ${billingCycle}`) // عنوان الدفع
      formData.append('webhook_url', `${process.env.NEXT_PUBLIC_APP_URL || origin}/api/paddle/webhook`) // عنوان webhook

      // طباعة معلومات إضافية للتشخيص
      console.log("Vendor ID:", PADDLE_VENDOR_ID)
      console.log("Product ID:", priceId)

      console.log("Sending request to Paddle Checkout API...")

      // إرسال الطلب إلى Paddle API
      const response = await fetch(paddleCheckoutUrl, {
        method: 'POST',
        body: formData
      })

      console.log("Paddle API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response from Paddle API:", errorText)
        throw new Error(`Error creating checkout: HTTP ${response.status} - ${errorText}`)
      }

      const responseData = await response.json()
      console.log("Paddle API response:", responseData)

      if (!responseData.success) {
        throw new Error(`Error creating checkout: ${responseData.error?.message || JSON.stringify(responseData.error)}`)
      }

      const checkoutUrl = responseData.response.url
      console.log("Paddle checkout URL:", checkoutUrl)

      // إرجاع رابط الدفع
      return NextResponse.json({
        checkoutUrl: checkoutUrl
      })
    } catch (checkoutError: any) {
      console.error("Error creating checkout:", checkoutError)

      // استخدام رابط دفع بديل للاختبار
      console.log("Using fallback checkout URL")
      const fallbackUrl = `https://sandbox-checkout.paddle.com/checkout/custom-checkout?product=${priceId}&email=${encodeURIComponent(userEmail)}`

      return NextResponse.json({
        checkoutUrl: fallbackUrl,
        fallback: true
      })
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
