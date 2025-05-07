"use client"

import { useState, useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { STRIPE_PUBLIC_KEY } from "@/lib/stripe/config"
import { TeslaButton } from "@/components/ui/tesla-button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

// تهيئة Stripe
// استخدام متغير عام لتخزين وعد Stripe
let stripePromise: Promise<any> | null = null

const getStripe = () => {
  if (!stripePromise && typeof window !== 'undefined') {
    // تسجيل المفتاح العام في وحدة التحكم للتأكد من أنه تم تحميله بشكل صحيح
    console.log("Initializing Stripe with key:", STRIPE_PUBLIC_KEY)

    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }

  return stripePromise
}

interface StripeCheckoutProps {
  planId: string
  priceId: string
  planName: string
  amount: number
  billingCycle: "monthly" | "yearly"
}

export function StripeCheckout({
  planId,
  priceId,
  planName,
  amount,
  billingCycle,
}: StripeCheckoutProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // إنشاء جلسة Checkout
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          planId,
          planName,
          billingCycle,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const { sessionId } = await response.json()

      // توجيه المستخدم إلى صفحة الدفع
      const stripe = await getStripe()

      if (!stripe) {
        throw new Error("Failed to load Stripe.js")
      }

      const { error } = await stripe.redirectToCheckout({ sessionId })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: t.paymentError || "خطأ في الدفع",
        description: t.paymentErrorDesc || "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TeslaButton
      className="w-full"
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <CreditCard className="h-4 w-4 mr-2" />
          {t.subscribe || "اشترك الآن"}
        </>
      )}
    </TeslaButton>
  )
}
