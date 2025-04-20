import * as React from "react"
import { cn } from "@/lib/utils"

const NeomorphicCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("neomorphic p-6", className)} {...props} />,
)
NeomorphicCard.displayName = "NeomorphicCard"

const NeomorphicCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
  ),
)
NeomorphicCardHeader.displayName = "NeomorphicCardHeader"

const NeomorphicCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
NeomorphicCardTitle.displayName = "NeomorphicCardTitle"

const NeomorphicCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
NeomorphicCardDescription.displayName = "NeomorphicCardDescription"

const NeomorphicCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("pt-0", className)} {...props} />,
)
NeomorphicCardContent.displayName = "NeomorphicCardContent"

const NeomorphicCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />,
)
NeomorphicCardFooter.displayName = "NeomorphicCardFooter"

export {
  NeomorphicCard,
  NeomorphicCardHeader,
  NeomorphicCardFooter,
  NeomorphicCardTitle,
  NeomorphicCardDescription,
  NeomorphicCardContent,
}
