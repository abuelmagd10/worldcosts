import { NextResponse } from "next/server"
import { supabase, uploadBase64File, deleteFile, listFiles, createBucketIfNotExists } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

// التحقق من وجود الـ bucket وإنشائه إذا لم يكن موجودًا
createBucketIfNotExists('worldcosts-files')
  .then(() => console.log('Bucket check completed'))
  .catch(error => console.error('Error checking bucket:', error))

// إنشاء نوع للملف
type StoredFile = {
  id: string
  fileName: string
  originalName?: string
  fileType: string
  fileSize: number
  mimeType: string
  storagePath?: string
  url: string
  content?: string
  uploadDate: string
  metadata?: Record<string, any>
}

// مخزن الملفات المحلي (سيتم استبداله بـ Supabase Storage)
let localFiles: StoredFile[] = []

// وظيفة للحصول على قائمة الملفات
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // محاولة الحصول على الملفات من Supabase Storage
    try {
      const files = await listFiles('worldcosts-files', 'uploads')

      // تحويل الملفات إلى التنسيق المطلوب
      localFiles = files.map(file => ({
        id: file.id || uuidv4(),
        fileName: file.name,
        originalName: file.name,
        fileType: file.metadata?.mimetype?.split('/')[0] || 'unknown',
        fileSize: file.metadata?.size || 0,
        mimeType: file.metadata?.mimetype || 'application/octet-stream',
        storagePath: `uploads/${file.name}`,
        url: file.url,
        uploadDate: new Date(file.created_at || Date.now()).toISOString(),
        metadata: {
          ...file.metadata,
          source: 'supabase'
        }
      }))

      console.log(`Loaded ${localFiles.length} files from Supabase Storage`)
    } catch (storageError) {
      console.error('Error loading files from Supabase Storage:', storageError)
    }

    // إذا تم تحديد معرف، قم بإرجاع ملف واحد
    if (id) {
      const file = localFiles.find(f => f.id === id)

      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 })
      }

      return NextResponse.json({ file })
    }

    // تحويل الملفات إلى تنسيق مناسب للعرض
    const filesForDisplay = localFiles.map(file => {
      // إنشاء عنوان URL كامل للملف إذا لم يكن موجودًا
      let filePath = file.url

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
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files", details: String(error) }, { status: 500 })
  }
}

// وظيفة لرفع ملف
export async function POST(request: Request) {
  try {
    // التحقق من نوع الطلب
    const contentType = request.headers.get('content-type') || ''

    // إذا كان الطلب يحتوي على بيانات form-data
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
      }

      // قراءة الملف كـ ArrayBuffer
      const fileBuffer = await file.arrayBuffer()
      const fileArray = new Uint8Array(fileBuffer)

      // رفع الملف إلى Supabase Storage
      const fileName = `${Date.now()}_${file.name}`
      const { data: storageData, error: storageError } = await supabase.storage
        .from('worldcosts-files')
        .upload(`uploads/${fileName}`, fileArray, {
          contentType: file.type,
          upsert: false
        })

      if (storageError) {
        throw storageError
      }

      // الحصول على URL العام للملف
      const { data: urlData } = supabase.storage
        .from('worldcosts-files')
        .getPublicUrl(`uploads/${fileName}`)

      // إنشاء سجل الملف
      const fileRecord: StoredFile = {
        id: uuidv4(),
        fileName: file.name,
        originalName: file.name,
        fileType: file.type.split('/')[0],
        fileSize: file.size,
        mimeType: file.type,
        storagePath: storageData.path,
        url: urlData.publicUrl,
        uploadDate: new Date().toISOString(),
        metadata: {
          uploadType: 'form',
          source: 'api'
        }
      }

      // إضافة الملف إلى المخزن المحلي
      localFiles.push(fileRecord)

      return NextResponse.json({
        id: fileRecord.id,
        fileName: fileRecord.fileName,
        url: fileRecord.url,
        success: true
      })
    }

    // إذا كان الطلب يحتوي على بيانات JSON
    if (contentType.includes('application/json')) {
      const body = await request.json()
      const { base64Data, fileName, mimeType, metadata } = body

      if (!base64Data || !fileName || !mimeType) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // رفع الملف من base64 إلى Supabase
      const uploadResult = await uploadBase64File(base64Data, fileName, mimeType, 'worldcosts-files', 'uploads')

      // إنشاء سجل الملف
      const fileRecord: StoredFile = {
        id: uuidv4(),
        fileName: fileName,
        originalName: fileName,
        fileType: mimeType.split('/')[0],
        fileSize: Math.round(base64Data.length * 0.75), // تقدير تقريبي لحجم الملف
        mimeType: mimeType,
        storagePath: uploadResult.path,
        url: uploadResult.url,
        uploadDate: new Date().toISOString(),
        metadata: metadata || {
          uploadType: 'base64',
          source: 'api'
        }
      }

      // إضافة الملف إلى المخزن المحلي
      localFiles.push(fileRecord)

      return NextResponse.json({
        id: fileRecord.id,
        fileName: fileRecord.fileName,
        url: fileRecord.url,
        success: true
      })
    }

    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file", details: String(error) }, { status: 500 })
  }
}

// وظيفة لحذف ملف
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll')

    // إذا كان هناك طلب لمسح جميع الملفات
    if (clearAll === 'true') {
      console.log("Clearing all files from storage")

      // حذف جميع الملفات من Supabase Storage
      try {
        // الحصول على قائمة الملفات
        const files = await listFiles('worldcosts-files', 'uploads')

        // حذف كل ملف
        for (const file of files) {
          if (file.name) {
            try {
              await deleteFile(`uploads/${file.name}`, 'worldcosts-files')
              console.log(`Deleted file: ${file.name}`)
            } catch (deleteError) {
              console.error(`Error deleting file ${file.name}:`, deleteError)
            }
          }
        }
      } catch (listError) {
        console.error('Error listing files for deletion:', listError)
      }

      // مسح المخزن المحلي
      localFiles = []

      return NextResponse.json({ success: true, message: "All files cleared" })
    }

    // إذا لم يتم تحديد معرف
    if (!id) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    // البحث عن الملف في المخزن المحلي
    const fileIndex = localFiles.findIndex(file => file.id === id)

    if (fileIndex === -1) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const fileToDelete = localFiles[fileIndex]

    // حذف الملف من Supabase Storage
    if (fileToDelete.storagePath) {
      try {
        await deleteFile(fileToDelete.storagePath, 'worldcosts-files')
        console.log(`Deleted file from storage: ${fileToDelete.storagePath}`)
      } catch (storageError) {
        console.error("Error deleting file from storage:", storageError)
      }
    }

    // حذف الملف من المخزن المحلي
    localFiles.splice(fileIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file", details: String(error) }, { status: 500 })
  }
}
