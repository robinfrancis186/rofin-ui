# Website and dashboard coverage

The 103-example gallery covers common website and dashboard UI. Use the
interactive **Website & dashboard checklist** in the documentation to open
each example. This is a UI library, not an application backend.

| Need | Existing building blocks |
| --- | --- |
| Website navigation | Responsive header, native mobile menu, navigation, breadcrumbs, footer |
| Marketing pages | Hero, feature grid, bento, logos, pricing and billing toggle, testimonials, FAQ, CTA, team, blog grid |
| Forms and capture | Contact, newsletter, native labelled inputs/selects, textarea, checkboxes/radios, upload, character counter, tags |
| Account UI | Sign in, sign up, password reset, reveal password, one-time code, account settings |
| Dashboard structure | Responsive app shell, sidebar, top bar, KPI cards, layout, avatars, badges |
| Visualization | Bar chart with exact data disclosure, donut chart with complete legend, progress, meter, statistics |
| Data workflows | Searchable sortable table, status filters, date ranges, row pagination/page size, bulk selection/actions |
| Actions and overlays | Buttons, dropdown, native dialog/drawer, tooltip, command palette |
| Feedback and states | Alert, toast, notification inbox, empty state, spinner, skeleton |
| Activity and onboarding | Timeline, checklist/progress, multistep form, tabs |

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
dialogs, and settings. It supports local draft creation, confirmed archiving,
CSV download, and settings changes for the current page session. Reload restores
the sample. Charts are explicitly fixed sample data; date filters affect projects.

Native forms preserve validation and reset behavior. Charts expose their values
without depending on color. The inbox uses a native popover rather than menu
roles. Table selection includes hidden selected rows, while **Select this page**
affects only visible enabled checkboxes. Data mutations require teardown and
reinitialization. The sample CSV export neutralizes leading spreadsheet formulas.

Application services still needed: authentication/recovery, authorization,
database queries, email, subscriptions/payments, real uploads, persistence, and
server validation. Large grids/virtualization, rich text, calendars, maps, and
industry-specific tools should be added when a product actually needs them.

Browser validation covers Chrome, keyboard interaction, narrow and desktop
layouts, light/dark themes, and automated WCAG checks. Dedicated Safari,
Firefox, screen-reader, and physical touch-device checks remain separate.
