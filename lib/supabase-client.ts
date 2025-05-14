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
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Anon Key:', supabaseAnonKey ? 'Configured' : 'Missing');
  }
}

// تكوين خيارات Supabase
const supabaseOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'worldcosts-auth', // مفتاح تخزين محدد لتجنب التداخل مع التطبيقات الأخرى
    detectSessionInUrl: true, // اكتشاف جلسة في URL تلقائيًا
    flowType: 'pkce', // استخدام PKCE لتحسين الأمان
    debug: process.env.NODE_ENV === 'development', // تمكين وضع التصحيح في بيئة التطوير فقط
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Supabase fetch error:', err);
        throw err;
      });
    }
  },
  // تكوين إعادة المحاولة لتحسين الاتصال في حالة فشل الشبكة
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  }
};

// إنشاء عميل Supabase للاستخدام في جانب العميل
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// وظيفة للتحقق من وجود المستخدم
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.admin.listUsers({
      filter: {
        email: email
      }
    });

    if (error) {
      console.error('Error checking user existence:', error);
      // في حالة حدوث خطأ، نحاول طريقة أخرى
      const { data: signInData, error: signInError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false
        }
      });

      if (signInError) {
        // إذا كان الخطأ يشير إلى أن المستخدم غير موجود
        if (signInError.message.includes('user not found')) {
          return false;
        }
        // إذا كان الخطأ لسبب آخر، نفترض أن المستخدم موجود
        return true;
      }

      // إذا نجحت العملية، فهذا يعني أن المستخدم موجود
      return true;
    }

    // التحقق من وجود مستخدمين في البيانات
    return data && data.users && data.users.length > 0;
  } catch (error) {
    console.error('Unexpected error checking user existence:', error);
    // في حالة حدوث خطأ غير متوقع، نفترض أن المستخدم غير موجود
    return false;
  }
}

// إنشاء عميل Supabase
export function createClient(cookieStore?: any) {
  // استخدام عميل Supabase العادي بغض النظر عن وجود ملفات تعريف الارتباط
  return supabase;
}
