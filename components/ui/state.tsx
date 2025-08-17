import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

export interface StateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: "loading" | "empty" | "error"
  title?: string
  description?: string
  retry?: () => void
  retryText?: string
}

const State = React.forwardRef<HTMLDivElement, StateProps>(
  ({ className, variant, title, description, retry, retryText, children, ...props }, ref) => {
    const getStateContent = () => {
      switch (variant) {
        case "loading":
          return {
            icon: (
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
              </div>
            ),
            title: title || "Loading",
            description: description || "Please wait while we load the content"
          }
        case "empty":
          return {
            icon: (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <Icon size="lg" className="text-muted-foreground" />
              </div>
            ),
            title: title || "No data found",
            description: description || "There is no data to display right now"
          }
        case "error":
          return {
            icon: (
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Icon size="lg" className="text-destructive" />
              </div>
            ),
            title: title || "Something went wrong",
            description: description || "An error occurred while loading the content"
          }
      }
    }

    const { icon, title: stateTitle, description: stateDescription } = getStateContent()

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8 rounded-lg",
          className
        )}
        {...props}
      >
        {children || (
          <>
            {icon}
            <h3 className="mt-4 text-lg font-semibold">{stateTitle}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{stateDescription}</p>
            {variant === "error" && retry && (
              <Button onClick={retry} className="mt-4" variant="default">
                {retryText || "Try again"}
              </Button>
            )}
          </>
        )}
      </div>
    )
  }
)
State.displayName = "State"

export { State }