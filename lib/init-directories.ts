import fs from "fs"
import path from "path"
import { mkdir } from "fs/promises"

// تحديد المسارات الضرورية
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")
const PDFS_DIR = path.join(process.cwd(), "public", "pdfs")
const DATA_DIR = path.join(process.cwd(), "data")

// وظيفة لإنشاء المجلدات إذا لم تكن موجودة
export async function initDirectories() {
  try {
    // إنشاء مجلد التحميلات
    if (!fs.existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true })
      console.log(`Created directory: ${UPLOADS_DIR}`)
    }

    // إنشاء مجلد ملفات PDF
    if (!fs.existsSync(PDFS_DIR)) {
      await mkdir(PDFS_DIR, { recursive: true })
      console.log(`Created directory: ${PDFS_DIR}`)
    }

    // إنشاء مجلد البيانات
    if (!fs.existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true })
      console.log(`Created directory: ${DATA_DIR}`)
    }

    // إنشاء ملف سجلات الملفات إذا لم يكن موجوداً
    const FILE_RECORDS_PATH = path.join(DATA_DIR, "file-records.json")
    if (!fs.existsSync(FILE_RECORDS_PATH)) {
      fs.writeFileSync(FILE_RECORDS_PATH, JSON.stringify([], null, 2))
      console.log(`Created file: ${FILE_RECORDS_PATH}`)
    }

    return true
  } catch (error) {
    console.error("Error initializing directories:", error)
    return false
  }
}
