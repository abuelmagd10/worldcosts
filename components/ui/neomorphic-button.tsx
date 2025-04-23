"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] touch-manipulation",
  {
    variants: {
      variant: {
        default: "neomorphic-button text-foreground",
        blue: "neomorphic-blue text-blue-foreground",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2 min-h-[40px]",
        sm: "h-8 rounded-full px-3 text-xs min-h-[36px]",
        lg: "h-10 rounded-full px-8 min-h-[44px]",
        icon: "h-9 w-9 min-h-[40px] min-w-[40px]",
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

const NeomorphicButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
NeomorphicButton.displayName = "NeomorphicButton"

export { NeomorphicButton, buttonVariants }
