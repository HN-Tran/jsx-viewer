import React from "react";
import { cn } from "./utils";

export const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number; max?: number }
>(({ className, value = 0, max = 100, ...props }, ref) => (
  <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-100", className)} {...props}>
    <div
      className="h-full bg-gray-900 transition-all"
      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
    />
  </div>
));
Progress.displayName = "Progress";
