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
    // Verificar si estamos en un entorno de vista previa o sandbox
    const isPreviewEnvironment = () => {
      // Comprobar si estamos en un entorno de vista previa de v0
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

    // Solo intentar registrar el Service Worker si no estamos en un entorno de vista previa
    if ("serviceWorker" in navigator && !isPreviewEnvironment()) {
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
      console.log("Service Worker registration skipped in preview/development environment")
    }

    // Manejar eventos de instalación solo si no estamos en un entorno de vista previa
    if (!isPreviewEnvironment()) {
      // Escuchar evento beforeinstallprompt
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setIsInstallable(true)
        console.log("App is installable, showing install button")
      }

      // Escuchar evento appinstalled
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

      // Verificar si la aplicación ya está instalada
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
    }
  }, [toast, t])

  // Manejar clic en el botón de instalación
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
