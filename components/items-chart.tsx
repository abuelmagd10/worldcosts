"use client"

import { useEffect, useRef, useState } from "react"
import { PieChart, BarChart3, ListTree } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import { useTheme } from "next-themes" // إضافة استيراد useTheme

type ChartItem = {
  id: number
  name: string
  value: number
  currency: string
  originalValue: string
}

type ChartProps = {
  items: ChartItem[]
  getCurrencyName: (code: string) => string
}

type ChartViewMode = "currency-pie" | "currency-bar" | "items"

export function ItemsChart({ items, getCurrencyName }: ChartProps) {
  const { t, dir } = useLanguage()
  const { resolvedTheme } = useTheme() // استخدام useTheme للحصول على وضع السمة الحالي
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>("currency-pie")

  useEffect(() => {
    if (!canvasRef.current || items.length === 0) return

    const renderChart = async () => {
      const { Chart, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } = await import(
        "chart.js/auto"
      )

      Chart.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

      // Tesla-inspired colors
      const colors = [
        "rgba(14, 155, 239, 0.8)",
        "rgba(65, 187, 255, 0.8)",
        "rgba(83, 89, 96, 0.8)",
        "rgba(40, 43, 46, 0.8)",
        "rgba(27, 29, 30, 0.8)",
        "rgba(5, 141, 217, 0.8)",
        "rgba(1, 108, 188, 0.8)",
        "rgba(17, 168, 253, 0.8)",
        "rgba(32, 34, 38, 0.8)",
        "rgba(127, 132, 137, 0.8)",
      ]

      const existingChart = Chart.getChart(canvasRef.current)
      if (existingChart) {
        existingChart.destroy()
      }

      let chartData = {}
      let chartOptions = {}
      let chartType: "pie" | "bar" = "pie"

      // تحديد لون النص بناءً على وضع السمة
      const textColor = resolvedTheme === "dark" ? "white" : "#333333"
      const gridColor = resolvedTheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"

      const currencyTotals: Record<string, number> = {}

      items.forEach((item) => {
        if (!currencyTotals[item.currency]) {
          currencyTotals[item.currency] = 0
        }
        currencyTotals[item.currency] += item.value
      })

      const currencies = Object.keys(currencyTotals)
      const totals = currencies.map((curr) => currencyTotals[curr])
      const currencyNames = currencies.map((code) => getCurrencyName(code))

      if (chartViewMode === "currency-pie") {
        chartType = "pie"
        chartData = {
          labels: currencyNames,
          datasets: [
            {
              data: totals,
              backgroundColor: currencies.map((_, i) => colors[i % colors.length]),
              borderColor: currencies.map((_, i) => colors[i % colors.length].replace("0.8", "1")),
              borderWidth: 1,
            },
          ],
        }

        chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right" as const,
              rtl: dir === "rtl",
              labels: {
                usePointStyle: true,
                padding: 20,
                color: textColor, // استخدام لون النص المناسب
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const label = context.label || ""
                  const value = context.raw
                  return `${label}: ${value.toFixed(2)}`
                },
              },
              backgroundColor: resolvedTheme === "dark" ? "#202226" : "#ffffff",
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: resolvedTheme === "dark" ? "#282b2e" : "#e2e8f0",
              borderWidth: 1,
              padding: 12,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            },
            title: {
              display: true,
              text: t.chartTitleDistribution || "توزيع القيم حسب العملة",
              font: {
                size: 16,
              },
              color: textColor, // استخدام لون النص المناسب
            },
          },
        }
      } else if (chartViewMode === "currency-bar") {
        chartType = "bar"
        chartData = {
          labels: currencyNames,
          datasets: [
            {
              label: t.calculatedValue || "القيمة المحسوبة",
              data: totals,
              backgroundColor: currencies.map((_, i) => colors[i % colors.length]),
              borderColor: currencies.map((_, i) => colors[i % colors.length].replace("0.8", "1")),
              borderWidth: 1,
            },
          ],
        }

        chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: t.calculatedValue || "القيمة المحسوبة",
                color: textColor, // استخدام لون النص المناسب
              },
              ticks: {
                color: textColor, // استخدام لون النص المناسب
              },
              grid: {
                color: gridColor, // استخدام لون الشبكة المناسب
              },
            },
            x: {
              title: {
                display: true,
                text: t.currency || "العملة",
                color: textColor, // استخدام لون النص المناسب
              },
              ticks: {
                color: textColor, // استخدام لون النص المناسب
              },
              grid: {
                color: gridColor, // استخدام لون الشبكة المناسب
              },
            },
          },
          plugins: {
            legend: {
              position: "top" as const,
              rtl: dir === "rtl",
              labels: {
                color: textColor, // استخدام لون النص المناسب
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const value = context.raw
                  const label = context.dataset.label || ""
                  return `${label}: ${value.toFixed(2)}`
                },
              },
              backgroundColor: resolvedTheme === "dark" ? "#202226" : "#ffffff",
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: resolvedTheme === "dark" ? "#282b2e" : "#e2e8f0",
              borderWidth: 1,
              padding: 12,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            },
            title: {
              display: true,
              text: t.chartTitleValues || "القيم الإجمالية حسب العملة",
              font: {
                size: 16,
              },
              color: textColor, // استخدام لون النص المناسب
            },
          },
        }
      } else {
        const itemNames = items.map((item) => item.name)
        const itemValues = items.map((item) => item.value)

        chartType = "bar"
        chartData = {
          labels: itemNames,
          datasets: [
            {
              label: t.calculatedValue || "القيمة المحسوبة",
              data: itemValues,
              backgroundColor: items.map((_, i) => colors[i % colors.length]),
              borderColor: items.map((_, i) => colors[i % colors.length].replace("0.8", "1")),
              borderWidth: 1,
            },
          ],
        }

        chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: "y" as const,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: t.calculatedValue || "القيمة المحسوبة",
                color: textColor, // استخدام لون النص المناسب
              },
              ticks: {
                color: textColor, // استخدام لون النص المناسب
              },
              grid: {
                color: gridColor, // استخدام لون الشبكة المناسب
              },
            },
            y: {
              title: {
                display: true,
                text: t.itemName || "اسم العنصر",
                color: textColor, // استخدام لون النص المناسب
              },
              ticks: {
                color: textColor, // استخدام لون النص المناسب
              },
              grid: {
                color: gridColor, // استخدام لون الشبكة المناسب
              },
            },
          },
          plugins: {
            legend: {
              position: "top" as const,
              rtl: dir === "rtl",
              labels: {
                color: textColor, // استخدام لون النص المناسب
              },
            },
            tooltip: {
              callbacks: {
                label: (context: any) => {
                  const value = context.raw
                  const currency = items[context.dataIndex]?.currency
                  const currencyName = currency ? getCurrencyName(currency) : ""
                  return `${value.toFixed(2)} (${currencyName})`
                },
              },
              backgroundColor: resolvedTheme === "dark" ? "#202226" : "#ffffff",
              titleColor: textColor,
              bodyColor: textColor,
              borderColor: resolvedTheme === "dark" ? "#282b2e" : "#e2e8f0",
              borderWidth: 1,
              padding: 12,
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            },
            title: {
              display: true,
              text: t.chartTitleItems || "قيم العناصر المضافة",
              font: {
                size: 16,
              },
              color: textColor, // استخدام لون النص المناسب
            },
          },
        }
      }

      if (canvasRef.current) {
        new Chart(canvasRef.current, {
          type: chartType,
          data: chartData as any,
          options: chartOptions as any,
        })
      }
    }

    renderChart()
  }, [items, chartViewMode, dir, t, getCurrencyName, resolvedTheme]) // إضافة resolvedTheme كتبعية

  if (items.length === 0) return null

  return (
    <div className="w-full h-[400px] relative chart-container">
      <div className="absolute top-0 right-0 flex gap-2 z-10 p-2">
        <Button
          variant={chartViewMode === "currency-pie" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartViewMode("currency-pie")}
          className={`h-8 w-8 p-0 ${
            chartViewMode === "currency-pie" ? "bg-tesla-blue" : "bg-[#282b2e]"
          } rounded-full border-0 shadow-lg`}
          title={t.pieChartView || "عرض مخطط دائري للعملات"}
        >
          <PieChart className="h-4 w-4" />
          <span className="sr-only">ع</span>
        </Button>
        <Button
          variant={chartViewMode === "currency-bar" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartViewMode("currency-bar")}
          className={`h-8 w-8 p-0 ${
            chartViewMode === "currency-bar" ? "bg-tesla-blue" : "bg-[#282b2e]"
          } rounded-full border-0 shadow-lg`}
          title={t.barChartView || "عرض مخطط شريطي للقيم حسب العملة"}
        >
          <BarChart3 className="h-4 w-4" />
          <span className="sr-only">عرض مخطط شريطي للقيم حسب العملة</span>
        </Button>
        <Button
          variant={chartViewMode === "items" ? "default" : "outline"}
          size="sm"
          onClick={() => setChartViewMode("items")}
          className={`h-8 w-8 p-0 ${
            chartViewMode === "items" ? "bg-tesla-blue" : "bg-[#282b2e]"
          } rounded-full border-0 shadow-lg`}
          title={t.itemsChartView || "عرض قيم العناصر"}
        >
          <ListTree className="h-4 w-4" />
          <span className="sr-only">عرض قيم العناصر</span>
        </Button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  )
}
