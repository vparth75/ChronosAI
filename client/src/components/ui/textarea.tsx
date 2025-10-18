import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[10rem] w-full rounded-3xl border border-white/12 bg-black/30 px-5 py-4 text-base text-zinc-100 shadow-inner shadow-black/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 placeholder:text-zinc-500",
        className
      )}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
