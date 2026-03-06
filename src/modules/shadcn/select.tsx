import React, { useState, createContext, useContext, useRef, useEffect } from "react";
import { cn } from "./utils";

const SelectContext = createContext<{
  value: string;
  onValueChange: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ value: "", onValueChange: () => {}, open: false, setOpen: () => {} });

export function Select({
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const value = controlledValue ?? uncontrolled;
  const setValue = onValueChange ?? setUncontrolled;

  return (
    <SelectContext.Provider value={{ value, onValueChange: setValue, open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(SelectContext);
  return (
    <button
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={() => ctx.setOpen(!ctx.open)}
      {...props}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx.value || placeholder}</span>;
}

export function SelectContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctx.open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx.setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ctx.open]);

  if (!ctx.open) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-md border bg-white p-1 text-gray-900 shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = useContext(SelectContext);
  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100",
        ctx.value === value && "bg-gray-100",
        className,
      )}
      onClick={() => {
        ctx.onValueChange(value);
        ctx.setOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectGroup({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>;
}

export function SelectLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />;
}
