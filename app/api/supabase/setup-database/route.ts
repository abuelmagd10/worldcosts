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
    const { error: subscriptionsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
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
      );

      CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
    `)

    if (subscriptionsError) {
      console.error("Error creating user_subscriptions table:", subscriptionsError)
      return NextResponse.json(
        { error: "Failed to create user_subscriptions table", details: subscriptionsError },
        { status: 500 }
      )
    }

    // إنشاء سياسات أمان للجدول
    const { error: policyError } = await supabaseAdmin.query(`
      -- تمكين RLS على جدول الاشتراكات
      ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

      -- إنشاء سياسة للقراءة: يمكن للمستخدمين قراءة اشتراكاتهم فقط
      DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
      CREATE POLICY "Users can view their own subscriptions"
        ON user_subscriptions FOR SELECT
        USING (auth.uid() = user_id);
    `)

    if (policyError) {
      console.error("Error creating policy:", policyError)
      return NextResponse.json(
        { error: "Failed to create policy", details: policyError },
        { status: 500 }
      )
    }

    // إنشاء جدول لتخزين معلومات تأكيد البريد الإلكتروني
    const { error: confirmationsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS email_confirmations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        confirmation_token TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        confirmed_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_email_confirmations_user_id ON email_confirmations(user_id);
    `)

    if (confirmationsError) {
      console.error("Error creating email_confirmations table:", confirmationsError)
      return NextResponse.json(
        { error: "Failed to create email_confirmations table", details: confirmationsError },
        { status: 500 }
      )
    }

    // إنشاء جدول subscriptions أيضًا للتوافق مع الكود القديم
    const { error: oldSubscriptionsError } = await supabaseAdmin.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        plan_id TEXT,
        billing_cycle TEXT,
        status TEXT,
        current_period_end TIMESTAMP WITH TIME ZONE,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

      -- تمكين RLS على جدول الاشتراكات
      ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

      -- إنشاء سياسة للقراءة: يمكن للمستخدمين قراءة اشتراكاتهم فقط
      DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
      CREATE POLICY "Users can view their own subscriptions"
        ON subscriptions FOR SELECT
        USING (auth.uid() = user_id);
    `)

    if (oldSubscriptionsError) {
      console.error("Error creating subscriptions table:", oldSubscriptionsError)
      // لا نريد إيقاف العملية إذا فشل إنشاء هذا الجدول، لأنه للتوافق فقط
      console.log("Continuing despite error with subscriptions table")
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
