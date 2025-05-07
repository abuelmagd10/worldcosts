"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"

export default function SubscriptionSuccessPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    // عرض رسالة نجاح عند تحميل الصفحة
    toast({
      title: t.paymentSuccessful || "تم الدفع بنجاح",
      description: t.subscriptionActivated || "تم تفعيل اشتراكك بنجاح",
    })
  }, [toast, t])

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
          </TeslaCardHeader>
          <TeslaCardContent className="text-center">
            <p className="mb-6">
              {t.subscriptionActivatedDesc || "تم تفعيل اشتراكك بنجاح. يمكنك الآن الاستمتاع بجميع ميزات الخطة المدفوعة."}
            </p>
            <Link href="/admin">
              <TeslaButton className="w-full">
                {t.backToAdmin || "العودة إلى لوحة التحكم"}
              </TeslaButton>
            </Link>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
