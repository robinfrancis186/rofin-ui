import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const switchTo = async (page, name) => {
  await page.locator('[data-dashboard-workspace-trigger]').click();
  await page.getByRole('menuitem', { name: `${name} workspace`, exact: true }).click();
};
const createProject = async (page, name) => {
  await page.getByRole('button', { name: 'New project +', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Make room for a new idea.' });
  await dialog.getByRole('textbox', { name: 'Project name' }).fill(name);
  await dialog.getByRole('button', { name: 'Create project', exact: true }).click();
};

test('workspace menus use labelled typeahead, skip disabled entries, and navigate from the gallery', async ({ page }) => {
  await page.goto('/dist/site/index.html#component/workspace-switcher');
  const trigger = page.getByRole('button', { name: 'Switch workspace: Studio', exact: true });
  await trigger.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Lab workspace', exact: true })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('menuitem', { name: 'Studio workspace', exact: true })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Lab workspace', exact: true })).toBeFocused();
  await page.keyboard.type('personal');
  const personal = page.getByRole('menuitem', { name: 'Personal workspace', exact: true });
  await expect(personal).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await personal.press('Enter');
  await expect(page).toHaveURL(/\/dist\/site\/examples\/dashboard\.html\?workspace=personal#overview$/);
  await expect(page.locator('[data-project-count]')).toHaveText('2');
  await expect(page.locator('[data-workspace-revenue]')).toHaveText('$420');
});

test('account menus open profile deep links and preserve the active workspace when navigating', async ({ page }) => {
  await page.goto('/docs/index.html#component/account-menu');
  await page.getByRole('button', { name: 'Account menu for Robin Francis', exact: true }).press('ArrowDown');
  await page.getByRole('menuitem', { name: 'Profile & preferences', exact: true }).press('Enter');
  await expect(page).toHaveURL(/workspace=studio&panel=account#overview$/);
  const settings = page.getByRole('dialog', { name: 'Workspace settings' });
  await expect(settings.getByRole('textbox', { name: 'Display name' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/panel=/);
  await switchTo(page, 'Lab');
  await createProject(page, 'Keep this experiment');
  const account = page.getByRole('button', { name: 'Account menu for Robin Francis', exact: true });
  await account.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Documentation & help', exact: true })).toBeFocused();
  await expect(page.getByRole('menuitem', { name: 'Sign out', exact: true })).toBeDisabled();
  await page.keyboard.press('Home');
  await page.getByRole('menuitem', { name: 'Profile & preferences', exact: true }).press('Enter');
  await expect(settings.getByRole('textbox', { name: 'Display name' })).toBeFocused();
  await expect(settings.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Lab');
  await page.keyboard.press('Escape');
  await account.click();
  await page.getByRole('menuitem', { name: 'Your projects', exact: true }).click();
  await expect(page).toHaveURL(/workspace=lab#projects$/);
  await expect(page.locator('[data-project-count]')).toHaveText('4');
  await expect(page.getByRole('navigation', { name: 'Workspace', exact: true }).getByRole('link', { name: 'Projects', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.rf-breadcrumb [aria-current="page"]')).toHaveText('Projects');
});

test('workspace project, inbox and preferences state remains isolated while selections and filters clear', async ({ page }) => {
  const errors = [], posts = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/dist/site/examples/dashboard.html');
  await createProject(page, 'Studio only');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const settings = page.getByRole('dialog', { name: 'Workspace settings' });
  await settings.getByRole('textbox', { name: 'Workspace name' }).fill('Orbit');
  await settings.getByRole('textbox', { name: 'Display name' }).fill('Alex Morgan');
  await settings.getByRole('combobox', { name: 'Time zone' }).selectOption('UTC');
  await settings.getByRole('switch', { name: 'Project updates', exact: true }).uncheck();
  await settings.getByRole('switch', { name: 'Weekly digest', exact: true }).check();
  await settings.getByRole('button', { name: 'Save preferences' }).click();
  await page.getByRole('button', { name: 'Notifications 2 unread', exact: true }).click();
  await page.getByRole('button', { name: 'Mark all read', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('checkbox', { name: 'Select Studio only', exact: true }).check();
  await page.getByRole('searchbox', { name: 'Filter projects' }).fill('Studio only');
  await page.getByRole('button', { name: 'Tasks', exact: true }).click();
  await switchTo(page, 'Personal');
  await expect(page.locator('[data-project-count]')).toHaveText('2');
  await expect(page.locator('#projects tbody tr')).toHaveCount(2);
  await expect(page.locator('#project-board [data-rf-kanban-item]')).toHaveCount(2);
  await expect(page.getByRole('searchbox', { name: 'Filter projects' })).toHaveValue('');
  await expect(page.locator('[data-rf-table-selected]')).toContainText('0 selected');
  await expect(page.getByRole('button', { name: 'Export selected CSV' })).toBeDisabled();
  await expect(page.locator('th[aria-sort]')).toHaveCount(0);
  await expect(page.locator('[data-rf-notifications-count]')).toHaveText('1');
  await expect(page.locator('[data-workspace-team] .rf-avatar')).toHaveCount(1);
  await createProject(page, 'Personal only');
  await page.getByRole('checkbox', { name: 'Select Personal only', exact: true }).check();
  await switchTo(page, 'Lab');
  await expect(page.locator('#projects tbody tr')).toHaveCount(3);
  await expect(page.locator('[data-workspace-revenue]')).toHaveText('$2,160');
  await expect(page.locator('.rf-chart__ring text')).toHaveText('48%');
  await expect(page.locator('[data-workspace-team] .rf-avatar')).toHaveCount(2);
  await switchTo(page, 'Orbit');
  await expect(page.locator('[data-project-count]')).toHaveText('7');
  await expect(page.locator('#projects tbody tr').filter({ hasText: 'Personal only' })).toHaveCount(0);
  await expect(page.locator('[data-rf-notifications-count]')).toHaveText('0');
  await expect(page.locator('#projects input[value="project-7"]')).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Account menu for Alex Morgan', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(settings.getByRole('textbox', { name: 'Workspace name' })).toHaveValue('Orbit');
  await expect(settings.getByRole('combobox', { name: 'Time zone' })).toHaveValue('UTC');
  await expect(settings.getByRole('switch', { name: 'Weekly digest', exact: true })).toBeChecked();
  await expect(settings.getByRole('switch', { name: 'Project updates', exact: true })).not.toBeChecked();
  await page.keyboard.press('Escape');
  await switchTo(page, 'Personal');
  await expect(page.locator('[data-project-count]')).toHaveText('3');
  await expect(page.locator('#projects input[value="project-3"]')).not.toBeChecked();
  await page.reload();
  await expect(page.locator('[data-project-count]')).toHaveText('2');
  expect(errors).toEqual([]); expect(posts).toEqual([]);
});

test('history restores workspace context, cancels unsaved dialogs and handles unknown public samples', async ({ page }) => {
  await page.goto('/dist/site/examples/dashboard.html');
  await switchTo(page, 'Personal');
  await switchTo(page, 'Lab');
  await page.goBack();
  await expect(page.locator('[data-project-count]')).toHaveText('2');
  await page.goForward();
  await expect(page.locator('[data-project-count]')).toHaveText('3');
  await page.getByRole('button', { name: 'New project +', exact: true }).click();
  const create = page.getByRole('dialog', { name: 'Make room for a new idea.' });
  await create.getByRole('textbox', { name: 'Project name' }).fill('An unsaved Lab idea');
  await page.goBack();
  await expect(create).not.toBeVisible();
  await expect(page.locator('[data-project-count]')).toHaveText('2');
  await page.getByRole('button', { name: 'New project +', exact: true }).click();
  await expect(create.getByRole('textbox', { name: 'Project name' })).toHaveValue('');
  await expect(create.getByRole('combobox', { name: 'Project owner' })).toHaveValue('Robin');
  await page.keyboard.press('Escape');
  await page.goto('/dist/site/examples/dashboard.html?workspace=unknown&panel=account#projects');
  await expect(page).toHaveURL(/workspace=studio&panel=account#projects$/);
  await expect(page.locator('[data-workspace-status]')).toHaveText('Unknown public sample workspace. Studio is shown.');
  await expect(page.getByRole('dialog', { name: 'Workspace settings' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/panel=/);
});

test('workspace and account controls stay accessible with long labels, RTL and both narrow-screen themes', async ({ page }) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light', 'dark']) {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/dist/site/examples/dashboard.html?workspace=lab#overview');
    if (theme === 'dark') await page.getByRole('button', { name: 'Dark theme', exact: true }).click();
    await page.locator('[data-dashboard-workspace-trigger]').click();
    await expect(page.getByRole('menuitem', { name: 'Studio workspace', exact: true })).toBeFocused();
    await page.screenshot({ path: `output/playwright/rofin-workspaces-${theme}-390.png` });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Settings', exact: true }).click();
    const settings = page.getByRole('dialog', { name: 'Workspace settings' });
    await settings.getByRole('textbox', { name: 'Workspace name' }).fill('A'.repeat(60));
    await settings.getByRole('textbox', { name: 'Display name' }).fill('B'.repeat(80));
    await settings.getByRole('button', { name: 'Save preferences' }).click();
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      if (width === 320) await page.locator('html').evaluate(element => { element.dir = 'rtl'; });
      for (const trigger of ['[data-dashboard-workspace-trigger]', '[data-dashboard-account-trigger]']) {
        await page.locator(trigger).click();
        const menu = page.locator('[role="menu"]:visible');
        await expect(menu).toHaveCount(1);
        await expect.poll(() => menu.evaluate(element => { const r = element.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; }), { message: `${theme} ${width} ${trigger}` }).toBe(true);
        expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze()).violations).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
        if (width === 390 && trigger.includes('workspace')) await page.screenshot({ path: `output/playwright/rofin-workspaces-${theme}-long-390.png` });
        await page.keyboard.press('Escape');
      }
    }
  }
});

test('native workspace menus retain real navigation and an honest static fallback without scripts', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:4173/dist/site/examples/dashboard.html');
    await page.getByRole('button', { name: 'Switch workspace: Studio', exact: true }).click();
    await expect(page.getByRole('menu', { name: 'Workspaces', exact: true })).toBeVisible();
    const navigation = page.waitForNavigation();
    await page.getByRole('menuitem', { name: 'Personal workspace', exact: true }).click();
    expect((await navigation).status()).toBe(200);
    await expect(page).toHaveURL(/workspace=personal#overview$/);
    await expect(page.locator('noscript p')).toContainText('static Studio sample remains readable');
    await expect(page.locator('#projects tbody tr:visible')).toHaveCount(6);
    await page.getByRole('button', { name: 'Account menu for Robin Francis', exact: true }).click();
    await expect(page.getByRole('menu', { name: 'Account', exact: true })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Your projects', exact: true })).toHaveAttribute('href', /dashboard\.html\?workspace=studio#projects$/);
    await expect(page.getByRole('menuitem', { name: 'Sign out', exact: true })).toBeDisabled();
  } finally { await context.close(); }
});
