import * as React from "react"
import { cn } from "@/lib/utils"

const TeslaCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("tesla-card p-6", className)} {...props} />,
)
TeslaCard.displayName = "TeslaCard"

const TeslaCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
  ),
)
TeslaCardHeader.displayName = "TeslaCardHeader"

const TeslaCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
TeslaCardTitle.displayName = "TeslaCardTitle"

const TeslaCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
TeslaCardDescription.displayName = "TeslaCardDescription"

const TeslaCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("pt-0", className)} {...props} />,
)
TeslaCardContent.displayName = "TeslaCardContent"

const TeslaCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />,
)
TeslaCardFooter.displayName = "TeslaCardFooter"

export { TeslaCard, TeslaCardHeader, TeslaCardFooter, TeslaCardTitle, TeslaCardDescription, TeslaCardContent }
