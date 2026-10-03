import { build, transform } from 'esbuild';
import { mkdir, readFile, writeFile, cp, readdir, rm } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { errorPage } from './error-pages.mjs';
import { invoiceText } from '../src/js/billing.js';
import { sampleBilling } from '../examples/billing-demo.js';
import { tracePrism } from '../src/js/prism.js';

await mkdir('dist', { recursive: true });
const shared = { bundle: true, minify: true, target: ['es2022'], logLevel: 'warning' };
await build({ ...shared, entryPoints: ['src/rofin.css'], outfile: 'dist/rofin.css' });
await build({ ...shared, entryPoints: ['src/effects.css'], outfile: 'dist/effects.css' });
await build({ ...shared, entryPoints: ['src/sections.css'], outfile: 'dist/sections.css' });
await build({ ...shared, entryPoints: ['src/patterns.css'], outfile: 'dist/patterns.css' });
await build({ ...shared, entryPoints: ['src/form-patterns.css'], outfile: 'dist/form-patterns.css' });
await build({ ...shared, entryPoints: ['src/data-grid.css'], outfile: 'dist/data-grid.css' });
await build({ ...shared, entryPoints: ['src/js/index.js'], outfile: 'dist/rofin.js', format: 'esm' });
await build({ ...shared, entryPoints: ['src/js/index.js'], outfile: 'dist/rofin.cjs', format: 'cjs' });
await build({ ...shared, entryPoints: ['src/js/auto.js'], outfile: 'dist/rofin.auto.js', format: 'iife', globalName: 'Rofin' });
await build({ ...shared, entryPoints: ['src/js/effects.js'], outfile: 'dist/effects.js', format: 'esm' });
await build({ ...shared, entryPoints: ['src/js/patterns.js'], outfile: 'dist/patterns.js', format: 'esm' });
await cp('src/js/patterns.d.ts', 'dist/patterns.d.ts');
await build({ ...shared, entryPoints: ['src/js/form-patterns.js'], outfile: 'dist/form-patterns.js', format: 'esm' });
await cp('src/js/form-patterns.d.ts', 'dist/form-patterns.d.ts');
await build({ ...shared, entryPoints: ['src/js/data-grid.js'], outfile: 'dist/data-grid.js', format: 'esm' });
await cp('src/js/data-grid.d.ts', 'dist/data-grid.d.ts');
await build({ ...shared, entryPoints: ['src/upload-queue.css'], outfile: 'dist/upload-queue.css' });
await build({ ...shared, entryPoints: ['src/js/upload-queue.js'], outfile: 'dist/upload-queue.js', format: 'esm' });
await cp('src/js/upload-queue.d.ts', 'dist/upload-queue.d.ts');
await build({ ...shared, entryPoints: ['src/team-management.css'], outfile: 'dist/team-management.css' });
await build({ ...shared, entryPoints: ['src/js/team-management.js'], outfile: 'dist/team-management.js', format: 'esm' });
await cp('src/js/team-management.d.ts', 'dist/team-management.d.ts');
await build({ ...shared, entryPoints: ['src/editors.css'], outfile: 'dist/editors.css' });
await build({ ...shared, entryPoints: ['src/js/editors.js'], outfile: 'dist/editors.js', format: 'esm' });
await cp('src/js/editors.d.ts', 'dist/editors.d.ts');
await build({ ...shared, entryPoints: ['src/file-browser.css'], outfile: 'dist/file-browser.css' });
await build({ ...shared, entryPoints: ['src/js/file-browser.js'], outfile: 'dist/file-browser.js', format: 'esm' });
await cp('src/js/file-browser.d.ts', 'dist/file-browser.d.ts');
await build({ ...shared, entryPoints: ['src/viewers.css'], outfile: 'dist/viewers.css' });
await build({ ...shared, entryPoints: ['src/js/viewers.js'], outfile: 'dist/viewers.js', format: 'esm' });
await cp('src/js/viewers.d.ts', 'dist/viewers.d.ts');
await build({ ...shared, entryPoints: ['src/billing.css'], outfile: 'dist/billing.css' });
await build({ ...shared, entryPoints: ['src/js/billing.js'], outfile: 'dist/billing.js', format: 'esm' });
await cp('src/js/billing.d.ts', 'dist/billing.d.ts');
await build({ ...shared, entryPoints: ['src/prism.css'], outfile: 'dist/prism.css' });
await build({ ...shared, entryPoints: ['src/js/prism.js'], outfile: 'dist/prism.js', format: 'esm' });
await cp('src/js/prism.d.ts', 'dist/prism.d.ts');
await cp('src/index.d.ts', 'dist/index.d.ts');

const names = ['rofin.css', 'rofin.js', 'rofin.auto.js', 'effects.css', 'effects.js', 'sections.css', 'patterns.css', 'patterns.js', 'form-patterns.css', 'form-patterns.js', 'data-grid.css', 'data-grid.js', 'upload-queue.css', 'upload-queue.js', 'team-management.css', 'team-management.js', 'editors.css', 'editors.js', 'file-browser.css', 'file-browser.js', 'viewers.css', 'viewers.js', 'billing.css', 'billing.js', 'prism.css', 'prism.js'];
const sizes = {};
for (const name of names) {
  const content = await readFile(`dist/${name}`);
  sizes[name] = { bytes: content.length, gzip: gzipSync(content, { level: 9 }).length };
}
const coreGzip = sizes['rofin.css'].gzip + sizes['rofin.auto.js'].gzip;
if (coreGzip > 14 * 1024) throw new Error(`Core exceeds the 14 KiB gzip ceiling: ${coreGzip} bytes`);
await writeFile('dist/sizes.json', JSON.stringify({ coreGzip, files: sizes }, null, 2) + '\n');

const prismPath = 'examples/components/prism-lab.html';
const prismSource = await readFile(prismPath, 'utf8');
if (!prismSource.includes('<!-- rf:prism-rays:start -->') || !prismSource.includes('<!-- rf:prism-rays:end -->')) throw Error('Missing prism data markers.');
const prismRows = tracePrism().map(ray => `<tr>${[ray.wavelength, ray.index.toFixed(4), ray.state, ray.reflections, ray.exitAngle === null ? '—' : `${ray.exitAngle.toFixed(2)}°`].map(value => `<td>${value}</td>`).join('')}</tr>`).join('\n');
await writeFile(prismPath, prismSource.replace(/<!-- rf:prism-rays:start -->[\s\S]*?<!-- rf:prism-rays:end -->/, `<!-- rf:prism-rays:start -->\n${prismRows}\n<!-- rf:prism-rays:end -->`));

const metadata = JSON.parse(await readFile('docs/catalog.json', 'utf8'));
const catalog = [];
for (const item of metadata) {
  const html = await readFile(item.file, 'utf8');
  let cssBytes = 0;
  for (const name of item.css) {
    const css = await readFile(`src/${name}.css`, 'utf8');
    const minified = await transform(css, { loader: 'css', minify: true });
    cssBytes += Buffer.byteLength(minified.code);
  }
  catalog.push({ ...item, html: html.trim(), cssBytes });
}
await writeFile('docs/catalog.js', `// Generated from catalog.json and the source examples by npm run build.\nexport default ${JSON.stringify(catalog, null, 2)};\n`);
const references = JSON.parse(await readFile('docs/reference-catalog.json', 'utf8'));
await writeFile('docs/references.js', `// Catalog snapshot; related patterns are not feature parity claims.\nexport default ${JSON.stringify(references)};\n`);
await writeFile('docs/sizes.json', JSON.stringify({ coreGzip, files: sizes }, null, 2) + '\n');
const recovery = await readFile('examples/recovery.html', 'utf8');
if (!recovery.includes('<!-- rf:recovery-pages:start -->') || !recovery.includes('<!-- rf:recovery-pages:end -->')) throw Error('Missing recovery template markers.');
await writeFile('examples/recovery.html', recovery.replace(/<!-- rf:recovery-pages:start -->[\s\S]*?<!-- rf:recovery-pages:end -->/, `<!-- rf:recovery-pages:start -->\n<template id="recovery-pages">\n${catalog.filter(item => item.id.startsWith('error-')).map(item => item.html).join('\n')}\n</template>\n<!-- rf:recovery-pages:end -->`));
const billingHTML = catalog.filter(item => ['subscription', 'invoice-history', 'usage'].includes(item.id)).map(item => item.html).join('\n');
for (const path of ['examples/billing.html', 'examples/dashboard.html']) {
  const html = await readFile(path, 'utf8');
  if (!html.includes('<!-- rf:billing-pages:start -->') || !html.includes('<!-- rf:billing-pages:end -->')) throw Error('Missing billing template markers.');
  await writeFile(path, html.replace(/<!-- rf:billing-pages:start -->[\s\S]*?<!-- rf:billing-pages:end -->/, `<!-- rf:billing-pages:start -->\n${path.includes('dashboard') ? billingHTML.replace('data-rf-usage-preview', 'data-rf-usage-preview hidden') : billingHTML}\n<!-- rf:billing-pages:end -->`));
}
const landing = await readFile('examples/landing.html', 'utf8');
if (!landing.includes('<!-- rf:prism-example:start -->') || !landing.includes('<!-- rf:prism-example:end -->')) throw Error('Missing landing prism markers.');
await writeFile('examples/landing.html', landing.replace(/<!-- rf:prism-example:start -->[\s\S]*?<!-- rf:prism-example:end -->/, `<!-- rf:prism-example:start -->\n${catalog.find(item => item.id === 'prism-lab').html}\n<!-- rf:prism-example:end -->`));
await writeFile('examples/assets/sample-invoice.txt', invoiceText(sampleBilling(), 'studio-sep', { sample: true }));

// Self-contained static documentation, ready for any static host. No deployment required.
await rm('dist/site', { recursive: true, force: true });
await mkdir('dist/site', { recursive: true });
for (const name of await readdir('docs')) {
  if (name === 'catalog.json' || name === 'reference-catalog.json') continue;
  await cp(join('docs', name), join('dist/site', name), { recursive: true });
}
for (const name of ['index.html', 'app.js', 'catalog.js']) {
  const file = `dist/site/${name}`;
  await writeFile(file, (await readFile(file, 'utf8')).replaceAll('../src/', './src/').replaceAll('../examples/', './examples/').replaceAll('../sections/', './sections/').replaceAll('href="../${path}"', 'href="./${path}"').replaceAll('../dist/', './downloads/'));
}
await cp('src', 'dist/site/src', { recursive: true });
await cp('examples', 'dist/site/examples', { recursive: true });
for (const name of ['index.html', 'landing.html', 'dashboard.html', 'billing.html', 'team-invite.html', 'recovery.html', 'recovery.js']) {
  const file = `dist/site/examples/${name}`;
  await writeFile(file, (await readFile(file, 'utf8')).replaceAll('../docs/index.html', '../index.html'));
}
for (const [name, kind] of [['404', '404'], ['403', 'permission'], ['offline', 'offline'], ['500', 'server']]) await writeFile(`dist/site/${name}.html`, await errorPage(kind));
await cp('sections', 'dist/site/sections', { recursive: true });
await mkdir('dist/site/downloads', { recursive: true });
for (const name of names) await cp(`dist/${name}`, `dist/site/downloads/${name}`);
console.log(`Core CSS + auto JavaScript: ${(coreGzip / 1024).toFixed(2)} KiB gzip (${coreGzip} bytes)`);
for (const [name, size] of Object.entries(sizes)) console.log(`${name}: ${size.bytes} bytes, ${size.gzip} gzip`);
console.log(`Built ${catalog.length} gallery entries and static docs in dist/site`);
