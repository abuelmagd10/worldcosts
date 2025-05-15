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
const getSupabaseAdmin = async () => {
  const missingVars = checkEnvVars();

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  console.log("Creating Supabase admin client with URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

  // إنشاء عميل Supabase مع الإعدادات المناسبة
  const supabaseAdmin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );

  // التحقق من صحة الاتصال
  try {
    console.log("Testing Supabase connection...");
    const { data, error } = await supabaseAdmin.from('_rpc').select('*').limit(1);

    if (error) {
      console.error("Error testing Supabase connection:", error);
      throw new Error(`Failed to connect to Supabase: ${error.message}`);
    }

    console.log("Supabase connection successful");
    return supabaseAdmin;
  } catch (error) {
    console.error("Error testing Supabase connection:", error);

    // محاولة طريقة بديلة للتحقق من الاتصال
    try {
      console.log("Testing Supabase connection using auth.getUser()...");
      const { data, error } = await supabaseAdmin.auth.getUser();

      if (error) {
        console.error("Error testing Supabase connection using auth.getUser():", error);
        throw new Error(`Failed to connect to Supabase using auth.getUser(): ${error.message}`);
      }

      console.log("Supabase connection successful using auth.getUser()");
      return supabaseAdmin;
    } catch (authError) {
      console.error("Error testing Supabase connection using auth.getUser():", authError);

      // إذا فشلت جميع المحاولات، نعيد عميل Supabase على أي حال
      console.warn("Returning Supabase client despite connection test failures");
      return supabaseAdmin;
    }
  }
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
    console.log("Attempting to create tables using rpc method...");
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: CREATE_TABLES_SQL });

    if (error) {
      console.error('Error creating tables using rpc method:', error);

      // محاولة استخدام طريقة بديلة
      console.log("Attempting to create tables using _exec_sql method...");
      try {
        const { error: error2 } = await supabaseAdmin
          .from('_exec_sql')
          .select('*')
          .eq('query', CREATE_TABLES_SQL)
          .single();

        if (error2) {
          console.error('Error creating tables using _exec_sql method:', error2);

          // محاولة استخدام طريقة ثالثة - تنفيذ استعلامات SQL منفصلة
          console.log("Attempting to create tables using direct SQL queries...");

          // إنشاء جدول user_subscriptions
          console.log("Creating user_subscriptions table...");
          const createUserSubscriptionsResult = await supabaseAdmin.from('user_subscriptions').select('count').limit(1).catch(async () => {
            // إذا فشل الاستعلام، فهذا يعني أن الجدول غير موجود، لذا نقوم بإنشائه
            const createTableSQL = `
              CREATE TABLE IF NOT EXISTS user_subscriptions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
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

            // محاولة إنشاء الجدول باستخدام rpc
            const { error: createError } = await supabaseAdmin.rpc('exec_sql', { sql: createTableSQL }).catch(() => {
              return { error: new Error('Failed to create user_subscriptions table') };
            });

            if (createError) {
              console.error('Error creating user_subscriptions table:', createError);
            } else {
              console.log('user_subscriptions table created successfully');
            }

            return { error: null };
          });

          // إنشاء جدول subscriptions
          console.log("Creating subscriptions table...");
          const createSubscriptionsResult = await supabaseAdmin.from('subscriptions').select('count').limit(1).catch(async () => {
            // إذا فشل الاستعلام، فهذا يعني أن الجدول غير موجود، لذا نقوم بإنشائه
            const createTableSQL = `
              CREATE TABLE IF NOT EXISTS subscriptions (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID NOT NULL,
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

            // محاولة إنشاء الجدول باستخدام rpc
            const { error: createError } = await supabaseAdmin.rpc('exec_sql', { sql: createTableSQL }).catch(() => {
              return { error: new Error('Failed to create subscriptions table') };
            });

            if (createError) {
              console.error('Error creating subscriptions table:', createError);
            } else {
              console.log('subscriptions table created successfully');
            }

            return { error: null };
          });
        }
      } catch (error2) {
        console.error('Failed to create tables (alternative method):', error2);
      }
    } else {
      console.log('Tables created successfully using rpc method');
    }
  } catch (error) {
    console.error('Failed to create tables:', error);
  }
};

// وظيفة إعداد سياسات الأمان
const setupPolicies = async (supabaseAdmin: any) => {
  try {
    // استخدام rpc لتنفيذ استعلامات SQL مباشرة
    console.log("Attempting to setup policies using rpc method...");
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: SETUP_POLICIES_SQL });

    if (error) {
      console.warn('Policy setup warning using rpc method:', error);

      // محاولة استخدام طريقة بديلة
      console.log("Attempting to setup policies using _exec_sql method...");
      try {
        const { error: error2 } = await supabaseAdmin
          .from('_exec_sql')
          .select('*')
          .eq('query', SETUP_POLICIES_SQL)
          .single();

        if (error2) {
          console.warn('Policy setup warning using _exec_sql method:', error2);

          // محاولة استخدام طريقة ثالثة - تنفيذ استعلامات SQL منفصلة
          console.log("Attempting to setup policies using direct SQL queries...");

          // تمكين RLS على جدول user_subscriptions
          console.log("Enabling RLS on user_subscriptions table...");
          await supabaseAdmin.rpc('exec_sql', {
            sql: "ALTER TABLE IF EXISTS user_subscriptions ENABLE ROW LEVEL SECURITY;"
          }).catch(err => {
            console.warn('Error enabling RLS on user_subscriptions:', err);
          });

          // إنشاء سياسة للقراءة على جدول user_subscriptions
          console.log("Creating read policy for user_subscriptions table...");
          await supabaseAdmin.rpc('exec_sql', {
            sql: `
              DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;
              CREATE POLICY "Users can view their own subscriptions"
                ON user_subscriptions
                FOR SELECT
                USING (auth.uid() = user_id);
            `
          }).catch(err => {
            console.warn('Error creating read policy for user_subscriptions:', err);
          });

          // إنشاء سياسة للإدارة على جدول user_subscriptions
          console.log("Creating management policy for user_subscriptions table...");
          await supabaseAdmin.rpc('exec_sql', {
            sql: `
              DROP POLICY IF EXISTS "Service role can manage subscriptions" ON user_subscriptions;
              CREATE POLICY "Service role can manage subscriptions"
                ON user_subscriptions
                USING (true)
                WITH CHECK (true);
            `
          }).catch(err => {
            console.warn('Error creating management policy for user_subscriptions:', err);
          });

          // تمكين RLS على جدول subscriptions
          console.log("Enabling RLS on subscriptions table...");
          await supabaseAdmin.rpc('exec_sql', {
            sql: "ALTER TABLE IF EXISTS subscriptions ENABLE ROW LEVEL SECURITY;"
          }).catch(err => {
            console.warn('Error enabling RLS on subscriptions:', err);
          });

          // إنشاء سياسة للقراءة على جدول subscriptions
          console.log("Creating read policy for subscriptions table...");
          await supabaseAdmin.rpc('exec_sql', {
            sql: `
              DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;
              CREATE POLICY "Users can view their own subscriptions"
                ON subscriptions
                FOR SELECT
                USING (auth.uid() = user_id);
            `
          }).catch(err => {
            console.warn('Error creating read policy for subscriptions:', err);
          });

          // إنشاء سياسة للإدارة على جدول subscriptions
          console.log("Creating management policy for subscriptions table...");
          await supabaseAdmin.rpc('exec_sql', {
            sql: `
              DROP POLICY IF EXISTS "Service role can manage subscriptions" ON subscriptions;
              CREATE POLICY "Service role can manage subscriptions"
                ON subscriptions
                USING (true)
                WITH CHECK (true);
            `
          }).catch(err => {
            console.warn('Error creating management policy for subscriptions:', err);
          });
        }
      } catch (error2) {
        console.warn('Failed to setup policies (alternative method):', error2);
        // نستمر حتى لو كانت هناك أخطاء
      }
    } else {
      console.log('Policies setup successfully using rpc method');
    }
  } catch (error) {
    console.warn('Failed to setup policies:', error);
    // نستمر حتى لو كانت هناك أخطاء
  }
};

// وظيفة مشتركة لإعداد قاعدة البيانات
async function setupDatabase() {
  try {
    console.log("Starting database setup...");

    // التحقق من متغيرات البيئة
    const missingVars = checkEnvVars();
    if (missingVars.length > 0) {
      console.error("Missing environment variables:", missingVars);
      return NextResponse.json(
        {
          error: "Missing environment variables",
          details: `Required environment variables are missing: ${missingVars.join(', ')}`
        },
        { status: 500 }
      );
    }

    console.log("Environment variables check passed");

    // إنشاء عميل Supabase
    console.log("Getting Supabase admin client...");
    const supabaseAdmin = await getSupabaseAdmin();

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

    // تحسين معالجة الأخطاء لعرض المزيد من التفاصيل
    let errorMessage = "Unknown error";
    let errorDetails = null;

    if (error instanceof Error) {
      errorMessage = error.message;

      // محاولة استخراج المزيد من التفاصيل
      if ('cause' in error) {
        errorDetails = JSON.stringify(error.cause);
      }

      // محاولة استخراج تتبع المكدس
      if ('stack' in error) {
        console.error("Error stack:", error.stack);
      }
    } else if (typeof error === 'object' && error !== null) {
      // محاولة تحويل الكائن إلى سلسلة نصية
      try {
        errorMessage = JSON.stringify(error);
      } catch (e) {
        errorMessage = "Error object could not be stringified";
      }
    }

    return NextResponse.json(
      {
        error: "Failed to setup database",
        details: errorMessage,
        errorDetails: errorDetails,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      { status: 500 }
    );
  }
}

// وظيفة POST الرئيسية
export async function POST() {
  return setupDatabase();
}

// وظيفة GET الرئيسية
export async function GET(request: Request) {
  // التحقق من وجود معلمة test في URL
  const url = new URL(request.url);
  const testMode = url.searchParams.get('test');

  if (testMode === 'connection') {
    // اختبار الاتصال بـ Supabase فقط
    try {
      console.log("Testing Supabase connection...");

      // التحقق من متغيرات البيئة
      const missingVars = checkEnvVars();
      if (missingVars.length > 0) {
        console.error("Missing environment variables:", missingVars);
        return NextResponse.json(
          {
            error: "Missing environment variables",
            details: `Required environment variables are missing: ${missingVars.join(', ')}`
          },
          { status: 500 }
        );
      }

      console.log("Environment variables check passed");
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("Has Service Role Key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

      // إنشاء عميل Supabase
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );

      // اختبار الاتصال باستخدام عدة طرق
      const results = {
        envVars: {
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        },
        tests: {
          auth: { success: false, error: null },
          tables: { success: false, error: null },
          rpc: { success: false, error: null }
        }
      };

      // اختبار Auth
      try {
        console.log("Testing Auth connection...");
        const { data, error } = await supabaseAdmin.auth.getUser();

        if (error) {
          console.error("Error testing Auth connection:", error);
          results.tests.auth.error = error.message;
        } else {
          console.log("Auth connection successful");
          results.tests.auth.success = true;
        }
      } catch (error: any) {
        console.error("Error testing Auth connection:", error);
        results.tests.auth.error = error.message || "Unknown error";
      }

      // اختبار الجداول
      try {
        console.log("Testing tables connection...");
        const { data, error } = await supabaseAdmin.from('_rpc').select('*').limit(1);

        if (error) {
          console.error("Error testing tables connection:", error);
          results.tests.tables.error = error.message;
        } else {
          console.log("Tables connection successful");
          results.tests.tables.success = true;
        }
      } catch (error: any) {
        console.error("Error testing tables connection:", error);
        results.tests.tables.error = error.message || "Unknown error";
      }

      // اختبار RPC
      try {
        console.log("Testing RPC connection...");
        const { data, error } = await supabaseAdmin.rpc('get_service_role');

        if (error) {
          console.error("Error testing RPC connection:", error);
          results.tests.rpc.error = error.message;
        } else {
          console.log("RPC connection successful");
          results.tests.rpc.success = true;
        }
      } catch (error: any) {
        console.error("Error testing RPC connection:", error);
        results.tests.rpc.error = error.message || "Unknown error";
      }

      return NextResponse.json(results);
    } catch (error: any) {
      console.error("Error testing Supabase connection:", error);
      return NextResponse.json(
        {
          error: "Failed to test Supabase connection",
          details: error.message || "Unknown error",
          stack: error.stack
        },
        { status: 500 }
      );
    }
  } else if (testMode === 'info') {
    // إرجاع معلومات حول البيئة
    return NextResponse.json({
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
        region: process.env.VERCEL_REGION
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      },
      system: {
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
  }

  // إذا لم يتم تحديد وضع الاختبار، قم بإعداد قاعدة البيانات
  return setupDatabase();
}