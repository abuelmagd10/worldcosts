import { NextResponse } from "next/server"

// مخزن البيانات المحلي
const localStorageData: Record<string, string> = {}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')
    
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 })
    }
    
    // استرجاع القيمة من المخزن المحلي
    const value = localStorageData[key]
    
    return NextResponse.json({ key, value })
  } catch (error) {
    console.error("Error getting value from local storage:", error)
    return NextResponse.json({ error: "Failed to get value from local storage", details: String(error) }, { status: 500 })
  }
}
