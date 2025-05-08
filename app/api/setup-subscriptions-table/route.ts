import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-client"

export async function GET() {
  try {
    // إنشاء عميل Supabase باستخدام مفتاح الخدمة
    const supabase = createClient()

    // إنشاء جدول الاشتراكات إذا لم يكن موجودًا
    const { error: createTableError } = await supabase.rpc('create_subscriptions_table')

    if (createTableError) {
      console.error("Error creating subscriptions table:", createTableError)
      
      // محاولة إنشاء الجدول يدويًا إذا لم تكن وظيفة RPC موجودة
      const { error: manualCreateError } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          stripe_customer_id TEXT NOT NULL,
          stripe_subscription_id TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          billing_cycle TEXT NOT NULL,
          status TEXT NOT NULL,
          current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
          cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
        CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
      `)
      
      if (manualCreateError) {
        console.error("Error manually creating subscriptions table:", manualCreateError)
        return NextResponse.json({ error: "Failed to create subscriptions table" }, { status: 500 })
      }
    }

    // إنشاء سياسات RLS للجدول
    const { error: rlsPolicyError } = await supabase.query(`
      -- تمكين RLS على جدول الاشتراكات
      ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
      
      -- إنشاء سياسة للقراءة: يمكن للمستخدمين قراءة اشتراكاتهم فقط
      DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
      CREATE POLICY "Users can view their own subscriptions" 
        ON subscriptions FOR SELECT 
        USING (auth.uid() = user_id);
      
      -- إنشاء سياسة للإدارة: يمكن للمسؤولين إدارة جميع الاشتراكات
      DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON subscriptions;
      CREATE POLICY "Admins can manage all subscriptions" 
        ON subscriptions 
        USING (
          EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = auth.users.id AND auth.users.is_admin = true
          )
        );
    `)
    
    if (rlsPolicyError) {
      console.error("Error creating RLS policies:", rlsPolicyError)
      return NextResponse.json({ error: "Failed to create RLS policies" }, { status: 500 })
    }

    // إنشاء وظيفة للتحقق من حالة اشتراك المستخدم
    const { error: functionError } = await supabase.query(`
      CREATE OR REPLACE FUNCTION public.get_user_subscription(user_id_param UUID)
      RETURNS TABLE (
        plan_id TEXT,
        billing_cycle TEXT,
        status TEXT,
        current_period_end TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN
      )
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          s.plan_id,
          s.billing_cycle,
          s.status,
          s.current_period_end,
          (s.status = 'active' AND s.current_period_end > NOW()) AS is_active
        FROM 
          subscriptions s
        WHERE 
          s.user_id = user_id_param
        ORDER BY 
          s.created_at DESC
        LIMIT 1;
      END;
      $$;
    `)
    
    if (functionError) {
      console.error("Error creating subscription function:", functionError)
      return NextResponse.json({ error: "Failed to create subscription function" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Subscriptions table and policies created successfully" })
  } catch (error) {
    console.error("Error setting up subscriptions table:", error)
    return NextResponse.json({ error: "Failed to set up subscriptions table" }, { status: 500 })
  }
}
