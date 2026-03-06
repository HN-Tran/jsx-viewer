import { Moon, Sun } from "lucide-react";

interface FileInfo {
  name: string;
  size: number;
  extension: string;
  path: string;
}

interface SidebarProps {
  fileInfo: FileInfo | null;
  onOpenFile: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ZOOM_STEPS = [0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];

export function Sidebar({ fileInfo, onOpenFile, zoom, onZoomChange, isDark, onToggleDark }: SidebarProps) {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">JSX Viewer</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Preview JSX/TSX components</p>
        </div>
        <button
          onClick={onToggleDark}
          className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      <div className="p-4 flex-1">
        {fileInfo ? (
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 break-all">{fileInfo.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Size</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{formatBytes(fileInfo.size)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">.{fileInfo.extension}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Path</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-all">{fileInfo.path}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 dark:text-gray-500">No file loaded</p>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Zoom</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const idx = ZOOM_STEPS.findIndex((s) => s >= zoom);
                const prev = ZOOM_STEPS[Math.max(0, (idx > 0 ? idx : ZOOM_STEPS.length) - 1)];
                onZoomChange(prev);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
            >
              -
            </button>
            <span className="flex-1 text-center text-sm text-gray-700 dark:text-gray-300">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => {
                const idx = ZOOM_STEPS.findIndex((s) => s > zoom);
                const next = ZOOM_STEPS[idx >= 0 ? idx : ZOOM_STEPS.length - 1];
                onZoomChange(next);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onZoomChange(1)}
            className={`text-xs text-center ${zoom !== 1 ? "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" : "text-transparent pointer-events-none"}`}
          >
            Reset
          </button>
        </div>
        <button
          onClick={onOpenFile}
          className="w-full px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Open File
        </button>
      </div>
    </div>
  );
}
