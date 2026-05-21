# BROWSER

Premium AI-first desktop browser plus matching landing page.

## Stack

- pnpm workspaces
- TypeScript everywhere
- `apps/browser`: Electron, React, Vite, Tailwind CSS
- `apps/landing`: Next.js App Router, Tailwind CSS
- `packages/ui`: shared React UI primitives
- `packages/config`: shared TypeScript, Tailwind, and ESLint config

## Getting Started

Install pnpm if it is not already available:

```bash
npm install -g pnpm
```

Install dependencies:

```bash
pnpm install
```

Run both apps:

```bash
pnpm dev
```

Run only the desktop browser:

```bash
pnpm dev:browser
```

Run only the landing page:

```bash
pnpm dev:landing
```

Build everything:

```bash
pnpm build
```

Lint everything:

```bash
pnpm lint
```

Typecheck everything:

```bash
pnpm typecheck
```

## Workspace Structure

```text
apps/
  browser/        Electron desktop browser shell
  landing/        Next.js marketing site
packages/
  config/         Shared TS, Tailwind, and ESLint config
  ui/             Shared reusable UI components
```

## Browser MVP Notes

The Electron app uses `WebContentsView` for embedded browsing. Remote web content runs with:

- `nodeIntegration: false`
- `contextIsolation: true`
- `sandbox: true`
- a narrow typed preload bridge for app controls

Tabs, bookmarks, history, and basic settings are persisted in a local JSON store under Electron user data.

## Current Limitations

- The AI assistant panel is a polished placeholder with mock actions.
- Pricing and waitlist submission are UI placeholders.
- Browser packaging/signing is not configured yet.
- Permission prompts are denied by default in the MVP.
