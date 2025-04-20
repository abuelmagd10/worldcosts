"use client"

import { Calculator } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaCard, TeslaCardContent } from "@/components/ui/tesla-card"

export function EmptyState() {
  const { t, dir } = useLanguage()

  return (
    <TeslaCard className="w-full max-w-md mx-auto my-8 text-center">
      <TeslaCardContent className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-6">
          <Calculator className="h-8 w-8 text-gray-600 dark:text-gray-300" />
        </div>
        <h3 className="text-2xl font-medium mb-4">{t.appTitle}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-2">{t.appDescription}</p>
        <p className="text-muted-foreground text-center max-w-md">{t.emptyStateDescription}</p>
      </TeslaCardContent>
    </TeslaCard>
  )
}
