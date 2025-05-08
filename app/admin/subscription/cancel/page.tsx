"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, XCircle, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle, TeslaCardDescription, TeslaCardFooter } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation"

export default function SubscriptionCancelPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  // الحصول على سبب الإلغاء من معلمات البحث إذا كان متاحًا
  const cancelReason = searchParams.get('reason')

  useEffect(() => {
    // عرض رسالة إلغاء عند تحميل الصفحة
    toast({
      title: t.paymentCancelled || "تم إلغاء الدفع",
      description: t.paymentCancelledDesc || "تم إلغاء عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت.",
      variant: "destructive",
    })
  }, [toast, t])

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
            <TeslaCardDescription>
              {t.paymentCancelledDesc || "تم إلغاء عملية الدفع. يمكنك المحاولة مرة أخرى في أي وقت."}
            </TeslaCardDescription>
          </TeslaCardHeader>

          <TeslaCardContent>
            {cancelReason && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                      {t.cancelReason || "سبب الإلغاء"}
                    </h4>
                    <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">
                      {cancelReason === 'customer'
                        ? (t.cancelledByCustomer || "تم الإلغاء بواسطة العميل")
                        : cancelReason === 'payment_failed'
                          ? (t.paymentFailed || "فشلت عملية الدفع")
                          : cancelReason}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p>
                {t.cancelTips || "نصائح لتجنب مشاكل الدفع:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>{t.cancelTip1 || "تأكد من وجود رصيد كافٍ في بطاقتك"}</li>
                <li>{t.cancelTip2 || "تأكد من إدخال معلومات البطاقة بشكل صحيح"}</li>
                <li>{t.cancelTip3 || "جرب استخدام بطاقة أخرى إذا استمرت المشكلة"}</li>
                <li>{t.cancelTip4 || "تواصل مع البنك إذا تم رفض المعاملة"}</li>
              </ul>
            </div>
          </TeslaCardContent>

          <TeslaCardFooter className="flex flex-col gap-3">
            <Link href="/admin/subscription" className="w-full">
              <TeslaButton className="w-full">
                {t.tryAgain || "حاول مرة أخرى"}
              </TeslaButton>
            </Link>
            <Link href="/admin" className="w-full">
              <TeslaButton variant="outline" className="w-full">
                {t.backToAdmin || "العودة إلى لوحة التحكم"}
              </TeslaButton>
            </Link>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
