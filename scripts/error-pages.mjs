import { readFile } from 'node:fs/promises';

// Both the local HTTP server and static build compose the exact gallery sections.
// ponytail: status pages use origin-root links; rewrite their prefix for subfolder hosts.
export async function errorPage(kind, docs = '/index.html') {
  const section = (await readFile(new URL(`../sections/error-${kind}.html`, import.meta.url), 'utf8'))
    .replaceAll('../docs/index.html', docs).replaceAll('../examples/', '/examples/')
    .replaceAll('<h2', '<h1').replaceAll('</h2>', '</h1>');
  const title = { '404': 'Page not found', permission: 'Permission needed', offline: 'Connection paused', server: 'Resource unavailable' }[kind];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} — Rofin UI</title><link rel="stylesheet" href="/src/rofin.css"><link rel="stylesheet" href="/src/sections.css"></head><body class="rf-scope"><a class="rf-skip-link" href="#main">Skip to content</a><header class="rf-site-header"><div class="rf-container"><a class="rf-site-header__brand" href="${docs}">Rofin UI</a></div></header><main id="main" class="rf-container rf-section">${section}</main></body></html>\n`;
}
