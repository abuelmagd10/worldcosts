import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

// تجنب أي أخطاء أثناء عملية البناء
// لا نستخدم متغيرات البيئة مباشرة في المستوى العلوي للملف

// دالة مساعدة للتحقق من وجود متغيرات البيئة
const checkEnvVars = () => {
  const missingVars = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missingVars.push('SUPABASE_SERVICE_ROLE_KEY');
  }

  return missingVars;
};

// إنشاء عميل Supabase
const getSupabaseAdmin = () => {
  const missingVars = checkEnvVars();

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  // إنشاء عميل Supabase مع الإعدادات المناسبة
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
};

// تعريف SQL لإنشاء الجداول
const CREATE_TABLES_SQL = `
  -- Create company_info table
  CREATE TABLE IF NOT EXISTS company_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    name TEXT,
    address TEXT,
    phone TEXT,
    logo_url TEXT,
    pdf_file_name TEXT
  );

  -- Create files table
  CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    public_url TEXT NOT NULL,
    supabase_path TEXT NOT NULL UNIQUE
  );

  -- Create user_subscriptions table
  CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(user_id, subscription_id)
  );

  -- Create subscriptions table (alternative table name)
  CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    billing_cycle TEXT NOT NULL,
    status TEXT NOT NULL,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    UNIQUE(user_id, subscription_id)
  );
`;

// تعريف SQL لإعداد سياسات الأمان
const SETUP_POLICIES_SQL = `
  -- Enable RLS on company_info
  ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;

  -- Set up company_info policies
  DROP POLICY IF EXISTS "anyone can read company_info" ON company_info;
  CREATE POLICY "anyone can read company_info" ON company_info FOR SELECT USING (true);

  DROP POLICY IF EXISTS "anyone can insert company_info" ON company_info;
  CREATE POLICY "anyone can insert company_info" ON company_info FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "anyone can update company_info" ON company_info;
  CREATE POLICY "anyone can update company_info" ON company_info FOR UPDATE USING (true) WITH CHECK (true);

  -- Enable RLS on files
  ALTER TABLE files ENABLE ROW LEVEL SECURITY;

  -- Set up files policies
  DROP POLICY IF EXISTS "anyone can read files" ON files;
  CREATE POLICY "anyone can read files" ON files FOR SELECT USING (true);

  DROP POLICY IF EXISTS "anyone can insert files" ON files;
  CREATE POLICY "anyone can insert files" ON files FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "anyone can delete files" ON files;
  CREATE POLICY "anyone can delete files" ON files FOR DELETE USING (true);

  -- Enable RLS on user_subscriptions
  ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

  -- Set up user_subscriptions policies
  DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
  CREATE POLICY "Users can view their own subscriptions"
    ON user_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Service role can manage subscriptions" ON user_subscriptions;
  CREATE POLICY "Service role can manage subscriptions"
    ON user_subscriptions
    USING (true)
    WITH CHECK (true);

  -- Enable RLS on subscriptions
  ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

  -- Set up subscriptions policies
  DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
  CREATE POLICY "Users can view their own subscriptions"
    ON subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
  CREATE POLICY "Service role can manage subscriptions"
    ON subscriptions
    USING (true)
    WITH CHECK (true);
`;

// وظيفة إنشاء الجداول
const createTables = async (supabaseAdmin: any) => {
  try {
    // استخدام rpc لتنفيذ استعلامات SQL مباشرة
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: CREATE_TABLES_SQL });

    if (error) {
      console.error('Error creating tables:', error);

      // محاولة استخدام طريقة بديلة
      try {
        const { error: error2 } = await supabaseAdmin
          .from('_exec_sql')
          .select('*')
          .eq('query', CREATE_TABLES_SQL)
          .single();

        if (error2) {
          console.error('Error creating tables (alternative method):', error2);
          throw error2;
        }
      } catch (error2) {
        console.error('Failed to create tables (alternative method):', error2);
        throw error2;
      }
    }
  } catch (error) {
    console.error('Failed to create tables:', error);
    throw error;
  }
};

// وظيفة إعداد سياسات الأمان
const setupPolicies = async (supabaseAdmin: any) => {
  try {
    // استخدام rpc لتنفيذ استعلامات SQL مباشرة
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: SETUP_POLICIES_SQL });

    if (error) {
      console.warn('Policy setup warning:', error);

      // محاولة استخدام طريقة بديلة
      try {
        const { error: error2 } = await supabaseAdmin
          .from('_exec_sql')
          .select('*')
          .eq('query', SETUP_POLICIES_SQL)
          .single();

        if (error2) {
          console.warn('Policy setup warning (alternative method):', error2);
          // نستمر حتى لو كانت هناك أخطاء، لأن بعض السياسات قد تكون موجودة بالفعل
        }
      } catch (error2) {
        console.warn('Failed to setup policies (alternative method):', error2);
        // نستمر حتى لو كانت هناك أخطاء
      }
    }
  } catch (error) {
    console.warn('Failed to setup policies:', error);
    // نستمر حتى لو كانت هناك أخطاء
  }
};

// وظيفة مشتركة لإعداد قاعدة البيانات
async function setupDatabase() {
  try {
    // التحقق من متغيرات البيئة
    const missingVars = checkEnvVars();
    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: `Required environment variables are missing: ${missingVars.join(', ')}`
        },
        { status: 500 }
      );
    }

    // إنشاء عميل Supabase
    const supabaseAdmin = getSupabaseAdmin();

    // تنفيذ عمليات الإعداد
    await createTables(supabaseAdmin);
    await setupPolicies(supabaseAdmin);

    // التحقق من وجود جدول user_subscriptions
    const { data: userSubscriptionsTable, error: checkUserSubscriptionsError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('id')
      .limit(1);

    if (checkUserSubscriptionsError) {
      console.warn('Warning checking user_subscriptions table:', checkUserSubscriptionsError);
    }

    // التحقق من وجود جدول subscriptions
    const { data: subscriptionsTable, error: checkSubscriptionsError } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .limit(1);

    if (checkSubscriptionsError) {
      console.warn('Warning checking subscriptions table:', checkSubscriptionsError);
    }

    return NextResponse.json({
      message: "تم إعداد قاعدة البيانات بنجاح",
      tables: {
        user_subscriptions: checkUserSubscriptionsError ? false : true,
        subscriptions: checkSubscriptionsError ? false : true
      }
    });
  } catch (error) {
    console.error("Error setting up database:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to setup database", details: errorMessage },
      { status: 500 }
    );
  }
}

// وظيفة POST الرئيسية
export async function POST() {
  return setupDatabase();
}

// وظيفة GET الرئيسية
export async function GET() {
  return setupDatabase();
}