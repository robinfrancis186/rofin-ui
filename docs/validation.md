# Validation evidence — 2–3 October 2026

Current gallery: 135 runnable entries, including nested/grid sorting and reorderable task cards/columns, nested adjustable dashboard panels, error/recovery pages, image/document/media viewers, the file browser, rich-text/Markdown notes, team management, invitation and
permission examples, workspace/account menus, the upload
queue, advanced data table and eight form/scheduling examples. This is a component implementation checkpoint; application services,
complete reference review and npm publication remain outstanding in
`completion-ledger.md`.

## Billing UI checkpoint

Three billing views reuse shared native form/card/table/button/meter components.
The gallery and composed billing/dashboard pages use the same source templates.
Integer minor-unit prices have an explicit display exponent; invoices validate
exact line, discount, tax, total and paid values. Voided records have no balance
due, and historical customer names survive workspace renaming. Native details
and genuine text downloads expose accepted data. These fictional statements
are marked as samples, not tax documents or proof of payment.

Plan/interval review, scheduled cancellation and resume commit only a copied
newer same-workspace snapshot supplied by the application. Failed, stale,
malformed or eight-second timed-out confirmations retain prior data, abort the
callback and require refresh before another change. Updates/teardown reject
late results. Native/cancelled reset and usage-only updates preserve confirmed
state, plan drafts and expanded invoice records. Gallery usage scenarios cover
near/over/empty/unlimited/zero quotas; dashboard usage instead derives from
actual active projects, team members and non-trashed browser-copy File bytes.
The sample period follows monthly/yearly calendar boundaries, including end-of-
month and leap-year clamps. Real provider timing remains application-owned.

Seven focused checks pass in Chromium, Firefox and macOS WebKit, including actual invoice downloads,
project creation, member removal and imported/trash/restored file bytes,
workspace plan isolation, valid/invalid snapshots, failure/reconciliation,
timeout/late callbacks, native and cancelled reset, zero/2/3 currency display
exponents, 320/390/1440-pixel themes, reduced motion, full axe scans and actual
scripts-off invoice disclosure/download. The gallery download guard now permits
native download links; pricing choices navigate to the composed billing view.
The full 150-test local Chromium suite, 11 affected billing/dashboard checks
in each engine and the 265-file package check pass. The theme checks wait for
live painted controls: Firefox retains pending transitions inside closed native
details. All accessibility rules and assertions remain enabled. Installed Safari
separately verifies annual plan review/change, the exact 2027-10-01 period end,
cancellation dismissal and the open invoice balance of $14.00. The owned Safari
tab was closed and its original Start Page restored. Current production and
exact-head CI evidence are recorded in draft PR #1 after deployment.

Production has no configured environment variables (`vercel env ls production`,
3 October 2026). No payment provider, durable billing account or verified invoice
service is configured. C09 remains partial until provider-backed evidence and
authorized persisted data are verified; A01/A02/A05 remain outstanding.

## Shared chart updates and filtered dashboard data

The optional line chart now exposes `updateLineChart` for atomic replacement
and bounded append. It validates fixed series, unique trimmed labels, finite
numeric values and documented size limits before touching accepted data. It
copies values, keeps the latest 512 points and preserves selection/window labels
where possible. Native start/end ranges zoom the visible window; explicit
follow-newest pans with updates. The scale includes zero and series visibility
does not change it. Empty data hides the SVG and disables exploration. Native
form reset restores the view of current accepted data; teardown leaves a
readable plot/table and rejects late updates. Per-change events expose exact
accepted counts and view indices without a live announcement on every tick.

The gallery's separate sample controller starts only on request. Its browser
timer and real localhost EventSource feed support pause, restore and explicit
retry. Hidden pages, pagehide and route teardown close the feed. Failed HTTP,
malformed values and rejected duplicate labels retain accepted data. Static
hosting disables the HTTP option. No network or new runtime dependency was
added to the shared library.

The native table emits matching row IDs across all pages. The dashboard uses
that one filtered snapshot for its shared line chart and native bar/donut
charts, including searches, statuses, applied dates, card moves and workspace
changes. Six Studio projects have 65 tasks, including 18 Published tasks;
filtering Published yields exactly two projects/18 tasks and 100 percent.
Changing Brand refresh to Published produces 38 Published tasks; Personal
has six tasks and no Published tasks. The cumulative line groups current tasks
by their most recent update day; it does not claim activity history. Revenue
and retention remain labelled illustrative samples.

All seven new chart checks pass locally in Chromium, Firefox and macOS WebKit
after the final cleanup/follow fixes. All 28 affected chart, dashboard,
workspace and sorting checks also pass in Firefox and macOS WebKit.
They cover exact numeric tables/SVG, invalid atomic updates, safe text labels,
512-point rollover, selection, zoom, follow behavior, cancelled/native reset,
cleanup/reinitialization, actual HTTP event bytes, failed/malformed feeds,
explicit retry, pause and lifecycle closure. Both themes fit 320/390/1440 pixels,
reduced motion reports no page errors, exposed previews pass axe and genuine
JavaScript-disabled pages retain exact tables and native initial plots.
Restoring an unchanged valid snapshot clears a prior error without emitting a
duplicate data commit. Teardown restores the original series visibility with
accepted values, and checking Follow moves to the actual newest point immediately
while retaining the zoom span. The final focused checks cover each case.

Separate installed Safari smoke checks passed native pointer zoom, browser
updates/follow, pause/restore and real HTTP sample reception. The exact first
HTTP point was `Sample 1`, active 56 and target 61. The owned tab was closed and
the original Start Page restored. This is partial native Safari evidence;
full Safari, actual screen-reader and physical-touch checks remain outstanding.

The final full Chromium run passed all 143 tests and the 253-file package
check. Core CSS/auto JavaScript remains 8,424 bytes gzip locally under the
14 KiB budget, with zero runtime/peer dependencies. Earlier full attempts were
intentionally stopped for cleanup/follow fixes; a replacement server-start
timeout was resolved by starting and verifying the owned development server.
The final run completed every assertion. Current CI and deployed-content
evidence are recorded in draft PR #1.

## Shared sorting and workspace priorities

The existing sorter now owns its direct items, controls and announcement instead
of collecting those from nested roots. Regular grids place items in reading
order, including RTL; stacked grids use vertical placement. Optional title
handles keep parent/column drags separate from editable fields. Native buttons
provide the same commits and retain usable focus. Hidden form inputs serialize
actual DOM order. Moving a parent retains its nested order and typed fields.

Kanban now places cards before/after another card, within or across columns.
Earlier/Later buttons preserve native Move-to selects. Its change event retains
the original column-name fields and adds exact indices plus previous/current
column-to-card records. Column ordering uses the same sorter, with a separate
sort event. No-ops, external drops and unfinished drags emit no commit. Escape,
pagehide, reset, disabling and teardown cancel a draft. Native disabled selects,
buttons and ancestor fieldsets are honored; cancelled resets preserve committed
order. Cleanup restores original controls and draggable attributes.

The dashboard composes those shared components. Priorities remain separate per
page-session workspace through project creation, archive and status changes.
Order-only reset preserves project statuses and a typed unsaved Markdown note;
reload restores the samples. Re-rendering a board clears stale move announcements
from the previous workspace/model. The examples are small DOM collections, with no
cross-root nested transfer, virtualized/masonry sorting or durable persistence.

All 11 focused sorting/workspace checks pass locally in Chromium, Firefox and
macOS WebKit. They cover real pointer drops, nested ownership and form values,
exact snapshots, RTL/stacked grids, column title handles, keyboard focus,
cancelled/native resets, disabled fieldsets, teardown/reinitialization, malformed
IDs, workspace isolation, creation/archive and the order-only reset. Both themes
fit 320/390/1440 pixels, reduced motion is checked and exposed previews pass axe.
Genuine JavaScript-disabled pages retain readable cards, nested content and the
native note field. Reset checks wait for the owned announcement before reading
the final DOM; no exact-order assertions were removed or relaxed. The existing
dashboard drag check starts on the card title rather than its native select.

Installed Safari separately passed native card/column movement and order-only
reset with the exact typed unsaved note intact. Its owned tab was closed and the
original Start Page restored. This is partial native Safari evidence; full
Safari, actual screen-reader and physical-touch validation remain outstanding.

After the stale-announcement fix, all 11 focused checks pass again in each engine.
The full 136-test local Chromium suite and 252-file package check pass. The first
full run was intentionally interrupted to fix that announcement; its replacement
completed with every assertion intact. No runtime/peer dependency was added, and
the combined core remains 8,424 bytes gzip locally, below its 14 KiB budget.
GitHub run [37097344507](https://github.com/robinfrancis186/rofin-ui/actions/runs/37097344507)
subsequently passed all 136 tests and the 252-file package check in Chromium,
Firefox and WebKit on `abb383b`, plus native-media/narrow-recovery checks.
Each completed job log was inspected. The corresponding production deployment
passed exact content checks for all 254 built files; native card/column moves,
workspace isolation and draft-preserving order reset were checked, with both
themes fitting 320/390 pixels. Current release evidence is also in draft PR #1.

## Shared resizable workspace desk

The existing optional panel component now generates a named, focusable separator
between its two panes. Captured pointer movement and axis-aware keyboard controls
adjust the same native range. Shift uses ten steps, Home/End respect native
bounds, and Enter collapses/restores only a zero-bound primary pane. Escape,
pointer cancellation/lost capture, disabling, pagehide, changed geometry and
teardown cancel an unfinished drag without committing or saving it. The release
handler also checks geometry, so a resize arriving before ResizeObserver cannot
save a draft. Native form reset respects cancellation and restores both nested
splits; layout-only reset preserves note/file data.

The gallery nests a vertical preview/note split inside the horizontal workspace.
The dashboard uses that same component for its activity, Markdown editor and file
browser; it does not implement a second divider. Each public workspace uses
separate browser-local layout keys. Reload retains percentages while restoring
sample application data. Invalid preferences are ignored; blocked storage keeps
controls usable. Horizontal panes stack below 36rem. Vertical panes scroll, and
text-only scroll regions have a name and keyboard focus. Plain HTML retains
readable content and labelled sliders; resizing/saving requires enhancement.

All 129 local Chromium checks pass, plus the 252-file package check. The final
19 focused panel/workspace/file checks pass in Chromium, Firefox and macOS WebKit.
They cover real pointer/keyboard commits, RTL, two-axis isolation, zero-bound
collapse, interrupted drafts, ancestor fieldsets, native/cancelled reset,
invalid/blocked storage, teardown/reinitialization, pagehide, workspace switching,
reload boundaries, exact imported-file retention and native scripts-off content.
Both themes fit 320/390/1440 pixels, reduced motion is checked, and the exposed
panels pass automated WCAG checks. The drag test keeps simulated releases inside
the viewport: Firefox does not deliver an off-viewport simulated pointerup; the
minimum-bound and persistence assertions remain unchanged. No runtime dependencies
were added. Core CSS plus auto JavaScript remains 8,424 bytes gzip locally.

Installed Safari separately passed divider keyboard adjustment, nested vertical
adjustment, persisted layout reload and layout-reset preservation of a typed
unsaved note. Its owned tab was closed and the original Start Page restored.
This is partial installed Safari evidence; full Safari, actual screen-reader and
physical-touch checks remain outstanding. In the earlier metadata-only CI run
37058774238 on 0e475b1, Chromium/Firefox passed while WebKit timed out during
native folder import. The unchanged folder-import check passes in all three
local engines at this panel checkpoint; no assertions were removed or relaxed.

[Run 37062329171](https://github.com/robinfrancis186/rofin-ui/actions/runs/37062329171)
on `3674053` passes all 129 tests and package validation in Chromium and Firefox.
WebKit passes 128 tests but exposes a note-save failure in the new scrollable
desk. An unchanged-value Markdown blur repainted the preview during the Save
click. The shared editor now skips that redundant repaint; tracked input and
changed-value/reset renewal remain intact. The existing save/switch/discard flow
failed five times before this guard and passed five times after it locally in
WebKit. Save confirmations are now asserted before switching workspaces.

The repeated local rich-text history check separately found that WebKit groups
the test's contenteditable fill and first formatting action into one undo step.
It now loads a document through the existing source-change path before checking
formatting history. The same Bold/Undo/Redo and exact form-value assertions pass
five consecutive WebKit runs; the rich-text implementation is unchanged.

After the shared blur fix, the full 129-test local Chromium suite and 252-file
package check pass. With the final document-loading setup and save-confirmation
assertions, all eight editor checks pass in Chromium and Firefox; all 27 combined
editor/panel/workspace/file checks pass in macOS WebKit. The preceding 27-check
Firefox run also passes. A sequential test-runner restart timed out before tests
started; an explicitly owned, HTTP-200 localhost server was used for the final
Firefox/WebKit runs. No behavior assertion, timeout or browser case was relaxed.

[Run 37095247524](https://github.com/robinfrancis186/rofin-ui/actions/runs/37095247524)
on `17e763a` then passed all 129 tests and the 252-file package check in Chromium,
Firefox and WebKit, plus the separate native-media and narrow-recovery checks.
All three completed logs were inspected. Its Ready production deployment matches
all 254 static files. Public Save/Discard and workspace isolation pass at desktop,
390-pixel Save and 320-pixel dark Discard, with installed Safari's actual public
Save/switch/return/Discard flow also passing.

## Error pages and read recovery

Four original `sections/error-*.html` examples compose the existing empty-state,
button and layout components. The documentation uses the shared 404 section for
unknown routes instead of silently displaying its homepage. The static build
emits `404.html`, `403.html`, `offline.html` and `500.html`. The local server keeps
real status codes and HEAD behavior, distinguishes missing/denied/unexpected
filesystem failures, and preserves the existing missing-upload endpoint contract.

The composed `examples/recovery.html` uses native templates generated from those
same sections. It reads an actual JSON asset, hides stale content, validates
bounded text and exact progress values, and keeps an unsent native note in place.
Retry performs only a GET. Cancellation, selection changes, pagehide and the
real eight-second timeout abort requests; late completion cannot update a newer
view. The error/result heading gets focus after explicit reads while an active
note retains focus. No documentation-data import, runtime dependency, automatic
reconnection retry, note submission or service worker is required.

All eight focused recovery checks pass locally in Chromium, Firefox and macOS
WebKit. They cover actual missing resources, explicit read-only 403/500 localhost
fixtures, genuine filesystem-denial/server-failure responses, offline browser
requests and manual reconnection retry, validated text rendering, exact values,
cancellation, late results, timeout, lifecycle cleanup, native links and scripts-off
fallbacks. Both themes fit 320/390/1440 pixels and exposed recovery states pass
automated WCAG checks. A shared native-select overflow fix clips long selected
labels without losing their full native option/accessibility text; error pages
use a distinct class from inline field errors.

In [run 37053942455](https://github.com/robinfrancis186/rofin-ui/actions/runs/37053942455)
on `9930af9`, Chromium and Firefox pass all 122 tests and the 252-file package
check. The initial WebKit runner was cancelled during slow Ubuntu dependency
downloads. Its fresh runner passes 121 tests and finds a 320-pixel permission
state overflow. A focused diagnostic in run 37056543885 locates the excess
width in the native selected value: the resource field is 214 pixels wide but
its overflow spans 304 pixels. A bounded grid track does not change that result.
The shared single-select uses CSS appearance and a directional chevron while
retaining its native chooser and complete option labels; multi-row lists keep
their platform appearance. Forced-colors styling uses system colors. CI checks
narrow recovery before the full suite and reports element dimensions when its
unchanged no-overflow assertion fails.

[Run 37057531098](https://github.com/robinfrancis186/rofin-ui/actions/runs/37057531098)
on `512d589` passes native media, narrow recovery, all 122 tests and the 252-file
package check in Chromium, Firefox and WebKit. All three completed job logs
were inspected. No overflow, decoder, timeout or transport assertion is skipped.
Core gzip is 8,408 bytes on Linux and 8,424 locally on macOS.

The initial full local Chromium checkpoint (`9930af9`) passes all 122 tests and
the 252-file package check. After the select fix, all eight focused checks pass
again in Chromium, Firefox and macOS WebKit, including narrow right-to-left and
forced-colors emulation.
The package contains the native templates and original snapshot asset; it still
has zero runtime/peer dependencies. Core CSS plus auto JavaScript remains about
8.2 KiB gzip, below the enforced 14 KiB budget.

Installed Safari also passed the styled select's native chooser/keyboard,
permission read/retry, failed-read/retry, focus,
exact snapshot and draft-preservation smoke checks. Its owned test tab was closed
and its original Start Page restored. This is partial Safari evidence, not a full
Safari, screen-reader or physical-touch run. The browser-connection test is an
already-loaded page; first-visit offline still needs application caching.
Permission fixtures do not create accounts; server authorization, durable notes
and production services remain outstanding.

The production deployment of `512d589` is Ready at
[rofin-ui.vercel.app](https://rofin-ui.vercel.app). All 254 built website files
match, including the recovery templates and original snapshot. A genuine missing
static URL returns the custom HTTP 404; its HEAD response has no body. Snapshot
bytes and JSON content type are correct.

Rendered production checks cover actual missing-resource reads and retry,
returning to the exact 72/100 snapshot, retained unsent notes, unknown component
navigation to the 132-entry gallery and the native error-page dashboard link.
The recovery page fits 320 and 390 pixels in both themes; production permission/server
fixtures remain disabled. The proof image is
`output/playwright/production-recovery-2026-10-03.png`.

## Image, document and media viewers

Eight focused viewer checks pass in Chromium, Firefox and macOS WebKit. Native
lightbox controls cover arrow/Home/End bounds, modal focus and Escape, disabled
roots, missing images, rejected URLs and immediate close/reopen cleanup. The
local-file viewer decodes an actual valid PNG, renders Unicode text safely,
previews a PDF and downloads exact original bytes. Unsupported types, malformed
PDF headers, invalid names and size limits preserve the prior preview. Cancelled
reads and teardown cannot reopen the viewer; owned blob URLs are revoked.
Unreadable image bytes show an error while retaining their download.

Native video/audio checks verify actual decoding and advancing playback time,
seeking, caption cues, exclusive playback, completed exact-byte downloads and
cleanup/reinitialization. The development server serves correct media types,
HEAD and single byte ranges, and rejects invalid ranges. Original local SVGs,
two-page PDF, three-second MP4/WebM and WAV samples require no remote service.
Both PDF pages were rendered and visually inspected; extracted text matches
the complete HTML alternative. Asset-generation tools are development-only.

The dashboard uses the same viewers for actual selected File objects after
import and rename. Workspace switching closes previews, pauses media and clears
selection while keeping each workspace's browser files separate. Both themes
fit 320/390/1440 pixels, opened viewers pass automated WCAG checks, reduced-motion
flows report no page errors and native scripts-off links/downloads remain usable.

A separate native in-app check verified image navigation, Escape/focus and both
themes at 390 pixels, and played both original media clips through actual native
controls to completion. Its native file chooser opened the PDF preview dialog,
but the embedded PDF area remained blank. PDF display is browser-dependent;
download and complete sample HTML text alternatives remain available. Local user
media needs application-supplied captions/transcripts. This does not prove full
native Safari, actual screen-reader or physical touch behavior (V01–V03).

Installed Safari separately opened the production PDF through its native reader.
Both PDF Page elements expose the actual brief text; the first rendered page was
visually inspected inside the document example. The temporary test tab was closed
and the original Start Page retained. This is a document smoke check, not the
complete native Safari validation required by V01.

The shared dialog visibility guard keeps closed dialogs hidden when the stack
layout utility sets display:flex. File-browser mutations now emit the updated
selection, so dashboard previews immediately use imported/renamed File objects.
Core CSS plus auto JavaScript is 8,167 bytes gzip locally; optional viewer
JavaScript and CSS add 3,058 and 598 bytes gzip outside that core. There are zero
runtime or peer dependencies. The full 114-test Chromium suite and 245-file
package check pass.

The production deployment of `592d948` is Ready at https://rofin-ui.vercel.app.
All 243 built website files match. Original PDF, MP4/WebM, WAV and VTT assets
have correct content types, exact bytes and verified 206 byte-range responses.
Rendered production checks cover actual image loads, Previous/Next/Home/Escape,
both gallery themes at 390 pixels, the complete document text alternative and
native video playback to its real three-second end. Native audio playback starts
through its actual browser control.

A native production chooser imports a disposable text fixture into the dashboard;
its preview shows actual contents before and after rename. Switching to Personal
clears selection and previews only its reading-list sample; returning to Studio
retains the renamed file. Both dashboard themes fit 390 pixels, reload restores
samples/clears selection, and checked flows report no console errors.

In [run 37046659810](https://github.com/robinfrancis186/rofin-ui/actions/runs/37046659810)
Chromium passes all 114 tests and the 245-file package check. Firefox and WebKit
each pass 113 tests; the remaining native media check found a stalled audio clock
and unloaded captions respectively. The test now explicitly enables the native
caption track, consistent with [TextTrack mode](https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/mode).
Linux CI now provides a [clocked PulseAudio null sink](https://wiki.freedesktop.org/www/Software/PulseAudio/Documentation/User/Modules/#module-null-sink)
and checks native media before the full suite. The updated playback test passes
locally in all three engines. [Run 37048046059](https://github.com/robinfrancis186/rofin-ui/actions/runs/37048046059)
on `b50e8d1` passes the media check, all 114 tests and the 245-file package check
in Chromium, Firefox and WebKit. All three completed job logs were inspected.
No decoder, timing or download assertion is skipped, and CI does not prove
audible speakers. Core gzip is 8,154 bytes on Linux and 8,167 locally on macOS.

## File browser and workspace files — previous checkpoint

Eight focused checks pass in Chromium, Firefox and macOS WebKit. The full
Chromium suite passes all 104 tests and the 227-file package check. These cover
single-select arrow/Home/End/typeahead navigation, visible folder expansion,
selection/path search, composition, read-only and disabled controls. Actual
directory imports preserve nested paths; enumeration order varies by browser,
so the check finds a nested file through path search before downloading it.

GitHub run [37040753111](https://github.com/robinfrancis186/rofin-ui/actions/runs/37040753111)
passes all 104 tests and the 227-file package check in each of Chromium,
Firefox and WebKit on `e7ea380`. All three completed job logs were inspected.

Imported binary bytes survive rename, moves, exact-byte downloads, recursive
recoverable Trash and restoration. Created text files preserve Unicode contents.
Duplicate names, traversal/control names, oversize files, excess items/bytes,
cycles, missing parents and excessive depth leave existing files intact. Callback
failure retains the dialog draft; Cancel, Escape, import cancellation and teardown
abort pending callbacks and ignore late completion. Copied callback entries cannot
change the committed metadata. Download object URLs are revoked on teardown.

The dashboard composes the same component markup and keeps separate File objects
and recoverable Trash for each public workspace. Switching clears selection;
returning restores the correct files, and reload restores samples. Original
disk files stay intact. Both themes fit 320/390/1440 pixels, long names wrap,
tree rows have 44-pixel targets, native dialogs pass automated WCAG checks, and
reduced-motion checks report no page errors. Scripts-off folders and sample
downloads remain usable through native details and links.

A separate rendered native in-app check covered keyboard navigation, folder and
Unicode text-file creation, and a real native chooser import of a disposable
28-byte fixture, followed by rename, move, recoverable Trash and restore at
390 pixels in the dark theme. The browser displayed a download request; the automation did
not return a download artifact, so exact-content evidence comes from completed
Chromium, Firefox and WebKit downloads above. This bounded browser-copy store
does not supply authorized durable storage, operating-system writes, physical
device or screen-reader evidence. Those requirements remain A02/A03/V02/V03.

The production deployment of `e7ea380` is Ready at https://rofin-ui.vercel.app.
All 226 built website files match; the package contains 227 files. Rendered
production checks cover tree keyboard expansion, Unicode text-file creation,
rename, move, recoverable Trash and restore. Both gallery themes fit 390 pixels.
The composed dashboard retains a created Studio file when switching back from
Personal, exposes only Personal's sample file in that workspace, and clears
selection on switching. The Files & resources link and breadcrumb agree.
Both dashboard themes fit 390 pixels; reload restores the original samples,
and the checked production flows report no console errors.

## Rich-text and Markdown notes

Eight focused checks pass in Chromium, Firefox and macOS WebKit. They cover formatting, real named form values, native undo/redo,
validated links and safe rich paste/drop. Markdown preview renders text and
allowlisted elements, including pipe tables and task markers, without loading
image syntax or executing raw HTML. Checks reject active rich markup, foreign
namespaces, credential URLs and oversized inputs; failed renders retain drafts
and the prior preview. Required rich validation focuses the visible editor.
Composition, disabled/read-only fields, native and cancelled reset, programmatic
changes, cleanup, scripts-off fields and workspace note separation are covered.
The dashboard saves through FormData, including after reset has replaced the
Markdown textarea to discard stale undo commands. Scope, reset and syntax limits
are documented; native editing uses deprecated execCommand and Markdown is an
explicit subset rather than a CommonMark/GFM implementation.

The full Chromium suite at the editor checkpoint passes all 96 tests and the 220-file package
check. Core CSS plus auto JavaScript remains 8,161 bytes gzip; optional editors
add 5,381 bytes of JavaScript and 497 bytes of CSS gzip. Both themes fit
320/390/1440 pixels, opened link dialogs pass WCAG-tagged checks, and reduced
motion logs no errors. A real formatted paste in the native in-app browser
preserved emphasis and removed unsafe links, image markup and event attributes.
GitHub run [37035093869](https://github.com/robinfrancis186/rofin-ui/actions/runs/37035093869)
passed all 96 tests and the 220-file package check in each of Chromium, Firefox
and WebKit on `d26f52c`. All three completed job logs were inspected. Core gzip
size is 8,145 bytes on Linux and 8,161 locally on macOS.

Production's 124-example build matches all 220 built files; size-report
comparisons use uncompressed byte counts because gzip differs by platform.
Rendered checks verified Markdown preview, rejection of an unsafe link followed
by successful insertion of a safe link, reset, rich required-field focus,
formatting and link insertion into the actual HTML form value. Dashboard notes
save after reset, remain separate between Studio and Personal, and return when
switching back. Reload restores the public samples. Both themes fit 390 pixels
and the checked production flows reported no console errors. Durable notes,
actual screen readers, physical touch and full installed Safari interaction
remain outstanding requirements.

## Team management and invitations

Seven focused checks pass in Chromium, Firefox and macOS WebKit. The full
88-test Chromium suite at the team checkpoint passes, including every gallery preview in both themes.
Package validation passes with 212 files and zero runtime/peer dependencies.
Core CSS plus auto JavaScript remains 8,161 bytes gzip. The optional team module
and styles add 4,784 and 315 bytes gzip respectively outside the core.

Checks cover invitation creation/edit/revoke, case-insensitive duplicate emails,
confirmation/Escape/focus, native and cancelled reset, safe display-name
rendering, failed callbacks, late completion after teardown, retained role
choices, and last-owner controls. Team state stays isolated between the three
dashboard workspaces; removing a sample member updates avatars and menu counts,
and reload restores the public samples. Tables, invitation errors and exposed
confirmations pass automated WCAG checks in both themes at 320/390 pixels.

The private localhost service receives real HTTP requests. It issues random
access tokens bound to current membership and workspace, checks revisions and
roles on every mutation, rejects direct privilege forgery and cross-workspace
access, rotates/revokes invitation tokens, and consumes each accepted link once.
Overlapping requests cannot demote both owners or accept one invitation twice.
Acceptance uses the latest invitation role; removed memberships lose their access
tokens. Malformed and oversized bodies and foreign origins are rejected.
Expired invitation policy and out-of-range timestamps are checked explicitly.

A rendered local check created and accepted an invitation, confirmed Viewer
controls with invitation creation disabled, and refreshed the owner's team to
four members with no pending invitation. These are isolated temporary sandboxes:
links grant access to their holder, not a verified email identity. State expires
after 15 minutes or server stop. No email or durable account is created; A01,
A02 and A04 remain outstanding. Static production exposes page-session examples
and keeps the local service option hidden.

The final team/navigation implementation at `6a29c10` passed all 88 tests and
212-file package validation in Chromium, Firefox and WebKit in GitHub run
[37026273759](https://github.com/robinfrancis186/rofin-ui/actions/runs/37026273759).
All three completed job logs were inspected. The preceding component run
37025793040 also passed the full suite in all three engines. Documentation-only
follow-ups record these immutable checks and the snapshot limits; they do not
replace native Safari, screen-reader or device evidence.

Production's 122-example build at `6a29c10` matches all 213 built files. Rendered
checks covered invitation creation/revocation, role confirmation with returned
focus, the hidden localhost option, both themes within 390 pixels, and no
console errors. Reload restored the sample role and cleared QA invitations.
The dashboard Team & activity link reaches the same team-management component.
The branch ZIP returns HTTP 200 and includes all 122 examples and optional team
module/types. Production has page-session examples and no invitation endpoint.

## Workspace and account menus

Six focused checks pass in installed Google Chrome, Firefox and macOS WebKit.
They verify labelled menu typeahead, disabled-entry skipping, Escape/focus
restoration, actual dashboard navigation, profile deep links, Back/Forward,
workspace project/board/inbox/preferences isolation and session-edit retention.
Changing workspace clears selections, filters, file previews and unfinished
forms. Account links retain the active workspace and edits; reload restores the
public samples. Invalid sample IDs fall back explicitly to Studio.

Both menus pass automated WCAG checks in light/dark themes at 390 and 320
pixels, including long labels, RTL and reduced motion. A long-name layout bug
was fixed in the shared application shell. Initial fragment navigation no
longer takes focus out of the account drawer. Gallery links resolve to the
actual dashboard in both source and built documentation. With scripts disabled,
native menus still navigate and an explicit notice identifies the static
Studio fallback; dynamic context and account panels require the application
script. Sign out remains disabled because the public sample has no account
session.

The existing dashboard, workspace and core interaction checks also pass in
Chromium and macOS WebKit; the final full CI suite verifies all three engines.
A rendered local
390-pixel check confirmed the menu, current Lab context and profile focus.
The shared dropdown matches accessible labels before decorative text. Core
CSS plus auto JavaScript is now 8,161 bytes gzip, within its 14 KiB ceiling.
Package validation passes with 201 files and zero runtime/peer dependencies.
The branch download returns HTTP 200 and contains all 119 entries plus the new
workspace/account examples and styles.

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

GitHub run [37020029117](https://github.com/robinfrancis186/rofin-ui/actions/runs/37020029117)
passed all 81 tests and 201-file package validation in each engine on commit
`abf2b3d`. This verifies the full 119-example workspace/account checkpoint;
each terminal job and its completed log were inspected. The core is 8,145
bytes gzip on Linux and 8,161 locally on macOS, below the enforced budget.

## Preview forms without scripts

A new regression check reproduced a sample sign-in form placing its values in
the URL when JavaScript was unavailable. All 31 preview forms at that checkpoint used
native `method="dialog"`, which preserves validation without transmitting
values. The check passes in all three engines for sign-in, password reveal,
autocomplete and the scheduler, with unchanged URLs and no navigation requests.
JavaScript submit handlers continue to supply the interactive local previews.
The upload checkpoint followed the same contract, bringing its total to 32.

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

The 119-example workspace checkpoint passed content checks for all 203 built
files. Rendered production checks followed the gallery link to Personal,
created a local QA project, switched to Studio and back, and confirmed separate
rows and retained edits. Account navigation kept those edits and the profile
drawer focused Display name. Both themes remained within 390 pixels, and no
console errors were reported. Reload cleared the QA project. These are public
session examples; they do not provide authenticated or durable workspaces.

`.vercelignore` excludes local test traces, test files, dependency/build output
and environment files from CLI uploads. The corrected deployment uploaded
238.7 KB of changed source, rather than the first deployment's local traces.

## Outstanding verification

Full installed Safari validation, actual screen-reader interaction and physical touch-device checks remain
pending. Axe and touch emulation do not substitute for those device checks.
No npm publication, email delivery, payment webhook or
durable application-service behavior has been verified at this checkpoint.
