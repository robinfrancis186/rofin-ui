import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('tables page and filter all rows, retaining explicit selections and native reset', async ({ page }) => {
  await page.goto('/docs/index.html#component/bulk-actions');
  const status = page.locator('[data-rf-table-status]');
  const rows = page.locator('.preview tbody tr:visible');
  const selectPage = page.getByRole('checkbox', { name: 'Select this page', exact: true });
  await expect(rows).toHaveCount(3);
  await expect(status).toHaveText('1–3 of 6 rows. Page 1 of 2.');
  await page.getByRole('checkbox', { name: 'Select Studio website', exact: true }).check();
  await expect(selectPage).toHaveJSProperty('indeterminate', true);
  await selectPage.check();
  await expect(page.locator('[data-rf-table-selected]')).toContainText('3 selected');
  await page.getByRole('button', { name: 'Next page', exact: true }).press('Enter');
  await expect(status).toHaveText('4–6 of 6 rows. Page 2 of 2.');
  await expect(selectPage).not.toBeChecked();
  await page.getByRole('checkbox', { name: 'Select Component library', exact: true }).check();
  await page.getByRole('combobox', { name: 'Project status' }).selectOption('Draft');
  await expect(rows).toHaveCount(2);
  await expect(status).toHaveText('1–2 of 2 rows. Page 1 of 1.');
  await expect(page.locator('[data-rf-table-selected]')).toContainText('4 selected across all pages');
  await expect(selectPage).toHaveJSProperty('indeterminate', true);
  await page.getByRole('button', { name: 'Review selected', exact: true }).click();
  await expect(page.locator('.rf-toast')).toContainText('4 rows selected');
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('no-match');
  await expect(status).toHaveText('0–0 of 0 rows. Page 1 of 1.');
  await expect(page.locator('[data-rf-table-empty]')).toBeVisible();
  await expect(selectPage).toBeDisabled();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(status).toHaveText('1–3 of 6 rows. Page 1 of 2.');
  await expect(page.locator('[data-rf-table-selected]')).toContainText('0 selected');
  await page.getByRole('button', { name: 'Tasks', exact: true }).click();
  expect(await rows.locator('td:last-child').allTextContents()).toEqual(['3', '6', '8']);
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  expect(await rows.locator('td:last-child').allTextContents()).toEqual(['12', '16', '20']);
  await page.getByRole('combobox', { name: 'Rows per page' }).selectOption('6');
  await expect(rows).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Next page', exact: true })).toBeDisabled();
});

test('date ranges validate order, reset bounds, and preserve the unenhanced form', async ({ page }) => {
  await page.goto('/docs/index.html#component/date-range');
  const start = page.getByLabel('Start date', { exact: true });
  const end = page.getByLabel('End date', { exact: true });
  await start.fill('2026-10-10'); await end.fill('2026-10-01');
  await expect(end).toHaveAttribute('min', '2026-10-10');
  expect(await end.evaluate(input => input.validity.rangeUnderflow)).toBe(true);
  await page.getByRole('button', { name: 'Apply dates' }).click();
  await expect(page.locator('.rf-toast')).toHaveCount(0);
  await expect(end).toBeFocused();
  await page.getByRole('button', { name: 'Reset dates' }).click();
  await expect(end).toHaveAttribute('min', '2026-09-01');
  await expect(end).toHaveValue('2026-09-30');
  await page.evaluate(async () => {
    const { initPatterns } = await import('/src/js/patterns.js');
    const form = document.createElement('form'); form.innerHTML = '<div data-rf-date-range><input type="date" data-rf-date-start value="2026-10-10"><input type="date" data-rf-date-end min="2026-01-01"></div>';
    document.body.append(form); const stop = initPatterns(form);
    if (form.querySelector('[data-rf-date-end]').min !== '2026-10-10') throw Error('Start bound missing');
    stop(); if (form.querySelector('[data-rf-date-end]').min !== '2026-01-01') throw Error('Original bound lost'); form.remove();
  });
});

test('the composed dashboard completes local project, export, archive, inbox, and settings flows', async ({ page }) => {
  const errors = [], posts = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/dist/site/examples/dashboard.html');
  await page.getByLabel('Start date', { exact: true }).fill('2026-09-20');
  await page.getByRole('button', { name: 'Apply dates' }).click();
  await expect(page.locator('#filter-status')).toContainText('of 3 rows');
  await page.getByRole('button', { name: 'Clear date filter' }).click();
  await expect(page.locator('#filter-status')).toContainText('of 6 rows');
  await page.getByRole('button', { name: 'New project +', exact: true }).click();
  const create = page.getByRole('dialog', { name: 'Make room for a new idea.' });
  await create.getByRole('textbox', { name: 'Project name' }).fill('=SUM(1,2)');
  const owner = create.getByRole('combobox', { name: 'Project owner' });
  await owner.fill('Alex'); await owner.press('ArrowDown'); await owner.press('Enter');
  await create.getByRole('button', { name: 'Create project' }).click();
  await expect(create).not.toBeVisible();
  await expect(page.locator('[data-project-count]')).toHaveText('7');
  await page.getByRole('checkbox', { name: 'Select =SUM(1,2)', exact: true }).check();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export selected CSV' }).click();
  const download = await downloaded;
  expect(download.suggestedFilename()).toBe('studio-projects.csv');
  const csv = await readFile(await download.path(), 'utf8');
  expect(csv).toContain('"\'=SUM(1,2)","Alex","Draft","0"');
  expect(csv).not.toContain('Studio website');
  await page.getByRole('button', { name: 'Archive selected', exact: true }).click();
  const confirmation = page.getByRole('dialog', { name: 'Archive selected projects?' });
  await confirmation.getByRole('button', { name: 'Keep projects' }).click();
  await expect(page.locator('tr[data-rf-status="Archived"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Archive selected', exact: true }).click();
  await confirmation.getByRole('button', { name: 'Archive projects', exact: true }).click();
  await expect(page.locator('tr[data-rf-status="Archived"]')).toHaveCount(1);
  await expect(page.getByRole('searchbox', { name: 'Filter projects' })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Export selected CSV' })).toBeDisabled();
  await page.getByRole('combobox', { name: 'Project status' }).selectOption('Archived');
  await expect(page.locator('#projects tbody tr:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Notifications 2 unread', exact: true }).click();
  await page.getByRole('button', { name: 'Mark all read' }).click();
  await expect(page.locator('[data-rf-notifications-count]')).toHaveText('0');
  await expect(page.getByRole('button', { name: 'Mark all read' })).toBeDisabled();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Workspace settings' });
  await settings.getByRole('textbox', { name: 'Workspace name' }).fill('Orbit');
  await settings.getByRole('textbox', { name: 'Display name' }).fill('Alex Morgan');
  await settings.getByRole('combobox', { name: 'Time zone' }).selectOption('UTC');
  await settings.getByRole('switch', { name: 'Project updates', exact: true }).uncheck();
  await settings.getByRole('button', { name: 'Save preferences' }).click();
  await expect(page.locator('[data-display-name]')).toHaveText('Alex Morgan');
  await expect(page.locator('[data-workspace-name]').first()).toHaveText('Orbit');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await settings.getByRole('textbox', { name: 'Workspace name' }).fill('Unsaved');
  await settings.getByRole('button', { name: 'Discard changes' }).click();
  await expect(settings.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Orbit');
  await expect(settings.getByRole('combobox', { name: 'Time zone' })).toHaveValue('UTC');
  await expect(settings.getByRole('switch', { name: 'Project updates', exact: true })).not.toBeChecked();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Refresh sample' }).click();
  await expect(page.locator('#projects')).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('#projects')).not.toHaveAttribute('aria-busy', 'true');
  await page.reload();
  await expect(page.locator('[data-project-count]')).toHaveText('6');
  expect(posts).toEqual([]); expect(errors).toEqual([]);
});

test('website and dashboard layouts, exposed overlays, and chart data are accessible in both themes', async ({ page }) => {
  test.setTimeout(90000);
  for (const theme of ['light', 'dark']) {
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto('/dist/site/examples/dashboard.html');
    if (theme === 'dark') await page.getByRole('button', { name: 'Dark theme', exact: true }).click();
    // Read live painted controls: Firefox keeps transitions inside closed details pending.
    await page.waitForFunction(() => document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity && animation.effect.target.checkVisibility({ contentVisibilityAuto: true })).every(animation => animation.playState !== 'running' && !animation.pending));
    const axe = () => new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect((await axe()).violations, `Dashboard ${theme}`).toEqual([]);
    await page.getByText('View chart data', { exact: true }).click();
    const heights = await page.locator('.rf-chart__bars i').evaluateAll(bars => bars.map(bar => bar.getBoundingClientRect().height));
    expect(heights[0] / heights[2]).toBeCloseTo(36 / 18, 2);
    await expect(page.getByRole('table', { name: 'Tasks by current project status', exact: true })).toBeVisible();
    expect((await axe()).violations, `Chart data ${theme}`).toEqual([]);
    await page.getByText('View chart data', { exact: true }).click();
    for (const label of ['Notifications 2 unread', 'Settings', 'New project +']) {
      await page.getByRole('button', { name: label, exact: true }).click();
      expect((await axe()).violations, `${label} ${theme}`).toEqual([]);
      await page.keyboard.press('Escape');
    }
    await page.screenshot({ path: `output/playwright/rofin-dashboard-${theme}.png` });
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `Dashboard ${theme} ${width}`).toBe(false);
      if (width === 320) await page.screenshot({ path: `output/playwright/rofin-dashboard-${theme}-mobile.png` });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/dist/site/examples/landing.html');
  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, theme) => { element.dataset.rfTheme = theme; }, theme);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
    expect(results.violations, `Website ${theme}`).toEqual([]);
  }
  await page.setViewportSize({ width: 320, height: 900 });
  await page.getByText('Menu', { exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile website' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Mobile website' }).getByRole('link', { name: 'Pricing', exact: true }).click();
  await expect(page).toHaveURL(/#pricing$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.goto('/docs/index.html#coverage');
  await expect(page.locator('.coverage-table tbody tr')).toHaveCount(12);
  await expect(page.locator('.coverage-table').getByRole('link', { name: 'Prism lab', exact: true })).toHaveAttribute('href', '#component/prism-lab');
  await page.getByRole('link', { name: 'Paginated table', exact: true }).last().click();
  await expect(page.locator('.page-heading h1')).toHaveText('Paginated table');
  await page.setViewportSize({ width: 320, height: 900 });
  for (const id of ['website-header', 'app-shell', 'dashboard-metrics', 'bar-chart', 'donut-chart', 'paginated-table', 'bulk-actions', 'notification-center', 'date-range', 'account-settings', 'sign-up', 'password-reset', 'upload', 'subscription', 'invoice-history', 'usage']) {
    await page.goto(`/docs/index.html#component/${id}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${id} at 320`).toBe(false);
  }
});
