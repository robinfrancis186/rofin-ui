import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const route = '/docs/index.html#component/data-grid';
const grid = page => page.locator('[data-rf-data-grid]');

test('virtual rows stay bounded, retain an editing draft, and support native paginated reading', async ({ page }) => {
  await page.goto(route); const root = grid(page), table = root.locator('table'), scroll = root.locator('[data-rf-grid-scroll]');
  await expect(table).toHaveAttribute('aria-rowcount', '10001');
  expect(await table.locator('tbody tr[data-rf-id]').count()).toBeLessThan(30);
  await page.getByRole('button', { name: 'Edit Project for Atlas launch', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Project for Atlas launch', exact: true });
  await editor.fill('A draft that survives scrolling');
  await scroll.evaluate(element => element.scrollTop = 280000);
  await expect.poll(() => table.locator('tbody tr[data-rf-id]').count()).toBeLessThan(30);
  await expect(editor).toHaveValue('A draft that survives scrolling');
  await editor.press('Escape'); await scroll.evaluate(element => element.scrollTop = element.scrollHeight);
  await expect(table.locator('tr[data-rf-id="project-10000"]')).toBeAttached();
  expect(await table.locator('tbody tr[data-rf-id]').count()).toBeLessThan(30);
  await page.getByLabel('Virtual scrolling', { exact: true }).uncheck();
  await expect(table.locator('tbody tr[data-rf-id]')).toHaveCount(25);
  await expect(root.getByRole('status')).toContainText('1–25 of 10000 rows');
  await page.getByRole('button', { name: 'Next grid page', exact: true }).click();
  await expect(table.locator('tbody tr[data-rf-id]').first()).toHaveAttribute('aria-rowindex', '27');
  await expect(root.getByRole('status')).toContainText('26–50 of 10000 rows');
});

test('inline edits validate, cancel and render text safely, then update active sorting and filters', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({width:1440,height:1000}); await page.goto(route);
  await page.getByRole('button', { name: 'Edit Tasks for Atlas launch', exact: true }).click();
  const tasks = page.getByRole('spinbutton', { name: 'Tasks for Atlas launch', exact: true });
  await tasks.fill('-1'); await tasks.press('Enter'); await expect(tasks).toBeVisible();
  expect(await tasks.evaluate(input => input.validity.rangeUnderflow)).toBe(true);
  await tasks.fill('1.5'); await tasks.press('Enter'); expect(await tasks.evaluate(input => input.validity.stepMismatch)).toBe(true);
  await tasks.press('Escape'); await expect(page.getByRole('button', { name: 'Edit Tasks for Atlas launch', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Edit Project for Atlas launch', exact: true }).click();
  const project = page.getByRole('textbox', { name: 'Project for Atlas launch', exact: true }), value = '<img src=x onerror=window.gridXSS=true>';
  await project.fill(value); await project.press('Enter');
  await expect(grid(page).locator('tr[data-rf-id="project-1"]')).toContainText(value);
  expect(await page.evaluate(() => window.gridXSS)).toBeUndefined();
  await page.getByLabel('Search rows', { exact: true }).fill('Atlas'); await expect(grid(page).getByRole('status')).toContainText('0 rows');
  await page.getByLabel('Search rows', { exact: true }).fill(value);
  await expect(grid(page).getByRole('status')).toContainText('1 rows');
  await page.getByRole('button', { name: `Edit Status for ${value}`, exact: true }).click();
  expect(errors).toEqual([]);
  await page.getByRole('combobox', { name: `Status for ${value}`, exact: true }).selectOption('Published');
  await page.getByRole('button', { name: 'Save cell edit', exact: true }).click();
  await expect(grid(page).locator('tr[data-rf-id="project-1"]')).toContainText('Published');
  expect(errors).toEqual([]);
});

test('column settings hide, pin and resize with pointer and keyboard, protect the last column and reset', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.goto(route);
  await page.getByText('Columns and filters', { exact: true }).click();
  await page.getByLabel('Show Owner', { exact: true }).uncheck(); await expect(grid(page).locator('thead th[data-rf-grid-field="owner"]')).toBeHidden();
  await page.getByLabel('Pin Project', { exact: true }).check(); await expect(grid(page).locator('thead th').first()).toHaveAttribute('data-rf-grid-pinned', '');
  const resize = page.getByRole('separator', { name: 'Resize Project column', exact: true });
  await resize.focus(); await resize.press('ArrowRight'); await expect(resize).toHaveAttribute('aria-valuenow', '270');
  const box = await resize.boundingBox(); await page.mouse.move(box.x + 4, box.y + 20); await page.mouse.down(); await page.mouse.move(box.x + 44, box.y + 20); await page.mouse.up(); await expect(resize).toHaveAttribute('aria-valuenow', '310');
  const changed = await resize.boundingBox(); await page.mouse.move(changed.x + 4,changed.y+20); await page.mouse.down(); await page.mouse.move(changed.x+64,changed.y+20); await page.keyboard.press('Escape'); await page.mouse.up(); await expect(resize).toHaveAttribute('aria-valuenow','310');
  await page.getByLabel('Show Status', { exact: true }).uncheck(); await page.getByLabel('Show Tasks', { exact: true }).uncheck(); await page.getByLabel('Show Updated', { exact: true }).uncheck(); await page.getByLabel('Show Project', { exact: true }).click(); await expect(page.getByLabel('Show Project', { exact: true })).toBeChecked();
  await expect(grid(page).getByRole('status')).toContainText('Keep at least one column visible');
  await page.getByRole('button', { name: 'Reset grid view', exact: true }).click(); await expect(page.getByLabel('Show Owner', { exact: true })).toBeChecked(); await expect(resize).toHaveAttribute('aria-valuenow', '260');
  await grid(page).evaluate(element => element.dir = 'rtl'); await resize.focus(); await resize.press('ArrowRight'); await expect(resize).toHaveAttribute('aria-valuenow', '250');
});

test('compound filters and saved views restore across reload and tolerate corrupt or unavailable storage', async ({ page }) => {
  await page.goto(route); await page.getByText('Columns and filters', { exact: true }).click();
  await page.getByRole('button', { name: 'Add filter', exact: true }).click(); await page.getByLabel('Filter 1 column', { exact: true }).selectOption('owner'); await page.getByLabel('Filter 1 comparison', { exact: true }).selectOption('equals'); await page.getByLabel('Filter 1 value', { exact: true }).fill('Jamie');
  await page.getByRole('button', { name: 'Add filter', exact: true }).click(); await page.getByLabel('Filter 2 column', { exact: true }).selectOption('tasks'); await page.getByLabel('Filter 2 comparison', { exact: true }).selectOption('gte'); await page.getByLabel('Filter 2 value', { exact: true }).fill('99');
  await page.getByRole('button', { name: 'Apply grid filters', exact: true }).click(); await expect(grid(page).getByRole('status')).toContainText('66 rows');
  await page.getByLabel('Show Updated', { exact: true }).uncheck(); await page.getByText('Saved views', { exact: true }).click(); await page.getByLabel('View name', { exact: true }).fill('Jamie high count'); await page.getByRole('button', { name: 'Save grid view', exact: true }).click();
  await page.reload(); await page.getByText('Saved views', { exact: true }).click(); await page.getByLabel('Saved grid views', { exact: true }).selectOption('Jamie high count'); await expect(grid(page).getByRole('status')).toContainText('66 rows');
  await expect(grid(page).locator('thead th[data-rf-grid-field="updated"]')).toBeHidden();
  await page.getByText('Columns and filters', {exact:true}).click(); await page.getByLabel('Filter matching', {exact:true}).selectOption('any'); await page.getByRole('button', {name:'Apply grid filters',exact:true}).click(); await expect(grid(page).getByRole('status')).toContainText('3465 rows');
  await page.getByRole('button', { name: 'Delete saved grid view', exact: true }).click(); await expect(page.getByLabel('Saved grid views', { exact: true }).locator('option')).toHaveCount(1);
  await page.evaluate(() => localStorage.setItem('rofin-project-grid-views-v1', JSON.stringify([{name:'Broken',state:{columns:[null]}}]))); await page.reload(); await expect(grid(page).locator('table')).toHaveAttribute('aria-rowcount', '10001');
  await page.evaluate(async()=>{const {createDataGrid}=await import('/src/js/data-grid.js'); const state=createDataGrid(document.querySelector('[data-rf-data-grid]')).getState(); state.filters=Array.from({length:20},()=>({field:'name',operator:'contains',value:'x'.repeat(500)}));localStorage.setItem('rofin-project-grid-views-v1',JSON.stringify(Array.from({length:7},(_,i)=>({name:`Large ${i}`,state}))));}); await page.reload(); await page.getByText('Saved views',{exact:true}).click(); await expect(page.getByLabel('Saved grid views',{exact:true}).locator('option')).toHaveCount(8); await page.getByText('Saved views',{exact:true}).click();
  await page.evaluate(() => Storage.prototype.setItem = () => { throw Error('Unavailable'); }); await page.getByText('Saved views', { exact: true }).click(); await page.getByLabel('View name', { exact: true }).fill('Page only'); await page.getByRole('button', { name: 'Save grid view', exact: true }).click(); await expect(grid(page).getByRole('status')).toContainText('for this page');
});

test('real HTTP paging sorts and filters on the server and rejects invalid queries and writes', async ({ page, request }) => {
  await page.goto(route); await page.getByLabel('Data source', { exact: true }).selectOption('http');
  await expect(grid(page).getByRole('status')).toContainText('1–25 of 10000 rows'); await expect(page.getByLabel('Virtual scrolling', { exact: true })).toBeDisabled(); await expect(grid(page).locator('[data-rf-grid-edit]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Next grid page', exact: true }).click(); await expect(grid(page).getByRole('status')).toContainText('26–50 of 10000 rows');
  await page.getByLabel('Search rows', { exact: true }).fill('Project 00042'); await expect(grid(page).getByRole('status')).toContainText('1–1 of 1 rows'); await expect(grid(page).locator('tbody')).toContainText('Project 00042');
  const response = await request.get('/api/sample-grid', { params: { query: JSON.stringify({page:1,pageSize:2,sort:{field:'tasks',descending:true},filters:[{field:'owner',operator:'equals',value:'Jamie'}]}) } }); const result = await response.json(); expect(result.rows).toHaveLength(2); expect(result.total).toBe(3333); expect(result.rows.every(row => row.owner === 'Jamie' && row.tasks === 100)).toBe(true); expect(result.all).toBeUndefined();
  expect((await request.get('/api/sample-grid', {params:{query:JSON.stringify({sort:{field:'__proto__',descending:false}})}})).status()).toBe(400); expect((await request.get('/api/sample-grid', {params:{query:JSON.stringify({pageSize:1000})}})).status()).toBe(400); expect((await request.post('/api/sample-grid', {data:{name:'Write'}})).status()).toBe(405);
  const dates=await (await request.get('/api/sample-grid',{params:{query:JSON.stringify({filters:[{field:'updated',operator:'equals',value:'2026-09-30'}]})}})).json(); expect(dates.total).toBe(333);
  expect((await request.get('/api/sample-grid',{params:{query:JSON.stringify({filters:[{field:'updated',operator:'gte',value:'2026-02-30'}]})}})).status()).toBe(400);
});

test('failed or cancelled save callbacks keep the draft and a successful retry retains the server version', async ({ page }) => {
  await page.goto(route);
  await page.evaluate(async()=>{ const {createDataGrid}=await import('/src/js/data-grid.js'),root=document.querySelector('[data-rf-data-grid]'); createDataGrid(root).destroy(); window.saves=0; window.grid=createDataGrid(root,{saveCell:async edit=>{if(++window.saves===1)throw Error('Version conflict');return {...edit.row,[edit.field]:edit.value,version:2};}}); });
  await page.getByRole('button',{name:'Edit Project for Atlas launch',exact:true}).click(); const input=page.getByRole('textbox',{name:'Project for Atlas launch',exact:true}); await input.fill('A retained draft'); await input.press('Enter'); await expect(grid(page).getByRole('status')).toContainText('Version conflict'); await expect(input).toHaveValue('A retained draft'); await expect(input).toBeEnabled();
  await input.press('Enter'); await expect(grid(page).locator('tbody')).toContainText('A retained draft'); expect(await page.evaluate(()=>window.grid.getRows()[0].version)).toBe(2);
  await page.evaluate(()=>document.querySelector('[data-rf-data-grid]').addEventListener('rf:grid-before-edit',event=>event.preventDefault(),{once:true})); await page.getByRole('button',{name:'Edit Project for A retained draft',exact:true}).click(); const cancelled=page.getByRole('textbox',{name:'Project for A retained draft',exact:true}); await cancelled.fill('Not committed'); await cancelled.press('Enter'); await expect(grid(page).getByRole('status')).toContainText('Edit was not saved'); expect(await page.evaluate(()=>window.saves)).toBe(2); await cancelled.press('Escape');
});

test('stale page responses cannot overwrite newer results; errors retain rows and retry succeeds', async ({ page }) => {
  await page.goto(route);
  await page.evaluate(async () => {
    const { createDataGrid } = await import('/src/js/data-grid.js'); window.grid = createDataGrid(document.querySelector('[data-rf-data-grid]'));
    await window.grid.setLoader(async()=>{throw Error('Not connected');});
  });
  await expect(grid(page).getByRole('alert')).toContainText('Not connected');
  await expect(grid(page).locator('[data-rf-grid-edit]').first()).toBeDisabled();
  await page.evaluate(() => {
    window.pendingPages = []; window.grid.setLoader((query, {signal}) => new Promise(resolve => window.pendingPages.push({query,signal,resolve})));
  });
  await grid(page).locator('[data-rf-grid-scroll]').evaluate(element=>element.scrollTop=280000);
  await expect.poll(()=>grid(page).locator('tbody tr[data-rf-id]').count()).toBeLessThan(30);
  await expect(grid(page).locator('table')).toHaveAttribute('aria-rowcount','10001');
  await page.getByLabel('Search rows', {exact:true}).fill('newer');
  await expect.poll(()=>page.evaluate(()=>window.pendingPages.length)).toBe(2);
  const row={id:'new',name:'Newer page',owner:'Robin',status:'Draft',tasks:3,updated:'2026-09-02'};
  await page.evaluate(row=>window.pendingPages[1].resolve({rows:[row],total:1,page:0}),row); await expect(grid(page).locator('tbody')).toContainText('Newer page');
  expect(await page.evaluate(()=>window.pendingPages[0].signal.aborted)).toBe(true);
  await page.evaluate(row=>window.pendingPages[0].resolve({rows:[{...row,id:'old',name:'Older page'}],total:1,page:0}),row); await expect(grid(page).locator('tbody')).toContainText('Newer page'); await expect(grid(page).locator('tbody')).not.toContainText('Older page');
  await page.evaluate(row=>{ let attempts=0; window.grid.setLoader(async()=>{if(++attempts===1) throw Error('Offline'); return {rows:[{...row,name:'Newer page after retry'}],total:1,page:0};}); },row);
  await expect(grid(page).getByRole('alert')).toContainText('Offline'); await expect(grid(page).locator('tbody')).toContainText('Newer page');
  await page.getByRole('button',{name:'Retry loading',exact:true}).click(); await expect(grid(page).getByRole('alert')).toBeHidden(); await expect(grid(page).locator('tbody')).toContainText('Newer page after retry');
  await page.evaluate(row=>window.grid.setLoader(async()=>({rows:[{...row,tasks:'invalid'}],total:200,page:0})),row); await expect(grid(page).getByRole('alert')).toContainText('Invalid Tasks'); await expect(grid(page).locator('tbody')).toContainText('Newer page after retry'); await expect(grid(page).locator('table')).toHaveAttribute('aria-rowcount','2');
});

test('grid cleanup preserves committed rows and prevents old controls or pending saves from mutating state', async ({ page }) => {
  await page.goto(route);
  const result = await page.evaluate(async () => {
    const { createDataGrid } = await import('/src/js/data-grid.js'), root = document.querySelector('[data-rf-data-grid]'); let api = createDataGrid(root);
    root.querySelector('[data-rf-grid-edit="name"]').click(); root.querySelector('.rf-grid-editor input').value='Committed'; root.querySelector('.rf-grid-editor button').click(); await Promise.resolve(); await Promise.resolve(); api.destroy();
    let pending, aborted = false; api = createDataGrid(root, {saveCell: (edit, {signal}) => new Promise(resolve => { pending = () => resolve({...edit.row,[edit.field]:edit.value}); signal.addEventListener('abort',()=>aborted=true); })});
    const oldButton=[...root.querySelectorAll('button')].find(button=>button.textContent==='Save grid view'); root.querySelector('.rf-grid-controls input[maxlength="60"]').value='Should not persist';
    root.querySelector('[data-rf-grid-edit="name"]').click(); const input = root.querySelector('.rf-grid-editor input'); input.value='Unsaved'; root.querySelector('.rf-grid-editor button').click(); await Promise.resolve(); api.destroy(); pending(); await Promise.resolve(); await Promise.resolve();
    const name = api.getRows()[0].name; api.destroy(); oldButton.click(); const again = createDataGrid(root); const identical = createDataGrid(root) === again; again.destroy();
    let mutableIDRejected=false;try {createDataGrid(root,{columns:[{field:'id',label:'ID',editable:true}],rows:[{id:'stable'}]});}catch {mutableIDRejected=true;}
    const ids = createDataGrid(root,{columns:[{field:'id',label:'ID',type:'number'}],rows:[{id:'01'},{id:'1'}]}); const stableIDs=ids.getRows().map(row=>row.id); ids.destroy();
    return {aborted,name,identical,mutableIDRejected,stableIDs,controls:root.querySelectorAll('.rf-grid-controls').length,persisted:localStorage.getItem('rofin-project-grid-views-v1')};
  });
  expect(result).toEqual({aborted:true,name:'Committed',identical:true,mutableIDRejected:true,stableIDs:['01','1'],controls:0,persisted:null});
});

test('grid fits a narrow viewport and accessible controls remain usable in both themes', async ({ page }) => {
  test.setTimeout(90000); await page.setViewportSize({width:390,height:844}); await page.goto(route);
  for (const theme of ['light','dark']) { await page.evaluate(value=>document.documentElement.dataset.rfTheme=value,theme); await page.getByText('Columns and filters',{exact:true}).click(); await page.getByText('Saved views',{exact:true}).click(); const results=await new AxeBuilder({page}).include('.preview').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze(); expect(results.violations).toEqual([]); const width=await page.evaluate(()=>({actual:document.documentElement.scrollWidth,viewport:innerWidth})); expect(width.actual).toBeLessThanOrEqual(width.viewport+1); await page.getByText('Columns and filters',{exact:true}).click(); await page.getByText('Saved views',{exact:true}).click(); }
});
