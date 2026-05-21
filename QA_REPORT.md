# Noema MVP 1.0 QA Report

## Working Items

- Control Center opens first and loads profiles from the Electron main-process JSON store.
- Create, edit, delete, duplicate, export and start profile actions are implemented for local profiles.
- Profile create/edit validates required names and prevents duplicate names for clear row actions.
- Workspace sidebar filters profiles and shows profile counts.
- Add workspace creates a persisted local workspace.
- Search filters profiles by name, workspace, tags, notes and status.
- Sort works for name, last activity, created and runtime.
- Refresh reloads profiles/workspaces from the main-process store.
- Filter panel supports status, workspace and tag filters with clear/apply controls.
- Table selection and select-all visible rows work.
- Rows per page and pagination work.
- Profiles, Tags, Statuses, Notes and Activity dashboard segments show useful MVP views.
- Settings page includes theme, language status, data location, reset demo data and about sections.
- Dark, light and system theme settings are available and persist through the existing settings store.
- Start opens the selected profile session with profile name and workspace visible.
- Profile-scoped tabs and last URL persist per profile.
- Back to Control Center returns to the dashboard.
- Browser basics remain available: address/search bar, back, forward, reload, new tab, close tab and tab switching.
- Bookmarks, history and session settings pages show usable MVP states.
- Assistant panel actions show clear coming-soon messages and do not pretend to run AI.

## Fixed Items

- Removed dead/fake Control Center clicks by implementing or marking them as coming soon.
- Replaced fake workspace add behavior with persisted workspace creation.
- Made navigation categories either useful MVP pages or explicit coming-soon pages.
- Made table segments functional or clearly scoped as unavailable for MVP.
- Made bottom action bar actions work where in scope and mark out-of-scope bulk actions as coming soon.
- Added selected row count and functional bulk delete confirmation.
- Added local data path visibility to settings.
- Added light theme support across major app surfaces.

## Intentionally Disabled MVP Placeholders

- Automation is disabled and marked coming soon.
- Insights is disabled and marked coming soon.
- Connections/proxy routing is marked coming soon; no real proxy functionality is implemented.
- Bulk Tag, Move and Pause are marked coming soon.
- Workspace edit/delete controls are hidden or marked coming soon.
- Polish language switching is marked coming soon; English remains the MVP language.
- Assistant actions are placeholders with explicit coming-soon responses.

## Known Limitations

- The Windows build is unsigned.
- Profile isolation is scoped to Electron session partitions but is not a hardened enterprise isolation model.
- No real AI, proxy routing, fingerprint controls or automation are implemented.
- Export uses the renderer download flow and may depend on the host OS download handling.
- Light theme is intentionally conservative for MVP readability; future design polish can refine individual surfaces.
