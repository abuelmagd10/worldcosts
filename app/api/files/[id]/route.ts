import { NextResponse } from "next/server"
import { fileStorage } from "@/lib/db-storage"
import { supabaseFileStorage } from "@/lib/supabaseStorage"

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const fileId = params.id

  if (!fileId) {
    return NextResponse.json({ error: "File ID is required" }, { status: 400 })
  }

  try {
    // Delete file using Supabase storage class (deletes from Storage and DB)
    const success = await supabaseFileStorage.deleteFile(fileId)

    if (!success) {
      // This might happen if the file metadata was not found in the DB
      // Or if there was an error deleting from the DB after potentially deleting from Storage
      // We might return 404 if not found, or 500 if DB deletion failed
      console.warn(`Failed to delete file with ID: ${fileId}. It might not exist or DB deletion failed.`)
      // Let's return 404 for simplicity, assuming not found is the common case
      return NextResponse.json({ error: "File not found or failed to delete" }, { status: 404 })
    }

    return NextResponse.json({ message: "File deleted successfully" }, { status: 200 })

  } catch (error) {
    console.error(`Error deleting file with ID ${fileId}:`, error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    // Add more specific error handling based on potential Supabase errors
    return NextResponse.json({ error: "Failed to delete file", details: errorMessage }, { status: 500 })
  }
}
