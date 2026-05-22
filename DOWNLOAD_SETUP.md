# Noema Download Button Setup

The landing page is ready for online deployment. The Windows MVP download CTAs currently point to the public GitHub Release asset:

```text
https://github.com/promptowy/noema/releases/download/v0.1.0-mvp/Noema-v0.1.0-Windows-MVP.zip
```

## Recommended Release Flow

1. Build the Windows package locally:

```bash
npx pnpm@10.12.1 dist:browser
```

2. Create the release ZIP:

```text
release-assets/Noema-v0.1.0-Windows-MVP.zip
```

3. Upload the ZIP to a public release location, for example:

- GitHub Releases
- Vercel Blob
- Netlify file hosting
- S3/R2 or another static object store

4. Copy the final HTTPS URL for the uploaded ZIP.

5. Update the landing page download buttons in:

```text
apps/landing/src/app/page.tsx
```

Replace the existing public HTTPS ZIP URL when shipping a new version.

## Important Rules

- Do not link to `C:\...`, `release-assets/...`, or any other local path from the public landing page.
- Do not move `Noema.exe` out of its bundled folder before zipping.
- Keep the copy clear that this is an unsigned Windows MVP build.
- Update the visible filename and setup notes whenever the release version changes.
- Consider adding a checksum once public downloads are enabled.

## Current Public-Site Behavior

The landing page should always use an HTTPS release asset URL for public downloads and keep local setup notes visible for users who download the ZIP.
