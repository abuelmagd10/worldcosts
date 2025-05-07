import { NextResponse } from "next/server"

// مخزن البيانات المحلي
const localStorageData: Record<string, string> = {}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { key, value } = body
    
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 })
    }
    
    if (value === undefined) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 })
    }
    
    // تخزين القيمة في المخزن المحلي
    localStorageData[key] = value
    
    return NextResponse.json({ success: true, key, value })
  } catch (error) {
    console.error("Error setting value in local storage:", error)
    return NextResponse.json({ error: "Failed to set value in local storage", details: String(error) }, { status: 500 })
  }
}
