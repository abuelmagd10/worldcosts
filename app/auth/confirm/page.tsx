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
        // الحصول على رمز التأكيد من معلمات البحث
        const token = searchParams.get("token")
        const type = searchParams.get("type") || "signup"

        // التحقق من وجود رمز الخطأ في URL
        const error = searchParams.get("error")
        const error_code = searchParams.get("error_code")
        const error_description = searchParams.get("error_description")

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

        // عرض رسالة نجاح
        toast({
          title: t.emailConfirmed || "تم تأكيد البريد الإلكتروني",
          description: t.emailConfirmedDesc || "تم تأكيد بريدك الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.",
        })

        // التحقق من وجود معلمة redirect في URL
        const redirectTo = searchParams.get("redirect_to")

        // إذا كان نوع التأكيد هو إعادة تعيين كلمة المرور، توجيه المستخدم إلى صفحة إعادة تعيين كلمة المرور
        if (type === "recovery") {
          setTimeout(() => {
            router.push("/auth/reset-password")
          }, 3000)
        }
        // إذا كان هناك URL إعادة توجيه محدد
        else if (redirectTo) {
          try {
            // فك تشفير URL الإعادة التوجيه
            const decodedRedirect = decodeURIComponent(redirectTo)

            // التحقق مما إذا كان URL الإعادة التوجيه يحتوي على صفحة الاشتراك
            const shouldRefresh = decodedRedirect.includes("/admin/subscription")

            // إعادة توجيه المستخدم بعد تأخير قصير
            setTimeout(() => {
              if (shouldRefresh) {
                // إضافة معلمة refresh=true إلى URL
                const separator = decodedRedirect.includes("?") ? "&" : "?"
                window.location.href = `${decodedRedirect}${separator}refresh=true`
              } else {
                router.push(decodedRedirect)
              }
            }, 3000)
          } catch (error) {
            console.error("Error redirecting after email confirmation:", error)
            // في حالة حدوث خطأ، نوجه المستخدم إلى صفحة تسجيل الدخول
            setTimeout(() => {
              router.push("/auth/login")
            }, 3000)
          }
        }
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
