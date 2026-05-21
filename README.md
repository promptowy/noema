# Noema

Browse with a mind beside you.

Noema is a local MVP for a premium desktop browser with a matching landing page. It includes a Noema Control Center for local profiles, a real Electron browser session view, and a polished marketing page.

## What You Need

- Windows 10 or later
- Node.js 20 or later
- Internet access for the first dependency install

You do not need to install pnpm globally. The commands below use the pinned pnpm version.

## Install

From this folder, run:

```bash
npx pnpm@10.12.1 install
```

## Run The Landing Page

```bash
npx pnpm@10.12.1 dev:landing
```

Open:

```text
http://localhost:3000
```

## Run The Desktop Browser App

```bash
npx pnpm@10.12.1 dev:browser
```

The Noema Control Center opens first. Use **Start** on a profile to open the browser session view.

## Build Everything

```bash
npx pnpm@10.12.1 build
```

This builds the landing page, desktop app renderer, Electron main process, and shared packages.

## Package The Windows App

Create the full Windows release output:

```bash
npx pnpm@10.12.1 dist:browser
```

This creates:

```text
apps/browser/release/win-unpacked/Noema.exe
apps/browser/release/Noema-0.1.0-Windows-x64.exe
apps/browser/release/Noema-0.1.0-Windows-x64.zip
```

The unpacked app folder is useful for direct local testing. The `.exe` installer is an unsigned NSIS installer. The `.zip` is a portable Windows ZIP; unzip it and run `Noema.exe` from inside the extracted folder.

Create only the unpacked Windows app folder:

```bash
npx pnpm@10.12.1 package:browser
```

Run the Windows release command directly:

```bash
npx pnpm@10.12.1 release:windows
```

## Useful Scripts

```bash
npx pnpm@10.12.1 dev
npx pnpm@10.12.1 dev:landing
npx pnpm@10.12.1 dev:browser
npx pnpm@10.12.1 lint
npx pnpm@10.12.1 typecheck
npx pnpm@10.12.1 build
npx pnpm@10.12.1 package:browser
npx pnpm@10.12.1 dist:browser
npx pnpm@10.12.1 release:windows
```

## What Works

- Premium Noema landing page
- Electron desktop app with Control Center opening first
- Local profile list loaded through secure Electron IPC
- Create, edit, delete, search, and workspace-filter profiles
- Profiles persist in a JSON file under Electron's app user data folder
- Start profile opens the browser session view for that profile
- Back returns from session view to Control Center
- Browser tabs, address/search bar, navigation, bookmarks, history, settings, and AI panel placeholder
- Windows app folder, unsigned installer, and portable ZIP packaging with Electron Builder

## What Is Placeholder

- AI actions are visual placeholders only
- Proxy fields are neutral UI placeholders only
- Automation navigation is a placeholder
- No fingerprint spoofing, stealth tooling, or proxy functionality is implemented
- Profile sessions are associated at the UI level and are not isolated browser partitions yet
- Packaged Windows builds are unsigned and do not include auto-update
- Waitlist and pricing on the landing page are static UI

## Local Data

Profile data is stored by the Electron main process in the app user data directory. On Windows, this is typically similar to:

```text
C:\Users\<you>\AppData\Roaming\@browser\desktop\noema-profiles.json
```

Generated build output, release files, logs, caches, and local data are intentionally ignored by git.
