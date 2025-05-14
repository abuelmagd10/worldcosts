import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// الحصول على اشتراكات المستخدم الحالي
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

    // الحصول على اشتراكات المستخدم
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (subscriptionsError) {
      console.error("Error fetching subscriptions:", subscriptionsError)
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      )
    }

    // التحقق من وجود اشتراك نشط
    const activeSubscription = subscriptions.find(sub => 
      (sub.status === "active" || sub.status === "trialing") && 
      new Date(sub.current_period_end) > new Date()
    )

    return NextResponse.json({
      subscriptions,
      activeSubscription,
      hasActiveSubscription: !!activeSubscription
    })
  } catch (error: any) {
    console.error("Error in subscriptions API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// إنشاء أو تحديث اشتراك
export async function POST(request: Request) {
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

    // استخراج بيانات الاشتراك من الطلب
    const subscriptionData = await request.json()

    // التحقق من وجود البيانات المطلوبة
    if (!subscriptionData.subscription_id || !subscriptionData.plan_id || !subscriptionData.plan_name || !subscriptionData.status) {
      return NextResponse.json(
        { error: "Missing required subscription data" },
        { status: 400 }
      )
    }

    // إضافة معرف المستخدم إلى بيانات الاشتراك
    subscriptionData.user_id = user.id

    // إنشاء أو تحديث الاشتراك في قاعدة البيانات
    const { data, error } = await supabase
      .from("user_subscriptions")
      .upsert(subscriptionData, {
        onConflict: "user_id,subscription_id",
        returning: "representation"
      })

    if (error) {
      console.error("Error saving subscription:", error)
      return NextResponse.json(
        { error: "Failed to save subscription" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Subscription saved successfully",
      subscription: data[0]
    })
  } catch (error: any) {
    console.error("Error in subscriptions API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
