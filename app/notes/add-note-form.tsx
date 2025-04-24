"use client"

import { useState } from "react"
import { addNote } from "@/app/actions"

export default function AddNoteForm() {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)

    const result = await addNote(formData)

    if (result.error) {
      setError(result.error)
    } else {
      // إعادة تعيين النموذج
      const form = document.getElementById("add-note-form") as HTMLFormElement
      form.reset()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">إضافة ملاحظة جديدة</h2>
      <form id="add-note-form" action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            عنوان الملاحظة
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="أدخل عنوان الملاحظة..."
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "جاري الإضافة..." : "إضافة ملاحظة"}
        </button>
      </form>
    </div>
  )
}
