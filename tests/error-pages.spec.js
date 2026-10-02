import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { readFile, mkdtemp, cp, symlink, writeFile, chmod, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { once } from 'node:events';

const path = '/examples/recovery.html', note = page => page.getByRole('textbox', { name: 'Your unsent note' });
const snapshot = page => page.locator('#snapshot'), error = page => page.locator('#resource-error');
const fixture = { name: '<img src=x onerror=attack()>', summary: '<script>attack()</script>', completed: 3, total: 7 };
const count = JSON.parse(await readFile('docs/catalog.json', 'utf8')).length;
async function start(page) { await page.goto(path); await expect(page.locator('#load-status')).toContainText('Snapshot loaded'); }
async function load(page, name) { await page.getByRole('combobox', { name: 'Read-only resource' }).selectOption(name); await page.getByRole('button', { name: 'Load resource', exact: true }).click(); }

test('unknown documentation hashes use the shared 404 and recover through native navigation', async ({ page }) => {
  await page.goto('/docs/index.html#component/not-a-real-component');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page took a different path.');
  await expect(page).toHaveTitle('Page not found — Rofin UI');
  await page.getByRole('link', { name: 'Explore components', exact: true }).click();
  await expect(page).toHaveURL(/#catalog$/); await expect(page.locator('.catalog-card')).toHaveCount(count);
  await page.evaluate(() => { location.hash = 'not-a-page'; }); await expect(page.locator('#main')).toBeFocused();
  await expect(page.locator('#main .rf-error-page')).toBeVisible();
  await page.goBack(); await expect(page.locator('.catalog-card')).toHaveCount(count);
  await page.goto('/dist/site/index.html#component/not-a-real-component');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This page took a different path.');
  await page.getByRole('link', { name: 'Explore components', exact: true }).click(); await expect(page).toHaveURL(/\/dist\/site\/index.html#catalog$/);
  await page.goto('/docs/index.html#%3Csvg%20onload%3Dattack()%3E'); await expect(page.locator('#main svg')).toHaveCount(0);
  for (const hash of ['catalog/no-page', 'constructor']) { await page.goto(`/docs/index.html#${hash}`); await expect(page).toHaveTitle('Page not found — Rofin UI'); }
});

test('real HTTP errors retain status, HEAD semantics, safe links and read-only contracts', async ({ request }) => {
  for (const [url, code, title] of [['/missing/deep/page',404,'This page took a different path.'],['/..%2F..%2Fsecret',403,'A little permission is needed.']]) {
    const response = await request.get(url); expect(response.status()).toBe(code); expect(response.headers()['content-type']).toContain('text/html');
    const body = await response.text(); expect(body).toContain(title); expect(body).toContain('href="/docs/index.html'); expect(body).not.toContain('secret');
    const head = await request.head(url); expect(head.status()).toBe(code); expect(await head.body()).toHaveLength(0); expect(head.headers()['content-length']).toBe(String(Buffer.byteLength(body)));
  }
  expect((await request.get('/bad%ZZ')).status()).toBe(400);
  expect((await request.post('/missing/deep/page')).status()).toBe(404);
  expect((await request.post('/examples/assets/project-snapshot.json')).status()).toBe(405);
  for (const [name, code] of [['permission',403],['server',500],['constructor',404]]) {
    const response = await request.get(`/api/sample-recovery/${name}`); expect(response.status()).toBe(code); expect(response.headers()['cache-control']).toBe('no-store');
    expect((await request.post(`/api/sample-recovery/${name}`)).status()).toBe(405);
  }
});

test('snapshot values remain exact, untrusted text stays text, and invalid responses hide stale content', async ({ page }) => {
  await start(page); await note(page).fill('A note worth keeping.');
  await page.route('**/assets/project-snapshot.json', route => route.fulfill({ json: fixture }));
  await load(page, 'snapshot'); await expect(snapshot(page).getByRole('heading')).toHaveText(fixture.name);
  await expect(snapshot(page).locator('p')).toHaveText(fixture.summary); await expect(snapshot(page).locator('img,script')).toHaveCount(0);
  await expect(snapshot(page).locator('progress')).toHaveAttribute('value', '3'); await expect(snapshot(page).locator('progress')).toHaveAttribute('max', '7');
  await expect(snapshot(page).getByRole('heading')).toBeFocused();
  await page.unroute('**/assets/project-snapshot.json'); await page.route('**/assets/project-snapshot.json', route => route.fulfill({ json: { ...fixture, completed: 8 } }));
  await load(page, 'snapshot'); await expect(error(page).locator('[data-rf-recovery-state="server"]')).toBeVisible(); await expect(snapshot(page)).not.toBeVisible();
  await expect(error(page).locator('.rf-error-page__code')).toHaveText('↗'); await expect(note(page)).toHaveValue('A note worth keeping.');
});

test('actual missing, denied and failed reads render their shared sections; retry recovers without sending drafts', async ({ page }) => {
  await start(page); await note(page).fill('Keep this thought.'); const methods=[];
  page.on('request', request => { if (request.url().includes('snapshot.json') || request.url().includes('/api/sample-recovery')) methods.push(request.method()); });
  for (const [name, state, code] of [['missing','missing','404'],['permission','permission','403'],['server','server','500']]) {
    await load(page, name); await expect(error(page).locator(`[data-rf-recovery-state="${state}"]`)).toBeVisible();
    await expect(error(page).locator('.rf-error-page__code')).toHaveText(code); await expect(error(page).getByRole('heading')).toBeFocused();
    await expect(snapshot(page)).not.toBeVisible(); await expect(note(page)).toHaveValue('Keep this thought.');
  }
  await page.route('**/api/sample-recovery/server', route => route.fulfill({ json: fixture }));
  await error(page).getByRole('button', { name: 'Try again' }).focus(); await page.keyboard.press('Enter');
  await expect(snapshot(page)).toBeVisible(); await expect(error(page)).not.toBeVisible(); await expect(note(page)).toHaveValue('Keep this thought.');
  expect(methods).toEqual(['GET','GET','GET','GET']);
  await load(page, 'permission'); await error(page).getByRole('link', { name: 'Open workspace team' }).click(); await expect(page).toHaveURL(/dashboard.html#team$/); await expect(page.locator('#team')).toBeVisible();
});

test('an actual offline browser preserves its draft, requires manual retry and returns to the exact resource', async ({ page, context }) => {
  await start(page); await note(page).fill('Still here, 日本語 included.');
  let requests=0; page.on('request', request => { if (request.url().includes('project-snapshot.json')) requests++; });
  await context.setOffline(true); await load(page, 'snapshot');
  await expect(error(page).locator('[data-rf-recovery-state="offline"]')).toBeVisible(); await expect(snapshot(page)).not.toBeVisible(); await expect(note(page)).toHaveValue('Still here, 日本語 included.');
  await context.setOffline(false); const failedRequests=requests; await page.waitForTimeout(200); expect(requests).toBe(failedRequests);
  await error(page).getByRole('button', { name: 'Try again' }).click(); await expect(snapshot(page)).toBeVisible();
  await expect(snapshot(page).getByRole('heading')).toHaveText('A useful little library'); await expect(note(page)).toHaveValue('Still here, 日本語 included.'); expect(requests).toBe(failedRequests+1);
});

test('cancel, superseding selection, late results and the real eight-second timeout keep drafts and focus usable', async ({ page }) => {
  await start(page); await note(page).fill('The draft survives.'); let finish;
  await page.route('**/assets/project-snapshot.json', route => new Promise(resolve => { finish=async () => { await route.fulfill({ json: fixture }).catch(()=>{}); resolve(); }; }));
  await load(page, 'snapshot'); await expect(page.locator('#resource-output')).toHaveAttribute('aria-busy','true'); await expect(page.getByRole('button',{name:'Load resource',exact:true})).toBeDisabled();
  await page.getByRole('button', { name: 'Cancel load' }).click(); await expect(page.locator('#load-status')).toContainText('Read cancelled'); await expect(page.getByRole('button',{name:'Load resource',exact:true})).toBeFocused();
  await finish(); await expect(snapshot(page)).not.toBeVisible(); await expect(page.locator('#resource-output')).not.toHaveAttribute('aria-busy');
  await load(page, 'snapshot'); await page.getByRole('combobox',{name:'Read-only resource'}).selectOption('missing'); await finish(); await expect(page.locator('#load-status')).toContainText('Read cancelled');
  await load(page, 'snapshot'); await note(page).focus(); await expect(page.locator('#load-status')).toContainText('The read timed out', { timeout: 12000 });
  await expect(error(page)).toBeVisible(); await expect(note(page)).toBeFocused(); await finish(); await expect(snapshot(page)).not.toBeVisible(); await expect(note(page)).toHaveValue('The draft survives.');
  await page.unroute('**/assets/project-snapshot.json'); await error(page).getByRole('button',{name:'Try again'}).click(); await expect(snapshot(page)).toBeVisible();
  finish=undefined; await page.route('**/assets/project-snapshot.json',route=>new Promise(resolve=>{finish=async()=>{await route.fulfill({json:fixture}).catch(()=>{});resolve();};}));
  await load(page,'snapshot'); await expect.poll(()=>typeof finish).toBe('function');
  await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}))); await finish();
  await expect(page.getByRole('button',{name:'Load resource',exact:true})).toBeEnabled(); await expect(page.locator('#resource-output')).not.toHaveAttribute('aria-busy'); await expect(note(page)).toHaveValue('The draft survives.');
});

test('the built site has native status pages and recovery works without source-tree routes', async ({ page, request }) => {
  const root=await mkdtemp(join(tmpdir(),'rofin-recovery-')); await cp('dist/site',root,{recursive:true});
  await symlink('loop',join(root,'loop')); await writeFile(join(root,'restricted.txt'),'Private test bytes.'); await chmod(join(root,'restricted.txt'),0);
  const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'4176',RF_SERVE_ROOT:root},stdio:'ignore'});
  try {
    await expect.poll(async()=>{try{return(await request.get('http://127.0.0.1:4176/')).status();}catch{return 0;}}).toBe(200);
    await page.goto('http://127.0.0.1:4176/a/deep/missing/page'); await expect(page.getByRole('heading',{level:1})).toHaveText('This page took a different path.');
    await page.getByRole('link',{name:'Explore components'}).click(); await expect(page).toHaveURL('http://127.0.0.1:4176/index.html#catalog');
    for (const [resource,code,title] of [['loop',500,"We couldn't bring this back yet."],['restricted.txt',403,'A little permission is needed.']]) {
      const response=await page.goto(`http://127.0.0.1:4176/${resource}`); expect(response.status()).toBe(code); await expect(page.getByRole('heading',{level:1})).toHaveText(title); expect(await response.text()).not.toContain('Private test bytes.');
    }
    for(const [file,title] of [['403','A little permission is needed.'],['offline','A pause in the connection.'],['500',"We couldn't bring this back yet."]]) {
      await page.goto(`http://127.0.0.1:4176/${file}.html`); await expect(page.getByRole('heading',{level:1})).toHaveText(title);
      expect((await request.get(`http://127.0.0.1:4176/${file}.html`)).status()).toBe(200);
    }
    await page.goto('http://127.0.0.1:4176/examples/recovery.html'); await expect(page.locator('#load-status')).toContainText('Snapshot loaded'); await load(page,'missing'); await expect(error(page)).toBeVisible();
    expect(await error(page).getByRole('link',{name:'Open dashboard'}).evaluate(link=>link.href)).toBe('http://127.0.0.1:4176/examples/dashboard.html');
    await error(page).getByRole('link',{name:'Explore components'}).click(); await expect(page).toHaveURL('http://127.0.0.1:4176/index.html#catalog');
  } finally { if(server.exitCode===null) { server.kill('SIGTERM'); await once(server,'exit'); } await chmod(join(root,'restricted.txt'),0o600); await rm(root,{recursive:true,force:true}); }
});

test('error sections, recovery and native fallbacks work at narrow widths in both themes', async ({ page, browser }) => {
  const errors=[]; page.on('pageerror',cause=>errors.push(cause.message)); await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['light','dark']) {
    await start(page); await page.locator('html').evaluate((html,value)=>{html.dataset.rfTheme=value;},theme);
    for(const state of ['snapshot','missing','permission','server']) {
      await load(page,state); if(state==='snapshot') await expect(snapshot(page)).toBeVisible(); else await expect(error(page)).toBeVisible();
      for(const width of [320,390,1440]) {
        await page.setViewportSize({width,height:900});
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`${theme}/${state}/${width}`).toBe(false);
      }
      expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
  const context=await browser.newContext({javaScriptEnabled:false}), native=await context.newPage();
  try {
    await native.goto('http://127.0.0.1:4173/examples/recovery.html'); await expect(native.locator('#snapshot')).toBeVisible(); await expect(native.locator('#resource-form')).not.toBeVisible();
    await note(native).fill('Native note.'); await expect(note(native)).toHaveValue('Native note.');
    const response=await native.request.get(new URL(await native.getByRole('link',{name:'Download the snapshot JSON'}).getAttribute('href'),native.url()).href); expect(await response.body()).toEqual(await readFile('examples/assets/project-snapshot.json'));
    await native.goto('http://127.0.0.1:4173/a/missing/path'); await native.getByRole('link',{name:'Open dashboard',exact:true}).click(); await expect(native).toHaveURL(/examples\/dashboard.html$/);
  }finally{await context.close();}
});
