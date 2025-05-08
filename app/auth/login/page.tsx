"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, LogIn } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardFooter, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { AppLogo } from "@/components/app-logo"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // الحصول على URL الإحالة من معلمات البحث
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  
  // تعيين URL الإحالة عند تحميل الصفحة
  useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get('redirect')
      setRedirectUrl(redirect)
    }
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: t.loginError || "خطأ في تسجيل الدخول",
        description: t.enterEmailPassword || "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        throw error
      }
      
      toast({
        title: t.loginSuccess || "تم تسجيل الدخول بنجاح",
        description: t.welcomeBack || "مرحبًا بعودتك!",
      })
      
      // إعادة التوجيه إلى الصفحة السابقة أو الصفحة الرئيسية
      if (redirectUrl) {
        router.push(redirectUrl)
      } else {
        router.push("/admin")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      
      let errorMessage = t.loginFailed || "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى."
      
      if (error.message === "Invalid login credentials") {
        errorMessage = t.invalidCredentials || "بيانات الاعتماد غير صالحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور."
      }
      
      toast({
        title: t.loginError || "خطأ في تسجيل الدخول",
        description: errorMessage,
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
              {t.backToAdmin || "العودة إلى لوحة التحكم"}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-md mx-auto">
          <TeslaCardHeader className="text-center">
            <TeslaCardTitle className="text-2xl">
              {t.login || "تسجيل الدخول"}
            </TeslaCardTitle>
          </TeslaCardHeader>
          
          <TeslaCardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {t.password || "كلمة المرور"}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t.enterPassword || "أدخل كلمة المرور"}
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    {t.login || "تسجيل الدخول"}
                  </>
                )}
              </TeslaButton>
            </form>
          </TeslaCardContent>
          
          <TeslaCardFooter className="text-center">
            <p className="text-sm text-muted-foreground">
              {t.dontHaveAccount || "ليس لديك حساب؟"}{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                {t.register || "التسجيل"}
              </Link>
            </p>
          </TeslaCardFooter>
        </TeslaCard>
      </div>
    </div>
  )
}
