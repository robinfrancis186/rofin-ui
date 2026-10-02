import catalog from './catalog.js';
import references from './references.js';
import { init, toast } from '../src/js/index.js';
import { initEffects } from '../src/js/effects.js';
import { initPatterns } from '../src/js/patterns.js';
import { initFormPatterns } from '../src/js/form-patterns.js';
import { initGridExamples } from '../examples/grid-demo.js';
import { initUploadExamples } from '../examples/upload-demo.js';

const main = document.querySelector('#main');
const search = document.querySelector('#docs-search');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const counts = Object.fromEntries(['Components', 'Effects', 'Sections'].map(category => [category, catalog.filter(item => item.category === category).length]));
let filter = 'All';
let libraryFilter = 'All';
let stopEffects = () => {};
let stopPatterns = () => {};
let stopForms = () => {};
let stopGrids = () => {};
let stopUploads = () => {};
let sizeReport;
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem('rofin-saved') || '[]');
  if (Array.isArray(stored)) saved = new Set(stored.filter(id => catalog.some(item => item.id === id)));
} catch {}
init();

function footer() {
  return `<footer class="rf-footer docs-footer"><span>Built with <a href="#catalog">Rofin UI components</a> by <a href="https://github.com/robinfrancis186">Robin Francis</a>.</span><span>Open source. MIT licensed. Yours to make your own.</span></footer>`;
}
function navigation() {
  const current = location.hash || '#home';
  let html = '<p class="nav-label">Start here</p>';
  for (const [id, title] of [['home', 'Introduction'], ['catalog', 'All components'], ['coverage', 'Website & dashboard checklist'], ['saved', `Saved collection · ${saved.size}`], ['start', 'Installation'], ['theming', 'Make it yours'], ['api', 'JavaScript API'], ['principles', 'Principles & support'], ['references', 'Reference library']]) {
    html += `<a class="docs-link" href="#${id}" ${current === `#${id}` ? 'aria-current="page"' : ''}>${title}</a>`;
  }
  for (const category of ['Components', 'Effects', 'Sections']) {
    html += `<p class="nav-label">${category} <span class="rf-muted">/ ${counts[category]}</span></p>`;
    for (const item of catalog.filter(item => item.category === category)) {
      html += `<a class="docs-link" href="#component/${item.id}" ${current === `#component/${item.id}` ? 'aria-current="page"' : ''}>${item.title}${item.js.length ? '<span class="rf-badge nav-tag">JS</span>' : ''}</a>`;
    }
  }
  document.querySelector('#sidebar-nav').innerHTML = html;
  document.querySelector('#mobile-nav').innerHTML = html;
}
function art(item) {
  if (['app-shell', 'website-header'].includes(item.id)) return '<div class="art-bento"><span></span><span></span><span></span><span></span></div>';
  if (item.id === 'kanban') return '<div class="rf-card art-command"><span>Draft　　In progress　　Published</span><small>Ideas　　　 Prototype　　 Website</small><small>Move good ideas forward →</small></div>';
  if (item.id === 'sortable-list') return '<div class="rf-card art-command"><span>↑ Give the idea a shape.</span><span>↓ Make something tangible.</span><small>What matters first?</small></div>';
  if (item.id === 'line-chart') return '<svg viewBox="0 0 240 120" aria-hidden="true" style="width:80%;max-width:15rem"><path d="M10 95 54 65 98 80 142 40 186 50 230 15" fill="none" stroke="var(--rf-primary)" stroke-width="4"/><path d="M10 90 230 35" fill="none" stroke="var(--rf-muted)" stroke-width="2" stroke-dasharray="6 5"/></svg>';
  if (item.id === 'resizable-panels') return '<div class="art-bento"><span></span><span></span><span></span><span></span></div>';
  if (item.id === 'dashboard-metrics') return '<div class="art-price"><span>Monthly revenue</span><strong>$12,480</strong><small>↑ 12% vs. last month</small></div>';
  if (item.id === 'bar-chart') return '<div class="art-bars"><i></i><i></i><i></i><i></i><i></i><i></i></div>';
  if (item.id === 'notification-center') return '<div class="rf-card art-command"><span>Your inbox · 2 unread</span><small>Ready for your review</small><small>A milestone worth sharing</small></div>';
  if (['data-grid', 'paginated-table', 'bulk-actions'].includes(item.id)) return '<div class="rf-card art-command"><span>Project　　　 Tasks ↕</span><small>□ Studio website　 12</small><small>□ Mobile journal　 3</small><small>Find a view that fits　　 →</small></div>';
  if (item.id === 'tag-input') return '<div class="art-tags"><span class="rf-badge">Design ×</span><span class="rf-badge">Ideas ×</span><span class="rf-badge" data-variant="success">Your next thing +</span></div>';
  if (item.id === 'password-field') return '<div class="art-field"><span>A little less friction.</span><div class="rf-input">••••••••　 Show</div></div>';
  if (item.id === 'character-counter') return '<div class="rf-card art-command"><span>I make things<br>that make a difference.</span><small>36 / 160 characters</small></div>';
  if (item.id === 'launch-checklist') return '<div class="rf-card art-command"><span>✓ Give it a name</span><span>✓ Make it real</span><small>○ Share your next chapter</small></div>';
  if (item.id === 'billing-switch') return '<div class="art-price"><span class="rf-badge">Yearly · save 20%</span><strong>$20<small> / month</small></strong></div>';
  if (item.id === 'data-table') return '<div class="rf-card art-command"><span>Project　　　 Tasks ↕</span><small>Studio website　 12</small><small>Mobile journal　 3</small></div>';
  if (item.id === 'image-compare') return '<div class="art-compare"><span>Before</span><span>After</span></div>';
  if (['aurora', 'mesh-background', 'lamp', 'grid-background', 'stars'].includes(item.id)) return `<div class="art-atmosphere rf-${item.id}"><span>Make room<br>for possibility.</span></div>`;
  if (['border-beam', 'gradient-border', 'glass-card', 'tilt-card', 'glare-card', 'card-stack', 'expandable-card'].includes(item.id)) return `<div class="rf-card art-lines ${item.id === 'border-beam' ? 'rf-border-beam' : 'rf-gradient-border'}"><span></span><span></span><span></span></div>`;
  if (['carousel', 'image-accordion', 'focus-cards', 'blog-grid', 'team'].includes(item.id)) return '<div class="art-rail"><span>01</span><span>02</span><span>03</span></div>';
  if (item.id === 'command-palette') return '<div class="rf-card art-command"><span>⌕ What’s next?</span><small>Create project ↗</small><small>Open settings ↗</small></div>';
  if (item.id === 'button' || item.id === 'shimmer') return '<span class="rf-button rf-button--small art-button">Get started →</span>';
  if (['switch', 'checkbox', 'radio'].includes(item.id)) return '<span class="rf-badge" data-variant="success">✓ All set</span>';
  if (item.id === 'badge') return '<span class="rf-badge" data-variant="success">● Published</span>';
  if (item.id === 'avatar') return '<span class="rf-avatar" aria-hidden="true">RF</span>';
  if (['tabs', 'navigation', 'pagination'].includes(item.id)) return '<div class="art-tabs"><span>Overview</span><span>Activity</span><span>Settings</span></div>';
  if (['input', 'select', 'textarea', 'contact', 'upload'].includes(item.id)) return '<div class="art-field"><span>Your next idea</span><div class="rf-input">Something wonderful…</div></div>';
  if (['bento', 'features', 'layout', 'pricing', 'stats'].includes(item.id)) return '<div class="art-bento"><span></span><span></span><span></span><span></span></div>';
  if (['gradient-text', 'hero', 'cta', 'testimonials', 'dot-grid', 'spotlight'].includes(item.id)) return '<div class="art-quote">Make something<br>worth opening.</div>';
  return '<div class="rf-card art-lines"><span></span><span></span><span></span></div>';
}
function saveButton(item, compact = false) {
  return `<button class="rf-button rf-button--outline rf-button--small ${compact ? 'rf-button--icon catalog-save' : ''}" type="button" data-save="${item.id}" aria-pressed="${saved.has(item.id)}" aria-label="Save ${escape(item.title)}" title="Save ${escape(item.title)}"><span aria-hidden="true">${saved.has(item.id) ? '★' : '☆'}</span>${compact ? '' : 'Save to collection'}</button>`;
}
function cards(items) {
  return `<div class="rf-grid catalog-grid">${items.map(item => `<div class="catalog-item"><a class="rf-card rf-card--interactive catalog-card" href="#component/${item.id}"><div class="catalog-art" aria-hidden="true">${art(item)}</div><div class="catalog-copy"><div class="catalog-title"><h3>${item.title}</h3><span>${item.js.length ? 'JS' : 'CSS'}</span></div><p>${item.description}</p></div></a>${saveButton(item, true)}</div>`).join('')}</div>`;
}
function collection() {
  const items = catalog.filter(item => saved.has(item.id));
  const query = search.value.trim().toLocaleLowerCase();
  const matches = items.filter(item => `${item.title} ${item.description}`.toLocaleLowerCase().includes(query));
  document.querySelector('#search-status').textContent = `${matches.length} saved components shown`;
  return `<div class="page-heading"><p class="rf-eyebrow">Your next build, collected.</p><h1>A few good pieces.</h1><p>${items.length} saved ${items.length === 1 ? 'component' : 'components'}. Keep a shortlist as you explore, then copy the shared styles and setup in one go. Saved in this browser.</p></div>${matches.length ? cards(matches) : `<div class="rf-empty"><h2>${query ? 'No saved components match.' : 'Make room for a good idea.'}</h2><p>${query ? 'Try another search.' : 'Tap the star on a component to collect it here.'}</p><a class="rf-button" href="#catalog">Explore components →</a></div>`}${items.length ? `<section class="doc-section"><h2>One setup for your collection.</h2><p>Shared modules are included once. Copy the individual HTML examples above and connect your own application behavior.</p>${codePanel('Shared styles & setup', setup({ css: [...new Set(items.flatMap(item => item.css))], js: [...new Set(items.flatMap(item => item.js))] }))}</section>` : ''}${footer()}`;
}
function home() {
  const featured = ['kanban', 'sortable-list', 'line-chart', 'resizable-panels', 'paginated-table', 'notification-center'].map(id => catalog.find(item => item.id === id));
  return `<section class="home-hero"><p class="rf-eyebrow">Plain HTML. A little magic.</p><h1>Beautiful components.<br><span class="hero-muted">Minimal footprint.</span></h1><p class="home-intro">Thoughtful building blocks for the web. No framework required. Just the pieces you need, and room to make them yours.</p><div class="rf-cluster home-actions"><a class="rf-button" href="#catalog">Explore components <span aria-hidden="true">→</span></a><a class="rf-button rf-button--outline" href="#start">Start building</a></div><div class="hero-facts"><span>Zero runtime dependencies</span><span>Framework independent</span><span>MIT licensed</span></div></section>
  <div class="showcase" aria-label="Rofin component preview">
    <div class="rf-card showcase-panel showcase-panel--main"><div class="showcase-head"><span class="tiny-label">A little of what’s possible</span><span class="rf-badge" data-variant="success">Live preview</span></div><div class="rf-card mini-workspace"><h2>Your next chapter.</h2><p>A workspace for the things you want to make.</p><div class="mini-project"><span class="mini-icon" aria-hidden="true">→</span><div><strong>Website launch</strong><p>Design something worth opening.</p></div><span class="rf-badge" data-variant="warning">In progress</span></div><div class="mini-progress"><label for="home-progress">72%</label><progress class="rf-progress" id="home-progress" value="72" max="100">72%</progress></div><div class="showcase-bottom"><div class="rf-avatar-group" aria-label="Sample project team"><span class="rf-avatar" role="img" aria-label="Robin Francis">RF</span><span class="rf-avatar" role="img" aria-label="Alex Morgan">AM</span><span class="rf-avatar" role="img" aria-label="Jamie Lee">JL</span></div><button class="rf-button rf-button--outline" type="button" data-demo-toast>Save project →</button></div></div></div>
    <div class="showcase-right"><div class="rf-card showcase-panel"><span class="tiny-label">Clear next steps</span><div class="rf-cluster showcase-buttons"><a class="rf-button" href="#start">Get started</a><a class="rf-button rf-button--outline" href="#component/button">Learn more</a><button class="rf-button rf-button--ghost" type="button" data-demo-toast>Save draft</button></div></div><div class="rf-card showcase-panel"><span class="tiny-label">Small, thoughtful details</span><div class="showcase-toggle"><label class="rf-check"><input type="checkbox" class="rf-switch" role="switch" checked> Keep me in the loop</label></div><div class="showcase-toggle"><span class="rf-muted">Your changes are safe.</span><span class="rf-badge" data-variant="success">✓ Saved</span></div></div></div>
  </div><div class="showcase-caption"><span>REAL HTML. REAL COMPONENTS. NOTHING EXTRA.</span><span>Make it yours →</span></div>
  <div class="rf-grid metrics"><div class="metric"><strong class="rf-stat">${counts.Components}</strong><span>UI components</span></div><div class="metric"><strong class="rf-stat">${counts.Sections}</strong><span>Copyable sections</span></div><div class="metric"><strong class="rf-stat">0</strong><span>Runtime dependencies</span></div><div class="metric"><strong class="rf-stat" data-core-size>—</strong><span>Core CSS + JS, gzip</span></div></div>
  <section><div class="section-top"><div><h2>Made for the moments that matter.</h2><p>Useful little details that make a product feel considered.</p></div><a href="#catalog">View all ${catalog.length} entries <span aria-hidden="true">→</span></a></div>${cards(featured)}</section>
  <section class="rf-card rf-cluster collection-callout"><div><p class="rf-eyebrow">From pieces to a product.</p><h2 class="rf-card__title">Build the whole experience.</h2><p class="rf-card__description">Website and dashboard essentials, a coverage checklist, and working full-page examples.</p></div><a class="rf-button rf-button--outline" href="#coverage">Check the building blocks →</a></section>
  <section class="doc-section"><div class="section-top"><div><h2>From small pieces to a whole page.</h2><p>Original layouts you can copy, adapt, and ship.</p></div><a href="../examples/landing.html">Open example →</a></div>${cards(['hero', 'pricing', 'testimonials'].map(id => catalog.find(item => item.id === id)))}</section>${footer()}`;
}
function gallery() {
  const query = search.value.trim().toLocaleLowerCase();
  const items = catalog.filter(item => (filter === 'All' || item.category === filter) && `${item.title} ${item.category} ${item.description}`.toLocaleLowerCase().includes(query));
  document.querySelector('#search-status').textContent = `${items.length} results`;
  return `<div class="page-heading"><p class="rf-eyebrow">Your building blocks</p><h1>${query ? 'Find a good fit.' : filter === 'All' ? 'A little of everything.' : filter}</h1><p>${items.length} ${items.length === 1 ? 'entry' : 'entries'}${query ? ` matching “${escape(search.value)}”` : '. Original designs. Native foundations. Pick what you need.'}</p></div><div class="rf-cluster category-filters" aria-label="Filter gallery">${['All', 'Components', 'Effects', 'Sections'].map(category => `<button class="rf-button rf-button--small ${filter === category ? '' : 'rf-button--outline'}" type="button" data-category="${category}" aria-pressed="${filter === category}">${category}${category !== 'All' ? ` · ${counts[category]}` : ` · ${catalog.length}`}</button>`).join('')}</div>${items.length ? cards(items) : '<div class="rf-empty empty-results"><h2>No matching components.</h2><p>Try “card”, “form”, or “hero”, or choose another category.</p></div>'}${footer()}`;
}
function referenceLibrary() {
  const query = search.value.trim().toLocaleLowerCase();
  const libraries = references.libraries.filter(library => libraryFilter === 'All' || library.name === libraryFilter);
  const entries = libraries.flatMap(library => library.entries.map(item => ({ ...item, library: library.name }))).filter(item => `${item.title} ${item.library}`.toLocaleLowerCase().includes(query));
  document.querySelector('#search-status').textContent = `${entries.length} reference entries`;
  return `<div class="page-heading"><p class="rf-eyebrow">Collected ${references.date}</p><h1>A wider world of UI.</h1><p>Explore all 11 source libraries. Related Rofin patterns are original alternatives; they do not reproduce every effect or behavior.</p></div><div class="reference-summary rf-card"><strong>${references.libraries.reduce((sum, library) => sum + library.entries.length, 0).toLocaleString()} indexed references · ${catalog.length} runnable Rofin examples</strong><p class="rf-muted">Catalog coverage is partial, especially Aura’s 2,495 free entries. Catalogued names and URLs do not mean each individual demo was reviewed or implemented.</p><a href="./reference-review.md" download>Download coverage notes →</a></div><div class="rf-cluster category-filters" aria-label="Filter reference libraries">${['All', ...references.libraries.map(library => library.name)].map(name => `<button class="rf-button rf-button--small ${libraryFilter === name ? '' : 'rf-button--outline'}" type="button" data-library="${escape(name)}" aria-pressed="${libraryFilter === name}">${escape(name)}</button>`).join('')}</div>${libraries.length === 1 ? `<p class="rf-help">${escape(libraries[0].coverage)} <a href="${libraries[0].url}" target="_blank" rel="noopener">Open source catalog ↗</a></p>` : ''}<p class="rf-help">${entries.length} matching references. Search by name or library.</p><div class="reference-list">${entries.map(item => `<article class="reference-row"><div><a href="${escape(item.url)}" target="_blank" rel="noopener">${escape(item.title)} ↗</a><p>${escape(item.library)} · ${escape(item.review)}</p></div>${item.related ? `<a class="reference-pattern" href="#component/${item.related}">Related: ${escape(catalog.find(entry => entry.id === item.related)?.title || item.related)} →</a>` : '<span class="rf-help">Reference only</span>'}</article>`).join('') || '<p>No references match this search.</p>'}</div>${footer()}`;
}
const functions = { tabs: 'initTabs', dropdown: 'initDropdowns', dialog: 'initDialogs', tooltip: 'initTooltips', upload: 'initUploads', toast: 'toast', patterns: 'initPatterns', 'form-patterns': 'initFormPatterns', 'data-grid': 'createDataGrid', 'upload-queue': 'createUploadQueue' };
function setup(item) {
  const css = [...new Set(['tokens', 'base', 'layout', ...item.css])];
  let code = css.map(name => `<link rel="stylesheet" href="./src/${name}.css">`).join('\n');
  if (item.js.length) {
    code += '\n\n<script type="module">\n';
    const core = item.js.filter(name => name !== 'effects');
    if (core.length) {
      for (const name of core) code += `  import { ${functions[name]} } from './src/js/${name}.js';\n`;
      for (const name of core.filter(name => name !== 'toast')) code += name === 'upload-queue' ? "  document.querySelectorAll('[data-rf-upload-queue]').forEach(element => createUploadQueue(element));\n" : name === 'data-grid' ? "  document.querySelectorAll('[data-rf-data-grid]').forEach(element => createDataGrid(element));\n" : `  ${functions[name]}();\n`;
    }
    if (item.js.includes('effects')) code += "  import { initEffects } from './src/js/effects.js';\n  initEffects();\n";
    if (item.sampleJS) code += '\n' + item.sampleJS.split('\n').map(line => '  ' + line).join('\n') + '\n';
    code += '</script>';
  }
  code += '\n\n<!-- Put the example inside a .rf-scope container. -->';
  return code;
}
function codePanel(title, code) {
  return `<div class="rf-card code-panel"><div class="code-toolbar"><strong>${title}</strong><button class="rf-button rf-button--ghost" type="button" data-copy>Copy code</button></div><pre tabindex="0" aria-label="${title}"><code>${escape(code)}</code></pre></div>`;
}
function detail(item) {
  return `<div class="page-heading"><p class="rf-eyebrow">${item.category} / ${item.js.length ? 'Optional JavaScript' : 'HTML + CSS'}</p><h1>${item.title}</h1><p>${item.description}</p><div class="detail-bits"><span class="rf-badge">${item.cssBytes.toLocaleString()} bytes of minified component CSS*</span><span class="rf-badge">${item.js.length ? 'Vanilla JavaScript' : 'No JavaScript needed'}</span>${saveButton(item)}</div></div><div class="rf-card preview-shell"><div class="preview-toolbar"><h2>INTERACTIVE PREVIEW</h2><button class="rf-button rf-button--ghost" type="button" id="preview-width" aria-pressed="false">Narrow preview</button></div><div class="preview rf-scope">${item.html}</div></div><p class="rf-help">*Sum of minified component modules; excludes shared tokens, base, and layout. This is not a gzip transfer measurement.</p><section class="doc-section"><h2>Make it yours.</h2><p>Copy the HTML, include the styles, and add the optional behavior below.</p>${codePanel('HTML', item.html)}${codePanel('Styles & setup', setup(item))}</section><section class="doc-section"><h2>Good to know.</h2><ul>${item.notes.map(note => `<li>${escape(note)}</li>`).join('')}</ul></section><section class="doc-section"><h2>Download source files</h2><p>${[item.file, ...item.css.map(name => `src/${name}.css`), ...item.js.map(name => `src/js/${name}.js`)].map(path => `<a href="../${path}" download>${path}</a>`).join(' · ')}</p></section>${footer()}`;
}
function coverage() {
  const groups = [
    ['Website navigation', ['website-header', 'navigation', 'breadcrumb', 'footer']],
    ['Marketing pages', ['hero', 'features', 'bento', 'logo-cloud', 'pricing', 'billing-switch', 'testimonials', 'faq', 'cta', 'blog-grid', 'team']],
    ['Contact & capture', ['contact', 'newsletter', 'input', 'select', 'autocomplete', 'combobox', 'multiselect', 'form-error-summary', 'textarea', 'checkbox', 'radio', 'upload', 'upload-queue']],
    ['Account flows', ['sign-in', 'sign-up', 'password-reset', 'password-field', 'one-time-code', 'account-settings', 'workspace-switcher', 'account-menu']],
    ['Dashboard structure', ['app-shell', 'dashboard-metrics', 'resizable-panels', 'layout', 'card', 'avatar', 'badge']],
    ['Charts & progress', ['line-chart', 'bar-chart', 'donut-chart', 'progress', 'meter', 'stats']],
    ['Data & filters', ['data-grid', 'data-table', 'paginated-table', 'bulk-actions', 'date-range', 'date-range-presets', 'tag-input', 'segmented-control']],
    ['Actions & overlays', ['button', 'dropdown', 'dialog', 'drawer', 'tooltip', 'command-palette']],
    ['Feedback & states', ['alert', 'toast', 'empty-state', 'spinner', 'skeleton', 'notification-center']],
    ['Activity & onboarding', ['kanban', 'sortable-list', 'event-scheduler', 'calendar', 'time-picker', 'timeline', 'launch-checklist', 'multi-step-form', 'tabs']]
  ];
  return `<div class="page-heading"><p class="rf-eyebrow">The pieces, accounted for.</p><h1>From a website to a workspace.</h1><p>Common website and dashboard UI is covered below. These are working building blocks; your product supplies its data and services.</p><div class="rf-cluster"><a class="rf-button" href="../examples/dashboard.html">Open the dashboard →</a><a class="rf-button rf-button--outline" href="../examples/landing.html">Open the website →</a></div></div><div class="rf-table-wrap" tabindex="0" role="region" aria-label="Website and dashboard coverage"><table class="rf-table coverage-table"><caption>Common UI coverage · ${catalog.length} examples available</caption><thead><tr><th scope="col">Need</th><th scope="col">Reusable examples</th></tr></thead><tbody>${groups.map(([name, ids]) => `<tr><th scope="row">${name}</th><td>${ids.map(id => { const item = catalog.find(item => item.id === id); return `<a href="#component/${id}">${item.title}</a>`; }).join(' · ')}</td></tr>`).join('')}</tbody></table></div><section class="doc-section"><h2>A working dashboard, composed.</h2><p>The sample uses the same shell, metrics, charts, date fields, notification inbox, table filters, selection, dialogs, settings, task board, and timeline found in the library. Move cards to update their table status, export selected rows as CSV, create a sample project, archive with confirmation, and edit workspace preferences. Changes stay in the page session.</p></section><section class="doc-section"><h2>Connect the services your product needs.</h2><p>Authentication and recovery, authorization, databases, email, payments, file storage, and server validation belong to the application. Loading, errors, and empty states compose from the existing feedback components. Large grids, maps, rich text, and domain-specific tools need their own implementation when your product requires them.</p><p>Chrome and Firefox suites check keyboard use, narrow layouts and automated accessibility. Installed Safari has manual smoke checks; physical touch and screen readers still need validation. <a href="./validation.md">Read the evidence</a>.</p></section>${footer()}`;
}
function installation() {
  const simple = `<link rel="stylesheet" href="./src/rofin.css">\n\n<div class="rf-scope">\n  <button class="rf-button" type="button">Get started</button>\n</div>\n\n<!-- Only needed for JavaScript interactions. -->\n<script type="module">\n  import { init } from './src/js/index.js';\n  const destroy = init();\n  // Call destroy() when removing this app root.\n</script>`;
  const subset = `<link rel="stylesheet" href="./src/tokens.css">\n<link rel="stylesheet" href="./src/button.css">\n\n<button class="rf-button" type="button">Just one component</button>`;
  return `<div class="page-heading"><p class="rf-eyebrow">A small beginning</p><h1>Start with the web.</h1><p>No framework to learn. No runtime dependencies to install. A few files, then your own ideas.</p></div><p class="rf-card install-note">The npm package has not been published yet. These downloads use the current gallery branch while pull request #1 remains draft. Build the downloadable files locally from that source.</p><section class="doc-section"><h2>1. Get the source</h2><p><a href="https://github.com/robinfrancis186/rofin-ui/archive/refs/heads/codex/expand-component-library.zip">Download the repository ZIP</a> or clone it:</p>${codePanel('Terminal', 'git clone --branch codex/expand-component-library https://github.com/robinfrancis186/rofin-ui.git')}</section><section class="doc-section"><h2>2. Include the styles</h2><p>The source files work directly in a browser. The .rf-scope class enables scoped typography and base styles without resetting your entire app.</p>${codePanel('HTML', simple)}</section><section class="doc-section"><h2>3. Pick just what you need</h2><p>Tokens plus an individual CSS module are enough for standalone component styles. Add base.css and layout.css if your example uses scoped typography or layout utilities.</p>${codePanel('Individual styles', subset)}</section><section class="doc-section"><h2>Prefer bundled files?</h2><p>Run npm ci and npm run build to produce minified standalone files in dist. Development tools are not runtime dependencies.</p>${codePanel('Built assets', '<link rel="stylesheet" href="./dist/rofin.css">\n<script src="./dist/rofin.auto.js" defer></script>\n<!-- Auto-initializes; APIs are available as window.Rofin. -->')}<p><a href="../dist/rofin.css" download>Download built CSS</a> · <a href="../dist/rofin.auto.js" download>Download auto JavaScript</a></p></section><section class="doc-section"><h2>Try a full page</h2><p><a href="../examples/landing.html">Landing page</a> · <a href="../examples/dashboard.html">Dashboard</a> · <a href="../examples/index.html">Component playground</a></p></section>${footer()}`;
}
function theming() {
  const tokens = [['--rf-primary', 'Primary actions and accents'], ['--rf-on-primary', 'Text on the primary color'], ['--rf-surface', 'Cards, inputs, dialogs'], ['--rf-bg', 'Page background'], ['--rf-text', 'Primary text'], ['--rf-muted', 'Secondary text'], ['--rf-border', 'Borders and separators'], ['--rf-focus', 'Keyboard focus ring'], ['--rf-radius', 'Default corner radius'], ['--rf-font', 'System font stack']];
  return `<div class="page-heading"><p class="rf-eyebrow">Your own character</p><h1>Make it feel like you.</h1><p>A small set of CSS variables gives every component a shared visual language.</p></div><section class="doc-section"><h2>Change the essentials</h2><p>Place overrides after the Rofin stylesheet. Unlayered application styles take precedence over the library’s CSS layers.</p>${codePanel('CSS', ':root {\n  --rf-primary: #176844;\n  --rf-primary-hover: #105132;\n  --rf-on-primary: #ffffff;\n  --rf-focus: #176844;\n  --rf-radius: 1rem;\n}')}</section><section class="doc-section"><h2>Light and dark</h2><p>Without an explicit setting, tokens follow the operating system. Set data-rf-theme="light" or "dark" on the html element to choose a theme. The documentation’s preference persistence is separate from the library.</p>${codePanel('HTML', '<html lang="en" data-rf-theme="dark">')}</section><section class="doc-section"><h2>Design tokens</h2><div class="rf-table-wrap"><table class="rf-table token-table"><caption>Frequently used variables</caption><thead><tr><th scope="col">Token</th><th scope="col">Purpose</th></tr></thead><tbody>${tokens.map(([token, purpose]) => `<tr><td><code>${token}</code></td><td>${purpose}</td></tr>`).join('')}</tbody></table></div></section><section class="doc-section"><h2>Keep the basics readable</h2><p>After customizing, check text contrast, keyboard focus visibility, and both color themes. The tested defaults do not guarantee the accessibility of your overrides.</p></section>${footer()}`;
}
function api() {
  return `<div class="page-heading"><p class="rf-eyebrow">A little behavior</p><h1>Small scripts. Clear APIs.</h1><p>Importing the main module does not touch the DOM. Initialize only when and where you need interactions.</p></div><section class="doc-section"><h2>Initialize and clean up</h2>${codePanel('JavaScript', "import { init } from './src/js/index.js';\n\nconst destroy = init(document, { observe: true });\n// New component subtrees are initialized automatically.\n// Removed subtrees have their listeners cleaned up.\n\n// Before unmounting your app:\ndestroy();")}<p>Initialization is idempotent for the same root. Avoid overlapping roots. Observation watches insertion and removal of complete component subtrees, not configuration attribute changes. When changing a tabset’s internal structure, tear down and initialize again.</p></section><section class="doc-section"><h2>Individual components</h2>${codePanel('JavaScript', "import { initTabs } from './src/js/tabs.js';\n\nconst destroyTabs = initTabs(document.querySelector('#my-widget'));\n// Individual initializers do not observe future insertions.\ndestroyTabs();")}<p>Other exports: initDropdowns, initDialogs, initTooltips, and initUploads. These return teardown functions too.</p></section><section class="doc-section"><h2>Notifications</h2>${codePanel('JavaScript', "import { toast, clearToasts } from './src/js/toast.js';\n\nconst notification = toast('Your changes are saved.', {\n  title: 'All set',\n  variant: 'success',\n  duration: 5000\n});\n\nnotification.dismiss();\nclearToasts();")}<p>Variants: info, success, warning, danger. Set duration: 0 to persist. Notifications are text-only and do not support raw HTML.</p></section><section class="doc-section"><h2>Optional effects</h2>${codePanel('JavaScript', "import { initEffects } from './src/js/effects.js';\n\nconst stopEffects = initEffects(document);\n// Call again for new content, and stop before removing it.\nstopEffects();")}<p>Include effects.css separately. Effects honor prefers-reduced-motion. They are not bundled into the core.</p></section><section class="doc-section"><h2>Events and native methods</h2><p>Tabs emit rf:tab-change with detail.index and detail.tab. Dialogs expose native showModal(), close(), and close/cancel events. Menus expose native showPopover(), hidePopover(), and toggle events. File selection uses the native change event.</p></section>${footer()}`;
}
function principles() {
  return `<div class="page-heading"><p class="rf-eyebrow">Small by design</p><h1>Enough, thoughtfully made.</h1><p>A useful foundation, without asking you to adopt an entire frontend stack.</p></div><section class="doc-section"><h2>Native where it matters</h2><p>HTML owns form semantics, validation, checkbox and radio behavior, expandable details, and modal focus handling. JavaScript fills a small number of interaction gaps. The core does not register custom elements or rewrite your existing controls.</p></section><section class="doc-section"><h2>A library, not a speed guarantee</h2><p>The current minified core CSS and auto JavaScript total <strong data-core-size>—</strong> when gzipped separately at level 9. This excludes documentation, effects, sections, media, and your application. A 14 KiB combined gzip ceiling is enforced during builds.</p><p>Small assets reduce some overhead. Image size, fonts, application scripts, rendering effects, and server response time still determine page performance. We have not established field Core Web Vitals for your website.</p></section><section class="doc-section"><h2>Browser support</h2><p>Target current Chrome/Edge, Firefox, and Safari. Native popovers require Chrome/Edge 114+, Firefox 125+, or Safari 17+. The library also uses CSS layers and modern logical properties. There is no bundled legacy browser polyfill. The suite supports Chromium, Firefox and WebKit. Chrome and Firefox checks pass locally; installed Safari has manual smoke evidence. Physical touch hardware and screen-reader checks remain outstanding. <a href="./validation.md">Read the validation evidence</a>.</p></section><section class="doc-section"><h2>Accessibility is part of the implementation</h2><p>Labelled controls, visible focus, keyboard navigation, native modal behavior, and reduced-motion fallbacks are included. Automated accessibility checks cover the gallery examples in light and dark themes. These checks do not replace assistive-technology testing or validate your customizations.</p></section><section class="doc-section"><h2>What’s included, and what isn’t</h2><p>${counts.Components} component examples, ${counts.Effects} optional effects, ${counts.Sections} sections, and two composed page examples. Rich-text editing, payment processing, and durable application services remain outstanding. The advanced table supports application-supplied data and transport.</p></section><section class="doc-section"><h2>Open source, with room to grow</h2><p>MIT licensed. Original source inspired by the minimal approach of Oat, without including source code from Oat, Aura, or Aceternity. Pre-1.0 APIs can change; pin versions when integrating. <a href="https://github.com/robinfrancis186/rofin-ui/issues">Report a problem or request a component</a>.</p></section>${footer()}`;
}
function updateSize() {
  if (!sizeReport) return;
  document.querySelectorAll('[data-core-size]').forEach(element => { element.textContent = `${(sizeReport.coreGzip / 1024).toFixed(1)} KiB`; });
}
function render({ focus = false } = {}) {
  stopGrids(); stopUploads();
  stopEffects();
  stopForms();
  stopPatterns();
  const route = location.hash.slice(1) || 'home';
  search.setAttribute('aria-label', route === 'references' ? 'Search reference components and libraries' : 'Search components, effects, and sections');
  const item = route.startsWith('component/') ? catalog.find(entry => entry.id === route.slice(10)) : null;
  let html;
  if (route === 'references') html = referenceLibrary();
  else if (route === 'saved') html = collection();
  else if (search.value.trim() || route.startsWith('catalog')) html = gallery();
  else if (item) html = detail(item);
  else if (route === 'coverage') html = coverage();
  else if (route === 'start') html = installation();
  else if (route === 'theming') html = theming();
  else if (route === 'api') html = api();
  else if (route === 'principles') html = principles();
  else html = home();
  main.innerHTML = html;
  stopEffects = initEffects(main);
  stopPatterns = initPatterns(main);
  stopForms = initFormPatterns(main);
  stopGrids = initGridExamples(main);
  stopUploads = initUploadExamples(main);
  navigation(); updateSize();
  document.title = `${item?.title || ({ coverage: 'Website & dashboard checklist', start: 'Installation', theming: 'Theming', api: 'JavaScript API', principles: 'Principles', catalog: 'Gallery', saved: 'Saved collection', references: 'Reference library' }[route] || 'Beautiful components. Minimal footprint.')} — Rofin UI`;
  if (focus) { main.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: 'instant' }); }
}

window.addEventListener('hashchange', () => { search.value = ''; render({ focus: true }); });
search.addEventListener('input', () => render());
document.addEventListener('keydown', event => {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.target.closest('input, textarea, select, [contenteditable]')) { event.preventDefault(); search.focus(); }
});
document.addEventListener('click', async event => {
  const save = event.target.closest('[data-save]');
  if (save) {
    const id = save.dataset.save;
    if (saved.has(id)) saved.delete(id); else saved.add(id);
    try { localStorage.setItem('rofin-saved', JSON.stringify([...saved])); } catch { toast('Browser storage is unavailable. Your collection will last for this page session.', { duration: 5000 }); }
    if (location.hash === '#saved') { render(); (main.querySelector('[data-save]') || main).focus({ preventScroll: true }); }
    else {
      for (const button of document.querySelectorAll('[data-save]')) {
        button.setAttribute('aria-pressed', String(saved.has(button.dataset.save)));
        button.querySelector('span').textContent = saved.has(button.dataset.save) ? '★' : '☆';
      }
      navigation();
    }
    document.querySelector('#search-status').textContent = `${saved.size} components in your saved collection`;
  }
  const category = event.target.closest('[data-category]');
  if (category) { filter = category.dataset.category; render(); document.querySelector(`[data-category="${filter}"]`)?.focus(); }
  const library = event.target.closest('[data-library]');
  if (library) { libraryFilter = library.dataset.library; render(); [...document.querySelectorAll('[data-library]')].find(button => button.dataset.library === libraryFilter)?.focus(); }
  const copy = event.target.closest('[data-copy]');
  if (copy) {
    const code = copy.closest('.code-panel').querySelector('code');
    try { await navigator.clipboard.writeText(code.textContent); copy.textContent = 'Copied'; setTimeout(() => { if (copy.isConnected) copy.textContent = 'Copy code'; }, 1800); }
    catch { const range = document.createRange(); range.selectNodeContents(code); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); toast('Clipboard access is unavailable. The code is selected so you can copy it manually.', { duration: 0 }); }
  }
  if (event.target.closest('[data-demo-toast]')) toast('Your changes are saved.', { title: 'All set', variant: 'success' });
  const previewWidth = event.target.closest('#preview-width');
  if (previewWidth) {
    const narrow = document.querySelector('.preview').classList.toggle('narrow');
    previewWidth.setAttribute('aria-pressed', String(narrow)); previewWidth.textContent = narrow ? 'Full preview' : 'Narrow preview';
  }
  const previewLink = event.target.closest('.preview a');
  if (previewLink && !previewLink.closest('[data-demo-navigation]') && !event.defaultPrevented) { event.preventDefault(); toast('Example link. Connect this to your own destination.', { duration: 3000 }); }
  if (event.target.closest('#mobile-nav a')) document.querySelector('#mobile-menu').close();
});
document.addEventListener('submit', event => {
  if (event.defaultPrevented) return;
  if (event.target.matches('[data-demo-form]')) { event.preventDefault(); toast('Demo only. No data was sent.', { title: 'Form preview', duration: 5000 }); }
});
document.addEventListener('rf:command', event => {
  toast(`Demo command selected: ${event.detail.value}`, { title: 'Command preview' });
});
document.addEventListener('rf:table-action', event => {
  toast(`${event.detail.values.length} rows selected. Connect this action to your application.`, { title: 'Selection preview' });
});
const themeButton = document.querySelector('#theme-toggle');
function themeLabel() { themeButton.setAttribute('aria-label', `Switch to ${document.documentElement.dataset.rfTheme === 'dark' ? 'light' : 'dark'} theme`); }
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.rfTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.rfTheme = theme;
  try { localStorage.setItem('rofin-theme', theme); } catch {}
  themeLabel();
});
themeLabel(); render();
fetch('./sizes.json').then(response => { if (!response.ok) throw new Error('No size report'); return response.json(); }).then(report => { sizeReport = report; updateSize(); }).catch(() => {
  document.querySelectorAll('[data-core-size]').forEach(element => { element.textContent = 'See build'; });
});
