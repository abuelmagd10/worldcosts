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
`;

// وظيفة إنشاء الجداول
const createTables = async (supabaseAdmin: any) => {
  try {
    const { error } = await supabaseAdmin
      .from('_postgres')
      .select('*')
      .eq('query', CREATE_TABLES_SQL)
      .single();

    if (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to create tables:', error);
    throw error;
  }
};

// وظيفة إعداد سياسات الأمان
const setupPolicies = async (supabaseAdmin: any) => {
  try {
    const { error } = await supabaseAdmin
      .from('_postgres')
      .select('*')
      .eq('query', SETUP_POLICIES_SQL)
      .single();

    if (error) {
      console.warn('Policy setup warning:', error);
      // نستمر حتى لو كانت هناك أخطاء، لأن بعض السياسات قد تكون موجودة بالفعل
    }
  } catch (error) {
    console.warn('Failed to setup policies:', error);
    // نستمر حتى لو كانت هناك أخطاء
  }
};

// وظيفة POST الرئيسية
export async function POST() {
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

    return NextResponse.json({
      message: "تم إعداد قاعدة البيانات بنجاح"
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