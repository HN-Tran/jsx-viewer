import React from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface PreviewProps {
  component: React.ComponentType | null;
  error: string | null;
  zoom: number;
}

export function Preview({ component: Component, error, zoom }: PreviewProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="max-w-2xl w-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Error</h3>
          </div>
          <pre className="text-sm text-red-700 dark:text-red-300 whitespace-pre-wrap break-words font-mono bg-red-100 dark:bg-red-900 rounded-lg p-4 max-h-96 overflow-auto">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  if (!Component) return null;

  return (
    <ErrorBoundary key={Component.toString()}>
      <div
        className="p-6 dark:invert dark:hue-rotate-180"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
          width: `${100 / zoom}%`,
        }}
      >
        <Component />
      </div>
    </ErrorBoundary>
  );
}
