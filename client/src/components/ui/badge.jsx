import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"

    const variants = {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-gray-950 dark:text-gray-50 border-gray-200 dark:border-gray-800",
    }

    return (
        <div className={cn(baseStyles, variants[variant], className)} {...props} />
    )
}

export { Badge }
