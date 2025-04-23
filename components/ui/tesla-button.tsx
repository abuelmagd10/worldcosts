"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        default: "tesla-button",
        secondary: "tesla-button-secondary",
        circle: "tesla-circle-button",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px]",
        sm: "h-8 rounded-full px-3 text-xs min-h-[36px]",
        lg: "h-12 rounded-full px-8 min-h-[48px]",
        icon: "h-9 w-9 min-h-[40px] min-w-[40px]",
        circle: "h-12 w-12 min-h-[48px] min-w-[48px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const TeslaButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const [isActive, setIsActive] = React.useState(false)

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), isActive ? "active-scale" : "")}
        ref={ref}
        {...props}
        tabIndex={props.tabIndex || 0}
        onTouchStart={() => setIsActive(true)}
        onTouchEnd={() => setIsActive(false)}
        onTouchCancel={() => setIsActive(false)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        onMouseLeave={() => isActive && setIsActive(false)}
      />
    )
  },
)
TeslaButton.displayName = "TeslaButton"

export { TeslaButton, buttonVariants }
