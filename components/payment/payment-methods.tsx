"use client"

import { useState } from "react"
import Image from "next/image"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { TeslaButton } from "@/components/ui/tesla-button"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import { CreditCard, Smartphone, Building, Loader2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PaymentMethodsProps {
  amount: number
  currency: string
  planName: string
  billingCycle: "monthly" | "yearly"
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentMethods({
  amount,
  currency,
  planName,
  billingCycle,
  onSuccess,
  onCancel
}: PaymentMethodsProps) {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [selectedMethod, setSelectedMethod] = useState<string>("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    try {
      // هنا سيتم إرسال طلب إلى API لبدء عملية الدفع
      // في الوقت الحالي، سنقوم بمحاكاة عملية الدفع
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // إظهار رسالة نجاح
      toast({
        title: t.paymentSuccessful || "تم الدفع بنجاح",
        description: t.subscriptionActivated || "تم تفعيل اشتراكك بنجاح",
      })
      
      // استدعاء دالة النجاح
      onSuccess()
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: t.paymentFailed || "فشل الدفع",
        description: t.paymentFailedDesc || "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <TeslaCard className="w-full max-w-md mx-auto">
      <TeslaCardHeader>
        <TeslaCardTitle>{t.selectPaymentMethod || "اختر طريقة الدفع"}</TeslaCardTitle>
      </TeslaCardHeader>
      <TeslaCardContent>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{planName} - {billingCycle === "monthly" ? t.monthlyBilling : t.yearlyBilling}</p>
              <p className="text-sm text-muted-foreground">{t.totalAmount}: {currency}{amount.toFixed(2)}</p>
            </div>
          </div>

          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod} className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span>{t.creditCard || "بطاقة ائتمان"}</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
              <RadioGroupItem value="fawry" id="fawry" />
              <Label htmlFor="fawry" className="flex items-center gap-2 cursor-pointer">
                <div className="relative h-5 w-5">
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">F</span>
                </div>
                <span>{t.fawry || "فوري"}</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
              <RadioGroupItem value="vodafoneCash" id="vodafoneCash" />
              <Label htmlFor="vodafoneCash" className="flex items-center gap-2 cursor-pointer">
                <Smartphone className="h-5 w-5 text-red-500" />
                <span>{t.vodafoneCash || "فودافون كاش"}</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse rtl:space-x-reverse">
              <RadioGroupItem value="bankTransfer" id="bankTransfer" />
              <Label htmlFor="bankTransfer" className="flex items-center gap-2 cursor-pointer">
                <Building className="h-5 w-5 text-green-500" />
                <span>{t.bankTransfer || "تحويل بنكي"}</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="flex gap-3 pt-4">
            <TeslaButton
              className="flex-1"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.proceedToPayment || "متابعة الدفع"
              )}
            </TeslaButton>
            <TeslaButton
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
            >
              {t.cancel || "إلغاء"}
            </TeslaButton>
          </div>
        </div>
      </TeslaCardContent>
    </TeslaCard>
  )
}
