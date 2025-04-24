import fs from "fs"
import path from "path"
import { mkdir } from "fs/promises"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")
const PDFS_DIR = path.join(process.cwd(), "public", "pdfs")
const DATA_DIR = path.join(process.cwd(), "data")

export async function ensureDirectoriesExist() {
  try {
    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true })
      console.log(`Created directory: ${UPLOADS_DIR}`)
    }

    // Ensure PDFs directory exists
    if (!fs.existsSync(PDFS_DIR)) {
      await mkdir(PDFS_DIR, { recursive: true })
      console.log(`Created directory: ${PDFS_DIR}`)
    }

    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true })
      console.log(`Created directory: ${DATA_DIR}`)
    }

    // Create .gitkeep files if they don't exist
    const uploadsGitKeep = path.join(UPLOADS_DIR, ".gitkeep")
    if (!fs.existsSync(uploadsGitKeep)) {
      fs.writeFileSync(
        uploadsGitKeep,
        "# This file exists to ensure the directory is included in version control\n# This directory is used to store uploaded files like company logos\n",
      )
    }

    const pdfsGitKeep = path.join(PDFS_DIR, ".gitkeep")
    if (!fs.existsSync(pdfsGitKeep)) {
      fs.writeFileSync(
        pdfsGitKeep,
        "# This file exists to ensure the directory is included in version control\n# This directory is used to store generated PDF files\n",
      )
    }

    const dataGitKeep = path.join(DATA_DIR, ".gitkeep")
    if (!fs.existsSync(dataGitKeep)) {
      fs.writeFileSync(
        dataGitKeep,
        "# This file exists to ensure the directory is included in version control\n# This directory is used to store application data\n",
      )
    }

    return true
  } catch (error) {
    console.error("Error ensuring directories exist:", error)
    return false
  }
}
