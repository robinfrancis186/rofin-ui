import { test, expect } from '@playwright/test';

test('passwords, composers, and tag fields preserve native form behavior', async ({ page }) => {
  await page.goto('/docs/index.html#component/password-field');
  const password = page.locator('#reveal-password');
  await password.fill('sample-only-123');
  await page.getByRole('button', { name: 'Show password', exact: true }).press('Space');
  await expect(password).toHaveAttribute('type', 'text');
  await expect(password).toHaveValue('sample-only-123');
  await expect(page.getByRole('button', { name: 'Show password', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(password).toHaveAttribute('type', 'password');
  await expect(password).toHaveValue('');

  await page.goto('/docs/index.html#component/character-counter');
  await page.getByRole('textbox', { name: 'Your bio' }).fill('Hello 👋');
  await expect(page.locator('[data-rf-count]')).toHaveText('8 / 160 characters');
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.locator('[data-rf-count]')).toHaveText('0 / 160 characters');
  await page.getByRole('textbox', { name: 'Your bio' }).pressSequentially('a'.repeat(165));
  await expect(page.getByRole('textbox', { name: 'Your bio' })).toHaveValue('a'.repeat(160));

  await page.goto('/docs/index.html#component/tag-input');
  const tag = page.getByRole('textbox', { name: 'Project topics' });
  await tag.fill('Motion'); await tag.press('Enter');
  await expect(page.locator('[data-rf-tag-list] li')).toHaveCount(3);
  expect(await page.locator('form').evaluate(form => new FormData(form).getAll('topics'))).toEqual(['Design', 'Accessibility', 'Motion']);
  await tag.fill('design'); await tag.press('Enter');
  await expect(page.locator('[data-rf-tags] [role="status"]')).toHaveText('That tag is already included.');
  await tag.fill('<b>Ideas</b>'); await page.getByRole('button', { name: 'Add tag' }).click();
  await expect(page.locator('[data-rf-tag-list] b')).toHaveCount(0);
  await expect(page.locator('[data-rf-tag-list]')).toContainText('<b>Ideas</b>');
  await tag.fill('Community'); await tag.press('Enter');
  await tag.fill('Too many'); await tag.press('Enter');
  await expect(page.locator('[data-rf-tags] [role="status"]')).toContainText('Choose up to 5 tags');
  await page.getByRole('button', { name: 'Remove Motion', exact: true }).click();
  await expect(tag).toBeFocused();
  await page.getByRole('button', { name: 'Reset topics' }).click();
  await expect.poll(() => page.locator('form').evaluate(form => new FormData(form).getAll('topics'))).toEqual(['Design', 'Accessibility']);
  await tag.fill('Private draft');
  await page.locator('form').evaluate(form => {
    form.addEventListener('reset', event => event.preventDefault(), { once: true });
    form.reset();
  });
  await expect(tag).toHaveValue('Private draft');
  await expect(page.locator('[data-rf-tag-list] li')).toHaveCount(2);
  await page.evaluate(async () => {
    const { initPatterns } = await import('/src/js/patterns.js');
    const root = document.createElement('div');
    root.innerHTML = '<div data-rf-password><input type="password"><button type="button" data-rf-password-toggle hidden>Show</button></div>';
    document.body.append(root);
    const stop = initPatterns(root);
    root.querySelector('button').click();
    if (root.querySelector('input').type !== 'text') throw new Error('Reveal did not initialize');
    stop();
    root.querySelector('button').click();
    if (root.querySelector('input').type !== 'password' || !root.querySelector('button').hidden) throw new Error('Teardown did not conceal the password');
    root.remove();
  });
});

test('tables sort numbers correctly and progress and billing reflect their controls', async ({ page }) => {
  await page.goto('/docs/index.html#component/data-table');
  const table = page.locator('.preview table');
  const tasks = page.getByRole('button', { name: 'Tasks', exact: true });
  await tasks.press('Enter');
  expect(await table.locator('tbody tr td:last-child').allTextContents()).toEqual(['3', '8', '12', '20']);
  await expect(tasks.locator('..')).toHaveAttribute('aria-sort', 'ascending');
  await tasks.press('Enter');
  expect(await table.locator('tbody tr td:last-child').allTextContents()).toEqual(['20', '12', '8', '3']);
  await page.getByRole('searchbox', { name: 'Find a project' }).fill('Robin');
  await expect(table.locator('tbody tr:visible')).toHaveCount(2);
  await page.getByRole('button', { name: 'Project', exact: true }).click();
  await expect(table.locator('th[aria-sort]')).toHaveCount(1);
  await page.getByRole('searchbox', { name: 'Find a project' }).fill('nothing-here');
  await expect(page.locator('[data-rf-table-status]')).toHaveText('0 of 4 rows');

  await page.goto('/docs/index.html#component/launch-checklist');
  await page.getByRole('checkbox', { name: /Make your first version/ }).check();
  await page.getByRole('checkbox', { name: /Share it with someone/ }).check();
  await expect(page.locator('progress')).toHaveJSProperty('value', 3);
  await expect(page.locator('[data-rf-check-status]')).toContainText('All set');
  await page.getByRole('button', { name: 'Reset checklist' }).click();
  await expect(page.locator('progress')).toHaveJSProperty('value', 1);

  await page.goto('/docs/index.html#component/billing-switch');
  await page.getByRole('radio', { name: /Yearly/ }).check();
  expect(await page.locator('[data-rf-yearly]').allTextContents()).toEqual(['$8', '$20']);
  expect(await page.locator('[data-rf-billing-note]').allTextContents()).toEqual(['per month, billed yearly', 'per month, billed yearly']);
  await page.getByRole('radio', { name: 'Monthly', exact: true }).check();
  expect(await page.locator('[data-rf-monthly]').allTextContents()).toEqual(['$10', '$25']);
  await page.setViewportSize({ width: 320, height: 900 });
  for (const id of ['password-field', 'character-counter', 'tag-input', 'data-table', 'launch-checklist', 'billing-switch']) {
    await page.goto(`/docs/index.html#component/${id}`);
    await expect(page.locator('.page-heading h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), id).toBe(false);
  }
});

test('saved components persist, search, and share deduplicated setup', async ({ page, context, browserName }) => {
  if (browserName === 'chromium') await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/dist/site/index.html#saved');
  await expect(page.locator('.rf-empty')).toContainText('Make room for a good idea');
  await page.goto('/dist/site/index.html#catalog');
  const saveTag = page.getByRole('button', { name: 'Save Tag input', exact: true });
  await saveTag.focus(); await saveTag.press('Enter'); await expect(saveTag).toBeFocused();
  await page.getByRole('button', { name: 'Save Password reveal', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Save Tag input', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('link', { name: 'Saved collection · 2', exact: true }).click();
  await expect(page.locator('.catalog-card')).toHaveCount(2);
  await page.screenshot({ path: 'output/playwright/rofin-collection.png', fullPage: true });
  await page.getByRole('button', { name: 'Copy code' }).click();
  const setup = await page.locator('.code-panel code').textContent();
  if (browserName === 'chromium') expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(setup);
  else await expect.poll(() => page.evaluate(() => document.querySelector('.code-panel button').textContent === 'Copied' || getSelection().toString() === document.querySelector('.code-panel code').textContent)).toBe(true);
  expect(setup.match(/patterns\.css/g)).toHaveLength(1);
  expect(setup.match(/initPatterns\(\)/g)).toHaveLength(1);
  await page.locator('#docs-search').fill('tags');
  await expect(page.locator('.catalog-card')).toHaveCount(1);
  await page.locator('#docs-search').fill('');
  await page.getByRole('button', { name: 'Save Tag input', exact: true }).click();
  await expect(page.locator('.catalog-card')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Save Password reveal', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Save Password reveal', exact: true }).click();
  await expect(page.locator('.rf-empty')).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'output/playwright/rofin-saved-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/dist/site/index.html#home');
  await expect(page.getByRole('heading', { name: 'Made for the moments that matter.' })).toBeVisible();
  await page.locator('.metrics').evaluate(element => window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 100));
  await page.screenshot({ path: 'output/playwright/rofin-product-patterns.png' });
});
