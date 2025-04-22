"use client"

import { useState, useEffect } from "react"
import { setCookie, getCookie } from "@/lib/cookies"
import { TeslaButton } from "@/components/ui/tesla-button"
import { useLanguage } from "@/lib/i18n/language-context"

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const { t, dir, language } = useLanguage()

  useEffect(() => {
    // تحقق مما إذا كان المستخدم قد وافق بالفعل على ملفات تعريف الارتباط
    const hasConsent = getCookie("cookie-consent")
    const savedLanguage = getCookie("cookie-consent-language")

    // إذا لم يكن هناك موافقة أو إذا تغيرت اللغة، نعرض رسالة الموافقة
    if (!hasConsent || savedLanguage !== language) {
      // تأخير ظهور شريط الموافقة لتحسين تجربة المستخدم
      const timer = setTimeout(() => {
        setShowConsent(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [language]) // إضافة اللغة كتبعية

  const acceptCookies = () => {
    setCookie("cookie-consent", "true", 365) // تعيين ملف تعريف الارتباط لمدة سنة
    setCookie("cookie-consent-language", language, 365) // حفظ اللغة الحالية
    setShowConsent(false)
  }

  const declineCookies = () => {
    setCookie("cookie-consent", "false", 365)
    setCookie("cookie-consent-language", language, 365) // حفظ اللغة الحالية
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50" dir={dir}>
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-foreground">
          {t.cookieConsentText ||
            "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. هل توافق على استخدامنا لملفات تعريف الارتباط؟"}
        </div>
        <div className="flex gap-2">
          <TeslaButton variant="secondary" size="sm" onClick={declineCookies}>
            {t.decline || "رفض"}
          </TeslaButton>
          <TeslaButton size="sm" onClick={acceptCookies}>
            {t.accept || "موافق"}
          </TeslaButton>
        </div>
      </div>
    </div>
  )
}
