import React from "react";
import { cn } from "./utils";

export const Slider = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue"> & {
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
    max?: number;
    min?: number;
    step?: number;
  }
>(({ className, value, defaultValue, onValueChange, max = 100, min = 0, step = 1, ...props }, ref) => {
  const current = value?.[0] ?? defaultValue?.[0] ?? min;
  return (
    <input
      ref={ref}
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className={cn("w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer", className)}
      {...props}
    />
  );
});
Slider.displayName = "Slider";
