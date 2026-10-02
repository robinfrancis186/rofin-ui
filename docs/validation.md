# Validation evidence — 2 October 2026

Current gallery: 117 runnable entries, including the upload queue, advanced data table and
eight form/scheduling examples. This is a component implementation checkpoint; application services,
complete reference review and npm publication remain outstanding in
`completion-ledger.md`.

## Upload queue

Eight focused upload checks pass in Chrome, Firefox and macOS WebKit. They cover
native selection/drop, local previews, safe file-name rendering, size/type/count
limits, disabled state, cancelled reset, concurrency, explicit retry,
late-callback rejection, active reset, teardown and preview-URL cleanup.
Exposed errors, controls and progress pass automated WCAG checks in both themes
at 390 pixels without widening the document.

Real HTTP checks upload and download exact PNG/text bytes, verify SHA-256
receipts and idempotency, reject mismatched signatures/invalid UTF-8, unsafe
names, oversized files and foreign origins, and delete their own sample files.
An 8 MB transfer reports intermediate native upload progress while the receiver
is still reading; cancellation removes its partial file, and retry completes
with the same ID and exact bytes. Timeout, abort and HTTP failures are checked.
The test-owned server slows actual chunk reads by 50 ms to make backpressure
observable; progress is never synthesized by a timer.

A separate rendered browser check selected a synthetic file through the native
chooser, started Upload with Enter and reset the queue. Its saved bytes matched
the input; that test's temporary file was deleted. The sample receiver is public
localhost storage that expires after 15 minutes or server shutdown. Signature
checks do not fully decode file formats. Authorized durable uploads remain A03.

Package validation passes with 198 files, zero runtime/peer dependencies and a
DOM-safe optional queue import. The queue is separate from the core, which stays
8,153 bytes gzip. Static production previews disable transport.

## Advanced data table

The full 67-test installed Chrome suite passed with all 116 gallery previews
scanned in both themes. The final grid refinements are covered by nine focused
checks in Chrome, Firefox and macOS WebKit: bounded 10,000-row virtualization,
draft retention, numeric constraints and text-safe edits, compound filters,
saved views, column visibility/pinning, pointer/keyboard resizing, cancellation,
real local HTTP pagination, stale/error responses, save failures and teardown.
The exposed settings also pass automated WCAG checks at a 390-pixel viewport.

Slow or failed read-only loaders preserve a bounded previous row window;
malformed responses preserve the previous rows and count. IDs cannot be edited,
and numeric display columns preserve distinct IDs such as `01` and `1`.
The package contains 190 files, with zero runtime or peer dependencies and
DOM-safe optional-grid imports. The core remains 8,153 bytes gzip.

Rendered local browser checks verified filtering followed by cell editing and
actual HTTP navigation to rows 26–50. The HTTP endpoint serves generated public
sample data and rejects invalid queries and writes. It is not a durable,
authenticated application service. Static production uses browser data.

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
Light and dark previews were visually inspected. A separate native Safari grid
smoke check reduced the generated sample to the Atlas launch row using search.

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
contained 58 tests. GitHub run
[37002785720](https://github.com/robinfrancis186/rofin-ui/actions/runs/37002785720)
then passed all 58 tests in each engine on commit `4e6c71b`.

GitHub run [37008506810](https://github.com/robinfrancis186/rofin-ui/actions/runs/37008506810)
passed all 67 tests and package validation in each engine on commit `b5f321e`.
This verifies the complete grid checkpoint in Linux Chromium, Firefox and WebKit.

GitHub run [37013262771](https://github.com/robinfrancis186/rofin-ui/actions/runs/37013262771)
passed all 75 tests and 198-file package validation in each engine on commit
`532cffc`. This verifies the full 117-example upload checkpoint in Linux
Chromium, Firefox and WebKit; the eight focused checks also passed locally in
all three engines. Each completed job's log was inspected.

## Preview forms without scripts

A new regression check reproduced a sample sign-in form placing its values in
the URL when JavaScript was unavailable. All 31 preview forms at that checkpoint used
native `method="dialog"`, which preserves validation without transmitting
values. The check passes in all three engines for sign-in, password reveal,
autocomplete and the scheduler, with unchanged URLs and no navigation requests.
JavaScript submit handlers continue to supply the interactive local previews.
The new upload example follows the same contract, bringing the current total to 32.

## Production documentation

[rofin-ui.vercel.app](https://rofin-ui.vercel.app) is deployed and ready.
At the preceding 115-example checkpoint, all 185 built files returned HTTP 200. Their contents matched the local build;
the generated size report was compared by uncompressed byte counts because
gzip sizes differ between the Linux build and macOS.

Rendered production checks covered calendar pointer/keyboard selection,
multiselect selection/removal/clear/reset, mobile documentation navigation,
theme switching, and project creation/filtering with shared table/board state.
At a 390-pixel viewport, the document width remained 390 pixels. The sample
project was cleared by reloading. These checks verify the static documentation
and sample flows; they do not establish durable application services.

The 116-example deployment subsequently passed content checks for all 193 built
files. Rendered grid checks covered filtering followed by editing, hiding and
pinning columns, keyboard resizing, saving/restoring a view across reload,
edit cancellation, 25-row pagination and both themes. At 390 pixels the document
width remained 390 pixels. Reload restored sample row data while the saved view
persisted; the temporary QA view was removed. The local-only HTTP option is
disabled on static production.

The 117-example upload checkpoint passed content checks for all 200 built files
on production. Native file selection added a local preview while Upload/Retry
remained disabled. Keyboard cancellation and reset worked, and both themes
remained within 390 pixels. No console errors were reported in those checks.
The static gallery provides no upload endpoint or durable application storage.

`.vercelignore` excludes local test traces, test files, dependency/build output
and environment files from CLI uploads. The corrected deployment uploaded
238.7 KB of changed source, rather than the first deployment's local traces.

## Outstanding verification

Full installed Safari validation, actual screen-reader interaction and physical touch-device checks remain
pending. Axe and touch emulation do not substitute for those device checks.
No npm publication, email delivery, payment webhook or
durable application-service behavior has been verified at this checkpoint.
