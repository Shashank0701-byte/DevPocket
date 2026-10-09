# DevPocket

DevPocket is a dark, local developer dashboard for the small conversions you do every day. Format JSON, encode Base64, generate UUID v4 values, and turn Unix timestamps into dates. Every tool runs in the browser. Nothing is sent to a server, and the app needs no API keys or environment variables.

## Features

- **JSON Formatter.** Pretty-print, minify, and validate JSON. Parse errors include the line and column when the engine reports a position.
- **Base64.** Encode and decode UTF-8 text, including characters outside ASCII. Invalid Base64 is reported instead of throwing.
- **UUID Generator.** Create one to twenty version 4 UUIDs and copy a single value or the whole batch.
- **Timestamp Converter.** Convert Unix seconds or milliseconds to a local date and UTC, or convert a local date back to Unix time. Thirteen or more digits are treated as milliseconds when the unit is set to Auto.
- **Recent history.** Successful runs are stored in `localStorage`. Open an entry to restore it, or clear the list.
- **Clipboard.** Copy actions show a success or error toast.
- **Keyboard.** On a tool page, Ctrl or Cmd + Enter runs the main action: Format, Encode, Generate, or Convert.
- **Layout.** Compact sidebar on desktop, sheet navigation on small screens.

## Tech

- Next.js App Router and TypeScript
- Tailwind CSS and shadcn/ui
- Lucide icons

## Requirements

Node.js 22 or newer. `.nvmrc` pins that version.

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

The dev server listens on all interfaces. `127.0.0.1` is listed in `allowedDevOrigins` so the browser can open the dev socket and the page can hydrate.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3847 |
| `npm test` | Run the tool and history unit tests |
| `npm run lint` | Lint the project |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build. Uses `PORT`, or 3000 if unset |

## Deploy

No environment variables and no database. A host only needs to install dependencies, build, and start Next.js.

### Vercel

1. Import [this repository](https://github.com/Shashank0701-byte/DevPocket) at [vercel.com/new](https://vercel.com/new).
2. Leave the framework preset on Next.js. The build command is `npm run build`.
3. Do not add environment variables.
4. Deploy. `.nvmrc` selects Node 22.

### Any Node host

```bash
npm ci
npm run build
npm start
```

Set `PORT` when the platform does not use 3000.

## Project layout

```text
app/                  routes: home, JSON, Base64, UUID, timestamp
components/tools/     interactive tool screens
components/layout/    sidebar, top bar, mobile sheet
lib/tools/            pure conversion functions and tests
lib/history.ts        recent-history storage
```

History is kept under the `devpocket-history` key in `localStorage`, capped at 25 entries.

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `npm test`, `npm run lint`, and `npm run build` on every push and pull request.
