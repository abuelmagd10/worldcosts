import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

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

// إنشاء عميل Supabase مع دعم ملفات تعريف الارتباط
export function createClient(cookieStore?: ReadonlyRequestCookies) {
  if (cookieStore) {
    // إنشاء عميل للاستخدام في جانب الخادم مع ملفات تعريف الارتباط
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // لا يمكن تعيين ملفات تعريف الارتباط في جانب الخادم
          },
          remove(name: string, options: CookieOptions) {
            // لا يمكن إزالة ملفات تعريف الارتباط في جانب الخادم
          },
        },
      }
    );
  }

  // إنشاء عميل للاستخدام في جانب العميل
  return supabase;
}