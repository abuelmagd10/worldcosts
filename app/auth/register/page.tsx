"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, User, UserPlus } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: t.registerError || "خطأ في التسجيل",
        description: t.fillAllFields || "يرجى ملء جميع الحقول",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: t.registerError || "خطأ في التسجيل",
        description: t.passwordsDoNotMatch || "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        throw error
      }

      // عرض رسالة نجاح مع معلومات إضافية
      toast({
        title: t.registerSuccess || "تم التسجيل بنجاح",
        description: t.checkEmail || "يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك",
        duration: 10000, // عرض الرسالة لمدة 10 ثوانٍ
      })

      // عرض نافذة تأكيد مع معلومات إضافية
      setTimeout(() => {
        alert(
          "تم إرسال رابط تأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني والنقر على الرابط لتأكيد حسابك.\n\n" +
          "ملاحظة: لن تتمكن من تسجيل الدخول حتى تقوم بتأكيد بريدك الإلكتروني."
        )

        // إعادة التوجيه إلى صفحة تسجيل الدخول مع URL الإحالة
        if (redirectUrl) {
          router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`)
        } else {
          router.push("/auth/login")
        }
      }, 1000)
    } catch (error: any) {
      console.error("Register error:", error)

      let errorMessage = t.registerFailed || "فشل التسجيل. يرجى المحاولة مرة أخرى."
      let errorTitle = t.registerError || "خطأ في التسجيل"

      if (error.message === "User already registered") {
        errorMessage = t.userAlreadyRegistered || "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول."
      } else if (error.message.includes("For security purposes, you can only request this after")) {
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
              {t.register || "التسجيل"}
            </TeslaCardTitle>
          </TeslaCardHeader>

          <TeslaCardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t.fullName || "الاسم الكامل"}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.enterFullName || "أدخل اسمك الكامل"}
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  {t.confirmPassword || "تأكيد كلمة المرور"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t.confirmPassword || "تأكيد كلمة المرور"}
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <TeslaButton
                type="submit"
                className="w-full"
                disabled={isLoading || isInCooldown}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : isInCooldown ? (
                  <>
                    <div className="animate-pulse h-4 w-4 mr-2 rounded-full bg-white"></div>
                    {`الرجاء الانتظار (${cooldownTime} ثانية)`}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t.register || "التسجيل"}
                  </>
                )}
              </TeslaButton>
            </form>
          </TeslaCardContent>

          <TeslaCardFooter className="text-center">
            <p className="text-sm text-muted-foreground">
              {t.alreadyHaveAccount || "لديك حساب بالفعل؟"}{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t.login || "تسجيل الدخول"}
              </Link>
            </p>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
