"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, CheckCircle, Star, Zap, Shield, FileText, Settings } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardDescription, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Separator } from "@/components/ui/separator"

export default function PaymentSuccessPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // استخراج معرف الجلسة من معلمات البحث
  useEffect(() => {
    const session_id = searchParams.get("session_id")
    setSessionId(session_id)

    if (session_id) {
      fetchSubscriptionDetails(session_id)
    } else {
      setIsLoading(false)
    }
  }, [searchParams])

  // جلب تفاصيل الاشتراك من الخادم
  const fetchSubscriptionDetails = async (session_id: string) => {
    try {
      const response = await fetch(`/api/stripe/subscription-details?session_id=${session_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch subscription details")
      }

      const data = await response.json()
      setSubscriptionDetails(data)
    } catch (error) {
      console.error("Error fetching subscription details:", error)
      toast({
        title: t.error || "خطأ",
        description: t.errorFetchingSubscriptionDetails || "حدث خطأ أثناء جلب تفاصيل الاشتراك",
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

        <TeslaCard className="max-w-3xl mx-auto">
          <TeslaCardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <TeslaCardTitle className="text-2xl">
              {t.paymentSuccessful || "تم الدفع بنجاح!"}
            </TeslaCardTitle>
            <TeslaCardDescription>
              {t.paymentSuccessfulDesc || "شكرًا لاشتراكك! تم تفعيل حسابك المتميز."}
            </TeslaCardDescription>
          </TeslaCardHeader>
          
          <TeslaCardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {subscriptionDetails && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">{t.subscriptionDetails || "تفاصيل الاشتراك"}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">{t.plan || "الخطة"}:</div>
                      <div>{subscriptionDetails.plan_name || "الخطة المتميزة"}</div>
                      
                      <div className="text-muted-foreground">{t.billingCycle || "دورة الفوترة"}:</div>
                      <div>{subscriptionDetails.billing_cycle || "شهري"}</div>
                      
                      <div className="text-muted-foreground">{t.startDate || "تاريخ البدء"}:</div>
                      <div>{subscriptionDetails.start_date || new Date().toLocaleDateString()}</div>
                      
                      <div className="text-muted-foreground">{t.nextBillingDate || "تاريخ الفوترة التالي"}:</div>
                      <div>{subscriptionDetails.next_billing_date || new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-4">{t.featuresUnlocked || "الميزات المتاحة الآن"}</h3>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{t.unlimitedItems || "عناصر غير محدودة"}</h4>
                        <p className="text-sm text-muted-foreground">{t.unlimitedItemsDesc || "يمكنك الآن إضافة عدد غير محدود من العناصر والتقارير."}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{t.advancedReports || "تقارير متقدمة"}</h4>
                        <p className="text-sm text-muted-foreground">{t.advancedReportsDesc || "الوصول إلى تقارير تحليلية متقدمة ورؤى مفصلة."}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{t.prioritySupport || "دعم ذو أولوية"}</h4>
                        <p className="text-sm text-muted-foreground">{t.prioritySupportDesc || "الوصول إلى دعم العملاء ذو الأولوية مع أوقات استجابة أسرع."}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">{t.customBranding || "علامة تجارية مخصصة"}</h4>
                        <p className="text-sm text-muted-foreground">{t.customBrandingDesc || "إضافة شعارك وتخصيص مظهر التقارير والمستندات."}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-col items-center text-center">
                  <h3 className="font-semibold mb-2">{t.getStarted || "ابدأ الآن"}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t.getStartedDesc || "استكشف الميزات الجديدة وابدأ في الاستفادة من اشتراكك."}</p>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/admin">
                      <TeslaButton>
                        {t.goToDashboard || "الذهاب إلى لوحة التحكم"}
                      </TeslaButton>
                    </Link>
                    
                    <Link href="/admin/account">
                      <TeslaButton variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        {t.manageSubscription || "إدارة الاشتراك"}
                      </TeslaButton>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </TeslaCardContent>
          
          <TeslaCardFooter className="text-center text-sm text-muted-foreground">
            {t.paymentSuccessFooter || "إذا كانت لديك أي أسئلة حول اشتراكك، يرجى الاتصال بفريق الدعم."}
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
