import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// إنشاء عميل Supabase باستخدام مفتاح الخدمة
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    // استخراج البريد الإلكتروني وURL إعادة التوجيه من طلب POST
    const { email, redirectTo } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مطلوب' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم أولاً
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.listUsers({
      filter: {
        email: email,
      },
    });

    if (userError) {
      console.error('Error checking user existence:', userError);
      return NextResponse.json(
        { error: 'حدث خطأ أثناء التحقق من وجود المستخدم', details: userError.message },
        { status: 500 }
      );
    }

    // التحقق من وجود المستخدم
    const userExists = userData && userData.users && userData.users.length > 0;

    if (!userExists) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود', code: 'user_not_found' },
        { status: 404 }
      );
    }

    // التحقق مما إذا كان البريد الإلكتروني مؤكدًا بالفعل
    const user = userData.users[0];
    const isEmailConfirmed = user.email_confirmed_at !== null;

    if (isEmailConfirmed) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مؤكد بالفعل', code: 'email_already_confirmed' },
        { status: 400 }
      );
    }

    // إعداد URL إعادة التوجيه
    let emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL || 'https://worldcosts.com'}/auth/confirm`;
    
    if (redirectTo) {
      emailRedirectTo += `?redirect_to=${encodeURIComponent(redirectTo)}`;
    }

    // إعادة إرسال رابط تأكيد البريد الإلكتروني
    const { error: resendError } = await supabaseAdmin.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo,
      },
    });

    if (resendError) {
      console.error('Error resending confirmation email:', resendError);
      
      // التحقق من نوع الخطأ
      if (resendError.message.includes('For security purposes, you can only request this after')) {
        // استخراج عدد الثواني من رسالة الخطأ
        const secondsMatch = resendError.message.match(/after (\d+) seconds/);
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 60;
        
        return NextResponse.json(
          { 
            error: 'يرجى الانتظار قبل إعادة المحاولة', 
            code: 'cooldown_period',
            seconds: seconds 
          },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: 'حدث خطأ أثناء إعادة إرسال رابط التأكيد', details: resendError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in resend-confirmation API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع', details: error.message },
      { status: 500 }
    );
  }
}
