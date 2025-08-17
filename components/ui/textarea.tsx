import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  textareaSize?: "sm" | "default" | "lg"
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, textareaSize = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "min-h-[64px] px-3 py-1.5 text-sm", // 32px height
      default: "min-h-[80px] px-3 py-2 text-sm", // 40px height
      lg: "min-h-[96px] px-3 py-2.5 text-sm", // 48px height
    }

    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          sizeClasses[textareaSize],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
