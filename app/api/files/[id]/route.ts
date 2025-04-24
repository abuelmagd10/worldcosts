import { NextResponse } from "next/server"
import { deleteFileRecord, getFileRecordById } from "@/lib/file-tracker"
import fs from "fs"
import path from "path"
import { unlink } from "fs/promises"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const fileRecord = await getFileRecordById(params.id)

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    return NextResponse.json({ file: fileRecord })
  } catch (error) {
    console.error("Error fetching file:", error)
    return NextResponse.json({ error: "Failed to fetch file", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const fileRecord = await getFileRecordById(params.id)

    if (!fileRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Eliminar el archivo físico
    const filePath = path.join(process.cwd(), "public", fileRecord.filePath)
    console.log(`Attempting to delete file: ${filePath}`)

    if (fs.existsSync(filePath)) {
      await unlink(filePath)
      console.log(`File deleted: ${filePath}`)
    } else {
      console.log(`File not found on disk: ${filePath}`)
    }

    // Eliminar el registro
    const deleted = await deleteFileRecord(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete file record" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file", details: String(error) }, { status: 500 })
  }
}
