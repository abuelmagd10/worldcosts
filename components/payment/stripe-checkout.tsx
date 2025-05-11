"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { STRIPE_PUBLIC_KEY } from "@/lib/stripe/config"
import { TeslaButton } from "@/components/ui/tesla-button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, LogIn } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { supabase } from "@/lib/supabase-client"

// تهيئة Stripe
// استخدام متغير عام لتخزين وعد Stripe
let stripePromise: Promise<any> | null = null

const getStripe = () => {
  if (!stripePromise && typeof window !== 'undefined') {
    // تسجيل المفتاح العام في وحدة التحكم للتأكد من أنه تم تحميله بشكل صحيح
    console.log("Initializing Stripe with key:", STRIPE_PUBLIC_KEY)

    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }

  return stripePromise
}

interface StripeCheckoutProps {
  planId: string
  priceId: string
  planName: string
  amount: number
  billingCycle: "monthly" | "yearly"
}

export function StripeCheckout({
  planId,
  priceId,
  planName,
  amount,
  billingCycle,
}: StripeCheckoutProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // نفترض أن المستخدم مسجل الدخول لأن هذا المكون يظهر فقط عندما يكون المستخدم مسجل الدخول في صفحة الاشتراك
  useEffect(() => {
    // تعيين حالة تسجيل الدخول إلى true مباشرة لأن هذا المكون يظهر فقط للمستخدمين المسجلين
    setIsLoggedIn(true)
    setIsCheckingAuth(false)

    // للتأكيد، نتحقق من حالة تسجيل الدخول في الخلفية
    const checkAuthStatus = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth status:", error)
          // لا نقوم بتغيير حالة تسجيل الدخول هنا لتجنب إعادة العرض غير الضرورية
        } else {
          // نقوم بتحديث حالة تسجيل الدخول فقط إذا كانت مختلفة عن الحالة الحالية
          if (!data.session) {
            console.warn("User session not found in background check")
            setIsLoggedIn(false)
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
        // لا نقوم بتغيير حالة تسجيل الدخول هنا لتجنب إعادة العرض غير الضرورية
      }
    }

    checkAuthStatus()
  }, [])

  const handleCheckout = async () => {
    // التحقق من حالة تسجيل الدخول قبل بدء عملية الدفع
    // نتحقق مرة أخرى من حالة تسجيل الدخول في الوقت الفعلي
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error("Error checking auth status before checkout:", error || "No session found")
        toast({
          title: "تسجيل الدخول مطلوب",
          description: "يبدو أن جلستك قد انتهت. يرجى تسجيل الدخول مرة أخرى للاستمرار.",
          variant: "destructive",
        })

        // تأخير قصير قبل إعادة التوجيه
        setTimeout(() => {
          const currentUrl = window.location.pathname
          router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
        }, 1500)
        return
      }
    } catch (error) {
      console.error("Error checking auth status before checkout:", error)
      // نستمر في العملية على افتراض أن المستخدم مسجل الدخول
    }

    setIsLoading(true)

    try {
      // إنشاء جلسة Checkout
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planId,
          planName,
          billingCycle,
        }),
      })

      if (!response.ok) {
        // قراءة النص الأصلي للاستجابة
        const responseText = await response.text()

        // محاولة تحليل النص كـ JSON إذا كان ممكنًا
        let errorMessage = "Network response was not ok"
        try {
          if (responseText) {
            const errorData = JSON.parse(responseText)
            if (errorData && errorData.error) {
              errorMessage = errorData.error
            }
          }
        } catch (parseError) {
          // تجاهل أخطاء التحليل
        }

        // التحقق من نوع الخطأ
        if (response.status === 401) {
          throw new Error("يرجى تسجيل الدخول أولاً")
        } else {
          throw new Error(errorMessage)
        }
      }

      // قراءة النص الأصلي للاستجابة
      const responseText = await response.text()

      // محاولة تحليل النص كـ JSON
      let sessionId
      try {
        if (responseText) {
          const responseData = JSON.parse(responseText)
          sessionId = responseData.sessionId
        }
      } catch (parseError) {
        console.error("Error parsing success response:", parseError)
        throw new Error("Invalid response format")
      }

      if (!sessionId) {
        throw new Error("No session ID returned from server")
      }

      // توجيه المستخدم إلى صفحة الدفع
      const stripe = await getStripe()

      if (!stripe) {
        throw new Error("Failed to load Stripe.js")
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw error
      }
    } catch (error: any) {
      // تخصيص رسالة الخطأ بناءً على نوع الخطأ
      let errorTitle = t.paymentError || "خطأ في الدفع"
      let errorDescription = error.message || t.paymentErrorDesc || "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى."

      // إذا كان الخطأ متعلق بعدم تسجيل الدخول
      if (error.message === "يرجى تسجيل الدخول أولاً" ||
          error.message.includes("Auth session missing")) {
        errorTitle = "تسجيل الدخول مطلوب"
        errorDescription = "يجب عليك تسجيل الدخول أولاً قبل الاشتراك في أي خطة."

        // عرض رسالة تأكيد قبل التوجيه إلى صفحة تسجيل الدخول
        setTimeout(() => {
          const confirmRedirect = window.confirm("هل ترغب في الانتقال إلى صفحة تسجيل الدخول؟")
          if (confirmRedirect) {
            // توجيه المستخدم إلى صفحة تسجيل الدخول مع URL الإحالة
            const currentUrl = window.location.pathname
            router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
          }
        }, 1000) // تأخير لمدة ثانية واحدة للسماح بعرض رسالة الخطأ أولاً
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // إذا كان جاري التحقق من حالة تسجيل الدخول
  if (isCheckingAuth) {
    return (
      <TeslaButton className="w-full" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </TeslaButton>
    )
  }

  // إذا كان المستخدم غير مسجل الدخول (هذا لن يحدث عادة لأننا نفترض أن المستخدم مسجل الدخول)
  // ولكن نحتفظ بهذا الكود كإجراء احترازي
  if (!isLoggedIn) {
    return (
      <div className="space-y-2">
        <TeslaButton
          className="w-full"
          onClick={async () => {
            // نتحقق مرة أخرى من حالة تسجيل الدخول في الوقت الفعلي
            try {
              const { data, error } = await supabase.auth.getSession()

              if (error || !data.session) {
                // إذا لم يكن المستخدم مسجل الدخول، نوجهه إلى صفحة تسجيل الدخول
                const currentUrl = window.location.pathname
                router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
              } else {
                // إذا كان المستخدم مسجل الدخول بالفعل، نقوم بتحديث الحالة وإعادة المحاولة
                setIsLoggedIn(true)
                toast({
                  title: "تم التحقق من تسجيل الدخول",
                  description: "يمكنك الآن الاشتراك في الخطة المختارة.",
                })
              }
            } catch (error) {
              console.error("Error checking auth status:", error)
              // في حالة حدوث خطأ، نوجه المستخدم إلى صفحة تسجيل الدخول
              const currentUrl = window.location.pathname
              router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
            }
          }}
        >
          <LogIn className="h-4 w-4 mr-2" />
          {t.loginToSubscribe || "تسجيل الدخول للاشتراك"}
        </TeslaButton>
        <p className="text-xs text-center text-muted-foreground">
          {t.loginRequiredForSubscription || "يجب تسجيل الدخول أولاً للاشتراك في هذه الخطة"}
        </p>
      </div>
    )
  }

  // إذا كان المستخدم مسجل الدخول
  return (
    <TeslaButton
      className="w-full"
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          {t.subscribe || "اشترك الآن"}
        </>
      )}
    </TeslaButton>
  )
}
