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

  // الحصول على جميع الملفات
  async getAllFiles(): Promise<StoredFile[]> {
    if (typeof window === "undefined") return []

    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error getting files from storage:", error)
      return []
    }
  }

  // إضافة ملف جديد
  async addFile(file: Omit<StoredFile, "id">): Promise<StoredFile> {
    if (typeof window === "undefined") throw new Error("Cannot add file in server context")

    try {
      const files = await this.getAllFiles()
      const newFile: StoredFile = {
        ...file,
        id: uuidv4(),
      }

      files.push(newFile)
      localStorage.setItem(this.storageKey, JSON.stringify(files))

      return newFile
    } catch (error) {
      console.error("Error adding file to storage:", error)
      throw error
    }
  }

  // الحصول على ملف بواسطة المعرف
  async getFileById(id: string): Promise<StoredFile | null> {
    try {
      const files = await this.getAllFiles()
      return files.find((file) => file.id === id) || null
    } catch (error) {
      console.error("Error getting file by ID:", error)
      return null
    }
  }

  // حذف ملف بواسطة المعرف
  async deleteFile(id: string): Promise<boolean> {
    if (typeof window === "undefined") throw new Error("Cannot delete file in server context")

    try {
      const files = await this.getAllFiles()
      const newFiles = files.filter((file) => file.id !== id)

      if (files.length === newFiles.length) {
        return false // لم يتم العثور على الملف
      }

      localStorage.setItem(this.storageKey, JSON.stringify(newFiles))
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
      const files = await this.getAllFiles()

      const stats = {
        totalFiles: files.length,
        totalSize: files.reduce((sum, file) => sum + file.fileSize, 0),
        byType: {} as Record<string, { count: number; size: number }>,
      }

      // تجميع حسب النوع
      files.forEach((file) => {
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
