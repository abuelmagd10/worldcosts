import fs from "fs"
import path from "path"
import { initDirectories } from "./init-directories"

// تعريف بنية بيانات سجلات الملفات
export interface FileRecord {
  id: string
  fileName: string
  originalName?: string
  filePath: string
  fileType: string
  fileSize: number
  mimeType?: string
  uploadDate: string
  userId?: string
  metadata?: Record<string, any>
}

// مسار ملف JSON الذي سيخزن السجلات
const DATA_DIR = path.join(process.cwd(), "data")
const FILE_RECORDS_PATH = path.join(DATA_DIR, "file-records.json")

// التأكد من وجود مجلد البيانات
async function ensureDataDirExists() {
  try {
    await initDirectories()
  } catch (error) {
    console.error("Error ensuring data directory exists:", error)
  }
}

// الحصول على جميع سجلات الملفات
export async function getAllFileRecords(): Promise<FileRecord[]> {
  await ensureDataDirExists()

  try {
    if (!fs.existsSync(FILE_RECORDS_PATH)) {
      return []
    }

    const data = fs.readFileSync(FILE_RECORDS_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading file records:", error)
    return []
  }
}

// إضافة سجل ملف جديد
export async function addFileRecord(record: FileRecord): Promise<FileRecord> {
  await ensureDataDirExists()

  try {
    const records = await getAllFileRecords()
    records.push(record)
    fs.writeFileSync(FILE_RECORDS_PATH, JSON.stringify(records, null, 2))
    return record
  } catch (error) {
    console.error("Error adding file record:", error)
    throw error
  }
}

// الحصول على سجل ملف بواسطة المعرف
export async function getFileRecordById(id: string): Promise<FileRecord | null> {
  const records = await getAllFileRecords()
  const record = records.find((r) => r.id === id)
  return record || null
}

// الحصول على سجلات الملفات حسب النوع
export async function getFileRecordsByType(fileType: string): Promise<FileRecord[]> {
  const records = await getAllFileRecords()
  return records.filter((r) => r.fileType === fileType)
}

// حذف سجل ملف بواسطة المعرف
export async function deleteFileRecord(id: string): Promise<boolean> {
  try {
    const records = await getAllFileRecords()
    const newRecords = records.filter((r) => r.id !== id)

    if (records.length === newRecords.length) {
      return false // لم يتم العثور على السجل
    }

    fs.writeFileSync(FILE_RECORDS_PATH, JSON.stringify(newRecords, null, 2))
    return true
  } catch (error) {
    console.error("Error deleting file record:", error)
    return false
  }
}
