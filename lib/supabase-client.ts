import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// الحصول على متغيرات البيئة
// استخدام قيم ثابتة في حالة عدم وجود متغيرات البيئة (للتطوير المحلي فقط)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mhrgktbewfojpspigkkg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocmdrdGJld2ZvanBzcGlna2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5MTkxMTksImV4cCI6MjA2MTQ5NTExOX0.wICHI0l0EjqY5RHjTtMEV2edlVSO_U3bFbZsg_gHhGI';

// التحقق من وجود متغيرات البيئة في بيئة العميل
if (typeof window !== 'undefined') {
  if (!supabaseUrl) {
    console.error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
  }

  if (!supabaseAnonKey) {
    console.error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // طباعة معلومات التكوين للتصحيح (سيتم إزالتها في الإنتاج)
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Configured' : 'Missing');
}

// إنشاء عميل Supabase للاستخدام في جانب العميل
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'worldcosts-auth', // مفتاح تخزين محدد لتجنب التداخل مع التطبيقات الأخرى
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