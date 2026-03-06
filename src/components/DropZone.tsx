interface DropZoneProps {
  onOpenFile: () => void;
  isDragging: boolean;
}

export function DropZone({ onOpenFile, isDragging }: DropZoneProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed transition-colors ${
          isDragging
            ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        }`}
      >
        <svg
          className={`w-16 h-16 ${isDragging ? "text-blue-400" : "text-gray-400 dark:text-gray-500"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragging ? "Drop your file here" : "Drop a JSX/TSX file here"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or click the button below to open one</p>
        </div>
        <button
          onClick={onOpenFile}
          className="mt-2 px-6 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Open File
        </button>
      </div>
    </div>
  );
}
