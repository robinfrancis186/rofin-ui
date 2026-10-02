# Validation evidence — 2 October 2026

Current gallery: 115 runnable entries, including eight new form/scheduling
examples. This is a component implementation checkpoint; application services,
complete reference review and publication remain outstanding in
`completion-ledger.md`.

## Chrome

`RF_CHROMIUM_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' npm run check`
passed all 57 browser tests in 11.2 minutes. The suite scans every gallery entry
in both themes, documentation routes, composed website/dashboard flows,
keyboard/lifecycle/reset behavior, native fallbacks and narrow layouts.
Nine form tests include IME handling, repeated form values, linked errors,
calendar/leap-month edges, scheduler CRUD and emulated touch.

The package check also passed: 181 files, no runtime or peer dependencies,
DOM-safe ESM/CJS and optional-form
imports. Core CSS plus auto JavaScript remains 8,153 bytes gzip.

## Installed Safari

Native Safari 26.2 on this Mac was operated through its UI against the local
documentation server. Calendar click/keyboard selection, combobox search and
reset, multiselect selection/clear/reset, error-summary focus links, and
scheduler create/edit/delete were checked. A calendar focus-loss bug found in
Safari was corrected and rechecked with consecutive keyboard selections.
Light and dark previews were visually inspected.

This is a manual smoke check, not the full automated suite. Safari WebDriver
could not start because remote automation is disabled; that preference was not
changed. Playwright WebKit evidence is recorded separately.

## Firefox

`RF_BROWSER=firefox npm test` passed all 57 tests in 16.1 minutes, including
all 115 gallery entries in both themes, all nine form tests and the composed
website/dashboard flows. Clipboard cases verify copy acceptance or a visible
manual-copy fallback because the Chromium clipboard permission is unsupported
in Firefox.

## Outstanding verification

Full updated WebKit validation,
actual screen-reader interaction and physical touch-device checks remain
pending. Axe and touch emulation do not substitute for those device checks.
No npm publication, production deployment, email delivery, payment webhook or
durable application-service behavior has been verified at this checkpoint.
