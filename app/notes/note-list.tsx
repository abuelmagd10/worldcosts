"use client"

import { useState } from "react"
import { deleteNote } from "@/app/actions"

interface Note {
  id: number
  title: string
}

interface NoteListProps {
  initialNotes: Note[]
}

export default function NoteList({ initialNotes }: NoteListProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  async function handleDelete(id: number) {
    setIsDeleting(id)

    const result = await deleteNote(id)

    if (result.success) {
      setNotes(notes.filter((note) => note.id !== id))
    }

    setIsDeleting(null)
  }

  if (notes.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">لا توجد ملاحظات. أضف ملاحظة جديدة للبدء.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center dark:bg-gray-800"
        >
          <p className="text-lg">{note.title}</p>
          <button
            onClick={() => handleDelete(note.id)}
            disabled={isDeleting === note.id}
            className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:hover:bg-red-900"
          >
            {isDeleting === note.id ? "جاري الحذف..." : "حذف"}
          </button>
        </div>
      ))}
    </div>
  )
}
