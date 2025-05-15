"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Save, User, CreditCard } from "lucide-react"
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
  TeslaCardDescription,
} from "@/components/ui/tesla-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// تعريف واجهات البيانات
interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  registrationDate: string;
  lastLogin: string;
  isActive: boolean;
}

interface UserSubscription {
  planId: string;
  planName: string;
  billingCycle: string;
  status: string;
  currentPeriodEnd: string;
  isActive: boolean;
}

export default function SettingsPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage if available
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        try {
          return JSON.parse(savedSettings);
        } catch (e) {
          console.error('Error parsing saved settings:', e);
        }
      }
    }

    // Default settings
    return {
      enableFileTracking: true,
      maxFileSize: 5, // MB
      allowedFileTypes: "jpg,jpeg,png,pdf",
      autoDeleteOldFiles: false,
      autoDeleteDays: 30,
    };
  });

  // جلب بيانات المستخدم والاشتراك عند تحميل الصفحة
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // جلب معلومات المستخدم
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error fetching user:", userError)
          return
        }

        if (user) {
          // تنسيق بيانات المستخدم
          setUserProfile({
            id: user.id,
            fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            registrationDate: new Date(user.created_at).toLocaleDateString(),
            lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '-',
            isActive: user.confirmed_at != null,
          })

          // جلب معلومات الاشتراك
          try {
            // محاولة جلب البيانات من جدول user_subscriptions أولاً
            let subscriptionData = null;
            let subscriptionError = null;

            try {
              const result = await supabase
                .from("user_subscriptions")
                .select("*")
                .eq("user_id", user.id)
                .single();

              subscriptionData = result.data;
              subscriptionError = result.error;

              // إذا كان هناك خطأ وكان الخطأ هو أن الجدول غير موجود
              if (subscriptionError && subscriptionError.message.includes("does not exist")) {
                console.log("Table user_subscriptions does not exist, trying subscriptions table");

                // محاولة جلب البيانات من جدول subscriptions
                const subscriptionsResult = await supabase
                  .from("subscriptions")
                  .select("*")
                  .eq("user_id", user.id)
                  .single();

                subscriptionData = subscriptionsResult.data;
                subscriptionError = subscriptionsResult.error;
              }
            } catch (error) {
              console.error("Error in subscription query:", error);
            }

            // التحقق من وجود بيانات الاشتراك
            if (subscriptionError) {
              // رمز PGRST116 يعني "لم يتم العثور على نتائج" وهذا متوقع إذا لم يكن المستخدم مشتركًا
              if (subscriptionError.code !== 'PGRST116' &&
                  !subscriptionError.message.includes("does not exist")) {
                console.error("Error fetching subscription:", subscriptionError.message);
              }
            } else if (subscriptionData) {
              // تنسيق بيانات الاشتراك
              setUserSubscription({
                planId: subscriptionData.plan_id,
                planName: subscriptionData.plan_name || 'Pro',
                billingCycle: subscriptionData.billing_cycle || 'monthly',
                status: subscriptionData.status || 'active',
                currentPeriodEnd: subscriptionData.current_period_end ?
                  (typeof subscriptionData.current_period_end === 'number' ?
                    new Date(subscriptionData.current_period_end * 1000).toLocaleDateString() :
                    new Date(subscriptionData.current_period_end).toLocaleDateString()) :
                  '-',
                isActive: subscriptionData.status === 'active',
              });
            }
          } catch (error) {
            console.error("Error fetching subscription data:", error);
          }
        }
      } catch (error) {
        console.error("Error in fetchUserData:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Save settings to localStorage
      localStorage.setItem('appSettings', JSON.stringify(settings));

      // Simulate network delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: t.settingsSaved,
        description: t.settingsSavedDesc,
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: t.settingsError,
        description: t.settingsErrorDesc,
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
              {t.backToAdmin}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        {/* بطاقة معلومات المستخدم */}
        {userProfile && (
          <TeslaCard className="max-w-3xl mx-auto mb-6">
            <TeslaCardHeader className="flex flex-row items-center gap-4">
              <User className="h-8 w-8 text-primary" />
              <div>
                <TeslaCardTitle>{t.userInformation}</TeslaCardTitle>
                <TeslaCardDescription>{t.userProfile}</TeslaCardDescription>
              </div>
            </TeslaCardHeader>
            <TeslaCardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">{t.fullName}</Label>
                    <p className="font-medium">{userProfile.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.emailAddress}</Label>
                    <p className="font-medium">{userProfile.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">{t.registrationDate}</Label>
                    <p className="font-medium">{userProfile.registrationDate}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.lastLogin}</Label>
                    <p className="font-medium">{userProfile.lastLogin}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.accountStatus}</Label>
                    <div>
                      <Badge variant={userProfile.isActive ? "default" : "destructive"}>
                        {userProfile.isActive ? t.active : t.inactive}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TeslaCardContent>
          </TeslaCard>
        )}

        {/* بطاقة معلومات الاشتراك */}
        <TeslaCard className="max-w-3xl mx-auto mb-6">
          <TeslaCardHeader className="flex flex-row items-center gap-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <TeslaCardTitle>{t.subscriptionInformation}</TeslaCardTitle>
              <TeslaCardDescription>{t.currentPlanDetails}</TeslaCardDescription>
            </div>
          </TeslaCardHeader>
          <TeslaCardContent>
            {userSubscription ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">{t.planName}</Label>
                    <p className="font-medium">{userSubscription.planName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.billingPeriod}</Label>
                    <p className="font-medium">
                      {userSubscription.billingCycle === 'monthly' ? t.monthlyBilling : t.yearlyBilling}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">{t.nextBillingDate}</Label>
                    <p className="font-medium">{userSubscription.currentPeriodEnd}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">{t.subscriptionStatus}</Label>
                    <div>
                      <Badge variant={userSubscription.isActive ? "default" : "outline"}>
                        {userSubscription.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">{t.notSubscribed}</p>
                <Badge variant="outline" className="mb-4">{t.freeUser}</Badge>
                <div className="flex flex-col gap-2 items-center">
                  <Link href="/admin/subscription">
                    <TeslaButton variant="default">{t.upgradeNow}</TeslaButton>
                  </Link>

                  {/* زر لإنشاء بيانات اختبارية للاشتراك - للتطوير فقط */}
                  {userProfile && (
                    <TeslaButton
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const response = await fetch(`/api/setup-test-data?userId=${userProfile.id}`);
                          const data = await response.json();

                          if (data.success) {
                            toast({
                              title: "تم إنشاء بيانات اختبارية",
                              description: "تم إنشاء بيانات اختبارية للاشتراك بنجاح. قم بتحديث الصفحة لرؤية التغييرات.",
                            });

                            // تحديث الصفحة بعد ثانيتين
                            setTimeout(() => {
                              window.location.reload();
                            }, 2000);
                          } else {
                            toast({
                              title: "خطأ",
                              description: data.error || "حدث خطأ أثناء إنشاء بيانات اختبارية للاشتراك",
                              variant: "destructive",
                            });
                          }
                        } catch (error) {
                          console.error("Error creating test data:", error);
                          toast({
                            title: "خطأ",
                            description: "حدث خطأ أثناء إنشاء بيانات اختبارية للاشتراك",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      إنشاء بيانات اختبارية للاشتراك
                    </TeslaButton>
                  )}
                </div>
              </div>
            )}
          </TeslaCardContent>
        </TeslaCard>

        {/* بطاقة إعدادات التطبيق */}
        <TeslaCard className="max-w-3xl mx-auto">
          <TeslaCardHeader>
            <TeslaCardTitle className="text-2xl">{t.appSettings}</TeslaCardTitle>
          </TeslaCardHeader>
          <TeslaCardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{t.fileSettings}</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableFileTracking">{t.enableFileTracking}</Label>
                  <p className="text-sm text-muted-foreground">{t.trackAllUploadedFiles}</p>
                </div>
                <Switch
                  id="enableFileTracking"
                  checked={settings.enableFileTracking}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableFileTracking: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxFileSize">{t.maxFileSizeMB}</Label>
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
                <Label htmlFor="allowedFileTypes">{t.allowedFileTypes}</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
                  placeholder="jpg,jpeg,png,pdf"
                />
                <p className="text-xs text-muted-foreground">{t.enterFileExtensions}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoDeleteOldFiles">{t.autoDeleteOldFiles}</Label>
                  <p className="text-sm text-muted-foreground">{t.deleteOldFilesAfterPeriod}</p>
                </div>
                <Switch
                  id="autoDeleteOldFiles"
                  checked={settings.autoDeleteOldFiles}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoDeleteOldFiles: checked })}
                />
              </div>

              {settings.autoDeleteOldFiles && (
                <div className="grid gap-2">
                  <Label htmlFor="autoDeleteDays">{t.deleteFilesAfterDays}</Label>
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
              {t.saveSettings}
            </TeslaButton>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
