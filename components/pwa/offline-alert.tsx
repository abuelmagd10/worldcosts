"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useLanguage } from "@/lib/i18n/language-context"

export function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsMounted(true)

    // Verificar si estamos en un entorno donde navigator.onLine está disponible
    if (typeof navigator !== "undefined" && "onLine" in navigator) {
      setIsOffline(!navigator.onLine)

      const handleOffline = () => setIsOffline(true)
      const handleOnline = () => setIsOffline(false)

      window.addEventListener("offline", handleOffline)
      window.addEventListener("online", handleOnline)

      return () => {
        window.removeEventListener("offline", handleOffline)
        window.removeEventListener("online", handleOnline)
      }
    }
  }, [])

  // No renderizar nada hasta que el componente esté montado
  // y solo mostrar la alerta si estamos offline
  if (!isMounted || !isOffline) return null

  return (
    <Alert
      variant="destructive"
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-md bg-[#202226] border-red-500 text-white"
    >
      <AlertCircle className="h-4 w-4 text-red-500" />
      <AlertTitle>{t.offlineTitle || "أنت غير متصل بالإنترنت"}</AlertTitle>
      <AlertDescription className="text-tesla-muted">
        {t.offlineDescription || "بعض الميزات قد لا تعمل بشكل صحيح. يرجى التحقق من اتصالك بالإنترنت."}
      </AlertDescription>
    </Alert>
  )
}
