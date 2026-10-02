# Rofin UI

**Beautiful components. Minimal footprint.**

A modular HTML, CSS, and vanilla JavaScript library by Robin Francis. Zero
runtime dependencies, no required framework, and no required build step for
using the source files.

The library includes **79 component examples**, **20 optional effects**,
**23 copyable sections**, a searchable documentation gallery, and composed
landing-page and dashboard examples.

> Pre-1.0: APIs and styles may change. The npm package has not been published
> yet. No custom domain has been registered.

## Start with HTML

Download or clone this repository. Include the source stylesheet:

```html
<link rel="stylesheet" href="./src/rofin.css">

<div class="rf-scope">
  <button class="rf-button" type="button">Get started</button>
</div>
```

`.rf-scope` enables scoped typography and base styles. Prefixed component
classes work individually without resetting the rest of your website.

Only add JavaScript when you need interactions:

```html
<script type="module">
  import { init, toast } from './src/js/index.js';

  const destroy = init();
  // toast('Your changes are saved.', { variant: 'success' });
  // Call destroy() before unmounting the app root.
</script>
```

Serve ES modules over HTTP rather than opening an HTML file through `file://`.
CSS-only components can be used without JavaScript or a local server.

## Pick only what you need

```html
<link rel="stylesheet" href="./src/tokens.css">
<link rel="stylesheet" href="./src/button.css">
<button class="rf-button" type="button">Just one component</button>
```

Add `base.css` and `layout.css` if the example uses scoped base styles, helpers
such as `.rf-muted`, or layouts such as `.rf-grid`.

```js
import { initTabs } from './src/js/tabs.js';
const destroyTabs = initTabs(document.querySelector('#my-tabs'));
```

Individual initializers do not observe future insertions. The main `init()`
observes inserted and removed component subtrees by default; initialize the
same root only once and avoid overlapping roots. Attribute changes and
changes to an existing tabset's internal structure require teardown and
reinitialization.

## Components

| Area | Included examples |
| --- | --- |
| Foundations | Button, card, layout, navigation, avatar, badge |
| Forms | Input, select, autocomplete, combobox, multiselect, error summary, calendar, time picker, textarea, checkbox, radio group, switch, range, file input and upload queue |
| Navigation and overlays | Accordion, tabs, dropdown menu, dialog, drawer, tooltip, breadcrumb, pagination |
| Feedback and content | Toast, alert, table, progress, meter, spinner, skeleton, empty state |
| Website & dashboard | Responsive header, app shell, KPI metrics, bar/donut charts, date ranges, paginated tables, bulk selection, notification inbox, settings, workspace switcher, account menu, sign-up, password reset |
| Product patterns | Password reveal, tag input, character counter, searchable table, launch checklist, billing switch |
| Workspace patterns | Kanban, sortable list, adjustable panels, interactive line chart, event scheduler, date presets |

Native HTML handles form behavior, expandable details, and modal focus
management. JavaScript adds keyboard navigation for tabs and menus, dialog
triggers, tooltip Escape dismissal, file-selection details, and toast APIs.

The [website and dashboard checklist](docs/coverage.md) maps common product needs
to existing examples. The documentation also includes a clickable coverage page.

A file input does not upload files by itself. The optional upload queue invokes
an application callback only after an explicit Upload action. The optional table pattern adds
local search, sorting, filters, pagination, and selection. The separate advanced
data table adds virtualization and application-supplied server queries.
Application data, authentication, form submission, and backend integrations
remain your application's responsibility.

## Optional effects and sections

Effects stay outside the core: dot grids, gradient text, hover lift, pointer
spotlight, scroll reveal, and interactive shimmer. Include `src/effects.css`;
spotlight and reveal also use `initEffects()` from `src/js/effects.js`.
Reduced-motion preferences are respected, and content remains visible without
JavaScript.

The optional effects collection also includes grid and mesh backgrounds,
aurora, gradient borders, border beams, glass, tilt, glare, a lamp highlight,
stars, magnetic buttons, text treatments, and focus cards. Tilt, glare, and
magnetic buttons use the existing `initEffects()` initializer.

## Optional interaction patterns

Comparison sliders, carousels, command palettes, like buttons, number steppers,
multistep forms, password reveal, tag inputs, character counters, searchable
tables, launch checklists, billing switches, task boards, sortable lists,
adjustable panels, line charts, and copy buttons use a separate module. Native segmented
controls, dates, one-time codes, timelines, docks, details cards, checklists,
ratings, chips, and the pausable marquee share its optional stylesheet.
These are excluded from the core bundle and the auto initializer.

```html
<link rel="stylesheet" href="./src/rofin.css">
<link rel="stylesheet" href="./src/patterns.css">
<script type="module">
  import { init } from './src/js/index.js';
  import { initPatterns } from './src/js/patterns.js';
  const stopCore = init();
  const stopPatterns = initPatterns();
  // Before removing this app root: stopPatterns(); stopCore();
</script>
```

Initialize each patterns root once; call the returned cleanup before removal.
List/board moves retain committed DOM state on teardown. Native form reset
restores their initial arrangement.
`rf:sort-change` emits `detail.value`, zero-based `from`/`to`, `values`, and
`previousValues`; `rf:kanban-change` emits `value`, `from`, and `to` column values.
The application owns persistence and rollback. Move buttons and native selects
provide keyboard/touch alternatives to desktop drag operations.
Call `initPatterns(newRoot)` for newly inserted pattern markup. Command
palettes emit `rf:command` with `detail.value`; tag inputs emit `rf:tags-change`
with `detail.values`. Tables emit `rf:table-selection` with `detail.values` and
`rf:table-action` with `detail.action` plus `detail.values`. Notification read
actions emit `rf:notifications-read` with `detail.values`. Your app owns
persistence, authorization, and the actual action.
Authentication, subscriptions, and integrations are interface
examples; connect application behavior and server validation yourself.

The documentation's **Reference library** indexes 11 source catalogs with
related original Rofin patterns and explicit coverage notes. Catalog metadata
is not proof of individual demo review or feature parity. See
[the source review](docs/reference-review.md).

Include `src/sections.css` for the hero, feature grid, bento layout, pricing,
testimonials, statistics, FAQ, call to action, footer, and contact sections.
Copy their HTML from `sections/`. Product copy, prices, statistics, and quotes
are illustrative; replace them before publishing.

## Optional form workflows

Add `src/form-patterns.css` and initialize `initFormPatterns` from
`src/js/form-patterns.js` for searchable comboboxes, multiselects, validation
summaries, calendars, date shortcuts, and daily event scheduling. Native
selects, dates, times, and datalist suggestions remain available without scripts.
The module is separate from the core and has no runtime dependencies.

```js
import { initFormPatterns } from 'rofin-ui/form-patterns';
const stopForms = initFormPatterns(document.querySelector('#my-form'));
// Call stopForms() before removing or changing the control structure.
```

Use the repository path until npm publication. `rf:combobox-change` supplies
`detail.value` and `detail.label`; `rf:multiselect-change` supplies
`detail.values`; `rf:date-change` supplies `detail.value`;
`rf:date-range-change` supplies `detail.start` and `detail.end`;
`rf:schedule-change` supplies a copied `detail.events` array. The application
persists changes and supplies its time zone. Honor `event.defaultPrevented`
in form submission handlers so validation can stop invalid submissions.

Preview forms use `method="dialog"` to retain native validation without sending
sample values when JavaScript is unavailable. When connecting an application,
replace it with your server's form method/action or your own submit handler.

## Optional advanced data table

Add `src/data-grid.css` alongside the core styles and enhance the native table
in `examples/components/data-grid.html`:

```js
import { createDataGrid } from './src/js/data-grid.js';
const grid = createDataGrid(document.querySelector('[data-rf-data-grid]'));
// Call grid.destroy() before removing or changing the table structure.
```

The table supports typed inline edits, sorting, compound all/any filters,
visible/resizable/pinned columns, and named views. Set `storageKey` or
`data-rf-grid-storage` to save views in this browser; unavailable storage falls
back to the current page. Edits remain in memory unless an application supplies
`saveCell(edit, { signal })`, which returns the validated saved row. A failed
save retains the draft for retry. IDs must stay stable and cannot be edited.

Pass `rows` and optional `columns` to use application data. `loadPage(query,
{ signal })` returns `{ rows, total, page? }` for server paging; stale requests
cannot replace newer results. `queryGridRows` supplies shared query semantics
for the included read-only HTTP sample at `/api/sample-grid` when running
`npm run dev`. The static production gallery uses browser data. Applications
own transport, authorization, durable storage and edit-conflict handling.
The module makes no automatic network calls and stays outside the core.

Virtual scrolling uses fixed 56-pixel rows and truncated cell text. Turn it off
for native paginated reading. Client queries scan at most 100,000 rows; use a
server loader for larger data or expensive queries. `getState()` and `getRows()`
return copies; `getRows()` returns browser rows, not a remote dataset. `refresh`,
`setRows` and `setLoader` update data. Destroying restores the first 25 browser
rows with committed values. `rf:grid-change` and `rf:grid-edit` report copied
state/rows; cancel `rf:grid-before-edit` to stop a save.

After npm publication, the optional imports are `rofin-ui/data-grid` and
`rofin-ui/data-grid.css`.

## Optional upload workflow

Add `src/upload-queue.css` alongside the core styles and use the labelled input
and list in `examples/components/upload-queue.html`:

```js
import { createUploadQueue, uploadFile } from './src/js/upload-queue.js';
const queue = createUploadQueue(document.querySelector('[data-rf-upload-queue]'), {
  upload: (file, { id, signal, onProgress }) => uploadFile(
    `/api/uploads?id=${id}&name=${encodeURIComponent(file.name)}`,
    file, { signal, onProgress, headers: { 'Content-Type': 'application/octet-stream' } }
  )
});
// /api/uploads is an endpoint your application implements.
// Call queue.destroy() before removing the component.
```

Without a callback, files stay local and upload buttons are disabled. The queue
supports drop/native selection, image previews, size/type/count checks,
two simultaneous transfers by default, native progress, cancel and explicit
retry. Failed and cancelled files remain available; reset clears the queue and
aborts active callbacks. Removing a row only changes the local queue.
`getFiles()` returns the selected File objects, including after teardown;
enhancement clears the native input after selection, so enhanced forms use
this API or their upload callback rather than the input's current FileList.

Callbacks honor the supplied AbortSignal and use the stable ID for server
idempotency. `uploadFile` sends the binary body with XMLHttpRequest, reports
actual upload events and rejects HTTP, network, timeout and abort failures.
`rf:upload-change`, `rf:upload-complete` and `rf:upload-error` expose state,
receipts and failures; cancel `rf:upload-before` to prevent a transfer.
Application code owns authorization, server validation, storage and deletion.

`npm run dev` provides `/api/sample-uploads`, a public localhost receiver with
8 MB file limits, signature/UTF-8 checks, SHA-256 receipts and exact downloads.
It holds at most 64 MB and 20 files in a temporary directory; files expire
after 15 minutes or when the server stops. Signature checks do not fully decode
file formats. Interrupted partial files are removed. The static production
gallery disables transport and offers local previews only.

After npm publication, optional imports are `rofin-ui/upload-queue` and
`rofin-ui/upload-queue.css`. The module has no runtime dependencies and stays
outside the core bundle.

## Team management

Add `src/team-management.css` and use the native form/table in
`examples/components/team-management.html` with the optional controller:

```js
import { createTeamManager } from './src/js/team-management.js';
const manager = createTeamManager(document.querySelector('[data-rf-team-manager]'), {
  team, actorId,
  change: (operation, { signal, revision }) => application.changeTeam(operation, { signal, revision }),
  load: ({ signal }) => application.loadTeam({ signal })
});
// change confirms { team } or explicitly { team: null } after access ends.
// Call manager.destroy() before removing the component.
```

The application supplies confirmed snapshots, safe sessions, email and storage.
Snapshots support at most 50 members and 20 pending invitations; larger
directories require application paging and a corresponding server policy.
`applyTeamChange` and `acceptTeamInvitation` expose the same small policy used by
the localhost service: owners manage all roles, admins manage editors/viewers,
and at least one owner remains. A server derives the actor from its verified
session and checks the expected revision before applying a change.

The default examples keep changes in the page session. **Start isolated local
team** explicitly creates a temporary private sandbox with server-issued access
tokens and one-use invitation links. Those links grant their holder the selected
role; they do not verify email identity or create durable accounts. Samples
expire after 15 minutes or server stop. No email is sent. Production applications
supply their own backend. After npm publication, optional imports will be
`rofin-ui/team-management` and `rofin-ui/team-management.css`.

## Themes

Tokens follow the operating system by default. Set `data-rf-theme="light"` or
`data-rf-theme="dark"` on `<html>` for an explicit theme. Override `--rf-*`
variables after the library stylesheet to change its appearance.

```css
:root {
  --rf-primary: #176844;
  --rf-primary-hover: #105132;
  --rf-on-primary: #ffffff;
  --rf-focus: #176844;
  --rf-radius: 1rem;
}
```

## Preview and build

```sh
npm ci
npm run build
npm run dev
```

Open **http://127.0.0.1:4173** for the documentation gallery, or:

- `/examples/index.html` — all core component examples
- `/examples/landing.html` — a composed landing page
- `/examples/dashboard.html` — a complete sample workspace with charts, filters, paging, selection, CSV export, project creation, archive confirmation, notifications, and settings

The build outputs minified CSS, ESM and CommonJS modules, an auto-initializing
browser script, type declarations, and a self-contained documentation site in
`dist/site`. Build tools are development dependencies only.

The documentation website is composed from Rofin's own cards, inputs, buttons,
navigation, badges, grids, statistics, empty states, dialogs, and footer.
`docs/style.css` handles the site layout, branding, and decorative thumbnails.
Star components to build a saved collection, search it, and copy a deduplicated
setup snippet. Collections persist in this browser when local storage is available.

```html
<link rel="stylesheet" href="./dist/rofin.css">
<script src="./dist/rofin.auto.js" defer></script>
<!-- Auto-initializes. Public APIs are available on window.Rofin. -->
```

## Size and performance

The current size report is generated in `dist/sizes.json` and mirrored in
`docs/sizes.json`. The core includes the CSS and auto JavaScript, excludes
optional effects/sections and docs, and is measured with separate gzip
compression at level 9. Builds enforce a **14 KiB combined gzip ceiling**.

A small library helps reduce transfer and JavaScript overhead. It does not
promise a particular Lighthouse score or guarantee a fast application.
Images, fonts, app scripts, rendering effects, and server response time still
matter. No field Core Web Vitals claims are made.

## Browser and accessibility support

Target current Chrome/Edge, Firefox, and Safari. Dropdowns require native
Popover support: Chrome/Edge 114+, Firefox 125+, or Safari 17+. CSS layers and
other modern CSS features are used; no legacy polyfills are bundled.

The automated suite supports Chromium, Firefox and WebKit and covers keyboard behavior,
dynamic lifecycle, responsive layouts, no-JavaScript fallbacks, packaging,
and WCAG-tagged accessibility checks across gallery examples in both themes.
Chrome and Firefox suites pass locally. Installed Safari has manual smoke
checks; WebKit is recorded separately. Physical touch hardware and screen-reader
testing remain outstanding. See [validation evidence](docs/validation.md).
Automated checks do not certify accessibility of every use case or customization.

```sh
npx playwright install chromium
npm run check
# Or use an existing Chromium:
# RF_CHROMIUM_PATH=/usr/bin/chromium npm run check
```

## Package and publishing

The intended package name is `rofin-ui`. Until it is published, use the
repository source or run `npm pack` to produce an installable local tarball.
Once installed, exports include `rofin-ui`, `rofin-ui/style.css`,
`rofin-ui/css/button`, `rofin-ui/js/tabs`, `rofin-ui/effects`, and
`rofin-ui/sections.css`.

`npm publish --access public` requires an authenticated npm account authorized
to claim this package name. Building or committing this project does not
reserve the npm name. The domain is intentionally deferred.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CHANGELOG.md](CHANGELOG.md).

Inspired by Oat's minimal approach and the pattern families in the linked
catalogs. This repository contains original component code; it does not
include source code from the referenced libraries. Reference names and URLs
are a dated research snapshot, separate from the runnable Rofin gallery.

MIT — Copyright © 2026 Robin Francis.
