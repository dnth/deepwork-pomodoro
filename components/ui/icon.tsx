import * as React from "react"
import { cn } from "@/lib/utils"

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, size = "sm", ...props }, ref) => {
    const sizeClasses = {
      xs: "h-3 w-3", // 12px
      sm: "h-4 w-4", // 16px
      md: "h-5 w-5", // 20px
      lg: "h-6 w-6", // 24px
      xl: "h-8 w-8", // 32px
    }

    return (
      <svg
        ref={ref}
        className={cn(
          "shrink-0",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Icon.displayName = "Icon"

export { Icon }