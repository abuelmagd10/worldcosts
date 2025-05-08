"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, Shield, Zap, LogIn } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardDescription, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StripeCheckout } from "@/components/payment/stripe-checkout"
import { StripeProvider } from "@/components/payment/stripe-provider"
import { STRIPE_PRODUCTS } from "@/lib/stripe/config"
import { PaymentMethods } from "@/components/payment/payment-methods"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export default function SubscriptionPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth status:", error)
          setIsLoggedIn(false)
        } else {
          setIsLoggedIn(!!data.session)
        }
      } catch (error) {
        console.error("Error checking auth status:", error)
        setIsLoggedIn(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthStatus()
  }, [])

  // لا نحتاج إلى وظائف معالجة الدفع لأن Stripe Checkout سيتعامل مع عملية الدفع

  const prices = {
    pro: {
      monthly: 9.99,
      yearly: 95.88, // 20% discount
    },
    business: {
      monthly: 19.99,
      yearly: 191.88, // 20% discount
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToAdmin}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        {isCheckingAuth ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : !isLoggedIn ? (
          <TeslaCard className="max-w-4xl mx-auto mb-8">
            <TeslaCardHeader>
              <TeslaCardTitle className="text-2xl">{t.loginRequired || "تسجيل الدخول مطلوب"}</TeslaCardTitle>
              <TeslaCardDescription>{t.loginRequiredDesc || "يجب عليك تسجيل الدخول أولاً للوصول إلى خطط الاشتراك"}</TeslaCardDescription>
            </TeslaCardHeader>
            <TeslaCardContent className="flex flex-col items-center">
              <div className="mb-6 text-center">
                <LogIn className="h-16 w-16 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">{t.loginToAccessSubscriptions || "قم بتسجيل الدخول للوصول إلى خطط الاشتراك المتاحة والميزات المتقدمة"}</p>
              </div>
              <TeslaButton
                className="w-full max-w-md"
                onClick={() => {
                  const currentUrl = window.location.pathname
                  router.push(`/auth/login?redirect=${encodeURIComponent(currentUrl)}`)
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t.login || "تسجيل الدخول"}
              </TeslaButton>
            </TeslaCardContent>
          </TeslaCard>
        ) : (
          <TeslaCard className="max-w-4xl mx-auto mb-8">
            <TeslaCardHeader>
              <TeslaCardTitle className="text-2xl">{t.upgradeToProVersion}</TeslaCardTitle>
              <TeslaCardDescription>{t.proFeatures}</TeslaCardDescription>
            </TeslaCardHeader>
            <TeslaCardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{t.unlimitedItems}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{t.advancedReports}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{t.customBranding}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{t.dataSync}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{t.prioritySupport}</span>
                </div>
              </div>
            </TeslaCardContent>
          </TeslaCard>
        )}

        {!isCheckingAuth && isLoggedIn && (
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="monthly" onClick={() => setBillingCycle("monthly")}>
                    {t.monthlyBilling}
                  </TabsTrigger>
                  <TabsTrigger value="yearly" onClick={() => setBillingCycle("yearly")}>
                    {t.yearlyBilling}
                    <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      -20%
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <TeslaCard>
                <TeslaCardHeader>
                  <TeslaCardTitle>{t.freePlan}</TeslaCardTitle>
                  <div className="mt-2">
                    <p className="text-3xl font-bold">$0</p>
                    <p className="text-sm text-muted-foreground">{t.currentPlan}</p>
                  </div>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>5 {t.itemName}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>PDF {t.downloadPDF}</span>
                    </li>
                  </ul>
                </TeslaCardContent>
                <TeslaCardFooter>
                  <TeslaButton variant="outline" className="w-full" disabled>
                    {t.currentPlan}
                  </TeslaButton>
                </TeslaCardFooter>
              </TeslaCard>

              {/* Pro Plan */}
              <TeslaCard className="border-tesla-blue">
                <TeslaCardHeader>
                  <Badge className="w-fit mb-2">{t.proPlan}</Badge>
                  <TeslaCardTitle>{t.proPlan}</TeslaCardTitle>
                  <div className="mt-2">
                    <p className="text-3xl font-bold">
                      ${billingCycle === "monthly" ? prices.pro.monthly : (prices.pro.yearly / 12).toFixed(2)}
                      <span className="text-sm font-normal">/{billingCycle === "monthly" ? t.monthlyBilling.toLowerCase() : t.yearlyBilling.toLowerCase()}</span>
                    </p>
                    {billingCycle === "yearly" && (
                      <p className="text-sm text-green-600 dark:text-green-400">{t.yearlyDiscount}</p>
                    )}
                  </div>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.unlimitedItems}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.advancedReports}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.customBranding}</span>
                    </li>
                  </ul>
                </TeslaCardContent>
                <TeslaCardFooter>
                  <StripeCheckout
                    planId="pro"
                    priceId={billingCycle === "monthly" ? STRIPE_PRODUCTS.PRO.monthly.priceId : STRIPE_PRODUCTS.PRO.yearly.priceId}
                    planName={t.proPlan || "Pro Plan"}
                    amount={billingCycle === "monthly" ? STRIPE_PRODUCTS.PRO.monthly.amount : STRIPE_PRODUCTS.PRO.yearly.amount}
                    billingCycle={billingCycle}
                  />
                </TeslaCardFooter>
              </TeslaCard>

              {/* Business Plan */}
              <TeslaCard>
                <TeslaCardHeader>
                  <Badge variant="outline" className="w-fit mb-2">{t.businessPlan}</Badge>
                  <TeslaCardTitle>{t.businessPlan}</TeslaCardTitle>
                  <div className="mt-2">
                    <p className="text-3xl font-bold">
                      ${billingCycle === "monthly" ? prices.business.monthly : (prices.business.yearly / 12).toFixed(2)}
                      <span className="text-sm font-normal">/{billingCycle === "monthly" ? t.monthlyBilling.toLowerCase() : t.yearlyBilling.toLowerCase()}</span>
                    </p>
                    {billingCycle === "yearly" && (
                      <p className="text-sm text-green-600 dark:text-green-400">{t.yearlyDiscount}</p>
                    )}
                  </div>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.unlimitedItems}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.advancedReports}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.customBranding}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.dataSync}</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t.prioritySupport}</span>
                    </li>
                  </ul>
                </TeslaCardContent>
                <TeslaCardFooter>
                  <StripeCheckout
                    planId="business"
                    priceId={billingCycle === "monthly" ? STRIPE_PRODUCTS.BUSINESS.monthly.priceId : STRIPE_PRODUCTS.BUSINESS.yearly.priceId}
                    planName={t.businessPlan || "Business Plan"}
                    amount={billingCycle === "monthly" ? STRIPE_PRODUCTS.BUSINESS.monthly.amount : STRIPE_PRODUCTS.BUSINESS.yearly.amount}
                    billingCycle={billingCycle}
                  />
                </TeslaCardFooter>
              </TeslaCard>
            </div>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
