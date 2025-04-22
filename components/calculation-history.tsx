"use client"

import { useState, useEffect } from "react"
import { Clock, RefreshCw, Trash2 } from "lucide-react"
import { TeslaButton } from "@/components/ui/tesla-button"
import {
  TeslaCard,
  TeslaCardContent,
  TeslaCardFooter,
  TeslaCardHeader,
  TeslaCardTitle,
} from "@/components/ui/tesla-card"
import { useLanguage } from "@/lib/i18n/language-context"
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

type HistoryEntry = {
  id: string
  date: string
  items: Item[]
  totalCurrency: Currency
  totalValue: number
}

interface CalculationHistoryProps {
  currentItems: Item[]
  totalCurrency: Currency
  totalValue: number
  onLoadHistory: (items: Item[], currency: Currency) => void
  getCurrencyName: (code: Currency) => string
  getCurrencySymbol: (code: Currency) => string
}

export function CalculationHistory({
  currentItems,
  totalCurrency,
  totalValue,
  onLoadHistory,
  getCurrencyName,
  getCurrencySymbol,
}: CalculationHistoryProps) {
  const { t, dir, language } = useLanguage()
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Cargar historial al montar el componente
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("calculation_history")
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.error("Error loading calculation history:", error)
    }
  }, [])

  // Guardar cálculo actual en el historial
  const saveCurrentCalculation = () => {
    if (currentItems.length === 0) return

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(
        language === "ar" ? "ar-EG" : language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : "en-US",
      ),
      items: [...currentItems],
      totalCurrency,
      totalValue,
    }

    const updatedHistory = [newEntry, ...history].slice(0, 10) // Mantener solo los 10 más recientes
    setHistory(updatedHistory)

    try {
      localStorage.setItem("calculation_history", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error saving calculation history:", error)
    }
  }

  // Cargar un cálculo del historial
  const loadCalculation = (entry: HistoryEntry) => {
    onLoadHistory(entry.items, entry.totalCurrency)
  }

  // Eliminar una entrada del historial
  const deleteHistoryEntry = (id: string) => {
    const updatedHistory = history.filter((entry) => entry.id !== id)
    setHistory(updatedHistory)

    try {
      localStorage.setItem("calculation_history", JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error updating calculation history:", error)
    }
  }

  // Limpiar todo el historial
  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem("calculation_history")
    } catch (error) {
      console.error("Error clearing calculation history:", error)
    }
  }

  return (
    <TeslaCard>
      <TeslaCardHeader>
        <div className="flex items-center justify-between">
          <TeslaCardTitle className="text-xl font-medium flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {t.calculationHistory || "سجل الحسابات"}
          </TeslaCardTitle>
          <TeslaButton
            variant="secondary"
            size="sm"
            onClick={saveCurrentCalculation}
            disabled={currentItems.length === 0}
          >
            {t.saveCalculation || "حفظ الحساب الحالي"}
          </TeslaButton>
        </div>
      </TeslaCardHeader>
      <TeslaCardContent>
        {history.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {t.noCalculationHistory || "لا يوجد سجل حسابات حتى الآن"}
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => (
              <div key={entry.id} className="bg-muted rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-muted-foreground">{entry.date}</div>
                  <div className="flex gap-2">
                    <TeslaButton
                      variant="secondary"
                      size="sm"
                      onClick={() => loadCalculation(entry)}
                      className="h-8 px-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      {t.load || "تحميل"}
                    </TeslaButton>
                    <TeslaButton
                      variant="secondary"
                      size="sm"
                      onClick={() => deleteHistoryEntry(entry.id)}
                      className="h-8 px-2"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </TeslaButton>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      {t.items || "العناصر"}: {entry.items.length}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {t.total || "المجموع"}: {getCurrencyName(entry.totalCurrency)}
                    </div>
                    <div className="font-bold text-tesla-blue">
                      {formatNumber(entry.totalValue, language)} {getCurrencySymbol(entry.totalCurrency)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </TeslaCardContent>
      {history.length > 0 && (
        <TeslaCardFooter>
          <TeslaButton variant="secondary" size="sm" onClick={clearHistory}>
            {t.clearHistory || "مسح السجل"}
          </TeslaButton>
        </TeslaCardFooter>
      )}
    </TeslaCard>
  )
}
