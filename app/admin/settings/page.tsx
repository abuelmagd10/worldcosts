"use client"

import { useState } from "react"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { AppLogo } from "@/components/app-logo"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  TeslaCard,
  TeslaCardContent,
  TeslaCardHeader,
  TeslaCardTitle,
  TeslaCardFooter,
} from "@/components/ui/tesla-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    enableFileTracking: true,
    maxFileSize: 5, // MB
    allowedFileTypes: "jpg,jpeg,png,pdf",
    autoDeleteOldFiles: false,
    autoDeleteDays: 30,
  })

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simular guardado de configuración
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "تم الحفظ",
        description: "تم حفظ الإعدادات بنجاح",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              العودة إلى لوحة الإدارة
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-3xl mx-auto">
          <TeslaCardHeader>
            <TeslaCardTitle className="text-2xl">إعدادات التطبيق</TeslaCardTitle>
          </TeslaCardHeader>
          <TeslaCardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">إعدادات الملفات</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableFileTracking">تمكين تتبع الملفات</Label>
                  <p className="text-sm text-muted-foreground">تتبع جميع الملفات المرفوعة وتخزين معلوماتها</p>
                </div>
                <Switch
                  id="enableFileTracking"
                  checked={settings.enableFileTracking}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableFileTracking: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxFileSize">الحد الأقصى لحجم الملف (ميجابايت)</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({ ...settings, maxFileSize: Number(e.target.value) })}
                  min={1}
                  max={50}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="allowedFileTypes">أنواع الملفات المسموح بها</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                  placeholder="jpg,jpeg,png,pdf"
                />
                <p className="text-xs text-muted-foreground">أدخل امتدادات الملفات مفصولة بفواصل</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoDeleteOldFiles">حذف الملفات القديمة تلقائيًا</Label>
                  <p className="text-sm text-muted-foreground">حذف الملفات القديمة بعد فترة محددة</p>
                </div>
                <Switch
                  id="autoDeleteOldFiles"
                  checked={settings.autoDeleteOldFiles}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoDeleteOldFiles: checked })}
                />
              </div>

              {settings.autoDeleteOldFiles && (
                <div className="grid gap-2">
                  <Label htmlFor="autoDeleteDays">حذف الملفات بعد (أيام)</Label>
                  <Input
                    id="autoDeleteDays"
                    type="number"
                    value={settings.autoDeleteDays}
                    onChange={(e) => setSettings({ ...settings, autoDeleteDays: Number(e.target.value) })}
                    min={1}
                    max={365}
                  />
                </div>
              )}
            </div>
          </TeslaCardContent>
          <TeslaCardFooter>
            <TeslaButton onClick={handleSaveSettings} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              حفظ الإعدادات
            </TeslaButton>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
