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

export default function TermsAndConditions() {
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
            <TeslaCardTitle className="text-2xl">{t.termsAndConditionsTitle}</TeslaCardTitle>
            <TeslaCardDescription className="text-muted-foreground">{t.privacyLastUpdated}: 2023-04-07</TeslaCardDescription>
          </TeslaCardHeader>
          <TeslaCardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.acceptanceTitle}</h2>
              <p className="text-muted-foreground">{t.acceptanceText}</p>
              <p className="text-muted-foreground">
                {dir === "rtl"
                  ? "باستخدام تطبيق WorldCosts، فإنك تق بأنك قرأت وفهمت وتوافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام التطبيق."
                  : "By using the WorldCosts application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, please do not use the application."}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.useOfServiceTitle}</h2>
              <p className="text-muted-foreground">{t.useOfServiceText}</p>
              <ul className="list-disc list-inside space-y-2 rtl:pr-4 ltr:pl-4 text-muted-foreground">
                <li>{t.useRestriction1}</li>
                <li>{t.useRestriction2}</li>
                <li>{t.useRestriction3}</li>
                <li>
                  {dir === "rtl"
                    ? "استخدام التطبيق بطريقة قد تعطل أو تضر أو تؤثر سلبًا على الخوادم أو الشبكات المتصلة بالتطبيق"
                    : "Use the application in a way that could disable, damage, or negatively affect the servers or networks connected to the application"}
                </li>
                <li>
                  {dir === "rtl"
                    ? "محاولة فك تشفير أو عكس هندسة أو تفكيك أي جزء من التطبيق"
                    : "Attempt to decrypt, reverse engineer, or disassemble any part of the application"}
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.intellectualPropertyTitle}</h2>
              <p className="text-muted-foreground">{t.intellectualPropertyText}</p>
              <p className="text-muted-foreground">
                {dir === "rtl"
                  ? "جميع العلامات التجارية والشعارات والأسماء التجارية والرسومات والنصوص والمحتويات الأخرى المستخدمة في التطبيق هي ملك لـ WorldCosts أو مرخصيها."
                  : "All trademarks, logos, trade names, graphics, text, and other content used in the application are the property of WorldCosts or its licensors."}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.contactTitle}</h2>
              <p className="text-muted-foreground">{t.contactInfoTerms}</p>
              <p className="text-muted-foreground">
                {dir === "rtl"
                  ? "نحن نقدر ملاحظاتك واقتراحاتك. إذا كان لديك أي أسئلة أو تعليقات حول هذه الشروط، فلا تتردد في التواصل معنا."
                  : "We value your feedback and suggestions. If you have any questions or comments about these terms, feel free to reach out to us."}
              </p>
            </div>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
