# DevPocket

DevPocket is a local developer utility dashboard. Format JSON, encode and decode Base64, generate UUID v4 values, and convert Unix timestamps. Every tool runs in the browser. There are no external APIs and no environment variables.

## Setup

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

The dev server listens on all interfaces. `127.0.0.1` is listed in `allowedDevOrigins` so the browser can connect to the dev socket and the page can hydrate.

```bash
npm test
npm run lint
npm run build
```

## Features

- JSON formatter: format, minify, and validate JSON, including parse errors with line and column.
- Base64 encoder and decoder for UTF-8 text, including non-ASCII characters.
- UUID v4 generator with single and batch copy.
- Timestamp converter for Unix seconds and milliseconds, local dates, and UTC.
- Recent history stored in `localStorage`, with restore and clear.
- Clipboard actions with success and error toasts.
- Dashboard home with a short description of each tool.
- Keyboard shortcut: Ctrl or Cmd + Enter runs the main action on a tool page.
- Dark layout that works on mobile and desktop.
