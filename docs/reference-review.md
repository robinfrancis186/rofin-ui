# Rofin UI source review — 2 October 2026

The linked catalogs and all nine libraries in the supplied screenshot were
visited. Their available catalog metadata was collected into
`reference-catalog.json`, and recurring patterns were implemented as original
HTML, CSS, and vanilla JavaScript examples. The current gallery has 132 runnable
entries: 85 components, 20 effects, and 27 sections.

This is a first implementation pass, not an exhaustive visual review or a
one-to-one port of every source component. The reference browser distinguishes
catalog metadata from implementations. “Related” is a navigation suggestion;
it does not assert visual, interaction, or API equivalence.

## Source coverage

| Library | Collected entries | Patterns brought into Rofin | Coverage |
| --- | ---: | --- | --- |
| [Aura](https://www.aura.build/components?componentType=free) | 1,034 | Gradient CTA treatments, glass surfaces, team/article/newsletter layouts, hero and pricing foundations | Free gallery and its popular previews viewed. It reports 2,495 free entries. The additional search-index URLs mix access tiers and include missing titles; individual free-component coverage remains partial. |
| [Aceternity](https://ui.aceternity.com/components) | 112 | Compare, carousel, expandable cards, dock, tilt, glare, aurora, beam, highlight, timeline | Catalog reviewed; Compare documentation sampled. Complex shaders, 3D scenes, and exact scroll choreography remain reference-only. |
| [Bencho](https://bencho.dev) | 47 | Comparison, likes, stepper, checklist, image accordion, command search, marquee | Available block links collected. The site advertises 48 blocks; one entry was not exposed as a block link in the snapshot. |
| [Obsidian UI](https://www.obsidianui.dev/components) | 7 | A pausable rail, gallery/carousel and split-layout foundations | All seven public documentation pages read. Source tiers/licenses and vendor interactions remain unverified. The original WebGL panning gallery and text effects are not implemented. |
| [Libraries.dev](https://libraries.dev) | 7 | Border beam and native loading/avatar alternatives | All seven public documentation pages read; their versioned public npm artifacts and packaged MIT licenses inspected. Vendor interactions and implementation source remain unreviewed. Gooey, voice-reactive, and liquid-metal rendering remain reference-only. |
| [Arc](https://uiarc.dev/components) | 141 | Command palette, native selections, stepper, copy feedback, form flows, line chart | Line Chart documentation read; public machine-readable component/block index collected. No Pro source imported. Related native patterns omit Arc's exact spring physics. |
| [Space UI](https://www.spaceui.one/components) | 101 | Interests, rating, like, checklist, date, timeline, login, gradient borders, sortable list, task board, adjustable panels | Kanban, Sortable, and Resizable documentation read. Catalog links collected. Nested/grid sorting, exact drag/physics behavior, tournaments, and shaders remain reference-only. |
| [Componentry](https://componentry.dev/docs) | 53 | Dock, card stack, annotated text, text entrance, gradient and aurora families | Full exposed component-link index collected. WebGL, particle typography, signatures, and physics are not ported. |
| [Skecher UI](https://skecher-ui.com/docs) | 26 | Dock, carousel, native tabs/forms, card and text foundations | Documentation catalog and Dock page read. Gooey morphs, wheel physics, and shader variants remain reference-only. |
| [Planes](https://useplanes.com/components) | 110 | Segments, stepper, date, command, OTP, carousel, marquee, email capture | Public catalog collected. It distinguishes 10 free and 100 Pro entries. Common patterns were written independently; no paid source imported. |
| [Skiper UI](https://skiper-ui.com/components) | 106 | Native inputs, selections, card rails, reusable motion/card families | Public catalog names and numeric component URLs collected. Exact shader/physics variants and individual demos remain unreviewed. |

## Additional documentation samples

[Space Kanban](https://www.spaceui.one/components/kanban),
[Sortable](https://www.spaceui.one/components/sortable), and
[Resizable](https://www.spaceui.one/components/resizable), plus
[Arc Line Chart](https://uiarc.dev/components/line-chart), were read in this pass.
Their documentation highlights column movement, order commits, workspace sizing,
and accessible chart exploration. Rofin supplies original small HTML/vanilla
patterns with native move buttons, selects, and sliders. These samples were
read as documentation; their vendor demos were not manually interaction-tested.
Rofin's panel component now has pointer/keyboard dividers, nested splits and
optional browser-local layout preferences, composed in the dashboard. Nested
sorting, reorderable columns and exact vendor animation behavior remain unimplemented;
the panel additions do not establish vendor-demo parity.

## How to use the additions

Use `src/rofin.css` for the existing core. Add `src/patterns.css` and initialize
`src/js/patterns.js` when using interactive patterns. Effects remain in
`src/effects.css` and `src/js/effects.js`; sections remain in `src/sections.css`.
Each gallery entry includes copyable HTML, setup, source paths, and limitations.

The optional modules introduce no runtime dependencies, remote fonts,
telemetry, or automatic API calls. The core continues to have its enforced
14 KiB combined gzip ceiling. Size reports are generated by the local build.

## Remaining work

Individual source-detail review and access-tier verification remain pending
for most indexed entries, especially Aura. Exact shader, canvas, physics,
streaming, media-recording, advanced drag-reordering, and complex scroll components
need their own implementation and testing. Reference-only entries are not
advertised as finished Rofin components.

Chrome and Firefox suites pass. Installed Safari has manual smoke checks;
WebKit, physical touch hardware and screen readers have separate evidence
requirements recorded in `validation.md`. Sample authentication, subscription,
integration, and verification forms have no backend behavior.

## Further detail review

Public documentation for [V Prism](https://www.obsidianui.dev/docs/v-prism),
[Text reel](https://www.obsidianui.dev/docs/text-stream), and
[Flip Text](https://www.obsidianui.dev/docs/flip-text),
[Draggable Marquee](https://www.obsidianui.dev/docs/draggable-marquee),
[Split Showcase](https://www.obsidianui.dev/docs/split-showcase),
[Art Gallery](https://www.obsidianui.dev/docs/art-gallery), and
[Hover Img](https://www.obsidianui.dev/docs/hover-img) was read on 2 October.
The pages describe prism lighting, text momentum, character rotation,
draggable rails, expanding partner cards, a WebGL gallery and pointer-following
images. Their source tiers/licenses and vendor demo interactions were not
verified. These visual families remain unimplemented; the per-URL findings
are in `reference-detail-review.json`.

The seven [Libraries.dev](https://libraries.dev) documentation pages were also
read. Their public npm packages were downloaded without installation scripts;
each package contained an MIT `LICENSE` file. The checked versions and links
are recorded per URL. Pro Studio access was not evaluated. No vendor code was
included in Rofin. Animated orb states, canvas avatars, voice-reactive glow,
liquid merging, metal and image shaders remain implementation gaps.

[Aceternity Image Generation Loader](https://ui.aceternity.com/components/image-generation-loader)
documentation describes pixel scans, wave/shimmer variants and progress
overlays; an original implementation is pending. A targeted
[Bencho Asset swap](https://bencho.dev/blocks/asset-swap) fetch returned preview
text and metadata describing coin choice and reversed direction. That fetch
does not prove vendor interaction or actual conversion. Bulk collection was
rate-limited; most individual source reviews remain pending.
