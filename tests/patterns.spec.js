import { test, expect } from '@playwright/test';

test('optional patterns work with native controls, validation, and teardown', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/index.html#component/image-compare');
  const range = page.getByRole('slider', { name: 'Comparison position' });
  await range.focus(); await range.press('End');
  await expect(page.locator('.rf-compare')).toHaveCSS('--rf-compare', '100%');

  await page.goto('/docs/index.html#component/number-stepper');
  await page.getByRole('spinbutton').fill('10');
  await page.getByRole('button', { name: 'Increase quantity' }).click();
  await expect(page.getByRole('spinbutton')).toHaveValue('10');
  await page.getByRole('button', { name: 'Decrease quantity' }).click();
  await expect(page.getByRole('spinbutton')).toHaveValue('9');

  await page.goto('/docs/index.html#component/like-button');
  const like = page.locator('[data-rf-like]');
  await like.click(); await expect(like).toHaveAttribute('aria-pressed', 'true');
  await expect(like).toContainText('129');
  await like.click(); await expect(like).toContainText('128');

  await page.goto('/docs/index.html#component/command-palette');
  await page.getByRole('button', { name: /Open commands/ }).click();
  await page.getByRole('searchbox', { name: 'Search commands' }).press('ArrowUp');
  await expect(page.locator('[data-rf-command-item="help"]')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-rf-command-item="new-project"]')).toBeFocused();
  await page.getByRole('searchbox', { name: 'Search commands' }).fill('no such command');
  await expect(page.locator('.rf-command [role="status"]')).toHaveText('0 commands available');
  await page.getByRole('searchbox', { name: 'Search commands' }).press('ArrowUp');
  await expect(page.getByRole('searchbox', { name: 'Search commands' })).toBeFocused();
  await page.getByRole('searchbox', { name: 'Search commands' }).fill('settings');
  await page.getByRole('searchbox', { name: 'Search commands' }).press('ArrowDown');
  await expect(page.locator('[data-rf-command-item="settings"]')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('.rf-command')).not.toBeVisible();
  await expect(page.locator('.rf-toast')).toContainText('settings');

  await page.goto('/docs/index.html#component/multi-step-form');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('textbox', { name: 'Project name' })).toBeFocused();
  await page.getByRole('textbox', { name: 'Project name' }).fill('A new idea');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('textbox', { name: 'Contact email' })).toBeFocused();
  await page.getByRole('textbox', { name: 'Contact email' }).fill('invalid');
  const toastCount = await page.locator('.rf-toast').count();
  await page.getByRole('button', { name: 'Finish demo' }).click();
  await expect(page.getByRole('textbox', { name: 'Contact email' })).toBeFocused();
  await expect(page.locator('.rf-toast')).toHaveCount(toastCount);
  await page.getByRole('textbox', { name: 'Contact email' }).fill('demo@example.com');
  await page.getByRole('button', { name: 'Finish demo' }).click();
  await expect(page.locator('.rf-toast').last()).toContainText('No data was sent');
  await page.locator('[name="project"]').evaluate(input => { input.value = ''; });
  await page.getByRole('button', { name: 'Finish demo' }).click();
  await expect(page.getByRole('textbox', { name: 'Project name' })).toBeFocused();
  await expect(page.locator('[data-rf-step-form] [role="status"]')).toHaveText('Step 1 of 2');
  await page.getByRole('textbox', { name: 'Project name' }).fill('Reset me');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('[data-rf-step-form]').evaluate(form => form.reset());
  await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveValue('');
  await expect(page.locator('[data-rf-step-form] [role="status"]')).toHaveText('Step 1 of 2');
  await page.goto('/docs/index.html#component/carousel');
  await page.getByRole('button', { name: 'Next cards' }).click();
  await expect.poll(() => page.locator('.rf-carousel__track').evaluate(element => element.scrollLeft)).toBeGreaterThan(200);

  await page.goto('/docs/index.html#component/copy-button');
  await page.getByRole('button', { name: 'Copy command' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('git clone');

  await page.evaluate(async () => {
    const { initPatterns } = await import('/src/js/patterns.js');
    const root = document.createElement('div');
    root.innerHTML = '<button data-rf-like aria-pressed="false">Like</button>';
    document.body.append(root);
    const destroy = initPatterns(root); destroy();
    root.firstElementChild.click();
    if (root.firstElementChild.getAttribute('aria-pressed') !== 'false') throw new Error('Pattern listener survived teardown');
    root.remove();
  });
});

test('reference catalog filters, new previews fit mobile, and static builds contain the optional module', async ({ page }) => {
  await page.goto('/docs/index.html#references');
  await page.getByRole('button', { name: 'Bencho', exact: true }).click();
  await page.locator('#docs-search').fill('compare');
  await expect(page.locator('.reference-row')).toHaveCount(1);
  await page.getByRole('link', { name: 'Related: Image comparison →' }).click();
  await expect(page.locator('h1')).toHaveText('Image comparison');
  await page.setViewportSize({ width: 375, height: 812 });
  for (const id of ['image-compare', 'carousel', 'command-palette', 'multi-step-form', 'marquee', 'dock', 'interest-picker', 'integration-map']) {
    await page.goto(`/docs/index.html#component/${id}`);
    await expect(page.locator('.page-heading h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), id).toBe(false);
  }
  await page.goto('/dist/site/index.html#component/image-compare');
  await page.getByRole('slider').focus(); await page.getByRole('slider').press('Home');
  await expect(page.locator('.rf-compare')).toHaveCSS('--rf-compare', '0%');
});
