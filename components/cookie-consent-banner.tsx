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
  const { t, dir, language } = useLanguage()
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState({
    [CookieType.NECESSARY]: true,
    [CookieType.PREFERENCES]: false,
    [CookieType.ANALYTICS]: false,
    [CookieType.MARKETING]: false,
  })

  // تحديد نصوص الموافقة حسب اللغة
  const getConsentText = () => {
    const texts = {
      ar: {
        title: "إعدادات الخصوصية وملفات تعريف الارتباط",
        description:
          "نستخدم ملفات تعريف الارتباط وتقنيات التخزين المماثلة لتحسين تجربتك على موقعنا. يمكنك تخصيص تفضيلاتك أو قبول جميع ملفات تعريف الارتباط.",
        necessary: "ملفات تعريف الارتباط الضرورية",
        necessaryDesc: "ضرورية لتشغيل الموقع ولا يمكن تعطيلها.",
        preferences: "ملفات تعريف ارتباط التفضيلات",
        preferencesDesc: "تسمح للموقع بتذكر المعلومات التي تغير طريقة عمل الموقع أو مظهره.",
        analytics: "ملفات تعريف ارتباط التحليلات",
        analyticsDesc: "تساعدنا على فهم كيفية تفاعل الزوار مع الموقع.",
        marketing: "ملفات تعريف ارتباط التسويق",
        marketingDesc: "تستخدم لتتبع الزوار عبر مواقع الويب وعرض إعلانات ذات صلة.",
        acceptAll: "قبول الكل",
        rejectAll: "رفض غير الضرورية",
        showDetails: "عرض التفاصيل",
        hideDetails: "إخفاء التفاصيل",
        savePreferences: "حفظ التفضيلات",
      },
      en: {
        title: "Privacy and Cookie Settings",
        description:
          "We use cookies and similar storage technologies to enhance your experience on our site. You can customize your preferences or accept all cookies.",
        necessary: "Necessary Cookies",
        necessaryDesc: "Essential for the website to function and cannot be disabled.",
        preferences: "Preference Cookies",
        preferencesDesc: "Allow the website to remember information that changes how the website behaves or looks.",
        analytics: "Analytics Cookies",
        analyticsDesc: "Help us understand how visitors interact with the website.",
        marketing: "Marketing Cookies",
        marketingDesc: "Used to track visitors across websites and display relevant advertisements.",
        acceptAll: "Accept All",
        rejectAll: "Reject Non-Essential",
        showDetails: "Show Details",
        hideDetails: "Hide Details",
        savePreferences: "Save Preferences",
      },
      de: {
        title: "Datenschutz- und Cookie-Einstellungen",
        description:
          "Wir verwenden Cookies und ähnliche Speichertechnologien, um Ihre Erfahrung auf unserer Website zu verbessern. Sie können Ihre Präferenzen anpassen oder alle Cookies akzeptieren.",
        necessary: "Notwendige Cookies",
        necessaryDesc: "Wesentlich für die Funktionalität der Website und können nicht deaktiviert werden.",
        preferences: "Präferenz-Cookies",
        preferencesDesc:
          "Ermöglichen der Website, Informationen zu speichern, die das Verhalten oder Aussehen der Website ändern.",
        analytics: "Analyse-Cookies",
        analyticsDesc: "Helfen uns zu verstehen, wie Besucher mit der Website interagieren.",
        marketing: "Marketing-Cookies",
        marketingDesc:
          "Werden verwendet, um Besucher über Websites hinweg zu verfolgen und relevante Werbung anzuzeigen.",
        acceptAll: "Alle akzeptieren",
        rejectAll: "Nicht wesentliche ablehnen",
        showDetails: "Details anzeigen",
        hideDetails: "Details ausblenden",
        savePreferences: "Präferenzen speichern",
      },
      fr: {
        title: "Paramètres de confidentialité et de cookies",
        description:
          "Nous utilisons des cookies et des technologies de stockage similaires pour améliorer votre expérience sur notre site. Vous pouvez personnaliser vos préférences ou accepter tous les cookies.",
        necessary: "Cookies nécessaires",
        necessaryDesc: "Essentiels au fonctionnement du site et ne peuvent pas être désactivés.",
        preferences: "Cookies de préférence",
        preferencesDesc:
          "Permettent au site de mémoriser des informations qui modifient le comportement ou l'apparence du site.",
        analytics: "Cookies d'analyse",
        analyticsDesc: "Nous aident à comprendre comment les visiteurs interagissent avec le site.",
        marketing: "Cookies marketing",
        marketingDesc: "Utilisés pour suivre les visiteurs sur les sites web et afficher des publicités pertinentes.",
        acceptAll: "Tout accepter",
        rejectAll: "Rejeter non essentiels",
        showDetails: "Afficher les détails",
        hideDetails: "Masquer les détails",
        savePreferences: "Enregistrer les préférences",
      },
    }

    return texts[language as keyof typeof texts] || texts.ar
  }

  const consentText = getConsentText()

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
          <TeslaCardTitle className="text-xl font-medium">{consentText.title}</TeslaCardTitle>
        </TeslaCardHeader>
        <TeslaCardContent>
          <p className="text-muted-foreground mb-4">{consentText.description}</p>

          {showDetails && (
            <div className="mt-4 space-y-4 bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{consentText.necessary}</h4>
                  <p className="text-sm text-muted-foreground">{consentText.necessaryDesc}</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{consentText.preferences}</h4>
                  <p className="text-sm text-muted-foreground">{consentText.preferencesDesc}</p>
                </div>
                <Switch
                  checked={preferences[CookieType.PREFERENCES]}
                  onCheckedChange={() => handleTogglePreference(CookieType.PREFERENCES)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{consentText.analytics}</h4>
                  <p className="text-sm text-muted-foreground">{consentText.analyticsDesc}</p>
                </div>
                <Switch
                  checked={preferences[CookieType.ANALYTICS]}
                  onCheckedChange={() => handleTogglePreference(CookieType.ANALYTICS)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{consentText.marketing}</h4>
                  <p className="text-sm text-muted-foreground">{consentText.marketingDesc}</p>
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
          <TeslaButton onClick={handleAcceptAll}>{consentText.acceptAll}</TeslaButton>
          <TeslaButton variant="secondary" onClick={handleRejectAll}>
            {consentText.rejectAll}
          </TeslaButton>
          <TeslaButton variant="secondary" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? consentText.hideDetails : consentText.showDetails}
          </TeslaButton>
          {showDetails && <TeslaButton onClick={handleSavePreferences}>{consentText.savePreferences}</TeslaButton>}
        </TeslaCardFooter>
      </TeslaCard>
    </div>
  )
}
