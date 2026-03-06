import React, { useState, createContext, useContext } from "react";
import { cn } from "./utils";

const AccordionContext = createContext<{
  value: string[];
  toggle: (v: string) => void;
}>({ value: [], toggle: () => {} });

export function Accordion({
  type = "single",
  defaultValue,
  collapsible = true,
  className,
  children,
  ...props
}: {
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const initial = defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : [];
  const [value, setValue] = useState<string[]>(initial);

  const toggle = (v: string) => {
    if (type === "single") {
      setValue((prev) => (prev.includes(v) && collapsible ? [] : [v]));
    } else {
      setValue((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
    }
  };

  return (
    <AccordionContext.Provider value={{ value, toggle }}>
      <div className={className} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  return (
    <div className={cn("border-b", className)} data-value={value} {...props}>
      {children}
    </div>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = useContext(AccordionContext);
  const item = (props as any)["data-value"] || findParentValue(props);

  return (
    <h3 className="flex">
      <button
        className={cn(
          "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        onClick={() => {
          // Find parent AccordionItem value
          const el = (props as any).onClick;
        }}
        {...props}
      >
        {children}
        <svg className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </h3>
  );
}

function findParentValue(_props: any): string {
  return "";
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("overflow-hidden text-sm", className)} {...props}>
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
}
