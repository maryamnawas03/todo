import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-purple-600 text-white hover:bg-purple-700": variant === "default",
            "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
            "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900": variant === "outline",
            "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === "secondary",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "text-gray-900 underline-offset-4 hover:underline": variant === "link",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-8 px-3 py-1 text-xs": size === "sm",
            "h-12 px-6 py-3": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
