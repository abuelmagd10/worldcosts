"use client"

import { useState, useEffect } from "react"
import { FileText, ImageIcon, HardDrive } from "lucide-react"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"

interface FileStats {
  totalFiles: number
  totalSize: number
  byType: Record<string, { count: number; size: number }>
}

export function FileStats() {
  const [stats, setStats] = useState<FileStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/files/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch file stats")
      }
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching file stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  if (isLoading) {
    return (
      <TeslaCard>
        <TeslaCardHeader>
          <TeslaCardTitle>إحصائيات الملفات</TeslaCardTitle>
        </TeslaCardHeader>
        <TeslaCardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tesla-blue"></div>
          </div>
        </TeslaCardContent>
      </TeslaCard>
    )
  }

  if (!stats) {
    return (
      <TeslaCard>
        <TeslaCardHeader>
          <TeslaCardTitle>إحصائيات الملفات</TeslaCardTitle>
        </TeslaCardHeader>
        <TeslaCardContent>
          <p className="text-center text-muted-foreground">لا توجد إحصائيات متاحة</p>
        </TeslaCardContent>
      </TeslaCard>
    )
  }

  return (
    <TeslaCard>
      <TeslaCardHeader>
        <TeslaCardTitle>إحصائيات الملفات</TeslaCardTitle>
      </TeslaCardHeader>
      <TeslaCardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted rounded-xl p-4 flex items-center gap-4">
            <div className="bg-card p-3 rounded-full">
              <HardDrive className="h-6 w-6 text-tesla-blue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الملفات</p>
              <p className="text-2xl font-semibold">{stats.totalFiles}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(stats.totalSize)}</p>
            </div>
          </div>

          {stats.byType.pdf && (
            <div className="bg-muted rounded-xl p-4 flex items-center gap-4">
              <div className="bg-card p-3 rounded-full">
                <FileText className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ملفات PDF</p>
                <p className="text-2xl font-semibold">{stats.byType.pdf.count}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(stats.byType.pdf.size)}</p>
              </div>
            </div>
          )}

          {stats.byType.logo && (
            <div className="bg-muted rounded-xl p-4 flex items-center gap-4">
              <div className="bg-card p-3 rounded-full">
                <ImageIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الشعارات</p>
                <p className="text-2xl font-semibold">{stats.byType.logo.count}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(stats.byType.logo.size)}</p>
              </div>
            </div>
          )}
        </div>
      </TeslaCardContent>
    </TeslaCard>
  )
}
