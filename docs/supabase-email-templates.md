# قوالب البريد الإلكتروني في Supabase

هذا الملف يحتوي على قوالب البريد الإلكتروني المخصصة لاستخدامها في Supabase. يمكنك نسخ هذه القوالب واستخدامها في لوحة تحكم Supabase.

## كيفية تخصيص قوالب البريد الإلكتروني

1. قم بتسجيل الدخول إلى [لوحة تحكم Supabase](https://app.supabase.io/)
2. اختر مشروعك
3. انتقل إلى **Authentication** > **Email Templates**
4. اختر القالب الذي تريد تخصيصه
5. انسخ محتوى القالب من هذا الملف والصقه في حقل القالب المناسب
6. انقر على **Save**

## قالب تأكيد البريد الإلكتروني

### الموضوع
```
تأكيد بريدك الإلكتروني في WorldCosts
```

### المحتوى
```html
<div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://worldcosts.vercel.app/logo.png" alt="WorldCosts Logo" style="width: 100px; height: auto;">
  </div>
  
  <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">تأكيد بريدك الإلكتروني</h1>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    مرحبًا،
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    شكرًا لتسجيلك في WorldCosts. يرجى تأكيد بريدك الإلكتروني بالنقر على الزر أدناه:
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">تأكيد البريد الإلكتروني</a>
  </div>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    أو يمكنك نسخ ولصق الرابط التالي في متصفحك:
  </p>
  
  <p style="color: #555555; font-size: 14px; line-height: 1.5; margin-bottom: 20px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
    {{ .ConfirmationURL }}
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    إذا لم تقم بإنشاء حساب، يرجى تجاهل هذا البريد الإلكتروني.
  </p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888888; font-size: 14px;">
    <p>WorldCosts - تطبيق إدارة التكاليف العالمية</p>
    <p>&copy; 2023 WorldCosts. جميع الحقوق محفوظة.</p>
  </div>
</div>
```

## قالب إعادة تعيين كلمة المرور

### الموضوع
```
إعادة تعيين كلمة المرور في WorldCosts
```

### المحتوى
```html
<div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://worldcosts.vercel.app/logo.png" alt="WorldCosts Logo" style="width: 100px; height: auto;">
  </div>
  
  <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">إعادة تعيين كلمة المرور</h1>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    مرحبًا،
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك. إذا كنت قد طلبت إعادة تعيين كلمة المرور، يرجى النقر على الزر أدناه:
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">إعادة تعيين كلمة المرور</a>
  </div>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    أو يمكنك نسخ ولصق الرابط التالي في متصفحك:
  </p>
  
  <p style="color: #555555; font-size: 14px; line-height: 1.5; margin-bottom: 20px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
    {{ .ConfirmationURL }}
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.
  </p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888888; font-size: 14px;">
    <p>WorldCosts - تطبيق إدارة التكاليف العالمية</p>
    <p>&copy; 2023 WorldCosts. جميع الحقوق محفوظة.</p>
  </div>
</div>
```

## قالب تغيير البريد الإلكتروني

### الموضوع
```
تأكيد تغيير البريد الإلكتروني في WorldCosts
```

### المحتوى
```html
<div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://worldcosts.vercel.app/logo.png" alt="WorldCosts Logo" style="width: 100px; height: auto;">
  </div>
  
  <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">تأكيد تغيير البريد الإلكتروني</h1>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    مرحبًا،
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    لقد تلقينا طلبًا لتغيير البريد الإلكتروني المرتبط بحسابك. إذا كنت قد طلبت هذا التغيير، يرجى النقر على الزر أدناه لتأكيد عنوان بريدك الإلكتروني الجديد:
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">تأكيد تغيير البريد الإلكتروني</a>
  </div>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    أو يمكنك نسخ ولصق الرابط التالي في متصفحك:
  </p>
  
  <p style="color: #555555; font-size: 14px; line-height: 1.5; margin-bottom: 20px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
    {{ .ConfirmationURL }}
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    إذا لم تطلب تغيير البريد الإلكتروني، يرجى تجاهل هذا البريد الإلكتروني وتأمين حسابك عن طريق تغيير كلمة المرور الخاصة بك.
  </p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888888; font-size: 14px;">
    <p>WorldCosts - تطبيق إدارة التكاليف العالمية</p>
    <p>&copy; 2023 WorldCosts. جميع الحقوق محفوظة.</p>
  </div>
</div>
```

## قالب رابط السحري (Magic Link)

### الموضوع
```
رابط تسجيل الدخول إلى WorldCosts
```

### المحتوى
```html
<div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://worldcosts.vercel.app/logo.png" alt="WorldCosts Logo" style="width: 100px; height: auto;">
  </div>
  
  <h1 style="color: #333333; font-size: 24px; margin-bottom: 20px; text-align: center;">رابط تسجيل الدخول</h1>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    مرحبًا،
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    لقد طلبت رابطًا للدخول إلى حسابك في WorldCosts. انقر على الزر أدناه لتسجيل الدخول:
  </p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">تسجيل الدخول</a>
  </div>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    أو يمكنك نسخ ولصق الرابط التالي في متصفحك:
  </p>
  
  <p style="color: #555555; font-size: 14px; line-height: 1.5; margin-bottom: 20px; word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px;">
    {{ .ConfirmationURL }}
  </p>
  
  <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
    إذا لم تطلب هذا الرابط، يرجى تجاهل هذا البريد الإلكتروني.
  </p>
  
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #888888; font-size: 14px;">
    <p>WorldCosts - تطبيق إدارة التكاليف العالمية</p>
    <p>&copy; 2023 WorldCosts. جميع الحقوق محفوظة.</p>
  </div>
</div>
```
