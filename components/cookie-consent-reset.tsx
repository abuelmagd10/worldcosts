"use client"

import { useEffect } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { deleteCookie, getCookie } from "@/lib/cookies"

export function CookieConsentReset() {
  const { language } = useLanguage()

  useEffect(() => {
    // عند تغيير اللغة، نتحقق مما إذا كان المستخدم قد وافق على ملفات تعريف الارتباط
    const hasConsent = getCookie("cookie-consent")
    if (hasConsent) {
      // نحذف ملف تعريف الارتباط لإعادة عرض رسالة الموافقة باللغة الجديدة
      deleteCookie("cookie-consent-language")

      // نحفظ اللغة الحالية في ملف تعريف ارتباط جديد
      document.cookie = `cookie-consent-language=${language}; path=/; max-age=${60 * 60 * 24 * 365}`
    }
  }, [language])

  return null
}
