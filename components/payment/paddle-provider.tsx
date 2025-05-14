"use client"

import { ReactNode, useEffect, useState, createContext, useContext } from "react"
import { PADDLE_VENDOR_ID } from "@/lib/paddle/config"

// إنشاء سياق Paddle
interface PaddleContextType {
  isPaddleLoaded: boolean
  paddleVendorId: string
  clientToken: string | null
}

const PaddleContext = createContext<PaddleContextType>({
  isPaddleLoaded: false,
  paddleVendorId: PADDLE_VENDOR_ID,
  clientToken: null
})

// هوك مخصص لاستخدام سياق Paddle
export const usePaddle = () => useContext(PaddleContext)

interface PaddleProviderProps {
  children: ReactNode
}

declare global {
  interface Window {
    Paddle?: any
  }
}

export function PaddleProvider({ children }: PaddleProviderProps) {
  const [isClient, setIsClient] = useState(false)
  const [isPaddleLoaded, setIsPaddleLoaded] = useState(false)
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 'live_2b9f03bdaa5802aaaf87b06640f'

  useEffect(() => {
    setIsClient(true)

    // التحقق من وجود Paddle في النافذة
    const checkPaddleLoaded = () => {
      if (window.Paddle) {
        console.log("Paddle detected in PaddleProvider")
        setIsPaddleLoaded(true)
        return true
      }
      return false
    }

    // إذا كان Paddle متاحًا بالفعل
    if (checkPaddleLoaded()) {
      return
    }

    // إعداد مستمع للتحقق من تحميل Paddle كل 500 مللي ثانية
    const checkInterval = setInterval(() => {
      if (checkPaddleLoaded()) {
        clearInterval(checkInterval)
      }
    }, 500)

    // تنظيف المؤقت عند إزالة المكون
    return () => {
      clearInterval(checkInterval)
    }
  }, [])

  // القيم التي سيتم توفيرها من خلال السياق
  const contextValue: PaddleContextType = {
    isPaddleLoaded,
    paddleVendorId: PADDLE_VENDOR_ID,
    clientToken
  }

  if (!isClient) {
    // عرض محتوى بديل أثناء التحميل في جانب الخادم
    return <PaddleContext.Provider value={contextValue}>{children}</PaddleContext.Provider>
  }

  return (
    <PaddleContext.Provider value={contextValue}>
      {children}
    </PaddleContext.Provider>
  )
}
