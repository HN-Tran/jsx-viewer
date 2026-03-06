import { useState, useEffect } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export function useDragDrop(onFileDrop: (path: string) => void) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setup = async () => {
      const appWindow = getCurrentWebviewWindow();

      unlisten = await appWindow.onDragDropEvent((event) => {
        if (event.payload.type === "over") {
          setIsDragging(true);
        } else if (event.payload.type === "drop") {
          setIsDragging(false);
          const paths = event.payload.paths;
          if (paths.length > 0) {
            const path = paths[0];
            if (/\.(jsx|tsx|js|ts)$/i.test(path)) {
              onFileDrop(path);
            }
          }
        } else if (event.payload.type === "leave") {
          setIsDragging(false);
        }
      });
    };

    setup();

    return () => {
      unlisten?.();
    };
  }, [onFileDrop]);

  return isDragging;
}
