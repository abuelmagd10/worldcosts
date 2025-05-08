"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Calendar, CreditCard } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle, TeslaCardFooter, TeslaCardDescription } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"
import { Subscription, SubscriptionService } from "@/lib/subscription/subscription-service"
import { useUser } from "@/lib/auth/user-context"

export default function SubscriptionSuccessPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  // الحصول على معرف الجلسة من معلمات البحث
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // عرض رسالة نجاح عند تحميل الصفحة
    toast({
      title: t.paymentSuccessful || "تم الدفع بنجاح",
      description: t.subscriptionActivated || "تم تفعيل اشتراكك بنجاح",
    })

    // الحصول على معلومات الاشتراك إذا كان المستخدم مسجل الدخول
    const fetchSubscription = async () => {
      if (user?.id) {
        try {
          const userSubscription = await SubscriptionService.getUserSubscription(user.id)
          setSubscription(userSubscription)
        } catch (error) {
          console.error("Error fetching subscription:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [toast, t, user?.id, sessionId])

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
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <TeslaCardTitle className="text-2xl">
              {t.paymentSuccessful || "تم الدفع بنجاح"}
            </TeslaCardTitle>
            <TeslaCardDescription>
              {t.subscriptionActivatedDesc || "تم تفعيل اشتراكك بنجاح. يمكنك الآن الاستمتاع بجميع ميزات الخطة المدفوعة."}
            </TeslaCardDescription>
          </TeslaCardHeader>

          <TeslaCardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-medium">{t.plan || "الخطة"}:</div>
                  <div className="font-bold">
                    {subscription.planId === 'pro'
                      ? (t.proPlan || "خطة Pro")
                      : (t.businessPlan || "خطة Business")}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{t.billingCycle || "دورة الفوترة"}:</span>
                  </div>
                  <div>
                    {subscription.billingCycle === 'monthly'
                      ? (t.monthly || "شهري")
                      : (t.yearly || "سنوي")}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>{t.status || "الحالة"}:</span>
                  </div>
                  <div className={subscription.isActive ? "text-green-500" : "text-yellow-500"}>
                    {subscription.isActive
                      ? (t.active || "نشط")
                      : (t.inactive || "غير نشط")}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>{t.nextBilling || "الفوترة التالية"}:</div>
                  <div>
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-2">
                {t.subscriptionInfoNotAvailable || "معلومات الاشتراك غير متوفرة حاليًا."}
              </p>
            )}
          </TeslaCardContent>

          <TeslaCardFooter>
            <Link href="/admin" className="w-full">
              <TeslaButton className="w-full">
                {t.backToAdmin || "العودة إلى لوحة التحكم"}
              </TeslaButton>
            </Link>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
