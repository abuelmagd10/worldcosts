"use client"

import { AlertTriangle } from "lucide-react"
import { TeslaCard, TeslaCardContent, TeslaCardHeader, TeslaCardTitle } from "@/components/ui/tesla-card"
import { TeslaButton } from "@/components/ui/tesla-button"

interface FallbackProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <TeslaCard className="max-w-md w-full">
        <TeslaCardHeader>
          <TeslaCardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Something went wrong
          </TeslaCardTitle>
        </TeslaCardHeader>
        <TeslaCardContent>
          <p className="mb-4">
            An error occurred while loading the application. This might be due to a temporary issue or a problem with
            your connection.
          </p>
          {error && (
            <p className="mb-6 text-sm text-muted-foreground">Error details: {error.message || "Unknown error"}</p>
          )}
          <div className="flex justify-center">
            <TeslaButton onClick={() => resetErrorBoundary?.() || window.location.reload()}>Try again</TeslaButton>
          </div>
        </TeslaCardContent>
      </TeslaCard>
    </div>
  )
}
