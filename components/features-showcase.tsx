"use client"

import type React from "react"

import { Calculator, Globe, FileText, Zap } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"

export function FeaturesShowcase() {
  const { t, dir, language } = useLanguage()

  // استخدام التاريخ المناسب حسب اللغة
  const getFormattedDate = () => {
    if (language === "ar") {
      return "١١ أبريل ٢٠٢٥ في ٠٨:٣٣ م"
    } else if (language === "fr") {
      return "11 avril 2025 à 20:33"
    } else if (language === "de") {
      return "11. April 2025 um 20:33 Uhr"
    } else {
      return "April 11, 2025 at 8:33 PM"
    }
  }

  return (
    <TeslaCard className="w-full">
      <TeslaCardHeader>
        <TeslaCardTitle className="text-xl font-medium">
          {t.appTitle} {t.features || "Features"}
        </TeslaCardTitle>
      </TeslaCardHeader>
      <TeslaCardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureItem
              icon={<Calculator className="h-6 w-6 text-tesla-blue" />}
              title={language === "ar" ? "حساب التكاليف التفصيلية" : t.feature1}
              description={
                language === "ar"
                  ? "احسب تكلفة منتجاتك بدقة بما في ذلك تكلفة الوحدة والتعبئة والشحن والجمارك"
                  : t.feature1Description ||
                    "Calculate your product costs accurately including unit cost, packaging, shipping, and customs"
              }
            />

            <FeatureItem
              icon={<Globe className="h-6 w-6 text-tesla-blue" />}
              title={language === "ar" ? "دعم متعدد العملات" : t.feature2}
              description={
                language === "ar"
                  ? "تحويل العملات في الوقت الفعلي باستخدام أحدث أسعار الصرف"
                  : t.feature2Description || "Real-time currency conversion using the latest exchange rates"
              }
            />

            <FeatureItem
              icon={<FileText className="h-6 w-6 text-tesla-blue" />}
              title={language === "ar" ? "تقارير مهنية" : t.feature3}
              description={
                language === "ar"
                  ? "تصميم التقارير المهنية وتحميلها كملف PDF مع إمكانية إضافة شعار الشركة ومعلوماتها"
                  : t.feature3Description ||
                    "Design professional reports and download them as PDF with company logo and information"
              }
            />

            <FeatureItem
              icon={<Zap className="h-6 w-6 text-tesla-blue" />}
              title={language === "ar" ? "واجهة سهلة وسريعة" : t.feature4}
              description={
                language === "ar"
                  ? "واجهة سهلة الاستخدام ومتوفرة بلغات متعددة"
                  : t.feature4Description || "User-friendly interface available in multiple languages"
              }
            />
          </div>

          <div className="text-sm text-muted-foreground text-center pt-4 border-t border-border">
            <span className="block text-center">
              {t.lastUpdated}: {getFormattedDate()}
            </span>
          </div>
        </div>
      </TeslaCardContent>
    </TeslaCard>
  )
}

interface FeatureItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="bg-muted rounded-xl p-4 flex items-start gap-4 transition-all hover:bg-muted/80 hover:shadow-lg">
      <div className="bg-card p-3 rounded-full">{icon}</div>
      <div>
        <h3 className="font-medium text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}
