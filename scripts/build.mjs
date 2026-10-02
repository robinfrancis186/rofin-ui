import { build, transform } from 'esbuild';
import { mkdir, readFile, writeFile, cp, readdir, rm } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

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
await cp('src/index.d.ts', 'dist/index.d.ts');

const names = ['rofin.css', 'rofin.js', 'rofin.auto.js', 'effects.css', 'effects.js', 'sections.css', 'patterns.css', 'patterns.js', 'form-patterns.css', 'form-patterns.js', 'data-grid.css', 'data-grid.js', 'upload-queue.css', 'upload-queue.js', 'team-management.css', 'team-management.js'];
const sizes = {};
for (const name of names) {
  const content = await readFile(`dist/${name}`);
  sizes[name] = { bytes: content.length, gzip: gzipSync(content, { level: 9 }).length };
}
const coreGzip = sizes['rofin.css'].gzip + sizes['rofin.auto.js'].gzip;
if (coreGzip > 14 * 1024) throw new Error(`Core exceeds the 14 KiB gzip ceiling: ${coreGzip} bytes`);
await writeFile('dist/sizes.json', JSON.stringify({ coreGzip, files: sizes }, null, 2) + '\n');

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
for (const name of ['index.html', 'landing.html', 'dashboard.html', 'team-invite.html']) {
  const file = `dist/site/examples/${name}`;
  await writeFile(file, (await readFile(file, 'utf8')).replaceAll('../docs/index.html', '../index.html'));
}
await cp('sections', 'dist/site/sections', { recursive: true });
await mkdir('dist/site/downloads', { recursive: true });
for (const name of names) await cp(`dist/${name}`, `dist/site/downloads/${name}`);
console.log(`Core CSS + auto JavaScript: ${(coreGzip / 1024).toFixed(2)} KiB gzip (${coreGzip} bytes)`);
for (const [name, size] of Object.entries(sizes)) console.log(`${name}: ${size.bytes} bytes, ${size.gzip} gzip`);
console.log(`Built ${catalog.length} gallery entries and static docs in dist/site`);
