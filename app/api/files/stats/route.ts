import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function GET() {
  try {
    const stats = await fileStorage.getFileStats()
    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error calculating file stats:", error)
    return NextResponse.json({ error: "Failed to calculate file stats", details: String(error) }, { status: 500 })
  }
}
