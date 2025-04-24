import { createClient } from "@/utils/supabase/server"
import AddNoteForm from "./add-note-form"
import NoteList from "./note-list"

export default async function NotesPage() {
  const supabase = createClient()
  const { data: notes, error } = await supabase.from("notes").select("*").order("id", { ascending: false })

  if (error) {
    console.error("Error fetching notes:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">تطبيق الملاحظات</h1>

      <AddNoteForm />

      <h2 className="text-2xl font-bold mb-4">الملاحظات الخاصة بك</h2>

      {error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-md">حدث خطأ أثناء جلب الملاحظات: {error.message}</div>
      ) : (
        <NoteList initialNotes={notes || []} />
      )}
    </div>
  )
}
