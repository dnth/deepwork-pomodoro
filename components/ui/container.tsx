import * as React from "react"
import { cn } from "@/lib/utils"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "surface"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "rounded-xl bg-card text-card-foreground shadow-2xl",
      card: "rounded-xl border bg-card text-card-foreground shadow-2xl",
      surface: "rounded-lg bg-card text-card-foreground shadow-lg",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "p-6",
          variantClasses[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = "Container"

export { Container }