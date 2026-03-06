import React from "react";
import { resolveModule } from "./module-registry";
import { transpile } from "./transpiler";

export interface LoadResult {
  component: React.ComponentType | null;
  error: string | null;
}

export function loadComponent(source: string, filename: string): LoadResult {
  const result = transpile(source, filename);

  if (result.error) {
    return { component: null, error: `Transpilation error:\n${result.error}` };
  }

  try {
    const __exports: Record<string, any> = {};
    const __require = (specifier: string) => resolveModule(specifier);

    // Evaluate transpiled code with React and helpers in scope
    const fn = new Function("React", "__require", "__exports", result.code!);
    fn(React, __require, __exports);

    const Component = __exports.default;
    if (!Component) {
      return {
        component: null,
        error: "No default export found. The JSX file must have a default export.",
      };
    }

    if (typeof Component !== "function" && typeof Component !== "object") {
      return {
        component: null,
        error: `Default export is a ${typeof Component}, expected a React component (function or class).`,
      };
    }

    return { component: Component as React.ComponentType, error: null };
  } catch (e: any) {
    return {
      component: null,
      error: `Runtime error:\n${e.message || String(e)}`,
    };
  }
}
