import { NextResponse } from "next/server"
import { getAllFileRecords } from "@/lib/file-tracker"

export async function GET() {
  try {
    const files = await getAllFileRecords()

    // Calcular estadísticas
    const stats = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.fileSize, 0),
      byType: {} as Record<string, { count: number; size: number }>,
    }

    // Agrupar por tipo
    files.forEach((file) => {
      if (!stats.byType[file.fileType]) {
        stats.byType[file.fileType] = { count: 0, size: 0 }
      }

      stats.byType[file.fileType].count += 1
      stats.byType[file.fileType].size += file.fileSize
    })

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error calculating file stats:", error)
    return NextResponse.json({ error: "Failed to calculate file stats", details: String(error) }, { status: 500 })
  }
}
