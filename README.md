# Rofin UI

**Beautiful components. Minimal footprint.**

Rofin UI is an experimental component library by Robin Francis built around
plain HTML, CSS, and optional vanilla JavaScript. Its goal is zero runtime
dependencies and loading only the components a page uses.

## Current status

This initial scaffold contains design tokens, button and card styles, and a
local HTML example. It is not a complete component library. Browser and
assistive-technology validation, performance measurements, and a broader
component catalog are planned.

The intended npm package name is `rofin-ui`. It has **not been published or
reserved** on npm. No domain has been registered.

## Try it locally

Open `examples/index.html` in a browser. No installation or build step is needed.

Include all current styles:

```html
<link rel="stylesheet" href="./src/rofin.css">
<button class="rf-button" type="button">Continue</button>
```

Or include only tokens and the component you need:

```html
<link rel="stylesheet" href="./src/tokens.css">
<link rel="stylesheet" href="./src/button.css">
```

Customize the `--rf-*` CSS variables to change colors, spacing, and typography.
The initial styles use prefixed classes to limit conflicts with existing apps.

## Direction

- Prefer native HTML controls and progressive enhancement.
- Keep individual components usable without a framework or build step.
- Make keyboard behavior, responsive layouts, and accessibility part of the work.
- Offer optional effects that respect reduced-motion preferences.
- Publish measured sizes and performance results rather than promise automatic speed.
- Grow into reusable marketing sections and application components.

Inspired by Oat's minimal approach. This scaffold contains original code;
it does not include Oat, Aura, or Aceternity source code.

## License

MIT — Robin Francis.
