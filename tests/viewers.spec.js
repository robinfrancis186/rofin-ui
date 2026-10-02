import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const route = id => `/docs/index.html#component/${id}`;
const lightbox = page => page.getByRole('dialog', { name: 'Project image viewer' });
const fileDialog = page => page.getByRole('dialog', { name: 'Local file preview' });
const asset = name => `examples/assets/${name}`;
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNoaGj4DwAFhAKAjM1mJgAAAABJRU5ErkJggg==', 'base64');
async function download(page, link) { const next = page.waitForEvent('download'); await link.click(); return readFile(await (await next).path()); }

test('lightbox uses native dialog focus, bounded image navigation and original links', async ({ page, browserName }) => {
  await page.goto(route('image-lightbox')); const links = page.locator('[data-rf-lightbox-item]');
  await links.nth(1).focus(); await page.keyboard.press('Enter'); await expect(lightbox(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close image viewer' })).toBeFocused();
  await expect(page.locator('[data-rf-lightbox-status]')).toHaveText('Image 2 of 3.');
  expect(await lightbox(page).locator('img').evaluate(image => image.naturalWidth)).toBe(960);
  await expect(lightbox(page).locator('img')).toHaveAttribute('alt', /lavender planet/);
  await page.keyboard.press('End'); await expect(page.locator('[data-rf-lightbox-status]')).toHaveText('Image 3 of 3.');
  await expect(page.getByRole('button', { name: 'Next image' })).toBeDisabled();
  await page.keyboard.press('ArrowRight'); await expect(page.locator('[data-rf-lightbox-status]')).toHaveText('Image 3 of 3.');
  await page.keyboard.press('Home'); await expect(page.getByRole('button', { name: 'Previous image' })).toBeDisabled();
  await page.keyboard.press('ArrowRight'); await expect(page.locator('[data-rf-lightbox-caption]')).toHaveText('A wider world of possibility.');
  await expect(page.getByRole('link', { name: 'Open original image' })).toHaveAttribute('href', /examples\/assets\/orbit.svg$/);
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab'); expect(await lightbox(page).evaluate(dialog => dialog.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape'); await expect(lightbox(page)).not.toBeVisible(); await expect(links.nth(1)).toBeFocused();
  await expect(lightbox(page).locator('img')).toHaveCount(0);
  await links.first().click();
  await page.locator('[data-rf-lightbox]').evaluate(root => { root.querySelector('dialog').close(); root.querySelectorAll('[data-rf-lightbox-item]')[2].click(); });
  await expect(lightbox(page)).toBeVisible(); await expect(page.locator('[data-rf-lightbox-status]')).toHaveText('Image 3 of 3.');
  await expect(lightbox(page).locator('img')).toHaveAttribute('src', /studio.svg$/);
});

test('lightbox rejects unsafe opens, handles actual missing images and removes stale listeners', async ({ page }) => {
  await page.goto(route('image-lightbox')); const links = page.locator('[data-rf-lightbox-item]');
  for (const href of ['javascript:window.viewerAttack=1', 'data:text/html,unsafe', 'https://user:secret@example.test/a.png', 'https://example.test/a\n.png', 'x'.repeat(4097)]) {
    await links.first().evaluate((link, value) => link.setAttribute('href', value), href); await links.first().click();
    await expect(lightbox(page)).not.toBeVisible(); await expect(page.locator('[data-rf-lightbox-error]')).toBeVisible();
  }
  expect(await page.evaluate(() => window.viewerAttack)).toBeUndefined();
  await links.first().evaluate(link => link.href='/examples/assets/missing-viewer-image.png'); await links.first().click();
  await expect(lightbox(page)).toBeVisible(); await expect(page.locator('[data-rf-lightbox-status]')).toContainText('could not be displayed');
  await page.getByRole('button', { name: 'Next image' }).click(); await expect(page.locator('[data-rf-lightbox-status]')).toHaveText('Image 2 of 3.');
  await page.locator('[data-rf-lightbox]').evaluate(element => element.setAttribute('aria-disabled','true'));
  await page.keyboard.press('End'); await expect(page.locator('[data-rf-lightbox-status]')).toHaveText('Image 2 of 3.');
  await page.keyboard.press('Escape'); await links.nth(2).focus(); await page.keyboard.press('Enter'); await expect(lightbox(page)).not.toBeVisible();
  await page.locator('[data-rf-lightbox]').evaluate(async element => { element.removeAttribute('aria-disabled'); const m=await import('/src/js/viewers.js');const a=m.createLightbox(element);window.sameLightbox=a===m.createLightbox(element);a.destroy();a.destroy(); });
  expect(await page.evaluate(()=>window.sameLightbox)).toBe(true);
  await links.nth(2).click(); await expect(page).toHaveURL(/studio.svg$/);
});

test('PDF embed, complete text alternative, MIME types and single byte ranges serve actual files', async ({ page, request }) => {
  await page.goto(route('document-viewer')); await page.getByText('Read the project brief as text',{exact:true}).click();
  await expect(page.locator('.rf-document')).toContainText('A product supplies its own accounts, services and durable data.');
  await page.getByText('View the PDF in this browser',{exact:true}).click(); await expect(page.locator('.rf-document object')).toHaveAttribute('type','application/pdf');
  expect(await download(page,page.getByRole('link',{name:'Download project brief (PDF)'}))).toEqual(await readFile(asset('project-brief.pdf')));
  for (const [name,type] of [['project-brief.pdf','application/pdf'],['small-momentum.mp4','video/mp4'],['small-momentum.webm','video/webm'],['three-notes.wav','audio/wav'],['small-momentum.vtt','text/vtt']]) {
    const bytes=await readFile(asset(name)), response=await request.get(`/examples/assets/${name}`); expect(response.status()).toBe(200); expect(response.headers()['content-type']).toContain(type); expect(await response.body()).toEqual(bytes);
    for(const range of ['bytes=3-12','bytes=3-','bytes=-10']) { const r=await request.get(`/examples/assets/${name}`,{headers:{Range:range}}); expect(r.status()).toBe(206); expect(await r.body()).toEqual(range==='bytes=3-12'?bytes.subarray(3,13):range==='bytes=3-'?bytes.subarray(3):bytes.subarray(-10)); }
    const head=await request.head(`/examples/assets/${name}`);expect(head.headers()['content-length']).toBe(String(bytes.length));expect(await head.body()).toHaveLength(0);
    for (const range of [`bytes=${bytes.length}-`,'bytes=3-1','bytes=-0','bytes=1-2,4-5','bytes=999999999999999999999-']) expect((await request.get(`/examples/assets/${name}`,{headers:{Range:range}})).status()).toBe(416);
  }
});

test('local file viewer displays real raster, PDF and safe Unicode text while downloading exact bytes', async ({ page }) => {
  await page.goto(route('document-viewer')); const input=page.locator('[data-rf-file-viewer-input]');
  await input.focus();await input.setInputFiles({name:'A little image.png',mimeType:'image/png',buffer:png});await expect(fileDialog(page)).toBeVisible();
  await expect.poll(()=>fileDialog(page).locator('img').evaluate(img=>img.naturalWidth)).toBe(1);
  expect(await download(page,page.getByRole('link',{name:'Download opened file'}))).toEqual(png);
  await page.keyboard.press('Escape');await expect(input).toBeFocused();
  const text=Buffer.from('<img onerror="window.viewerAttack=1">\n日本語 stays intact.');
  await input.setInputFiles({name:'<svg onload=attack>.txt',mimeType:'text/plain',buffer:text});
  await expect(fileDialog(page).locator('pre')).toHaveText(text.toString());await expect(fileDialog(page).locator('img,svg')).toHaveCount(0);
  expect(await download(page,page.getByRole('link',{name:'Download opened file'}))).toEqual(text);
  await page.getByRole('button',{name:'Close file preview'}).click();
  await input.setInputFiles(asset('project-brief.pdf'));await expect(fileDialog(page).locator('object')).toHaveAttribute('type','application/pdf');
  expect(await download(page,page.getByRole('link',{name:'Download opened file'}))).toEqual(await readFile(asset('project-brief.pdf')));
  expect(await page.evaluate(()=>window.viewerAttack)).toBeUndefined();
  await page.keyboard.press('Escape');await input.setInputFiles({name:'Long note.txt',mimeType:'text/plain',buffer:Buffer.alloc(70000,65)});await expect(fileDialog(page).locator('pre')).toHaveText('A'.repeat(65536));
  await expect(fileDialog(page).getByRole('status')).toContainText('first 64 KB');expect((await download(page,page.getByRole('link',{name:'Download opened file'}))).length).toBe(70000);
  await page.keyboard.press('Escape');const broken=Buffer.from('An unreadable image');await input.setInputFiles({name:'broken.png',mimeType:'image/png',buffer:broken});
  await expect(fileDialog(page).getByRole('status')).toContainText('could not be displayed');expect(await download(page,page.getByRole('link',{name:'Download opened file'}))).toEqual(broken);
});

test('file preview validation, cancelled reads and teardown preserve prior content and release blob URLs', async ({ page }) => {
  await page.goto(route('document-viewer'));
  const result=await page.locator('[data-rf-file-viewer]').evaluate(async element=>{
    const {createFileViewer}=await import('/src/js/viewers.js'); const api=createFileViewer(element);let revoked=[];const revoke=URL.revokeObjectURL.bind(URL);URL.revokeObjectURL=url=>{revoked.push(url);revoke(url);};
    await api.open(new File(['A safe draft.'],'safe.txt',{type:'text/plain'}));const original=element.querySelector('[data-rf-file-viewer-body]').textContent;
    const rejected=[];for(const file of [new File(['x'],'bad.html',{type:'text/html'}),new File(['<svg/>'],'bad.svg',{type:'image/svg+xml'}),new File(['<html>'],'bad.pdf',{type:'application/pdf'}),new File([],'empty.txt',{type:'text/plain'}),new File([new Uint8Array(8*1024*1024+1)],'large.txt',{type:'text/plain'}),new File(['x'],'bad\u202ename.txt',{type:'text/plain'})]) rejected.push(await api.open(file));
    const preserved=element.querySelector('[data-rf-file-viewer-body]').textContent===original;
    let resolve;const pending=new File(['later'],'later.txt',{type:'text/plain'});pending.slice=()=>({text:()=>new Promise(done=>resolve=done)});const task=api.open(pending);
    element.querySelector('dialog').close();await new Promise(done=>element.querySelector('dialog').addEventListener('close',done,{once:true}));resolve('later');const late=await task;
    const reopened=await api.open(new File(['new'],'new.txt',{type:'text/plain'}));const url=element.querySelector('[data-rf-file-viewer-download]').href;
    api.destroy();api.destroy();const after=await api.open(new File(['no'],'after.txt',{type:'text/plain'}));URL.revokeObjectURL=revoke;
    return{rejected,preserved,late,reopened,after,revoked:revoked.length,urlRevoked:revoked.includes(url),body:element.querySelector('[data-rf-file-viewer-body]').textContent,closed:!element.querySelector('dialog').open};
  });
  expect(result).toEqual({rejected:[false,false,false,false,false,false],preserved:true,late:false,reopened:true,after:false,revoked:2,urlRevoked:true,body:'',closed:true});
});

test('native media actually decodes, advances, seeks, loads captions, downloads and stops on teardown', async ({ page }) => {
  await page.goto(route('media-player'));const video=page.locator('video'),audio=page.locator('audio');
  expect(await video.evaluate(v=>v.controls&&!v.autoplay&&v.paused)).toBe(true);expect(await audio.evaluate(a=>a.controls&&!a.autoplay&&a.paused)).toBe(true);
  await video.evaluate(v=>v.play());await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(.15);await expect.poll(()=>video.evaluate(v=>v.videoWidth)).toBe(640);
  await expect.poll(()=>video.evaluate(v=>v.textTracks[0]?.cues?.length||0)).toBe(1);expect(await video.evaluate(v=>v.textTracks[0].cues[0].text)).toContain('golden dot');
  await audio.evaluate(a=>a.play());await expect.poll(()=>video.evaluate(v=>v.paused)).toBe(true);await expect.poll(()=>audio.evaluate(a=>a.currentTime)).toBeGreaterThan(.15);
  await video.evaluate(v=>{v.currentTime=1.5;return v.play();});await expect.poll(()=>audio.evaluate(a=>a.paused)).toBe(true);await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(1.6);
  expect(await download(page,page.getByRole('link',{name:'Download MP4 video'}))).toEqual(await readFile(asset('small-momentum.mp4')));
  expect(await download(page,page.getByRole('link',{name:'Download WAV audio'}))).toEqual(await readFile(asset('three-notes.wav')));
  await page.evaluate(async()=>{const m=await import('/src/js/viewers.js');window.stopMedia=m.initViewers(document.querySelector('[data-rf-media]'));window.stopMedia();window.stopMedia();});expect(await video.evaluate(v=>v.paused)).toBe(true);
  await page.evaluate(async()=>{const m=await import('/src/js/viewers.js');m.initViewers(document.querySelector('[data-rf-media]'));window.stopMedia();});await audio.evaluate(a=>a.play());await expect(page.locator('[data-rf-media-status]')).toContainText('Playing Three quiet notes');
});

test('dashboard selected files preview after import/rename and workspace changes close previews and clear selection', async ({ page }) => {
  await page.goto('/examples/dashboard.html#resources');const preview=page.getByRole('button',{name:'Preview selected file'});await expect(preview).toBeDisabled();
  await page.locator('#project-files').setInputFiles({name:'Studio image.png',mimeType:'image/png',buffer:png});await expect(preview).toBeEnabled();await preview.click();await expect(fileDialog(page).locator('img')).toHaveAttribute('alt','Studio image.png');await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Rename item'}).click();await page.getByLabel('Item name',{exact:true}).fill('New studio name.png');await page.getByRole('button',{name:'Save file change'}).click();await preview.click();await expect(fileDialog(page).locator('img')).toHaveAttribute('alt','New studio name.png');await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Switch workspace: Studio'}).click();await page.getByRole('menuitem',{name:'Personal workspace'}).click();await expect(preview).toBeDisabled();
  await page.getByRole('treeitem',{name:'Reading list.txt',exact:true}).click();await preview.click();await expect(fileDialog(page).locator('pre')).toHaveText('A few good pages.\n');await page.keyboard.press('Escape');
  await page.locator('[data-rf-media] video').evaluate(v=>v.play());
  await page.getByRole('button',{name:'Switch workspace: Personal'}).click();await page.getByRole('menuitem',{name:'Studio workspace'}).click();await expect(preview).toBeDisabled();expect(await page.locator('[data-rf-media] video').evaluate(v=>v.paused)).toBe(true);
  await page.getByRole('treeitem',{name:'New studio name.png',exact:true}).click();await preview.click();await expect(fileDialog(page).locator('img')).toHaveAttribute('alt','New studio name.png');
  await page.reload();await expect(preview).toBeDisabled();await expect(page.getByRole('treeitem',{name:'New studio name.png',exact:true})).toHaveCount(0);
});

test('viewers fit narrow themes, pass automated accessibility and retain genuine scripts-off fallbacks', async ({ page, browser }) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['light','dark'])for(const id of ['image-lightbox','document-viewer','media-player']){
    await page.goto(route(id));await page.locator('html').evaluate((el,value)=>el.dataset.rfTheme=value,theme);
    if(id==='image-lightbox')await page.locator('[data-rf-lightbox-item]').first().click();
    if(id==='document-viewer')await page.locator('[data-rf-file-viewer-input]').setInputFiles({name:'Long name '.repeat(10)+'.txt',mimeType:'text/plain',buffer:Buffer.from('An accessible little preview.')});
    for(const width of [320,390,1440]){await page.setViewportSize({width,height:844});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} ${id} ${width}`).toBe(true);}
    const axe=await new AxeBuilder({page}).include(id==='image-lightbox'?'[data-rf-lightbox-dialog]':id==='document-viewer'?'[data-rf-file-viewer-dialog]':'.preview').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(axe.violations,`${theme} ${id}`).toEqual([]);
  }
  expect(errors).toEqual([]);
  const context=await browser.newContext({javaScriptEnabled:false}), fallback=await context.newPage();
  await fallback.goto('http://127.0.0.1:4173/examples/components/image-lightbox.html');await fallback.locator('[data-rf-lightbox-item]').nth(1).click();await expect(fallback).toHaveURL(/orbit.svg$/);
  await fallback.goto('http://127.0.0.1:4173/examples/components/document-viewer.html');await fallback.getByText('Read the project brief as text',{exact:true}).click();await expect(fallback.getByText('Build a useful workspace from small, reusable pieces.',{exact:false})).toBeVisible();expect(await download(fallback,fallback.getByRole('link',{name:'Download project brief (PDF)'}))).toEqual(await readFile(asset('project-brief.pdf')));
  await fallback.goto('http://127.0.0.1:4173/examples/components/media-player.html');expect(await fallback.locator('video').getAttribute('controls')).toBe('');expect(await download(fallback,fallback.getByRole('link',{name:'Download WAV audio'}))).toEqual(await readFile(asset('three-notes.wav')));await context.close();
});
