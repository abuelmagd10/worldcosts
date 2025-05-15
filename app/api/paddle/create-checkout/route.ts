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

    try {
      // استخدام Paddle API لإنشاء جلسة دفع

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
      console.log("Price ID received:", priceId);
      console.log("API Key being used:", apiKey);

      // إعداد بيانات الطلب لـ Paddle API
      // استخدام واجهة برمجة التطبيقات الصحيحة لـ Paddle Billing v2
      // تحديث عنوان API حسب توثيق Paddle الحالي
      const paddleApiUrl = 'https://api.paddle.com/transactions'

      // إعداد بيانات الطلب بتنسيق JSON
      const requestData = {
        items: [
          {
            price_id: priceId,
            quantity: 1
          }
        ],
        customer_id: userId,
        custom_data: {
          userId: userId,
          planId: planId,
          planName: planName,
          billingCycle: billingCycle
        },
        customer: {
          email: userEmail,
          name: userEmail.split('@')[0]
        },
        success_url: successUrl,
        cancel_url: cancelUrl
      }

      console.log("Request data prepared for Paddle API");

      // للتشخيص، نطبع بعض القيم من البيانات
      console.log("Vendor ID:", '01jv7k0rhqaajrsgcbc8fnkade');
      console.log("Price ID:", priceId);
      console.log("Customer Email:", userEmail);
      console.log("Success URL:", successUrl);
      console.log("Cancel URL:", cancelUrl);

      // إرسال الطلب إلى Paddle API
      let response
      try {
        console.log("Sending request to Paddle API...");
        console.log("Request data:", JSON.stringify(requestData, null, 2));

        // استخدام JSON بدلاً من FormData
        response = await fetch(paddleApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(requestData)
        })

        console.log("Paddle API response status:", response.status);
      } catch (fetchError: any) {
        console.error("Network error calling Paddle API:", fetchError);
        console.error("Fetch error details:", fetchError);
        return NextResponse.json(
          { error: "Network error connecting to payment provider", details: fetchError.message },
          { status: 500 }
        )
      }

      // التحقق من استجابة Paddle
      let data

      try {
        // محاولة قراءة الاستجابة كـ JSON
        const responseText = await response.text()
        console.log("Paddle API response text:", responseText)

        try {
          // محاولة تحليل النص كـ JSON
          data = JSON.parse(responseText)
          console.log("Paddle API response parsed:", data)
        } catch (parseError) {
          console.error("Error parsing Paddle API response:", parseError)
          console.error("Response text:", responseText)

          // إذا كان النص يحتوي على "success" و "redirect"، فقد يكون بتنسيق مختلف
          if (responseText.includes("success") && responseText.includes("redirect")) {
            // محاولة استخراج رابط إعادة التوجيه من النص
            const match = responseText.match(/redirect\"\s*:\s*\"([^\"]+)/)
            if (match && match[1]) {
              console.log("Extracted redirect URL from response:", match[1])
              return NextResponse.json({
                checkoutUrl: match[1]
              })
            }
          }

          return NextResponse.json(
            { error: "Invalid response from payment provider", responseText },
            { status: 500 }
          )
        }

        // التحقق من نجاح الاستجابة حسب تنسيق Paddle Billing v2
        if (data.error) {
          console.error("Paddle API error:", data)
          return NextResponse.json(
            { error: data.error.message || "Error creating checkout session" },
            { status: 400 }
          )
        }

        // التحقق من وجود معرف المعاملة في الاستجابة
        if (data.data && data.data.id) {
          const transactionId = data.data.id
          console.log("Paddle transaction ID:", transactionId)

          // إنشاء رابط الدفع باستخدام معرف المعاملة
          const checkoutUrl = `https://checkout.paddle.com/checkout/${transactionId}`
          console.log("Paddle checkout URL:", checkoutUrl)

          return NextResponse.json({
            checkoutUrl: checkoutUrl
          })
        } else {
          console.error("Paddle API response missing transaction ID:", data)
          return NextResponse.json(
            { error: "Invalid response from payment provider", response: data },
            { status: 500 }
          )
        }
      } catch (responseError: any) {
        console.error("Error reading Paddle API response:", responseError)
        return NextResponse.json(
          { error: "Error processing payment provider response", details: responseError.message },
          { status: 500 }
        )
      }
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
