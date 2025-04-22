"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { TeslaButton } from "@/components/ui/tesla-button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      console.error("Error caught by error boundary:", event.error)
      setError(event.error)
      setHasError(true)
      // Prevent the error from bubbling up
      event.preventDefault()
    }

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("Promise rejection caught by error boundary:", event.reason)
      setError(new Error(String(event.reason)))
      setHasError(true)
      // Prevent the rejection from bubbling up
      event.preventDefault()
    }

    window.addEventListener("error", errorHandler)
    window.addEventListener("unhandledrejection", rejectionHandler)

    return () => {
      window.removeEventListener("error", errorHandler)
      window.removeEventListener("unhandledrejection", rejectionHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <TeslaCard className="max-w-md w-full">
          <TeslaCardHeader>
            <TeslaCardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Application Error
            </TeslaCardTitle>
          </TeslaCardHeader>
          <TeslaCardContent>
            <p className="mb-4">
              An error occurred while loading the application. This might be due to a temporary issue or a problem with
              your connection.
            </p>
            <p className="mb-6 text-sm text-muted-foreground">Error details: {error?.message || "Unknown error"}</p>
            <div className="flex justify-center">
              <TeslaButton onClick={() => window.location.reload()}>Reload Application</TeslaButton>
            </div>
          </TeslaCardContent>
        </TeslaCard>
      </div>
    )
  }

  return <>{children}</>
}
