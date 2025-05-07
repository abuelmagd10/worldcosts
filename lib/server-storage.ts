import { IFileStorage, StorageOptions } from "./storage-interface"
import { StoredFile } from "./db-storage"

// مخزن بيانات وهمي للاستخدام على الخادم
class ServerFileStorage implements IFileStorage {
  async getAllFiles(): Promise<StoredFile[]> {
    console.log("Server storage: getAllFiles called")
    return []
  }

  async addFile(
    file: Omit<StoredFile, "id">,
    options: StorageOptions = {}
  ): Promise<StoredFile> {
    console.log("Server storage: addFile called")
    throw new Error("Cannot add file in server context")
  }

  async getFileById(id: string): Promise<StoredFile | null> {
    console.log("Server storage: getFileById called")
    return null
  }

  async deleteFile(id: string): Promise<boolean> {
    console.log("Server storage: deleteFile called")
    return false
  }

  async getFileStats(): Promise<{
    totalFiles: number
    totalSize: number
    byType: Record<string, { count: number; size: number }>
  }> {
    console.log("Server storage: getFileStats called")
    return {
      totalFiles: 0,
      totalSize: 0,
      byType: {},
    }
  }
}

// إنشاء نسخة واحدة من مخزن الملفات للخادم
export const serverFileStorage = new ServerFileStorage()
