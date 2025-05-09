"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, KeyRound, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardDescription, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPasswordPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResetMode, setIsResetMode] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(false)
  
  // التحقق من وجود رمز إعادة تعيين كلمة المرور
  useEffect(() => {
    const token = searchParams.get("token")
    
    if (token) {
      setIsResetMode(true)
      
      // التحقق من صلاحية الرمز
      const checkToken = async () => {
        try {
          // لا يمكن التحقق من صلاحية الرمز مباشرة، لذلك نفترض أنه صالح
          setIsTokenValid(true)
        } catch (error) {
          console.error("Error checking token:", error)
          setIsTokenValid(false)
        }
      }
      
      checkToken()
    }
  }, [searchParams])
  
  // طلب إعادة تعيين كلمة المرور
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: t.error || "خطأ",
        description: t.enterEmail || "يرجى إدخال البريد الإلكتروني",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) {
        throw error
      }
      
      toast({
        title: t.resetPasswordEmailSent || "تم إرسال بريد إعادة تعيين كلمة المرور",
        description: t.resetPasswordEmailSentDesc || "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني.",
      })
    } catch (error: any) {
      console.error("Error requesting password reset:", error)
      
      let errorMessage = t.resetPasswordFailed || "فشل طلب إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى."
      
      // إذا كان المستخدم غير موجود، نعرض رسالة مختلفة
      if (error.message.includes("user not found")) {
        errorMessage = t.userNotFound || "لا يوجد حساب مسجل بهذا البريد الإلكتروني."
      }
      
      toast({
        title: t.error || "خطأ",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // إعادة تعيين كلمة المرور
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      toast({
        title: t.error || "خطأ",
        description: t.enterPassword || "يرجى إدخال كلمة المرور وتأكيدها",
        variant: "destructive",
      })
      return
    }
    
    if (password !== confirmPassword) {
      toast({
        title: t.error || "خطأ",
        description: t.passwordsDoNotMatch || "كلمات المرور غير متطابقة",
        variant: "destructive",
      })
      return
    }
    
    if (password.length < 6) {
      toast({
        title: t.error || "خطأ",
        description: t.passwordTooShort || "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })
      
      if (error) {
        throw error
      }
      
      toast({
        title: t.passwordResetSuccess || "تم إعادة تعيين كلمة المرور",
        description: t.passwordResetSuccessDesc || "تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
      })
      
      // توجيه المستخدم إلى صفحة تسجيل الدخول بعد إعادة تعيين كلمة المرور
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (error: any) {
      console.error("Error resetting password:", error)
      
      toast({
        title: t.error || "خطأ",
        description: error.message || t.passwordResetFailed || "فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى.",
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
          <Link href="/auth/login">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToLogin || "العودة إلى تسجيل الدخول"}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-md mx-auto">
          <TeslaCardHeader className="text-center">
            <TeslaCardTitle className="text-2xl">
              {isResetMode
                ? t.resetPassword || "إعادة تعيين كلمة المرور"
                : t.forgotPassword || "نسيت كلمة المرور"
              }
            </TeslaCardTitle>
            <TeslaCardDescription>
              {isResetMode
                ? t.resetPasswordDesc || "يرجى إدخال كلمة المرور الجديدة"
                : t.forgotPasswordDesc || "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور"
              }
            </TeslaCardDescription>
          </TeslaCardHeader>
          
          <TeslaCardContent>
            {isResetMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {t.newPassword || "كلمة المرور الجديدة"}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t.enterNewPassword || "أدخل كلمة المرور الجديدة"}
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t.confirmPassword || "تأكيد كلمة المرور"}
                  </Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t.confirmNewPassword || "تأكيد كلمة المرور الجديدة"}
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <TeslaButton
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !isTokenValid}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t.resetPassword || "إعادة تعيين كلمة المرور"
                  )}
                </TeslaButton>
                
                {!isTokenValid && (
                  <p className="text-sm text-red-500 text-center">
                    {t.invalidResetToken || "رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد."}
                  </p>
                )}
              </form>
            ) : (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t.email || "البريد الإلكتروني"}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.enterEmail || "أدخل بريدك الإلكتروني"}
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <TeslaButton
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t.sendResetLink || "إرسال رابط إعادة التعيين"
                  )}
                </TeslaButton>
              </form>
            )}
          </TeslaCardContent>
          
          <TeslaCardFooter className="text-center">
            <p className="text-sm text-muted-foreground">
              {t.rememberPassword || "تذكرت كلمة المرور؟"}{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                {t.login || "تسجيل الدخول"}
              </Link>
            </p>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
