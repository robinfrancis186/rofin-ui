# Website and dashboard coverage

The 116-example gallery covers common website and dashboard UI. Use the
interactive **Website & dashboard checklist** in the documentation to open
each example. This is a UI library, not an application backend.

| Need | Existing building blocks |
| --- | --- |
| Website navigation | Responsive header, native mobile menu, navigation, breadcrumbs, footer |
| Marketing pages | Hero, feature grid, bento, logos, pricing and billing toggle, testimonials, FAQ, CTA, team, blog grid |
| Forms and capture | Contact, newsletter, native labelled inputs/selects, autocomplete, searchable combobox/multiselect, linked error summary, textarea, checkboxes/radios, upload, character counter, tags |
| Account UI | Sign in, sign up, password reset, reveal password, one-time code, account settings |
| Dashboard structure | Responsive app shell, sidebar, top bar, KPI cards, adjustable panels, layout, avatars, badges |
| Visualization | Line chart with keyboard exploration and series toggles, bar chart with exact data disclosure, donut chart with complete legend, progress, meter, statistics |
| Data workflows | Searchable sortable table, status filters, date ranges/presets, row pagination/page size, bulk selection/actions, editable virtualized grid, column settings, compound filters and saved views |
| Actions and overlays | Buttons, dropdown, native dialog/drawer, tooltip, command palette |
| Feedback and states | Alert, toast, notification inbox, empty state, spinner, skeleton |
| Activity and onboarding | Task board, sortable priorities, timeline, checklist/progress, multistep form, calendar, time picker, daily event scheduler, tabs |

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
of table filters. It supports local draft creation, confirmed archiving,
CSV download, and settings changes for the current page session. Reload restores
the sample. Charts are explicitly fixed sample data; date filters affect projects.

Native forms preserve validation and reset behavior. Charts expose their values
without depending on color. The inbox uses a native popover rather than menu
roles. Table selection includes hidden selected rows, while **Select this page**
affects only visible enabled checkboxes. Data mutations require teardown and
reinitialization. The sample CSV export neutralizes leading spreadsheet formulas.

Application services still needed: authentication/recovery, authorization,
database queries, email, subscriptions/payments, real uploads, persistence, and
server validation. Rich-text and Markdown editors, file/browser/media workflows,
team and billing flows, and deeper sorting/panel/chart interactions remain in
`completion-ledger.md`.

Four further gaps now have optional examples: a Kanban board, sortable list,
resizable panels, and line chart. Desktop drag operations commit on drop;
keyboard/touch users have native move buttons and selects. Form reset restores
initial list/board order. Panel sizing and chart exploration use native ranges.
Charts provide exact table values and distinguish series using solid/dashed lines.
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
