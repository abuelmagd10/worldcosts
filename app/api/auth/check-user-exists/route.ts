import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// إنشاء عميل Supabase باستخدام مفتاح الخدمة
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

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

    // استخراج البريد الإلكتروني من الطلب
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // البحث عن المستخدم في Supabase
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email
      }
    })

    if (error) {
      console.error("Error checking user existence:", error)
      
      // في حالة حدوث خطأ، نحاول طريقة أخرى
      try {
        // محاولة تسجيل الدخول باستخدام OTP بدون إنشاء مستخدم جديد
        const { error: signInError } = await supabaseAdmin.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false,
          },
        });

        // إذا كان الخطأ يشير إلى أن المستخدم غير موجود
        if (signInError && signInError.message.includes('user not found')) {
          return NextResponse.json({ exists: false });
        }

        // إذا لم يكن هناك خطأ أو كان الخطأ لسبب آخر، نفترض أن المستخدم موجود
        return NextResponse.json({ exists: true });
      } catch (fallbackError) {
        console.error('Fallback error checking user existence:', fallbackError);
        return NextResponse.json(
          { error: 'حدث خطأ أثناء التحقق من وجود المستخدم' },
          { status: 500 }
        );
      }
    }

    // التحقق من وجود المستخدم
    const userExists = data.users.length > 0
    const emailConfirmed = userExists ? data.users[0].email_confirmed_at !== null : false

    return NextResponse.json({
      exists: userExists,
      emailConfirmed: emailConfirmed
    })
  } catch (error: any) {
    console.error("Error checking user existence:", error)
    return NextResponse.json(
      { error: "Failed to check user existence", details: error.message },
      { status: 500 }
    )
  }
}
