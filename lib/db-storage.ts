import { v4 as uuidv4 } from "uuid"

// نوع بيانات الملف المخزن
export interface StoredFile {
  id: string
  fileName: string
  originalName?: string
  fileType: string
  fileSize: number
  mimeType?: string
  content: string // محتوى الملف بتنسيق base64
  uploadDate: string
  metadata?: Record<string, any>
}

// مخزن بيانات بسيط باستخدام localStorage
class FileStorage {
  private storageKey = "worldcosts_files"
  private maxChunkSize = 1024 * 1024 // 1MB per chunk

  // تقسيم الملفات الكبيرة إلى أجزاء صغيرة
  private chunkifyContent(content: string): string[] {
    const chunks: string[] = []
    let i = 0
    while (i < content.length) {
      chunks.push(content.slice(i, i + this.maxChunkSize))
      i += this.maxChunkSize
    }
    return chunks
  }

  // إعادة تجميع الأجزاء إلى ملف كامل
  private dechunkifyContent(chunks: string[]): string {
    return chunks.join("")
  }

  // الحصول على جميع الملفات
  async getAllFiles(): Promise<StoredFile[]> {
    if (typeof window === "undefined") return []

    try {
      // الحصول على فهرس الملفات
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      if (!indexData) return []

      const fileIndex = JSON.parse(indexData) as Array<Omit<StoredFile, "content"> & { chunkCount: number }>

      // استرجاع محتوى كل ملف
      const files: StoredFile[] = []

      for (const indexItem of fileIndex) {
        try {
          // استرجاع أجزاء المحتوى
          const chunks: string[] = []
          for (let i = 0; i < indexItem.chunkCount; i++) {
            const chunk = localStorage.getItem(`${this.storageKey}_${indexItem.id}_chunk_${i}`)
            if (chunk) {
              chunks.push(chunk)
            } else {
              console.warn(`Missing chunk ${i} for file ${indexItem.id}`)
            }
          }

          // إعادة تجميع المحتوى
          const content = this.dechunkifyContent(chunks)

          files.push({
            ...indexItem,
            content,
          })
        } catch (error) {
          console.error(`Error retrieving file ${indexItem.id}:`, error)
        }
      }

      return files
    } catch (error) {
      console.error("Error getting files from storage:", error)
      return []
    }
  }

  // إضافة ملف جديد
  async addFile(file: Omit<StoredFile, "id">): Promise<StoredFile> {
    if (typeof window === "undefined") throw new Error("Cannot add file in server context")

    try {
      // إنشاء معرف جديد للملف
      const id = uuidv4()

      // تقسيم المحتوى إلى أجزاء
      const contentChunks = this.chunkifyContent(file.content)

      // تخزين أجزاء المحتوى
      for (let i = 0; i < contentChunks.length; i++) {
        localStorage.setItem(`${this.storageKey}_${id}_chunk_${i}`, contentChunks[i])
      }

      // إنشاء كائن الملف الجديد (بدون المحتوى)
      const newFile: StoredFile = {
        ...file,
        id,
      }

      // تحديث فهرس الملفات
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      const fileIndex = indexData ? JSON.parse(indexData) : []

      fileIndex.push({
        id: newFile.id,
        fileName: newFile.fileName,
        originalName: newFile.originalName,
        fileType: newFile.fileType,
        fileSize: newFile.fileSize,
        mimeType: newFile.mimeType,
        uploadDate: newFile.uploadDate,
        metadata: newFile.metadata,
        chunkCount: contentChunks.length,
      })

      localStorage.setItem(`${this.storageKey}_index`, JSON.stringify(fileIndex))

      return newFile
    } catch (error) {
      console.error("Error adding file to storage:", error)
      throw error
    }
  }

  // الحصول على ملف بواسطة المعرف
  async getFileById(id: string): Promise<StoredFile | null> {
    try {
      // الحصول على فهرس الملفات
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      if (!indexData) return null

      const fileIndex = JSON.parse(indexData)
      const indexItem = fileIndex.find((item: any) => item.id === id)

      if (!indexItem) return null

      // استرجاع أجزاء المحتوى
      const chunks: string[] = []
      for (let i = 0; i < indexItem.chunkCount; i++) {
        const chunk = localStorage.getItem(`${this.storageKey}_${id}_chunk_${i}`)
        if (chunk) {
          chunks.push(chunk)
        } else {
          console.warn(`Missing chunk ${i} for file ${id}`)
        }
      }

      // إعادة تجميع المحتوى
      const content = this.dechunkifyContent(chunks)

      return {
        ...indexItem,
        content,
      }
    } catch (error) {
      console.error("Error getting file by ID:", error)
      return null
    }
  }

  // حذف ملف بواسطة المعرف
  async deleteFile(id: string): Promise<boolean> {
    if (typeof window === "undefined") throw new Error("Cannot delete file in server context")

    try {
      // الحصول على فهرس الملفات
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      if (!indexData) return false

      const fileIndex = JSON.parse(indexData)
      const indexItem = fileIndex.find((item: any) => item.id === id)

      if (!indexItem) return false

      // حذف أجزاء المحتوى
      for (let i = 0; i < indexItem.chunkCount; i++) {
        localStorage.removeItem(`${this.storageKey}_${id}_chunk_${i}`)
      }

      // تحديث فهرس الملفات
      const newIndex = fileIndex.filter((item: any) => item.id !== id)
      localStorage.setItem(`${this.storageKey}_index`, JSON.stringify(newIndex))

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  // الحصول على إحصائيات الملفات
  async getFileStats(): Promise<{
    totalFiles: number
    totalSize: number
    byType: Record<string, { count: number; size: number }>
  }> {
    try {
      // الحصول على فهرس الملفات
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      if (!indexData) {
        return {
          totalFiles: 0,
          totalSize: 0,
          byType: {},
        }
      }

      const fileIndex = JSON.parse(indexData)

      const stats = {
        totalFiles: fileIndex.length,
        totalSize: fileIndex.reduce((sum: number, file: any) => sum + file.fileSize, 0),
        byType: {} as Record<string, { count: number; size: number }>,
      }

      // تجميع حسب النوع
      fileIndex.forEach((file: any) => {
        if (!stats.byType[file.fileType]) {
          stats.byType[file.fileType] = { count: 0, size: 0 }
        }

        stats.byType[file.fileType].count += 1
        stats.byType[file.fileType].size += file.fileSize
      })

      return stats
    } catch (error) {
      console.error("Error getting file stats:", error)
      return {
        totalFiles: 0,
        totalSize: 0,
        byType: {},
      }
    }
  }
}

// إنشاء نسخة واحدة من مخزن الملفات
export const fileStorage = new FileStorage()
