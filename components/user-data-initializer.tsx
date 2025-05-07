"use client"

import { useEffect } from "react"
import { userDataStore } from "@/lib/user-data-store"

export function UserDataInitializer() {
  useEffect(() => {
    // تهيئة مخزن البيانات عند تحميل المكون
    userDataStore.init()
    console.log('UserDataInitializer: userDataStore initialized')

    // تنظيف localStorage من الملفات الكبيرة
    const cleanupLocalStorage = () => {
      try {
        const files = userDataStore.getFiles();

        // إزالة محتوى الملفات الكبيرة
        const cleanedFiles = files.map(file => {
          // إذا كان الملف يحتوي على محتوى كبير، قم بإزالته
          if (file.content && file.content.length > 50000) {
            return {
              ...file,
              content: undefined
            };
          }
          return file;
        });

        // حفظ الملفات بعد التنظيف
        if (files.length > 0) {
          userDataStore.saveFiles(cleanedFiles);
          console.log(`Cleaned up ${files.length} files in localStorage`);
        }
      } catch (error) {
        console.error('Error cleaning up localStorage:', error);
      }
    };

    // تنفيذ التنظيف
    cleanupLocalStorage();

    // إضافة مستمع للأحداث للتحقق من تغييرات localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'worldcosts_files') {
        console.log('localStorage worldcosts_files changed');
      }
    }

    // إضافة مستمع الأحداث
    window.addEventListener('storage', handleStorageChange)

    // إزالة مستمع الأحداث عند إلغاء تحميل المكون
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return null
}
