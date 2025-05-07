import { NextResponse } from "next/server"
import { supabaseFileStorage } from "@/lib/supabaseStorage"

// Helper function to convert base64 to File object
async function base64ToFile(base64String: string, fileName: string, fileType: string) {
  // Remove data URL prefix if present
  const base64Data = base64String.replace(/^data:[^;]+;base64,/, "")

  // Convert base64 to Blob
  const byteCharacters = atob(base64Data)
  const byteArrays = []
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }
  const blob = new Blob(byteArrays, { type: fileType })

  // Create File object
  return new File([blob], fileName, { type: fileType })
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const data = await request.json()
    const { file: fileData, fileName, fileType: mimeType } = data

    // Validate required fields
    if (!fileData || !fileName || !mimeType) {
      return NextResponse.json(
        { error: "Missing required fields (file, fileName, or fileType)" },
        { status: 400 }
      )
    }

    // Convert base64 string to File object
    const file = await base64ToFile(fileData, fileName, mimeType)
    if (!file) {
      return NextResponse.json({ error: "Invalid file data" }, { status: 400 })
    }

    // Determine file type category based on mime type
    const fileType = mimeType.startsWith("image/") ? "logo" : "pdf"

    // Upload file to Supabase
    const storedFile = await supabaseFileStorage.addFile({
      file,
      fileType,
    })

    return NextResponse.json(storedFile)
  } catch (error) {
    console.error("Error uploading file:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: "Failed to upload file", details: errorMessage },
      { status: 500 }
    )
  }
}
