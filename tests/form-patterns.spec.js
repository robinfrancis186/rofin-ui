import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('combobox commits available values, handles composition, cancellation, reset and teardown', async ({ page }) => {
  await page.goto('/docs/index.html#component/combobox');
  const input = page.getByRole('combobox', { name: 'Project template' });
  const value = () => page.locator('.preview form').evaluate(form => new FormData(form).get('template'));
  await expect(input).toHaveValue('Website launch');
  await input.fill('dashboard');
  await input.evaluate(node => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true })));
  await expect(input).toHaveValue('dashboard');
  await input.press('ArrowDown'); await input.press('Enter');
  await expect(input).toHaveValue('Analytics dashboard'); expect(await value()).toBe('dashboard');
  await input.fill('Other'); await input.press('Escape');
  await expect(input).toHaveValue('Analytics dashboard'); expect(await value()).toBe('dashboard');
  await input.fill('Mobile'); await input.press('ArrowDown');
  await expect(input).not.toHaveAttribute('aria-activedescendant', /.+/);
  await expect(page.locator('.rf-combobox [role="status"]')).toHaveText('0 options available');
  expect(await input.evaluate(node => node.checkValidity())).toBe(false);
  await input.press('Escape'); await input.fill('No matching option');
  await page.getByRole('button', { name: 'Use template' }).click();
  await expect(page.locator('.rf-toast')).toHaveCount(0); expect(await value()).toBe('');
  await page.getByRole('button', { name: 'Reset template' }).click();
  await expect(input).toHaveValue('Website launch');
  await input.fill('Online store');
  await page.locator('.preview form').evaluate(form => { form.addEventListener('reset', event => event.preventDefault(), { once: true }); form.reset(); });
  await expect(input).toHaveValue('Online store'); expect(await value()).toBe('store');
  await page.locator('#project-template').evaluate(select => { select.disabled = true; });
  await expect(input).toBeDisabled(); expect(await value()).toBe(null);
  await page.evaluate(async () => {
    const { initFormPatterns } = await import('/src/js/form-patterns.js');
    const root = document.createElement('form'); root.innerHTML = '<div data-rf-combobox><label for="fallback-choice">Choice</label><select id="fallback-choice" name="choice" required><option value="a">Alpha</option></select></div>';
    document.body.append(root); const stop = initFormPatterns(root); root.reset(); stop();
    if (root.querySelector('[role="combobox"]') || root.querySelector('select').hidden || !root.querySelector('select').required || root.querySelector('label').htmlFor !== 'fallback-choice') throw Error('Native fallback was not restored');
    root.remove();
  });
  await page.goto('/docs/index.html#component/autocomplete');
  const topic = page.getByLabel('Project topic'); await topic.fill('A topic of my own');
  expect(await page.locator('.preview form').evaluate(form => new FormData(form).get('topic'))).toBe('A topic of my own');
  await page.getByRole('button', { name: 'Reset topic' }).click(); await expect(topic).toHaveValue('');
  await topic.evaluate(input => { input.disabled = true; }); await expect(topic).toBeDisabled();
});

test('multiselect filters and preserves repeated native values, disabled choices and reset', async ({ page }) => {
  await page.goto('/docs/index.html#component/multiselect');
  await expect(page.locator('.preview label label')).toHaveCount(0);
  const values = () => page.locator('.preview form').evaluate(form => new FormData(form).getAll('skills'));
  const search = page.getByRole('searchbox', { name: 'Search choices' });
  await search.fill('engineer');
  await page.getByRole('checkbox', { name: 'Engineering', exact: true }).press('Space');
  expect(await values()).toEqual(['design','engineering']);
  await expect(page.getByRole('checkbox', { name: 'Design', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Remove Design', exact: true }).click();
  expect(await values()).toEqual(['engineering']); await expect(search).toBeFocused();
  await search.fill('no matches');
  await expect(page.locator('[data-rf-multiselect] [role="status"]')).toHaveText('1 selected. 0 choices shown.');
  await page.getByRole('button', { name: 'Clear selection' }).click(); expect(await values()).toEqual([]);
  await page.getByRole('button', { name: 'Save skills' }).click();
  await expect(page.locator('.rf-toast')).toHaveCount(0); await expect(search).toBeFocused();
  await page.getByRole('button', { name: 'Reset skills' }).click();
  await expect.poll(values).toEqual(['design']); await expect(search).toHaveValue('');
  await expect(page.getByRole('checkbox', { name: 'Video · unavailable' })).toBeDisabled();
  await page.locator('#project-skills').evaluate(select => { select.disabled = true; });
  await expect(search).toBeDisabled(); await expect(page.getByRole('button', { name: 'Remove Design', exact: true })).toBeDisabled(); expect(await values()).toEqual([]);
});

test('validation summary focuses errors, preserves descriptions and never submits invalid data', async ({ page }) => {
  await page.goto('/docs/index.html#component/form-error-summary');
  const summary = page.locator('[data-rf-errors]'), name = page.getByRole('textbox', { name: 'Your name' }), email = page.getByRole('textbox', { name: 'Email address' });
  await page.getByRole('button', { name: 'Check form' }).click();
  await expect(summary).toBeFocused(); await expect(summary.locator('a')).toHaveCount(2); await expect(page.locator('.rf-toast')).toHaveCount(0);
  await summary.getByRole('link', { name: /^Your name:/ }).click();
  await expect(name).toBeFocused(); await expect(page).toHaveURL(/#component\/form-error-summary$/);
  await name.fill('Robin'); await email.fill('invalid');
  await expect(name).not.toHaveAttribute('aria-invalid', 'true'); await expect(summary.locator('a')).toHaveCount(1);
  await expect(email).toHaveAttribute('aria-describedby', /^summary-email-help rf-error-/);
  await page.getByRole('button', { name: 'Reset form' }).click();
  await expect(summary).toBeHidden(); await expect(email).toHaveAttribute('aria-describedby', 'summary-email-help'); await expect(page.locator('.rf-error')).toHaveCount(0);
  await name.fill('Robin'); await email.fill('robin@example.com');
  await page.getByRole('button', { name: 'Check form' }).click();
  await expect(page.locator('.rf-toast')).toContainText('No data was sent');
});

test('calendar keeps native values, keyboard month edges, leap dates and bounds in sync', async ({ page }) => {
  await page.goto('/docs/index.html#component/calendar');
  const date = page.getByLabel('Launch date', { exact: true }), day = value => page.locator(`[data-rf-date="${value}"]`);
  await day('2026-10-02').focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
  await expect(date).toHaveValue('2026-10-03');
  await expect(day('2026-10-03')).toBeFocused();
  await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter');
  await expect(date).toHaveValue('2026-10-04'); await expect(day('2026-10-04')).toBeFocused();
  await page.getByRole('button', { name: 'Reset date' }).click(); await expect(date).toHaveValue('2026-10-02');
  await date.evaluate(input => { input.min = '2028-02-01'; input.max = '2028-03-31'; input.value = '2028-03-31'; input.dispatchEvent(new Event('change', { bubbles: true })); });
  await day('2028-03-31').focus(); await page.keyboard.press('PageUp');
  await expect(day('2028-02-29')).toBeFocused(); await page.keyboard.press('Enter');
  await expect(date).toHaveValue('2028-02-29');
  await expect(page.getByRole('button', { name: 'Previous month', exact: true })).toBeDisabled();
  await day('2028-02-01').focus(); await page.keyboard.press('ArrowLeft'); await expect(day('2028-02-01')).toBeFocused();
  await page.getByRole('button', { name: 'Next month', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Next month', exact: true })).toBeDisabled();
  await date.focus(); await date.evaluate(input => { input.disabled = true; });
  await expect(page.locator('[data-rf-calendar-grid] button:enabled')).toHaveCount(0);
});

test('date shortcuts include both ends and handle year and leap-month boundaries', async ({ page }) => {
  await page.goto('/docs/index.html#component/date-range-presets');
  const start = page.getByLabel('Start date', { exact: true }), end = page.getByLabel('End date', { exact: true });
  await page.getByRole('button', { name: 'Last 7 days', exact: true }).click();
  await expect(start).toHaveValue('2026-09-26'); await expect(end).toHaveValue('2026-10-02');
  await page.locator('[data-rf-date-presets]').evaluate(node => { node.dataset.rfToday = '2027-01-03'; });
  await page.getByRole('button', { name: 'Previous month', exact: true }).click();
  await expect(start).toHaveValue('2026-12-01'); await expect(end).toHaveValue('2026-12-31');
  await page.locator('[data-rf-date-presets]').evaluate(node => { node.dataset.rfToday = '2028-03-01'; });
  await page.getByRole('button', { name: 'Previous month', exact: true }).click();
  await expect(start).toHaveValue('2028-02-01'); await expect(end).toHaveValue('2028-02-29');
  await expect(end).toHaveAttribute('min', '2028-02-01');
  await page.getByRole('button', { name: 'Reset period' }).click(); await expect(start).toHaveValue('2026-09-01'); await expect(end).toHaveValue('2026-09-30');
  await start.evaluate(input => { input.min = '2026-01-01'; input.max = '2026-12-31'; });
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await expect(start).toHaveValue('2026-09-01'); await expect(end).toHaveValue('2026-09-30');
  await expect(page.locator('[data-rf-date-presets] [role="status"]')).toContainText('outside the available dates');
  await page.goto('/docs/index.html#component/time-picker');
  const time = page.getByLabel('Meeting time');
  await time.fill('09:37'); expect(await time.evaluate(node => node.validity.stepMismatch)).toBe(true);
  await time.fill('07:00'); expect(await time.evaluate(node => node.validity.rangeUnderflow)).toBe(true);
  await page.getByRole('button', { name: 'Reset time' }).click(); await expect(time).toHaveValue('09:30');
});

test('scheduler validates time ranges and creates, edits and removes text-safe events', async ({ page }) => {
  await page.goto('/docs/index.html#component/event-scheduler');
  const title = page.getByRole('textbox', { name: 'Event title' }), end = page.getByLabel('End time', { exact: true });
  await title.fill('<b>Design review</b>'); await end.fill('08:30');
  await page.getByRole('button', { name: 'Add event', exact: true }).click();
  await expect(page.locator('[data-rf-errors]')).toBeFocused(); await expect(page.locator('[data-rf-events] li')).toHaveCount(1);
  await end.fill('09:45'); await page.getByRole('button', { name: 'Add event', exact: true }).click();
  await expect(page.locator('[data-rf-events] li')).toHaveCount(2); await expect(page.locator('[data-rf-events] b')).toHaveCount(0);
  await expect(page.locator('[data-rf-event-status]')).toContainText('Created <b>Design review</b>');
  await expect(title).toHaveValue('');
  await page.getByRole('button', { name: 'Edit event: <b>Design review</b>', exact: true }).click();
  await expect(title).toBeFocused(); await title.fill('Accessibility review');
  await page.getByRole('button', { name: 'Save event', exact: true }).click();
  await expect(page.locator('[data-rf-events] li')).toHaveCount(2); await expect(page.locator('[data-rf-events]')).toContainText('Accessibility review');
  await page.getByRole('button', { name: 'Delete event: Accessibility review', exact: true }).click();
  await expect(page.locator('[data-rf-events] li')).toHaveCount(1); await expect(title).toBeFocused();
  await page.getByRole('button', { name: 'Delete event: Project kickoff', exact: true }).click();
  await expect(page.locator('[data-rf-event-status]')).toContainText('0 events scheduled');
  await expect(page.locator('.rf-toast')).toHaveCount(0);
  await page.evaluate(async () => {
    const { initFormPatterns } = await import('/src/js/form-patterns.js');
    const root = document.createElement('section'); root.innerHTML = await (await fetch('/sections/event-scheduler.html')).text(); document.body.append(root);
    let stop = initFormPatterns(root); const form = root.querySelector('form');
    form.elements.title.value = 'Keep this event'; form.requestSubmit();
    stop(); if (root.querySelector('[data-rf-event-action]')) throw Error('Enhanced controls retained');
    stop = initFormPatterns(root);
    if (root.querySelectorAll('[data-rf-event-id]').length !== 2 || !root.textContent.includes('Keep this event')) throw Error('Reinitializing discarded saved events');
    stop(); root.remove();
  });
});

test('new forms fit narrow layouts and exposed search and errors are accessible in both themes', async ({ page }) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const theme of ['light','dark']) {
    for (const id of ['combobox','autocomplete','multiselect','form-error-summary','calendar','time-picker','date-range-presets','event-scheduler']) {
      await page.goto(`/dist/site/index.html#component/${id}`);
      await expect(page.locator('h1')).toBeVisible();
      await page.locator('html').evaluate((node, value) => { node.dataset.rfTheme = value; }, theme);
      await page.setViewportSize({ width: 320, height: 900 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${theme} ${id}`).toBe(false);
      if (id === 'combobox') await page.getByRole('combobox', { name: 'Project template' }).press('ArrowDown');
      if (id === 'form-error-summary') await page.getByRole('button', { name: 'Check form' }).click();
      await page.evaluate(async () => { await Promise.all(document.getAnimations().filter(animation => animation.effect.getTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); });
      const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
      expect(result.violations, `${theme} ${id}`).toEqual([]);
    }
  }
});

test('unenhanced form examples retain native values and validation without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }), page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/examples/components/combobox.html');
  await expect(page.getByRole('combobox', { name: 'Project template' })).toBeVisible();
  await page.getByRole('combobox', { name: 'Project template' }).selectOption('dashboard');
  await page.getByRole('button', { name: 'Reset template' }).click();
  await expect(page.getByRole('combobox', { name: 'Project template' })).toHaveValue('website');
  await page.goto('http://127.0.0.1:4173/examples/components/multiselect.html');
  await page.getByRole('listbox', { name: 'Choose one or more skills' }).selectOption(['design','engineering']);
  await page.getByRole('button', { name: 'Reset skills' }).click();
  await expect(page.locator('select')).toHaveValues(['design']);
  await page.goto('http://127.0.0.1:4173/examples/components/form-error-summary.html');
  await page.getByRole('button', { name: 'Check form' }).click();
  await expect(page.getByRole('textbox', { name: 'Your name' })).toBeFocused();
  await context.close();
});

test('emulated touch can select, remove and reset choices and pick calendar dates', async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } }), page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/docs/index.html#component/multiselect');
  await page.getByRole('checkbox', { name: 'Engineering', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Remove Engineering', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Remove Design', exact: true }).tap();
  expect(await page.locator('.preview form').evaluate(form => new FormData(form).getAll('skills'))).toEqual(['engineering']);
  await page.getByRole('button', { name: 'Reset skills' }).tap();
  await expect(page.getByRole('checkbox', { name: 'Design', exact: true })).toBeChecked();
  await page.goto('http://127.0.0.1:4173/docs/index.html#component/calendar');
  await page.locator('[data-rf-date="2026-10-04"]').tap();
  await expect(page.getByLabel('Launch date', { exact: true })).toHaveValue('2026-10-04');
  await context.close();
});

test('preview forms never navigate or transmit values when scripts are unavailable', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }), page = await context.newPage();
  const requests = [];
  page.on('request', request => { if (request.isNavigationRequest()) requests.push(request.url()); });
  for (const [path, button, fields] of [
    ['sections/sign-in.html', 'Sign in', { Email: 'demo@example.invalid', Password: 'not-a-real-password' }],
    ['examples/components/password-field.html', 'Try the form', { Password: 'not-a-real-password' }],
    ['examples/components/autocomplete.html', 'Save topic', { 'Project topic': 'Keep this preview local' }],
    ['sections/event-scheduler.html', 'Add event', { 'Event title': 'Local preview only' }]
  ]) {
    const url = `http://127.0.0.1:4173/${path}`;
    await page.goto(url);
    for (const [label, value] of Object.entries(fields)) await page.getByLabel(label).and(page.locator('input')).fill(value);
    requests.length = 0;
    await page.getByRole('button', { name: button, exact: true }).click();
    await expect(page).toHaveURL(url);
    expect(requests, path).toEqual([]);
  }
  await context.close();
});
