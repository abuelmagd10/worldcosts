"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, User, UserPlus, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// مكون لعرض محتوى الصفحة مع استخدام useSearchParams
function RegisterContent() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)
  const [isInCooldown, setIsInCooldown] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)

  // الحصول على URL الإحالة من معلمات البحث
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  // تعيين URL الإحالة والبريد الإلكتروني عند تحميل الصفحة
  useEffect(() => {
    const redirect = searchParams.get('redirect')
    const emailParam = searchParams.get('email')

    console.log("Redirect URL from query params:", redirect)
    console.log("Supabase client:", supabase ? "Initialized" : "Not initialized")
    console.log("Supabase auth:", supabase.auth ? "Available" : "Not available")

    setRedirectUrl(redirect)

    // تعيين البريد الإلكتروني إذا كان موجودًا في معلمات البحث
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  // وظيفة للتحقق من قوة كلمة المرور
  const checkPasswordStrength = (password: string) => {
    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      setPasswordStrength('weak')
      return false
    }

    // التحقق من وجود أحرف كبيرة وصغيرة وأرقام ورموز خاصة
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    // حساب قوة كلمة المرور
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length

    if (strength <= 2) {
      setPasswordStrength('weak')
      return false
    } else if (strength === 3) {
      setPasswordStrength('medium')
      return true
    } else {
      setPasswordStrength('strong')
      return true
    }
  }

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

  // التحقق من قوة كلمة المرور عند تغييرها
  useEffect(() => {
    if (password) {
      checkPasswordStrength(password)
    } else {
      setPasswordStrength(null)
    }
  }, [password])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log("Starting registration process...")
    console.log("Name:", name)
    console.log("Email:", email)
    console.log("Password length:", password ? password.length : 0)
    console.log("Password strength:", passwordStrength)

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

    if (password.length < 6) {
      toast({
        title: t.registerError || "خطأ في التسجيل",
        description: t.passwordTooShort || "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }

    if (passwordStrength === 'weak') {
      toast({
        title: t.weakPassword || "كلمة مرور ضعيفة",
        description: t.weakPasswordDesc || "يرجى استخدام كلمة مرور أقوى تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Attempting to sign up with email:", email)

      // إضافة معلمة redirect_to إذا كانت موجودة
      const redirectParam = redirectUrl ? `?redirect_to=${encodeURIComponent(redirectUrl)}` : ''
      const emailRedirectTo = `${window.location.origin}/auth/confirm${redirectParam}`

      console.log("Email redirect URL:", emailRedirectTo)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: emailRedirectTo,
        },
      })

      console.log("Sign up response:", error ? `Error: ${error.message}` : "Success", data)

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
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      })

      let errorMessage = t.registerFailed || "فشل التسجيل. يرجى المحاولة مرة أخرى."
      let errorTitle = t.registerError || "خطأ في التسجيل"

      if (error.message === "User already registered") {
        errorMessage = t.userAlreadyRegistered || "البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول."
      } else if (error.message && error.message.includes("For security purposes, you can only request this after")) {
        // استخراج عدد الثواني من رسالة الخطأ
        const secondsMatch = error.message.match(/after (\d+) seconds/)
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 60

        errorTitle = "يرجى الانتظار"
        errorMessage = `لأسباب أمنية، يمكنك فقط إجراء هذا الطلب بعد ${seconds} ثانية. يرجى الانتظار والمحاولة مرة أخرى.`

        // بدء عداد تنازلي
        startCooldownTimer(seconds)
      } else if (error.message && error.message.includes("network")) {
        errorTitle = "خطأ في الاتصال بالشبكة"
        errorMessage = "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
      } else if (error.message && error.message.includes("password")) {
        errorTitle = "خطأ في كلمة المرور"
        errorMessage = "كلمة المرور غير صالحة. يجب أن تتكون من 6 أحرف على الأقل."
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

  // مكون لعرض مؤشر قوة كلمة المرور
  const PasswordStrengthIndicator = () => {
    if (!passwordStrength) return null

    const getColor = () => {
      switch (passwordStrength) {
        case 'weak':
          return 'bg-red-500'
        case 'medium':
          return 'bg-yellow-500'
        case 'strong':
          return 'bg-green-500'
        default:
          return 'bg-gray-300'
      }
    }

    const getMessage = () => {
      switch (passwordStrength) {
        case 'weak':
          return t.weakPassword || 'كلمة مرور ضعيفة'
        case 'medium':
          return t.mediumPassword || 'كلمة مرور متوسطة'
        case 'strong':
          return t.strongPassword || 'كلمة مرور قوية'
        default:
          return ''
      }
    }

    return (
      <div className="mt-1">
        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-300`}
            style={{
              width: passwordStrength === 'weak' ? '33%' :
                    passwordStrength === 'medium' ? '66%' : '100%'
            }}
          />
        </div>
        <p className={`text-xs mt-1 ${
          passwordStrength === 'weak' ? 'text-red-500' :
          passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
        }`}>
          {getMessage()}
        </p>
      </div>
    )
  }

  return (
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
              {password && <PasswordStrengthIndicator />}
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
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {t.passwordsDoNotMatch || "كلمات المرور غير متطابقة"}
                </p>
              )}
            </div>

            <TeslaButton
              type="submit"
              className="w-full"
              disabled={isLoading || isInCooldown}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
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
  )
}

// مكون الصفحة الرئيسي
export default function RegisterPage() {
  const { dir } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Suspense fallback={
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="animate-pulse">جاري التحميل...</div>
        </div>
      }>
        <RegisterContent />
      </Suspense>
    </div>
  )
}
