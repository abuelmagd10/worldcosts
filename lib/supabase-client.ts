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

// وظيفة للتحقق من وجود المستخدم في جانب العميل
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    // استخدام API للتحقق من وجود المستخدم بدلاً من استخدام admin API
    const response = await fetch('/api/auth/check-user-exists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error("Error checking user existence:", await response.text());
      
      // في حالة حدوث خطأ، نحاول طريقة أخرى
      try {
        // محاولة تسجيل الدخول باستخدام OTP بدون إنشاء مستخدم جديد
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false,
          },
        });

        // إذا كان الخطأ يشير إلى أن المستخدم غير موجود
        if (signInError && signInError.message.includes('user not found')) {
          return false;
        }

        // إذا لم يكن هناك خطأ أو كان الخطأ لسبب آخر، نفترض أن المستخدم موجود
        return true;
      } catch (fallbackError) {
        console.error('Fallback error checking user existence:', fallbackError);
        return false; // نفترض أن المستخدم غير موجود في حالة حدوث خطأ
      }
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Unexpected error checking user existence:', error);
    
    // في حالة حدوث خطأ غير متوقع، نحاول طريقة أخرى
    try {
      // محاولة تسجيل الدخول باستخدام OTP بدون إنشاء مستخدم جديد
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        },
      });

      // إذا كان الخطأ يشير إلى أن المستخدم غير موجود
      if (signInError && signInError.message.includes('user not found')) {
        return false;
      }

      // إذا لم يكن هناك خطأ أو كان الخطأ لسبب آخر، نفترض أن المستخدم موجود
      return true;
    } catch (fallbackError) {
      console.error('Fallback error checking user existence:', fallbackError);
      return false; // نفترض أن المستخدم غير موجود في حالة حدوث خطأ
    }
  }
}

// وظيفة لإعادة إرسال رابط تأكيد البريد الإلكتروني
export async function resendConfirmationEmail(email: string, redirectTo?: string): Promise<{ success: boolean; error?: any }> {
  try {
    // التحقق من وجود المستخدم أولاً
    const userExists = await checkUserExists(email);
    
    if (!userExists) {
      return { 
        success: false, 
        error: { 
          message: 'المستخدم غير موجود', 
          code: 'user_not_found' 
        } 
      };
    }
    
    // إعداد URL إعادة التوجيه
    let emailRedirectTo = `${window.location.origin}/auth/confirm`;
    
    if (redirectTo) {
      emailRedirectTo += `?redirect_to=${encodeURIComponent(redirectTo)}`;
    }
    
    // إعادة إرسال رابط تأكيد البريد الإلكتروني
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo,
      },
    });
    
    if (error) {
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    return { success: false, error };
  }
}

// إنشاء عميل Supabase
export function createClient(cookieStore?: any) {
  // استخدام عميل Supabase العادي بغض النظر عن وجود ملفات تعريف الارتباط
  return supabase;
}
