import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash, randomUUID } from 'node:crypto';

const route = '/docs/index.html#component/upload-queue';
const root = page => page.locator('[data-rf-upload-queue]');
const rows = page => root(page).locator('li[data-rf-upload-id]');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1cAAAAASUVORK5CYII=', 'base64');
const textFile = (name = 'notes.txt', value = 'A useful file.') => ({ name, mimeType: 'text/plain', buffer: Buffer.from(value) });

test('file selection previews locally, validates limits safely, preserves cancelled reset and respects disabled input', async ({ page }) => {
  const posts = []; page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); }); await page.goto(route);
  const input = page.getByLabel('Files to add', { exact: true }), name = '<img onerror=window.queueXSS=1>.txt';
  await input.setInputFiles([{ name: 'pixel.png', mimeType: 'image/png', buffer: png }, textFile(name)]);
  await expect(rows(page)).toHaveCount(2); await expect(root(page).locator('img')).toHaveCount(1); expect(await root(page).locator('img').evaluate(image => image.src.startsWith('blob:'))).toBe(true);
  await expect(root(page)).toContainText(name); expect(await page.evaluate(() => window.queueXSS)).toBeUndefined(); expect(posts).toEqual([]);
  await input.setInputFiles([{ name: 'empty.txt', mimeType: 'text/plain', buffer: Buffer.alloc(0) }, { name: 'script.html', mimeType: 'text/html', buffer: Buffer.from('<script>bad</script>') }, { name: 'too-big.txt', mimeType: 'text/plain', buffer: Buffer.alloc(8388609, 'x') }]);
  await expect(root(page).getByRole('alert')).toContainText('Empty files'); await expect(root(page).getByRole('alert')).toContainText('not accepted'); await expect(root(page).getByRole('alert')).toContainText('no larger'); await expect(rows(page)).toHaveCount(2);
  await input.setInputFiles(Array.from({ length: 9 }, (_, i) => textFile(`extra-${i}.txt`))); await expect(rows(page)).toHaveCount(10); await expect(root(page).getByRole('alert')).toContainText('at most 10');
  await input.evaluate(element => element.disabled = true); await expect(page.getByRole('button', { name: 'Upload queued files', exact: true })).toBeDisabled();
  await input.evaluate(element => element.disabled = false); await expect(page.getByRole('button', { name: 'Upload queued files', exact: true })).toBeEnabled();
  await page.locator('[data-rf-upload-form]').evaluate(form => form.addEventListener('reset', event => event.preventDefault(), { once: true })); await page.getByRole('button', { name: 'Reset file queue', exact: true }).click(); await expect(rows(page)).toHaveCount(10);
  await page.getByRole('button', { name: 'Reset file queue', exact: true }).click(); await expect(rows(page)).toHaveCount(0); await expect(root(page).getByRole('alert')).toBeHidden(); expect(posts).toEqual([]);
});

test('native drop adds files once and cancelling a queued file does not silently retry it with upload-all', async ({ page }) => {
  await page.goto(route);
  const transfer = await page.evaluateHandle(() => { const data = new DataTransfer(); data.items.add(new File(['Drop this file.'], 'drop.txt', { type: 'text/plain' })); return data; });
  const zone = root(page).locator('[data-rf-drop-zone]'); await zone.dispatchEvent('dragover', { dataTransfer: transfer }); await expect(zone).toHaveAttribute('data-rf-dragging', ''); await zone.dispatchEvent('drop', { dataTransfer: transfer }); await expect(zone).not.toHaveAttribute('data-rf-dragging'); await expect(rows(page)).toHaveCount(1);
  await page.getByLabel('Files to add', { exact: true }).setInputFiles(textFile('second.txt'));
  await page.evaluate(async () => { const { createUploadQueue } = await import('/src/js/upload-queue.js'); const el = document.querySelector('[data-rf-upload-queue]'), previous = createUploadQueue(el); const files = previous.getFiles(); previous.destroy(); window.calls = []; window.queue = createUploadQueue(el, { upload: async file => window.calls.push(file.name) }); window.queue.addFiles(files); });
  await page.getByRole('button', { name: 'Cancel drop.txt', exact: true }).click(); await page.getByRole('button', { name: 'Upload queued files', exact: true }).click(); await expect(rows(page).filter({ hasText: 'second.txt' })).toHaveAttribute('data-rf-upload-state', 'uploaded'); await expect(rows(page).filter({ hasText: 'drop.txt' })).toHaveAttribute('data-rf-upload-state', 'cancelled'); expect(await page.evaluate(() => window.calls)).toEqual(['second.txt']);
});

test('actual HTTP uploads retain exact bytes and idempotent receipts; server rejects bad content, origins, limits and writes', async ({ page, request }) => {
  await page.goto(route); await page.getByLabel('Files to add', { exact: true }).setInputFiles([{ name: 'pixel.png', mimeType: 'image/png', buffer: png }, textFile()]); await page.getByRole('button', { name: 'Upload queued files', exact: true }).click(); await expect(root(page).locator('[data-rf-upload-state="uploaded"]')).toHaveCount(2);
  const ids = await rows(page).evaluateAll(elements => elements.map(element => element.dataset.rfUploadId));
  for (const [index, id] of ids.entries()) { const body = await (await request.get(`/api/sample-uploads/${id}`)).body(); expect(body.equals(index === 0 ? png : textFile().buffer)).toBe(true); }
  const id = ids[1], first = (await (await request.get('/api/sample-uploads')).json()).files.find(file => file.id === id);
  const repeat = await request.post(`/api/sample-uploads?id=${id}&name=notes.txt`, { headers: { 'Content-Type': 'application/octet-stream' }, data: textFile().buffer }); expect(repeat.status()).toBe(200); const repeated = await repeat.json(); expect(repeated.id).toBe(id); expect(repeated.sha256).toBe(first.sha256); expect(repeated.expiresAt).toBeGreaterThanOrEqual(first.expiresAt);
  expect((await request.post(`/api/sample-uploads?id=${id}&name=notes.txt`, { headers: { 'Content-Type': 'application/octet-stream' }, data: Buffer.from('Changed content') })).status()).toBe(409);
  expect((await request.post('/api/sample-uploads?name=fake.png', { headers: { 'Content-Type': 'application/octet-stream' }, data: Buffer.from('<svg onload=alert(1)>') })).status()).toBe(415);
  expect((await request.post('/api/sample-uploads?name=broken.txt', { headers: { 'Content-Type': 'application/octet-stream' }, data: Buffer.from([255, 254, 0]) })).status()).toBe(415);
  expect((await request.post('/api/sample-uploads?name=notes.txt', { headers: { 'Content-Type': 'application/octet-stream', Origin: 'https://untrusted.invalid' }, data: Buffer.from('Cross origin') })).status()).toBe(403);
  expect((await request.post('/api/sample-uploads?name=../notes.txt', { headers: { 'Content-Type': 'application/octet-stream' }, data: Buffer.from('Path traversal') })).status()).toBe(400);
  expect((await request.post('/api/sample-uploads?name=oversize.txt', { headers: { 'Content-Type': 'application/octet-stream' }, data: Buffer.alloc(8388609, 'x') })).status()).toBe(413);
  expect((await request.put(`/api/sample-uploads/${id}`, { data: 'Replace' })).status()).toBe(405);
  const downloaded = await request.get(`/api/sample-uploads/${ids[0]}`); expect(downloaded.headers()['content-disposition']).toContain('attachment'); expect(downloaded.headers()['x-content-type-options']).toBe('nosniff');
  for (const id of ids) { expect((await request.delete(`/api/sample-uploads/${id}`)).status()).toBe(200); expect((await request.get(`/api/sample-uploads/${id}`)).status()).toBe(404); }
});

test('real transport reports intermediate progress, cancellation removes partial data, and retry uploads the same file', async ({ page, request }) => {
  test.setTimeout(60000); await page.goto(route); const file = textFile('large.txt', 'x'.repeat(8388608)); await page.getByLabel('Files to add', { exact: true }).setInputFiles(file);
  const id = await rows(page).first().getAttribute('data-rf-upload-id'); await page.getByRole('button', { name: 'Upload large.txt', exact: true }).click();
  await expect.poll(() => root(page).locator('progress').evaluate(progress => progress.value > 0 && progress.value < progress.max), { timeout: 15000 }).toBe(true);
  const sending = (await (await request.get('/api/sample-uploads')).json()).active.find(file => file.id === id); expect(sending?.received).toBeGreaterThan(0); expect(sending.received).toBeLessThan(file.buffer.length);
  await page.getByRole('button', { name: 'Cancel large.txt', exact: true }).click(); await expect(rows(page).first()).toHaveAttribute('data-rf-upload-state', 'cancelled');
  await expect.poll(async () => (await (await request.get('/api/sample-uploads')).json()).active.some(file => file.id === id)).toBe(false); expect((await request.get(`/api/sample-uploads/${id}`)).status()).toBe(404);
  await page.getByRole('button', { name: 'Retry large.txt', exact: true }).click(); await expect(rows(page).first()).toHaveAttribute('data-rf-upload-state', 'uploaded', { timeout: 30000 });
  const saved = (await (await request.get('/api/sample-uploads')).json()).files.find(file => file.id === id); expect(saved.size).toBe(file.buffer.length); expect(saved.sha256).toBe(createHash('sha256').update(file.buffer).digest('hex')); expect((await (await request.get(`/api/sample-uploads/${id}`)).body()).equals(file.buffer)).toBe(true);
  await request.delete(`/api/sample-uploads/${id}`);
});

test('queue caps concurrency, retains failed files, permits explicit retry and ignores cancelled or stale callbacks', async ({ page }) => {
  await page.goto(route);
  await page.evaluate(async () => { const { createUploadQueue } = await import('/src/js/upload-queue.js'), el = document.querySelector('[data-rf-upload-queue]'); createUploadQueue(el).destroy(); window.pending = []; window.queue = createUploadQueue(el, { upload: (file, context) => new Promise((resolve, reject) => window.pending.push({ name: file.name, context, resolve, reject })) }); window.queue.addFiles(['one', 'two', 'three'].map(name => new File([name], `${name}.txt`, { type: 'text/plain' }))); });
  await page.getByRole('button', { name: 'Upload queued files', exact: true }).click(); await expect.poll(() => page.evaluate(() => window.pending.length)).toBe(2);
  await page.evaluate(() => window.pending[0].reject(Error('Try a new connection'))); await expect(rows(page).filter({ hasText: 'one.txt' })).toHaveAttribute('data-rf-upload-state', 'error'); await expect.poll(() => page.evaluate(() => window.pending.length)).toBe(3); await expect(page.getByRole('button', { name: 'Retry one.txt', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Cancel two.txt', exact: true }).click(); expect(await page.evaluate(() => window.pending[1].context.signal.aborted)).toBe(true); await page.getByRole('button', { name: 'Retry one.txt', exact: true }).click(); await expect.poll(() => page.evaluate(() => window.pending.length)).toBe(4);
  await page.evaluate(() => { window.pending[1].context.onProgress({ loaded: 100, total: 100 }); window.pending[1].resolve('Late success'); window.pending[2].resolve('Three done'); window.pending[3].resolve('Retry done'); }); await expect(rows(page).filter({ hasText: 'two.txt' })).toHaveAttribute('data-rf-upload-state', 'cancelled'); await expect(root(page).locator('li[data-rf-upload-state="uploaded"]')).toHaveCount(2);
  await page.evaluate(() => { window.queue.addFiles([new File(['prevent'], 'prevented.txt', { type: 'text/plain' })]); document.querySelector('[data-rf-upload-queue]').addEventListener('rf:upload-before', event => event.preventDefault(), { once: true }); }); await page.getByRole('button', { name: 'Upload prevented.txt', exact: true }).click(); expect(await page.evaluate(() => window.pending.length)).toBe(4); await expect(rows(page).filter({ hasText: 'prevented.txt' })).toHaveAttribute('data-rf-upload-state', 'queued');
  await page.getByRole('button', { name: 'Clear uploaded files from queue', exact: true }).click(); await expect(rows(page)).toHaveCount(2); await expect(rows(page).filter({ hasText: 'two.txt' })).toBeVisible();
  await page.getByRole('button', { name: 'Upload prevented.txt', exact: true }).click(); await expect.poll(() => page.evaluate(() => window.pending.length)).toBe(5);
  await page.getByRole('button', { name: 'Reset file queue', exact: true }).click(); await expect(rows(page)).toHaveCount(0); expect(await page.evaluate(() => window.pending[4].context.signal.aborted)).toBe(true);
  await page.evaluate(() => { window.pending[4].context.onProgress({ loaded: 1, total: 1 }); window.pending[4].resolve('Late reset completion'); }); await expect(rows(page)).toHaveCount(0);
});

test('reset and teardown abort pending work, revoke previews and make old controls inert without losing File objects', async ({ page }) => {
  await page.goto(route);
  const result = await page.evaluate(async () => {
    const { createUploadQueue } = await import('/src/js/upload-queue.js'), el = document.querySelector('[data-rf-upload-queue]'); createUploadQueue(el).destroy(); const revoked = [], original = URL.revokeObjectURL; URL.revokeObjectURL = url => { revoked.push(url); original.call(URL, url); };
    let resolve, signal; const queue = createUploadQueue(el, { upload: (file, context) => { signal = context.signal; return new Promise(done => resolve = done); } }); const identical = createUploadQueue(el) === queue;
    queue.addFiles([new File(['preview'], 'preview.png', { type: 'image/png' })]); const oldStart = el.querySelector('[data-rf-upload-start]'); queue.start(); await Promise.resolve(); queue.destroy(); oldStart.click(); resolve('Late'); await Promise.resolve(); await Promise.resolve();
    const state = queue.getState(), file = queue.getFiles()[0]; const again = createUploadQueue(el); again.destroy(); URL.revokeObjectURL = original; return { identical, revoked: revoked.length, aborted: signal.aborted, state: state[0].state, file: file.name, controls: el.querySelectorAll('.rf-upload-controls').length, rows: el.querySelectorAll('[data-rf-upload-id]').length };
  }); expect(result).toEqual({ identical: true, revoked: 1, aborted: true, state: 'cancelled', file: 'preview.png', controls: 0, rows: 0 });
});

test('native transport handles timeout, HTTP failure, cancellation and invalid endpoint options', async ({ page, request }) => {
  await page.goto(route); const ids = [randomUUID(), randomUUID()];
  const errors = await page.evaluate(async ids => { const { uploadFile } = await import('/src/js/upload-queue.js'), file = new File(['Timeout body'], 'timeout.txt', { type: 'text/plain' }), result = []; for (const options of [{ url: `/api/sample-uploads?name=timeout.txt&id=${ids[0]}`, timeout: 5 }, { url: '/api/not-an-upload' }, { url: 'javascript:alert(1)' }, { url: `/api/sample-uploads?name=timeout.txt&id=${ids[1]}`, signal: AbortSignal.abort() }]) { try { await uploadFile(options.url, file, { ...options, headers: { 'Content-Type': 'application/octet-stream' } }); result.push('Unexpected success'); } catch (error) { result.push(error.name + ': ' + error.message); } } return result; }, ids);
  expect(errors[0]).toContain('timed out'); expect(errors[1]).toContain('HTTP 404'); expect(errors[2]).toContain('HTTP upload endpoint'); expect(errors[3]).toContain('AbortError');
  for (const id of ids) { await expect.poll(async () => (await (await request.get('/api/sample-uploads')).json()).active.some(file => file.id === id)).toBe(false); expect((await request.get(`/api/sample-uploads/${id}`)).status()).toBe(404); }
});

test('queue errors, controls and progress remain accessible in both themes at narrow widths', async ({ page }) => {
  test.setTimeout(90000); await page.setViewportSize({ width: 390, height: 844 }); await page.goto(route); await page.getByLabel('Files to add', { exact: true }).setInputFiles([textFile('A-long-filename-that-should-wrap-without-growing-the-document.txt'), { name: 'wrong.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('Invalid') }]);
  for (const theme of ['light', 'dark']) {
    await page.evaluate(value => document.documentElement.dataset.rfTheme = value, theme);
    await page.evaluate(async () => { await Promise.all(document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); });
    const result = await new AxeBuilder({ page }).include('.preview').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze(); expect(result.violations).toEqual([]); expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.locator('.preview-shell').screenshot({ path: `output/playwright/rofin-upload-queue-${theme}-390.png` });
  }
});
