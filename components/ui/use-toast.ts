"use client"

import { useState, useEffect } from "react"

// Simple toast interface
interface Toast {
  title: string
  description?: string
  variant?: "default" | "destructive" | "warning"
}

// Simple toast hook that doesn't rely on context
export function useToast() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toast = (props: Toast) => {
    if (!mounted) return

    // Simple console fallback if we're not mounted yet
    console.log("Toast:", props.title, props.description, props.variant)

    // In a real implementation, this would show a toast notification
    // but for now we'll just log to console to avoid errors
    if (typeof document !== "undefined") {
      // Create a simple toast element
      const toastElement = document.createElement("div")
      toastElement.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
        props.variant === "destructive" ? "bg-red-500" : props.variant === "warning" ? "bg-amber-500" : "bg-blue-500"
      } text-white max-w-xs`

      const titleElement = document.createElement("div")
      titleElement.className = "font-bold"
      titleElement.textContent = props.title
      toastElement.appendChild(titleElement)

      if (props.description) {
        const descElement = document.createElement("div")
        descElement.className = "text-sm mt-1"
        descElement.textContent = props.description
        toastElement.appendChild(descElement)
      }

      document.body.appendChild(toastElement)

      // Remove after 3 seconds
      setTimeout(() => {
        if (document.body.contains(toastElement)) {
          document.body.removeChild(toastElement)
        }
      }, 3000)
    }
  }

  return { toast }
}
