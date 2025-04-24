import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"

// تكوين المجلد العام للملفات المرفوعة
const UPLOADS_DIR = join(process.cwd(), "public", "uploads")

export async function POST(request: Request) {
  try {
    // التأكد من وجود المجلد، وإنشاؤه إذا لم يكن موجوداً
    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // إنشاء اسم فريد للملف
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(UPLOADS_DIR, fileName)

    // تحويل الملف إلى مصفوفة بايت
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // حفظ الملف في المجلد العام
    await writeFile(filePath, buffer)

    // إرجاع رابط مباشر للملف
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({ url: fileUrl, success: true })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
