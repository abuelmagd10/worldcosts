import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"
import { addFileRecord } from "@/lib/file-tracker"

// تكوين المجلد العام للملفات المرفوعة
const UPLOADS_DIR = join(process.cwd(), "public", "uploads")

export async function POST(request: Request) {
  try {
    // التأكد من وجود المجلد، وإنشاؤه إذا لم يكن موجوداً
    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true })
      console.log(`Created directory: ${UPLOADS_DIR}`)
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // إنشاء اسم فريد للملف
    const fileId = uuidv4()
    const fileExtension = file.name.split(".").pop() || "jpg"
    const fileName = `${fileId}.${fileExtension}`
    const filePath = join(UPLOADS_DIR, fileName)
    const fileUrl = `/uploads/${fileName}`

    // تحويل الملف إلى مصفوفة بايت
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // حفظ الملف في المجلد العام
    await writeFile(filePath, buffer)
    console.log(`File saved to: ${filePath}`)

    // تسجيل معلومات الملف في نظام التتبع
    try {
      await addFileRecord({
        id: fileId,
        fileName,
        originalName: file.name,
        filePath: fileUrl,
        fileType: "logo",
        fileSize: file.size,
        mimeType: file.type,
        uploadDate: new Date().toISOString(),
        metadata: {
          uploadType: "company-logo",
        },
      })
      console.log(`File record added for: ${fileName}`)
    } catch (error) {
      console.error("Error adding file record:", error)
      // Continue even if tracking fails
    }

    // إرجاع رابط مباشر للملف
    return NextResponse.json({ url: fileUrl, success: true })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file", details: String(error) }, { status: 500 })
  }
}
