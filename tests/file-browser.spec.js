import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';

const route = '/docs/index.html#component/file-browser';
const root = page => page.locator('[data-rf-file-browser]');
const item = (page, name) => root(page).getByRole('treeitem', { name, exact: true });
const action = (page, name) => root(page).getByRole('button', { name, exact: true });
const dialog = page => root(page).getByRole('dialog');
const entries = page => root(page).evaluate(async element => (await import('/src/js/file-browser.js')).createFileBrowser(element).getEntries().map(({ file, ...entry }) => ({ ...entry, size: file?.size, type: file?.type, modified: file?.lastModified })));
async function create(page, button, name, contents) {
  await action(page, button).click(); await dialog(page).getByLabel('Item name').fill(name);
  if (contents !== undefined) await dialog(page).getByLabel('Text contents').fill(contents);
  await dialog(page).getByRole('button', { name: 'Save file change' }).click(); await expect(dialog(page)).not.toBeVisible();
}

test('file tree keyboard navigation, selection, search, composition and readonly states agree', async ({ page }) => {
  await page.goto(route); const ideas = item(page, 'Ideas folder'), research = item(page, 'Research folder'), notes = item(page, 'Notes.txt');
  await root(page).evaluate(element=>{window.fileSelections=[];element.addEventListener('rf:file-select',event=>window.fileSelections.push(event.detail.entry?.name??null));});
  await expect(root(page).locator('[role="treeitem"][tabindex="0"]')).toHaveCount(1);
  await ideas.focus(); await expect(ideas).toHaveAttribute('aria-selected', 'true'); await ideas.press('ArrowRight'); await expect(ideas).toHaveAttribute('aria-expanded', 'true'); await expect(ideas).toBeFocused();
  await ideas.press('ArrowRight'); await expect(research).toBeFocused(); expect(await page.evaluate(()=>window.fileSelections)).toEqual(['Ideas','Research']); await research.press('ArrowRight'); await research.press('ArrowRight'); await expect(notes).toBeFocused(); await expect(notes).toHaveAttribute('aria-level', '3');
  await notes.press('ArrowLeft'); await expect(research).toBeFocused(); await research.press('ArrowLeft'); await expect(research).toHaveAttribute('aria-expanded', 'false'); await research.press('ArrowLeft'); await expect(ideas).toBeFocused(); await ideas.press('ArrowLeft'); await expect(ideas).toHaveAttribute('aria-expanded', 'false');
  await ideas.press('End'); await expect(item(page, 'Readme.txt')).toBeFocused(); await item(page, 'Readme.txt').press('Home'); await expect(ideas).toBeFocused(); await ideas.press('r'); await expect(item(page, 'Readme.txt')).toBeFocused();
  const before = await entries(page); await item(page, 'Readme.txt').evaluate(element => element.dispatchEvent(new KeyboardEvent('keydown', { key:'ArrowUp',bubbles:true,isComposing:true }))); await expect(item(page, 'Readme.txt')).toBeFocused();
  await root(page).getByLabel('Search files and folders').fill('Notes.txt'); await expect(notes).toBeVisible(); await expect(root(page).locator('[role="treeitem"]')).toHaveCount(3); await expect(action(page, 'Trash item')).toBeDisabled();
  expect(await page.evaluate(()=>window.fileSelections.at(-1))).toBe(null);
  await notes.click(); await expect(action(page, 'Download file')).toBeEnabled(); await expect(root(page).locator('[data-rf-file-details]')).toContainText('Ideas/Research/Notes.txt');
  await root(page).evaluate(element => element.setAttribute('data-rf-readonly', '')); await expect(action(page, 'Rename item')).toBeDisabled(); await expect(action(page, 'Download file')).toBeEnabled(); await expect(root(page).getByLabel('Project files')).toBeDisabled();
  await root(page).evaluate(element => element.setAttribute('aria-disabled', 'true')); await expect(action(page, 'Download file')).toBeDisabled(); await expect(root(page).locator('[role="treeitem"][tabindex="0"]')).toHaveCount(0);
  expect(await root(page).evaluate(async element => (await import('/src/js/file-browser.js')).createFileBrowser(element).importFiles([new File(['x'],'Blocked.txt')]))).toBe(false); expect(await entries(page)).toEqual(before);
});

test('actual imported bytes survive rename, move, download, folder trash and restoration', async ({ page }) => {
  await page.goto(route); const bytes=Buffer.from([0,1,2,255,254,10,13,65]);
  await root(page).getByLabel('Project files').setInputFiles({name:'Asset.bin',mimeType:'application/octet-stream',buffer:bytes}); await expect(item(page,'Asset.bin')).toHaveAttribute('aria-selected','true');
  const imported=(await entries(page)).find(entry=>entry.name==='Asset.bin');
  await action(page,'Rename item').click(); await dialog(page).getByLabel('Item name').fill('Renamed.bin'); await dialog(page).getByRole('button',{name:'Save file change'}).click(); await expect(item(page,'Renamed.bin')).toBeFocused();
  const renamed=(await entries(page)).find(entry=>entry.name==='Renamed.bin'); expect(renamed).toMatchObject({id:imported.id,size:bytes.length,type:imported.type,modified:imported.modified});
  await create(page,'New folder','Keepsakes'); await expect(item(page,'Keepsakes folder')).toBeFocused(); await create(page,'New text file','Thought.txt','A useful thought.\n日本語');
  await item(page,'Renamed.bin').click(); await action(page,'Move item').click(); await dialog(page).getByLabel('Destination folder').selectOption({label:'Keepsakes'}); await dialog(page).getByRole('button',{name:'Save file change'}).click(); await expect(root(page).locator('[data-rf-file-details]')).toContainText('Keepsakes/Renamed.bin');
  const downloading=page.waitForEvent('download'); await action(page,'Download file').click(); const download=await downloading; expect(download.suggestedFilename()).toBe('Renamed.bin'); expect(await readFile(await download.path())).toEqual(bytes);
  await item(page,'Thought.txt').click(); const textDownload=page.waitForEvent('download'); await action(page,'Download file').click(); expect((await readFile(await (await textDownload).path())).toString()).toBe('A useful thought.\n日本語');
  await item(page,'Renamed.bin').click(); await action(page,'Rename item').click(); await dialog(page).getByLabel('Item name').fill('THOUGHT.TXT'); await dialog(page).getByRole('button',{name:'Save file change'}).click(); await expect(dialog(page).locator('[role="alert"]')).toContainText('already uses'); await expect(dialog(page).getByLabel('Item name')).toHaveValue('THOUGHT.TXT'); await dialog(page).press('Escape');
  await item(page,'Keepsakes folder').locator(':scope > .rf-file-row').click(); await expect(item(page,'Keepsakes folder')).toHaveAttribute('aria-selected','true'); await action(page,'Move item').click(); await expect(dialog(page).getByLabel('Destination folder').locator('option')).not.toContainText(['Keepsakes']); await dialog(page).press('Escape');
  await action(page,'Trash item').click(); await dialog(page).getByRole('button',{name:'Move to Trash'}).click(); await expect(item(page,'Keepsakes folder')).toHaveCount(0); expect((await entries(page)).filter(entry=>entry.trashed)).toHaveLength(3); await expect(action(page,'Restore trash')).toBeEnabled();
  await action(page,'Restore trash').click(); await item(page,'Keepsakes folder').focus(); await item(page,'Keepsakes folder').press('ArrowRight'); await item(page,'Renamed.bin').click(); const restored=page.waitForEvent('download'); await action(page,'Download file').click(); expect(await readFile(await (await restored).path())).toEqual(bytes); await expect(action(page,'Restore trash')).toBeDisabled();
});

test('native folder import preserves nested paths and atomic rejection preserves existing files', async ({ page }) => {
  const directory=await mkdtemp(join(tmpdir(),'rf-files-'));
  try {
    await mkdir(join(directory,'Research')); await writeFile(join(directory,'Research','Finding.txt'),'Keep the real bytes.\n'); await writeFile(join(directory,'Brief.txt'),'A new beginning.\n'); await page.goto(route);
    await root(page).getByLabel('Import folder').setInputFiles(directory); await root(page).getByLabel('Search files and folders').fill('Finding.txt'); await expect(item(page,'Finding.txt')).toBeVisible(); await item(page,'Finding.txt').click(); await expect(root(page).locator('[data-rf-file-details]')).toContainText(`${basename(directory)}/Research/Finding.txt`);
    const downloading=page.waitForEvent('download'); await action(page,'Download file').click(); expect((await readFile(await (await downloading).path())).toString()).toBe('Keep the real bytes.\n');
    const before=await entries(page); await root(page).getByLabel('Project files').setInputFiles([{name:'Good.txt',mimeType:'text/plain',buffer:Buffer.from('good')},{name:'Finding.txt',mimeType:'text/plain',buffer:Buffer.from('collision')}]); await expect(root(page).locator('[data-rf-file-error]')).toContainText('already uses'); expect(await entries(page)).toEqual(before); await expect(item(page,'Good.txt')).toHaveCount(0);
  } finally { await rm(directory,{recursive:true,force:true}); }
});

test('file limits and invalid topology are rejected without rendering or mutating entries', async ({ page }) => {
  await page.goto(route);
  const checked=await root(page).evaluate(async element=>{
    const {createFileBrowser}=await import('/src/js/file-browser.js'); let browser=createFileBrowser(element), initial=browser.getEntries();
    const invalidImports=[new File(['x'],'../escape.txt'),new File(['x'],' hidden.txt'),new File(['x'],'bad\u202ename.txt'),new File([new Uint8Array(8*1024*1024+1)],'Huge.bin')]; const accepted=[];
    for(const file of invalidImports) accepted.push(await browser.importFiles([file]));
    const invalid=[ [{id:'a',parentId:'a',kind:'folder',name:'Cycle'}], [{id:'a',parentId:'missing',kind:'folder',name:'Missing'}], [{id:'a',parentId:null,kind:'file',name:'Different.txt',file:new File(['x'],'Actual.txt')}], Array.from({length:201},(_,i)=>({id:String(i),parentId:null,kind:'folder',name:`Folder ${i}`})), Array.from({length:13},(_,i)=>({id:String(i),parentId:i?String(i-1):null,kind:'folder',name:`Level ${i}`})), Array.from({length:5},(_,i)=>({id:String(i),parentId:null,kind:'file',name:`Large ${i}.bin`,file:new File([new Uint8Array(8*1024*1024)],`Large ${i}.bin`)})) ];
    const remaining=browser.getEntries().length; browser.destroy(); const rejected=invalid.map(entries=>{try {createFileBrowser(element,{entries});return false;}catch{return true;}}); browser=createFileBrowser(element,{entries:initial});
    const safeName='<img onerror=alert(1)>.txt'; const safe=await browser.importFiles([new File(['literal'],safeName)]); const state=browser.getEntries(); state[0].name='Tampered';
    return {accepted,remaining,initial:initial.length,rejected,safe,untouched:browser.getEntries()[0].name!== 'Tampered',activeMarkup:element.querySelectorAll('img,script,[onerror]').length};
  });
  expect(checked.accepted).toEqual([false,false,false,false]); expect(checked.remaining).toBe(checked.initial); expect(checked.rejected).toEqual(Array(6).fill(true)); expect(checked.safe).toBe(true); expect(checked.untouched).toBe(true); expect(checked.activeMarkup).toBe(0); await expect(item(page,'<img onerror=alert(1)>.txt')).toBeVisible();
});

test('failed saves retain drafts and cancelled or destroyed callbacks cannot commit late', async ({ page }) => {
  await page.goto(route); await root(page).evaluate(async element=>{
    const {createFileBrowser}=await import('/src/js/file-browser.js'); const previous=createFileBrowser(element), entries=previous.getEntries();previous.destroy(); window.fileCalls=[];
    window.fileBrowser=createFileBrowser(element,{entries,onChange:(entries,context)=>new Promise((resolve,reject)=>window.fileCalls.push({entries,context,resolve,reject}))});
  });
  await action(page,'New folder').click(); await dialog(page).getByLabel('Item name').fill('Retained draft'); await dialog(page).getByRole('button',{name:'Save file change'}).click(); await expect(root(page)).toHaveAttribute('aria-busy','true'); await expect(dialog(page).getByLabel('Item name')).toBeDisabled();
  await page.evaluate(()=>window.fileCalls[0].reject(Error('Please try again.'))); await expect(dialog(page).locator('[role="alert"]')).toHaveText('Please try again.'); await expect(dialog(page).getByLabel('Item name')).toHaveValue('Retained draft'); await expect(item(page,'Retained draft folder')).toHaveCount(0);
  await dialog(page).getByRole('button',{name:'Save file change'}).click(); await dialog(page).getByRole('button',{name:'Cancel file change'}).click(); await expect(dialog(page)).not.toBeVisible(); expect(await page.evaluate(()=>window.fileCalls[1].context.signal.aborted)).toBe(true); await page.evaluate(()=>window.fileCalls[1].resolve()); await expect(item(page,'Retained draft folder')).toHaveCount(0);
  await action(page,'New folder').click(); await dialog(page).getByLabel('Item name').fill('Escape draft'); await dialog(page).getByRole('button',{name:'Save file change'}).click(); await dialog(page).press('Escape'); await expect(dialog(page)).not.toBeVisible(); expect(await page.evaluate(()=>window.fileCalls[2].context.signal.aborted)).toBe(true); await page.evaluate(()=>window.fileCalls[2].resolve()); await expect(item(page,'Escape draft folder')).toHaveCount(0);
  await action(page,'New folder').click(); await dialog(page).getByLabel('Item name').fill('Confirmed'); await dialog(page).getByRole('button',{name:'Save file change'}).click(); await page.evaluate(()=>{window.fileCalls[3].entries[0].name='Mutated callback copy';window.fileCalls[3].resolve();}); await expect(item(page,'Confirmed folder')).toBeVisible(); await expect(item(page,'Ideas folder')).toBeVisible();
  const count=(await entries(page)).length; await page.evaluate(()=>{window.filePending=window.fileBrowser.importFiles([new File(['late'],'Late.txt')]);}); await expect(root(page)).toHaveAttribute('aria-busy','true');
  await action(page,'Cancel pending file change').click(); await page.evaluate(()=>window.fileCalls[4].resolve()); expect(await page.evaluate(async()=>({accepted:await window.filePending,aborted:window.fileCalls[4].context.signal.aborted}))).toEqual({accepted:false,aborted:true});
  await page.evaluate(()=>{window.filePending=window.fileBrowser.importFiles([new File(['late'],'Late.txt')]);}); await expect(root(page)).toHaveAttribute('aria-busy','true');
  await page.evaluate(()=>{window.fileBrowser.destroy();window.fileCalls[5].resolve();}); await expect(root(page).locator('[data-rf-file-fallback]')).toBeVisible(); await expect(root(page).locator('[data-rf-file-enhanced]')).toBeHidden(); expect(await page.evaluate(async()=>({accepted:await window.filePending,aborted:window.fileCalls[5].context.signal.aborted,count:window.fileBrowser.getEntries().length}))).toEqual({accepted:false,aborted:true,count});
  await page.reload(); const downloading=page.waitForEvent('download'); await item(page,'Readme.txt').click(); const revoked=await root(page).evaluate(()=>{window.fileRevoked=[];window.originalRevoke=URL.revokeObjectURL;URL.revokeObjectURL=url=>{window.fileRevoked.push(url);window.originalRevoke.call(URL,url);};return window.fileRevoked.length;}); expect(revoked).toBe(0); await action(page,'Download file').click(); await downloading;
  await root(page).evaluate(async element=>(await import('/src/js/file-browser.js')).createFileBrowser(element).destroy()); expect(await page.evaluate(()=>window.fileRevoked.length)).toBe(1);
});

test('dashboard file browser preserves workspace files and Trash while switching clears selection', async ({ page }) => {
  await page.goto('/examples/dashboard.html#resources'); await create(page,'New text file','Studio idea.txt','A Studio thought.'); await action(page,'Trash item').click(); await dialog(page).getByRole('button',{name:'Move to Trash'}).click();
  await page.getByRole('button',{name:'Switch workspace: Studio'}).click(); await page.getByRole('menuitem',{name:'Personal workspace',exact:true}).click(); await expect(item(page,'Reading list.txt')).toBeVisible(); await expect(action(page,'Restore trash')).toBeDisabled(); await create(page,'New text file','Personal idea.txt','An idea of my own.');
  await page.getByRole('button',{name:'Switch workspace: Personal'}).click(); await page.getByRole('menuitem',{name:'Studio workspace',exact:true}).click(); await expect(item(page,'Personal idea.txt')).toHaveCount(0); await expect(action(page,'Download file')).toBeDisabled(); await action(page,'Restore trash').click(); await expect(item(page,'Studio idea.txt')).toBeVisible();
  await page.getByRole('link',{name:'Files & resources',exact:true}).click(); await expect(page.locator('.rf-breadcrumb [aria-current]')).toHaveText('Files & resources'); await item(page,'Studio idea.txt').click(); const downloading=page.waitForEvent('download'); await action(page,'Download file').click(); expect((await readFile(await (await downloading).path())).toString()).toBe('A Studio thought.');
  await page.reload(); await expect(item(page,'Studio idea.txt')).toHaveCount(0); await expect(item(page,'Ideas folder')).toBeVisible();
});

test('file browser, long names and native dialogs fit both themes and pass automated WCAG checks', async ({ page }) => {
  test.setTimeout(90000); const errors=[]; page.on('pageerror',error=>errors.push(error.message)); await page.emulateMedia({reducedMotion:'reduce'});
  for(const theme of ['light','dark']) {
    await page.goto(route); await page.locator('html').evaluate((element,theme)=>element.dataset.rfTheme=theme,theme);
    expect(await root(page).locator('[data-rf-file-tree]').evaluate(element=>getComputedStyle(element).listStyleType)).toBe('none');
    expect(await root(page).locator('.rf-file-row').first().evaluate(element=>element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    await root(page).getByLabel('Project files').setInputFiles({name:'A'.repeat(115)+'.txt',mimeType:'text/plain',buffer:Buffer.from('A long name.')});
    for(const width of [320,390,1440]) {await page.setViewportSize({width,height:900}); expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);}
    await page.setViewportSize({width:390,height:844}); expect((await new AxeBuilder({page}).include('.preview').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]); await page.screenshot({path:`output/playwright/rofin-file-browser-${theme}-390.png`});
    await action(page,'Rename item').click(); await expect(dialog(page).getByLabel('Item name')).toBeFocused(); expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]); await dialog(page).press('Escape'); await expect(action(page,'Rename item')).toBeFocused();
    await page.goto('/examples/dashboard.html#resources'); await page.locator('html').evaluate((element,theme)=>element.dataset.rfTheme=theme,theme); expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false); expect((await new AxeBuilder({page}).include('[data-rf-file-browser]').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  }
  expect(errors).toEqual([]);
});

test('without scripts, native folder details and sample downloads remain usable', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,acceptDownloads:true}), page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/examples/components/file-browser.html'); await page.getByText('Ideas',{exact:true}).click(); await expect(page.getByRole('link',{name:'Roadmap.txt',exact:true})).toBeVisible(); await page.getByText('Research',{exact:true}).click(); const downloading=page.waitForEvent('download'); await page.getByRole('link',{name:'Notes.txt',exact:true}).click(); expect((await readFile(await (await downloading).path())).toString()).toBe('Start with the people using it.\n');
  await page.goto('http://127.0.0.1:4173/examples/dashboard.html#resources'); await expect(page.getByRole('link',{name:'Readme.txt',exact:true})).toBeVisible(); await expect(page.locator('[data-rf-file-enhanced]')).toBeHidden(); await context.close();
});
