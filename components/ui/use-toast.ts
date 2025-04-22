"use client"

import { useState, useEffect } from "react"

// Fix the toast hook to avoid hydration mismatches
export function useToast() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toast = (props: any) => {
    if (!mounted) return

    // Simple console fallback if we're not mounted yet
    console.log("Toast:", props.title, props.description)

    // In a real implementation, this would show a toast notification
    // but for now we'll just log to console to avoid errors
  }

  return { toast }
}
