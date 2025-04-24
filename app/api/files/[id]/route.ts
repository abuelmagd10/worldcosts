import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const fileRecord = await fileStorage.getFileById(params.id)

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // إنشاء عنوان URL كامل للملف
    const fileUrl = `data:${fileRecord.mimeType};base64,${fileRecord.content}`

    return NextResponse.json({
      file: {
        id: fileRecord.id,
        fileName: fileRecord.fileName,
        originalName: fileRecord.originalName,
        fileType: fileRecord.fileType,
        fileSize: fileRecord.fileSize,
        mimeType: fileRecord.mimeType,
        uploadDate: fileRecord.uploadDate,
        metadata: fileRecord.metadata,
        filePath: fileUrl,
      },
    })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Failed to fetch file", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await fileStorage.deleteFile(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file", details: String(error) }, { status: 500 })
  }
}
