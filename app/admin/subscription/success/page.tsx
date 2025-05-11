"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle, TeslaCardDescription, TeslaCardFooter } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useLanguage } from "@/lib/i18n/language-context"

// مكون لعرض محتوى الصفحة مع استخدام useSearchParams
function SuccessPageContent() {
  const { t, dir } = useLanguage()
  const searchParams = useSearchParams()

  // استخراج معلومات الاشتراك من معلمات البحث
  const [planName, setPlanName] = useState<string>("")
  const [billingCycle, setBillingCycle] = useState<string>("")

  useEffect(() => {
    // استخراج معلومات الاشتراك من معلمات البحث
    const planNameParam = searchParams.get("plan_name")
    const billingCycleParam = searchParams.get("billing_cycle")

    if (planNameParam) {
      setPlanName(planNameParam)
    }

    if (billingCycleParam) {
      setBillingCycle(billingCycleParam)
    }
  }, [searchParams])

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

      <div className="max-w-md mx-auto">
        <TeslaCard>
          <TeslaCardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <TeslaCardTitle className="text-2xl">
              {t.subscriptionSuccess || "تم الاشتراك بنجاح!"}
            </TeslaCardTitle>
            <TeslaCardDescription>
              {t.subscriptionSuccessDesc || "شكراً لاشتراكك في WorldCosts. تم تفعيل اشتراكك بنجاح."}
            </TeslaCardDescription>
          </TeslaCardHeader>

          <TeslaCardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg mb-2">
                  {t.subscriptionDetails || "تفاصيل الاشتراك"}
                </h3>
                <div className="bg-muted p-4 rounded-md space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.plan || "الخطة"}:
                    </span>
                    <span className="font-medium">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.billingCycle || "دورة الفوترة"}:
                    </span>
                    <span className="font-medium">
                      {billingCycle === "monthly"
                        ? (t.monthlyBilling || "شهري")
                        : (t.yearlyBilling || "سنوي")}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-lg mb-2">
                  {t.whatNext || "ماذا بعد؟"}
                </h3>
                <p className="text-muted-foreground">
                  {t.subscriptionSuccessNextSteps || "يمكنك الآن الاستمتاع بجميع الميزات المتميزة. استكشف الميزات الجديدة المتاحة لك الآن."}
                </p>
              </div>
            </div>
          </TeslaCardContent>

          <TeslaCardFooter>
            <Link href="/admin" className="w-full">
              <TeslaButton className="w-full">
                {t.goToDashboard || "الذهاب إلى لوحة التحكم"}
              </TeslaButton>
            </Link>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}

// مكون الصفحة الرئيسي
export default function SubscriptionSuccessPage() {
  const { dir } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <Suspense fallback={
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="animate-pulse">جاري التحميل...</div>
        </div>
      }>
        <SuccessPageContent />
      </Suspense>
    </div>
  )
}
