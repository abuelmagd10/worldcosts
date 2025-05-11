import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET() {
  try {
    // محاولة إنشاء جدول user_subscriptions يدويًا
    const { error: manualCreateError } = await supabase.query(`
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
      CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);
      CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);
    `)

    if (manualCreateError) {
      console.error("Error manually creating user_subscriptions table:", manualCreateError)
      return NextResponse.json({ error: "Failed to create user_subscriptions table", details: manualCreateError }, { status: 500 })
    }

    // إنشاء سياسات RLS للجدول
    const { error: rlsPolicyError } = await supabase.query(`
      -- تمكين RLS على جدول الاشتراكات
      ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

      -- إنشاء سياسة للقراءة: يمكن للمستخدمين قراءة اشتراكاتهم فقط
      DROP POLICY IF EXISTS "Users can view their own user_subscriptions" ON user_subscriptions;
      CREATE POLICY "Users can view their own user_subscriptions"
        ON user_subscriptions FOR SELECT
        USING (auth.uid() = user_id);

      -- إنشاء سياسة للإدارة: يمكن للمسؤولين إدارة جميع الاشتراكات
      DROP POLICY IF EXISTS "Admins can manage all user_subscriptions" ON user_subscriptions;
      CREATE POLICY "Admins can manage all user_subscriptions"
        ON user_subscriptions
        USING (
          EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = auth.users.id AND auth.users.is_admin = true
          )
        );
    `)

    if (rlsPolicyError) {
      console.error("Error creating RLS policies for user_subscriptions:", rlsPolicyError)
      return NextResponse.json({ error: "Failed to create RLS policies for user_subscriptions", details: rlsPolicyError }, { status: 500 })
    }

    // إنشاء وظيفة للتحقق من حالة اشتراك المستخدم
    const { error: functionError } = await supabase.query(`
      CREATE OR REPLACE FUNCTION public.get_user_subscription_info(user_id_param UUID)
      RETURNS TABLE (
        plan_id TEXT,
        plan_name TEXT,
        billing_cycle TEXT,
        status TEXT,
        current_period_end BIGINT,
        is_active BOOLEAN
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY
        SELECT
          s.plan_id,
          s.plan_name,
          s.billing_cycle,
          s.status,
          s.current_period_end,
          (s.status = 'active' AND to_timestamp(s.current_period_end) > NOW()) AS is_active
        FROM
          user_subscriptions s
        WHERE
          s.user_id = user_id_param
        LIMIT 1;
      END;
      $$;
    `)

    if (functionError) {
      console.error("Error creating user subscription function:", functionError)
      return NextResponse.json({ error: "Failed to create user subscription function", details: functionError }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "User subscriptions table and policies created successfully" 
    })
  } catch (error) {
    console.error("Error setting up user_subscriptions table:", error)
    return NextResponse.json({ 
      error: "Failed to set up user_subscriptions table", 
      details: error 
    }, { status: 500 })
  }
}
