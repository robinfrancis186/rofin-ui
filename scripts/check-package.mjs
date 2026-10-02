import { execFileSync } from 'node:child_process';
import { readFile, access } from 'node:fs/promises';
import { strict as assert } from 'node:assert';
import { createRequire } from 'node:module';

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
assert.equal(Object.keys(pkg.dependencies || {}).length, 0, 'No runtime dependencies');
assert.equal(Object.keys(pkg.peerDependencies || {}).length, 0, 'No peer dependencies');
const report = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], { encoding: 'utf8' }))[0];
const packed = new Set(report.files.map(file => file.path));
for (const path of ['dist/rofin.css', 'dist/rofin.js', 'dist/rofin.cjs', 'dist/rofin.auto.js', 'dist/effects.css', 'dist/effects.js', 'dist/sections.css', 'dist/patterns.css', 'dist/patterns.js', 'dist/patterns.d.ts', 'dist/form-patterns.css', 'dist/form-patterns.js', 'dist/form-patterns.d.ts', 'dist/index.d.ts', 'LICENSE', 'README.md']) assert(packed.has(path), `Missing ${path}`);
for (const file of report.files) assert(!/^(docs|tests|scripts|node_modules)\//.test(file.path), `Development-only file packed: ${file.path}`);
for (const path of ['examples/recovery.html', 'examples/recovery.js', 'examples/assets/project-snapshot.json', 'sections/error-404.html', 'sections/error-permission.html', 'sections/error-offline.html', 'sections/error-server.html']) assert(packed.has(path), `Missing recovery example file: ${path}`);
assert(!(await readFile('examples/recovery.js', 'utf8')).includes('docs/catalog'), 'Recovery does not depend on unpublished documentation');
for (const [key, value] of Object.entries(pkg.exports)) {
  const paths = typeof value === 'string' ? [value] : Object.values(value);
  for (const path of paths) if (!path.includes('*')) { await access(path); assert(packed.has(path.slice(2)), `Export ${key} points outside package: ${path}`); }
}
const esm = await import('../dist/rofin.js');
assert.equal(typeof (await import('../dist/patterns.js')).initPatterns, 'function', 'Optional patterns import is safe without a DOM');
assert.equal(typeof (await import('../dist/form-patterns.js')).initFormPatterns, 'function', 'Optional forms import is safe without a DOM');
assert.equal(typeof (await import('../dist/data-grid.js')).createDataGrid, 'function', 'Optional grid import is safe without a DOM');
assert.equal(typeof (await import('../dist/upload-queue.js')).createUploadQueue, 'function', 'Optional upload queue import is safe without a DOM');
assert.equal(typeof (await import('../dist/team-management.js')).createTeamManager, 'function', 'Optional team management import is safe without a DOM');
assert.equal(typeof (await import('../dist/editors.js')).initEditors, 'function', 'Optional editors import is safe without a DOM');
assert.equal(typeof (await import('../dist/file-browser.js')).createFileBrowser, 'function', 'Optional file browser import is safe without a DOM');
assert.equal(typeof (await import('../dist/viewers.js')).initViewers, 'function', 'Optional viewer import is safe without a DOM');
const cjs = createRequire(import.meta.url)('../dist/rofin.cjs');
for (const name of ['init', 'initTabs', 'initDialogs', 'initDropdowns', 'initTooltips', 'initUploads', 'toast', 'clearToasts']) {
  assert.equal(typeof esm[name], 'function', `ESM export ${name}`);
  assert.equal(typeof cjs[name], 'function', `CJS export ${name}`);
}
console.log(`Package validated: ${report.files.length} files, ${report.size} bytes packed; zero runtime or peer dependencies. ESM/CJS imports are safe without a DOM.`);
