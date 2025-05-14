"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle, TeslaCardDescription } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"

// مكون محتوى الصفحة
function ConfirmEmailContent() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // طباعة معلومات التصحيح
        console.log("URL:", window.location.href);
        console.log("Search params:", Object.fromEntries(searchParams.entries()));
        console.log("Hash:", window.location.hash);

        // الحصول على رمز التأكيد من معلمات البحث أو من الهاش
        let token = searchParams.get("token") || null;
        let type = searchParams.get("type") || "signup";
        let redirectTo = searchParams.get("redirect_to") || null;
        
        // التحقق من وجود رمز الخطأ في URL
        let error = searchParams.get("error") || null;
        let error_code = searchParams.get("error_code") || null;
        let error_description = searchParams.get("error_description") || null;
        
        // إذا لم يتم العثور على المعلمات في searchParams، نحاول استخراجها من الهاش
        if (window.location.hash) {
          console.log("Trying to extract parameters from hash:", window.location.hash);
          
          // تنظيف الهاش
          const hashString = window.location.hash.startsWith('#') 
            ? window.location.hash.substring(1) 
            : window.location.hash;
            
          // محاولة استخراج المعلمات من الهاش
          try {
            // محاولة تحليل الهاش كـ JSON
            const hashData = JSON.parse(decodeURIComponent(hashString));
            console.log("Hash parsed as JSON:", hashData);
            
            // استخراج المعلمات من كائن JSON
            token = token || hashData.token;
            type = type || hashData.type || "signup";
            redirectTo = redirectTo || hashData.redirectTo;
            error = error || hashData.error;
            error_code = error_code || hashData.error_code;
            error_description = error_description || hashData.error_description;
          } catch (jsonError) {
            console.log("Failed to parse hash as JSON, trying URLSearchParams");
            // إذا فشل تحليل JSON، نحاول استخدام URLSearchParams
            try {
              const hashParams = new URLSearchParams(hashString);
              console.log("Hash parsed as URLSearchParams:", Object.fromEntries(hashParams.entries()));
              
              token = token || hashParams.get("token");
              type = type || hashParams.get("type") || "signup";
              redirectTo = redirectTo || hashParams.get("redirect_to");
              error = error || hashParams.get("error");
              error_code = error_code || hashParams.get("error_code");
              error_description = error_description || hashParams.get("error_description");
            } catch (urlError) {
              console.error("Error parsing hash as URLSearchParams:", urlError);
            }
          }
        }
        
        // طباعة المعلمات المستخرجة
        console.log("Extracted parameters:", { token, type, redirectTo, error, error_code, error_description });

        // إذا كان هناك خطأ في URL، نعرضه للمستخدم
        if (error) {
          console.error("Error in URL:", { error, error_code, error_description });
          setErrorMessage(error_description || error || t.emailConfirmationFailed || "فشل تأكيد البريد الإلكتروني");
          setIsLoading(false);
          return;
        }

        // إذا لم يكن هناك رمز تأكيد، نحاول استخراجه من URL كاملة
        if (!token) {
          // محاولة استخراج الرمز من URL كاملة
          const urlString = window.location.href;
          console.log("Trying to extract token from full URL:", urlString);
          
          // محاولة استخراج الرمز من URL باستخدام تعبير منتظم
          const tokenRegex = /[?&#]token=([^&]+)/;
          const tokenMatch = urlString.match(tokenRegex);
          
          if (tokenMatch && tokenMatch[1]) {
            token = tokenMatch[1];
            console.log("Extracted token using regex:", token);
          } else {
            // محاولة استخراج الرمز من المسار
            const urlObj = new URL(urlString);
            const pathSegments = urlObj.pathname.split('/');
            
            // التحقق من وجود رمز في المسار
            for (let i = 0; i < pathSegments.length; i++) {
              const segment = pathSegments[i];
              if (segment && segment !== 'confirm' && segment !== 'auth' && segment.length > 10) {
                token = segment;
                console.log("Extracted token from URL path segment:", token);
                break;
              }
            }
            
            // إذا لم يتم العثور على الرمز في المسار، نحاول استخراجه من الرابط كاملًا
            if (!token) {
              // محاولة استخراج الرمز من الرابط كاملًا باستخدام تعبير منتظم آخر
              const fullUrlTokenRegex = /\/confirm\/([^/?&#]+)/;
              const fullUrlTokenMatch = urlString.match(fullUrlTokenRegex);
              
              if (fullUrlTokenMatch && fullUrlTokenMatch[1]) {
                token = fullUrlTokenMatch[1];
                console.log("Extracted token from full URL path:", token);
              }
            }
          }
        }

        // إذا لم يكن هناك رمز تأكيد، نعرض رسالة خطأ
        if (!token) {
          setErrorMessage(t.tokenRequired || "رمز التأكيد مطلوب");
          setIsLoading(false);
          return;
        }

        // تحديد نوع التأكيد المناسب
        let verifyType: 'email' | 'recovery' | 'signup' = 'signup';
        
        if (type === 'recovery') {
          verifyType = 'recovery';
        } else if (type === 'email' || type === 'signup') {
          verifyType = 'signup';
        }
        
        console.log("Verifying token with type:", verifyType);

        try {
          // تأكيد البريد الإلكتروني باستخدام Supabase
          const { error: resultError } = await supabase.auth.verifyOtp({
            token,
            type: verifyType,
          });
          
          if (resultError) {
            console.error("Error verifying token:", resultError);
            
            // التحقق من حالة المستخدم الحالي
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user && user.email_confirmed_at) {
              // إذا كان البريد الإلكتروني مؤكدًا بالفعل، نعتبر العملية ناجحة
              console.log("Email already confirmed:", user.email_confirmed_at);
              setIsSuccess(true);
              
              toast({
                title: t.emailConfirmed || "تم تأكيد البريد الإلكتروني",
                description: t.emailConfirmedDesc || "تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.",
              });
            } else {
              // إذا لم يكن البريد الإلكتروني مؤكدًا، نعرض رسالة الخطأ
              throw resultError;
            }
          } else {
            // تأكيد البريد الإلكتروني بنجاح
            console.log("Email confirmed successfully!");
            setIsSuccess(true);
            
            toast({
              title: t.emailConfirmed || "تم تأكيد البريد الإلكتروني",
              description: t.emailConfirmedDesc || "تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.",
            });
          }
        } catch (verifyError) {
          console.error("Error in verifyOtp:", verifyError);
          
          // محاولة تسجيل الدخول للتحقق من حالة البريد الإلكتروني
          try {
            // محاولة تسجيل الدخول باستخدام البريد الإلكتروني من الرابط
            const emailFromToken = await extractEmailFromToken(token);
            
            if (emailFromToken) {
              console.log("Extracted email from token:", emailFromToken);
              
              // التحقق من حالة البريد الإلكتروني باستخدام API
              const response = await fetch('/api/auth/check-user-exists', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailFromToken }),
              });
              
              const data = await response.json();
              console.log("Check user exists response:", data);
              
              if (data.exists && data.emailConfirmed) {
                // إذا كان البريد الإلكتروني مؤكدًا بالفعل، نعتبر العملية ناجحة
                console.log("Email already confirmed according to API");
                setIsSuccess(true);
                
                toast({
                  title: t.emailConfirmed || "تم تأكيد البريد الإلكتروني",
                  description: t.emailConfirmedDesc || "تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.",
                });
              } else {
                // إذا لم يكن البريد الإلكتروني مؤكدًا، نعرض رسالة الخطأ
                throw new Error("Email not confirmed");
              }
            } else {
              throw new Error("Could not extract email from token");
            }
          } catch (fallbackError) {
            console.error("Fallback error:", fallbackError);
            throw verifyError;
          }
        }
        
        setIsLoading(false);
        
        // إعادة توجيه المستخدم بعد تأخير
        if (isSuccess) {
          setTimeout(() => {
            // إعادة التوجيه إلى صفحة تسجيل الدخول
            if (redirectTo) {
              try {
                const decodedRedirect = decodeURIComponent(redirectTo);
                const shouldRefresh = decodedRedirect.includes("/admin/subscription");
                
                if (shouldRefresh) {
                  const separator = decodedRedirect.includes("?") ? "&" : "?";
                  window.location.href = `${decodedRedirect}${separator}refresh=true`;
                } else {
                  window.location.href = decodedRedirect;
                }
              } catch (error) {
                console.error("Error redirecting after email confirmation:", error);
                window.location.href = "/auth/login";
              }
            } else {
              window.location.href = "/auth/login";
            }
          }, 3000);
        }
      } catch (error: any) {
        console.error("Error confirming email:", error);
        
        setErrorMessage(error.message || t.emailConfirmationFailed || "فشل تأكيد البريد الإلكتروني. يرجى المحاولة مرة أخرى.");
        
        toast({
          title: t.error || "خطأ",
          description: error.message || t.emailConfirmationFailed || "فشل تأكيد البريد الإلكتروني. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // دالة لاستخراج البريد الإلكتروني من الرمز
    const extractEmailFromToken = async (token: string): Promise<string | null> => {
      try {
        // محاولة استخراج البريد الإلكتروني من الرمز باستخدام JWT
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload.email) {
            return payload.email;
          }
        }
        
        return null;
      } catch (error) {
        console.error("Error extracting email from token:", error);
        return null;
      }
    };
    
    confirmEmail();
  }, [searchParams, router, t, toast, isSuccess]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link href="/">
          <TeslaButton variant="secondary" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome || "العودة إلى الصفحة الرئيسية"}
          </TeslaButton>
        </Link>
        <AppLogo size={40} />
      </div>

      <TeslaCard className="max-w-md mx-auto">
        <TeslaCardHeader className="text-center">
          {isLoading ? (
            <div className="flex justify-center mb-4">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            </div>
          ) : isSuccess ? (
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          ) : (
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
          )}

          <TeslaCardTitle className="text-2xl">
            {isLoading
              ? t.confirmingEmail || "جاري تأكيد البريد الإلكتروني..."
              : isSuccess
              ? t.emailConfirmed || "تم تأكيد البريد الإلكتروني"
              : t.emailConfirmationFailed || "فشل تأكيد البريد الإلكتروني"
            }
          </TeslaCardTitle>

          <TeslaCardDescription>
            {isLoading
              ? t.pleaseWait || "يرجى الانتظار بينما نتحقق من بريدك الإلكتروني..."
              : isSuccess
              ? t.emailConfirmedDesc || "تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول."
              : errorMessage || t.emailConfirmationFailedDesc || "حدث خطأ أثناء تأكيد بريدك الإلكتروني. يرجى المحاولة مرة أخرى."
            }
          </TeslaCardDescription>
        </TeslaCardHeader>

        <TeslaCardContent className="flex justify-center">
          {!isLoading && (
            <Link href={isSuccess ? "/auth/login" : "/auth/register"}>
              <TeslaButton>
                {isSuccess
                  ? t.login || "تسجيل الدخول"
                  : t.tryAgain || "المحاولة مرة أخرى"
                }
              </TeslaButton>
            </Link>
          )}
        </TeslaCardContent>

        <TeslaCardFooter className="text-center text-sm text-muted-foreground">
          {isSuccess
            ? t.emailConfirmedFooter || "شكرًا لتأكيد بريدك الإلكتروني. يمكنك الآن الاستمتاع بجميع ميزات التطبيق."
            : t.emailConfirmationFailedFooter || "إذا استمرت المشكلة، يرجى الاتصال بفريق الدعم."
          }
        </TeslaCardFooter>
      </TeslaCard>
    </div>
  );
}

// مكون الصفحة الرئيسي
export default function ConfirmEmailPage() {
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Suspense fallback={
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="animate-pulse">جاري التحميل...</div>
        </div>
      }>
        <ConfirmEmailContent />
      </Suspense>
    </div>
  );
}
