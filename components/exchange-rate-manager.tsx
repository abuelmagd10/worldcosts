"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Edit2, RefreshCw, Save, X } from "lucide-react"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n/language-context"
import { useToast } from "@/components/ui/use-toast"
import { type ExchangeRates, refreshExchangeRates } from "@/app/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FALLBACK_RATES } from "@/lib/exchange-rates"

interface ExchangeRateManagerProps {
  rates: ExchangeRates | null
  onRatesUpdate: (rates: ExchangeRates) => void
  isRefreshing: boolean
  onRefresh: () => Promise<void>
}

export function ExchangeRateManager({ rates, onRatesUpdate, isRefreshing, onRefresh }: ExchangeRateManagerProps) {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [editedRates, setEditedRates] = useState<ExchangeRates | null>(null)
  const [activeTab, setActiveTab] = useState("middle-east")

  useEffect(() => {
    if (rates) {
      setEditedRates({ ...rates })
    }
  }, [rates])

  if (!rates || !editedRates) return null

  const handleRateChange = (currency: keyof ExchangeRates, value: string) => {
    if (currency === "lastUpdated") return

    const numValue = Number.parseFloat(value)
    if (isNaN(numValue) || numValue <= 0) return

    setEditedRates((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [currency]: numValue,
      }
    })
  }

  const handleSave = () => {
    if (!editedRates) return

    // تحديث التاريخ
    const updatedRates = {
      ...editedRates,
      lastUpdated: new Date().toISOString(),
    }

    onRatesUpdate(updatedRates)
    setOpen(false)

    // حفظ الأسعار المخصصة في التخزين المحلي
    try {
      localStorage.setItem("custom_exchange_rates", JSON.stringify(updatedRates))
    } catch (e) {
      console.error("Error saving custom rates:", e)
    }

    toast({
      title: t.ratesUpdated || "تم تحديث الأسعار",
      description: t.customRatesUpdated || "تم تحديث أسعار الصرف المخصصة بنجاح",
    })
  }

  const handleReset = async () => {
    try {
      // إعادة تعيين الأسعار إلى القيم الافتراضية
      const freshRates = await refreshExchangeRates()
      onRatesUpdate(freshRates)
      setEditedRates(freshRates)

      // حذف الأسعار المخصصة من التخزين المحلي
      localStorage.removeItem("custom_exchange_rates")

      toast({
        title: t.ratesReset || "تم إعادة تعيين الأسعار",
        description: t.ratesResetDesc || "تم إعادة تعيين أسعار الصرف إلى القيم الافتراضية",
      })
    } catch (error) {
      console.error("Error resetting rates:", error)
      toast({
        title: t.errorUpdatingRates,
        description: t.errorResettingRates || "حدث خطأ أثناء إعادة تعيين أسعار الصرف",
        variant: "destructive",
      })
    }
  }

  // تحديد ما إذا كانت العملة تستخدم سعر صرف افتراضي
  const isUsingFallbackRate = (currency: keyof ExchangeRates): boolean => {
    if (currency === "lastUpdated" || currency === "USD") return false
    return Math.abs(rates[currency] - FALLBACK_RATES[currency]) < 0.001
  }

  // تجميع العملات حسب المنطقة
  const middleEastCurrencies: (keyof ExchangeRates)[] = [
    "EGP",
    "AED",
    "SAR",
    "KWD",
    "QAR",
    "ILS",
    "JOD",
    "LBP",
    "MAD",
    "OMR",
    "BHD",
    "DZD",
    "TND",
  ]

  const americaEuropeCurrencies: (keyof ExchangeRates)[] = ["USD", "EUR", "GBP", "CAD", "CHF"]

  const asiaPacificCurrencies: (keyof ExchangeRates)[] = ["JPY", "CNY", "AUD", "INR", "MYR"]

  const otherCurrencies: (keyof ExchangeRates)[] = ["RUB", "TRY", "BRL"]

  // تنسيق اسم العملة
  const formatCurrencyName = (currency: keyof ExchangeRates): string => {
    const names: Record<string, string> = {
      USD: "دولار أمريكي",
      EGP: "جنيه مصري",
      AED: "درهم إماراتي",
      EUR: "يورو",
      GBP: "جنيه إسترليني",
      SAR: "ريال سعودي",
      JPY: "ين ياباني",
      CNY: "يوان صيني",
      CAD: "دولار كندي",
      AUD: "دولار أسترالي",
      CHF: "فرنك سويسري",
      INR: "روبية هندية",
      RUB: "روبل روسي",
      TRY: "ليرة تركية",
      BRL: "ريال برازيلي",
      KWD: "دينار كويتي",
      QAR: "ريال قطري",
      MYR: "رينجيت ماليزي",
      ILS: "شيكل إسرائيلي",
      JOD: "دينار أردني",
      LBP: "ليرة لبنانية",
      MAD: "درهم مغربي",
      OMR: "ريال عماني",
      BHD: "دينار بحريني",
      DZD: "دينار جزائري",
      TND: "دينار تونسي",
    }
    return names[currency] || currency
  }

  return (
    <>
      <TeslaButton variant="secondary" size="sm" onClick={() => setOpen(true)} className="flex items-center gap-1">
        <Edit2 className="h-4 w-4" />
        {t.manageExchangeRates || "إدارة أسعار الصرف"}
      </TeslaButton>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card text-foreground border-border" dir={dir}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Edit2 className="h-5 w-5" />
              {t.manageExchangeRates || "إدارة أسعار الصرف"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t.manageExchangeRatesDesc ||
                "يمكنك تعديل أسعار الصرف يدويًا أو تحديثها تلقائيًا. العملات التي تستخدم أسعار افتراضية مميزة بعلامة تحذير."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">
                {t.fallbackRateIndicator || "تشير إلى استخدام سعر صرف افتراضي"}
              </span>
            </div>
            <TeslaButton variant="secondary" size="sm" onClick={onRefresh} disabled={isRefreshing} className="h-8 px-2">
              <RefreshCw
                className={`h-4 w-4 ${dir === "rtl" ? "ml-1" : "mr-1"} ${isRefreshing ? "animate-spin" : ""}`}
              />
              {t.updateRates}
            </TeslaButton>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="middle-east">{t.middleEast || "الشرق الأوسط"}</TabsTrigger>
              <TabsTrigger value="america-europe">{t.americaEurope || "أمريكا وأوروبا"}</TabsTrigger>
              <TabsTrigger value="asia-pacific">{t.asiaPacific || "آسيا والمحيط الهادئ"}</TabsTrigger>
              <TabsTrigger value="other">{t.other || "أخرى"}</TabsTrigger>
            </TabsList>

            <TabsContent value="middle-east" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {middleEastCurrencies.map((currency) => (
                  <div key={currency} className="space-y-2">
                    <Label htmlFor={`rate-${currency}`} className="text-muted-foreground flex items-center gap-1">
                      {formatCurrencyName(currency)} ({currency})
                      {isUsingFallbackRate(currency) && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </Label>
                    <div className="tesla-input p-1">
                      <Input
                        id={`rate-${currency}`}
                        value={editedRates[currency].toString()}
                        onChange={(e) => handleRateChange(currency, e.target.value)}
                        dir="ltr"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="america-europe" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {americaEuropeCurrencies.map((currency) => (
                  <div key={currency} className="space-y-2">
                    <Label htmlFor={`rate-${currency}`} className="text-muted-foreground flex items-center gap-1">
                      {formatCurrencyName(currency)} ({currency})
                      {isUsingFallbackRate(currency) && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </Label>
                    <div className="tesla-input p-1">
                      <Input
                        id={`rate-${currency}`}
                        value={editedRates[currency].toString()}
                        onChange={(e) => handleRateChange(currency, e.target.value)}
                        disabled={currency === "USD"} // لا يمكن تعديل الدولار الأمريكي لأنه العملة الأساسية
                        dir="ltr"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="asia-pacific" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {asiaPacificCurrencies.map((currency) => (
                  <div key={currency} className="space-y-2">
                    <Label htmlFor={`rate-${currency}`} className="text-muted-foreground flex items-center gap-1">
                      {formatCurrencyName(currency)} ({currency})
                      {isUsingFallbackRate(currency) && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </Label>
                    <div className="tesla-input p-1">
                      <Input
                        id={`rate-${currency}`}
                        value={editedRates[currency].toString()}
                        onChange={(e) => handleRateChange(currency, e.target.value)}
                        dir="ltr"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherCurrencies.map((currency) => (
                  <div key={currency} className="space-y-2">
                    <Label htmlFor={`rate-${currency}`} className="text-muted-foreground flex items-center gap-1">
                      {formatCurrencyName(currency)} ({currency})
                      {isUsingFallbackRate(currency) && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    </Label>
                    <div className="tesla-input p-1">
                      <Input
                        id={`rate-${currency}`}
                        value={editedRates[currency].toString()}
                        onChange={(e) => handleRateChange(currency, e.target.value)}
                        dir="ltr"
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className={`flex ${dir === "rtl" ? "flex-row-reverse" : "flex-row"} sm:justify-end gap-2 mt-4`}>
            <TeslaButton onClick={handleSave} className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              {t.saveRates || "حفظ الأسعار"}
            </TeslaButton>
            <TeslaButton variant="secondary" onClick={handleReset} className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4" />
              {t.resetRates || "إعادة تعيين"}
            </TeslaButton>
            <TeslaButton variant="secondary" onClick={() => setOpen(false)} className="flex items-center gap-1">
              <X className="h-4 w-4" />
              {t.cancel}
            </TeslaButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
