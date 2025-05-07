"use client"

import { ArrowLeft, Files, Settings, Zap } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { AppLogo } from "@/components/app-logo"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"

export default function AdminPage() {
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

        <TeslaCard className="max-w-6xl mx-auto mb-6">
          <TeslaCardHeader>
            <TeslaCardTitle className="text-2xl">{t.adminPanel}</TeslaCardTitle>
          </TeslaCardHeader>
          <TeslaCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/files">
                <TeslaCard className="h-full hover:bg-card/90 transition-colors cursor-pointer">
                  <TeslaCardContent className="flex items-center gap-4 p-6">
                    <div className="bg-muted p-3 rounded-full">
                      <Files className="h-6 w-6 text-tesla-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{t.fileManagement}</h3>
                      <p className="text-sm text-muted-foreground">{t.viewAndManageFiles}</p>
                    </div>
                  </TeslaCardContent>
                </TeslaCard>
              </Link>

              <Link href="/admin/settings">
                <TeslaCard className="h-full hover:bg-card/90 transition-colors cursor-pointer">
                  <TeslaCardContent className="flex items-center gap-4 p-6">
                    <div className="bg-muted p-3 rounded-full">
                      <Settings className="h-6 w-6 text-tesla-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{t.settings}</h3>
                      <p className="text-sm text-muted-foreground">{t.configureAppSettings}</p>
                    </div>
                  </TeslaCardContent>
                </TeslaCard>
              </Link>

              <Link href="/admin/subscription">
                <TeslaCard className="h-full hover:bg-card/90 transition-colors cursor-pointer border-tesla-blue">
                  <TeslaCardContent className="flex items-center gap-4 p-6">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                      <Zap className="h-6 w-6 text-tesla-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{t.upgradeAccount}</h3>
                      <p className="text-sm text-muted-foreground">{t.upgradeToProVersion}</p>
                    </div>
                  </TeslaCardContent>
                </TeslaCard>
              </Link>
            </div>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
