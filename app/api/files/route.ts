import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function GET() {
  try {
    const files = await fileStorage.getAllFiles()

    // تحويل الملفات إلى تنسيق مناسب للعرض
    const filesForDisplay = await Promise.all(
      files.map(async (file) => {
        // إنشاء عنوان URL كامل للملف
        const fileUrl = `data:${file.mimeType};base64,${file.content}`

        return {
          id: file.id,
          fileName: file.fileName,
          originalName: file.originalName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
          uploadDate: file.uploadDate,
          metadata: file.metadata,
          filePath: fileUrl,
        }
      }),
    )

    return NextResponse.json({ files: filesForDisplay })
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files", details: String(error) }, { status: 500 })
  }
}
