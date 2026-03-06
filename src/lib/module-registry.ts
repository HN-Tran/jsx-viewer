import React from "react";
import ReactDOM from "react-dom";
import * as LucideReact from "lucide-react";
import * as Recharts from "recharts";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

// shadcn stubs
import * as CardModule from "../modules/shadcn/card";
import * as ButtonModule from "../modules/shadcn/button";
import * as BadgeModule from "../modules/shadcn/badge";
import * as AlertModule from "../modules/shadcn/alert";
import * as TabsModule from "../modules/shadcn/tabs";
import * as InputModule from "../modules/shadcn/input";
import * as SelectModule from "../modules/shadcn/select";
import * as DialogModule from "../modules/shadcn/dialog";
import * as SeparatorModule from "../modules/shadcn/separator";
import * as ProgressModule from "../modules/shadcn/progress";
import * as TextareaModule from "../modules/shadcn/textarea";
import * as LabelModule from "../modules/shadcn/label";
import * as SwitchModule from "../modules/shadcn/switch";
import * as TooltipModule from "../modules/shadcn/tooltip";
import * as AvatarModule from "../modules/shadcn/avatar";
import * as ScrollAreaModule from "../modules/shadcn/scroll-area";
import * as AccordionModule from "../modules/shadcn/accordion";
import * as SliderModule from "../modules/shadcn/slider";

// cn() utility — exported so stubs can use it too
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const cnModule = { cn, clsx, twMerge };

const shadcnMap: Record<string, unknown> = {
  "@/components/ui/card": CardModule,
  "@/components/ui/button": ButtonModule,
  "@/components/ui/badge": BadgeModule,
  "@/components/ui/alert": AlertModule,
  "@/components/ui/tabs": TabsModule,
  "@/components/ui/input": InputModule,
  "@/components/ui/select": SelectModule,
  "@/components/ui/dialog": DialogModule,
  "@/components/ui/separator": SeparatorModule,
  "@/components/ui/progress": ProgressModule,
  "@/components/ui/textarea": TextareaModule,
  "@/components/ui/label": LabelModule,
  "@/components/ui/switch": SwitchModule,
  "@/components/ui/tooltip": TooltipModule,
  "@/components/ui/avatar": AvatarModule,
  "@/components/ui/scroll-area": ScrollAreaModule,
  "@/components/ui/accordion": AccordionModule,
  "@/components/ui/slider": SliderModule,
};

const registry: Record<string, unknown> = {
  react: React,
  "react-dom": ReactDOM,
  "react-dom/client": ReactDOM,
  "lucide-react": LucideReact,
  recharts: Recharts,
  clsx: { clsx, default: clsx },
  "tailwind-merge": { twMerge, default: twMerge },
  "class-variance-authority": { cva, default: cva },
  "@radix-ui/react-slot": { Slot, default: Slot },
  "@/lib/utils": cnModule,
  "@/lib/cn": cnModule,
  ...shadcnMap,
};

/**
 * Create a proxy that returns a placeholder component for any missing export.
 */
function createMissingProxy(specifier: string): unknown {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "__esModule") return true;
        if (prop === "default" || typeof prop === "string") {
          const displayName = typeof prop === "string" ? prop : specifier;
          const Placeholder = (props: Record<string, unknown>) => {
            return React.createElement(
              "div",
              {
                style: {
                  border: "2px dashed #f59e0b",
                  borderRadius: "8px",
                  padding: "12px",
                  margin: "4px 0",
                  backgroundColor: "#fffbeb",
                  color: "#92400e",
                  fontSize: "13px",
                  fontFamily: "monospace",
                },
              },
              `[Missing: ${specifier}${displayName !== "default" && displayName !== specifier ? `.${displayName}` : ""}]`,
              props.children
                ? React.createElement("div", { style: { marginTop: "8px" } }, props.children as React.ReactNode)
                : null,
            );
          };
          Placeholder.displayName = `Missing(${specifier}.${String(prop)})`;
          return Placeholder;
        }
        return undefined;
      },
    },
  );
}

export function resolveModule(specifier: string): unknown {
  // Direct match
  if (registry[specifier]) return registry[specifier];

  // Normalize @/components/ui paths (handle with or without extension)
  const normalized = specifier.replace(/\.(tsx?|jsx?)$/, "");
  if (registry[normalized]) return registry[normalized];

  // Match shadcn pattern
  if (normalized.startsWith("@/components/ui/")) {
    return registry[normalized] ?? createMissingProxy(specifier);
  }

  // Fallback proxy for unknown packages
  return createMissingProxy(specifier);
}
