import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { PADDLE_API_KEY } from "@/lib/paddle/config"

export async function GET(request: Request) {
  try {
    // إنشاء عميل Supabase
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

    // الحصول على معرف الجلسة من معلمات البحث
    const url = new URL(request.url)
    const session_id = url.searchParams.get("session_id")

    if (!session_id) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      )
    }

    // جلب تفاصيل الجلسة من Paddle
    const paddleApiUrl = `https://api.paddle.com/v2/transactions/${session_id}`
    
    const response = await fetch(paddleApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PADDLE_API_KEY}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Paddle API error:", errorData)
      return NextResponse.json(
        { error: "Failed to fetch checkout details" },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log("Paddle checkout details:", data)

    // استخراج المعلومات المهمة من استجابة Paddle
    const checkoutDetails = {
      session_id: session_id,
      subscription_id: data.data?.subscription_id || null,
      customer_id: data.data?.customer_id || null,
      plan_id: data.data?.items?.[0]?.price?.product_id || null,
      plan_name: data.data?.items?.[0]?.price?.product_name || "Premium Plan",
      billing_cycle: data.data?.items?.[0]?.price?.billing_cycle === "month" ? "monthly" : "yearly",
      status: data.data?.status || "active",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      amount: data.data?.items?.[0]?.price?.unit_price?.amount || 0,
      currency: data.data?.items?.[0]?.price?.unit_price?.currency_code || "USD"
    }

    return NextResponse.json(checkoutDetails)
  } catch (error: any) {
    console.error("Error fetching checkout details:", error)
    return NextResponse.json(
      { error: "Failed to fetch checkout details", details: error.message },
      { status: 500 }
    )
  }
}
