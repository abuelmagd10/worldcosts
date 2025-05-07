import { createClient } from "@supabase/supabase-js"

// احصل على عنوان URL ومفتاح anon من متغيرات البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// تحقق من وجود المتغيرات
if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// قم بإنشاء وتصدير عميل Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)