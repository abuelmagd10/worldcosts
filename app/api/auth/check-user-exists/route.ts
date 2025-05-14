import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// إنشاء عميل Supabase
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      return NextResponse.json(
        { error: "Failed to check user existence", details: error.message },
        { status: 500 }
      )
    }

    // التحقق من وجود المستخدم
    const userExists = data.users.length > 0

    return NextResponse.json({
      exists: userExists,
      emailConfirmed: userExists ? data.users[0].email_confirmed_at !== null : false
    })
  } catch (error: any) {
    console.error("Error checking user existence:", error)
    return NextResponse.json(
      { error: "Failed to check user existence", details: error.message },
      { status: 500 }
    )
  }
}
