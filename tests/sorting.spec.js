import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const sortOrder = list => list.evaluate(element => [...element.children].map(item => item.dataset.rfSortItem));
const cardOrder = (board, column) => board.locator(`[data-rf-kanban-column="${column}"] [data-rf-kanban-list]`).evaluate(element => [...element.children].map(item => item.dataset.rfKanbanItem));
const columnOrder = board => board.locator('.rf-kanban__columns').evaluate(element => [...element.children].map(column => column.dataset.rfKanbanColumn));
const track = page => page.evaluate(() => { window.sortChanges = []; window.boardChanges = []; document.addEventListener('rf:sort-change', event => window.sortChanges.push({ root: event.target.getAttribute('aria-labelledby'), ...event.detail })); document.addEventListener('rf:kanban-change', event => window.boardChanges.push(event.detail)); });

test('nested sorting owns its controls, announcements, focus and form order while parent moves preserve drafts', async ({ page }) => {
  await page.goto('/docs/index.html#component/sortable-list'); await track(page);
  const priorities = page.getByRole('list', { name: 'Project priorities', exact: true }), stages = page.getByRole('list', { name: 'Prototype stages', exact: true }), steps = page.getByRole('list', { name: 'Prototype steps', exact: true });
  const note = page.getByRole('textbox', { name: 'Prototype note', exact: true }); await note.fill('Keep this unfinished detail.');
  const earlier = page.getByRole('button', { name: 'Move Test a real task earlier', exact: true }); await earlier.focus(); await earlier.press('Enter');
  expect(await sortOrder(steps)).toEqual(['test', 'sketch', 'share']); expect(await sortOrder(stages)).toEqual(['discovery', 'build']); expect(await sortOrder(priorities)).toEqual(['brief','prototype','review','launch']);
  await expect(page.getByRole('button', { name: 'Move Test a real task later', exact: true })).toBeFocused();
  const parent = page.getByRole('button', { name: 'Move Explore the idea later', exact: true }); await parent.focus(); await parent.press('Enter');
  expect(await sortOrder(stages)).toEqual(['build','discovery']); expect(await sortOrder(steps)).toEqual(['test','sketch','share']); await expect(note).toHaveValue('Keep this unfinished detail.');
  expect(await page.evaluate(() => window.sortChanges.map(change => [change.root, change.value, change.from, change.to]))).toEqual([['prototype-steps-title','test',1,0],['prototype-stage-title','discovery',0,1]]);
  expect(await priorities.evaluate(list => { const data = new FormData(list.closest('form')); return [data.getAll('priority'),data.getAll('prototype-stage'),data.getAll('prototype-step'),data.get('prototype-note')]; })).toEqual([['brief','prototype','review','launch'],['build','discovery'],['test','sketch','share'],'Keep this unfinished detail.']);
  await page.getByRole('button', { name: 'Reset order', exact: true }).click(); await expect(page.locator('[data-rf-sortable] > [role="status"]')).toHaveText(Array(4).fill('Original order restored.')); expect(await sortOrder(stages)).toEqual(['discovery','build']); expect(await sortOrder(steps)).toEqual(['sketch','test','share']); await expect(note).toHaveValue('Keep the first version small.');
});

test('grid pointer drops follow reading order in both directions and stacked layouts, with one commit per drop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 }); await page.goto('/docs/index.html#component/sortable-list'); await track(page);
  const grid = page.getByRole('list', { name: 'Home screen tiles', exact: true }), item = id => grid.locator(`[data-rf-sort-item="${id}"]`);
  await item('notes').dragTo(item('overview'), { sourcePosition: { x: 20, y: 20 }, targetPosition: { x: 20, y: 20 } }); expect(await sortOrder(grid)).toEqual(['notes','overview','projects','files']);
  await page.locator('html').evaluate(element => element.dir = 'rtl'); const bounds = await item('files').boundingBox();
  await item('notes').dragTo(item('files'), { sourcePosition: { x: 20, y: 20 }, targetPosition: { x: bounds.width - 20, y: 20 } }); expect(await sortOrder(grid)).toEqual(['overview','projects','notes','files']);
  await page.setViewportSize({ width: 320, height: 900 }); const narrow = await item('files').boundingBox();
  await item('notes').dragTo(item('files'), { sourcePosition: { x: 20, y: 20 }, targetPosition: { x: 20, y: narrow.height - 12 } }); expect(await sortOrder(grid)).toEqual(['overview','projects','files','notes']);
  expect(await page.evaluate(() => window.sortChanges.map(change => [change.value, change.from, change.to, change.previousValues]))).toEqual([['notes',2,0,['overview','projects','notes','files']],['notes',0,2,['notes','overview','projects','files']],['notes',2,3,['overview','projects','notes','files']]]);
  expect(await grid.evaluate(list => new FormData(list.closest('form')).getAll('page-order'))).toEqual(['overview','projects','files','notes']); expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test('Kanban card positions and column order share native controls and exact commit snapshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1600 }); await page.goto('/docs/index.html#component/kanban'); await track(page);
  const board = page.locator('[data-rf-kanban]'), card = id => board.locator(`[data-rf-kanban-item="${id}"]`);
  const later = board.getByRole('button', { name: 'Move Mobile journal later', exact: true }); await later.focus(); await later.press('Enter'); expect(await cardOrder(board, 'In progress')).toEqual(['project-4','project-2']);
  await expect(board.getByRole('combobox', { name: 'Move to for Mobile journal', exact: true })).toBeFocused();
  await card('project-2').dragTo(card('project-4'), { sourcePosition: { x: 20, y: 20 }, targetPosition: { x: 20, y: 20 } }); expect(await cardOrder(board, 'In progress')).toEqual(['project-2','project-4']);
  await card('project-3').dragTo(card('project-4'), { sourcePosition: { x: 20, y: 20 }, targetPosition: { x: 20, y: 20 } }); expect(await cardOrder(board, 'In progress')).toEqual(['project-2','project-3','project-4']);
  await expect(board.locator('[data-rf-kanban-column="Draft"] [data-rf-kanban-empty]')).toBeVisible(); await expect(board.locator('[data-rf-kanban-column="In progress"] [data-rf-kanban-count]')).toHaveText('3');
  const changes = await page.evaluate(() => window.boardChanges); expect(changes.map(change => [change.value,change.from,change.to,change.fromIndex,change.toIndex])).toEqual([['project-2','In progress','In progress',0,1],['project-2','In progress','In progress',1,0],['project-3','Draft','In progress',0,1]]);
  expect(changes[2].previousValues).toEqual({ Draft: ['project-3'], 'In progress': ['project-2','project-4'], Published: ['project-1'] }); expect(changes[2].values).toEqual({ Draft: [], 'In progress': ['project-2','project-3','project-4'], Published: ['project-1'] });
  const draft = board.locator('[data-rf-kanban-column="Draft"] h3'), published = board.locator('[data-rf-kanban-column="Published"] h3'), rect = await published.boundingBox();
  await draft.dragTo(published, { sourcePosition: { x: 20, y: 12 }, targetPosition: { x: rect.width - 10, y: 12 } }); expect(await columnOrder(board)).toEqual(['In progress','Published','Draft']);
  expect(await page.evaluate(() => window.sortChanges.map(change => [change.value,change.from,change.to,change.previousValues]))).toEqual([['Draft',0,2,['Draft','In progress','Published']]]); expect(await page.evaluate(() => window.boardChanges.length)).toBe(3);
  await page.setViewportSize({ width: 320, height: 900 }); await board.getByRole('button', { name: 'Move Draft column earlier', exact: true }).click(); expect(await columnOrder(board)).toEqual(['In progress','Draft','Published']);
  await board.getByRole('button', { name: 'Reset board', exact: true }).click(); await expect(board.locator('[role="status"]')).toHaveText('Original board restored.'); expect(await columnOrder(board)).toEqual(['Draft','In progress','Published']); expect(await cardOrder(board, 'In progress')).toEqual(['project-2','project-4']); expect(await cardOrder(board, 'Draft')).toEqual(['project-3']);
});

test('sorting cancels on Escape, pagehide, reset, disabling and teardown without accepting external or malformed moves', async ({ page }) => {
  await page.goto('/docs/index.html#component/sortable-list');
  const result = await page.evaluate(async () => {
    const { initPatterns } = await import('/src/js/patterns.js'); const fieldset = document.createElement('fieldset'); fieldset.innerHTML = await (await fetch('/examples/components/sortable-list.html')).text(); document.body.append(fieldset);
    let stop = initPatterns(fieldset), commits = 0; fieldset.addEventListener('rf:sort-change', () => commits++); const form = fieldset.querySelector('form'), list = fieldset.querySelector('[data-rf-sort-list]'), first = list.children[0], target = list.children[3], native = new DataTransfer();
    const order = () => [...list.children].map(item => item.dataset.rfSortItem), tick = () => new Promise(resolve => setTimeout(resolve, 0));
    const drag = (node, type) => node.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: native, clientY: target.getBoundingClientRect().bottom - 1 }));
    drag(first, 'dragstart'); document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); drag(target, 'drop');
    drag(first, 'dragstart'); window.dispatchEvent(new Event('pagehide')); drag(target, 'drop');
    drag(first, 'dragstart'); first.dataset.rfSortDisabled = 'true'; await tick(); drag(target, 'drop'); if (first.draggable || [...first.querySelectorAll('[data-rf-sort-move]')].some(button => !button.disabled)) throw Error('Disabled item remains interactive'); delete first.dataset.rfSortDisabled; await tick();
    drag(first, 'dragstart'); fieldset.disabled = true; await tick(); fieldset.disabled = false; await tick(); drag(target, 'drop');
    drag(first, 'dragstart'); form.addEventListener('reset', event => event.preventDefault(), { once: true }); form.reset(); drag(target, 'drop'); await tick();
    if (commits || order().join() !== 'brief,prototype,review,launch') throw Error('Cancellation committed an order');
    first.querySelector('[data-rf-sort-move="1"]').click(); drag(first, 'dragstart'); stop(); drag(target, 'drop'); if (commits !== 1 || order()[0] !== 'prototype' || first.hasAttribute('draggable')) throw Error('Teardown lost committed order or accepted a late drop');
    stop = initPatterns(fieldset); drag(target, 'drop'); if (commits !== 1) throw Error('External drop was accepted'); first.querySelector('[data-rf-sort-move="-1"]').click(); if (commits !== 2) throw Error('Reinitialization duplicated listeners'); form.reset(); await tick(); if (order()[0] !== 'prototype') throw Error('Reinitialized reset did not restore its starting order'); stop();
    const root = fieldset.querySelector('[data-rf-sortable]'); first.dataset.rfSortItem = target.dataset.rfSortItem; stop = initPatterns(root); if (!first.querySelector('[data-rf-sort-move]').hidden || first.draggable) throw Error('Duplicate IDs were enhanced'); stop(); fieldset.remove(); return commits;
  }); expect(result).toBe(2);
});

test('Kanban cancellation and disabled native fields preserve positions, with safe reset and cleanup across shared column sorting', async ({ page }) => {
  await page.goto('/docs/index.html#component/kanban');
  expect(await page.evaluate(async () => {
    const { initPatterns } = await import('/src/js/patterns.js'); const fieldset = document.createElement('fieldset'); fieldset.innerHTML = await (await fetch('/examples/components/kanban.html')).text(); document.body.append(fieldset); const board = fieldset.querySelector('[data-rf-kanban]'); let stop = initPatterns(board), commits = 0; board.addEventListener('rf:kanban-change', () => commits++);
    const card = board.querySelector('[data-rf-kanban-item="project-2"]'), select = card.querySelector('select'), column = board.querySelector('[data-rf-kanban-column="Published"]'), native = new DataTransfer(), tick = () => new Promise(resolve => setTimeout(resolve, 0));
    const drag = (node, type) => node.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: native }));
    for (const cancel of [() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })), () => window.dispatchEvent(new Event('pagehide')), () => board.reset()]) { drag(card, 'dragstart'); cancel(); drag(column, 'drop'); await tick(); }
    drag(card, 'dragstart'); select.disabled = true; await tick(); if (card.draggable || [...card.querySelectorAll('[data-rf-kanban-order]')].some(button => !button.disabled)) throw Error('Disabled card remains interactive'); select.disabled = false; await tick(); drag(column, 'drop');
    drag(card, 'dragstart'); fieldset.disabled = true; await tick(); fieldset.disabled = false; await tick(); drag(column, 'drop'); if (commits || select.value !== 'In progress') throw Error('Cancelled card changed board');
    card.querySelector('[data-rf-kanban-order="1"]').click(); if (commits !== 1) throw Error('Native card reorder did not commit'); board.addEventListener('reset', event => event.preventDefault(), { once: true }); board.reset(); await tick(); if (card.parentElement.lastElementChild !== card) throw Error('Cancelled reset changed positions');
    drag(card, 'dragstart'); stop(); drag(column, 'drop'); if (commits !== 1 || card.hasAttribute('draggable') || !card.querySelector('[data-rf-kanban-control]').hidden || board.querySelector('[data-rf-sort-handle]').hasAttribute('draggable')) throw Error('Teardown lost shared cleanup');
    stop = initPatterns(board); select.value = 'Published'; select.dispatchEvent(new Event('change', { bubbles: true })); if (commits !== 2) throw Error('Repeated initialization duplicated card listeners'); stop(); fieldset.remove(); return commits;
  })).toBe(2);
});

test('dashboard uses shared sorting with workspace-isolated order, stable creation/archive and an order-only reset', async ({ page }) => {
  await page.goto('/examples/dashboard.html#project-board'); const board = page.locator('#project-board');
  await board.getByRole('button', { name: 'Move Brand refresh later', exact: true }).click(); await board.getByRole('button', { name: 'Move Draft column later', exact: true }).click();
  expect(await cardOrder(board, 'Draft')).toEqual(['project-5','project-3']); expect(await columnOrder(board)).toEqual(['In progress','Draft','Published']);
  await page.getByRole('button', { name: 'Switch workspace: Studio', exact: true }).click(); await page.getByRole('menuitem', { name: 'Personal workspace', exact: true }).click(); expect(await columnOrder(board)).toEqual(['Draft','In progress','Published']); await expect(board.locator('[role="status"]')).toHaveText('');
  await page.getByRole('button', { name: 'Switch workspace: Personal', exact: true }).click(); await page.getByRole('menuitem', { name: 'Studio workspace', exact: true }).click(); expect(await columnOrder(board)).toEqual(['In progress','Draft','Published']); expect(await cardOrder(board, 'Draft')).toEqual(['project-5','project-3']);
  await page.getByRole('button', { name: 'New project +', exact: true }).click(); const dialog = page.getByRole('dialog', { name: 'Make room for a new idea.' }); await dialog.getByRole('textbox', { name: 'Project name' }).fill('A sorted new task'); await dialog.getByRole('button', { name: 'Create project', exact: true }).click(); expect(await cardOrder(board, 'Draft')).toEqual(['project-5','project-3','project-7']); expect(await columnOrder(board)).toEqual(['In progress','Draft','Published']);
  await page.getByRole('checkbox', { name: 'Select Customer portal', exact: true }).check(); await page.getByRole('button', { name: 'Archive selected', exact: true }).click(); await page.getByRole('dialog', { name: 'Archive selected projects?' }).getByRole('button', { name: 'Archive projects', exact: true }).click(); expect(await cardOrder(board, 'Draft')).toEqual(['project-3','project-7']);
  await board.getByRole('combobox', { name: 'Move to for Brand refresh', exact: true }).selectOption('Published'); await expect(page.locator('#projects tr:has(input[value="project-3"])')).toHaveAttribute('data-rf-status','Published');
  const note = page.getByRole('textbox', { name: 'Markdown note', exact: true }); await note.fill('Keep this unsaved thought during order reset.'); await board.getByRole('button', { name: 'Reset board order', exact: true }).click(); await expect(note).toHaveValue('Keep this unsaved thought during order reset.'); expect(await columnOrder(board)).toEqual(['Draft','In progress','Published']); expect(await cardOrder(board, 'Draft')).toEqual(['project-7']); await expect(page.locator('#projects tr:has(input[value="project-3"])')).toHaveAttribute('data-rf-status','Published'); await expect(page.locator('#projects tr:has(input[value="project-5"])')).toHaveAttribute('data-rf-status','Archived');
  await page.reload(); expect(await columnOrder(board)).toEqual(['Draft','In progress','Published']); expect(await cardOrder(board, 'Draft')).toEqual(['project-3','project-5']); await expect(note).toHaveValue(/Your next chapter/);
});

test('sorting controls, grids and nested content fit both themes and retain readable native fallbacks', async ({ page, browser }) => {
  test.setTimeout(90000); await page.emulateMedia({ reducedMotion: 'reduce' }); const errors = []; page.on('pageerror', error => errors.push(error.message));
  for (const id of ['sortable-list','kanban']) for (const theme of ['light','dark']) {
    await page.goto('/docs/index.html#component/'+id); await page.locator('html').evaluate((element, theme) => element.dataset.rfTheme = theme, theme);
    for (const width of [320,390,1440]) { await page.setViewportSize({ width, height: 900 }); expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false); }
    await page.setViewportSize({ width: 390, height: 844 }); expect((await new AxeBuilder({ page }).include('.preview').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]); await page.locator('.preview').screenshot({ path: `output/playwright/rofin-sorting-${id}-${theme}-390.png` });
  }
  expect(errors).toEqual([]); const context = await browser.newContext({ javaScriptEnabled: false }), plain = await context.newPage();
  for (const id of ['sortable-list','kanban']) { await plain.goto('http://127.0.0.1:4173/examples/components/'+id+'.html'); await expect(plain.getByRole('button', { name: /Move .* (earlier|later)/ })).toHaveCount(0); if (id === 'sortable-list') { await expect(plain.getByRole('textbox', { name: 'Prototype note' })).toHaveValue('Keep the first version small.'); expect(await plain.locator('[data-rf-sort-item]').count()).toBe(13); } else { await expect(plain.getByText('Brand refresh', { exact: true })).toBeVisible(); await expect(plain.getByRole('combobox')).toHaveCount(0); } }
  await context.close();
});
