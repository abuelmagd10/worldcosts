import type { ExchangeRates } from "@/app/actions"
import type { CompanyInfo } from "@/components/company-info-dialog"
import type { Translation } from "@/lib/i18n/translations"
import { formatNumber } from "@/lib/utils"

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
type Item = {
  id: number
  name: string
  value: number
  currency: Currency
  originalValue: string
}

type PDFData = {
  items: Item[]
  totals: {
    [key in Currency]: number
  }
  selectedTotalCurrency: Currency
  rates: ExchangeRates
  lastUpdated: string
  companyInfo?: CompanyInfo
  t: Translation
  dir: "rtl" | "ltr"
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
    default:
      return ""
  }
}

// وظيفة مساعدة للحصول على اسم العملة
function getCurrencyName(currency: Currency, t: Translation): string {
  switch (currency) {
    case "USD":
      return t.usd
    case "EGP":
      return t.egp
    case "AED":
      return t.aed
    case "EUR":
      return t.eur
    case "GBP":
      return t.gbp
    case "SAR":
      return t.sar
    case "JPY":
      return t.jpy
    case "CNY":
      return t.cny
    case "CAD":
      return t.cad
    case "AUD":
      return t.aud
    case "CHF":
      return t.chf
    case "INR":
      return t.inr
    case "RUB":
      return t.rub
    case "TRY":
      return t.try
    case "BRL":
      return t.brl
    case "KWD":
      return t.kwd
    case "QAR":
      return t.qar
    case "MYR":
      return t.myr
    default:
      return currency
  }
}

// طريقة جديدة لإنشاء PDF باستخدام jsPDF مباشرة
export const generatePDF = async (data: PDFData): Promise<void> => {
  try {
    console.log("Starting PDF generation with HTML2Canvas method")
    await generatePDFWithHTML2Canvas(data)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

// طريقة بديلة لإنشاء PDF باستخدام HTML2Canvas كاحتياطي
export const generatePDFWithHTML2Canvas = async (data: PDFData): Promise<void> => {
  try {
    // استيراد المكتبات اللازمة
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([import("jspdf"), import("html2canvas")])

    // تحديد اسم الملف
    const pdfTitle = data.companyInfo?.pdfFileName || "WorldCosts"

    // إنشاء عنصر مؤقت لعرض المحتوى
    const container = document.createElement("div")
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.top = "-9999px"
    container.style.width = "794px" // عرض A4 بالبكسل عند 96 DPI
    container.style.direction = data.dir
    container.style.fontFamily = "Arial, sans-serif" // استخدام خطوط النظام
    container.style.color = "#000000" // تأكد من أن النص أسود
    container.style.backgroundColor = "#FFFFFF" // تأكد من أن الخلفية بيضاء
    document.body.appendChild(container)

    // تنسيق التاريخ
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString)
      return date.toLocaleDateString(data.dir === "rtl" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    // إنشاء قسم معلومات الشركة إذا كانت متوفرة
    const companyInfoHTML = data.companyInfo?.name
      ? `
      <div style="display: flex; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 15px;">
        ${
          data.companyInfo.logo
            ? `
          <div style="width: 100px; height: 100px; margin-${
            data.dir === "rtl" ? "left" : "right"
          }: 20px; flex-shrink: 0;">
            <img src="${data.companyInfo.logo}" style="max-width: 100%; max-height: 100%; object-fit: contain;" alt="Company Logo" />
          </div>
        `
            : ""
        }
        <div style="flex-grow: 1;">
          <h2 style="margin: 0 0 10px 0; font-size: 20px; color: #000000;">${data.companyInfo.name || ""}</h2>
          ${
            data.companyInfo.address
              ? `<p style="margin: 0 0 5px 0; font-size: 14px; color: #000000;">${data.t.address}: ${data.companyInfo.address}</p>`
              : ""
          }
          ${
            data.companyInfo.phone
              ? `<p style="margin: 0; font-size: 14px; color: #000000;">${data.t.phone}: ${data.companyInfo.phone}</p>`
              : ""
          }
        </div>
      </div>
    `
      : `
      <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 15px;">
        <h2 style="margin: 0 0 10px 0; font-size: 24px; color: #000000;">WorldCosts</h2>
      </div>
    `

    // إنشاء محتوى PDF باستخدام HTML
    container.innerHTML = `
      <div style="padding: 20px; width: 100%; background-color: white; color: black;">
        ${companyInfoHTML}
        
        <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px; color: #000000;">${pdfTitle}</h1>
        
        <div style="text-align: ${data.dir === "rtl" ? "right" : "left"}; font-size: 12px; margin-bottom: 20px; color: #000000;">
          <p style="color: #000000;">${data.t.reportDate}: ${new Date().toLocaleDateString(data.dir === "rtl" ? "ar-EG" : "en-US")}</p>
          <p style="color: #000000;">${data.t.lastUpdated}: ${formatDate(data.lastUpdated)}</p>
          <p style="color: #000000;">${data.t.totalCurrency}: ${getCurrencyName(data.selectedTotalCurrency, data.t)}</p>
        </div>
        
        <h2 style="text-align: center; font-size: 18px; margin-bottom: 10px; color: #000000;">${data.t.addedItems}</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; color: #000000;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; text-align: ${
                data.dir === "rtl" ? "right" : "left"
              }; border: 1px solid #ddd; color: #000000;">${data.t.itemName}</th>
              <th style="padding: 8px; text-align: ${
                data.dir === "rtl" ? "right" : "left"
              }; border: 1px solid #ddd; color: #000000;">${data.t.inputValue}</th>
              <th style="padding: 8px; text-align: ${
                data.dir === "rtl" ? "right" : "left"
              }; border: 1px solid #ddd; color: #000000;">${data.t.calculatedValue}</th>
              <th style="padding: 8px; text-align: ${
                data.dir === "rtl" ? "right" : "left"
              }; border: 1px solid #ddd; color: #000000;">${data.t.currency}</th>
            </tr>
          </thead>
          <tbody>
            ${data.items
              .map(
                (item, index) => `
              <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f9f9f9"};">
                <td style="padding: 8px; text-align: ${
                  data.dir === "rtl" ? "right" : "left"
                }; border: 1px solid #ddd; color: #000000;">${item.name}</td>
                <td style="padding: 8px; text-align: ${
                  data.dir === "rtl" ? "right" : "left"
                }; border: 1px solid #ddd; color: #000000;">${item.originalValue}</td>
                <td style="padding: 8px; text-align: ${
                  data.dir === "rtl" ? "right" : "left"
                }; border: 1px solid #ddd; color: #000000;">${formatNumber(item.value, "en")}</td>
                <td style="padding: 8px; text-align: ${
                  data.dir === "rtl" ? "right" : "left"
                }; border: 1px solid #ddd; color: #000000;">${getCurrencyName(item.currency, data.t)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <h2 style="text-align: center; font-size: 18px; margin-bottom: 10px; color: #000000;">${data.t.totalAmount}</h2>
        
        <div style="display: flex; justify-content: center; margin-bottom: 20px;">
          <div style="width: 50%; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; text-align: ${
            data.dir === "rtl" ? "right" : "left"
          };">
            <p style="margin: 0; font-size: 14px; color: #666;">${data.t.totalCurrency}: ${getCurrencyName(
              data.selectedTotalCurrency,
              data.t,
            )}</p>
            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #000000;">${formatNumber(
              data.totals[data.selectedTotalCurrency],
              "en",
            )} ${getCurrencySymbol(data.selectedTotalCurrency)}</p>
          </div>
        </div>
        
        <div style="text-align: center; font-size: 10px; color: #666; margin-top: 30px;">
          ${data.t.generatedBy}
        </div>
      </div>
    `

    try {
      // تحويل HTML إلى canvas
      const canvas = await html2canvas(container, {
        scale: 2, // جودة أعلى
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF", // تأكد من أن الخلفية بيضاء
        allowTaint: true, // السماح بتلوين الكانفاس للصور من مصادر مختلفة
        foreignObjectRendering: false, // تعطيل استخدام foreignObject لتحسين التوافق
      })

      // إنشاء PDF من canvas
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // حساب الأبعاد لتناسب الصورة بشكل صحيح على الصفحة
      const imgWidth = 210 // عرض A4 بالملم
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // إضافة المزيد من الصفحات إذا كان المحتوى طويلاً جدًا
      if (imgHeight > 297) {
        // ارتفاع A4 بالملم
        let remainingHeight = imgHeight
        let position = -297 // موضع البداية للصفحة الثانية

        while (remainingHeight > 297) {
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
          remainingHeight -= 297
          position -= 297
        }
      }

      // استخدام اسم الملف المخصص للملف المحفوظ
      const filename = `${pdfTitle}_${new Date().toISOString().slice(0, 10)}.pdf`
      pdf.save(filename)
    } catch (error) {
      console.error("Error generating PDF with HTML2Canvas:", error)
      throw error
    } finally {
      // تنظيف العنصر المؤقت
      document.body.removeChild(container)
    }
  } catch (error) {
    console.error("Error in PDF generation with HTML2Canvas:", error)
    throw error
  }
}
