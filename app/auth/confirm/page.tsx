"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardDescription, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"

// مكون لعرض محتوى الصفحة مع استخدام useSearchParams
function ConfirmEmailContent() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // الحصول على رمز التأكيد من معلمات البحث أو من الهاش
        let token = searchParams.get("token")
        let type = searchParams.get("type") || "signup"
        let redirectTo = searchParams.get("redirect_to") || null

        // التحقق من وجود رمز الخطأ في URL
        let error = searchParams.get("error")
        let error_code = searchParams.get("error_code")
        let error_description = searchParams.get("error_description")

        // إذا لم يتم العثور على المعلمات في searchParams، نحاول استخراجها من الهاش
        if ((!token || !type) && window.location.hash) {
          console.log("Trying to extract parameters from hash:", window.location.hash)
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          token = hashParams.get("token") || token
          type = hashParams.get("type") || type
          redirectTo = hashParams.get("redirect_to") || redirectTo
          error = hashParams.get("error") || error
          error_code = hashParams.get("error_code") || error_code
          error_description = hashParams.get("error_description") || error_description

          console.log("Extracted from hash:", { token, type, redirectTo, error, error_code, error_description })
        }

        // إذا كان هناك معلمات في URL ولكن ليس في الهاش، نقوم بتحديث الهاش
        if (token && !window.location.hash.includes("token")) {
          // إنشاء هاش جديد بالمعلمات
          const newHash = new URLSearchParams()
          if (token) newHash.set("token", token)
          if (type) newHash.set("type", type)
          if (redirectTo) newHash.set("redirect_to", redirectTo)

          // تحديث الهاش في URL
          window.location.hash = newHash.toString()

          // إعادة تحميل الصفحة للتأكد من استخدام المعلمات الجديدة
          return
        }

        // إذا كان هناك خطأ في URL، نعرضه للمستخدم
        if (error) {
          console.error("Error in URL:", { error, error_code, error_description })
          setErrorMessage(error_description || error || t.emailConfirmationFailed || "فشل تأكيد البريد الإلكتروني")
          setIsLoading(false)
          return
        }

        if (!token) {
          setErrorMessage(t.tokenRequired || "رمز التأكيد مطلوب")
          setIsLoading(false)
          return
        }

        // تأكيد البريد الإلكتروني باستخدام Supabase
        let result

        if (type === "recovery") {
          // إعادة تعيين كلمة المرور
          result = await supabase.auth.verifyOtp({
            token,
            type: "recovery",
          })
        } else {
          // تأكيد البريد الإلكتروني
          result = await supabase.auth.verifyOtp({
            token,
            type: "email",
          })
        }

        const { error: resultError } = result

        if (resultError) {
          throw resultError
        }

        setIsSuccess(true)
        setIsLoading(false)

        // عرض رسالة نجاح
        toast({
          title: t.emailConfirmed || "تم تأكيد البريد الإلكتروني",
          description: t.emailConfirmedDesc || "تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.",
        })

        // إنشاء مكون لعرض رسالة النجاح
        const SuccessDialog = () => (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg max-w-md w-full">
              <div className="flex flex-col items-center justify-center mb-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">{t.emailConfirmed || "تم تأكيد البريد الإلكتروني بنجاح!"}</h3>
                <p className="text-center mb-4">
                  {t.emailConfirmedDesc || "تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول إلى حسابك."}
                </p>
              </div>
              <div className="flex justify-center">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    document.getElementById('success-dialog')?.remove();
                  }}
                >
                  {t.login || "تسجيل الدخول"}
                </button>
              </div>
            </div>
          </div>
        );

        // إضافة مكون النجاح إلى الصفحة
        const dialogContainer = document.createElement('div');
        dialogContainer.id = 'success-dialog';
        document.body.appendChild(dialogContainer);

        // استخدام ReactDOM.render لعرض المكون
        const ReactDOM = require('react-dom');
        ReactDOM.render(<SuccessDialog />, dialogContainer);

        // استخدام متغير redirectTo الذي تم تعريفه سابقًا

        // تحديث زر تسجيل الدخول في مكون النجاح
        const loginButton = document.querySelector('#success-dialog button');
        if (loginButton) {
          loginButton.addEventListener('click', () => {
            // إذا كان نوع التأكيد هو إعادة تعيين كلمة المرور، توجيه المستخدم إلى صفحة إعادة تعيين كلمة المرور
            if (type === "recovery") {
              router.push("/auth/reset-password");
            }
            // إذا كان هناك URL إعادة توجيه محدد
            else if (redirectTo) {
              try {
                // فك تشفير URL الإعادة التوجيه
                const decodedRedirect = decodeURIComponent(redirectTo);

                // التحقق مما إذا كان URL الإعادة التوجيه يحتوي على صفحة الاشتراك
                const shouldRefresh = decodedRedirect.includes("/admin/subscription");

                if (shouldRefresh) {
                  // إضافة معلمة refresh=true إلى URL
                  const separator = decodedRedirect.includes("?") ? "&" : "?";
                  window.location.href = `${decodedRedirect}${separator}refresh=true`;
                } else {
                  router.push(decodedRedirect);
                }
              } catch (error) {
                console.error("Error redirecting after email confirmation:", error);
                // في حالة حدوث خطأ، نوجه المستخدم إلى صفحة تسجيل الدخول
                router.push("/auth/login");
              }
            } else {
              // إذا لم يكن هناك URL إعادة توجيه، نوجه المستخدم إلى صفحة تسجيل الدخول
              router.push("/auth/login");
            }
          });
        }

        // إعادة توجيه المستخدم بعد تأخير
        setTimeout(() => {
          // إزالة مكون النجاح
          document.getElementById('success-dialog')?.remove();

          // إذا كان نوع التأكيد هو إعادة تعيين كلمة المرور، توجيه المستخدم إلى صفحة إعادة تعيين كلمة المرور
          if (type === "recovery") {
            router.push("/auth/reset-password");
          }
          // إذا كان هناك URL إعادة توجيه محدد
          else if (redirectTo) {
            try {
              // فك تشفير URL الإعادة التوجيه
              const decodedRedirect = decodeURIComponent(redirectTo);

              // التحقق مما إذا كان URL الإعادة التوجيه يحتوي على صفحة الاشتراك
              const shouldRefresh = decodedRedirect.includes("/admin/subscription");

              if (shouldRefresh) {
                // إضافة معلمة refresh=true إلى URL
                const separator = decodedRedirect.includes("?") ? "&" : "?";
                window.location.href = `${decodedRedirect}${separator}refresh=true`;
              } else {
                router.push(decodedRedirect);
              }
            } catch (error) {
              console.error("Error redirecting after email confirmation:", error);
              // في حالة حدوث خطأ، نوجه المستخدم إلى صفحة تسجيل الدخول
              router.push("/auth/login");
            }
          } else {
            // إذا لم يكن هناك URL إعادة توجيه، نوجه المستخدم إلى صفحة تسجيل الدخول
            router.push("/auth/login");
          }
        }, 5000);
      } catch (error: any) {
        console.error("Error confirming email:", error)

        setErrorMessage(error.message || t.emailConfirmationFailed || "فشل تأكيد البريد الإلكتروني. يرجى المحاولة مرة أخرى.")

        toast({
          title: t.error || "خطأ",
          description: error.message || t.emailConfirmationFailed || "فشل تأكيد البريد الإلكتروني. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, router, t, toast])

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
  )
}

// مكون الصفحة الرئيسي
export default function ConfirmEmailPage() {
  const { dir } = useLanguage()

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
  )
}
