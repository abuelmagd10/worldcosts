import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No PDF file uploaded" }, { status: 400 })
    }

    // التحقق من نوع الملف
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json({ error: "Invalid file type. Only PDF files are allowed." }, { status: 400 })
    }

    // التحقق من حجم الملف (الحد الأقصى 10 ميجابايت)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds the limit (10MB)." }, { status: 400 })
    }

    // تحويل الملف إلى base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Content = buffer.toString("base64")

    // تخزين الملف في قاعدة البيانات
    const storedFile = await fileStorage.addFile({
      fileName: file.name || "report.pdf",
      originalName: file.name || "report.pdf",
      fileType: "pdf",
      fileSize: file.size,
      mimeType: "application/pdf",
      content: base64Content,
      uploadDate: new Date().toISOString(),
      metadata: {
        uploadType: "report",
      },
    })

    // إنشاء عنوان URL للملف
    const fileUrl = `data:application/pdf;base64,${base64Content}`

    // إرجاع عنوان URL للملف
    return NextResponse.json({
      url: fileUrl,
      id: storedFile.id,
      success: true,
    })
  } catch (error) {
    console.error("Error uploading PDF:", error)
    return NextResponse.json({ error: "Failed to upload PDF", details: String(error) }, { status: 500 })
  }
}
