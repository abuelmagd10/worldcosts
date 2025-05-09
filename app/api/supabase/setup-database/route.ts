import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// إنشاء عميل Supabase باستخدام مفتاح الخدمة
// ملاحظة: يجب استخدام مفتاح الخدمة فقط في بيئة الخادم وليس في العميل
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
)

export async function GET() {
  try {
    // التحقق من وجود مفتاح الخدمة
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY is not defined" },
        { status: 500 }
      )
    }

    // إنشاء جدول لتخزين معلومات الاشتراكات
    const { error: subscriptionsError } = await supabaseAdmin.rpc("create_table_if_not_exists", {
      table_name: "user_subscriptions",
      table_definition: `
        user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        plan_id TEXT,
        plan_name TEXT,
        price_id TEXT,
        billing_cycle TEXT,
        status TEXT,
        current_period_start BIGINT,
        current_period_end BIGINT,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      `
    })

    if (subscriptionsError) {
      console.error("Error creating user_subscriptions table:", subscriptionsError)
      return NextResponse.json(
        { error: "Failed to create user_subscriptions table", details: subscriptionsError },
        { status: 500 }
      )
    }

    // إنشاء سياسات أمان للجدول
    const { error: policyError } = await supabaseAdmin.rpc("create_policy_if_not_exists", {
      table_name: "user_subscriptions",
      policy_name: "Users can view their own subscriptions",
      policy_definition: `
        FOR SELECT
        TO authenticated
        USING (auth.uid() = user_id)
      `
    })

    if (policyError) {
      console.error("Error creating policy:", policyError)
      return NextResponse.json(
        { error: "Failed to create policy", details: policyError },
        { status: 500 }
      )
    }

    // إنشاء جدول لتخزين معلومات تأكيد البريد الإلكتروني
    const { error: confirmationsError } = await supabaseAdmin.rpc("create_table_if_not_exists", {
      table_name: "email_confirmations",
      table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        confirmation_token TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        confirmed_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      `
    })

    if (confirmationsError) {
      console.error("Error creating email_confirmations table:", confirmationsError)
      return NextResponse.json(
        { error: "Failed to create email_confirmations table", details: confirmationsError },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      { error: "Failed to setup database", details: error },
      { status: 500 }
    )
  }
}
