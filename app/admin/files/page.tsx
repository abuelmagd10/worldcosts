"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, ImageIcon, Download, Trash2 } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { AppLogo } from "@/components/app-logo"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// Definir la estructura de los datos de seguimiento de archivos
interface FileRecord {
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

export default function FilesAdminPage() {
  const { t, dir } = useLanguage()
  const { toast } = useToast()
  const [files, setFiles] = useState<FileRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  // Cargar los archivos al montar el componente
  useEffect(() => {
    fetchFiles()
  }, [])

  // Función para cargar los archivos
  const fetchFiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/files")
      if (!response.ok) {
        throw new Error("Failed to fetch files")
      }
      const data = await response.json()
      setFiles(data.files)
    } catch (error) {
      console.error("Error fetching files:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los archivos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Función para eliminar un archivo
  const deleteFile = async (id: string) => {
    try {
      const response = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete file")
      }

      // Actualizar la lista de archivos
      setFiles(files.filter((file) => file.id !== id))

      toast({
        title: "Éxito",
        description: "Archivo eliminado correctamente",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el archivo",
        variant: "destructive",
      })
    }
  }

  // Filtrar archivos según la pestaña activa
  const filteredFiles = activeTab === "all" ? files : files.filter((file) => file.fileType === activeTab)

  // Formatear el tamaño del archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Obtener el ícono según el tipo de archivo
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />
      case "logo":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={dir}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/">
            <TeslaButton variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t.backToHome}
            </TeslaButton>
          </Link>
          <AppLogo size={40} />
        </div>

        <TeslaCard className="max-w-6xl mx-auto">
          <TeslaCardHeader>
            <TeslaCardTitle className="text-2xl">إدارة الملفات المرفوعة</TeslaCardTitle>
          </TeslaCardHeader>
          <TeslaCardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">جميع الملفات</TabsTrigger>
                <TabsTrigger value="logo">الشعارات</TabsTrigger>
                <TabsTrigger value="pdf">ملفات PDF</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : filteredFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">لا توجد ملفات لعرضها</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead>اسم الملف</TableHead>
                          <TableHead>النوع</TableHead>
                          <TableHead>الحجم</TableHead>
                          <TableHead>تاريخ الرفع</TableHead>
                          <TableHead className="text-right">الإجراءات</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFiles.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell>{getFileIcon(file.fileType)}</TableCell>
                            <TableCell className="font-medium">{file.originalName || file.fileName}</TableCell>
                            <TableCell>{file.fileType}</TableCell>
                            <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                            <TableCell>{formatDate(file.uploadDate)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <TeslaButton
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => window.open(file.filePath, "_blank")}
                                >
                                  <Download className="h-4 w-4" />
                                  <span className="sr-only">تحميل</span>
                                </TeslaButton>
                                <TeslaButton
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => deleteFile(file.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">حذف</span>
                                </TeslaButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    </div>
  )
}
