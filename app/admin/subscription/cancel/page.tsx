"use client"

import Link from "next/link"
import { ArrowLeft, XCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"

export default function SubscriptionCancelPage() {
  const { t, dir } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin/subscription">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToSubscription || "العودة إلى صفحة الاشتراك"}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-md mx-auto">
          <TeslaCardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <TeslaCardTitle className="text-2xl">
              {t.paymentCancelled || "تم إلغاء الدفع"}
            </TeslaCardTitle>
          </TeslaCardHeader>
          <TeslaCardContent className="text-center">
            <p className="mb-6">
              {t.paymentCancelledDesc || "تم إلغاء عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت."}
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/admin/subscription">
                <TeslaButton className="w-full">
                  {t.tryAgain || "حاول مرة أخرى"}
                </TeslaButton>
              </Link>
              <Link href="/admin">
                <TeslaButton variant="outline" className="w-full">
                  {t.backToAdmin || "العودة إلى لوحة التحكم"}
                </TeslaButton>
              </Link>
            </div>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
