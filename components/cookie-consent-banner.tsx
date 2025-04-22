"use client"

import { useState, useEffect } from "react"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  TeslaCard,
  TeslaCardContent,
  TeslaCardFooter,
  TeslaCardHeader,
  TeslaCardTitle,
} from "@/components/ui/tesla-card"
import { useLanguage } from "@/lib/i18n/language-context"
import { acceptAllCookies, rejectAllCookies, hasProvidedConsent, CookieType, updateConsent } from "@/lib/cookie-consent"
import { Switch } from "@/components/ui/switch"

export function CookieConsentBanner() {
  const { t, dir } = useLanguage()
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    [CookieType.NECESSARY]: true,
    [CookieType.PREFERENCES]: false,
    [CookieType.ANALYTICS]: false,
    [CookieType.MARKETING]: false,
  })

  useEffect(() => {
    // تأخير ظهور البانر لتحسين تجربة المستخدم
    const timer = setTimeout(() => {
      setShowBanner(!hasProvidedConsent())
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleAcceptAll = () => {
    acceptAllCookies()
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    rejectAllCookies()
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    updateConsent(preferences)
    setShowBanner(false)
  }

  const handleTogglePreference = (type: CookieType) => {
    if (type === CookieType.NECESSARY) return // لا يمكن تغيير الضرورية

    setPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm">
      <TeslaCard className="max-w-4xl mx-auto">
        <TeslaCardHeader>
          <TeslaCardTitle className="text-xl font-medium">
            {t.cookieConsentTitle || "إعدادات الخصوصية وملفات تعريف الارتباط"}
          </TeslaCardTitle>
        </TeslaCardHeader>
        <TeslaCardContent>
          <p className="text-muted-foreground mb-4">
            {t.cookieConsentDescription ||
              "نستخدم ملفات تعريف الارتباط وتقنيات التخزين المماثلة لتحسين تجربتك على موقعنا. يمكنك تخصيص تفضيلاتك أو قبول جميع ملفات تعريف الارتباط."}
          </p>

          {showDetails && (
            <div className="mt-4 space-y-4 bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.necessaryCookies || "ملفات تعريف الارتباط الضرورية"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.necessaryCookiesDescription || "ضرورية لتشغيل الموقع ولا يمكن تعطيلها."}
                  </p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.preferencesCookies || "ملفات تعريف ارتباط التفضيلات"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.preferencesCookiesDescription ||
                      "تسمح للموقع بتذكر المعلومات التي تغير طريقة عمل الموقع أو مظهره."}
                  </p>
                </div>
                <Switch
                  checked={preferences[CookieType.PREFERENCES]}
                  onCheckedChange={() => handleTogglePreference(CookieType.PREFERENCES)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.analyticsCookies || "ملفات تعريف ارتباط التحليلات"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.analyticsCookiesDescription || "تساعدنا على فهم كيفية تفاعل الزوار مع الموقع."}
                  </p>
                </div>
                <Switch
                  checked={preferences[CookieType.ANALYTICS]}
                  onCheckedChange={() => handleTogglePreference(CookieType.ANALYTICS)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{t.marketingCookies || "ملفات تعريف ارتباط التسويق"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.marketingCookiesDescription || "تستخدم لتتبع الزوار عبر مواقع الويب وعرض إعلانات ذات صلة."}
                  </p>
                </div>
                <Switch
                  checked={preferences[CookieType.MARKETING]}
                  onCheckedChange={() => handleTogglePreference(CookieType.MARKETING)}
                />
              </div>
            </div>
          )}
        </TeslaCardContent>
        <TeslaCardFooter className={`flex ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} flex-wrap gap-2`}>
          <TeslaButton onClick={handleAcceptAll}>{t.acceptAllCookies || "قبول الكل"}</TeslaButton>
          <TeslaButton variant="secondary" onClick={handleRejectAll}>
            {t.rejectAllCookies || "رفض غير الضرورية"}
          </TeslaButton>
          <TeslaButton variant="secondary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? t.hideDetails || "إخفاء التفاصيل" : t.showDetails || "عرض التفاصيل"}
          </TeslaButton>
          {showDetails && (
            <TeslaButton onClick={handleSavePreferences}>{t.savePreferences || "حفظ التفضيلات"}</TeslaButton>
          )}
        </TeslaCardFooter>
      </TeslaCard>
    </div>
  )
}
