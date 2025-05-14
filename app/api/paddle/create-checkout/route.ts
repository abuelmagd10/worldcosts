import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { PADDLE_API_KEY, SUCCESS_URL, CANCEL_URL } from "@/lib/paddle/config"

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
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options })
          },
        },
      }
    )

    // التحقق من المستخدم الحالي
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // الحصول على معلومات المستخدم
    const userEmail = user.email

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      )
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

    try {
      // استخدام Paddle API لإنشاء جلسة دفع

      // طباعة معلومات الطلب للتصحيح
      console.log("Creating checkout with:", {
        priceId,
        userEmail,
        successUrl,
        cancelUrl,
        userId: user.id,
        planId,
        billingCycle
      })

      // إعداد بيانات الطلب لـ Paddle API
      // استخدام واجهة برمجة التطبيقات الصحيحة لـ Paddle
      const paddleApiUrl = 'https://api.paddle.com/v2/transactions/create'

      const requestData = {
        items: [
          {
            price_id: priceId,
            quantity: 1
          }
        ],
        customer_id: user.id,
        customer: {
          email: userEmail,
          name: user.user_metadata?.full_name || userEmail.split('@')[0]
        },
        custom_data: {
          userId: user.id,
          planId,
          planName,
          billingCycle
        },
        return_url: successUrl,
        cancel_url: cancelUrl,
        locale: 'ar'
      }

      // إرسال الطلب إلى Paddle API
      let response
      try {
        response = await fetch(paddleApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(requestData)
        })
      } catch (fetchError: any) {
        console.error("Network error calling Paddle API:", fetchError)
        return NextResponse.json(
          { error: "Network error connecting to payment provider" },
          { status: 500 }
        )
      }

      // التحقق من استجابة Paddle
      let errorData
      let data

      try {
        // محاولة قراءة الاستجابة كـ JSON
        const responseText = await response.text()

        try {
          // محاولة تحليل النص كـ JSON
          data = JSON.parse(responseText)
        } catch (parseError) {
          console.error("Error parsing Paddle API response:", parseError)
          console.error("Response text:", responseText)
          return NextResponse.json(
            { error: "Invalid response from payment provider" },
            { status: 500 }
          )
        }

        if (!response.ok) {
          errorData = data
          console.error("Paddle API error:", errorData)

          // التعامل مع أنواع الأخطاء المختلفة
          let errorMessage = "Error creating checkout session"

          if (errorData.error && errorData.error.type) {
            switch (errorData.error.type) {
              case "authentication_error":
                errorMessage = "Authentication error with payment provider"
                break
              case "invalid_request_error":
                errorMessage = "Invalid request to payment provider"
                break
              case "api_error":
                errorMessage = "Payment provider API error"
                break
              default:
                errorMessage = errorData.error.message || "Error creating checkout session"
            }
          }

          return NextResponse.json(
            { error: errorMessage },
            { status: response.status }
          )
        }
      } catch (responseError: any) {
        console.error("Error reading Paddle API response:", responseError)
        return NextResponse.json(
          { error: "Error processing payment provider response" },
          { status: 500 }
        )
      }

      console.log("Paddle API response:", data)

      // التحقق من وجود رابط الدفع في الاستجابة
      if (!data.data || !data.data.url) {
        console.error("Paddle API response missing checkout URL:", data)
        return NextResponse.json(
          { error: "Invalid response from payment provider" },
          { status: 500 }
        )
      }

      // إرجاع رابط الدفع
      return NextResponse.json({
        checkoutUrl: data.data.url
      })
    } catch (error: any) {
      console.error("Error calling Paddle API:", error)
      return NextResponse.json(
        { error: error.message || "Error creating checkout session" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
