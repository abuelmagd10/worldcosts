"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [isInCooldown, setIsInCooldown] = useState(false)

  // الحصول على URL الإحالة من معلمات البحث
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  // تعيين URL الإحالة عند تحميل الصفحة
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get('redirect')
      console.log("Redirect URL from query params:", redirect)
      setRedirectUrl(redirect)
    }
  }, [])

  // وظيفة لبدء عداد تنازلي
  const startCooldownTimer = (seconds: number) => {
    setIsInCooldown(true)
    setCooldownTime(seconds)

    const interval = setInterval(() => {
      setCooldownTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval)
          setIsInCooldown(false)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }

  // وظيفة لإعادة إرسال رابط تأكيد البريد الإلكتروني
  const handleResendConfirmation = async (email: string) => {
    if (!email) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني أولاً",
        variant: "destructive",
      })
      return
    }

    // التحقق من وجود فترة انتظار
    if (isInCooldown) {
      toast({
        title: "يرجى الانتظار",
        description: `لأسباب أمنية، يمكنك فقط إجراء هذا الطلب بعد ${cooldownTime} ثانية. يرجى الانتظار والمحاولة مرة أخرى.`,
        variant: "default",
      })
      return
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) {
        throw error
      }

      toast({
        title: "تم إرسال رابط التأكيد",
        description: "تم إرسال رابط تأكيد جديد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.",
      })
    } catch (error: any) {
      console.error("Resend confirmation error:", error)

      let errorMessage = error.message || "حدث خطأ أثناء إرسال رابط التأكيد. يرجى المحاولة مرة أخرى."
      let errorTitle = "خطأ في إرسال رابط التأكيد"

      // التحقق من نوع الخطأ
      if (error.message.includes("For security purposes, you can only request this after")) {
        // استخراج عدد الثواني من رسالة الخطأ
        const secondsMatch = error.message.match(/after (\d+) seconds/)
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 60

        errorTitle = "يرجى الانتظار"
        errorMessage = `لأسباب أمنية، يمكنك فقط إجراء هذا الطلب بعد ${seconds} ثانية. يرجى الانتظار والمحاولة مرة أخرى.`

        // بدء عداد تنازلي
        startCooldownTimer(seconds)
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: t.loginError || "خطأ في تسجيل الدخول",
        description: t.enterEmailPassword || "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      toast({
        title: t.loginSuccess || "تم تسجيل الدخول بنجاح",
        description: t.welcomeBack || "مرحبًا بعودتك!",
      })

      // إعادة التوجيه إلى الصفحة السابقة أو الصفحة الرئيسية
      console.log("Login successful, redirecting to:", redirectUrl || "/admin")

      // تأخير قصير للسماح بعرض رسالة النجاح
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl)
        } else {
          router.push("/admin")
        }
      }, 1000)
    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = t.loginFailed || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
      let errorTitle = t.loginError || "خطأ في تسجيل الدخول"
      let errorVariant: "default" | "destructive" = "destructive"
      let showResendButton = false

      if (error.message === "Invalid login credentials") {
        errorMessage = t.invalidCredentials || "بيانات الاعتماد غير صالحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور."
      } else if (error.message === "Email not confirmed") {
        errorTitle = "البريد الإلكتروني غير مؤكد"
        errorMessage = "يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد. أو انقر على زر إعادة إرسال رابط التأكيد أدناه."
        errorVariant = "default"
        showResendButton = true
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: errorVariant,
        action: showResendButton ? (
          <button
            className="bg-primary text-white px-3 py-1 rounded-md text-xs"
            onClick={() => handleResendConfirmation(email)}
          >
            إعادة إرسال رابط التأكيد
          </button>
        ) : undefined,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToAdmin || "العودة إلى لوحة التحكم"}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-md mx-auto">
          <TeslaCardHeader className="text-center">
            <TeslaCardTitle className="text-2xl">
              {t.login || "تسجيل الدخول"}
            </TeslaCardTitle>
          </TeslaCardHeader>

          <TeslaCardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {t.email || "البريد الإلكتروني"}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.enterEmail || "أدخل بريدك الإلكتروني"}
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {t.password || "كلمة المرور"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.enterPassword || "أدخل كلمة المرور"}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <TeslaButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    {t.login || "تسجيل الدخول"}
                  </>
                )}
              </TeslaButton>
            </form>
          </TeslaCardContent>

          <TeslaCardFooter className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {t.dontHaveAccount || "ليس لديك حساب؟"}{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                {t.register || "التسجيل"}
              </Link>
            </p>

            {/* خيار لإعادة إرسال رابط التأكيد */}
            <div>
              <button
                type="button"
                onClick={() => handleResendConfirmation(email)}
                className="text-xs text-primary hover:underline"
                disabled={!email || isInCooldown}
              >
                {isInCooldown
                  ? `إعادة إرسال رابط التأكيد (${cooldownTime} ثانية)`
                  : "إعادة إرسال رابط تأكيد البريد الإلكتروني"}
              </button>
            </div>

            {/* خيار لتسجيل الدخول بدون تأكيد البريد الإلكتروني (في بيئة التطوير فقط) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">خيارات المطور (بيئة التطوير فقط)</p>
                <button
                  type="button"
                  onClick={async () => {
                    // التحقق من وجود فترة انتظار
                    if (isInCooldown) {
                      toast({
                        title: "يرجى الانتظار",
                        description: `لأسباب أمنية، يمكنك فقط إجراء هذا الطلب بعد ${cooldownTime} ثانية. يرجى الانتظار والمحاولة مرة أخرى.`,
                        variant: "default",
                      })
                      return
                    }

                    try {
                      // تسجيل الدخول باستخدام رابط سحري (يتجاوز تأكيد البريد الإلكتروني)
                      const { error } = await supabase.auth.signInWithOtp({
                        email,
                      })

                      if (error) {
                        throw error
                      }

                      toast({
                        title: "تم إرسال رابط تسجيل الدخول",
                        description: "تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.",
                      })
                    } catch (error: any) {
                      // التحقق من نوع الخطأ
                      let errorTitle = "خطأ في إرسال رابط تسجيل الدخول"
                      let errorMessage = error.message || "حدث خطأ أثناء إرسال رابط تسجيل الدخول. يرجى المحاولة مرة أخرى."

                      if (error.message.includes("For security purposes, you can only request this after")) {
                        // استخراج عدد الثواني من رسالة الخطأ
                        const secondsMatch = error.message.match(/after (\d+) seconds/)
                        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 60

                        errorTitle = "يرجى الانتظار"
                        errorMessage = `لأسباب أمنية، يمكنك فقط إجراء هذا الطلب بعد ${seconds} ثانية. يرجى الانتظار والمحاولة مرة أخرى.`

                        // بدء عداد تنازلي
                        startCooldownTimer(seconds)
                      }

                      toast({
                        title: errorTitle,
                        description: errorMessage,
                        variant: "destructive",
                      })
                    }
                  }}
                  className="text-xs text-yellow-500 hover:underline"
                  disabled={!email || isInCooldown}
                >
                  {isInCooldown
                    ? `إرسال رابط تسجيل الدخول (${cooldownTime} ثانية)`
                    : "إرسال رابط تسجيل الدخول السحري"}
                </button>
              </div>
            )}
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
