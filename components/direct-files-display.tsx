"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { StoredFile, userDataStore } from "@/lib/user-data-store"
import { Download, Eye, Trash2, FileText, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"

export function DirectFilesDisplay() {
  const [files, setFiles] = useState<StoredFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // مفتاح لإجبار إعادة التحميل
  const { toast } = useToast()
  const { t, dir } = useLanguage() // استخدام نظام الترجمة

  // وظيفة لتحميل الملفات مباشرة من localStorage
  const loadFiles = () => {
    console.log("loadFiles function called");
    try {
      // محاولة تحميل الملفات من localStorage مباشرة
      const storedFiles = localStorage.getItem('worldcosts_files');
      console.log('DEBUG - Raw localStorage content:', storedFiles);

      let parsedFiles: StoredFile[] = [];

      if (storedFiles) {
        try {
          parsedFiles = JSON.parse(storedFiles);
          console.log('DEBUG - Parsed files:', parsedFiles);
        } catch (parseError) {
          console.error('Error parsing stored files:', parseError);
        }
      } else {
        console.log('No files found in localStorage');
      }

      // ترتيب الملفات حسب تاريخ الرفع (الأحدث أولاً)
      const sortedFiles = [...parsedFiles].sort((a, b) => {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      });

      console.log('Setting files state with:', sortedFiles);
      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    }
  }

  // وظيفة لتحديث القائمة
  const handleRefresh = () => {
    console.log("handleRefresh called");
    setIsLoading(true);

    // استخدام setTimeout لإعطاء فرصة لتحديث واجهة المستخدم
    setTimeout(() => {
      try {
        // تحميل الملفات من localStorage
        const storedFiles = localStorage.getItem('worldcosts_files');
        let parsedFiles: StoredFile[] = [];

        if (storedFiles) {
          try {
            parsedFiles = JSON.parse(storedFiles);
            console.log('DEBUG - Parsed files:', parsedFiles);
          } catch (parseError) {
            console.error('Error parsing stored files:', parseError);
          }
        }

        // ترتيب الملفات حسب تاريخ الرفع (الأحدث أولاً)
        const sortedFiles = [...parsedFiles].sort((a, b) => {
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        });

        // تحديث حالة الملفات
        setFiles(sortedFiles);

        // إظهار رسالة تأكيد
        toast({
          title: t.refreshed,
          description: t.refreshedDesc,
        });

        // زيادة مفتاح التحديث لإجبار إعادة التحميل
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error("Error refreshing files:", error);

        toast({
          title: t.fileViewError,
          description: "حدث خطأ أثناء تحميل الملفات",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 100);
  };

  // تحميل الملفات عند تحميل المكون أو تغيير مفتاح التحديث
  useEffect(() => {
    console.log("useEffect triggered, refreshKey:", refreshKey);
    setIsLoading(true);

    // استخدام setTimeout لإعطاء فرصة لتحديث واجهة المستخدم
    setTimeout(() => {
      loadFiles();
      setIsLoading(false);
    }, 100);

    // إضافة مستمع للأحداث للاستماع إلى تغييرات localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'worldcosts_files') {
        console.log('localStorage changed, reloading files')
        loadFiles()
      }
    }

    // إضافة مستمع الأحداث
    window.addEventListener('storage', handleStorageChange)

    // إزالة مستمع الأحداث عند إلغاء تحميل المكون
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [refreshKey])

  // وظيفة لتنسيق حجم الملف
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`
    } else {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`
    }
  }

  // وظيفة لتنسيق التاريخ
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (error) {
      return dateString
    }
  }

  // وظيفة لتحميل الملف
  const handleDownloadFile = (file: StoredFile) => {
    try {
      // إذا كان الملف يحتوي على محتوى مباشر
      if (file.content) {
        // إنشاء رابط تنزيل
        const link = document.createElement('a');
        link.href = file.content;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: t.fileDownloaded,
          description: t.fileDownloadedDesc,
        });
      }
      // إذا كان الملف يحتوي على URL
      else if (file.url) {
        // إنشاء رابط تنزيل
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: t.fileDownloaded,
          description: t.fileDownloadedDesc,
        });
      }
      // إذا لم يكن هناك محتوى أو URL
      else {
        toast({
          title: t.fileViewError,
          description: t.fileViewErrorDesc,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: t.fileViewError,
        description: "حدث خطأ أثناء تحميل الملف",
        variant: "destructive",
      });
    }
  }

  // وظيفة لعرض الملف
  const handleViewFile = (file: StoredFile) => {
    try {
      // التعامل مع الملفات حسب نوعها
      if (file.fileType === 'logo' || file.mimeType?.startsWith('image/')) {
        // إنشاء صفحة HTML مؤقتة لعرض الصورة
        const imageWindow = window.open('', '_blank');
        if (imageWindow) {
          imageWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>عرض الصورة: ${file.fileName}</title>
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
              <h1>${file.fileName}</h1>
              <img src="${file.content || file.url}" alt="${file.fileName}" />
              <div class="info">
                <p>النوع: ${file.mimeType || 'image'}</p>
                <p>الحجم: ${formatFileSize(file.fileSize)}</p>
                <p>تاريخ الرفع: ${new Date(file.uploadDate).toLocaleString()}</p>
              </div>
            </body>
            </html>
          `);
          imageWindow.document.close();
        }
      } else if (file.fileType === 'pdf' || file.mimeType === 'application/pdf') {
        // عرض ملف PDF
        const url = file.content || file.url;
        window.open(url, '_blank');
      } else {
        // عرض أي نوع آخر من الملفات
        const url = file.content || file.url;
        if (url) {
          window.open(url, '_blank');
        } else {
          toast({
            title: t.fileViewError,
            description: t.fileViewErrorDesc,
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error viewing file:", error);
      toast({
        title: t.fileViewError,
        description: "حدث خطأ أثناء عرض الملف",
        variant: "destructive",
      });
    }
  }

  // وظيفة لحذف الملف
  const handleDeleteFile = (fileId: string) => {
    try {
      // حذف الملف من localStorage
      userDataStore.deleteFile(fileId);

      // تحديث قائمة الملفات
      setFiles(files.filter(file => file.id !== fileId));

      toast({
        title: t.fileDeleted,
        description: t.fileDeletedDesc,
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: t.fileViewError,
        description: "حدث خطأ أثناء حذف الملف",
        variant: "destructive",
      });
    }
  }

  // وظيفة لمسح جميع الملفات
  const handleClearAllFiles = () => {
    if (isClearing) return;

    setIsClearing(true);
    try {
      // مسح جميع الملفات من localStorage
      userDataStore.clearFiles();

      // تحديث قائمة الملفات
      setFiles([]);

      toast({
        title: t.allFilesCleared,
        description: t.allFilesClearedDesc,
      });
    } catch (error) {
      console.error("Error clearing files:", error);
      toast({
        title: t.fileViewError,
        description: "حدث خطأ أثناء مسح الملفات",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  }

  // وظيفة لرفع ملف جديد
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log("Uploading file:", file.name, file.type, file.size);

    try {
      // إنشاء FormData
      const formData = new FormData();
      formData.append('file', file);

      // رفع الملف إلى API
      const response = await fetch('/api/local-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error uploading file');
      }

      const data = await response.json();
      console.log("Upload response:", data);

      // إنشاء ملف جديد
      const fileType = file.type.startsWith('image/') ? 'logo' : 'pdf';

      // قراءة الملف كـ ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // تحويل الملف إلى URL
      const fileUrl = URL.createObjectURL(file);

      // إنشاء كائن الملف
      const newFile: StoredFile = {
        id: data.id || crypto.randomUUID(),
        fileName: file.name,
        originalName: file.name,
        fileType: fileType,
        fileSize: file.size,
        mimeType: file.type || (fileType === 'pdf' ? 'application/pdf' : 'image/png'),
        content: fileUrl,
        uploadDate: new Date().toISOString(),
        metadata: {
          uploadType: fileType,
        },
      };

      // حفظ الملف في localStorage
      userDataStore.addFile(newFile);

      toast({
        title: t.fileUploaded,
        description: t.fileUploadedDesc,
      });

      // تحديث قائمة الملفات
      loadFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: t.fileViewError,
        description: error instanceof Error ? error.message : "حدث خطأ أثناء رفع الملف",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // إعادة تعيين حقل الإدخال
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }

  // حساب إجمالي حجم الملفات
  const calculateTotalSize = () => {
    if (!files.length) return 0;
    return files.reduce((total, file) => total + (file.fileSize || 0), 0);
  };

  // الحصول على عدد الملفات حسب النوع
  const getFileCountByType = () => {
    const counts = {
      pdf: 0,
      logo: 0,
      other: 0
    };

    files.forEach(file => {
      if (file.fileType === 'pdf') {
        counts.pdf++;
      } else if (file.fileType === 'logo') {
        counts.logo++;
      } else {
        counts.other++;
      }
    });

    return counts;
  };

  const fileCounts = getFileCountByType();
  const totalSize = calculateTotalSize();

  return (
    <div className="space-y-6">
      {/* إحصائيات الملفات */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t.fileStatistics}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium mb-2">{t.totalFiles}</h3>
              <p className="text-3xl font-bold">{files.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium mb-2">{t.totalSize}</h3>
              <p className="text-3xl font-bold">{formatFileSize(totalSize)}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <h3 className="text-lg font-medium mb-2">{t.fileTypes}</h3>
              <div className="flex justify-center gap-4">
                <div>
                  <p className="text-sm">{t.pdfFiles}</p>
                  <p className="text-xl font-bold">{fileCounts.pdf}</p>
                </div>
                <div>
                  <p className="text-sm">{t.logoFiles}</p>
                  <p className="text-xl font-bold">{fileCounts.logo}</p>
                </div>
                <div>
                  <p className="text-sm">{t.otherFiles}</p>
                  <p className="text-xl font-bold">{fileCounts.other}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* إدارة الملفات */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t.uploadedFilesManagement}</span>
            <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={handleClearAllFiles}
              disabled={isClearing}
              className="flex items-center gap-2"
            >
              {isClearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t.clearAllFiles}
            </Button>
            <Button
              variant="secondary"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="flex items-center gap-2"
              disabled={isUploading}
            >
              <input
                id="file-upload"
                type="file"
                accept=".pdf,image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleFileUpload}
              />
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {t.uploadNewFile}
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="mr-2">{t.refresh}</span>
            </Button>
          </div>
        </CardTitle>
        </CardHeader>
        <CardContent>
        {files.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.fileName}</TableHead>
                <TableHead>{t.fileType}</TableHead>
                <TableHead>{t.fileSize}</TableHead>
                <TableHead>{t.uploadDate}</TableHead>
                <TableHead className="text-center">{dir === 'rtl' ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.fileName}</TableCell>
                  <TableCell>{file.fileType}</TableCell>
                  <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                  <TableCell>{formatDate(file.uploadDate)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownloadFile(file)}
                        title={t.downloadFile}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewFile(file)}
                        title={t.viewFile}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteFile(file.id)}
                        title={t.deleteFile}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">{t.noFiles}</div>
        )}
      </CardContent>
    </Card>
    </div>
  )
}
