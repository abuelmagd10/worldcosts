import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function GET() {
  try {
    console.log("API: Fetching files...")
    const files = await fileStorage.getAllFiles()
    console.log(`API: Got ${files.length} files from storage`)

    // تحويل الملفات إلى تنسيق مناسب للعرض
    const filesForDisplay = await Promise.all(
      files.map(async (file) => {
        console.log(`API: Processing file ${file.fileName} (${file.id})`)

        // التحقق من نوع المحتوى وإنشاء مسار الملف
        let filePath = ""
        if (typeof file.content === 'string') {
          // إذا كان المحتوى رابطًا، نستخدمه مباشرة
          if (file.content.startsWith('http')) {
            filePath = file.content
            console.log(`API: Using direct URL for file ${file.fileName}`)
          } else if (file.content.startsWith('data:')) {
            // إذا كان المحتوى بتنسيق data URL، نستخدمه كما هو
            filePath = file.content
            console.log(`API: Using data URL for file ${file.fileName}`)
          } else {
            // إذا كان المحتوى base64، نقوم بتحويله إلى data URL
            filePath = `data:${file.mimeType || 'application/octet-stream'};base64,${file.content}`
            console.log(`API: Created data URL for file ${file.fileName}`)
          }
        } else {
          console.log(`API: Content is not a string for file ${file.fileName}`)
          filePath = ""
        }

        // طباعة جزء من المسار للتحقق
        console.log(`API: File path starts with: ${filePath.substring(0, 30)}...`)

        return {
          id: file.id,
          fileName: file.fileName,
          originalName: file.originalName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
          uploadDate: file.uploadDate,
          metadata: file.metadata,
          filePath: filePath,
        }
      }),
    )

    console.log(`API: Returning ${filesForDisplay.length} files for display`)
    return NextResponse.json({
      files: filesForDisplay,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error fetching files:", error)
    // إرجاع قائمة فارغة بدلاً من خطأ
    return NextResponse.json({
      files: [],
      error: String(error),
      timestamp: new Date().toISOString()
    })
  }
}
