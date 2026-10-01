# Contributing

Rofin UI favors native HTML, small independent modules, and readable examples.

## Local development

```sh
npm ci
npm run build
npm run dev
```

Open http://127.0.0.1:4173. Development tooling is separate from the library's
runtime; the published package has no runtime dependencies.

## Before submitting

```sh
npx playwright install chromium
npm run check
```

If Chromium is already installed, set `RF_CHROMIUM_PATH` to its executable path.
The suite tests actual browser behavior, keyboard controls, dynamic component
lifecycle, responsive layouts, and automated accessibility checks.

For a new component:

- Prefer a native control before adding JavaScript.
- Keep CSS in its own `src/*.css` file and behavior in `src/js/`.
- Prefix classes with `rf-`, attributes with `data-rf-`, and events with `rf:`.
- Add a labelled, usable example and notes to `docs/catalog.json`.
- Rebuild `docs/catalog.js` and `docs/sizes.json` using `npm run build`.
- Add behavioral tests when the interaction introduces meaningful new behavior.
- Check light/dark themes, narrow screens, keyboard use, and reduced motion.
- Preserve the 14 KiB combined gzip budget for core CSS + auto JavaScript.

Do not introduce runtime dependencies, remote fonts, telemetry, or automatic
network calls in library components. Optional effects stay outside the core.
Describe accessibility or cross-browser limits honestly.

`dist/site` is the static documentation artifact. Building it does not deploy it
or register a domain.
