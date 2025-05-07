import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { userDataStore, StoredFile } from "@/lib/user-data-store"

// مخزن الملفات المحلي (سيتم تحديثه من localStorage)
let localFiles: StoredFile[] = []

// وظيفة لتحميل الملفات من localStorage
const loadFilesFromLocalStorage = () => {
  try {
    // استخدام userDataStore للوصول إلى localStorage
    if (typeof window !== 'undefined') {
      localFiles = userDataStore.getFiles()
      console.log(`API: Loaded ${localFiles.length} files from localStorage`)
    }
  } catch (error) {
    console.error('Error loading files from localStorage:', error)
  }
}

// وظيفة لحفظ الملفات في localStorage
const saveFilesToLocalStorage = () => {
  try {
    // استخدام userDataStore للوصول إلى localStorage
    if (typeof window !== 'undefined') {
      userDataStore.saveFiles(localFiles)
      console.log(`API: Saved ${localFiles.length} files to localStorage`)
    }
  } catch (error) {
    console.error('Error saving files to localStorage:', error)
  }
}

export async function GET() {
  try {
    // تحميل الملفات من localStorage
    loadFilesFromLocalStorage()

    console.log(`API: Returning ${localFiles.length} files from local storage`)

    // تحويل الملفات إلى تنسيق مناسب للعرض
    const filesForDisplay = localFiles.map(file => {
      // إنشاء عنوان URL كامل للملف
      let filePath = ""
      if (file.content.startsWith('data:')) {
        filePath = file.content
      } else {
        filePath = `data:${file.mimeType};base64,${file.content}`
      }

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
    })

    return NextResponse.json({ files: filesForDisplay })
  } catch (error) {
    console.error("Error fetching local files:", error)
    return NextResponse.json({ error: "Failed to fetch files", details: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // تحويل الملف إلى base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Content = buffer.toString("base64")

    // تحديد نوع الملف
    const fileType = file.type.startsWith('image/') ? 'logo' : 'pdf'

    // إنشاء ملف جديد
    const newFile: StoredFile = {
      id: uuidv4(),
      fileName: file.name,
      originalName: file.name,
      fileType: fileType,
      fileSize: file.size,
      mimeType: file.type || (fileType === 'pdf' ? 'application/pdf' : 'image/png'),
      content: base64Content,
      uploadDate: new Date().toISOString(),
      metadata: {
        uploadType: fileType,
      },
    }

    // إضافة الملف إلى المخزن المحلي
    localFiles.push(newFile)

    // حفظ الملفات في localStorage
    saveFilesToLocalStorage()

    // إنشاء عنوان URL للملف
    const fileUrl = `data:${newFile.mimeType};base64,${base64Content}`

    return NextResponse.json({
      success: true,
      id: newFile.id,
      url: fileUrl,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll')

    // إذا كان هناك طلب لمسح جميع الملفات
    if (clearAll === 'true') {
      console.log("Clearing all files from local storage")
      // مسح جميع الملفات
      localFiles = []
      // حفظ الملفات في localStorage
      saveFilesToLocalStorage()
      return NextResponse.json({ success: true, message: "All files cleared" })
    }

    // إذا لم يكن هناك معرف ملف
    if (!id) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    // البحث عن الملف
    const fileIndex = localFiles.findIndex(file => file.id === id)

    if (fileIndex === -1) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // حذف الملف
    localFiles.splice(fileIndex, 1)

    // حفظ الملفات في localStorage
    saveFilesToLocalStorage()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file", details: String(error) }, { status: 500 })
  }
}
