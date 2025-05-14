import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// إنشاء عميل Supabase باستخدام مفتاح الخدمة
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
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

    // الحصول على إعدادات SMTP الحالية
    const { data: currentSettings, error: getError } = await supabaseAdmin.rpc('get_smtp_settings')

    if (getError) {
      return NextResponse.json(
        { error: "Failed to get SMTP settings", details: getError.message },
        { status: 500 }
      )
    }

    // عرض الإعدادات الحالية
    return NextResponse.json({
      message: "Current SMTP settings",
      settings: currentSettings
    })
  } catch (error: any) {
    console.error("Error getting SMTP settings:", error)
    return NextResponse.json(
      { error: "Failed to get SMTP settings", details: error.message },
      { status: 500 }
    )
  }
}

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

    // تحديث إعدادات SMTP
    const { data, error } = await supabaseAdmin.rpc('update_smtp_settings', {
      sender_email: 'info@worldcosts.com',
      sender_name: 'World Costs',
      host: 'smtpout.secureserver.net',
      port: 465, // استخدام الأرقام الإنجليزية
      username: 'info@worldcosts.com',
      password: request.headers.get('smtp-password') || undefined,
      min_interval_seconds: 60 // استخدام الأرقام الإنجليزية
    })

    if (error) {
      return NextResponse.json(
        { error: "Failed to update SMTP settings", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "SMTP settings updated successfully",
      success: true
    })
  } catch (error: any) {
    console.error("Error updating SMTP settings:", error)
    return NextResponse.json(
      { error: "Failed to update SMTP settings", details: error.message },
      { status: 500 }
    )
  }
}
