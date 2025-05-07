"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { AppLogo } from "@/components/app-logo"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  TeslaCard,
  TeslaCardContent,
  TeslaCardDescription,
  TeslaCardHeader,
  TeslaCardTitle,
} from "@/components/ui/tesla-card"

export default function PrivacyPolicy() {
  const { t, dir } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToHome}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-3xl mx-auto">
          <TeslaCardHeader>
            <TeslaCardTitle className="text-2xl">{t.privacyPolicyTitle}</TeslaCardTitle>
            <TeslaCardDescription className="text-muted-foreground">{t.privacyLastUpdated}: 2023-04-07</TeslaCardDescription>
          </TeslaCardHeader>
          <TeslaCardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.introductionTitle}</h2>
              <p className="text-muted-foreground">{t.privacyIntro}</p>
              <p className="text-muted-foreground">
                {dir === "rtl"
                  ? "نحن نلتزم بحماية خصوصيتك وضمان أمان بياناتك. تنطبق سياسة الخصوصية هذه على جميع المعلومات التي نجمعها من خلال موقعنا الإلكتروني وتطبيقنا."
                  : "We are committed to protecting your privacy and ensuring the security of your data. This Privacy Policy applies to all information we collect through our website and application."}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.informationCollectionTitle}</h2>
              <p className="text-muted-foreground">{t.informationCollection}</p>
              <ul className="list-disc list-inside space-y-2 rtl:pr-4 ltr:pl-4 text-muted-foreground">
                <li>{t.deviceInfo}</li>
                <li>{t.usageData}</li>
                <li>{t.preferences}</li>
                <li>
                  {dir === "rtl"
                    ? "البيانات التي تدخلها في التطبيق، مثل أسماء العناصر والقيم والعملات"
                    : "Data you enter into the application, such as item names, values, and currencies"}
                </li>
                <li>
                  {dir === "rtl"
                    ? "معلومات الشركة التي تقدمها طواعية (مثل اسم الشركة والعنوان ورقم الهاتف والشعار)"
                    : "Company information you voluntarily provide (such as company name, address, phone number, and logo)"}
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.dataUsageTitle}</h2>
              <p className="text-muted-foreground">{t.dataUsage}</p>
              <ul className="list-disc list-inside space-y-2 rtl:pr-4 ltr:pl-4 text-muted-foreground">
                <li>{t.improveService}</li>
                <li>{t.userExperience}</li>
                <li>{t.analytics}</li>
                <li>
                  {dir === "rtl"
                    ? "إنشاء تقارير PDF بناءً على البيانات التي تدخلها"
                    : "Creating PDF reports based on the data you enter"}
                </li>
                <li>
                  {dir === "rtl" ? "تقديم الدعم الفني وحل المشكلات" : "Providing technical support and troubleshooting"}
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.contactTitle}</h2>
              <p className="text-muted-foreground">{t.contactInfo}</p>
              <p className="text-muted-foreground">
                {dir === "rtl"
                  ? "إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه أو ممارسات البيانات الخاصة بنا، يرجى الاتصال بنا على info@worldcosts.com."
                  : "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at info@worldcosts.com."}
              </p>
            </div>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
