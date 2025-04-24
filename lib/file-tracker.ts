import fs from "fs"
import path from "path"
import { ensureDirectoriesExist } from "./ensure-directories"

// Definir la estructura de los datos de seguimiento de archivos
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

// Ruta al archivo JSON que almacenará los registros
const DATA_DIR = path.join(process.cwd(), "data")
const FILE_RECORDS_PATH = path.join(DATA_DIR, "file-records.json")

// Asegurar que el directorio de datos existe
async function ensureDataDirExists() {
  try {
    await ensureDirectoriesExist()

    if (!fs.existsSync(FILE_RECORDS_PATH)) {
      fs.writeFileSync(FILE_RECORDS_PATH, JSON.stringify([], null, 2))
    }
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Obtener todos los registros de archivos
export async function getAllFileRecords(): Promise<FileRecord[]> {
  await ensureDataDirExists()

  try {
    const data = fs.readFileSync(FILE_RECORDS_PATH, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading file records:", error)
    return []
  }
}

// Agregar un nuevo registro de archivo
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

// Obtener un registro de archivo por ID
export async function getFileRecordById(id: string): Promise<FileRecord | null> {
  const records = await getAllFileRecords()
  const record = records.find((r) => r.id === id)
  return record || null
}

// Obtener registros de archivos por tipo
export async function getFileRecordsByType(fileType: string): Promise<FileRecord[]> {
  const records = await getAllFileRecords()
  return records.filter((r) => r.fileType === fileType)
}

// Eliminar un registro de archivo por ID
export async function deleteFileRecord(id: string): Promise<boolean> {
  try {
    const records = await getAllFileRecords()
    const newRecords = records.filter((r) => r.id !== id)

    if (records.length === newRecords.length) {
      return false // No se encontró el registro
    }

    fs.writeFileSync(FILE_RECORDS_PATH, JSON.stringify(newRecords, null, 2))
    return true
  } catch (error) {
    console.error("Error deleting file record:", error)
    return false
  }
}
