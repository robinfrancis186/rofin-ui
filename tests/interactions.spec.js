import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/tests/fixture.html');
  await page.waitForFunction(() => window.rfReady);
});

test('tabs connect labels, skip disabled tabs, and support Home/End', async ({ page }) => {
  const tabs = page.getByRole('tab');
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toHaveText('First panel');
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.nth(3)).toBeFocused();
  await expect(page.getByRole('tabpanel')).toHaveText('Fourth panel');
  await page.keyboard.press('Home');
  await expect(tabs.nth(0)).toBeFocused();
  await page.keyboard.press('End');
  await expect(tabs.nth(3)).toBeFocused();
  const labels = await page.getByRole('tabpanel').evaluate(panel => ({ label: panel.getAttribute('aria-labelledby'), id: panel.id }));
  await expect(tabs.nth(3)).toHaveAttribute('id', labels.label);
  await expect(tabs.nth(3)).toHaveAttribute('aria-controls', labels.id);
});

test('manual tabs move focus without changing selection; RTL and vertical keys work', async ({ page }) => {
  await page.locator('#test-tabs').evaluate(element => { element.dataset.rfActivation = 'manual'; });
  await page.getByRole('tab').nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toHaveText('First panel');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('tabpanel')).toHaveText('Second panel');
  await page.locator('#test-tabs').evaluate(element => { element.dir = 'rtl'; });
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab').nth(3)).toBeFocused();
  await page.getByRole('tablist').evaluate(element => { element.setAttribute('aria-orientation', 'vertical'); });
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('tab').nth(1)).toBeFocused();
});

test('inserted tabsets initialize and disconnected/reconnected instances do not duplicate events', async ({ page }) => {
  await page.evaluate(() => {
    const clone = document.querySelector('#test-tabs').cloneNode(true);
    clone.id = 'inserted-tabs';
    clone.querySelectorAll('[role="tab"], [role="tabpanel"]').forEach(element => {
      element.removeAttribute('id'); element.removeAttribute('aria-controls'); element.removeAttribute('aria-labelledby');
    });
    window.changes = 0;
    clone.addEventListener('rf:tab-change', () => window.changes++);
    document.querySelector('#dynamic').append(clone);
  });
  const inserted = page.locator('#inserted-tabs');
  await expect(inserted.locator('[role="tab"]').nth(0)).toHaveAttribute('aria-controls', /rf-panel/);
  await inserted.getByRole('tab', { name: 'Two', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.changes)).toBe(1);
  await page.evaluate(() => { window.detached = document.querySelector('#inserted-tabs'); window.detached.remove(); });
  await page.waitForTimeout(30);
  await page.evaluate(() => document.querySelector('#dynamic').append(window.detached));
  await inserted.getByRole('tab', { name: 'Four', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.changes)).toBe(2);
});

test('initialization is idempotent and teardown makes panels readable', async ({ page }) => {
  const result = await page.evaluate(async () => {
    const { init } = await import('/src/js/index.js');
    const first = init(); const second = init(); const same = first === second;
    first(); return { same, visible: [...document.querySelectorAll('[role="tabpanel"]')].every(panel => !panel.hidden) };
  });
  expect(result).toEqual({ same: true, visible: true });
});

test('menu opens with keyboard, supports typeahead, and restores focus', async ({ page }) => {
  const trigger = page.locator('#menu-trigger');
  await trigger.focus(); await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Alpha' })).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Beta' })).toBeFocused();
  await page.keyboard.press('g');
  await expect(page.getByRole('menuitem', { name: 'Gamma' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Gamma' })).toBeFocused();
});

test('menu positioning stays within a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.locator('#menu-trigger').click();
  const box = await page.locator('#test-menu').boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(360);
  expect(box.y + box.height).toBeLessThanOrEqual(640);
});

test('native dialog traps focus, closes on Escape, and restores the trigger', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Open modal' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close modal' })).toBeFocused();
  await page.keyboard.press('Tab');
  // Native modal tab order may pass through browser chrome, but never background controls.
  const stayedModal = await page.evaluate(() => document.activeElement === document.body || document.querySelector('#test-dialog').contains(document.activeElement));
  expect(stayedModal).toBe(true);
  if (!await page.getByRole('textbox', { name: 'Name' }).evaluate(element => element === document.activeElement)) await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Name' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('opt-in backdrop dismissal does not close on interior whitespace', async ({ page }) => {
  await page.getByRole('button', { name: 'Open modal' }).click();
  const dialog = page.locator('#test-dialog');
  await dialog.click({ position: { x: 8, y: 8 } });
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).not.toBeVisible();
});

test('tooltips are visible on focus, dismiss with Escape, and reset after leaving', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Hint' });
  await trigger.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#test-tip')).not.toBeVisible();
  await page.locator('#toast-trigger').focus();
  await trigger.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
});

test('file details are text-only and reset with the form', async ({ page }) => {
  await page.locator('#test-files').setInputFiles({ name: '<img onerror=alert(1)>.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') });
  await expect(page.locator('[data-rf-file-list]')).toContainText('<img onerror=alert(1)>.txt · 5 B');
  await expect(page.locator('[data-rf-file-list] img')).toHaveCount(0);
  await page.getByRole('button', { name: 'Reset files' }).click();
  await expect(page.locator('[data-rf-file-list] li')).toHaveCount(0);
});

test('notifications escape content, persist when requested, and clean up', async ({ page }) => {
  await page.locator('#toast-trigger').focus();
  await page.evaluate(async () => {
    const { toast } = await import('/src/js/index.js');
    toast('<img src=x onerror=alert(1)>', { title: 'Safe text', duration: 0 });
  });
  await expect(page.locator('.rf-toast')).toContainText('<img src=x onerror=alert(1)>');
  await expect(page.locator('.rf-toast img')).toHaveCount(0);
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.locator('.rf-toast-region')).toHaveCount(0);
  await expect(page.locator('#toast-trigger')).toBeFocused();
});

test('Escape dismisses a tooltip inside a modal before closing the modal', async ({ page }) => {
  await page.evaluate(() => document.querySelector('#test-dialog').append(document.querySelector('.rf-tooltip')));
  await page.getByRole('button', { name: 'Open modal' }).click();
  await page.getByRole('button', { name: 'Hint' }).focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('#test-tip')).not.toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('notification expiration pauses on hover and keyboard focus', async ({ page }) => {
  await page.evaluate(async () => { const { toast } = await import('/src/js/index.js'); toast('Wait for me', { duration: 220 }); });
  await page.locator('.rf-toast').hover();
  await page.waitForTimeout(280);
  await expect(page.locator('.rf-toast')).toHaveCount(1);
  await page.getByRole('button', { name: 'Dismiss notification' }).focus();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(280);
  await expect(page.locator('.rf-toast')).toHaveCount(1);
  await page.locator('#toast-trigger').focus();
  await expect(page.locator('.rf-toast')).toHaveCount(0, { timeout: 1500 });
});

test('reduced-motion effects stay visible and avoid pointer tracking', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(async () => {
    const node = document.createElement('div');
    node.id = 'effect-test'; node.className = 'rf-card'; node.dataset.rfReveal = ''; node.dataset.rfSpotlight = ''; node.textContent = 'Visible content';
    node.dataset.rfTilt = ''; node.dataset.rfMagnetic = '';
    document.body.append(node);
    const { initEffects } = await import('/src/js/effects.js'); window.stopEffects = initEffects(node);
  });
  await expect(page.locator('#effect-test')).toHaveCSS('opacity', '1');
  await page.locator('#effect-test').hover();
  expect(await page.locator('#effect-test').evaluate(element => element.style.getPropertyValue('--rf-pointer-x'))).toBe('');
  expect(await page.locator('#effect-test').evaluate(element => element.style.getPropertyValue('--rf-tilt-x'))).toBe('');
  expect(await page.locator('#effect-test').evaluate(element => element.style.getPropertyValue('--rf-magnetic-x'))).toBe('');
  await page.evaluate(() => window.stopEffects());
  await expect(page.locator('#effect-test')).toBeVisible();
});
