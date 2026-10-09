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
npm start
```

`npm start` serves the production build and listens on `PORT` (3000 if unset). Node 22 or newer is required.

## Deploy

Nothing in this app needs an environment variable or a database. A host only has to install dependencies, run `npm run build`, and start Next.js.

### Vercel

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Leave the framework preset on Next.js. The build command is `npm run build`. Do not add environment variables.
4. Deploy. `.nvmrc` selects Node 22.

### Any Node host

```bash
npm ci
npm run build
npm start
```

Set `PORT` if the platform does not use 3000.

## GitHub

This project is not connected to a GitHub account from this environment. Create an empty repository on GitHub, then push `main`:

```bash
git remote add github https://github.com/YOUR_USER/devpocket.git
git push -u github main
```

After that push, the CI workflow runs tests, lint, and a production build on every push and pull request.

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
