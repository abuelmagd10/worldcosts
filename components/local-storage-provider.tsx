"use client"

import { useEffect, useState } from "react"

// نوع الملف المخزن
interface StoredFile {
  id: string
  fileName: string
  originalName?: string
  fileType: string
  fileSize: number
  mimeType: string
  content: string
  uploadDate: string
  metadata?: Record<string, any>
}

export function LocalStorageProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)

  // تحميل الملفات من localStorage عند تحميل المكون
  useEffect(() => {
    // تحميل الملفات من localStorage
    const loadFilesFromLocalStorage = () => {
      try {
        // التحقق من وجود ملفات في localStorage
        const storedFiles = localStorage.getItem('worldcosts_files')
        if (!storedFiles) {
          // إذا لم تكن هناك ملفات، قم بإنشاء مصفوفة فارغة
          localStorage.setItem('worldcosts_files', JSON.stringify([]))
        }
        
        // إنشاء حدث مخصص لإخبار API بأن الملفات جاهزة
        const event = new CustomEvent('worldcosts_files_loaded')
        window.dispatchEvent(event)
        
        console.log('LocalStorageProvider: Files loaded from localStorage')
      } catch (error) {
        console.error('Error loading files from localStorage:', error)
      }
    }
    
    // تسجيل مستمع للأحداث للاستماع إلى طلبات حفظ الملفات
    const handleSaveFiles = (event: CustomEvent<{ files: StoredFile[] }>) => {
      try {
        localStorage.setItem('worldcosts_files', JSON.stringify(event.detail.files))
        console.log(`Saved ${event.detail.files.length} files to localStorage`)
      } catch (error) {
        console.error('Error saving files to localStorage:', error)
      }
    }
    
    // إضافة مستمع الأحداث
    window.addEventListener('worldcosts_save_files', handleSaveFiles as EventListener)
    
    // تحميل الملفات
    loadFilesFromLocalStorage()
    
    // تعيين الحالة إلى مهيأة
    setIsInitialized(true)
    
    // إزالة مستمع الأحداث عند إلغاء تحميل المكون
    return () => {
      window.removeEventListener('worldcosts_save_files', handleSaveFiles as EventListener)
    }
  }, [])
  
  return <>{children}</>
}
