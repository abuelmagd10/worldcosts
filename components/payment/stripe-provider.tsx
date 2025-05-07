"use client"

import { ReactNode, useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { STRIPE_PUBLIC_KEY } from "@/lib/stripe/config"

// تهيئة Stripe خارج المكون لتجنب إعادة التهيئة عند إعادة التصيير
let stripePromise: ReturnType<typeof loadStripe> | null = null

const getStripePromise = () => {
  if (!stripePromise) {
    console.log("Initializing Stripe with key:", STRIPE_PUBLIC_KEY)
    stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
  }
  return stripePromise
}

interface StripeProviderProps {
  children: ReactNode
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // عرض محتوى بديل أثناء التحميل في جانب الخادم
    return <div>{children}</div>
  }

  return (
    <Elements stripe={getStripePromise()}>
      {children}
    </Elements>
  )
}
