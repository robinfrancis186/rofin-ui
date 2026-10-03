import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const bodyData = chart => chart.locator('tbody').evaluate(body => [...body.rows].map(row => [...row.cells].map(cell => cell.textContent)));
const update = (page, rows, append = false) => page.evaluate(async ({rows,append}) => (await import('/src/js/patterns.js')).updateLineChart(document.querySelector('[data-rf-line-chart]'), rows, {append}), {rows,append});

test('chart updates are atomic, exact and safe; zoom, selection and native fields retain their meaning', async ({page}) => {
  await page.goto('/docs/index.html#component/line-chart'); const chart=page.locator('[data-rf-line-chart]'), point=page.getByRole('slider',{name:'Chart month',exact:true});
  await point.press('End'); await page.getByRole('slider',{name:'First chart point',exact:true}).press('ArrowRight');
  await expect(chart.locator('[data-rf-line-window]')).toContainText('Showing May through September: 5 of 6 points.');
  expect(await update(page,[{label:'October',values:{active:91,target:60}}],true)).toBe(true); await expect(point).toHaveAttribute('aria-valuetext','September: Active members 72; Target 55');
  await expect(chart.locator('[data-rf-line-window]')).toContainText('Showing May through September: 5 of 7 points.');
  await page.getByRole('checkbox',{name:'Follow newest point',exact:true}).check();
  await expect(point).toHaveAttribute('aria-valuetext','October: Active members 91; Target 60');await expect(chart.locator('[data-rf-line-window]')).toContainText('Showing June through October: 5 of 7 points.');
  expect(await update(page,[{label:'November',values:{active:102,target:70}}],true)).toBe(true); await expect(point).toHaveAttribute('aria-valuetext','November: Active members 102; Target 70');
  await expect(chart.locator('[data-rf-line-window]')).toContainText('Showing July through November: 5 of 8 points.');
  expect((await bodyData(chart)).at(-1)).toEqual(['November','102','70']);
  await page.getByRole('button',{name:'Show all points',exact:true}).click(); await expect(chart.locator('[data-rf-line-window]')).toContainText('8 of 8 points');
  const source = [{label:'<img src=x onerror=alert(1)>',values:{active:-5.25,target:0}},{label:'A different point',values:{active:2.75,target:1.125}}];
  expect(await update(page,source)).toBe(true); await expect(chart.locator('tbody img')).toHaveCount(0); expect(await bodyData(chart)).toEqual([['<img src=x onerror=alert(1)>','-5.25','0'],['A different point','2.75','1.125']]);
  await expect(chart.locator('[data-rf-line-window]')).toContainText('Linear scale -5.25 to 2.75; includes zero.');
  const committed = await chart.locator('polyline[data-rf-line-series="active"]').getAttribute('points');
  for(const invalid of [[{label:'Broken',values:{active:1,target:null}}],[{label:'Broken',values:{active:1e15,target:1}}],[{label:'Same',values:{active:1,target:2}},{label:' Same ',values:{active:3,target:4}}],[{label:'Broken',values:{active:1,target:2,other:3}}]]) expect(await update(page,invalid)).toBe(false);
  await expect(chart.locator('polyline[data-rf-line-series="active"]')).toHaveAttribute('points',committed); expect(await bodyData(chart)).toEqual([['<img src=x onerror=alert(1)>','-5.25','0'],['A different point','2.75','1.125']]);
  expect(await update(page,source)).toBe(true);await expect(chart.locator('[data-rf-line-status]')).toBeEmpty();
  expect(await page.evaluate(async()=>{ const row={label:'Owned',values:{active:4,target:2}}, ok=(await import('/src/js/patterns.js')).updateLineChart(document.querySelector('[data-rf-line-chart]'),[row]); row.values.active=999; return ok; })).toBe(true); expect(await bodyData(chart)).toEqual([['Owned','4','2']]); await expect(point).toBeDisabled();
  expect(await update(page,[])).toBe(true); await expect(chart.locator('[data-rf-line-empty]')).toBeVisible(); await expect(chart.locator('[data-rf-line-plot]')).toBeHidden(); await expect(point).toBeDisabled();
});

test('bounded append keeps at most 512 points; reset and teardown retain accepted data while late updates fail', async ({page}) => {
  await page.goto('/docs/index.html#component/line-chart');
  const result=await page.evaluate(async()=>{
    const {initPatterns,updateLineChart}=await import('/src/js/patterns.js'), form=document.createElement('form'); form.innerHTML=await(await fetch('/examples/components/line-chart.html')).text(); document.body.append(form); const chart=form.querySelector('[data-rf-line-chart]'), stop=initPatterns(form), range=chart.querySelector('[data-rf-line-range]'); let changes=0;chart.addEventListener('rf:chart-change',()=>changes++);
    const rows=Array.from({length:512},(_,i)=>({label:`Point ${i}`,values:{active:i,target:i/2}})); if(!updateLineChart(chart,rows))throw Error('Maximum supported data rejected'); range.value='511'; range.dispatchEvent(new Event('input'));
    if(!updateLineChart(chart,[{label:'Point 512',values:{active:512,target:256}}],{append:true}))throw Error('Append rejected');
    if(chart.querySelector('tbody').rows.length!==512||chart.querySelector('tbody th').textContent!=='Point 1'||!range.getAttribute('aria-valuetext').startsWith('Point 511:'))throw Error('Retention or selected label failed');
    const before=chart.querySelector('tbody').textContent;
    if(updateLineChart(chart,Array.from({length:513},(_,i)=>({label:`Bad ${i}`,values:{active:i,target:0}})))||updateLineChart(chart,[{label:'Point 512',values:{active:0,target:0}}],{append:true}))throw Error('Unbounded or duplicate feed accepted');
    const start=chart.querySelector('[data-rf-line-start]');start.value='10';start.dispatchEvent(new Event('input'));form.addEventListener('reset',e=>e.preventDefault(),{once:true});form.reset();await new Promise(resolve=>setTimeout(resolve,0));if(start.value!=='10')throw Error('Cancelled reset changed zoom');
    form.reset();await new Promise(resolve=>setTimeout(resolve,0));if(start.value!=='0'||chart.querySelector('tbody').textContent!==before)throw Error('Native view reset lost data');
    for(const check of chart.querySelectorAll('[data-rf-line-toggle]')){check.checked=false;check.dispatchEvent(new Event('change'));}
    stop();if(updateLineChart(chart,rows)||!chart.querySelector('[data-rf-line-controls]').hidden||range.hasAttribute('aria-valuetext')||[...chart.querySelectorAll('polyline')].some(path=>path.style.display==='none'))throw Error('Cleanup lost its readable fallback or accepted a late update');
    const again=initPatterns(form);if(!updateLineChart(chart,rows)||changes!==3)throw Error('Reinitialization duplicated handlers');again();form.remove();return changes;
  });expect(result).toBe(3);
});

test('explicit browser streaming pauses and resets, with no automatic requests or background updates',async({page})=>{
  const requests=[];page.on('request',request=>{if(request.url().includes('/api/sample-chart-stream'))requests.push(request.url());});await page.goto('/docs/index.html#component/line-chart');const chart=page.locator('[data-rf-line-chart]');await expect(chart.locator('tbody tr')).toHaveCount(6);expect(requests).toEqual([]);
  await page.getByRole('button',{name:'Add a sample point',exact:true}).click();await expect(chart.locator('tbody tr')).toHaveCount(7);
  await page.getByRole('button',{name:'Start sample stream',exact:true}).click();await expect(chart.locator('tbody tr')).toHaveCount(8);await page.getByRole('button',{name:'Pause sample stream',exact:true}).click();const count=await chart.locator('tbody tr').count();await page.waitForTimeout(1200);await expect(chart.locator('tbody tr')).toHaveCount(count);
  await page.getByRole('button',{name:'Restore sample data',exact:true}).click();await expect(chart.locator('tbody tr')).toHaveCount(6);await expect(chart.locator('[data-rf-chart-demo-status]')).toHaveText('Original sample data restored.');expect(requests).toEqual([]);
});

test('the localhost HTTP feed transfers actual events and closes on pause, pagehide and route teardown',async({page})=>{
  await page.goto('/docs/index.html#component/line-chart');const chart=page.locator('[data-rf-line-chart]');await page.getByRole('combobox',{name:'Sample chart source',exact:true}).selectOption('http');
  const response=page.waitForResponse(response=>response.url().endsWith('/api/sample-chart-stream'));await page.getByRole('button',{name:'Start sample stream',exact:true}).click();const stream=await response;expect(stream.status()).toBe(200);expect(stream.headers()['content-type']).toContain('text/event-stream');
  await expect.poll(()=>chart.locator('tbody tr').count()).toBeGreaterThan(6);await page.getByRole('button',{name:'Pause sample stream',exact:true}).click();expect((await bodyData(chart))[6]).toEqual(['HTTP 1: Sample 1','56','61']);
  const count=await chart.locator('tbody tr').count();await page.waitForTimeout(700);await expect(chart.locator('tbody tr')).toHaveCount(count);
  await page.getByRole('button',{name:'Start sample stream',exact:true}).click();await expect.poll(()=>chart.locator('tbody tr').count()).toBeGreaterThan(count);await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await expect(page.getByRole('button',{name:'Start sample stream',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Start sample stream',exact:true}).click();await page.getByRole('link',{name:'Button',exact:true}).first().click();await expect(chart).toHaveCount(0);
});

test('failed or malformed streams preserve accepted data and permit an explicit retry',async({page})=>{
  await page.goto('/docs/index.html#component/line-chart');const chart=page.locator('[data-rf-line-chart]'), source=page.getByRole('combobox',{name:'Sample chart source',exact:true}), start=page.getByRole('button',{name:'Start sample stream',exact:true});const initial=await bodyData(chart);
  await source.selectOption('http');await page.route('**/api/sample-chart-stream',route=>route.fulfill({status:503,body:'Temporarily unavailable'}));await start.click();await expect(chart.locator('[data-rf-chart-demo-status]')).toContainText('HTTP stream stopped');expect(await bodyData(chart)).toEqual(initial);await expect(source).toBeEnabled();
  await page.unroute('**/api/sample-chart-stream');await page.route('**/api/sample-chart-stream',route=>route.fulfill({status:200,contentType:'text/event-stream',body:'data: {"label":"Bad values","values":{"active":"56","target":61}}\n\n'}));await start.click();await expect(chart.locator('[data-rf-chart-demo-status]')).toContainText('Previous data is retained');await expect(chart.locator('[data-rf-line-status]')).toContainText('finite numeric values');expect(await bodyData(chart)).toEqual(initial);
  await page.unroute('**/api/sample-chart-stream');await start.click();await expect.poll(()=>chart.locator('tbody tr').count()).toBeGreaterThan(6);await page.getByRole('button',{name:'Pause sample stream',exact:true}).click();await expect(chart.locator('[data-rf-line-status]')).toBeEmpty();
  await page.getByRole('button',{name:'Restore sample data',exact:true}).click();expect(await update(page,[{label:'Sample 1',values:{active:1,target:2}}],true)).toBe(true);await source.selectOption('browser');await page.getByRole('button',{name:'Add a sample point',exact:true}).click();await expect(chart.locator('[data-rf-chart-demo-status]')).toContainText('Previous data is retained');expect((await bodyData(chart)).at(-1)).toEqual(['Sample 1','1','2']);
});

test('dashboard charts match every filtered project, not only the visible page, and update after board moves and workspace changes',async({page})=>{
  await page.goto('/examples/dashboard.html');const chart=page.locator('[data-rf-line-chart]'), statusTable=page.locator('[data-project-status-chart] table');
  await expect(page.locator('[data-project-chart-summary]')).toContainText('6 matching projects across all pages · 65 tasks.');expect((await bodyData(chart)).at(-1)).toEqual(['2026-09-29','65','18']);expect(await statusTable.locator('tbody td').allTextContents()).toEqual(['36','11','18','0']);
  await page.getByRole('button',{name:'Next page',exact:true}).click();expect((await bodyData(chart)).at(-1)).toEqual(['2026-09-29','65','18']);
  await page.getByRole('combobox',{name:'Project status',exact:true}).selectOption('Published');await expect(page.locator('[data-project-chart-summary]')).toContainText('2 matching projects across all pages · 18 tasks.');expect(await bodyData(chart)).toEqual([['2026-09-10','6','6'],['2026-09-29','18','18']]);await expect(page.locator('.rf-chart__ring text')).toHaveText('100%');
  await page.getByRole('searchbox',{name:'Filter projects',exact:true}).fill('No project here');await expect(chart.locator('[data-rf-line-empty]')).toBeVisible();await expect(page.locator('.rf-chart__ring text')).toHaveText('—');await expect(page.locator('[data-project-chart-summary]')).toContainText('0 matching projects');
  await page.getByRole('button',{name:'Reset filters',exact:true}).click();await expect(page.locator('[data-project-chart-summary]')).toContainText('65 tasks');
  await page.getByRole('combobox',{name:'Move to for Brand refresh',exact:true}).selectOption('Published');expect((await bodyData(chart)).at(-1)).toEqual(['2026-09-29','65','38']);expect(await statusTable.locator('tbody td').allTextContents()).toEqual(['16','11','38','0']);
  await page.getByRole('textbox',{name:'Start date',exact:true}).fill('2026-09-20');await page.getByRole('textbox',{name:'End date',exact:true}).fill('2026-09-24');await page.getByRole('button',{name:'Apply dates',exact:true}).click();expect(await bodyData(chart)).toEqual([['2026-09-20','8','0'],['2026-09-24','11','0']]);
  await page.getByRole('button',{name:'Switch workspace: Studio',exact:true}).click();await page.getByRole('menuitem',{name:'Personal workspace',exact:true}).click();expect(await bodyData(chart)).toEqual([['2026-09-27','4','0'],['2026-09-28','6','0']]);await expect(page.locator('[data-project-chart-summary]')).toContainText('2 matching projects across all pages · 6 tasks');
});

test('chart data and controls fit both narrow themes, remain accessible, and keep exact native fallbacks without scripts',async({page,browser})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['light','dark']){await page.goto('/docs/index.html#component/line-chart');await page.locator('html').evaluate((element,theme)=>element.dataset.rfTheme=theme,theme);for(const width of [320,390,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);}expect((await new AxeBuilder({page}).include('.preview').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);}
  expect(errors).toEqual([]);const context=await browser.newContext({javaScriptEnabled:false}),plain=await context.newPage();await plain.goto('http://127.0.0.1:4173/examples/components/line-chart.html');await expect(plain.getByRole('slider')).toHaveCount(0);await plain.getByText('View line chart data',{exact:true}).click();await expect(plain.locator('tbody tr')).toHaveCount(6);await plain.goto('http://127.0.0.1:4173/examples/dashboard.html');expect((await bodyData(plain.locator('[data-rf-line-chart]'))).at(-1)).toEqual(['2026-09-29','65','18']);await context.close();
});
