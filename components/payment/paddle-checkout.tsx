"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TeslaButton } from "@/components/ui/tesla-button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, LogIn } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { supabase } from "@/lib/supabase-client"

interface PaddleCheckoutProps {
  planId: string
  priceId: string
  planName: string
  amount: number
  billingCycle: "monthly" | "yearly"
}

export function PaddleCheckout({
  planId,
  priceId,
  planName,
  amount,
  billingCycle,
}: PaddleCheckoutProps) {
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

    // إعداد مستمع لتغييرات حالة المصادقة
    const { data: authListener } = supabase.auth.onAuthStateChange((event, _session) => {
      console.log("Auth state changed in PaddleCheckout component:", event);

      if (event === 'SIGNED_IN') {
        console.log("User signed in - PaddleCheckout component");
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out - PaddleCheckout component");
        setIsLoggedIn(false);
      }
    });

    // تنظيف المستمع عند إزالة المكون
    return () => {
      authListener.subscription.unsubscribe();
    }
  }, [])

  const handleCheckout = async () => {
    console.log("handleCheckout called in PaddleCheckout component")

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
          // استخدام window.location.href بدلاً من router.push لإعادة تحميل الصفحة بالكامل بعد تسجيل الدخول
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`
        }, 1500)
        return
      }

      // تحديث حالة تسجيل الدخول
      setIsLoggedIn(true)
    } catch (error) {
      console.error("Error checking auth status before checkout:", error)
      // نستمر في العملية على افتراض أن المستخدم مسجل الدخول
    }

    setIsLoading(true)

    try {
      // استخدام رابط اختبار مؤقت في جميع الحالات للتبسيط
      console.log("Using simplified checkout approach")

      toast({
        title: "جاري فتح صفحة الدفع",
        description: "سيتم فتح صفحة الدفع في نافذة جديدة.",
      })

      // فتح صفحة Paddle مباشرة بدون استخدام واجهة API
      setTimeout(() => {
        try {
          // فتح صفحة Paddle مباشرة
          const paddleUrl = "https://paddle.com"
          window.open(paddleUrl, '_blank')

          // عرض رسالة للمستخدم
          toast({
            title: "تم فتح موقع Paddle",
            description: "تم فتح موقع Paddle في نافذة جديدة. في الإصدار النهائي، سيتم توجيهك مباشرة إلى صفحة الدفع.",
            duration: 5000,
          })

          // توجيه المستخدم إلى صفحة نجاح الاشتراك بعد فترة قصيرة
          setTimeout(() => {
            // توجيه المستخدم إلى صفحة نجاح الاشتراك
            router.push(`/admin/subscription/success?plan_name=${encodeURIComponent(planName)}&billing_cycle=${billingCycle}`)
          }, 3000)

          console.log("Paddle website opened")
        } catch (error) {
          console.error("Error opening Paddle website:", error)
          toast({
            title: "خطأ في فتح موقع Paddle",
            description: "حدث خطأ أثناء محاولة فتح موقع Paddle. يرجى تحديث الصفحة والمحاولة مرة أخرى.",
            variant: "destructive",
          })
        }
      }, 500)
    } catch (error: any) {
      console.error("Checkout error:", error)
      toast({
        title: "خطأ في الدفع",
        description: error.message || "حدث خطأ أثناء فتح نافذة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      // تأخير قصير قبل إعادة تعيين حالة التحميل
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
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
                // عرض رسالة تأكيد قبل التوجيه
                toast({
                  title: "تسجيل الدخول مطلوب",
                  description: "يجب عليك تسجيل الدخول أولاً قبل الاشتراك في أي خطة.",
                  variant: "default",
                })

                // تأخير التوجيه قليلاً للسماح بعرض رسالة التأكيد
                setTimeout(() => {
                  const currentUrl = window.location.pathname
                  // استخدام window.location.href بدلاً من router.push لإعادة تحميل الصفحة بالكامل بعد تسجيل الدخول
                  window.location.href = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`
                }, 1000)
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
              window.location.href = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`
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
