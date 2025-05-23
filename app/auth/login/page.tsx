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
  const [isResendingEmail, setIsResendingEmail] = useState(false)
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

    setIsResendingEmail(true)

    try {
      // التحقق من وجود المستخدم قبل إرسال رابط التأكيد
      const userExists = await checkUserExists(email)

      if (!userExists) {
        toast({
          title: "المستخدم غير موجود",
          description: "لا يوجد حساب مسجل بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟",
          variant: "destructive",
          action: (
            <Link href={`/auth/register?email=${encodeURIComponent(email)}`}>
              <button className="bg-primary text-white px-3 py-1 rounded-md text-xs">
                إنشاء حساب جديد
              </button>
            </Link>
          ),
        })
        setIsResendingEmail(false)
        return
      }

      // إضافة معلمة redirect_to إذا كانت موجودة
      const redirectParam = redirectUrl ? `?redirect_to=${encodeURIComponent(redirectUrl)}` : ''
      const emailRedirectTo = `${window.location.origin}/auth/confirm${redirectParam}`

      if (process.env.NODE_ENV === 'development') {
        console.log("Resending confirmation email to:", email)
        console.log("Email redirect URL:", emailRedirectTo)
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: emailRedirectTo,
        }
      })

      if (error) {
        throw error
      }

      toast({
        title: "تم إرسال رابط التأكيد",
        description: "تم إرسال رابط تأكيد جديد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.",
      })

      // إنشاء مكون لعرض معلومات التأكيد
      const ConfirmationDialog = () => (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">تأكيد البريد الإلكتروني</h3>
            <p className="mb-4">
              تم إرسال رابط تأكيد إلى بريدك الإلكتروني <strong>{email}</strong>. يرجى التحقق من بريدك الإلكتروني والنقر على الرابط لتأكيد حسابك.
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              ملاحظة: لن تتمكن من تسجيل الدخول حتى تقوم بتأكيد بريدك الإلكتروني.
            </p>
            <div className="flex justify-center">
              <button
                className="bg-primary text-white px-4 py-2 rounded-md"
                onClick={() => {
                  document.getElementById('confirmation-dialog')?.remove();
                }}
              >
                فهمت
              </button>
            </div>
          </div>
        </div>
      );

      // إضافة مكون التأكيد إلى الصفحة
      const dialogContainer = document.createElement('div');
      dialogContainer.id = 'confirmation-dialog';
      document.body.appendChild(dialogContainer);

      // استخدام ReactDOM.render لعرض المكون
      const ReactDOM = require('react-dom');
      ReactDOM.render(<ConfirmationDialog />, dialogContainer);

      // إزالة مكون التأكيد بعد 30 ثانية
      setTimeout(() => {
        document.getElementById('confirmation-dialog')?.remove();
      }, 30000);
    } catch (error: any) {
      console.error("Resend confirmation error:", error)

      let errorMessage = error.message || "حدث خطأ أثناء إرسال رابط التأكيد. يرجى المحاولة مرة أخرى."
      let errorTitle = "خطأ في إرسال رابط التأكيد"

      // التحقق من نوع الخطأ
      if (error.message && error.message.includes("For security purposes, you can only request this after")) {
        // استخراج عدد الثواني من رسالة الخطأ
        const secondsMatch = error.message.match(/after (\d+) seconds/)
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 60

        errorTitle = "يرجى الانتظار"
        errorMessage = `لأسباب أمنية، يمكنك فقط إجراء هذا الطلب بعد ${seconds} ثانية. يرجى الانتظار والمحاولة مرة أخرى.`

        // بدء عداد تنازلي
        startCooldownTimer(seconds)
      } else if (error.message && error.message.includes("user not found")) {
        errorTitle = "المستخدم غير موجود"
        errorMessage = "لا يوجد حساب مسجل بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟"

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
          action: (
            <Link href={`/auth/register?email=${encodeURIComponent(email)}`}>
              <button className="bg-primary text-white px-3 py-1 rounded-md text-xs">
                إنشاء حساب جديد
              </button>
            </Link>
          ),
        })
        setIsResendingEmail(false)
        return
      } else if (error.message && error.message.includes("network")) {
        errorTitle = "خطأ في الاتصال بالشبكة"
        errorMessage = "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsResendingEmail(false)
    }
  }

  // تسجيل الدخول باستخدام رابط سحري (Magic Link)
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: t.error || "خطأ",
        description: t.enterEmail || "يرجى إدخال البريد الإلكتروني",
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

    setIsLoading(true)

    try {
      console.log("Attempting to sign in with magic link for email:", email)
      console.log("Supabase client:", supabase ? "Initialized" : "Not initialized")
      console.log("Supabase auth:", supabase.auth ? "Available" : "Not available")

      // إضافة معلمة redirect_to إذا كانت موجودة
      let redirectToUrl = `${window.location.origin}/admin`

      if (redirectUrl) {
        // إذا كان URL الإحالة هو صفحة الاشتراك، نضيف معلمة خاصة للتعامل معها بشكل مختلف
        if (redirectUrl.includes("/admin/subscription")) {
          redirectToUrl = `${window.location.origin}${redirectUrl}?refresh=true`
        } else {
          redirectToUrl = `${window.location.origin}${redirectUrl}`
        }
      }

      // إضافة معلمة redirect_to للتعامل مع إعادة التوجيه بعد تأكيد البريد الإلكتروني
      const redirectParam = redirectUrl ? `?redirect_to=${encodeURIComponent(redirectUrl)}` : ''
      const emailRedirectTo = `${window.location.origin}/auth/confirm${redirectParam}`

      console.log("Email redirect URL:", emailRedirectTo)

      // إرسال رابط تسجيل الدخول
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: emailRedirectTo,
        },
      })

      console.log("Magic link response:", error ? `Error: ${error.message}` : "Success", data)

      if (error) {
        throw error
      }

      toast({
        title: t.magicLinkSent || "تم إرسال رابط تسجيل الدخول",
        description: t.magicLinkSentDesc || "تم إرسال رابط تسجيل الدخول إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.",
      })
    } catch (error: any) {
      console.error("Error sending magic link:", error)
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      })

      let errorMessage = error.message || "حدث خطأ أثناء إرسال رابط تسجيل الدخول. يرجى المحاولة مرة أخرى."
      let errorTitle = "خطأ في إرسال رابط تسجيل الدخول"

      // التحقق من نوع الخطأ
      if (error.message && error.message.includes("For security purposes, you can only request this after")) {
        // استخراج عدد الثواني من رسالة الخطأ
        const secondsMatch = error.message.match(/after (\d+) seconds/)
        const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 60

        errorTitle = "يرجى الانتظار"
        errorMessage = `لأسباب أمنية، يمكنك فقط إجراء هذا الطلب بعد ${seconds} ثانية. يرجى الانتظار والمحاولة مرة أخرى.`

        // بدء عداد تنازلي
        startCooldownTimer(seconds)
      } else if (error.message && error.message.includes("user not found")) {
        errorTitle = "المستخدم غير موجود"
        errorMessage = "لا يوجد حساب مسجل بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟"

        toast({
          title: errorTitle,
          description: errorMessage,
          variant: "destructive",
          action: (
            <Link href={`/auth/register?email=${encodeURIComponent(email)}`}>
              <button className="bg-primary text-white px-3 py-1 rounded-md text-xs">
                إنشاء حساب جديد
              </button>
            </Link>
          ),
        })

        setIsLoading(false)
        return
      } else if (error.message && error.message.includes("network")) {
        errorTitle = "خطأ في الاتصال بالشبكة"
        errorMessage = "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
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

  // التحقق من وجود المستخدم قبل تسجيل الدخول
  const checkUserExists = async (email: string) => {
    try {
      console.log("Checking if user exists:", email)

      // استخدام طريقة أكثر موثوقية للتحقق من وجود المستخدم
      // نستخدم API مخصص للتحقق من وجود المستخدم بدلاً من محاولة تسجيل الدخول
      const response = await fetch('/api/auth/check-user-exists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      console.log("Check user exists response:", data)

      if (!response.ok) {
        // في حالة حدوث خطأ في الخادم
        console.error("Server error checking user existence:", data.error)
        return true // نفترض أن المستخدم موجود في حالة حدوث خطأ في الخادم
      }

      return data.exists
    } catch (error: any) {
      console.error("Error checking user existence:", error)

      // في حالة حدوث خطأ في الشبكة، نعرض رسالة خطأ
      if (error.message && error.message.includes("network")) {
        toast({
          title: "خطأ في الاتصال بالشبكة",
          description: "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.",
          variant: "destructive",
        })
      }

      return true // نفترض أن المستخدم موجود في حالة حدوث خطأ
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
      // طباعة معلومات التصحيح
      console.log("Login attempt with email:", email)
      console.log("Supabase client:", supabase ? "Initialized" : "Not initialized")
      console.log("Supabase auth:", supabase.auth ? "Available" : "Not available")

      // التحقق من وجود المستخدم قبل محاولة تسجيل الدخول
      const userExists = await checkUserExists(email)

      if (!userExists) {
        // إذا كان المستخدم غير موجود، نعرض رسالة خطأ مع خيار إنشاء حساب جديد
        toast({
          title: "المستخدم غير موجود",
          description: "لا يوجد حساب مسجل بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟",
          variant: "destructive",
          action: (
            <Link href={`/auth/register?email=${encodeURIComponent(email)}`}>
              <button className="bg-primary text-white px-3 py-1 rounded-md text-xs">
                إنشاء حساب جديد
              </button>
            </Link>
          ),
        })
        setIsLoading(false)
        return
      }

      console.log("Attempting to sign in with password for email:", email)

      // محاولة تسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Sign in response:", error ? `Error: ${error.message}` : "Success", data)

      if (error) {
        // تسجيل معلومات إضافية عن الخطأ
        console.error("Login error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
        })

        throw error
      }

      // تسجيل معلومات المستخدم للتصحيح
      console.log("User session:", data.session ? "Created" : "Not created")
      console.log("User data:", data.user ? "Available" : "Not available")

      toast({
        title: t.loginSuccess || "تم تسجيل الدخول بنجاح",
        description: t.welcomeBack || "مرحبًا بعودتك!",
      })

      // إعادة التوجيه إلى الصفحة السابقة أو الصفحة الرئيسية
      console.log("Login successful, redirecting to:", redirectUrl || "/admin")

      // تأخير قصير للسماح بعرض رسالة النجاح
      setTimeout(() => {
        if (redirectUrl) {
          // إذا كان URL الإحالة هو صفحة الاشتراك، نتأكد من تحديث الصفحة بدلاً من استخدام التنقل العادي
          // هذا يضمن إعادة تحميل الصفحة بالكامل وإعادة تهيئة جميع المكونات
          if (redirectUrl.includes("/admin/subscription")) {
            // إضافة معلمة refresh=true لإعادة تحميل الصفحة
            const separator = redirectUrl.includes("?") ? "&" : "?"
            window.location.href = `${redirectUrl}${separator}refresh=true`
          } else {
            // استخدام window.location.href بدلاً من router.push لإعادة تحميل الصفحة بالكامل
            window.location.href = redirectUrl
          }
        } else {
          window.location.href = "/admin"
        }
      }, 1000)
    } catch (error: any) {
      console.error("Login error:", error)
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        status: error.status,
        stack: error.stack
      })

      let errorMessage = t.loginFailed || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
      let errorTitle = t.loginError || "خطأ في تسجيل الدخول"
      let errorVariant: "default" | "destructive" = "destructive"
      let showResendButton = false
      let showCreateAccountButton = false

      if (error.message === "Invalid login credentials") {
        // التحقق من سبب الخطأ بشكل أكثر تفصيلاً
        const checkEmailConfirmation = async () => {
          try {
            console.log("Checking email confirmation for:", email)

            // إضافة معلمة redirect_to إذا كانت موجودة
            const redirectParam = redirectUrl ? `?redirect_to=${encodeURIComponent(redirectUrl)}` : ''
            const emailRedirectTo = `${window.location.origin}/auth/confirm${redirectParam}`

            console.log("Email redirect URL for confirmation:", emailRedirectTo)

            // محاولة إرسال رابط تأكيد البريد الإلكتروني
            const { data: resendData, error: resendError } = await supabase.auth.resend({
              type: 'signup',
              email,
              options: {
                emailRedirectTo: emailRedirectTo,
              }
            })

            console.log("Resend confirmation response:", resendError ? `Error: ${resendError.message}` : "Success", resendData)

            // إذا لم يكن هناك خطأ، فهذا يعني أن البريد الإلكتروني غير مؤكد
            if (!resendError) {
              errorTitle = "البريد الإلكتروني غير مؤكد"
              errorMessage = "يبدو أن حسابك موجود ولكن البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد."
              errorVariant = "default"
              showResendButton = true
            } else if (resendError.message && resendError.message.includes("user not found")) {
              // المستخدم غير موجود
              errorTitle = "المستخدم غير موجود"
              errorMessage = "لا يوجد حساب مسجل بهذا البريد الإلكتروني. هل ترغب في إنشاء حساب جديد؟"
              showCreateAccountButton = true
            } else if (resendError.message && resendError.message.includes("network")) {
              // خطأ في الاتصال بالشبكة
              errorTitle = "خطأ في الاتصال بالشبكة"
              errorMessage = "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
            } else {
              // كلمة المرور غير صحيحة على الأرجح
              errorTitle = "كلمة المرور غير صحيحة"
              errorMessage = "يبدو أن كلمة المرور التي أدخلتها غير صحيحة. يرجى التحقق من كلمة المرور أو استخدام خيار 'نسيت كلمة المرور'."
            }

            // عرض رسالة الخطأ بعد التحقق
            toast({
              title: errorTitle,
              description: errorMessage,
              variant: errorVariant,
              action: showResendButton || showCreateAccountButton ? (
                <div className="flex flex-col gap-2 mt-2">
                  {showResendButton && (
                    <button
                      className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                      onClick={() => handleResendConfirmation(email)}
                    >
                      إعادة إرسال رابط التأكيد
                    </button>
                  )}

                  {showCreateAccountButton && (
                    <Link href={`/auth/register?email=${encodeURIComponent(email)}`}>
                      <button className="bg-secondary text-white px-3 py-1 rounded-md text-xs w-full">
                        إنشاء حساب جديد
                      </button>
                    </Link>
                  )}
                </div>
              ) : undefined,
            })
          } catch (checkError: any) {
            console.error("Error checking email confirmation:", checkError)
            console.error("Check error details:", {
              name: checkError.name,
              message: checkError.message,
              status: checkError.status,
              stack: checkError.stack
            })

            // في حالة حدوث خطأ، نعرض رسالة الخطأ الافتراضية
            errorTitle = "بيانات الدخول غير صحيحة"
            errorMessage = "قد يكون البريد الإلكتروني أو كلمة المرور غير صحيحة، أو لم يتم تأكيد البريد الإلكتروني بعد."
            showResendButton = true
            showCreateAccountButton = true

            toast({
              title: errorTitle,
              description: errorMessage,
              variant: errorVariant,
              action: (
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                    onClick={() => handleResendConfirmation(email)}
                  >
                    إعادة إرسال رابط التأكيد
                  </button>

                  <Link href={`/auth/register?email=${encodeURIComponent(email)}`}>
                    <button className="bg-secondary text-white px-3 py-1 rounded-md text-xs w-full">
                      إنشاء حساب جديد
                    </button>
                  </Link>
                </div>
              ),
            })
          }
        }

        // تنفيذ التحقق من سبب الخطأ
        await checkEmailConfirmation()

        // منع عرض رسالة الخطأ الافتراضية لأننا سنعرض رسالة مخصصة
        return
      } else if (error.message === "Email not confirmed") {
        errorTitle = "البريد الإلكتروني غير مؤكد"
        errorMessage = "يرجى التحقق من بريدك الإلكتروني والنقر على رابط التأكيد. أو انقر على زر إعادة إرسال رابط التأكيد أدناه."
        errorVariant = "default"
        showResendButton = true
      } else if (error.message && error.message.includes("network")) {
        errorTitle = "خطأ في الاتصال بالشبكة"
        errorMessage = "يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى."
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: errorVariant,
        action: showResendButton ? (
          <div className="flex flex-col gap-2 mt-2">
            <button
              className="bg-primary text-white px-3 py-1 rounded-md text-xs"
              onClick={() => handleResendConfirmation(email)}
            >
              إعادة إرسال رابط التأكيد
            </button>

            {showCreateAccountButton && (
              <Link href={`/auth/register?email=${encodeURIComponent(email)}`}>
                <button className="bg-secondary text-white px-3 py-1 rounded-md text-xs w-full">
                  إنشاء حساب جديد
                </button>
              </Link>
            )}
          </div>
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
            <div className="space-y-6">
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
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">
                      {t.password || "كلمة المرور"}
                    </Label>
                    <Link href="/auth/reset-password" className="text-xs text-primary hover:underline">
                      {t.forgotPassword || "نسيت كلمة المرور؟"}
                    </Link>
                  </div>
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

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted-foreground/20"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t.orContinueWith || "أو استمر باستخدام"}
                  </span>
                </div>
              </div>

              <div>
                <TeslaButton
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading || !email}
                  onClick={(e) => {
                    if (email) {
                      e.preventDefault()
                      const magicLinkEvent = new Event('submit')
                      handleMagicLinkLogin(magicLinkEvent)
                    } else {
                      toast({
                        title: t.error || "خطأ",
                        description: t.enterEmail || "يرجى إدخال البريد الإلكتروني أولاً",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      {t.loginWithMagicLink || "تسجيل الدخول برابط سحري"}
                    </>
                  )}
                </TeslaButton>
              </div>
            </div>
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
