"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TeslaCard, TeslaCardContent, TeslaCardDescription, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { TeslaButton } from "@/components/ui/tesla-button"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import { CheckCircle, XCircle, AlertCircle, Loader2, Calendar, CreditCard, Settings } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface SubscriptionStatusProps {
  onManageClick?: () => void
}

export function SubscriptionStatus({ onManageClick }: SubscriptionStatusProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // جلب معلومات الاشتراك
    const fetchSubscription = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/subscriptions')
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch subscription')
        }

        const data = await response.json()
        setSubscription(data.activeSubscription || null)
      } catch (error: any) {
        console.error('Error fetching subscription:', error)
        setError(error.message || 'Failed to fetch subscription')
        
        toast({
          title: t.error || 'خطأ',
          description: error.message || t.failedToFetchSubscription || 'فشل في جلب معلومات الاشتراك',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [toast, t])

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <TeslaCard>
        <TeslaCardContent className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">{t.loadingSubscription || 'جاري تحميل معلومات الاشتراك...'}</p>
          </div>
        </TeslaCardContent>
      </TeslaCard>
    )
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <TeslaCard>
        <TeslaCardHeader>
          <div className="flex justify-center mb-2">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <TeslaCardTitle className="text-center">{t.errorLoadingSubscription || 'خطأ في تحميل الاشتراك'}</TeslaCardTitle>
          <TeslaCardDescription className="text-center">{error}</TeslaCardDescription>
        </TeslaCardHeader>
        <TeslaCardContent className="flex justify-center">
          <TeslaButton onClick={() => router.refresh()}>
            {t.tryAgain || 'المحاولة مرة أخرى'}
          </TeslaButton>
        </TeslaCardContent>
      </TeslaCard>
    )
  }

  // عرض حالة عدم وجود اشتراك
  if (!subscription) {
    return (
      <TeslaCard>
        <TeslaCardHeader>
          <div className="flex justify-center mb-2">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <TeslaCardTitle className="text-center">{t.noActiveSubscription || 'لا يوجد اشتراك نشط'}</TeslaCardTitle>
          <TeslaCardDescription className="text-center">
            {t.noActiveSubscriptionDesc || 'ليس لديك اشتراك نشط حاليًا. اشترك الآن للاستفادة من جميع الميزات.'}
          </TeslaCardDescription>
        </TeslaCardHeader>
        <TeslaCardContent className="flex justify-center">
          <Link href="/admin/subscription">
            <TeslaButton>
              {t.subscribe || 'اشترك الآن'}
            </TeslaButton>
          </Link>
        </TeslaCardContent>
      </TeslaCard>
    )
  }

  // عرض تفاصيل الاشتراك النشط
  return (
    <TeslaCard>
      <TeslaCardHeader>
        <div className="flex justify-center mb-2">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <TeslaCardTitle className="text-center">{t.activeSubscription || 'اشتراك نشط'}</TeslaCardTitle>
        <TeslaCardDescription className="text-center">
          {t.planName || 'الخطة'}: <strong>{subscription.plan_name}</strong> ({subscription.billing_cycle === 'monthly' ? (t.monthly || 'شهري') : (t.yearly || 'سنوي')})
        </TeslaCardDescription>
      </TeslaCardHeader>
      <TeslaCardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t.currentPeriodEnd || 'نهاية الفترة الحالية'}:</span>
            </div>
            <span className="text-sm font-medium">
              {subscription.current_period_end ? formatDate(new Date(subscription.current_period_end)) : 'غير متوفر'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t.status || 'الحالة'}:</span>
            </div>
            <span className="text-sm font-medium">
              {subscription.status === 'active' ? (t.active || 'نشط') : 
               subscription.status === 'trialing' ? (t.trial || 'تجريبي') : 
               subscription.status}
            </span>
          </div>
          
          {subscription.cancel_at_period_end && (
            <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md text-sm">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">
                    {t.subscriptionCancelled || 'تم إلغاء الاشتراك'}
                  </p>
                  <p className="text-amber-700 dark:text-amber-400">
                    {t.subscriptionCancelledDesc || 'سينتهي اشتراكك في نهاية الفترة الحالية.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </TeslaCardContent>
      <TeslaCardFooter>
        <TeslaButton 
          variant="outline" 
          className="w-full"
          onClick={onManageClick || (() => router.push('/admin/account'))}
        >
          <Settings className="h-4 w-4 mr-2" />
          {t.manageSubscription || 'إدارة الاشتراك'}
        </TeslaButton>
      </TeslaCardFooter>
    </TeslaCard>
  )
}
