# Validation evidence — 2 October 2026

Current gallery: 115 runnable entries, including eight new form/scheduling
examples. This is a component implementation checkpoint; application services,
complete reference review and npm publication remain outstanding in
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

## WebKit and CI

GitHub run [37000033753](https://github.com/robinfrancis186/rofin-ui/actions/runs/37000033753)
passed all 57 tests in each of Chromium, Firefox and WebKit on commit `631b903`.
This Linux WebKit run is separate from installed Safari.

The full macOS WebKit run passed 56 of 57 tests. Its remaining sortable test
assumed pointer clicks focus buttons. The test now activates the move button
with the keyboard to check the intended focus-restoration contract.
After that correction and the preview-form fix below, all 14 form/workspace
checks pass in Chromium, Firefox and macOS WebKit. The current full suite
contains 58 tests.

## Preview forms without scripts

A new regression check reproduced a sample sign-in form placing its values in
the URL when JavaScript was unavailable. All 31 local preview forms now use
native `method="dialog"`, which preserves validation without transmitting
values. The check passes in all three engines for sign-in, password reveal,
autocomplete and the scheduler, with unchanged URLs and no navigation requests.
JavaScript submit handlers continue to supply the interactive local previews.

## Production documentation

[rofin-ui.vercel.app](https://rofin-ui.vercel.app) is deployed and ready.
All 185 built files returned HTTP 200. Their contents matched the local build;
the generated size report was compared by uncompressed byte counts because
gzip sizes differ between the Linux build and macOS.

Rendered production checks covered calendar pointer/keyboard selection,
multiselect selection/removal/clear/reset, mobile documentation navigation,
theme switching, and project creation/filtering with shared table/board state.
At a 390-pixel viewport, the document width remained 390 pixels. The sample
project was cleared by reloading. These checks verify the static documentation
and sample flows; they do not establish durable application services.

`.vercelignore` excludes local test traces, test files, dependency/build output
and environment files from CLI uploads. The corrected deployment uploaded
238.7 KB of changed source, rather than the first deployment's local traces.

## Outstanding verification

Full installed Safari validation, actual screen-reader interaction and physical touch-device checks remain
pending. Axe and touch emulation do not substitute for those device checks.
No npm publication, email delivery, payment webhook or
durable application-service behavior has been verified at this checkpoint.
