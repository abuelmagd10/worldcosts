import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

// اسم الجدول في قاعدة بيانات Supabase
const TABLE_NAME = "files"

export async function POST() {
  try {
    console.log("Attempting to recreate files table...")

    // التحقق من وجود الجدول
    const { count, error: countError } = await supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact', head: true })

    if (!countError) {
      console.log(`Table ${TABLE_NAME} exists with ${count} records`)

      // حذف جميع السجلات من الجدول
      const { error: deleteError } = await supabase
        .from(TABLE_NAME)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // شرط دائمًا صحيح لحذف جميع السجلات

      if (deleteError) {
        console.error("Error deleting records:", deleteError)
        return NextResponse.json({ error: "Failed to delete records", details: deleteError }, { status: 500 })
      }

      console.log("All records deleted successfully")
    } else {
      console.log(`Table ${TABLE_NAME} does not exist or error checking: ${countError.message}`)

      // إنشاء الجدول
      const { error: createError } = await supabase.schema.createTable(TABLE_NAME, [
        { name: 'id', type: 'uuid', primaryKey: true },
        { name: 'file_name', type: 'text', notNull: true },
        { name: 'original_name', type: 'text' },
        { name: 'file_type', type: 'text', notNull: true },
        { name: 'file_size', type: 'integer', notNull: true },
        { name: 'mime_type', type: 'text' },
        { name: 'content', type: 'text', notNull: true },
        { name: 'metadata', type: 'jsonb' },
        { name: 'upload_date', type: 'timestamp with time zone', default: 'now()' }
      ])

      if (createError) {
        console.error("Error creating table:", createError)
        return NextResponse.json({ error: "Failed to create table", details: createError }, { status: 500 })
      }

      console.log("Table created successfully")
    }

    return NextResponse.json({ success: true, message: "Files table recreated successfully" })
  } catch (error) {
    console.error("Error recreating files table:", error)
    return NextResponse.json({ error: "Failed to recreate files table", details: String(error) }, { status: 500 })
  }
}
