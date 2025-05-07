"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, ImageIcon, Download, Trash2, ExternalLink, RefreshCw, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { AppLogo } from "@/components/app-logo"
import { TeslaButton } from "@/components/ui/tesla-button"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { userDataStore, StoredFile } from "@/lib/user-data-store"
import { DirectFilesDisplay } from "@/components/direct-files-display"

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
  const [isUploading, setIsUploading] = useState(false)
  const [isRecreatingTable, setIsRecreatingTable] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // Cargar los archivos al montar el componente
  useEffect(() => {
    // تحميل الملفات عند تحميل الصفحة
    fetchFiles()

    // إعادة تحميل الملفات كل 5 ثوانٍ
    const interval = setInterval(() => {
      fetchFiles()
    }, 5000)

    // إضافة مستمع للأحداث للاستماع إلى تغييرات localStorage
    const handleStorageChange = () => {
      console.log('localStorage changed, reloading files')
      fetchFiles()
    }

    // إضافة مستمع الأحداث
    window.addEventListener('storage', handleStorageChange)

    // إزالة مستمع الأحداث عند إلغاء تحميل المكون
    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Función para cargar los archivos
  const fetchFiles = async () => {
    if (isLoading) return; // تجنب التحميل المتزامن

    setIsLoading(true)
    try {
      // استخدام userDataStore للحصول على الملفات مباشرة
      const filesFromStorage = userDataStore.getFiles();
      console.log('DEBUG - Files in localStorage:', filesFromStorage);

      // فحص محتوى localStorage مباشرة
      try {
        const rawStoredFiles = localStorage.getItem('worldcosts_files');
        console.log('DEBUG - Raw localStorage content:', rawStoredFiles);
        if (rawStoredFiles) {
          const parsedFiles = JSON.parse(rawStoredFiles);
          console.log('DEBUG - Parsed localStorage files:', parsedFiles);
        }
      } catch (localStorageError) {
        console.error('DEBUG - Error accessing localStorage directly:', localStorageError);
      }

      if (filesFromStorage && filesFromStorage.length > 0) {
        // ترتيب الملفات حسب تاريخ الرفع (الأحدث أولاً)
        const sortedFiles = [...filesFromStorage].sort((a, b) => {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        });

        console.log(`Loaded ${sortedFiles.length} files from localStorage:`, sortedFiles);
        setFiles(sortedFiles);
      } else {
        console.log('No files found in localStorage, trying API');
        // إذا لم تكن هناك ملفات في localStorage، استخدم API
        try {
          const response = await fetch(`/api/local-files?t=${Date.now()}`);
          if (!response.ok) {
            throw new Error("Failed to fetch files from API");
          }
          const data = await response.json();
          console.log('DEBUG - API response:', data);

          if (data.files && data.files.length > 0) {
            // ترتيب الملفات حسب تاريخ الرفع (الأحدث أولاً)
            const sortedFiles = [...data.files].sort((a, b) => {
              return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
            });

            console.log(`Loaded ${sortedFiles.length} files from API:`, sortedFiles);

            // حفظ الملفات في localStorage
            userDataStore.saveFiles(sortedFiles);

            setFiles(sortedFiles);
          } else {
            console.log('No files found in API');
            setFiles([]);
          }
        } catch (apiError) {
          console.error("Error fetching files from API:", apiError);
          setFiles([]);
        }
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      toast({
        title: "خطأ",
        description: "تعذر تحميل الملفات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Función para eliminar un archivo
  const deleteFile = async (id: string) => {
    try {
      // حذف الملف من localStorage مباشرة
      userDataStore.deleteFile(id);
      console.log(`File ${id} deleted from localStorage`);

      // حذف الملف من API
      try {
        const response = await fetch(`/api/local-files?id=${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          console.error('Error deleting file from API:', await response.text())
        }
      } catch (apiError) {
        console.error('Error calling API to delete file:', apiError)
      }

      // تحديث قائمة الملفات
      setFiles(files.filter((file) => file.id !== id))

      toast({
        title: "تم الحذف",
        description: "تم حذف الملف بنجاح",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        title: "خطأ",
        description: "تعذر حذف الملف",
        variant: "destructive",
      })
    }
  }

  // Función para descargar un archivo
  const downloadFile = (file: FileRecord) => {
    try {
      // إذا كان الملف من نوع StoredFile
      if ('content' in file || 'url' in file) {
        const storedFile = file as unknown as StoredFile;

        // إذا كان الملف يحتوي على محتوى مباشر
        if (storedFile.content) {
          // إنشاء رابط تنزيل
          const link = document.createElement('a');
          link.href = storedFile.content;
          link.download = storedFile.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        // إذا كان الملف يحتوي على URL
        else if (storedFile.url) {
          // إنشاء رابط تنزيل
          const link = document.createElement('a');
          link.href = storedFile.url;
          link.download = storedFile.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      // إذا كان الملف من النوع القديم
      else {
        // Crear un enlace temporal para la descarga
        const link = document.createElement("a")
        link.href = file.filePath
        link.download = file.originalName || file.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }

      toast({
        title: "تم التحميل",
        description: `تم تحميل الملف ${file.fileName} بنجاح`,
      });
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "خطأ",
        description: "تعذر تحميل الملف",
        variant: "destructive",
      })
    }
  }

  // وظيفة لعرض الملف
  const viewFile = (file: FileRecord) => {
    try {
      // إذا كان الملف من نوع StoredFile
      if ('content' in file || 'url' in file) {
        const storedFile = file as unknown as StoredFile;

        // التعامل مع الملفات حسب نوعها
        if (storedFile.fileType === 'logo' || storedFile.mimeType?.startsWith('image/')) {
          // إنشاء صفحة HTML مؤقتة لعرض الصورة
          const imageWindow = window.open('', '_blank');
          if (imageWindow) {
            imageWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>عرض الصورة: ${storedFile.fileName}</title>
                <style>
                  body {
                    margin: 0;
                    padding: 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f5f5f5;
                    font-family: Arial, sans-serif;
                    flex-direction: column;
                  }
                  img {
                    max-width: 90%;
                    max-height: 80vh;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                  }
                  h1 {
                    margin-bottom: 20px;
                    color: #333;
                  }
                  .info {
                    margin-top: 20px;
                    color: #666;
                  }
                </style>
              </head>
              <body>
                <h1>${storedFile.fileName}</h1>
                <img src="${storedFile.content || storedFile.url}" alt="${storedFile.fileName}" />
                <div class="info">
                  <p>النوع: ${storedFile.mimeType || 'image'}</p>
                  <p>الحجم: ${formatFileSize(storedFile.fileSize)}</p>
                  <p>تاريخ الرفع: ${new Date(storedFile.uploadDate).toLocaleString()}</p>
                </div>
              </body>
              </html>
            `);
            imageWindow.document.close();
          }
        } else if (storedFile.fileType === 'pdf' || storedFile.mimeType === 'application/pdf') {
          // عرض ملف PDF
          const url = storedFile.content || storedFile.url;
          window.open(url, '_blank');
        } else {
          // عرض أي نوع آخر من الملفات
          const url = storedFile.content || storedFile.url;
          if (url) {
            window.open(url, '_blank');
          } else {
            toast({
              title: "خطأ",
              description: "لا يمكن عرض الملف، المحتوى غير متوفر",
              variant: "destructive",
            });
          }
        }
      }
      // إذا كان الملف من النوع القديم
      else {
        window.open(file.filePath, "_blank");
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء عرض الملف",
        variant: "destructive",
      });
    }
  }

  // وظيفة مسح جميع الملفات
  const clearAllFiles = async () => {
    if (isRecreatingTable) return

    setIsRecreatingTable(true)
    try {
      // مسح الملفات من localStorage مباشرة
      userDataStore.clearFiles();
      console.log('All files cleared from localStorage');

      // مسح الملفات من API
      try {
        const response = await fetch('/api/local-files?clearAll=true', {
          method: 'DELETE',
        })

        if (!response.ok) {
          console.error('Error clearing files from API:', await response.text())
        }
      } catch (apiError) {
        console.error('Error calling API to clear files:', apiError)
      }

      toast({
        title: "تم مسح الملفات",
        description: "تم مسح جميع الملفات بنجاح",
      })

      // تحديث قائمة الملفات
      setTimeout(() => {
        fetchFiles()
      }, 500)
    } catch (error) {
      console.error("Error clearing files:", error)
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء مسح الملفات",
        variant: "destructive",
      })
    } finally {
      setIsRecreatingTable(false)
    }
  }

  // Función para subir un archivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Crear un objeto FormData
      const formData = new FormData()
      formData.append('file', file)

      // استخدام API المحلي
      const response = await fetch('/api/local-files', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error uploading file')
      }

      const data = await response.json()

      toast({
        title: "تم الرفع بنجاح",
        description: "تم رفع الملف بنجاح",
      })

      // تحديث قائمة الملفات
      fetchFiles()
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء رفع الملف",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // إعادة تعيين حقل الإدخال
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
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

        {/* عرض الملفات مباشرة من localStorage */}
        <div>
          <DirectFilesDisplay />
        </div>
      </div>
    </div>
  )
}
