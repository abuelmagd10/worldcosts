import { v4 as uuidv4 } from "uuid"
import { IFileStorage, StorageOptions, StorageProgress } from "./storage-interface"

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

const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB

// مخزن بيانات بسيط باستخدام localStorage
class FileStorage implements IFileStorage {
  private storageKey = "worldcosts_files"
  private maxChunkSize: number

  constructor(chunkSize: number = DEFAULT_CHUNK_SIZE) {
    this.maxChunkSize = chunkSize;
  }

  private async retry<T>(
    operation: () => Promise<T>,
    attempts: number
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempts <= 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.retry(operation, attempts - 1);
    }
  }

  private chunkifyContent(content: string): string[] {
    const chunks: string[] = []
    let i = 0
    while (i < content.length) {
      chunks.push(content.slice(i, i + this.maxChunkSize))
      i += this.maxChunkSize
    }
    return chunks
  }

  private dechunkifyContent(chunks: string[]): string {
    return chunks.join("")
  }

  async getAllFiles(): Promise<StoredFile[]> {
    if (typeof window === "undefined") return []

    try {
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      if (!indexData) return []

      const fileIndex = JSON.parse(indexData) as Array<Omit<StoredFile, "content"> & { chunkCount: number }>

      const files: StoredFile[] = []

      for (const indexItem of fileIndex) {
        try {
          const chunks: string[] = []
          for (let i = 0; i < indexItem.chunkCount; i++) {
            const chunk = localStorage.getItem(`${this.storageKey}_${indexItem.id}_chunk_${i}`)
            if (chunk) {
              chunks.push(chunk)
            } else {
              console.warn(`Missing chunk ${i} for file ${indexItem.id}`)
            }
          }

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

  async addFile(
    file: Omit<StoredFile, "id">,
    options: StorageOptions = {}
  ): Promise<StoredFile> {
    if (typeof window === "undefined")
      throw new Error("Cannot add file in server context")

    const retryAttempts = options.retryAttempts ?? DEFAULT_RETRY_ATTEMPTS;
    const chunkSize = options.chunkSize ?? this.maxChunkSize;

    return this.retry(async () => {
      const id = uuidv4()
      const contentChunks = this.chunkifyContent(file.content)
      const totalChunks = contentChunks.length;

      for (let i = 0; i < contentChunks.length; i++) {
        await this.retry(async () => {
          localStorage.setItem(`${this.storageKey}_${id}_chunk_${i}`, contentChunks[i])
        }, retryAttempts);

        if (options.onProgress) {
          const progress: StorageProgress = {
            bytesTransferred: (i + 1) * chunkSize,
            totalBytes: file.fileSize,
            percent: ((i + 1) / totalChunks) * 100
          };
          options.onProgress(progress);
        }
      }

      const newFile: StoredFile = {
        ...file,
        id,
      }

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

      await this.retry(async () => {
        localStorage.setItem(`${this.storageKey}_index`, JSON.stringify(fileIndex))
      }, retryAttempts);

      return newFile
    }, retryAttempts);
  }

  async getFileById(id: string): Promise<StoredFile | null> {
    // التحقق من بيئة التنفيذ
    if (typeof window === "undefined") {
      console.log("Running in server environment, cannot get file by ID")
      return null
    }

    try {
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      if (!indexData) return null

      const fileIndex = JSON.parse(indexData)
      const indexItem = fileIndex.find((item: any) => item.id === id)

      if (!indexItem) return null

      const chunks: string[] = []
      for (let i = 0; i < indexItem.chunkCount; i++) {
        const chunk = localStorage.getItem(`${this.storageKey}_${id}_chunk_${i}`)
        if (chunk) {
          chunks.push(chunk)
        } else {
          console.warn(`Missing chunk ${i} for file ${id}`)
        }
      }

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

  async deleteFile(id: string): Promise<boolean> {
    if (typeof window === "undefined") throw new Error("Cannot delete file in server context")

    try {
      const indexData = localStorage.getItem(`${this.storageKey}_index`)
      if (!indexData) return false

      const fileIndex = JSON.parse(indexData)
      const indexItem = fileIndex.find((item: any) => item.id === id)

      if (!indexItem) return false

      for (let i = 0; i < indexItem.chunkCount; i++) {
        localStorage.removeItem(`${this.storageKey}_${id}_chunk_${i}`)
      }

      const newIndex = fileIndex.filter((item: any) => item.id !== id)
      localStorage.setItem(`${this.storageKey}_index`, JSON.stringify(newIndex))

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  async getFileStats(): Promise<{
    totalFiles: number
    totalSize: number
    byType: Record<string, { count: number; size: number }>
  }> {
    // التحقق من بيئة التنفيذ
    if (typeof window === "undefined") {
      console.log("Running in server environment, returning empty stats")
      return {
        totalFiles: 0,
        totalSize: 0,
        byType: {},
      }
    }

    try {
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
const clientStorage = new FileStorage()

// تصدير مخزن الملفات المناسب بناءً على بيئة التنفيذ
export const fileStorage = typeof window === 'undefined'
  ? require('./supabase-storage').supabaseFileStorage
  : clientStorage
