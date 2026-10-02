import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
const catalog = JSON.parse(readFileSync('docs/catalog.json', 'utf8'));

test('gallery search, category filters, and code copying work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/index.html');
  await expect(page.locator('h1')).toContainText('Beautiful components');
  await page.locator('#docs-search').fill('pricing');
  await expect(page.locator('.catalog-card')).toHaveCount(1);
  await page.locator('.catalog-card').click();
  await expect(page.locator('h1')).toHaveText('Pricing');
  await page.getByRole('button', { name: 'Copy code' }).first().click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('rf-pricing');
  await page.getByRole('button', { name: 'Narrow preview' }).click();
  await expect(page.locator('.preview')).toHaveClass(/narrow/);
});

test('dark theme persists and mobile navigation uses a labelled modal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/docs/index.html');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-rf-theme', 'dark');
  await page.getByRole('button', { name: 'Open documentation navigation' }).click();
  const menu = page.getByRole('dialog', { name: 'Explore Rofin UI' });
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'Accordion', exact: true }).click();
  await expect(menu).not.toBeVisible();
  await expect(page.locator('h1')).toHaveText('Accordion');
});

test('gallery category filter and empty-state search keep focus usable', async ({ page }) => {
  await page.goto('/docs/index.html#catalog');
  await page.getByRole('button', { name: `Effects · ${catalog.filter(item => item.category === 'Effects').length}` }).click();
  await expect(page.locator('.catalog-card')).toHaveCount(catalog.filter(item => item.category === 'Effects').length);
  await expect(page.getByRole('button', { name: `Effects · ${catalog.filter(item => item.category === 'Effects').length}` })).toBeFocused();
  await page.locator('#docs-search').fill('not-a-component-123');
  await expect(page.locator('.empty-results')).toBeVisible();
  await expect(page.locator('#docs-search')).toBeFocused();
});

test('documentation uses shared components across desktop and mobile routes', async ({ page }) => {
  test.setTimeout(90000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const theme of ['light', 'dark']) {
    await page.goto('/dist/site/index.html');
    await page.locator('html').evaluate((element, value) => { element.dataset.rfTheme = value; }, theme);
    await expect(page.locator('.showcase-panel.rf-card')).toHaveCount(3);
    await expect(page.locator('.catalog-card.rf-card--interactive')).toHaveCount(9);
    await page.keyboard.press('/');
    await expect(page.locator('#docs-search.rf-input')).toBeFocused();
    await page.locator('#docs-search').fill('no-such-component');
    await expect(page.locator('.rf-empty')).toContainText('No matching components');
    await page.locator('#docs-search').fill('');
    await page.goto('/dist/site/index.html#catalog');
    await page.getByRole('button', { name: 'All · ' + catalog.length }).click();
    await expect(page.locator('.category-filters button:not(.rf-button)')).toHaveCount(0);
    await expect(page.locator('.catalog-card')).toHaveCount(catalog.length);
    for (const route of ['home', 'catalog', 'saved', 'start', 'theming', 'api', 'principles', 'references']) {
      await page.goto(`/dist/site/index.html#${route}`);
      await expect(page.locator('#sidebar-nav [aria-current="page"]')).toHaveAttribute('href', `#${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      await page.locator('html').evaluate((element, value) => { element.dataset.rfTheme = value; }, theme);
      if (route === 'references') await page.getByRole('button', { name: 'Obsidian UI', exact: true }).click();
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(result.violations, `${theme}: ${route}`).toEqual([]);
      for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${theme}: ${route} at ${width}`).toBe(false);
        if (route === 'home' && width !== 768) await page.screenshot({ path: `output/playwright/rofin-${theme}-${width}.png` });
      }
    }
  }
  expect(errors).toEqual([]);
});

test('CSS and native controls remain useful with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/examples/index.html');
  await expect(page.getByRole('tab', { name: 'Overview', exact: true })).toBeVisible();
  await expect(page.locator('#example-tabs + .demo-stage [role="tabpanel"]')).toHaveCount(3);
  await page.locator('#example-accordion + .demo-stage summary').nth(1).click();
  await expect(page.locator('#example-accordion + .demo-stage details').nth(1)).toHaveAttribute('open', '');
  await page.getByRole('switch', { name: 'Enable notifications' }).uncheck();
  await expect(page.getByRole('switch', { name: 'Enable notifications' })).not.toBeChecked();
  await context.close();
});

test('composed dashboard filters data and form demos send no request', async ({ page }) => {
  await page.goto('/examples/dashboard.html');
  await page.getByRole('searchbox', { name: 'Filter projects' }).fill('website');
  await expect(page.locator('#filter-status')).toHaveText('1 of 2 rows');
  await expect(page.locator('#projects tbody tr:visible')).toHaveCount(1);
  await page.goto('/docs/index.html#component/contact');
  let posts = 0; page.on('request', request => { if (request.method() === 'POST') posts++; });
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill('Robin');
  await page.getByRole('textbox', { name: 'Email' }).fill('robin@example.com');
  await page.getByRole('textbox', { name: 'Message' }).fill('Hello');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('.rf-toast')).toContainText('No data was sent');
  expect(posts).toBe(0);
});

for (const theme of ['light', 'dark']) {
  test(`all gallery examples pass automated WCAG checks in ${theme} theme`, async ({ page }) => {
    test.setTimeout(300000);
    for (const item of catalog) {
      await page.goto(`/docs/index.html#component/${item.id}`);
      await expect(page.locator('.page-heading h1')).toHaveText(item.title);
      await page.locator('html').evaluate((element, value) => { element.dataset.rfTheme = value; }, theme);
      await page.evaluate(async () => {
        const animations = document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity);
        await Promise.all(animations.map(animation => animation.finished.catch(() => {})));
      });
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      expect(results.violations, `${theme}: ${item.id}: ${JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`).toEqual([]);
    }
  });
}

test('opened dialog and dropdown pass automated accessibility checks', async ({ page }) => {
  for (const id of ['dialog', 'drawer', 'dropdown']) {
    await page.goto(`/docs/index.html#component/${id}`);
    await page.locator('.preview > button, .preview > div > button').first().click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(results.violations, id).toEqual([]);
  }
});

test('gallery and page examples do not overflow narrow screens or log errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['/docs/index.html', '/docs/index.html#catalog', '/docs/index.html#component/hero', '/docs/index.html#component/pricing', '/docs/index.html#start', '/examples/landing.html', '/examples/dashboard.html']) {
    await page.goto(route);
    await page.waitForTimeout(80);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow, route).toBe(false);
  }
  expect(errors).toEqual([]);
});

test('built static documentation and download links work without source-tree routes', async ({ page }) => {
  const failures = [];
  page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
  await page.goto('/dist/site/index.html#start');
  await expect(page.locator('.page-heading h1')).toHaveText('Start with the web.');
  for (const name of ['Download built CSS', 'Download auto JavaScript']) {
    const href = await page.getByRole('link', { name }).getAttribute('href');
    const response = await page.request.get(new URL(href, page.url()).href);
    expect(response.ok()).toBe(true);
  }
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('A little progress, every day.');
  await page.getByRole('link', { name: /^Documentation/ }).click();
  await expect(page.locator('h1')).toContainText('Beautiful components');
  expect(failures).toEqual([]);
});

test('standalone minified script initializes native markup and exposes public APIs', async ({ page }) => {
  await page.goto('/tests/fixture.html');
  await page.evaluate(async () => { const { init } = await import('/src/js/index.js'); init()(); });
  await page.addStyleTag({ url: '/dist/rofin.css' });
  await page.addScriptTag({ url: '/dist/rofin.auto.js' });
  await page.getByRole('tab', { name: 'Two', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toHaveText('Second panel');
  expect(await page.evaluate(() => typeof window.Rofin.toast)).toBe('function');
});
