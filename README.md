# Rofin UI

**Beautiful components. Minimal footprint.**

A modular HTML, CSS, and vanilla JavaScript library by Robin Francis. Zero
runtime dependencies, no required framework, and no required build step for
using the source files.

The library includes **61 component examples**, **20 optional effects**,
**22 copyable sections**, a searchable documentation gallery, and composed
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
| Forms | Input, select, textarea, checkbox, radio group, switch, range, file input |
| Navigation and overlays | Accordion, tabs, dropdown menu, dialog, drawer, tooltip, breadcrumb, pagination |
| Feedback and content | Toast, alert, table, progress, meter, spinner, skeleton, empty state |
| Website & dashboard | Responsive header, app shell, KPI metrics, bar/donut charts, date ranges, paginated tables, bulk selection, notification inbox, settings, sign-up, password reset |
| Product patterns | Password reveal, tag input, character counter, searchable table, launch checklist, billing switch |

Native HTML handles form behavior, expandable details, and modal focus
management. JavaScript adds keyboard navigation for tabs and menus, dialog
triggers, tooltip Escape dismissal, file-selection details, and toast APIs.

The [website and dashboard checklist](docs/coverage.md) maps common product needs
to existing examples. The documentation also includes a clickable coverage page.

A file input does not upload files by itself. The optional table pattern adds
local search, sorting, filters, pagination, and selection; it does not include virtualization or server queries.
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
tables, launch checklists, billing switches, and copy buttons use a separate module. Native segmented
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

The automated suite currently runs in Chromium and covers keyboard behavior,
dynamic lifecycle, responsive layouts, no-JavaScript fallbacks, packaging,
and WCAG-tagged accessibility checks across gallery examples in both themes.
Firefox/Safari, real touch hardware, and screen-reader testing remain
follow-ups. Automated checks do not certify accessibility of every use case
or of your customizations.

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
