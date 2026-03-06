# JSX Viewer

[![CI](https://github.com/HN-Tran/jsx-viewer/actions/workflows/check.yml/badge.svg)](https://github.com/HN-Tran/jsx-viewer/actions/workflows/check.yml)
[![Release](https://github.com/HN-Tran/jsx-viewer/actions/workflows/publish.yml/badge.svg)](https://github.com/HN-Tran/jsx-viewer/actions/workflows/publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A lightweight desktop app to preview JSX and TSX files. Drag and drop a `.jsx` or `.tsx` file and see it rendered instantly — no setup, no dev server, no configuration.

Built for previewing React components exported from AI tools like Claude, ChatGPT, or any code generator that outputs JSX/TSX files.

<!-- TODO: Add screenshot
![JSX Viewer screenshot](docs/screenshot.png)
-->

## Features

- **Drag & drop** or open JSX/TSX files from disk
- **Instant preview** — transpiles and renders in the browser
- **Built-in component library** — supports shadcn/ui, Lucide icons, Recharts, and Tailwind CSS out of the box
- **Dark mode** with system preference detection
- **Zoom controls** for responsive previews
- **Graceful error handling** — shows transpilation and runtime errors clearly; unknown imports render as visible placeholders instead of crashing

## Download

Download the latest release for your platform from the [Releases](https://github.com/HN-Tran/jsx-viewer/releases) page.

| Platform | Format |
|---|---|
| Windows | `.msi`, `.exe` |
| macOS (Apple Silicon) | `.dmg` |
| macOS (Intel) | `.dmg` |
| Linux | `.deb`, `.AppImage` |

## Supported Imports

Files opened in JSX Viewer can use these libraries without any installation:

| Library | Import path |
|---|---|
| React | `react`, `react-dom` |
| Lucide React | `lucide-react` |
| Recharts | `recharts` |
| shadcn/ui | `@/components/ui/*` |
| Tailwind CSS | All utility classes |
| clsx | `clsx` |
| tailwind-merge | `tailwind-merge` |
| class-variance-authority | `class-variance-authority` |
| Radix Slot | `@radix-ui/react-slot` |
| cn utility | `@/lib/utils`, `@/lib/cn` |

Any unrecognized imports are rendered as yellow dashed-border placeholders so you can still see the rest of the component.

## How It Works

1. File is read from disk via Tauri IPC
2. Source is transpiled with `@babel/standalone` using a custom plugin that rewrites ES module imports/exports to a CommonJS-like format
3. A module registry resolves import specifiers to pre-bundled libraries (React, shadcn/ui, Recharts, etc.)
4. Transpiled code is evaluated with `new Function()` and the default export is rendered as a React component

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Rust](https://rustup.rs/)
- [Tauri v2 prerequisites](https://v2.tauri.app/start/prerequisites/)

### Setup

```bash
npm install
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

### Project Structure

```
src/                    # React frontend
  lib/                  # Core pipeline: transpiler, module registry, component loader
  components/           # UI components (Preview, Sidebar, DropZone, etc.)
  hooks/                # React hooks (file loading, drag-drop, dark mode)
  modules/shadcn/       # Built-in shadcn/ui component stubs
src-tauri/              # Rust backend (Tauri v2)
  src/commands.rs       # IPC commands: read_file, get_file_metadata
```

## License

[MIT](LICENSE)
