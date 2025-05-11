import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// الحصول على متغيرات البيئة
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// التحقق من وجود متغيرات البيئة في بيئة العميل
if (typeof window !== 'undefined') {
  if (!supabaseUrl) {
    console.error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!supabaseAnonKey) {
    console.error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

// إنشاء عميل Supabase للاستخدام في جانب العميل
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Supabase fetch error:', err);
        throw err;
      });
    }
  }
});

// إنشاء عميل Supabase
export function createClient(cookieStore?: any) {
  // استخدام عميل Supabase العادي بغض النظر عن وجود ملفات تعريف الارتباط
  return supabase;
}