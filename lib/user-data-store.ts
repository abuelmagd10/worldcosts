// نوع بيانات العنصر
export interface Item {
  id: number
  name: string
  value: number
  currency: string
  originalValue: string
}

// نوع بيانات الشركة
export interface CompanyInfo {
  name: string
  address: string
  phone: string
  pdfFileName?: string
  logo?: string
}

// نوع الملف المخزن
export interface StoredFile {
  id: string
  fileName: string
  originalName?: string
  fileType: string
  fileSize: number
  mimeType: string
  storagePath?: string
  url: string
  content?: string
  uploadDate: string
  metadata?: Record<string, any>
}

// مفاتيح التخزين
const ITEMS_STORAGE_KEY = 'worldcosts_items'
const COMPANY_INFO_STORAGE_KEY = 'worldcosts_company_info'
const NEXT_ID_STORAGE_KEY = 'worldcosts_next_id'
const FILES_STORAGE_KEY = 'worldcosts_files'
const TOTAL_CURRENCY_STORAGE_KEY = 'worldcosts_total_currency'

// وظائف التخزين واسترجاع البيانات
export const userDataStore = {
  // تهيئة مخزن البيانات
  init: (): void => {
    if (typeof window !== 'undefined') {
      console.log('DEBUG - Initializing userDataStore');

      // التحقق من وجود مفتاح الملفات
      if (!localStorage.getItem(FILES_STORAGE_KEY)) {
        console.log('DEBUG - Creating empty files array in localStorage');
        localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify([]));
      }

      // التحقق من نجاح التهيئة
      const filesCheck = localStorage.getItem(FILES_STORAGE_KEY);
      console.log('DEBUG - Files check after init:', filesCheck ? 'Files key exists' : 'Files key does not exist');
    } else {
      console.error('DEBUG - window is undefined in init');
    }
  },
  // حفظ العناصر
  saveItems: (items: Item[]): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items))
    }
  },

  // استرجاع العناصر
  getItems: (): Item[] => {
    if (typeof window !== 'undefined') {
      const storedItems = localStorage.getItem(ITEMS_STORAGE_KEY)
      if (storedItems) {
        try {
          return JSON.parse(storedItems)
        } catch (error) {
          console.error('Error parsing stored items:', error)
        }
      }
    }
    return []
  },

  // حفظ معلومات الشركة
  saveCompanyInfo: (info: CompanyInfo): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMPANY_INFO_STORAGE_KEY, JSON.stringify(info))
    }
  },

  // استرجاع معلومات الشركة
  getCompanyInfo: (): CompanyInfo => {
    if (typeof window !== 'undefined') {
      const storedInfo = localStorage.getItem(COMPANY_INFO_STORAGE_KEY)
      if (storedInfo) {
        try {
          return JSON.parse(storedInfo)
        } catch (error) {
          console.error('Error parsing stored company info:', error)
        }
      }
    }
    return {
      name: '',
      address: '',
      phone: '',
      pdfFileName: '',
    }
  },

  // حفظ المعرف التالي
  saveNextId: (nextId: number): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NEXT_ID_STORAGE_KEY, nextId.toString())
    }
  },

  // استرجاع المعرف التالي
  getNextId: (): number => {
    if (typeof window !== 'undefined') {
      const storedNextId = localStorage.getItem(NEXT_ID_STORAGE_KEY)
      if (storedNextId) {
        const parsedNextId = parseInt(storedNextId, 10)
        if (!isNaN(parsedNextId)) {
          return parsedNextId
        }
      }
    }
    return 1
  },

  // حفظ الملفات
  saveFiles: (files: StoredFile[]): void => {
    console.log('DEBUG - saveFiles called with files:', files);

    if (typeof window !== 'undefined') {
      try {
        const jsonString = JSON.stringify(files);
        console.log('DEBUG - JSON string length:', jsonString.length);

        localStorage.setItem(FILES_STORAGE_KEY, jsonString);
        console.log(`DEBUG - Saved ${files.length} files to localStorage`);

        // التحقق من الحفظ
        const savedContent = localStorage.getItem(FILES_STORAGE_KEY);
        if (savedContent) {
          console.log('DEBUG - Verification: content was saved, length:', savedContent.length);
          try {
            const parsedContent = JSON.parse(savedContent);
            console.log('DEBUG - Verification: content can be parsed, items:', parsedContent.length);
          } catch (parseError) {
            console.error('DEBUG - Verification: saved content cannot be parsed:', parseError);
          }
        } else {
          console.error('DEBUG - Verification: no content was saved!');
        }
      } catch (error) {
        console.error('DEBUG - Error in saveFiles:', error);
      }
    } else {
      console.error('DEBUG - window is undefined in saveFiles');
    }
  },

  // استرجاع الملفات
  getFiles: (): StoredFile[] => {
    console.log('DEBUG - getFiles called');

    if (typeof window !== 'undefined') {
      try {
        const storedFiles = localStorage.getItem(FILES_STORAGE_KEY);
        console.log('DEBUG - Raw stored files:', storedFiles ? `Found (length: ${storedFiles.length})` : 'Not found');

        if (storedFiles) {
          try {
            const parsedFiles = JSON.parse(storedFiles);
            console.log('DEBUG - Parsed files:', parsedFiles ? `Found ${parsedFiles.length} files` : 'No files after parsing');
            return parsedFiles || [];
          } catch (parseError) {
            console.error('DEBUG - Error parsing stored files:', parseError);
          }
        } else {
          console.log('DEBUG - No files found in localStorage');
        }
      } catch (error) {
        console.error('DEBUG - Error in getFiles:', error);
      }
    } else {
      console.error('DEBUG - window is undefined in getFiles');
    }

    return [];
  },

  // إضافة ملف
  addFile: (file: StoredFile): StoredFile => {
    console.log('addFile called with file:', file.fileName);

    // التحقق من وجود window
    if (typeof window === 'undefined') {
      console.error('window is undefined in addFile');
      return file;
    }

    try {
      const files = userDataStore.getFiles();

      // التحقق مما إذا كان الملف موجودًا بالفعل
      const existingIndex = files.findIndex(f => f.id === file.id);

      if (existingIndex >= 0) {
        // تحديث الملف الموجود
        console.log(`Updating existing file at index ${existingIndex}`);
        files[existingIndex] = file;
      } else {
        // إضافة ملف جديد
        console.log('Adding new file');
        files.push(file);
      }

      // حفظ الملفات
      try {
        // تقليل حجم البيانات قبل الحفظ
        const filesToSave = files.map(f => {
          // إذا كان الملف كبيرًا جدًا، قم بإزالة محتواه
          if (f.content && f.content.length > 100000) {
            return {
              ...f,
              content: undefined // إزالة المحتوى الكبير
            };
          }
          return f;
        });

        // محاولة حفظ الملفات
        try {
          localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(filesToSave));
          console.log(`Saved ${filesToSave.length} files to localStorage`);
        } catch (quotaError) {
          console.error('Storage quota exceeded, trying to save with reduced data');

          // إذا فشل الحفظ، حاول إزالة جميع محتويات الملفات
          const reducedFiles = filesToSave.map(f => ({
            ...f,
            content: undefined
          }));

          try {
            localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(reducedFiles));
            console.log(`Saved ${reducedFiles.length} files with reduced data`);
          } catch (finalError) {
            console.error('Failed to save even with reduced data:', finalError);

            // إذا فشل الحفظ مرة أخرى، احتفظ فقط بالملفات الأحدث (آخر 10 ملفات)
            const latestFiles = reducedFiles
              .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
              .slice(0, 10);

            localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(latestFiles));
            console.log(`Saved only the latest ${latestFiles.length} files`);
          }
        }
      } catch (saveError) {
        console.error('Error saving to localStorage:', saveError);
        throw saveError; // إعادة رمي الخطأ ليتم معالجته في المستدعي
      }

      return file;
    } catch (error) {
      console.error('Error in addFile:', error);
      throw error; // إعادة رمي الخطأ ليتم معالجته في المستدعي
    }
  },

  // حذف ملف
  deleteFile: (id: string): boolean => {
    const files = userDataStore.getFiles()
    const newFiles = files.filter(f => f.id !== id)
    userDataStore.saveFiles(newFiles)
    return true
  },

  // مسح جميع الملفات
  clearFiles: (): boolean => {
    userDataStore.saveFiles([])
    return true
  },

  // حفظ عملة المجموع
  saveTotalCurrency: (currency: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOTAL_CURRENCY_STORAGE_KEY, currency)
    }
  },

  // استرجاع عملة المجموع
  getTotalCurrency: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOTAL_CURRENCY_STORAGE_KEY)
    }
    return null
  },

  // مسح جميع البيانات
  clearAllData: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ITEMS_STORAGE_KEY)
      localStorage.removeItem(COMPANY_INFO_STORAGE_KEY)
      localStorage.removeItem(NEXT_ID_STORAGE_KEY)
      localStorage.removeItem(FILES_STORAGE_KEY)
      localStorage.removeItem(TOTAL_CURRENCY_STORAGE_KEY)
    }
  }
}
