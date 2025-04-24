import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

// تكوين المجلد العام للملفات المرفوعة
const PDF_DIR = join(process.cwd(), "public", "pdfs")

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    // إنشاء اسم فريد للملف
    const fileName = `worldcosts_${uuidv4()}.pdf`
    const filePath = join(PDF_DIR, fileName)

    // تحويل الملف إلى مصفوفة بايت
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // حفظ الملف في المجلد العام
    await writeFile(filePath, buffer)

    // إرجاع رابط مباشر للملف
    const fileUrl = `/pdfs/${fileName}`

    return NextResponse.json({ url: fileUrl, success: true })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
