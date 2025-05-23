"use client"

import Link from "next/link"
import { v4 as uuidv4 } from "uuid"
import { StoredFile } from "@/lib/user-data-store"
import { TableCell as TableCellComponent } from "@/components/ui/table"
import { TableRow as TableRowComponent } from "@/components/ui/table"
import { Table, TableHeader, TableBody, TableHead } from "@/components/ui/table"
import { SelectContent } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { Select, SelectItem as SelectItemComponent } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useState, useRef, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { userDataStore } from "@/lib/user-data-store"
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
  Settings,
  CreditCard,
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
import { generatePDFWithDirectDownload, generatePDFWithDirectURL } from "@/lib/pdf-generator"
// Remove this duplicate import
// import { useToast } from "@/components/ui/use-toast"
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
import { supabase } from "@/lib/supabase-client"

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
  | "SGD"
  | "ZAR"
  | "SEK"
  | "NOK"
  | "DKK"
  | "ILS"
  | "JOD"
  | "BHD"
  | "OMR"
  | "MAD"
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

  // وظيفة لتحديث عملة المجموع وحفظها في localStorage
  const updateTotalCurrency = (currency: Currency) => {
    setTotalCurrency(currency)
    userDataStore.saveTotalCurrency(currency)
  }
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

  // تحميل البيانات المحفوظة عند تحميل المكون
  useEffect(() => {
    // تحميل العناصر
    const savedItems = userDataStore.getItems()
    if (savedItems.length > 0) {
      setItems(savedItems)
    }

    // تحميل معلومات الشركة
    const savedCompanyInfo = userDataStore.getCompanyInfo()
    if (savedCompanyInfo.name || savedCompanyInfo.address || savedCompanyInfo.phone || savedCompanyInfo.logo || savedCompanyInfo.pdfFileName) {
      console.log('Loaded company info from localStorage:', savedCompanyInfo);
      setCompanyInfo(savedCompanyInfo)
    } else {
      console.log('No company info found in localStorage');
    }

    // تحميل المعرف التالي
    const savedNextId = userDataStore.getNextId()
    if (savedNextId > 1) {
      setNextId(savedNextId)
    }

    // تحميل عملة المجموع
    const savedTotalCurrency = userDataStore.getTotalCurrency() as Currency
    if (savedTotalCurrency) {
      setTotalCurrency(savedTotalCurrency)
    }

    // تحميل أسعار الصرف
    fetchRates()
  }, [])

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

  const handleRefreshRates = async () => {
    setIsRefreshing(true)
    try {
      const updatedRates = await refreshExchangeRates()
      setRates({ ...updatedRates })
      setLastUpdateTime(Date.now())

      toast({
        title: t.ratesUpdated || "تم تحديث الأسعار",
        description: t.ratesUpdatedDesc || "تم تحديث أسعار الصرف بنجاح",
      })
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
      // استخدام Function بشكل صحيح لتقيير التعبير الرياضي
      return Function('"use strict"; return (' + expression + ")")()
    } catch (error) {
      console.error("Error calculating value:", error)
      return 0
    }
  }

  const handleAddItem = () => {
    if (!name.trim() || !value.trim() || !rates) return

    const calculatedValue = calculateValue(value)

    let updatedItems: Item[] = []

    if (editingItemId !== null) {
      updatedItems = items.map((item) =>
        item.id === editingItemId
          ? {
              ...item,
              name,
              value: calculatedValue,
              currency,
              originalValue: value,
            }
          : item,
      )
      setItems(updatedItems)
      setEditingItemId(null)
    } else {
      const newItem = {
        id: nextId,
        name,
        value: calculatedValue,
        currency,
        originalValue: value,
      }
      updatedItems = [...items, newItem]
      setItems(updatedItems)

      const newNextId = nextId + 1
      setNextId(newNextId)

      // حفظ المعرف التالي
      userDataStore.saveNextId(newNextId)
    }

    // حفظ العناصر المحدثة
    userDataStore.saveItems(updatedItems)

    setName("")
    setValue("")
  }

  const handleReset = () => {
    setItems([])
    setName("")
    setValue("")
    setCurrency("USD")
    setNextId(1)

    // مسح البيانات المحفوظة
    userDataStore.saveItems([])
    userDataStore.saveNextId(1)
    // لا نقوم بإعادة تعيين عملة المجموع
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
        SGD: 0,
        ZAR: 0,
        SEK: 0,
        NOK: 0,
        DKK: 0,
        ILS: 0,
        JOD: 0,
        BHD: 0,
        OMR: 0,
        MAD: 0,
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
      SGD: totalInUSD * rates.SGD,
      ZAR: totalInUSD * rates.ZAR,
      SEK: totalInUSD * rates.SEK,
      NOK: totalInUSD * rates.NOK,
      DKK: totalInUSD * rates.DKK,
      ILS: totalInUSD * rates.ILS,
      JOD: totalInUSD * rates.JOD,
      BHD: totalInUSD * rates.BHD,
      OMR: totalInUSD * rates.OMR,
      MAD: totalInUSD * rates.MAD,
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
    if (items.length === 0 || !rates) return

    setIsGeneratingPDF(true)
    try {
      // استخدام طريقة إنشاء PDF وإرجاع رابط مباشر
      const pdfDataUrl = await generatePDFWithDirectURL({
        items,
        totals,
        selectedTotalCurrency: totalCurrency,
        rates,
        lastUpdated: rates.lastUpdated,
        companyInfo,
        t,
        dir,
      });

      // تنزيل الملف مباشرة
      const link = document.createElement('a');
      link.href = pdfDataUrl;

      // استخدام اسم الملف الذي أدخله المستخدم إذا كان موجودًا
      let fileName = '';
      if (companyInfo?.pdfFileName && companyInfo.pdfFileName.trim() !== '') {
        // إضافة امتداد .pdf إذا لم يكن موجودًا
        fileName = companyInfo.pdfFileName.trim();
        if (!fileName.toLowerCase().endsWith('.pdf')) {
          fileName += '.pdf';
        }
      } else {
        // استخدام اسم افتراضي إذا لم يدخل المستخدم اسمًا
        fileName = `WorldCosts_${new Date().toISOString().slice(0, 10)}.pdf`;
      }

      console.log('DEBUG - Using PDF file name:', fileName);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // حفظ الملف في قاعدة البيانات وفي localStorage
      try {
        // تحويل data URL إلى Blob مباشرة
        const blob = dataURLtoBlob(pdfDataUrl);

        // حفظ معلومات الملف فقط في localStorage (بدون المحتوى)
        // هذا سيقلل بشكل كبير من حجم البيانات المخزنة
        const pdfFile: StoredFile = {
          id: uuidv4(),
          fileName: fileName,
          originalName: fileName,
          fileType: 'pdf',
          fileSize: Math.round(pdfDataUrl.length * 0.75), // تقدير تقريبي لحجم الملف
          mimeType: 'application/pdf',
          // لا نخزن المحتوى الكامل للملف في localStorage لتجنب تجاوز الحد الأقصى
          // content: pdfDataUrl,
          url: URL.createObjectURL(blob), // استخدام URL.createObjectURL بدلاً من تخزين البيانات الكاملة
          uploadDate: new Date().toISOString(),
          metadata: {
            uploadType: 'pdf',
            source: 'pdf-generator',
            items: items.length
          }
        };

        try {
          // إضافة ملف PDF إلى مخزن الملفات
          userDataStore.addFile(pdfFile);
          console.log('PDF saved to localStorage with ID:', pdfFile.id);
        } catch (storageError) {
          console.error('Error saving PDF to localStorage:', storageError);
          // عرض رسالة للمستخدم
          toast({
            title: "تنبيه",
            description: "تم تنزيل الملف بنجاح، ولكن لم يتم حفظه في قائمة الملفات بسبب امتلاء مساحة التخزين المحلية.",
            variant: "warning",
            duration: 5000,
          });
        }

        // إنشاء FormData لرفع الملف إلى الخادم
        const formData = new FormData();
        formData.append('file', blob, fileName);

        // رفع الملف إلى الخادم
        const response = await fetch('/api/local-files', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          console.error('Error saving PDF to API:', await response.text());
        } else {
          const responseData = await response.json();
          console.log('PDF saved to API successfully with ID:', responseData.id);
        }
      } catch (saveError) {
        console.error('Error saving PDF:', saveError);
      }

      toast({
        title: t.fileDownloadSuccess,
        description: t.fileDownloadSuccessDesc,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: t.fileDownloadError,
        description: t.fileDownloadErrorDesc,
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSaveCompanyInfo = async (data: CompanyInfo) => {
    try {
      // تحديث حالة معلومات الشركة في الواجهة
      setCompanyInfo({ ...data });

      // حفظ معلومات الشركة في localStorage
      userDataStore.saveCompanyInfo(data);
      console.log('Company info saved to localStorage:', data);

      // حفظ الشعار في localStorage إذا كان موجودًا
      if (data.logo) {
        try {
          // حفظ الشعار في localStorage
          const logoFile: StoredFile = {
            id: uuidv4(),
            fileName: `company-logo-${Date.now()}.png`,
            originalName: 'company-logo.png',
            fileType: 'logo',
            fileSize: Math.round(data.logo.length * 0.75), // تقدير تقريبي لحجم الملف
            mimeType: 'image/png',
            // لا نخزن المحتوى الكامل للشعار في localStorage لتجنب تجاوز الحد الأقصى
            // بدلاً من ذلك، نخزن فقط معلومات الملف
            // content: data.logo,
            url: data.logo, // استخدام base64 كـ URL
            uploadDate: new Date().toISOString(),
            metadata: {
              uploadType: 'logo',
              source: 'company-info'
            }
          };

          try {
            // إضافة الشعار إلى مخزن الملفات
            userDataStore.addFile(logoFile);
            console.log('Logo saved to localStorage with ID:', logoFile.id);
          } catch (storageError) {
            console.error('Error saving logo to localStorage:', storageError);
            // عرض رسالة للمستخدم
            toast({
              title: "تنبيه",
              description: "تم حفظ معلومات الشركة، ولكن لم يتم حفظ الشعار في قائمة الملفات بسبب امتلاء مساحة التخزين المحلية.",
              variant: "warning",
              duration: 5000,
            });
          }

          // رفع الشعار إلى API المحلي
          try {
            const formData = createFormDataFromBase64(data.logo, 'company-logo.png', 'image/png');
            const logoResponse = await fetch('/api/local-files', {
              method: 'POST',
              body: formData
            });

            if (!logoResponse.ok) {
              console.error('Error uploading logo to API:', await logoResponse.text());
            } else {
              const logoData = await logoResponse.json();
              console.log('Logo uploaded to API successfully with ID:', logoData.id);
            }
          } catch (apiError) {
            console.error('Error calling API to upload logo:', apiError);
          }
        } catch (logoError) {
          console.error('Error processing logo:', logoError);
          // استمر في التنفيذ حتى لو فشل رفع الشعار
        }
      }

      // عرض رسالة نجاح
      toast({
        title: t.saveSuccess || "تم الحفظ بنجاح",
        description: t.companyInfoSaved || "تم حفظ معلومات الشركة بنجاح",
      });
    } catch (error) {
      console.error('Error saving company info:', error);
      toast({
        title: t.saveError || "خطأ في الحفظ",
        description: t.companyInfoSaveError || "حدث خطأ أثناء حفظ معلومات الشركة",
        variant: "destructive",
      });
    }
  };

  // وظيفة مساعدة لتحويل data URL إلى Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    // استخراج نوع الملف والبيانات من data URL
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  };

  // وظيفة مساعدة لتحويل base64 إلى FormData
  const createFormDataFromBase64 = (base64Data: string, fileName: string, mimeType: string): FormData => {
    // استخراج البيانات من data URL
    const base64Content = base64Data.split(',')[1];

    // تحويل base64 إلى Blob
    const byteCharacters = atob(base64Content);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: mimeType });

    // إنشاء FormData
    const formData = new FormData();
    formData.append('file', blob, fileName);

    return formData;
  };

  const hasCompanyInfo = !!(companyInfo.name || companyInfo.address || companyInfo.phone || companyInfo.logo)

  const handleDeleteItem = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)

    // حفظ العناصر المحدثة
    userDataStore.saveItems(updatedItems)

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
    const symbols: Record<Currency, string> = {
      USD: t.symbolUSD || "$",
      EGP: t.symbolEGP || "ج.م",
      AED: t.symbolAED || "د.إ",
      EUR: t.symbolEUR || "€",
      GBP: t.symbolGBP || "£",
      SAR: t.symbolSAR || "ر.س",
      JPY: t.symbolJPY || "¥",
      CNY: t.symbolCNY || "¥",
      CAD: t.symbolCAD || "C$",
      AUD: t.symbolAUD || "A$",
      CHF: t.symbolCHF || "CHF",
      INR: t.symbolINR || "₹",
      RUB: t.symbolRUB || "₽",
      TRY: t.symbolTRY || "₺",
      BRL: t.symbolBRL || "R$",
      KWD: t.symbolKWD || "د.ك",
      QAR: t.symbolQAR || "ر.ق",
      MYR: t.symbolMYR || "RM",
      SGD: t.symbolSGD || "S$",
      ZAR: t.symbolZAR || "R",
      SEK: t.symbolSEK || "kr",
      NOK: t.symbolNOK || "kr",
      DKK: t.symbolDKK || "kr",
      ILS: t.symbolILS || "₪",
      JOD: t.symbolJOD || "د.أ",
      BHD: t.symbolBHD || "د.ب",
      OMR: t.symbolOMR || "ر.ع",
      MAD: t.symbolMAD || "د.م.",
      TND: t.symbolTND || "د.ت",
    }
    return symbols[currency] || ""
  }

  // Currency groups
  const currencyGroups = [
    {
      label: t.currencyGroupMENA,
      currencies: ["EGP", "AED", "SAR", "KWD", "QAR", "JOD", "BHD", "OMR", "MAD", "TND", "ILS"],
    },
    {
      label: t.currencyGroupAmericasEurope,
      currencies: ["USD", "EUR", "GBP", "CAD", "CHF", "SEK", "NOK", "DKK"],
    },
    {
      label: t.currencyGroupAsiaPacific,
      currencies: ["JPY", "CNY", "AUD", "INR", "MYR", "SGD"],
    },
    {
      label: t.currencyGroupOthers,
      currencies: ["RUB", "TRY", "BRL", "ZAR"],
    },
  ]

  // Get currency name
  const getCurrencyName = (code: Currency): string => {
    const names: Record<Currency, string> = {
      USD: t.usd || "دولار أمريكي",
      EGP: t.egp || "جنيه مصري",
      AED: t.aed || "درهم إماراتي",
      EUR: t.eur || "يورو",
      GBP: t.gbp || "جنيه إسترليني",
      SAR: t.sar || "ريال سعودي",
      JPY: t.jpy || "ين ياباني",
      CNY: t.cny || "يوان صيني",
      CAD: t.cad || "دولار كندي",
      AUD: t.aud || "دولار أسترالي",
      CHF: t.chf || "فرنك سويسري",
      INR: t.inr || "روبية هندية",
      RUB: t.rub || "روبل روسي",
      TRY: t.try || "ليرة تركية",
      BRL: t.brl || "ريال برازيلي",
      KWD: t.kwd || "دينار كويتي",
      QAR: t.qar || "ريال قطري",
      MYR: t.myr || "رينغيت ماليزي",
      SGD: t.sgd || "دولار سنغافوري",
      ZAR: t.zar || "راند جنوب أفريقي",
      SEK: t.sek || "كرونة سويدية",
      NOK: t.nok || "كرونة نرويجية",
      DKK: t.dkk || "كرونة دنماركية",
      ILS: t.ils || "شيكل إسرائيلي",
      JOD: t.jod || "دينار أردني",
      BHD: t.bhd || "دينار بحريني",
      OMR: t.omr || "ريال عماني",
      MAD: t.mad || "درهم مغربي",
      TND: t.tnd || "دينار تونسي",
    }
    return names[code]
  }

  useEffect(() => {
    if (rates) {
      console.log("Re-rendering with new date:", rates.lastUpdated)
    }
  }, [lastUpdateTime, rates])

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-4 sm:py-8 px-3 sm:px-4">
        {items.length >= 3 && <AdBanner adSlot="7996815600" className="mb-4 sm:mb-6" minContentLength={300} />}

        <div className="flex flex-col items-center mb-4 sm:mb-8">
          <div className="flex items-center justify-between w-full mb-2 sm:mb-4">
            <div className="flex items-center">
              <AppLogo size={32} className="sm:hidden" />
              <AppLogo size={40} className="hidden sm:block" />
              <h1 className="text-lg sm:text-2xl font-bold mr-2 sm:mr-3">WorldCosts</h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <TeslaCard className="md:col-span-2">
            <TeslaCardHeader className="pb-2 sm:pb-4">
              <div className="flex flex-col items-center">
                <TeslaCardTitle className="text-lg sm:text-xl font-medium mb-1 sm:mb-2">{t.appTitle}</TeslaCardTitle>
                {rates && (
                  <div className="flex flex-col items-center w-full">
                    <span className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      {t.lastUpdated}: {formatLastUpdated(rates.lastUpdated)}
                    </span>
                    <TeslaButton
                      variant="secondary"
                      size="sm"
                      onClick={handleRefreshRates}
                      disabled={isRefreshing}
                      className="h-7 sm:h-8 px-2 text-xs sm:text-sm"
                    >
                      <RefreshCw
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${dir === "rtl" ? "ml-1" : "mr-1"} ${isRefreshing ? "animate-spin" : ""}`}
                      />
                      {t.updateRates}
                    </TeslaButton>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="name" className="text-muted-foreground text-xs sm:text-sm">
                        {t.itemName}
                      </Label>
                      <div className="tesla-input p-1">
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.itemName}
                          dir={dir}
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground h-8 sm:h-10 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="value" className="text-muted-foreground text-xs sm:text-sm">
                        {t.itemValue}
                      </Label>
                      <div className="tesla-input p-1">
                        <Input
                          id="value"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder="850/1000"
                          dir="ltr"
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground h-8 sm:h-10 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="currency" className="text-muted-foreground text-xs sm:text-sm">
                        {t.currency}
                      </Label>
                      <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                        <SelectTrigger
                          id="currency"
                          className="tesla-input border-0 bg-transparent focus:ring-0 text-foreground h-8 sm:h-10 text-sm sm:text-base"
                        >
                          <SelectValue placeholder={t.currency} />
                        </SelectTrigger>
                        <SelectContent className="bg-muted border-border max-h-[40vh] sm:max-h-[50vh]">
                          {currencyGroups.map((group) => (
                            <div key={group.label} className="px-2 py-1 sm:py-1.5">
                              <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1">{group.label}</p>
                              {group.currencies.map((code) => (
                                <SelectItemComponent
                                  key={code}
                                  value={code}
                                  className="text-foreground focus:bg-[#282b2e] text-xs sm:text-sm py-1 sm:py-1.5"
                                >
                                  {getCurrencyName(code as Currency)} ({getCurrencySymbol(code as Currency)})
                                </SelectItemComponent>
                              ))}
                              {group !== currencyGroups[currencyGroups.length - 1] && (
                                <div className="h-px bg-[#282b2e] my-0.5 sm:my-1" />
                              )}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <TeslaButton
                      onClick={handleAddItem}
                      className="flex-1 flex items-center justify-center h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      {editingItemId !== null ? t.updateItem : t.addItem}
                    </TeslaButton>
                    {editingItemId !== null && (
                      <TeslaButton
                        variant="secondary"
                        onClick={handleCancelEdit}
                        className="h-8 sm:h-10 text-xs sm:text-sm"
                      >
                        {t.cancel}
                      </TeslaButton>
                    )}
                  </div>
                </>
              )}
            </TeslaCardContent>
          </TeslaCard>

          {!isLoading && items.length >= 5 && <AdBanner adSlot="7996815600" className="my-4" minContentLength={300} />}

          {!isLoading && items.length > 0 ? (
            <>
              <TeslaCard className="md:col-span-2">
                <TeslaCardHeader className="pb-2 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <TeslaCardTitle className="text-lg sm:text-xl font-medium">{t.addedItems}</TeslaCardTitle>
                    <div className="flex flex-wrap gap-2">
                      <TeslaButton
                        variant="secondary"
                        size="sm"
                        onClick={() => setCompanyInfoDialogOpen(true)}
                        className="flex items-center gap-1 h-7 sm:h-8 text-xs sm:text-sm"
                      >
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        {hasCompanyInfo ? t.editCompanyInfo : t.addCompanyInfo}
                      </TeslaButton>
                      <TeslaButton
                        size="sm"
                        onClick={handleDownloadPDF}
                        disabled={isGeneratingPDF}
                        className="flex items-center gap-1 h-7 sm:h-8 text-xs sm:text-sm"
                      >
                        <FileDown
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${dir === "rtl" ? "ml-1" : "mr-1"} ${
                            isGeneratingPDF ? "animate-spin" : ""
                          }`}
                        />
                        {t.downloadPDF}
                      </TeslaButton>
                    </div>
                  </div>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <div className="bg-muted rounded-xl overflow-x-auto p-2 sm:p-4">
                    <Table className="min-w-[640px]">
                      <TableHeader>
                        <TableRowComponent className="border-b border-border">
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground text-xs sm:text-sm py-2 sm:py-3`}>
                            {t.itemName}
                          </TableHead>
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell`}>
                            {t.inputValue}
                          </TableHead>
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground text-xs sm:text-sm py-2 sm:py-3`}>
                            {t.calculatedValue}
                          </TableHead>
                          <TableHead className={`${dir === "rtl" ? "text-right" : "text-left"} text-muted-foreground text-xs sm:text-sm py-2 sm:py-3`}>
                            {t.currency}
                          </TableHead>
                          <TableHead className="text-right text-muted-foreground text-xs sm:text-sm py-2 sm:py-3">{t.actions}</TableHead>
                        </TableRowComponent>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRowComponent key={item.id} className="border-b border-border">
                            <TableCellComponent className={`font-medium ${dir === "rtl" ? "text-right" : "text-left"} text-xs sm:text-sm py-2 sm:py-3`}>
                              {item.name}
                            </TableCellComponent>
                            <TableCellComponent className={`${dir === "rtl" ? "text-right" : "text-left"} text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell`}>
                              {item.originalValue}
                            </TableCellComponent>
                            <TableCellComponent className={`${dir === "rtl" ? "text-right" : "text-left"} text-xs sm:text-sm py-2 sm:py-3`}>
                              {item.value.toFixed(2)}
                            </TableCellComponent>
                            <TableCellComponent className={`${dir === "rtl" ? "text-right" : "text-left"} text-xs sm:text-sm py-2 sm:py-3`}>
                              {getCurrencyName(item.currency)}
                            </TableCellComponent>
                            <TableCellComponent className="text-right text-xs sm:text-sm py-2 sm:py-3">
                              <div className="flex justify-end gap-1 sm:gap-2">
                                <TeslaButton
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleEditItem(item)}
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                >
                                  <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="sr-only">{t.edit}</span>
                                </TeslaButton>
                                <TeslaButton
                                  variant="secondary"
                                  size="icon"
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="h-6 w-6 sm:h-8 sm:w-8"
                                >
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                  <span className="sr-only">{t.delete}</span>
                                </TeslaButton>
                              </div>
                            </TableCellComponent>
                          </TableRowComponent>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TeslaCardContent>
                <TeslaCardFooter className="mt-2 sm:mt-4">
                  <div className="w-full md:w-auto">
                    <TeslaButton
                      variant="secondary"
                      onClick={handleReset}
                      className="w-full md:w-auto h-8 sm:h-10 text-xs sm:text-sm"
                    >
                      {t.reset}
                    </TeslaButton>
                  </div>
                </TeslaCardFooter>
              </TeslaCard>

              <TeslaCard>
                <TeslaCardHeader className="pb-2 sm:pb-4">
                  <TeslaCardTitle className="text-lg sm:text-xl font-medium">{t.totalAmount}</TeslaCardTitle>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <div className="bg-muted rounded-xl p-4 sm:p-6 text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{t[`in${totalCurrency}` as keyof typeof t]}</p>
                    <p className="text-2xl sm:text-4xl font-bold text-tesla-blue">
                      {totals[totalCurrency].toFixed(2)} {getCurrencySymbol(totalCurrency)}
                    </p>
                  </div>
                </TeslaCardContent>
                <TeslaCardFooter className="mt-2 sm:mt-4">
                  <div className="w-full">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{t.selectTotalCurrency}</p>
                    <Select value={totalCurrency} onValueChange={(value) => updateTotalCurrency(value as Currency)}>
                      <SelectTrigger
                        id="totalCurrency"
                        className="tesla-input border-0 bg-transparent focus:ring-0 w-full text-foreground h-8 sm:h-10 text-xs sm:text-sm"
                      >
                        <SelectValue placeholder={t.selectTotalCurrency} />
                      </SelectTrigger>
                      <SelectContent className="bg-muted border-border max-h-[40vh] sm:max-h-[50vh]">
                        {currencyGroups.map((group) => (
                          <div key={group.label} className="px-2 py-1 sm:py-1.5">
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1">{group.label}</p>
                            {group.currencies.map((code) => (
                              <SelectItemComponent
                                key={code}
                                value={code}
                                className="text-foreground focus:bg-[#282b2e] text-xs sm:text-sm py-1 sm:py-1.5"
                              >
                                {getCurrencyName(code as Currency)} ({getCurrencySymbol(code as Currency)})
                              </SelectItemComponent>
                            ))}
                            {group !== currencyGroups[currencyGroups.length - 1] && (
                              <div className="h-px bg-[#282b2e] my-0.5 sm:my-1" />
                            )}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TeslaCardFooter>
              </TeslaCard>

              <TeslaCard>
                <TeslaCardHeader className="pb-2 sm:pb-4">
                  <TeslaCardTitle className="text-lg sm:text-xl font-medium">{t.chartTitle}</TeslaCardTitle>
                </TeslaCardHeader>
                <TeslaCardContent>
                  <div className="w-full overflow-x-auto">
                    <div className="min-w-[300px]">
                      <ItemsChart items={items} getCurrencyName={(code) => getCurrencyName(code as Currency)} />
                    </div>
                  </div>
                </TeslaCardContent>
              </TeslaCard>
            </>
          ) : (
            !isLoading && (
              <TeslaCard className="md:col-span-2">
                <TeslaCardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-3 sm:p-4 mb-4 sm:mb-6">
                    <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4">{t.appTitle}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md mb-2">{t.appDescription}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md">{t.emptyStateDescription}</p>
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

        <div className="flex flex-wrap justify-center mt-6 sm:mt-8 gap-2 sm:gap-4">
          <Link href="/about">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3">
              <Info className="h-3 w-3 sm:h-4 sm:w-4" />
              {t.aboutUs}
            </TeslaButton>
          </Link>
          <Link href="/pricing">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              {t.pricing}
            </TeslaButton>
          </Link>
          <Link href="/privacy">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              {t.privacyPolicyTitle}
            </TeslaButton>
          </Link>
          <Link href="/terms">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3">
              <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
              {t.termsAndConditionsTitle}
            </TeslaButton>
          </Link>
          <Link href="/admin">
            <TeslaButton variant="secondary" size="sm" className="flex items-center gap-1 h-7 sm:h-8 text-xs sm:text-sm px-2 sm:px-3">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              {t.fileManagement}
            </TeslaButton>
          </Link>
        </div>

        {items.length >= 3 && <AdBanner adSlot="7996815600" className="mt-8" minContentLength={300} />}
      </div>

      <CompanyInfoDialog
        open={companyInfoDialogOpen}
        onOpenChange={setCompanyInfoDialogOpen}
        companyInfo={companyInfo}
        onSave={handleSaveCompanyInfo}
      />

      <RegisterSW />
      <OfflineAlert />
    </div>
  )
}

const handleSaveCompanyInfo = async (info: CompanyInfo) => {
  try {
    if (!info.name) {
      throw new Error('اسم الشركة مطلوب');
    }

    // التحقق من الاتصال بالإنترنت
    if (!navigator.onLine) {
      throw new Error('لا يوجد اتصال بالإنترنت');
    }

    const response = await fetch('/api/save-company-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...info,
        updated_at: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'فشل في حفظ معلومات الشركة');
    }

    const { data } = await response.json();

    // التحقق من البيانات المستلمة
    if (!data) {
      throw new Error('لم يتم استلام بيانات من الخادم');
    }

    setCompanyInfo({ ...data });

    toast({
      title: 'تم الحفظ',
      description: 'تم حفظ معلومات الشركة بنجاح',
    });

    setCompanyInfoDialogOpen(false);
  } catch (error) {
    console.error('Error saving company info:', error);
    toast({
      title: 'فشل في الحفظ',
      description: error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ معلومات الشركة',
      variant: "destructive",
    });
  }
};
