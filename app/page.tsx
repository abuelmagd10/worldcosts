"use client"

import Link from "next/link"
import { TableCell } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"
import { Table, TableBody, TableHeader, TableHead } from "@/components/ui/table"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select, SelectItem as SelectItemComponent } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useRef, useEffect } from "react"
import {
  RefreshCw,
  FileDown,
  Building2,
  Pencil,
  Trash2,
  Info,
  Shield,
  FileText,
  Plus,
  Calculator,
  AlertTriangle,
} from "lucide-react"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  TeslaCard,
  TeslaCardContent,
  TeslaCardFooter,
  TeslaCardHeader,
  TeslaCardTitle,
} from "@/components/ui/tesla-card"
import { getExchangeRates, refreshExchangeRates, type ExchangeRates } from "./actions"
// تحديث استيراد الوظائف من ملف pdf-generator
import { generatePDF } from "@/lib/pdf-generator"
import { useToast } from "@/components/ui/use-toast"
import { CompanyInfoDialog, type CompanyInfo } from "@/components/company-info-dialog"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/lib/i18n/language-context"
import { RegisterSW } from "@/components/pwa/register-sw"
import { OfflineAlert } from "@/components/pwa/offline-alert"
import { AdBanner } from "@/components/adsense/ad-banner"
import { AppLogo } from "@/components/app-logo"
import { ItemsChart } from "@/components/items-chart"
// استيراد مكون تبديل السمة
import { ThemeToggle } from "@/components/theme-toggle"
// أضف استيراد مكون FeaturesShowcase
import { FeaturesShowcase } from "@/components/features-showcase"
// استيراد مكون موافقة ملفات تعريف الارتباط
import { CookieConsentBanner } from "@/components/cookie-consent-banner"
import { formatNumber } from "@/lib/utils"
// Importar el componente de historial de cálculos
import { CalculationHistory } from "@/components/calculation-history"
import { ExchangeRateManager } from "@/components/exchange-rate-manager"
import { isUsingFallbackRate, getCustomRates, saveCustomRates } from "@/lib/exchange-rates"

type Currency =
  | "USD"
  | "EGP"
  | "AED"
  | "EUR"
  | "GBP"
  | "SAR"
  | "JPY"
  | "CNY"
  | "CAD"
  | "AUD"
  | "CHF"
  | "INR"
  | "RUB"
  | "TRY"
  | "BRL"
  | "KWD"
  | "QAR"
  | "MYR"
  | "ILS"
  | "JOD"
  | "LBP"
  | "MAD"
  | "OMR"
  | "BHD"
  | "DZD"
  | "TND"
type Item = {
  id: number
  name: string
  value: number
  currency: Currency
  originalValue: string
}

export default function CurrencyCalculator() {
  const { t, dir, language } = useLanguage()
  const [items, setItems] = useState<Item[]>([])
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [currency, setCurrency] = useState<Currency>("USD")
  const [totalCurrency, setTotalCurrency] = useState<Currency>("USD")
  const [nextId, setNextId] = useState(1)
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [companyInfoDialogOpen, setCompanyInfoDialogOpen] = useState(false)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    address: "",
    phone: "",
    pdfFileName: "",
  })
  const tableRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [editingItemId, setEditingItemId] = useState<number | null>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now())

  // استرجاع البيانات المحفوظة عند تحميل الصفحة
  useEffect(() => {
    // استرجاع العناصر المحفوظة
    try {
      const savedItemsStr = localStorage.getItem("saved_items")
      if (savedItemsStr) {
        const savedItems = JSON.parse(savedItemsStr) as Item[]
        if (savedItems && savedItems.length > 0) {
          setItems(savedItems)
          setNextId(Math.max(...savedItems.map((item) => item.id)) + 1)
        }
      }

      // استرجاع العملة المحددة
      const savedCurrency = localStorage.getItem("selected_currency") as Currency
      if (savedCurrency) {
        setTotalCurrency(savedCurrency)
      }

      // استرجاع معلومات الشركة
      const savedCompanyInfoStr = localStorage.getItem("company_info")
      if (savedCompanyInfoStr) {
        const savedCompanyInfo = JSON.parse(savedCompanyInfoStr) as CompanyInfo
        if (savedCompanyInfo && savedCompanyInfo.name) {
          setCompanyInfo(savedCompanyInfo)
        }
      }

      // استرجاع أسعار الصرف المخصصة
      const customRates = getCustomRates()
      if (customRates) {
        setRates(customRates)
      } else {
        fetchRates()
      }
    } catch (e) {
      console.error("Error loading saved data:", e)
      fetchRates()
    }
  }, [])

  // حفظ البيانات عند تغييرها
  useEffect(() => {
    if (items.length > 0) {
      try {
        localStorage.setItem("saved_items", JSON.stringify(items))
      } catch (e) {
        console.error("Error saving items:", e)
      }
    }
  }, [items])

  useEffect(() => {
    try {
      localStorage.setItem("selected_currency", totalCurrency)
    } catch (e) {
      console.error("Error saving currency:", e)
    }
  }, [totalCurrency])

  useEffect(() => {
    if (companyInfo.name) {
      try {
        localStorage.setItem("company_info", JSON.stringify(companyInfo))
      } catch (e) {
        console.error("Error saving company info:", e)
      }
    }
  }, [companyInfo])

  const fetchRates = async (forceRefresh = false) => {
    try {
      setIsLoading(true)
      const fetchedRates = forceRefresh ? await refreshExchangeRates() : await getExchangeRates()
      setRates(fetchedRates)
      setLastUpdateTime(Date.now())
    } catch (error) {
      console.error("Failed to fetch rates:", error)
      toast({
        title: t.errorUpdatingRates,
        description: t.errorUpdatingRatesDesc,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // إضافة تنبيه عند استخدام أسعار صرف افتراضية
  // أضف هذا الكود في وظيفة handleRefreshRates بعد محاولة تحديث الأسعار

  const handleRefreshRates = async () => {
    setIsRefreshing(true)
    try {
      const updatedRates = await refreshExchangeRates()
      setRates({ ...updatedRates })
      setLastUpdateTime(Date.now())

      // التحقق مما إذا كان هناك عملات تستخدم قيمًا افتراضية
      if (updatedRates) {
        // تحقق مما إذا كانت البيانات تم جلبها من API أم من القيم الافتراضية
        const fetchedFromDefaultValues =
          updatedRates.lastUpdated && new Date(updatedRates.lastUpdated).getTime() < Date.now() - 86400000 // أكثر من يوم

        if (fetchedFromDefaultValues) {
          toast({
            title: t.usingFallbackRates || "جاري استخدام أسعار صرف افتراضية",
            description: t.someRatesMayBeOutdated || "بعض أسعار الصرف قد تكون قديمة أو غير دقيقة بسبب مشاكل في الاتصال",
            variant: "warning",
          })
        } else {
          toast({
            title: t.ratesUpdated || "تم تحديث الأسعار",
            description: t.ratesUpdatedDesc || "تم تحديث أسعار الصرف بنجاح",
          })
        }
      }
    } catch (error) {
      console.error("Error al actualizar las tasas:", error)
      toast({
        title: t.errorUpdatingRates,
        description: t.errorUpdatingRatesDesc,
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Calculate the value from a mathematical expression
  const calculateValue = (expression: string): number => {
    try {
      // استخدام Function بشكل صحيح لتقييم التعبير الرياضي
      return Function('"use strict"; return (' + expression + ")")()
    } catch (error) {
      console.error("Error calculating value:", error)
      return 0
    }
  }

  const handleAddItem = () => {
    if (!name.trim() || !value.trim() || !rates) return

    const calculatedValue = calculateValue(value)

    if (editingItemId !== null) {
      setItems(
        items.map((item) =>
          item.id === editingItemId
            ? {
                ...item,
                name,
                value: calculatedValue,
                currency,
                originalValue: value,
              }
            : item,
        ),
      )
      setEditingItemId(null)
    } else {
      setItems([
        ...items,
        {
          id: nextId,
          name,
          value: calculatedValue,
          currency,
          originalValue: value,
        },
      ])
      setNextId(nextId + 1)
    }

    setName("")
    setValue("")
  }

  const handleReset = () => {
    setItems([])
    setName("")
    setValue("")
    setCurrency("USD")
    setNextId(1)
    // حذف البيانات المحفوظة
    try {
      localStorage.removeItem("saved_items")
    } catch (e) {
      console.error("Error removing saved items:", e)
    }
  }

  // Calculate totals in different currencies
  const calculateTotals = () => {
    if (!rates)
      return {
        USD: 0,
        EGP: 0,
        AED: 0,
        EUR: 0,
        GBP: 0,
        SAR: 0,
        JPY: 0,
        CNY: 0,
        CAD: 0,
        AUD: 0,
        CHF: 0,
        INR: 0,
        RUB: 0,
        TRY: 0,
        BRL: 0,
        KWD: 0,
        QAR: 0,
        MYR: 0,
        // Nuevas divisas
        ILS: 0,
        JOD: 0,
        LBP: 0,
        MAD: 0,
        OMR: 0,
        BHD: 0,
        DZD: 0,
        TND: 0,
      }

    const totalInUSD = items.reduce((sum, item) => {
      if (item.currency === "USD") return sum + item.value
      return sum + item.value / rates[item.currency]
    }, 0)

    return {
      USD: totalInUSD,
      EGP: totalInUSD * rates.EGP,
      AED: totalInUSD * rates.AED,
      EUR: totalInUSD * rates.EUR,
      GBP: totalInUSD * rates.GBP,
      SAR: totalInUSD * rates.SAR,
      JPY: totalInUSD * rates.JPY,
      CNY: totalInUSD * rates.CNY,
      CAD: totalInUSD * rates.CAD,
      AUD: totalInUSD * rates.AUD,
      CHF: totalInUSD * rates.CHF,
      INR: totalInUSD * rates.INR,
      RUB: totalInUSD * rates.RUB,
      TRY: totalInUSD * rates.TRY,
      BRL: totalInUSD * rates.BRL,
      KWD: totalInUSD * rates.KWD,
      QAR: totalInUSD * rates.QAR,
      MYR: totalInUSD * rates.MYR,
      // Nuevas divisas
      ILS: totalInUSD * rates.ILS,
      JOD: totalInUSD * rates.JOD,
      LBP: totalInUSD * rates.LBP,
      MAD: totalInUSD * rates.MAD,
      OMR: totalInUSD * rates.OMR,
      BHD: totalInUSD * rates.BHD,
      DZD: totalInUSD * rates.DZD,
      TND: totalInUSD * rates.TND,
    }
  }

  const totals = calculateTotals()

  // Format the last updated date
  const formatLastUpdated = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString)
        return new Date().toLocaleString(
          language === "ar" ? "ar-EG" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        )
      }

      return date.toLocaleString(
        language === "ar" ? "ar-EG" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      )
    } catch (error) {
      console.error("Error formatting date:", error)
      return new Date().toLocaleString(
        language === "ar" ? "ar-EG" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      )
    }
  }

  // تعديل وظيفة handleDownloadPDF
  const handleDownloadPDF = async () => {
    if (items.length === 0 || !rates) {
      toast({
        title: t.fileDownloadError,
        description: t.noItemsToExport || "لا توجد عناصر لتصديرها. يرجى إضافة عناصر أولاً.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingPDF(true)
    try {
      // عرض رسالة بدء التوليد
      toast({
        title: t.generatingPDF || "جاري إنشاء ملف PDF",
        description: t.pleaseWait || "يرجى الانتظار...",
      })

      // استخدام وظيفة إنشاء PDF
      await generatePDF({
        items,
        totals,
        selectedTotalCurrency: totalCurrency,
        rates,
        lastUpdated: rates.lastUpdated,
        companyInfo,
        t,
        dir,
      })

      // عرض رسالة نجاح
      toast({
        title: t.fileDownloadSuccess,
        description: t.fileDownloadSuccessDesc,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)

      // عرض رسالة خطأ مفصلة
      toast({
        title: t.fileDownloadError,
        description: `${t.fileDownloadErrorDesc} ${error instanceof Error ? error.message : ""}`,
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Handle saving company info
  const handleSaveCompanyInfo = (info: CompanyInfo) => {
    setCompanyInfo(info)
    try {
      localStorage.setItem("company_info", JSON.stringify(info))
    } catch (e) {
      console.error("Error saving company info:", e)
    }
    toast({
      title: t.companyInfoSaved,
      description: t.companyInfoSavedDesc,
    })
  }

  const hasCompanyInfo = !!(companyInfo.name || companyInfo.address || companyInfo.phone || companyInfo.logo)

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
    if (editingItemId === id) {
      setEditingItemId(null)
      setName("")
      setValue("")
      setCurrency("USD")
    }
  }

  const handleEditItem = (item: Item) => {
    setName(item.name)
    setValue(item.originalValue)
    setCurrency(item.currency)
    setEditingItemId(item.id)
  }

  const handleCancelEdit = () => {
    setEditingItemId(null)
    setName("")
    setValue("")
    setCurrency("USD")
  }

  // Get currency symbol
  const getCurrencySymbol = (currency: Currency): string => {
    switch (currency) {
      case "USD":
        return "$"
      case "EGP":
        return "ج.م"
      case "AED":
        return "د.إ"
      case "EUR":
        return "€"
      case "GBP":
        return "£"
      case "SAR":
        return "ر.س"
      case "JPY":
        return "¥"
      case "CNY":
        return "¥"
      case "CAD":
        return "C$"
      case "AUD":
        return "A$"
      case "CHF":
        return "CHF"
      case "INR":
        return "₹"
      case "RUB":
        return "₽"
      case "TRY":
        return "₺"
      case "BRL":
        return "R$"
      case "KWD":
        return "د.ك"
      case "QAR":
        return "ر.ق"
      case "MYR":
        return "RM"
      // Nuevas divisas
      case "ILS":
        return "₪"
      case "JOD":
        return "د.أ"
      case "LBP":
        return "ل.ل"
      case "MAD":
        return "د.م."
      case "OMR":
        return "ر.ع."
      case "BHD":
        return "د.ب"
      case "DZD":
        return "د.ج"
      case "TND":
        return "د.ت"
      default:
        return ""
    }
  }

  // Currency groups
  const currencyGroups = [
    {
      label: "الشرق الأوسط وشمال أفريقيا",
      currencies: ["EGP", "AED", "SAR", "KWD", "QAR", "ILS", "JOD", "LBP", "MAD", "OMR", "BHD", "DZD", "TND"],
    },
    {
      label: "أمريكا وأوروبا",
      currencies: ["USD", "EUR", "GBP", "CAD", "CHF"],
    },
    {
      label: "آسيا والمحيط الهادئ",
      currencies: ["JPY", "CNY", "AUD", "INR", "MYR"],
    },
    {
      label: "أخرى",
      currencies: ["RUB", "TRY", "BRL"],
    },
  ]

  // Get currency name
  const getCurrencyName = (code: Currency): string => {
    const names: Record<Currency, string> = {
      USD: t.usd,
      EGP: t.egp,
      AED: t.aed,
      EUR: t.eur,
      GBP: t.gbp,
      SAR: t.sar,
      JPY: t.jpy,
      CNY: t.cny,
      CAD: t.cad,
      AUD: t.aud,
      CHF: t.chf,
      INR: t.inr,
      RUB: t.rub,
      TRY: t.try,
      BRL: t.brl,
      KWD: t.kwd,
      QAR: t.qar,
      MYR: t.myr,
      // Nuevas divisas
      ILS: t.ils,
      JOD: t.jod,
      LBP: t.lbp,
      MAD: t.mad,
      OMR: t.omr,
      BHD: t.bhd,
      DZD: t.dzd,
      TND: t.tnd,
    }
    return names[code]
  }

  useEffect(() => {
    if (rates) {
      console.log("Re-rendering with new date:", rates.lastUpdated)
    }
  }, [lastUpdateTime, rates])

  // Añadir una función para cargar el historial
  const loadHistoryItems = (historyItems: Item[], historyCurrency: Currency) => {
    setItems(historyItems)
    setTotalCurrency(historyCurrency)
    setNextId(Math.max(...historyItems.map((item) => item.id)) + 1)
  }

  // إضافة وظيفة لتصدير البيانات بتنسيق CSV
  const handleExportCSV = () => {
    if (items.length === 0) {
      toast({
        title: t.fileDownloadError,
        description: t.noItemsToExport || "لا توجد عناصر لتصديرها. يرجى إضافة عناصر أولاً.",
        variant: "destructive",
      })
      return
    }

    try {
      // إنشاء محتوى CSV
      const headers = [t.itemName, t.inputValue, t.calculatedValue, t.currency]
      const rows = items.map((item) => [
        item.name,
        item.originalValue,
        formatNumber(item.value, "en", true),
        getCurrencyName(item.currency),
      ])

      // تحويل البيانات إلى نص CSV
      let csvContent = headers.join(",") + "\n"
      csvContent += rows.map((row) => row.join(",")).join("\n")

      // إنشاء رابط تنزيل
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `WorldCosts_${new Date().toISOString().slice(0, 10)}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: t.fileDownloadSuccess,
        description: t.csvDownloadSuccessDesc || "تم تنزيل ملف CSV بنجاح.",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: t.fileDownloadError,
        description: t.csvDownloadErrorDesc || "حدث خطأ أثناء تصدير البيانات. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    }
  }

  const handleCustomRatesUpdate = (updatedRates: ExchangeRates) => {
    setRates(updatedRates)
    saveCustomRates(updatedRates)
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <AdBanner adSlot="7996815600" className="mb-6 mt-2" minContentLength={300} items={items} />

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-between w-full mb-4">
            <div className="flex items-center">
              <AppLogo size={40} />
              <h1 className="text-2xl font-bold mr-3">WorldCosts</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TeslaCard className="md:col-span-2">
            <TeslaCardHeader>
              <div className="flex flex-col items-center">
                <TeslaCardTitle className="text-xl font-medium mb-2">{t.appTitle}</TeslaCardTitle>
                {rates && (
                  <div className="flex flex-col items-center w-full">
                    <span className="text-sm text-muted-foreground mb-2">
                      {t.lastUpdated}: {formatLastUpdated(rates.lastUpdated)}
                    </span>
                    <div className="flex gap-2">
                      <TeslaButton
                        variant="secondary"
                        size="sm"
                        onClick={handleRefreshRates}
                        disabled={isRefreshing}
                        className="h-8 px-2"
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${dir === "rtl" ? "ml-1" : "mr-1"} ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        {t.updateRates}
                      </TeslaButton>
                      <ExchangeRateManager
                        rates={rates}
                        onRatesUpdate={handleCustomRatesUpdate}
                        isRefreshing={isRefreshing}
                        onRefresh={handleRefreshRates}
                      />
                    </div>
                  </div>
                )}
              </div>
            </TeslaCardHeader>
            <TeslaCardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 bg-[#282b2e]" />
                      <Skeleton className="h-10 w-full bg-[#282b2e]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 bg-[#282b2e]" />
                      <Skeleton className="h-10 w-full bg-[#282b2e]" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 bg-[#282b2e]" />
                      <Skeleton className="h-10 w-full bg-[#282b2e]" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full bg-[#282b2e]" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-muted-foreground">
                        {t.itemName}
                      </Label>
                      <div className="tesla-input p-1">
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.itemName}
                          dir={dir}
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value" className="text-muted-foreground">
                        {t.itemValue}
                      </Label>
                      <div className="tesla-input p-1">
                        <Input
                          id="value"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder="850/1000"
                          dir="ltr"
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-muted-foreground">
                        {t.currency}
                      </Label>
                      <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                        <SelectTrigger
                          id="currency"
                          className="tesla-input border-0 bg-transparent focus:ring-0 text-foreground"
                        >
                          <SelectValue placeholder={t.currency} />
                        </SelectTrigger>
                        <SelectContent className="bg-muted border-border">
                          {currencyGroups.map((group) => (
                            <div key={group.label} className="px-2 py-1.5">
                              <p className="text-sm font-medium text-muted-foreground mb-1">{group.label}</p>
                              {group.currencies.map((code) => (
                                <SelectItemComponent
                                  key={code}
                                  value={code}
                                  className="text-foreground focus:bg-[#282b2e]"
                                >
                                  {getCurrencyName(code as Currency)} ({getCurrencySymbol(code as Currency)})
                                  {rates && isUsingFallbackRate(code as keyof ExchangeRates, rates) && (
                                    <AlertTriangle className="h-3 w-3 text-amber-500 inline-block ml-1" />
                                  )}
                                </SelectItemComponent>
                              ))}
                              {group !== currencyGroups[currencyGroups.length - 1] && (
                                <div className="h-px bg-[#282b2e] my-1" />
                              )}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <TeslaButton onClick={handleAddItem} className="flex-1 flex items-center justify-center">
                      <Plus className="h-4 w-4 mr-2" />
                      {editingItemId !== null ? t.updateItem : t.addItem}
                    </TeslaButton>
                    {editingItemId !== null && (
                      <TeslaButton variant="secondary" onClick={handleCancelEdit}>
                        {t.cancel}
                      </TeslaButton>
                    )}
                  </div>
                </>
              )}
            </TeslaCardContent>
          </TeslaCard>

          {!isLoading && items.length >= 5 && (
            <AdBanner adSlot="7996815600" className="my-4" minContentLength={300} items={items} />
          )}

          {!isLoading && items.length > 0 ? (
            <>
              <TeslaCard className="md:col-span-2">
                <TeslaCardHeader>
                  <div className="flex items-center justify-between">
                    <TeslaCardTitle className="text-xl font-medium">{t.addedItems}</TeslaCardTitle>
                    <div className="flex gap-2">
                      <TeslaButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setCompanyInfoDialogOpen(true)}
                        className="flex items-center gap-1"
                      >
                        <Building2 className="h-4 w-4" />
                        {hasCompanyInfo ? t.editCompanyInfo : t.addCompanyInfo}
                      </TeslaButton>
                      <TeslaButton size="sm" onClick={handleDownloadPDF} disabled={isGeneratingPDF}>
                        <FileDown
                          className={`h-4 w-4 ${dir === "rtl" ? "ml-1" : "mr-1"} ${
                            isGeneratingPDF ? "animate-spin" : ""
                          }`}
                        />
                        {t.downloadPDF}
                      </TeslaButton>
                      <TeslaButton variant="secondary" size="sm" onClick={handleExportCSV}>
                        <FileDown className={`h-4 w-4 ${dir === "rtl" ? "ml-1" : "mr-1"}`} />
                        {t.exportCSV || "تصدير CSV"}
                      </TeslaButton>
                    </div>
                  </div>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <div className="bg-muted rounded-xl overflow-x-auto p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border">
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground`}>
                            {t.itemName}
                          </TableHead>
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground`}>
                            {t.inputValue}
                          </TableHead>
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground`}>
                            {t.calculatedValue}
                          </TableHead>
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground`}>
                            {t.currency}
                          </TableHead>
                          <TableHead className="text-right text-muted-foreground">{t.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id} className="border-b border-border">
                            <TableCell className={`font-medium ${dir === "rtl" ? "text-right" : "text-left"}`}>
                              {item.name}
                            </TableCell>
                            <TableCell className={dir === "rtl" ? "text-right" : "text-left"}>
                              {item.originalValue}
                            </TableCell>
                            <TableCell className={dir === "rtl" ? "text-right" : "text-left"}>
                              {formatNumber(item.value, language)}
                            </TableCell>
                            <TableCell className={dir === "rtl" ? "text-right" : "text-left"}>
                              {getCurrencyName(item.currency)}
                              {rates && isUsingFallbackRate(item.currency, rates) && (
                                <AlertTriangle className="h-3 w-3 text-amber-500 inline-block mr-1" />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TeslaButton
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleEditItem(item)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">{t.edit}</span>
                                </TeslaButton>
                                <TeslaButton
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">{t.delete}</span>
                                </TeslaButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TeslaCardContent>
                <TeslaCardFooter className="mt-4">
                  <div className="w-full md:w-auto">
                    <TeslaButton variant="secondary" onClick={handleReset} className="w-full md:w-auto">
                      {t.reset}
                    </TeslaButton>
                  </div>
                </TeslaCardFooter>
              </TeslaCard>

              <TeslaCard>
                <TeslaCardHeader>
                  <TeslaCardTitle className="text-xl font-medium">{t.totalAmount}</TeslaCardTitle>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <div className="bg-muted rounded-xl p-6 text-center">
                    <p className="text-muted-foreground mb-2">{t[`in${totalCurrency}` as keyof typeof t]}</p>
                    <p className="text-4xl font-bold text-tesla-blue">
                      {formatNumber(totals[totalCurrency], language)} {getCurrencySymbol(totalCurrency)}
                    </p>
                  </div>
                </TeslaCardContent>
                <TeslaCardFooter className="mt-4">
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground mb-2">{t.selectTotalCurrency}</p>
                    <Select value={totalCurrency} onValueChange={(value) => setTotalCurrency(value as Currency)}>
                      <SelectTrigger
                        id="totalCurrency"
                        className="tesla-input border-0 bg-transparent focus:ring-0 w-full text-foreground"
                      >
                        <SelectValue placeholder={t.selectTotalCurrency} />
                      </SelectTrigger>
                      <SelectContent className="bg-muted border-border">
                        {currencyGroups.map((group) => (
                          <div key={group.label} className="px-2 py-1.5">
                            <p className="text-sm font-medium text-muted-foreground mb-1">{group.label}</p>
                            {group.currencies.map((code) => (
                              <SelectItemComponent
                                key={code}
                                value={code}
                                className="text-foreground focus:bg-[#282b2e]"
                              >
                                {getCurrencyName(code as Currency)} ({getCurrencySymbol(code as Currency)})
                              </SelectItemComponent>
                            ))}
                            {group !== currencyGroups[currencyGroups.length - 1] && (
                              <div className="h-px bg-[#282b2e] my-1" />
                            )}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TeslaCardFooter>
              </TeslaCard>

              {items.length > 0 && (
                <AdBanner adSlot="1234567890" className="my-6" adFormat="fluid" minContentLength={200} items={items} />
              )}

              <TeslaCard>
                <TeslaCardHeader>
                  <TeslaCardTitle className="text-xl font-medium">{t.chartTitle}</TeslaCardTitle>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <ItemsChart items={items} getCurrencyName={(code) => getCurrencyName(code as Currency)} />
                </TeslaCardContent>
              </TeslaCard>

              <CalculationHistory
                currentItems={items}
                totalCurrency={totalCurrency}
                totalValue={totals[totalCurrency]}
                onLoadHistory={loadHistoryItems}
                getCurrencyName={getCurrencyName}
                getCurrencySymbol={getCurrencySymbol}
              />
            </>
          ) : (
            !isLoading && (
              <TeslaCard className="md:col-span-2">
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
          )}
          {!isLoading && items.length === 0 && (
            <div className="md:col-span-2 mt-6">
              <FeaturesShowcase />
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <Link href="/about">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              {t.aboutUs}
            </TeslaButton>
          </Link>
          <Link href="/privacy">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              {t.privacyPolicy}
            </TeslaButton>
          </Link>
          <Link href="/terms">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {t.termsAndConditions}
            </TeslaButton>
          </Link>
        </div>

        <div className="mt-8 mb-4">
          <AdBanner
            adSlot="7996815600"
            className="rounded-xl shadow-lg"
            style={{ minHeight: "250px" }}
            minContentLength={200}
            items={items}
          />
        </div>
      </div>

      <CompanyInfoDialog
        open={companyInfoDialogOpen}
        onOpenChange={setCompanyInfoDialogOpen}
        companyInfo={companyInfo}
        onSave={handleSaveCompanyInfo}
      />

      <CookieConsentBanner />
      <RegisterSW />
      <OfflineAlert />
    </div>
  )
}
