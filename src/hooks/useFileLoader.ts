import { useState, useCallback } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { loadComponent } from "../lib/component-loader";
import React from "react";

interface FileInfo {
  name: string;
  size: number;
  extension: string;
  path: string;
}

interface FileLoaderState {
  component: React.ComponentType | null;
  error: string | null;
  fileInfo: FileInfo | null;
  loading: boolean;
}

export function useFileLoader() {
  const [state, setState] = useState<FileLoaderState>({
    component: null,
    error: null,
    fileInfo: null,
    loading: false,
  });

  const loadFile = useCallback(async (path: string) => {
    console.log("[useFileLoader] loadFile called with:", path);
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      console.log("[useFileLoader] invoking read_file...");
      const content = await invoke<string>("read_file", { path });
      console.log("[useFileLoader] read_file ok, length:", content.length);

      console.log("[useFileLoader] invoking get_file_metadata...");
      const metadata = await invoke<FileInfo>("get_file_metadata", { path });
      console.log("[useFileLoader] metadata:", metadata);

      console.log("[useFileLoader] calling loadComponent...");
      const result = loadComponent(content, metadata.name);
      console.log("[useFileLoader] loadComponent result:", result.error || "ok");

      setState({
        component: result.component,
        error: result.error,
        fileInfo: metadata,
        loading: false,
      });
    } catch (e: any) {
      console.error("[useFileLoader] error:", e);
      setState({
        component: null,
        error: `Failed to load file:\n${e.message || String(e)}`,
        fileInfo: null,
        loading: false,
      });
    }
  }, []);

  const openFileDialog = useCallback(async () => {
    console.log("[useFileLoader] opening dialog...");
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "JSX/TSX Files",
            extensions: ["jsx", "tsx", "js", "ts"],
          },
        ],
      });

      console.log("[useFileLoader] dialog result:", selected);

      if (selected) {
        await loadFile(selected as string);
      }
    } catch (e: any) {
      console.error("[useFileLoader] dialog error:", e);
      setState((prev) => ({
        ...prev,
        error: `Dialog error: ${e.message || String(e)}`,
      }));
    }
  }, [loadFile]);

  return {
    ...state,
    loadFile,
    openFileDialog,
  };
}
