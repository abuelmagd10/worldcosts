import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function GET() {
  try {
    const stats = await fileStorage.getFileStats()
    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error calculating file stats:", error)
    // إرجاع إحصائيات فارغة بدلاً من خطأ
    return NextResponse.json({
      stats: {
        totalFiles: 0,
        totalSize: 0,
        byType: {},
      },
      error: String(error)
    })
  }
}
