import { useCallback, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Preview } from "./components/Preview";
import { DropZone } from "./components/DropZone";
import { useFileLoader } from "./hooks/useFileLoader";
import { useDragDrop } from "./hooks/useDragDrop";
import { useDarkMode } from "./hooks/useDarkMode";

export default function App() {
  const { component, error, fileInfo, loading, loadFile, openFileDialog } = useFileLoader();
  const [zoom, setZoom] = useState(1);
  const [isDark, toggleDark] = useDarkMode();

  const onFileDrop = useCallback(
    (path: string) => {
      loadFile(path);
    },
    [loadFile],
  );

  const isDragging = useDragDrop(onFileDrop);

  const hasContent = component || error;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar fileInfo={fileInfo} onOpenFile={openFileDialog} zoom={zoom} onZoomChange={setZoom} isDark={isDark} onToggleDark={toggleDark} />

      <main className="flex-1 overflow-auto relative bg-gray-50 dark:bg-gray-900">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 z-10">
            <div className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="text-sm text-gray-600 dark:text-gray-400">Loading...</span>
            </div>
          </div>
        )}

        {hasContent ? (
          <Preview component={component} error={error} zoom={zoom} isDark={isDark} />
        ) : (
          <DropZone onOpenFile={openFileDialog} isDragging={isDragging} />
        )}
      </main>
    </div>
  );
}
