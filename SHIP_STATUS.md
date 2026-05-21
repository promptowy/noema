# Noema MVP Ship Status

## Done

- Landing page is branded for Noema and ready to run with the existing Next.js scripts.
- Desktop app opens to the Noema Control Center.
- Profiles load from the Electron main-process JSON store.
- Create, edit, delete, search, workspace filtering, and Start profile flows are implemented.
- Browser session view remains available with tabs, address/search, settings/library views, and AI panel placeholder.
- Windows app folder packaging is configured through Electron Builder.
- README now includes non-technical setup, run, build, and packaging instructions.

## Known Limitations

- AI panel actions are mock UI only.
- Proxy/status fields are neutral placeholders only.
- Automation is not implemented.
- Profile sessions are not isolated browser storage partitions yet.
- Windows builds are unsigned unpacked app folders and may trigger SmartScreen warnings.
- A single-file installer or portable executable is not configured for this MVP.
- The MVP package skips Windows executable resource editing, so the default Electron executable metadata/icon may still appear in some system views.
- No auto-updater or installer branding assets are configured yet.
- Waitlist and pricing on the landing page are static UI.

## Next Recommended Steps

- Add signed Windows distribution assets when the brand is final.
- Implement isolated per-profile browser partitions.
- Add import/export for local profiles.
- Add real waitlist submission for the landing page.
- Add a small manual QA checklist for release candidates.
