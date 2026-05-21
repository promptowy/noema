# Noema MVP 1.0 QA Report

## What Works

- Control Center opens first in dev and packaged builds.
- Profiles load from the Electron main-process JSON store.
- Profile create, edit, delete, duplicate and export actions work.
- Profile validation requires a name and prevents duplicate names.
- Profile workspace, tags, notes and status are editable.
- Workspaces can be created, edited and deleted.
- Deleting a workspace with profiles asks to move those profiles to Archive or cancel.
- Workspace profile counts update from local profile data.
- Search filters by profile name, workspace, tags, status and notes.
- Sort works for name, created, last activity and runtime.
- Filter panel supports status, workspace and tag filters with clear/apply controls.
- Table row selection, select-all visible rows, rows per page and pagination work.
- Profile-scoped browser sessions persist tabs, last active tab and last URL.
- Starting another profile loads that profile's separate saved tabs.
- Back to Control Center saves the current profile session state.
- Bookmarks and history are stored per profile session.
- Bookmarks and History sidebar pages show usable lists or empty states.
- Settings show theme, language status, data path, reset demo data and About.
- Dark, light and system theme settings persist.
- Assistant panel buttons show the explicit placeholder response: "Assistant actions are coming in the next private build."
- Packaged app loads the bundled renderer from local files and does not depend on localhost.

## What Was Fixed

- Added main-process workspace update and delete IPC.
- Added persisted workspace edit/delete behavior in the Control Center.
- Added profile-session bookmarks and history persistence.
- Made workspace delete handle profiles by moving them to Archive only after confirmation.
- Changed assistant actions from generic mock actions to clear MVP placeholder responses.
- Added an explicit Import coming-soon action while keeping Export functional.
- Kept proxy, automation and assistant behavior clearly outside MVP scope.

## What Remains Placeholder

- Real AI is not implemented.
- Proxy routing is not implemented.
- Automation is not implemented.
- Fingerprint controls are not implemented.
- Profile import is marked coming soon.
- Bulk Tag, Move and Pause are marked coming soon.
- Polish language switching is marked coming soon.
- Profile isolation is MVP-level Electron session scoping, not hardened enterprise isolation.

## Manual Test Checklist

- Open packaged `Noema.exe`; Control Center appears and is not blank.
- Create a workspace, edit its name, delete it empty.
- Create a workspace, create a profile inside it, delete the workspace and move the profile to Archive.
- Create a profile, edit name/workspace/tags/status/notes, then delete it.
- Duplicate a selected profile and export selected profiles to JSON.
- Search by name, workspace, tag, status and notes.
- Apply and clear filters.
- Sort by name, created, last activity and runtime.
- Start a profile, open a URL, create/switch/close tabs, go Back to Control Center.
- Start the same profile again and verify tabs/last URL restore.
- Start another profile and verify separate tabs load.
- Bookmark a page, open Bookmarks, and verify it is visible for that profile.
- Visit a page, open History, and verify it is visible for that profile.
- Toggle dark/light theme and restart to verify persistence.
- Open Settings and verify data path, reset demo data and About section.
- Click assistant actions and verify the placeholder response appears.
