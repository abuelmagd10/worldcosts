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
      // استخدام Paddle API لإنشاء جلسة دفع
      console.log("Creating Paddle checkout session with:", {
        priceId,
        planId,
        planName,
        billingCycle
      })

      toast({
        title: "جاري إنشاء جلسة الدفع",
        description: "يرجى الانتظار بينما نقوم بإعداد عملية الدفع.",
      })

      // إنشاء جلسة دفع باستخدام API
      let response
      try {
        console.log("Sending request to API with data:", {
          priceId,
          planId,
          planName,
          billingCycle,
        })

        // استخدام عنوان API الصحيح مع التأكد من وجود / في النهاية
        response = await fetch('/api/paddle/create-checkout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            planId,
            planName,
            billingCycle,
          }),
        })

        console.log("API response status:", response.status)

        // طباعة عنوان URL الكامل للتشخيص
        console.log("Full API URL:", window.location.origin + '/api/paddle/create-checkout/')
      } catch (fetchError: any) {
        console.error("Network error during API call:", fetchError)
        console.error("Fetch error details:", fetchError)
        throw new Error("خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.")
      }

      // قراءة بيانات الاستجابة
      let responseData
      try {
        responseData = await response.json()
        console.log("API response data:", responseData)
      } catch (jsonError) {
        console.error("Error parsing API response:", jsonError)
        throw new Error("خطأ في تحليل استجابة الخادم. يرجى المحاولة مرة أخرى.")
      }

      if (!response.ok) {
        // التعامل مع أخطاء الخادم المختلفة
        if (response.status === 401) {
          throw new Error("انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.")
        } else if (response.status === 400) {
          throw new Error(responseData.error || "بيانات غير صالحة. يرجى التحقق من المعلومات المدخلة.")
        } else {
          throw new Error(responseData.error || 'فشل في إنشاء جلسة الدفع. يرجى المحاولة مرة أخرى.')
        }
      }

      // التحقق من وجود رابط الدفع
      if (!responseData.checkoutUrl) {
        console.error("Missing checkout URL in response:", responseData)
        throw new Error('لم يتم العثور على رابط الدفع في الاستجابة. يرجى المحاولة مرة أخرى.')
      }

      // عرض رسالة للمستخدم
      toast({
        title: "تم إنشاء جلسة الدفع",
        description: "سيتم فتح صفحة الدفع في نافذة جديدة.",
      })

      // فتح صفحة الدفع
      console.log("Opening checkout URL:", responseData.checkoutUrl)
      window.open(responseData.checkoutUrl, '_blank')

      console.log("Paddle checkout opened")
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
