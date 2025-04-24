import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"
import { addFileRecord } from "@/lib/file-tracker"

// تكوين المجلد العام للملفات المرفوعة
const PDF_DIR = join(process.cwd(), "public", "pdfs")

export async function POST(request: Request) {
  try {
    // التأكد من وجود المجلد، وإنشاؤه إذا لم يكن موجوداً
    if (!existsSync(PDF_DIR)) {
      await mkdir(PDF_DIR, { recursive: true })
      console.log(`Created directory: ${PDF_DIR}`)
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    // إنشاء اسم فريد للملف
    const fileId = uuidv4()
    const fileName = `worldcosts_${fileId}.pdf`
    const filePath = join(PDF_DIR, fileName)
    const fileUrl = `/pdfs/${fileName}`

    // تحويل الملف إلى مصفوفة بايت
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // حفظ الملف في المجلد العام
    await writeFile(filePath, buffer)
    console.log(`PDF saved to: ${filePath}`)

    // تسجيل معلومات الملف في نظام التتبع
    try {
      await addFileRecord({
        id: fileId,
        fileName,
        originalName: file.name || "report.pdf",
        filePath: fileUrl,
        fileType: "pdf",
        fileSize: buffer.length,
        mimeType: "application/pdf",
        uploadDate: new Date().toISOString(),
        metadata: {
          uploadType: "report",
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
    console.error("Error uploading PDF:", error)
    return NextResponse.json({ error: "Failed to upload PDF", details: String(error) }, { status: 500 })
  }
}
