"use client"

import { ArrowLeft, Files, Settings, Zap, Mail } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { AppLogo } from "@/components/app-logo"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"

export default function AdminPage() {
  const { t, dir } = useLanguage()

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <Link href="/">
            <TeslaButton variant="secondary" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-10">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              {t.backToHome}
            </TeslaButton>
          </Link>
          <AppLogo size={32} className="sm:hidden" />
          <AppLogo size={40} className="hidden sm:block" />
        </div>

        <TeslaCard className="max-w-6xl mx-auto mb-4 sm:mb-6">
          <TeslaCardHeader className="pb-2 sm:pb-4">
            <TeslaCardTitle className="text-xl sm:text-2xl">{t.adminDashboard || "لوحة الإدارة"}</TeslaCardTitle>
          </TeslaCardHeader>
          <TeslaCardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Link href="/admin/files" className="block w-full">
                <TeslaCard className="h-full hover:bg-card/90 transition-colors cursor-pointer">
                  <TeslaCardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                    <div className="bg-muted p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Files className="h-5 w-5 sm:h-6 sm:w-6 text-tesla-blue" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium">{t.fileManagement}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.viewAndManageFiles}</p>
                    </div>
                  </TeslaCardContent>
                </TeslaCard>
              </Link>

              <Link href="/admin/settings" className="block w-full">
                <TeslaCard className="h-full hover:bg-card/90 transition-colors cursor-pointer">
                  <TeslaCardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                    <div className="bg-muted p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-tesla-blue" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium">{t.settings}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.configureAppSettings}</p>
                    </div>
                  </TeslaCardContent>
                </TeslaCard>
              </Link>

              <Link href="/admin/smtp" className="block w-full">
                <TeslaCard className="h-full hover:bg-card/90 transition-colors cursor-pointer">
                  <TeslaCardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                    <div className="bg-muted p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-tesla-blue" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium">إعدادات SMTP</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">تكوين إعدادات البريد الإلكتروني</p>
                    </div>
                  </TeslaCardContent>
                </TeslaCard>
              </Link>

              <Link href="/admin/subscription" className="block w-full sm:col-span-2 lg:col-span-1">
                <TeslaCard className="h-full hover:bg-card/90 transition-colors cursor-pointer border-tesla-blue">
                  <TeslaCardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-tesla-blue" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-medium">{t.upgradeToProVersion || "الترقية إلى النسخة الاحترافية"}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">{t.manageSubscription || "إدارة اشتراكك والترقية إلى خطط مميزة"}</p>
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
