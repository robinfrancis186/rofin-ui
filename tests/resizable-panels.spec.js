import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route = '/docs/index.html#component/resizable-panels';
const width = page => page.getByRole('slider', { name: 'First panel width', exact: true });
const height = page => page.getByRole('slider', { name: 'Preview panel height', exact: true });
const divider = page => page.getByRole('separator', { name: 'Project notes', exact: true });
const vertical = page => page.getByRole('separator', { name: 'Prototype preview', exact: true });
async function drag(page, handle, dx, dy = 0) {
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  // Firefox's simulated release outside its viewport is not delivered to the page.
  const viewport = page.viewportSize();
  await page.mouse.move(Math.max(1, Math.min(viewport.width - 1, box.x + box.width / 2 + dx)), Math.max(1, Math.min(viewport.height - 1, box.y + box.height / 2 + dy)), { steps: 5 });
}
const saved = (page, key) => page.evaluate(key => localStorage.getItem(`rf-panel:${key}`), key);

test('real divider drag and keyboard controls commit bounded independent nested splits', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto(route);
  await expect(divider(page)).toHaveAttribute('aria-orientation', 'vertical');
  const controlled = await divider(page).getAttribute('aria-controls');
  await expect(page.locator(`#${controlled}`)).toHaveAttribute('aria-label', 'Project notes');
  await page.evaluate(() => { window.panelEvents = []; document.querySelector('[data-rf-resizable]').addEventListener('rf:panel-resize', event => window.panelEvents.push(event.detail)); });
  await divider(page).focus(); await page.keyboard.press('ArrowRight'); await expect(width(page)).toHaveValue('41');
  await page.keyboard.press('Shift+ArrowRight'); await expect(width(page)).toHaveValue('51');
  await page.keyboard.press('Home'); await expect(width(page)).toHaveValue('25');
  await page.keyboard.press('End'); await expect(width(page)).toHaveValue('75');
  await page.keyboard.press('ArrowUp'); await expect(width(page)).toHaveValue('75');
  expect(await page.evaluate(() => window.panelEvents.length)).toBe(4);
  await drag(page, divider(page), -2000); await page.mouse.up(); await expect(width(page)).toHaveValue('25');
  expect(await saved(page, 'rofin-demo-panels')).toBe('25');
  await vertical(page).focus(); await page.keyboard.press('ArrowDown'); await expect(height(page)).toHaveValue('36');
  await expect(width(page)).toHaveValue('25'); await expect(vertical(page)).toHaveAttribute('aria-orientation', 'horizontal');
  await drag(page, vertical(page), 0, 70); await page.mouse.up();
  expect(Number(await height(page).inputValue())).toBeGreaterThan(36);
  const remembered = await height(page).inputValue(); await page.reload();
  await expect(width(page)).toHaveValue('25'); await expect(height(page)).toHaveValue(remembered);
  await page.locator('#workspace-panels').evaluate(node => { node.dir = 'rtl'; });
  await divider(page).focus(); await page.keyboard.press('ArrowLeft'); await expect(width(page)).toHaveValue('26');
  await page.keyboard.press('ArrowRight'); await expect(width(page)).toHaveValue('25');
  await drag(page, divider(page), -80); await page.mouse.up(); expect(Number(await width(page).inputValue())).toBeGreaterThan(25);
});

test('Escape, pointer cancellation, disabling and stacking cancel drafts without saving them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto(route);
  await divider(page).focus(); await page.keyboard.press('ArrowRight'); expect(await saved(page, 'rofin-demo-panels')).toBe('41');
  await drag(page, divider(page), 100); expect(Number(await width(page).inputValue())).toBeGreaterThan(41);
  await page.keyboard.press('Escape'); await page.mouse.up(); await expect(width(page)).toHaveValue('41');
  expect(await saved(page, 'rofin-demo-panels')).toBe('41'); await expect(divider(page)).toBeFocused();
  await divider(page).evaluate(node => node.addEventListener('pointerdown', event => { window.panelPointer = event.pointerId; }));
  await drag(page, divider(page), 100);
  await divider(page).evaluate(node => node.dispatchEvent(new PointerEvent('pointercancel', { pointerId: window.panelPointer }))); await page.mouse.up();
  await expect(width(page)).toHaveValue('41'); expect(await saved(page, 'rofin-demo-panels')).toBe('41');
  await drag(page, divider(page), 100);
  await divider(page).evaluate(node => node.releasePointerCapture(window.panelPointer)); await page.mouse.up();
  await expect(width(page)).toHaveValue('41'); expect(await saved(page, 'rofin-demo-panels')).toBe('41');
  await drag(page, divider(page), 100); await width(page).evaluate(node => { node.disabled = true; }); await page.mouse.up();
  await expect(width(page)).toHaveValue('41'); await expect(divider(page)).toBeDisabled();
  await width(page).evaluate(node => { node.disabled = false; }); await expect(divider(page)).toBeEnabled();
  await drag(page, divider(page), 100); await page.setViewportSize({ width: 320, height: 900 }); await page.mouse.up();
  await expect(width(page)).toHaveValue('41'); await expect(divider(page)).toBeHidden(); await expect(width(page)).toBeFocused();
  expect(await saved(page, 'rofin-demo-panels')).toBe('41');
  await expect(width(page)).toHaveAttribute('aria-valuetext', /stacked on this screen/);
  await page.setViewportSize({ width: 1440, height: 1000 }); await divider(page).focus();
  await page.setViewportSize({ width: 320, height: 900 }); await expect(width(page)).toBeFocused();
});

test('layout-only reset preserves text; native reset cancels safely and restores both defaults', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto(route);
  const note = page.getByRole('textbox', { name: 'Your next step' }); await note.fill('Keep this draft.');
  await divider(page).focus(); await page.keyboard.press('End'); await vertical(page).focus(); await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Reset panel width' }).click(); await expect(width(page)).toHaveValue('40');
  await expect(height(page)).toHaveValue('80'); await expect(note).toHaveValue('Keep this draft.'); expect(await saved(page, 'rofin-demo-panels')).toBeNull();
  await page.locator('form[data-rf-resizable]').evaluate(form => form.addEventListener('reset', event => event.preventDefault(), { once: true }));
  await page.getByRole('button', { name: 'Reset workspace' }).click(); await expect(height(page)).toHaveValue('80'); await expect(note).toHaveValue('Keep this draft.');
  await drag(page, vertical(page), 0, -80);
  await page.locator('form[data-rf-resizable]').evaluate(form => form.reset()); await page.mouse.up();
  await expect(width(page)).toHaveValue('40'); await expect(height(page)).toHaveValue('35');
  await expect(note).toHaveValue('Prepare the first prototype for review.'); expect(await saved(page, 'rofin-demo-panels-editor')).toBeNull();
});

test('invalid or unavailable storage leaves controls usable and teardown restores markup and active-drag state', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto('/docs/index.html#catalog');
  await page.evaluate(async () => {
    localStorage.setItem('rf-panel:rofin-demo-panels', '999'); localStorage.setItem('rf-panel:rofin-demo-panels-editor', '"35"');
    const { initPatterns } = await import('/src/js/patterns.js');
    const template = document.createElement('template'); template.innerHTML = await (await fetch('/examples/components/resizable-panels.html')).text();
    const root = template.content.firstElementChild; document.querySelector('#main').replaceChildren(root);
    window.stopPanels = initPatterns(root); window.startPanels = () => initPatterns(root);
  });
  await expect(width(page)).toHaveValue('40'); await expect(height(page)).toHaveValue('35');
  await divider(page).focus(); await page.keyboard.press('ArrowRight'); await drag(page, divider(page), 100);
  await page.evaluate(() => window.stopPanels()); await page.mouse.up(); await expect(width(page)).toHaveValue('41');
  await expect(page.locator('[data-rf-panel-divider]')).toHaveCount(0); await expect(width(page)).not.toHaveAttribute('aria-valuetext', /./);
  expect(await page.locator('#workspace-panels > aside').getAttribute('id')).toBeNull();
  expect(await page.locator('#workspace-panels').getAttribute('style')).toBe('');
  await page.evaluate(() => { window.stopPanels = window.startPanels(); }); await expect(page.locator('[data-rf-panel-divider]')).toHaveCount(2);
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new DOMException('denied', 'SecurityError'); }; });
  await divider(page).focus(); await page.keyboard.press('ArrowRight'); await expect(width(page)).toHaveValue('42');
  await expect(page.locator('form[data-rf-resizable] > [data-rf-panel-status]')).toContainText('storage is unavailable');
  await drag(page, divider(page), 100); await page.evaluate(() => window.dispatchEvent(new Event('pagehide'))); await page.mouse.up(); await expect(width(page)).toHaveValue('42');
  await page.evaluate(() => { window.stopPanels(); Storage.prototype.getItem = () => { throw new DOMException('denied', 'SecurityError'); }; window.stopPanels = window.startPanels(); });
  await expect(width(page)).toHaveValue('42'); await expect(divider(page)).toBeEnabled();
  await page.evaluate(() => { window.stopPanels(); const form = document.querySelector('form[data-rf-resizable]'), fieldset = document.createElement('fieldset'); form.before(fieldset); fieldset.append(form); window.stopPanels = window.startPanels(); fieldset.disabled = true; });
  await expect(divider(page)).toBeDisabled(); await expect(vertical(page)).toBeDisabled();
  await page.locator('#main > fieldset').evaluate(node => { node.disabled = false; }); await expect(divider(page)).toBeEnabled();
  await page.evaluate(() => { window.stopPanels(); document.querySelector('#workspace-panels').previousElementSibling.querySelector('input').max = 'invalid'; window.stopPanels = window.startPanels(); });
  await expect(divider(page)).toHaveCount(0); await expect(width(page)).toBeEnabled();
});

test('zero-bound splits collapse and restore through Enter and show all content when stacked', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto('/docs/index.html#catalog');
  await page.evaluate(async () => {
    const { initPatterns } = await import('/src/js/patterns.js');
    const root = document.createElement('section'); root.className = 'rf-resizable'; root.dataset.rfResizable = '';
    root.innerHTML = '<label>Width<input class="rf-range" type="range" min="0" max="100" value="40"></label><div class="rf-resizable__panels"><article aria-label="Collapsible pane">First content</article><article>Second content</article></div>';
    document.querySelector('#main').replaceChildren(root); initPatterns(root);
  });
  const handle = page.getByRole('separator', { name: 'Collapsible pane' }), pane = page.getByText('First content', { exact: true });
  await handle.focus(); await page.keyboard.press('Enter'); await expect(pane).toBeHidden(); await expect(handle).toHaveAttribute('aria-valuenow', '0');
  await page.keyboard.press('Enter'); await expect(pane).toBeVisible(); await expect(handle).toHaveAttribute('aria-valuenow', '40');
  await page.keyboard.press('End'); await expect(page.getByText('Second content', { exact: true })).toBeHidden();
  await page.setViewportSize({ width: 320, height: 900 }); await expect(pane).toBeVisible(); await expect(page.getByText('Second content', { exact: true })).toBeVisible();
});

test('dashboard composes shared panels with workspace-scoped layouts and preserves notes and files during layout reset', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto('/examples/dashboard.html');
  const desk = page.getByRole('slider', { name: 'Activity and notes width' }), activity = page.getByRole('slider', { name: 'Activity panel height' });
  await page.getByRole('separator', { name: 'Activity and notes', exact: true }).focus(); await page.keyboard.press('End'); await expect(desk).toHaveValue('70');
  await page.getByRole('separator', { name: 'Recent activity', exact: true }).focus(); await page.keyboard.press('End'); await expect(activity).toHaveValue('70');
  await page.getByRole('textbox', { name: 'Markdown note' }).fill('### Preserve the draft');
  await page.getByRole('button', { name: 'New text file', exact: true }).click();
  const dialog = page.locator('[data-rf-file-dialog]'); await dialog.getByLabel('Item name').fill('Layout test.txt'); await dialog.getByLabel('Text contents').fill('Keep these bytes.'); await dialog.getByRole('button', { name: 'Save file change' }).click();
  await page.getByRole('button', { name: 'Reset desk width' }).click(); await expect(desk).toHaveValue('45');
  await page.getByRole('button', { name: 'Reset activity height' }).click(); await expect(activity).toHaveValue('35');
  await expect(page.getByRole('textbox', { name: 'Markdown note' })).toHaveValue('### Preserve the draft'); await expect(page.getByRole('treeitem', { name: /Layout test.txt/ })).toBeVisible();
  await page.getByRole('separator', { name: 'Activity and notes', exact: true }).focus(); await page.keyboard.press('End');
  await page.getByRole('separator', { name: 'Recent activity', exact: true }).focus(); await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Switch workspace: Studio' }).click(); await page.getByRole('menuitem', { name: 'Personal workspace', exact: true }).click();
  await expect(desk).toHaveValue('45'); await expect(activity).toHaveValue('35'); await expect(page.locator('[data-rf-panel-divider]')).toHaveCount(2);
  await page.getByRole('separator', { name: 'Activity and notes', exact: true }).focus(); await page.keyboard.press('Home'); await expect(desk).toHaveValue('30');
  await page.goBack(); await expect(desk).toHaveValue('70'); await expect(activity).toHaveValue('70');
  await expect(page.getByRole('treeitem', { name: /Layout test.txt/ })).toBeVisible();
  await page.reload(); await expect(desk).toHaveValue('70'); await expect(activity).toHaveValue('70');
  await expect(page.getByRole('treeitem', { name: /Layout test.txt/ })).toHaveCount(0); await expect(page.getByRole('textbox', { name: 'Markdown note' })).not.toHaveValue('### Preserve the draft');
});

test('narrow themes, reduced motion, accessibility and real scripts-off fallback retain usable content', async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto(route);
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => { document.documentElement.dataset.rfTheme = theme; }, theme);
    for (const size of [320, 390, 1440]) {
      await page.setViewportSize({ width: size, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size);
      await expect(page.getByRole('textbox', { name: 'Your next step' })).toBeVisible();
      expect((await new AxeBuilder({ page }).include('.preview').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()).violations).toEqual([]);
    }
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 900 } });
  const fallback = await context.newPage(); await fallback.goto('/dist/site/examples/components/resizable-panels.html');
  await expect(fallback.getByRole('textbox', { name: 'Your next step' })).toHaveValue('Prepare the first prototype for review.');
  await expect(fallback.locator('[data-rf-panel-divider]')).toHaveCount(0); await expect(fallback.getByText('Make something tangible.', { exact: true })).toBeVisible();
  expect(await fallback.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320); await context.close();
});
