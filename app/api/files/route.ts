import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function GET() {
  try {
    const files = await fileStorage.getAllFiles()

    // تحويل الملفات إلى تنسيق مناسب للعرض (بدون محتوى الملف)
    const filesForDisplay = files.map((file) => {
      // استبعاد محتوى الملف لتقليل حجم الاستجابة
      const { content, ...fileInfo } = file

      // إنشاء عنوان URL للملف
      const fileUrl = `data:${file.mimeType};base64,${content.substring(0, 20)}...`

      return {
        ...fileInfo,
        filePath: fileUrl,
      }
    })

    return NextResponse.json({ files: filesForDisplay })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files", details: String(error) }, { status: 500 })
  }
}
