"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, CreditCard, Settings, LogOut, Shield, AlertTriangle, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardDescription, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export default function AccountPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [isResuming, setIsResuming] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
  })

  // جلب معلومات المستخدم والاشتراك عند تحميل الصفحة
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // جلب معلومات المستخدم
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw userError
        }
        
        if (!user) {
          // إذا لم يكن المستخدم مسجل الدخول، توجيهه إلى صفحة تسجيل الدخول
          router.push("/auth/login?redirect=/admin/account")
          return
        }
        
        setUser(user)
        setProfile({
          fullName: user.user_metadata?.full_name || "",
          email: user.email || "",
        })
        
        // جلب معلومات الاشتراك
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single()
        
        if (subscriptionError && subscriptionError.code !== "PGRST116") {
          console.error("Error fetching subscription:", subscriptionError)
        }
        
        setSubscription(subscriptionData || null)
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: t.error || "خطأ",
          description: t.errorFetchingUserData || "حدث خطأ أثناء جلب بيانات المستخدم",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [router, t, toast])

  // تحديث الملف الشخصي
  const updateProfile = async () => {
    if (!user) return
    
    setIsUpdating(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
        },
      })
      
      if (error) {
        throw error
      }
      
      toast({
        title: t.profileUpdated || "تم تحديث الملف الشخصي",
        description: t.profileUpdatedDesc || "تم تحديث معلومات الملف الشخصي بنجاح",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: t.errorUpdatingProfile || "خطأ في تحديث الملف الشخصي",
        description: error.message || t.errorUpdatingProfileDesc || "حدث خطأ أثناء تحديث الملف الشخصي",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // إلغاء الاشتراك
  const cancelSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return
    
    setIsCanceling(true)
    
    try {
      const response = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to cancel subscription")
      }
      
      const data = await response.json()
      
      // تحديث حالة الاشتراك في الواجهة
      setSubscription({
        ...subscription,
        cancel_at_period_end: true,
      })
      
      toast({
        title: t.subscriptionCanceled || "تم إلغاء الاشتراك",
        description: t.subscriptionCanceledDesc || "سيتم إلغاء اشتراكك في نهاية فترة الفوترة الحالية",
      })
    } catch (error: any) {
      console.error("Error canceling subscription:", error)
      toast({
        title: t.errorCancelingSubscription || "خطأ في إلغاء الاشتراك",
        description: error.message || t.errorCancelingSubscriptionDesc || "حدث خطأ أثناء إلغاء الاشتراك",
        variant: "destructive",
      })
    } finally {
      setIsCanceling(false)
    }
  }

  // استئناف الاشتراك
  const resumeSubscription = async () => {
    if (!subscription?.stripe_subscription_id) return
    
    setIsResuming(true)
    
    try {
      const response = await fetch("/api/stripe/resume-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || "Failed to resume subscription")
      }
      
      const data = await response.json()
      
      // تحديث حالة الاشتراك في الواجهة
      setSubscription({
        ...subscription,
        cancel_at_period_end: false,
      })
      
      toast({
        title: t.subscriptionResumed || "تم استئناف الاشتراك",
        description: t.subscriptionResumedDesc || "تم استئناف اشتراكك بنجاح",
      })
    } catch (error: any) {
      console.error("Error resuming subscription:", error)
      toast({
        title: t.errorResumingSubscription || "خطأ في استئناف الاشتراك",
        description: error.message || t.errorResumingSubscriptionDesc || "حدث خطأ أثناء استئناف الاشتراك",
        variant: "destructive",
      })
    } finally {
      setIsResuming(false)
    }
  }

  // تسجيل الخروج
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast({
        title: t.errorSigningOut || "خطأ في تسجيل الخروج",
        description: error.message || t.errorSigningOutDesc || "حدث خطأ أثناء تسجيل الخروج",
        variant: "destructive",
      })
    }
  }

  // تنسيق تاريخ انتهاء الاشتراك
  const formatExpiryDate = (timestamp: number) => {
    if (!timestamp) return ""
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  // تحديد حالة الاشتراك
  const getSubscriptionStatus = () => {
    if (!subscription) return t.noActiveSubscription || "لا يوجد اشتراك نشط"
    
    if (subscription.status === "active") {
      if (subscription.cancel_at_period_end) {
        return t.canceledRenew || "تم إلغاء التجديد"
      }
      return t.active || "نشط"
    }
    
    if (subscription.status === "trialing") return t.trial || "فترة تجريبية"
    if (subscription.status === "past_due") return t.pastDue || "متأخر الدفع"
    if (subscription.status === "canceled") return t.canceled || "ملغي"
    
    return subscription.status
  }

  // تحديد لون شارة حالة الاشتراك
  const getStatusBadgeVariant = () => {
    if (!subscription) return "secondary"
    
    if (subscription.status === "active") {
      if (subscription.cancel_at_period_end) return "warning"
      return "success"
    }
    
    if (subscription.status === "trialing") return "info"
    if (subscription.status === "past_due") return "destructive"
    if (subscription.status === "canceled") return "outline"
    
    return "secondary"
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/admin">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToAdmin || "العودة إلى لوحة التحكم"}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-4xl mx-auto">
          <TeslaCardHeader>
            <TeslaCardTitle>{t.accountSettings || "إعدادات الحساب"}</TeslaCardTitle>
            <TeslaCardDescription>{t.accountSettingsDesc || "إدارة حسابك واشتراكك"}</TeslaCardDescription>
          </TeslaCardHeader>
          
          <TeslaCardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t.profile || "الملف الشخصي"}
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {t.subscription || "الاشتراك"}
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t.security || "الأمان"}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t.fullName || "الاسم الكامل"}</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.email || "البريد الإلكتروني"}</Label>
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">{t.emailChangeNote || "لا يمكن تغيير البريد الإلكتروني"}</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <TeslaButton onClick={updateProfile} disabled={isUpdating}>
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          t.saveChanges || "حفظ التغييرات"
                        )}
                      </TeslaButton>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="subscription" className="mt-6 space-y-6">
                  {subscription ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{subscription.plan_name || t.premiumPlan || "الخطة المتميزة"}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subscription.billing_cycle === "monthly" ? t.monthlyBilling || "فوترة شهرية" : t.yearlyBilling || "فوترة سنوية"}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant() as any}>
                          {getSubscriptionStatus()}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-muted-foreground">{t.currentPeriodEnd || "نهاية الفترة الحالية"}:</div>
                        <div>{formatExpiryDate(subscription.current_period_end)}</div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        {subscription.cancel_at_period_end ? (
                          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                              <div>
                                <h4 className="font-medium">{t.subscriptionCanceled || "تم إلغاء الاشتراك"}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {t.subscriptionCanceledNote || `سينتهي اشتراكك في ${formatExpiryDate(subscription.current_period_end)} ولن يتم تجديده تلقائيًا.`}
                                </p>
                                <TeslaButton
                                  variant="outline"
                                  className="mt-2"
                                  onClick={resumeSubscription}
                                  disabled={isResuming}
                                >
                                  {isResuming ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    t.resumeSubscription || "استئناف الاشتراك"
                                  )}
                                </TeslaButton>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <TeslaButton variant="outline" className="w-full">
                                {t.cancelSubscription || "إلغاء الاشتراك"}
                              </TeslaButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t.cancelSubscriptionConfirm || "هل أنت متأكد من إلغاء الاشتراك؟"}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t.cancelSubscriptionNote || "سيظل اشتراكك نشطًا حتى نهاية فترة الفوترة الحالية، ثم لن يتم تجديده تلقائيًا."}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t.cancel || "إلغاء"}</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={cancelSubscription}
                                  disabled={isCanceling}
                                >
                                  {isCanceling ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    t.confirm || "تأكيد"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        <Link href="/admin/subscription">
                          <TeslaButton variant="outline" className="w-full">
                            {t.changePlan || "تغيير الخطة"}
                          </TeslaButton>
                        </Link>
                        
                        <Link href="https://billing.stripe.com/p/login/test_28o5nC8Ot2Hl0Za288" target="_blank">
                          <TeslaButton variant="outline" className="w-full">
                            {t.managePaymentMethods || "إدارة طرق الدفع"}
                          </TeslaButton>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 space-y-4">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-semibold">{t.noActiveSubscription || "لا يوجد اشتراك نشط"}</h3>
                      <p className="text-sm text-muted-foreground">{t.noActiveSubscriptionDesc || "ليس لديك اشتراك نشط حاليًا."}</p>
                      <Link href="/admin/subscription">
                        <TeslaButton>
                          {t.viewPlans || "عرض الخطط"}
                        </TeslaButton>
                      </Link>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="security" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>{t.emailNotifications || "إشعارات البريد الإلكتروني"}</Label>
                        <p className="text-sm text-muted-foreground">{t.emailNotificationsDesc || "تلقي إشعارات عبر البريد الإلكتروني"}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Link href="/auth/reset-password">
                        <TeslaButton variant="outline" className="w-full">
                          {t.changePassword || "تغيير كلمة المرور"}
                        </TeslaButton>
                      </Link>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <TeslaButton
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t.signOut || "تسجيل الخروج"}
                      </TeslaButton>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
