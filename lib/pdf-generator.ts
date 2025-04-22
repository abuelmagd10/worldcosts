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
    // Nuevas divisas
    case "ILS":
      return t.ils
    case "JOD":
      return t.jod
    case "LBP":
      return t.lbp
    case "MAD":
      return t.mad
    case "OMR":
      return t.omr
    case "BHD":
      return t.bhd
    case "DZD":
      return t.dzd
    case "TND":
      return t.tnd
    default:
      return currency
  }
}

// الوظيفة الرئيسية لإنشاء PDF
export const generatePDF = async (data: PDFData): Promise<void> => {
  try {
    console.log("Starting PDF generation")

    // محاولة استخدام طريقة HTML2Canvas أولاً
    try {
      await generatePDFWithHTML2Canvas(data)
      return
    } catch (error) {
      console.error("HTML2Canvas method failed, trying direct jsPDF method:", error)
      await generatePDFWithJSPDF(data)
    }
  } catch (error) {
    console.error("All PDF generation methods failed:", error)
    throw new Error("Failed to generate PDF with all available methods")
  }
}

// طريقة إنشاء PDF باستخدام HTML2Canvas
const generatePDFWithHTML2Canvas = async (data: PDFData): Promise<void> => {
  try {
    // استيراد المكتبات اللازمة
    const jsPDFModule = await import("jspdf")
    const html2canvasModule = await import("html2canvas")

    const jsPDF = jsPDFModule.default
    const html2canvas = html2canvasModule.default

    // تحديد اسم الملف
    const pdfTitle = data.companyInfo?.pdfFileName || "WorldCosts"

    // إنشاء عنصر مؤقت لعرض المحتوى
    const container = document.createElement("div")
    container.style.position = "absolute"
    container.style.left = "-9999px"
    container.style.top = "-9999px"
    container.style.width = "794px" // عرض A4 بالبكسل عند 96 DPI
    container.style.direction = data.dir
    container.style.fontFamily = data.dir === "rtl" ? "Arial, sans-serif" : "Arial, sans-serif"
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
                }; border: 1px solid #ddd; color: #000000;">${formatNumber(item.value, "en", true)}</td>
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
              true,
            )} ${getCurrencySymbol(data.selectedTotalCurrency)}</p>
          </div>
        </div>
        
        <div style="text-align: center; font-size: 10px; color: #666; margin-top: 30px;">
          ${data.t.generatedBy}
        </div>
      </div>
    `

    // تحويل HTML إلى canvas
    const canvas = await html2canvas(container, {
      scale: 2, // جودة أعلى
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
      allowTaint: true,
      foreignObjectRendering: false,
    })

    // إنشاء PDF من canvas
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // حساب الأبعاد لضبط الصورة بشكل صحيح في الصفحة
    const imgWidth = 210 // عرض A4 بالملم
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

    // إضافة المزيد من الصفحات إذا كان المحتوى طويلاً جداً
    if (imgHeight > 297) {
      // ارتفاع A4 بالملم
      let remainingHeight = imgHeight
      let position = -297 // الموضع الأولي للصفحة الثانية

      while (remainingHeight > 297) {
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        remainingHeight -= 297
        position -= 297
      }
    }

    // استخدام اسم ملف مخصص
    const filename = `${pdfTitle}_${new Date().toISOString().slice(0, 10)}.pdf`
    pdf.save(filename)

    // تنظيف العنصر المؤقت
    document.body.removeChild(container)
  } catch (error) {
    console.error("Error in HTML2Canvas PDF generation:", error)
    throw error
  }
}

// طريقة إنشاء PDF باستخدام jsPDF مباشرة
const generatePDFWithJSPDF = async (data: PDFData): Promise<void> => {
  try {
    // استيراد المكتبة اللازمة
    const jsPDFModule = await import("jspdf")
    const jsPDF = jsPDFModule.default

    // تحديد اسم الملف
    const pdfTitle = data.companyInfo?.pdfFileName || "WorldCosts"

    // إنشاء مستند PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // إعداد الصفحة
    const pageWidth = 210
    const pageHeight = 297
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    let y = margin

    // إضافة العنوان
    pdf.setFontSize(18)
    pdf.text(pdfTitle, pageWidth / 2, y, { align: "center" })
    y += 15

    // إضافة معلومات الشركة إذا كانت متوفرة
    if (data.companyInfo?.name) {
      pdf.setFontSize(12)
      pdf.text(data.companyInfo.name, margin, y)
      y += 7

      if (data.companyInfo.address) {
        pdf.setFontSize(10)
        pdf.text(`${data.t.address}: ${data.companyInfo.address}`, margin, y)
        y += 5
      }

      if (data.companyInfo.phone) {
        pdf.setFontSize(10)
        pdf.text(`${data.t.phone}: ${data.companyInfo.phone}`, margin, y)
        y += 5
      }
    }

    y += 10

    // إضافة معلومات التقرير
    pdf.setFontSize(10)
    pdf.text(`${data.t.reportDate}: ${new Date().toLocaleDateString()}`, margin, y)
    y += 5
    pdf.text(`${data.t.lastUpdated}: ${new Date(data.lastUpdated).toLocaleDateString()}`, margin, y)
    y += 5
    pdf.text(`${data.t.totalCurrency}: ${getCurrencyName(data.selectedTotalCurrency, data.t)}`, margin, y)
    y += 15

    // إضافة جدول العناصر
    pdf.setFontSize(14)
    pdf.text(data.t.addedItems, pageWidth / 2, y, { align: "center" })
    y += 10

    // إعداد الجدول
    const tableColumns = [data.t.itemName, data.t.inputValue, data.t.calculatedValue, data.t.currency]
    const tableRows = data.items.map((item) => [
      item.name,
      item.originalValue,
      formatNumber(item.value, "en", true),
      getCurrencyName(item.currency, data.t),
    ])

    // رسم الجدول
    pdf.setFontSize(10)
    const cellWidth = contentWidth / tableColumns.length
    const cellHeight = 10

    // رسم رأس الجدول
    pdf.setFillColor(240, 240, 240)
    pdf.rect(margin, y, contentWidth, cellHeight, "F")

    for (let i = 0; i < tableColumns.length; i++) {
      pdf.text(tableColumns[i], margin + i * cellWidth + 2, y + 7)
    }
    y += cellHeight

    // رسم صفوف الجدول
    for (let i = 0; i < tableRows.length; i++) {
      if (y + cellHeight > pageHeight - margin) {
        pdf.addPage()
        y = margin
      }

      if (i % 2 === 0) {
        pdf.setFillColor(250, 250, 250)
        pdf.rect(margin, y, contentWidth, cellHeight, "F")
      }

      for (let j = 0; j < tableRows[i].length; j++) {
        pdf.text(tableRows[i][j].toString(), margin + j * cellWidth + 2, y + 7)
      }
      y += cellHeight
    }

    y += 10

    // إضافة المجموع
    pdf.setFontSize(14)
    pdf.text(data.t.totalAmount, pageWidth / 2, y, { align: "center" })
    y += 10

    pdf.setFontSize(12)
    pdf.text(`${data.t.totalCurrency}: ${getCurrencyName(data.selectedTotalCurrency, data.t)}`, pageWidth / 2, y, {
      align: "center",
    })
    y += 7

    pdf.setFontSize(16)
    pdf.text(
      `${formatNumber(data.totals[data.selectedTotalCurrency], "en", true)} ${getCurrencySymbol(data.selectedTotalCurrency)}`,
      pageWidth / 2,
      y,
      { align: "center" },
    )
    y += 20

    // إضافة تذييل
    pdf.setFontSize(8)
    pdf.text(data.t.generatedBy, pageWidth / 2, pageHeight - margin, { align: "center" })

    // حفظ الملف
    const filename = `${pdfTitle}_${new Date().toISOString().slice(0, 10)}.pdf`
    pdf.save(filename)
  } catch (error) {
    console.error("Error in direct jsPDF generation:", error)
    throw error
  }
}
