import { NextResponse } from "next/server"
import { getAllFileRecords } from "@/lib/file-tracker"

export async function GET() {
  try {
    const files = await getAllFileRecords()
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files", details: String(error) }, { status: 500 })
  }
}
