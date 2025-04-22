"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"

export function RegisterSW() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const { toast } = useToast()
  const { t } = useLanguage()

  useEffect(() => {
    // التحقق مما إذا كنا في بيئة معاينة أو sandbox
    const isPreviewEnvironment = () => {
      // التحقق مما إذا كنا في بيئة معاينة v0
      if (typeof window !== "undefined") {
        const hostname = window.location.hostname
        return (
          hostname.includes("vusercontent.net") ||
          hostname.includes("vercel.app") ||
          hostname.includes("localhost") ||
          hostname.includes("127.0.0.1")
        )
      }
      return false
    }

    // تسجيل Service Worker في جميع البيئات لضمان عمله في الإنتاج
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        try {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("Service Worker registered successfully:", registration.scope)
            })
            .catch((error) => {
              console.error("Service Worker registration failed:", error)
            })
        } catch (error) {
          console.error("Error during Service Worker registration:", error)
        }
      })
    } else {
      console.log("Service Worker not supported in this browser")
    }

    // التعامل مع أحداث التثبيت
    // إزالة التحقق من بيئة المعاينة لضمان عمل التثبيت في الإنتاج
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
      console.log("App is installable, showing install button")
    }

    // الاستماع لحدث appinstalled
    const handleAppInstalled = () => {
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log("PWA was installed")
      toast({
        title: t.installApp || "تم تثبيت التطبيق",
        description: "تم تثبيت التطبيق بنجاح على جهازك",
      })
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // التحقق مما إذا كان التطبيق مثبتًا بالفعل
    const checkIfInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
        console.log("App is already installed")
        setIsInstallable(false)
      }
    }

    checkIfInstalled()

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [toast, t])

  // التعامل مع النقر على زر التثبيت
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("No deferred prompt available")
      return
    }

    console.log("Prompting for installation")
    deferredPrompt.prompt()

    const choiceResult = await deferredPrompt.userChoice

    setDeferredPrompt(null)

    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the installation")
      toast({
        title: "تم تثبيت التطبيق",
        description: "تم تثبيت التطبيق بنجاح على جهازك",
      })
    } else {
      console.log("User declined the installation")
    }
  }

  if (!isInstallable) return null

  return (
    <TeslaButton className="fixed bottom-4 right-4 z-50 shadow-lg" onClick={handleInstallClick}>
      <Download className="h-4 w-4 mr-2" />
      {t.installApp || "تثبيت التطبيق"}
    </TeslaButton>
  )
}
