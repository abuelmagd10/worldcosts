"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { PADDLE_PRODUCTS } from "@/lib/paddle/config"

export default function PricingPage() {
  const { t, dir } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
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

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">{t.subscriptionPlans}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.subscriptionPlansDescription || "اختر الخطة المناسبة لاحتياجاتك. جميع الخطط تشمل تحديثات مجانية وتحسينات مستمرة."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <TeslaCard className="border-2 border-muted">
            <TeslaCardHeader className="text-center pb-2">
              <TeslaCardTitle className="text-2xl">{t.freePlan}</TeslaCardTitle>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/{t.monthlyBilling.toLowerCase().replace("فوترة ", "")}</span>
              </div>
            </TeslaCardHeader>
            <TeslaCardContent className="space-y-6">
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.unlimitedItems}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.basicCurrencyConversion}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.limitedPDFExports}</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="mr-2">{t.noAds || "بدون إعلانات"}</span>
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="mr-2">{t.limitedFileStorage || "تخزين ملفات محدود"}</span>
                  </li>
                </ul>
              </div>
              <TeslaButton className="w-full" variant="outline">
                {t.currentPlan}
              </TeslaButton>
            </TeslaCardContent>
          </TeslaCard>

          {/* Pro Plan */}
          <TeslaCard className="border-2 border-primary relative">
            <div className="absolute top-0 right-0 left-0 bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
              {t.mostPopular}
            </div>
            <TeslaCardHeader className="text-center pb-2 pt-8">
              <TeslaCardTitle className="text-2xl">{t.proPlan}</TeslaCardTitle>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">${PADDLE_PRODUCTS.PRO.monthly.amount}</span>
                <span className="text-muted-foreground">/{t.monthlyBilling.toLowerCase().replace("فوترة ", "")}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {t.yearlyDiscount.replace("20%", `$${PADDLE_PRODUCTS.PRO.yearly.amount}/`)}
              </div>
            </TeslaCardHeader>
            <TeslaCardContent className="space-y-6">
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.allFeaturesInFreePlan || "كل ميزات الخطة المجانية"}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.noAds || "بدون إعلانات"}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.unlimitedPDFExports}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.oneGBStorage || "تخزين ملفات 1GB"}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.prioritySupport}</span>
                  </li>
                </ul>
              </div>
              <Link href="/admin/subscription">
                <TeslaButton className="w-full">
                  {t.subscribe}
                </TeslaButton>
              </Link>
            </TeslaCardContent>
          </TeslaCard>

          {/* Business Plan */}
          <TeslaCard className="border-2 border-muted">
            <TeslaCardHeader className="text-center pb-2">
              <TeslaCardTitle className="text-2xl">{t.businessPlan}</TeslaCardTitle>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">${PADDLE_PRODUCTS.BUSINESS.monthly.amount}</span>
                <span className="text-muted-foreground">/{t.monthlyBilling.toLowerCase().replace("فوترة ", "")}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {t.yearlyDiscount.replace("20%", `$${PADDLE_PRODUCTS.BUSINESS.yearly.amount}/`)}
              </div>
            </TeslaCardHeader>
            <TeslaCardContent className="space-y-6">
              <div className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.everythingInPro}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.fiveGBStorage || "تخزين ملفات 5GB"}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.advancedReporting}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.multipleAccounts || "حسابات متعددة"}</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="mr-2">{t.dedicatedSupport || "دعم مخصص 24/7"}</span>
                  </li>
                </ul>
              </div>
              <Link href="/admin/subscription">
                <TeslaButton className="w-full" variant="outline">
                  {t.subscribe}
                </TeslaButton>
              </Link>
            </TeslaCardContent>
          </TeslaCard>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">{t.frequentlyAskedQuestions}</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-right">
            <div>
              <h3 className="text-lg font-medium mb-2">{t.canCancelAnytime || "هل يمكنني إلغاء اشتراكي في أي وقت؟"}</h3>
              <p className="text-muted-foreground">{t.cancelExplanation || "نعم، يمكنك إلغاء اشتراكك في أي وقت. ستستمر في الوصول إلى الميزات المدفوعة حتى نهاية فترة الفوترة الحالية."}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">{t.howDoesTrial}</h3>
              <p className="text-muted-foreground">{t.trialExplanation}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">{t.paymentMethods}</h3>
              <p className="text-muted-foreground">{t.paymentMethodsExplanation}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">{t.canChangePlans}</h3>
              <p className="text-muted-foreground">{t.changePlansExplanation}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            {t.forMoreInfo || "لمزيد من المعلومات، يرجى الاطلاع على"} <Link href="/terms" className="text-primary hover:underline">{t.termsAndConditionsTitle}</Link> {t.and || "و"} <Link href="/privacy" className="text-primary hover:underline">{t.privacyPolicyTitle}</Link> {t.and || "و"} <Link href="/refund" className="text-primary hover:underline">{t.refundPolicy}</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
