import { createClient } from '@supabase/supabase-js'

// إنشاء عميل Supabase
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// وظيفة لرفع ملف إلى Supabase Storage
export async function uploadFile(file: File, bucket: string = 'worldcosts-files', folder: string = 'uploads') {
  try {
    // إنشاء اسم فريد للملف
    const fileName = `${folder}/${Date.now()}_${file.name}`
    
    // رفع الملف
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      throw error
    }
    
    // الحصول على URL العام للملف
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)
    
    return {
      path: data?.path,
      url: urlData.publicUrl,
      fileName: file.name,
      size: file.size,
      type: file.type
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// وظيفة لرفع ملف من base64 إلى Supabase Storage
export async function uploadBase64File(
  base64Data: string, 
  fileName: string, 
  mimeType: string, 
  bucket: string = 'worldcosts-files', 
  folder: string = 'uploads'
) {
  try {
    // تحويل base64 إلى Blob
    const base64Response = await fetch(base64Data)
    const blob = await base64Response.blob()
    
    // إنشاء ملف من Blob
    const file = new File([blob], fileName, { type: mimeType })
    
    // استخدام وظيفة رفع الملف
    return await uploadFile(file, bucket, folder)
  } catch (error) {
    console.error('Error uploading base64 file:', error)
    throw error
  }
}

// وظيفة لحذف ملف من Supabase Storage
export async function deleteFile(path: string, bucket: string = 'worldcosts-files') {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      throw error
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// وظيفة للحصول على قائمة الملفات من Supabase Storage
export async function listFiles(bucket: string = 'worldcosts-files', folder: string = 'uploads') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })
    
    if (error) {
      throw error
    }
    
    // إضافة URLs للملفات
    const filesWithUrls = data.map(file => {
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(`${folder}/${file.name}`)
      
      return {
        ...file,
        url: urlData.publicUrl
      }
    })
    
    return filesWithUrls
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

// وظيفة لإنشاء bucket إذا لم يكن موجودًا
export async function createBucketIfNotExists(bucket: string = 'worldcosts-files') {
  try {
    // التحقق من وجود الـ bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      throw listError
    }
    
    // التحقق مما إذا كان الـ bucket موجودًا
    const bucketExists = buckets.some(b => b.name === bucket)
    
    if (!bucketExists) {
      // إنشاء الـ bucket
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true
      })
      
      if (createError) {
        throw createError
      }
      
      console.log(`Bucket ${bucket} created successfully`)
    } else {
      console.log(`Bucket ${bucket} already exists`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error creating bucket:', error)
    throw error
  }
}
