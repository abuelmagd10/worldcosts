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
import { FeaturesShowcase } from "@/components/features-showcase"

export default function AboutUs() {
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
            <div className="flex items-center gap-4">
              <AppLogo size={60} />
              <div>
                <TeslaCardTitle className="text-2xl">WorldCosts</TeslaCardTitle>
                <TeslaCardDescription className="text-muted-foreground">{t.aboutUsSubtitle}</TeslaCardDescription>
              </div>
            </div>
          </TeslaCardHeader>
          <TeslaCardContent className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.ourMissionTitle}</h2>
              <p className="text-muted-foreground">{t.ourMissionText}</p>
            </div>

            <FeaturesShowcase />

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.whatWeOfferTitle}</h2>
              <p className="text-muted-foreground">{t.whatWeOfferText}</p>
              <ul className="list-disc list-inside space-y-2 rtl:pr-4 ltr:pl-4 text-muted-foreground">
                <li>{t.feature1}</li>
                <li>{t.feature2}</li>
                <li>{t.feature3}</li>
                <li>{t.feature4}</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.ourStoryTitle}</h2>
              <p className="text-muted-foreground">{t.ourStoryText}</p>
              <p className="mt-2 text-muted-foreground">
                {dir === "rtl"
                  ? "تم تطوير WorldCosts استجابة للتحديات التي يواجهها المصنعون والتجار والمستوردون عند التعامل مع العملات المتعددة. نحن نفهم أن حساب التكاليف الدقيقة للمنتجات يمكن أن يكون معقدًا، خاصة عندما تتضمن عناصر مثل الشحن والضرائب والجمارك بعملات مختلفة."
                  : "WorldCosts was developed in response to the challenges faced by manufacturers, traders, and importers when dealing with multiple currencies. We understand that calculating accurate product costs can be complex, especially when it involves elements like shipping, taxes, and customs in different currencies."}
              </p>
              <p className="text-muted-foreground">
                {dir === "rtl"
                  ? "يتيح تطبيقنا للمستخدمين إدارة هذه التعقيدات بسهولة، مما يوفر الوقت ويقلل من الأخطاء ويساعد في اتخاذ قرارات أفضل للأعمال."
                  : "Our application allows users to manage these complexities with ease, saving time, reducing errors, and helping make better business decisions."}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t.contactUsTitle}</h2>
              <p className="text-muted-foreground">{t.contactUsText}</p>
              <div className="flex flex-col space-y-2 text-muted-foreground">
                <span>{t.email}: info@worldcosts.com</span>
                <span>{t.website}: www.worldcosts.com</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">{t.copyrightText} &copy; 2023 WorldCosts</p>
            </div>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
