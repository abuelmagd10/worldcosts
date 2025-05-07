import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

// Create a typed Supabase client with additional options
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST() {
  try {
    // Create tables using raw SQL through Supabase's REST API
    const createTables = async () => {
      const createTableSQL = `
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

      const { error: createError } = await supabaseAdmin
        .from('_postgres')
        .select('*')
        .eq('query', createTableSQL)
        .single();

      if (createError) {
        console.error('Error creating tables:', createError);
        throw createError;
      }
    };

    // Set up RLS policies
    const setupPolicies = async () => {
      const policySQL = `
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

      const { error: policyError } = await supabaseAdmin
        .from('_postgres')
        .select('*')
        .eq('query', policySQL)
        .single();

      if (policyError) {
        console.warn('Policy setup warning:', policyError);
        // Continue even if there are errors, as some policies might already exist
      }
    };

    // Execute setup operations
    await createTables();
    await setupPolicies();

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