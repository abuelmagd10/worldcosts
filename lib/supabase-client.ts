import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// التحقق من وجود متغيرات البيئة المطلوبة
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// إنشاء عميل Supabase للاستخدام في جانب العميل
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// إنشاء عميل Supabase
export function createClient(cookieStore?: any) {
  // استخدام عميل Supabase العادي بغض النظر عن وجود ملفات تعريف الارتباط
  return supabase;
}