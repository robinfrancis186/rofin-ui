# Website and dashboard coverage

The 135-example gallery covers common website and dashboard UI. Use the
interactive **Website & dashboard checklist** in the documentation to open
each example. This is a UI library, not an application backend.

| Need | Existing building blocks |
| --- | --- |
| Website navigation | Responsive header, native mobile menu, navigation, breadcrumbs, footer |
| Marketing pages | Hero, feature grid, bento, logos, pricing and billing toggle, testimonials, FAQ, CTA, team, blog grid |
| Forms and capture | Contact, newsletter, native labelled inputs/selects, autocomplete, searchable combobox/multiselect, linked error summary, textarea, rich-text/Markdown note editors, checkboxes/radios, file input, upload queue, character counter, tags |
| Billing UI | Subscription review/cancellation, invoice search/status and exact records/downloads, current quota/remaining/near/over/unlimited states |
| Account UI | Sign in, sign up, password reset, reveal password, one-time code, account settings, workspace switcher, account menu, team management, invitation acceptance, permissions matrix |
| Dashboard structure | Responsive app shell, sidebar, top bar, KPI cards, adjustable panels, layout, avatars, badges |
| Visualization | Line chart with atomic data updates, bounded streaming, window zoom, keyboard exploration and series toggles; bar chart with exact data disclosure, donut chart with complete legend, progress, meter, statistics |
| Data workflows | Searchable sortable table, status filters, date ranges/presets, row pagination/page size, bulk selection/actions, editable virtualized grid, column settings, compound filters, saved views, file browser/tree |
| Actions and overlays | Buttons, dropdown, native dialog/drawer, tooltip, command palette, image lightbox |
| Documents and media | PDF with full text/download alternatives, explicit local-file preview, native video/audio with captions and real downloads |
| Feedback and states | Alert, toast, notification inbox, empty state, spinner, skeleton, 404/permission/offline/server-error pages and read recovery |
| Activity and onboarding | Reorderable task cards/columns, sortable priorities, grids and nested steps, timeline, checklist/progress, multistep form, calendar, time picker, daily event scheduler, tabs |

Added to fill the audit gaps: responsive website header, application shell,
dashboard metrics, account settings, sign-up, password reset, bar chart, donut
chart, date range, paginated table, bulk selection, and notification center.
Table filtering, paging, and selection reuse the existing optional initializer.
These additions stay outside the core bundle; the shared upload layout also
received a small fix for narrow containers, and navigation preserves nested
button styling. There are no new runtime dependencies.

`examples/landing.html` uses the responsive header and existing library
sections. `examples/dashboard.html` composes the shell, metrics, charts,
date/status/search filters, table selection, notifications, timeline, upload,
dialogs, settings, and a task board. Moving a card updates
the corresponding table status. The board shows every active project regardless
of table filters. Card and column priorities stay separate per workspace through
creation and archiving. Its order-only reset preserves statuses and note drafts.
It supports local draft creation, confirmed archiving,
CSV download, and settings changes for three public workspaces during the current
page session. Switching updates projects, boards, inboxes, preferences, charts,
team/activity data, saved notes and browser-copy files/Trash; it closes previews, pauses media and clears selections, filters and unsaved forms. Account
links preserve the current workspace and session edits. Reload restores the samples.
The shared line chart and native bar/donut charts follow matching projects across
all table pages, including search, status, applied dates and board changes.
The cumulative line is a current task snapshot grouped by last-update day;
it does not claim historical task activity. Revenue/retention remain illustrative samples.

Native forms preserve validation and reset behavior. Charts expose their values
without depending on color. The inbox uses a native popover rather than menu
roles. Table selection includes hidden selected rows, while **Select this page**
affects only visible enabled checkboxes. Data mutations require teardown and
reinitialization. The sample CSV export neutralizes leading spreadsheet formulas.

Application services still needed: authentication/recovery, authorization,
database queries, email, subscriptions/payments, real uploads, persistence, and
server validation. Provider-backed billing and advanced visuals remain in
`completion-ledger.md`.

Four further gaps now have optional examples: a Kanban board, sortable list,
resizable panels, and line chart. Desktop drag operations commit on drop;
keyboard/touch users have native move buttons and selects. Form reset restores
initial list/board order. Sortable roots handle regular grids, RTL reading order
and independently nested steps. Kanban adds exact before/after card placement,
in-column priority and column ordering through the shared sorter. Title handles
keep column/parent dragging separate from editable fields. Native disabled
controls and fieldsets enforce read-only moves; cancellation emits no commit.
Panel sizing retains native ranges and adds pointer/
keyboard dividers, nested vertical splits, cancellation and optional browser-local
layout preferences. The dashboard composes these shared panels around its real
activity, notes and file-browser components, with separate layouts per workspace.
Layout-only reset preserves note drafts and file contents. Horizontal panels stack
on narrow screens; vertical panes remain scrollable. Chart exploration uses native ranges.
Charts provide exact table values and distinguish series using solid/dashed lines.
The line-chart API validates atomic replacement/appends, retains at most 512
points and supports native zoom and explicit follow-newest behavior. Optional
gallery feeds start only on request, pause/close on hidden pages and teardown,
and retain accepted data on failure. Its HTTP sample is localhost-only.
The shared core remains unchanged. There are no new runtime dependencies.

Chrome and Firefox suites cover keyboard interaction, narrow and desktop
layouts, light/dark themes, and automated WCAG checks. Installed Safari has
manual smoke checks; WebKit evidence is recorded separately. Screen-reader
and physical touch-device checks remain outstanding. See `validation.md`.

The optional `form-patterns` module supplies combobox/multiselect enhancements,
linked validation summaries, calendars, date shortcuts, and a daily event
scheduler. Invalid date shortcuts preserve the prior range. Scheduler changes
emit an event for the application to persist; they currently last for the page
session. The dashboard reuses the searchable owner field and date shortcuts.

The optional advanced data table enhances native fallback cells with inline
edits, column visibility/pinning/resizing, compound filters and named browser
views. Its generated 10,000-row sample uses a bounded virtual window or native
pagination. The local development server also serves real read-only HTTP pages;
production applications supply authorized loaders and save callbacks. These
controls reuse Rofin form, table and button styles and stay outside the core.

The optional upload queue reuses the shared upload, form, button and progress
styles. It adds previews, file limits, explicit transfers, cancellation and
retry. The development server receives actual binary files with native progress
and interrupted-file cleanup; static production keeps transport disabled.
The temporary public sample does not provide authorized durable storage.

Workspace and account menus reuse the shared dropdown, avatar and button. Native
links open real dashboard routes, including the profile preferences drawer.
Without the application script, the menus still navigate and an explicit notice
identifies the readable static Studio fallback. Sign out stays disabled until
an application provides an authenticated session.

Team management reuses the shared native table, fields, buttons and dialog in the
gallery and dashboard. Workspace roles and invitations stay separate during the
page session. The explicit localhost sandbox verifies current membership and
roles, one-use/rotatable/revocable invitations, revision conflicts and last-owner
protection. Its private access tokens do not verify email identity; data expires
after 15 minutes or server stop. Production accounts, storage and email remain
outstanding application services.

The optional rich-text and Markdown editors reuse Rofin fields, buttons, dialogs
and table styles. Both keep real form values and support validation, composition,
reset and teardown. Restricted rich paste and the Markdown DOM preview remove
active content and do not load pasted images. Native editing/undo support varies;
Markdown is an explicit subset. Full document engines and application persistence
remain outside these bounded note examples.

The optional file browser reuses native file inputs, fields, buttons and dialogs.
Its single-select tree supports arrow keys, Home/End, typeahead, path search and
folder controls. Actual File bytes survive imports, new text files, rename,
move, exact-byte downloads and recoverable Trash. Directory import preserves
paths where supported. Atomic validation and failed/cancelled callbacks retain
existing files. Each public dashboard workspace keeps its own browser copies
and Trash for the page session; original disk files stay intact. Durable
authorized file storage remains A02/A03.

The optional viewers reuse native image anchors, dialogs, file inputs and media
controls. The dashboard previews selected actual File objects after imports and
renames. Original local images, a two-page PDF and three-second media clips keep
the examples usable without third-party assets. PDF embedding and media codecs
depend on the browser; real downloads and complete sample text alternatives
remain available. Explicit local-file previews do not provide document editing,
user-file transcripts or durable storage.

The four error pages compose the same empty-state, button and layout styles.
Unknown documentation routes and static missing resources use the shared 404.
The recovery example reads an actual snapshot, validates its values, preserves
an unsent note and offers explicit GET retry. Cancellation, timeout and stale
results cannot overwrite a newer read. Local permission/server fixtures are
disabled on static production; first-visit offline needs application caching,
and these pages do not supply durable notes or authorization.

Billing pages compose the same subscription, invoice and usage source templates
in the gallery, standalone billing example and dashboard. Confirmed application
callbacks own plan changes, cancellation and reads; no payment requests start
automatically. Failed/invalid/timeout confirmations retain accepted data and
require an explicit authoritative refresh before another change. Native invoice
disclosures and exact text downloads stay readable without component scripts.
Current dashboard usage comes from its actual page-session projects, team and
non-trashed file bytes. Sample paid/part-paid/void invoices are explicit fictional
records; changes do not manufacture a payment or receipt. Authorized provider
checkout, verified invoices and durable metering remain C09/A01/A02/A05.
