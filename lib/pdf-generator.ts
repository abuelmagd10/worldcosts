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

// وظيفة إنشاء PDF وتحميله
export const generatePDF = async (data: PDFData): Promise<void> => {
  try {
    console.log("Starting PDF generation with direct URL method")
    // استخدام وظيفة جديدة لإنشاء PDF وإرجاع رابط مباشر
    const pdfUrl = await generatePDFWithDirectURL(data)

    // فتح الرابط المباشر في نافذة جديدة أو تحميله مباشرة
    window.open(pdfUrl, "_blank")
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

// وظيفة جديدة لإنشاء PDF وإرجاع رابط مباشر
export const generatePDFWithDirectURL = async (data: PDFData): Promise<string> => {
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
    container.style.width = "794px"
    container.style.direction = data.dir
    container.style.fontFamily = "Arial, sans-serif"
    container.style.color = "#000000"
    container.style.backgroundColor = "#FFFFFF"
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
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF",
        allowTaint: true,
        foreignObjectRendering: false,
      })

      // إنشاء PDF من canvas
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // حساب الأبعاد لتناسب الصورة بشكل صحيح على الصفحة
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const imgData = canvas.toDataURL("image/png")

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // إضافة المزيد من الصفحات إذا كان المحتوى طويلاً جداً
      if (imgHeight > 297) {
        let remainingHeight = imgHeight
        let position = -297

        while (remainingHeight > 297) {
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
          remainingHeight -= 297
          position -= 297
        }
      }

      // تحويل PDF إلى base64 مباشرة بدلاً من رفعه إلى الخادم
      const pdfBase64 = pdf.output("datauristring")

      // تنظيف العنصر المؤقت
      document.body.removeChild(container)

      // إرجاع عنوان URL للملف
      return pdfBase64
    } catch (error) {
      console.error("Error generating PDF with direct URL:", error)

      // تنظيف العنصر المؤقت
      document.body.removeChild(container)

      // إعادة محاولة باستخدام طريقة بديلة
      return generatePDFWithFallback(data)
    }
  } catch (error) {
    console.error("Error in PDF generation with direct URL:", error)

    // إعادة محاولة باستخدام طريقة بديلة
    return generatePDFWithFallback(data)
  }
}

// طريقة بديلة لإنشاء PDF في حالة فشل الطريقة الأساسية
async function generatePDFWithFallback(data: PDFData): Promise<string> {
  try {
    console.log("Using fallback PDF generation method")

    // استيراد المكتبة اللازمة
    const { default: jsPDF } = await import("jspdf")

    // إنشاء مستند PDF جديد
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // إضافة العنوان
    const title = data.companyInfo?.pdfFileName || "WorldCosts"
    pdf.setFontSize(18)
    pdf.text(title, 105, 20, { align: "center" })

    // إضافة معلومات التقرير
    pdf.setFontSize(10)
    pdf.text(`${data.t.reportDate}: ${new Date().toLocaleDateString()}`, 20, 30)
    pdf.text(`${data.t.lastUpdated}: ${new Date(data.lastUpdated).toLocaleDateString()}`, 20, 35)
    pdf.text(`${data.t.totalCurrency}: ${getCurrencyName(data.selectedTotalCurrency, data.t)}`, 20, 40)

    // إضافة جدول العناصر
    pdf.setFontSize(12)
    pdf.text(data.t.addedItems, 105, 50, { align: "center" })

    // رسم الجدول
    const tableStartY = 60
    const cellPadding = 5
    const colWidths = [50, 40, 40, 40]
    const rowHeight = 10

    // رسم رأس الجدول
    pdf.setFillColor(240, 240, 240)
    pdf.rect(
      20,
      tableStartY,
      colWidths.reduce((a, b) => a + b, 0),
      rowHeight,
      "F",
    )

    pdf.setFontSize(10)
    let currentX = 20

    // عناوين الأعمدة
    pdf.text(data.t.itemName, currentX + cellPadding, tableStartY + 7)
    currentX += colWidths[0]

    pdf.text(data.t.inputValue, currentX + cellPadding, tableStartY + 7)
    currentX += colWidths[1]

    pdf.text(data.t.calculatedValue, currentX + cellPadding, tableStartY + 7)
    currentX += colWidths[2]

    pdf.text(data.t.currency, currentX + cellPadding, tableStartY + 7)

    // رسم صفوف البيانات
    let currentY = tableStartY + rowHeight

    data.items.forEach((item, index) => {
      // تبديل لون الخلفية للصفوف البديلة
      if (index % 2 === 0) {
        pdf.setFillColor(255, 255, 255)
      } else {
        pdf.setFillColor(249, 249, 249)
      }

      pdf.rect(
        20,
        currentY,
        colWidths.reduce((a, b) => a + b, 0),
        rowHeight,
        "F",
      )

      currentX = 20

      // بيانات الصف
      pdf.text(item.name.substring(0, 20), currentX + cellPadding, currentY + 7)
      currentX += colWidths[0]

      pdf.text(item.originalValue.substring(0, 15), currentX + cellPadding, currentY + 7)
      currentX += colWidths[1]

      pdf.text(item.value.toFixed(2), currentX + cellPadding, currentY + 7)
      currentX += colWidths[2]

      pdf.text(getCurrencyName(item.currency, data.t).substring(0, 15), currentX + cellPadding, currentY + 7)

      currentY += rowHeight
    })

    // إضافة المجموع
    pdf.setFontSize(12)
    pdf.text(data.t.totalAmount, 105, currentY + 20, { align: "center" })

    pdf.setFillColor(249, 249, 249)
    pdf.rect(70, currentY + 30, 70, 20, "F")

    pdf.setFontSize(10)
    pdf.text(`${data.t.totalCurrency}: ${getCurrencyName(data.selectedTotalCurrency, data.t)}`, 75, currentY + 40)

    pdf.setFontSize(12)
    pdf.text(
      `${data.totals[data.selectedTotalCurrency].toFixed(2)} ${getCurrencySymbol(data.selectedTotalCurrency)}`,
      75,
      currentY + 50,
    )

    // إضافة تذييل
    pdf.setFontSize(8)
    pdf.text(data.t.generatedBy, 105, 280, { align: "center" })

    // تحويل PDF إلى base64
    const pdfBase64 = pdf.output("datauristring")

    return pdfBase64
  } catch (error) {
    console.error("Error in fallback PDF generation:", error)
    throw new Error("فشل في إنشاء ملف PDF. يرجى المحاولة مرة أخرى.")
  }
}
