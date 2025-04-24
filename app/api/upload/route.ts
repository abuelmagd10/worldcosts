import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // التحقق من نوع الملف
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and SVG are allowed." },
        { status: 400 },
      )
    }

    // التحقق من حجم الملف (الحد الأقصى 2 ميجابايت)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds the limit (2MB)." }, { status: 400 })
    }

    // تحويل الملف إلى base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Content = buffer.toString("base64")

    // تخزين الملف في قاعدة البيانات
    const storedFile = await fileStorage.addFile({
      fileName: file.name,
      originalName: file.name,
      fileType: "logo",
      fileSize: file.size,
      mimeType: file.type,
      content: base64Content,
      uploadDate: new Date().toISOString(),
      metadata: {
        uploadType: "company-logo",
      },
    })

    // إنشاء عنوان URL للملف
    const fileUrl = `data:${file.type};base64,${base64Content}`

    // إرجاع عنوان URL للملف
    return NextResponse.json({
      url: fileUrl,
      id: storedFile.id,
      success: true,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file", details: String(error) }, { status: 500 })
  }
}
