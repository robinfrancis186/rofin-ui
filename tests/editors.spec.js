import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const rich = '[data-rf-rich-editor]', markdown = '[data-rf-markdown-editor]', field = '[data-rf-editor-source]', canvas = '[data-rf-rich-surface]';
async function selectText(locator, text) {
  await locator.evaluate((element, text) => {
    element.focus(); const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT); let node;
    while ((node = walker.nextNode())) { const start = node.data.indexOf(text); if (start < 0) continue; const range = document.createRange(); range.setStart(node, start); range.setEnd(node, start + text.length); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); document.dispatchEvent(new Event('selectionchange')); return; }
    throw Error('Selection text not found');
  }, text);
}

test('rich-text formatting, native undo/redo and real form values agree', async ({ page }) => {
  await page.goto('/docs/index.html#component/rich-text-editor');
  const editor = page.locator(rich), surface = editor.locator(canvas), source = editor.locator(field);
  await surface.fill('A useful idea'); await selectText(surface, 'useful');
  await editor.getByRole('button', { name: 'Bold', exact: true }).click();
  await expect(surface.locator('b, strong')).toHaveText('useful');
  await expect(source).toHaveValue(/A <strong>useful<\/strong> idea/);
  expect(await editor.locator('form').first().evaluate(form => new FormData(form).get('note'))).toBe(await source.inputValue());
  await editor.getByRole('button', { name: 'Undo', exact: true }).click(); await expect(surface.locator('b, strong')).toHaveCount(0);
  await editor.getByRole('button', { name: 'Redo', exact: true }).click(); await expect(surface.locator('b, strong')).toHaveText('useful');
  await selectText(surface, 'idea'); await editor.getByRole('button', { name: 'Italic', exact: true }).click(); await expect(source).toHaveValue(/<em>idea<\/em>/);
  await editor.getByLabel('Paragraph style').selectOption('h2'); await expect(source).toHaveValue(/<h2>/);
  await editor.getByRole('button', { name: 'Bullet list', exact: true }).click(); await expect(source).toHaveValue(/<ul>/);
});

test('rich-text links, required validation, reset, composition and disabled fields stay usable', async ({ page }) => {
  await page.goto('/docs/index.html#component/rich-text-editor');
  const editor = page.locator(rich), surface = editor.locator(canvas), source = editor.locator(field);
  await surface.fill('Read this'); await selectText(surface, 'this'); await surface.press('ControlOrMeta+k');
  const dialog = editor.getByRole('dialog', { name: 'Add a useful link.' }); await expect(dialog).toBeVisible();
  await dialog.getByLabel('Link URL').fill('javascript:alert(1)'); await dialog.getByRole('button', { name: 'Insert link' }).click(); await expect(dialog.locator('[data-rf-editor-link-error]')).toBeVisible();
  await dialog.getByLabel('Link URL').fill('https://example.com/guide'); await dialog.getByRole('button', { name: 'Insert link' }).click();
  await expect(dialog).not.toBeVisible(); await expect(surface).toBeFocused(); await expect(surface.locator('a')).toHaveText('this'); await expect(source).toHaveValue(/noopener noreferrer/);
  await editor.getByRole('button', { name: 'Remove link' }).click(); await expect(source).not.toHaveValue(/<a/);
  await surface.fill(''); await editor.getByRole('button', { name: 'Preview note' }).click(); await expect(surface).toBeFocused(); await expect(editor.locator('[data-rf-editor-error]')).toHaveText('Enter a rich-text note.');
  const emptyValue = await source.inputValue();
  await surface.evaluate(element => { element.dispatchEvent(new CompositionEvent('compositionstart')); element.textContent = '日本語'; element.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true })); }); await expect(source).toHaveValue(emptyValue);
  await surface.evaluate(element => element.dispatchEvent(new CompositionEvent('compositionend'))); await expect(source).toHaveValue('日本語');
  await source.evaluate(element => element.readOnly = true); await expect(surface).toHaveAttribute('contenteditable', 'false'); await expect(editor.getByRole('button', { name: 'Bold', exact: true })).toBeDisabled();
  await source.evaluate(element => element.readOnly = false); await expect(surface).toHaveAttribute('contenteditable', 'true');
  await editor.locator('form').first().evaluate(form => form.addEventListener('reset', event => event.preventDefault(), { once: true })); await editor.getByRole('button', { name: 'Reset note' }).click(); await expect(source).toHaveValue('日本語');
  await editor.getByRole('button', { name: 'Reset note' }).click(); await expect(surface).toContainText('your next idea');
  await source.evaluate(element => element.disabled = true); await expect(surface).toHaveAttribute('aria-disabled', 'true'); await expect(surface).toHaveAttribute('tabindex', '-1');
});

test('rich paste reconstructs allowlisted content without executing markup or loading images', async ({ page }) => {
  const remote = []; page.on('request', request => { if (request.url().includes('editor-probe')) remote.push(request.url()); });
  await page.goto('/docs/index.html#component/rich-text-editor');
  const editor = page.locator(rich), surface = editor.locator(canvas);
  await surface.fill(''); await surface.focus();
  await surface.evaluate(element => {
    const data = new DataTransfer(); data.setData('text/html', '<p onclick="window.editorProbe=1">Safe <b>bold</b><span style="font-weight:700;font-style:italic;background:url(https://example.com/editor-probe)">marks</span><a href="javascript:alert(1)">bad</a><a href="https://user:pass@example.com">credentials</a><a href="https://example.com/good" target="_top">good</a><img src="https://example.com/editor-probe" onerror="window.editorProbe=1"><script>window.editorProbe=1</script><svg><a href="https://example.com/editor-probe">svg</a></svg><math><mtext>math</mtext></math><iframe src="https://example.com/editor-probe"></iframe><input autofocus></p>');
    const event = new Event('paste', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'clipboardData', { value: data }); element.dispatchEvent(event);
  });
  await expect(editor.locator(field)).toHaveValue(/<strong>bold<\/strong>/); await expect(surface.locator('a')).toHaveCount(1);
  await expect(surface.locator('script,img,svg,math,iframe,input,[onclick],[style]')).toHaveCount(0);
  expect(await page.evaluate(() => window.editorProbe)).toBeUndefined(); expect(remote).toEqual([]);
  const checked = await page.evaluate(async () => {
    const { sanitizeRichText, editorLink } = await import('/src/js/editors.js');
    const payloads = ['<svg><foreignObject><p onclick="alert(1)">x</p></foreignObject></svg>', '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(1)>', '<a href="java&#x09;script:alert(1)" onclick="alert(1)">x</a>', '<p id=x class=x style="color:red">okay</p>'];
    return { html: payloads.map(value => sanitizeRichText(value)), links: ['https://example.com','mailto:hello@example.com','/relative','data:text/html,x','https://a:b@example.com','https:\n//example.com'].map(editorLink), excessive: (() => { try { sanitizeRichText('x'.repeat(50001)); return false; } catch { return true; } })() };
  });
  expect(checked.html).toEqual(['', '', 'x', '<p>okay</p>']); expect(checked.links).toEqual(['https://example.com/','mailto:hello@example.com',null,null,null,null]); expect(checked.excessive).toBe(true);
  await surface.evaluate(element => { const data = new DataTransfer(); data.setData('text/plain', '<img src=x>\nA plain thought'); const event = new Event('drop', { bubbles: true, cancelable: true }); Object.defineProperty(event, 'dataTransfer', { value: data }); element.dispatchEvent(event); }); await expect(surface).toContainText('<img src=x>'); await expect(surface.locator('img')).toHaveCount(0);
});

test('Markdown selection formatting, links, form values, reset and read-only behavior agree', async ({ page }) => {
  await page.goto('/docs/index.html#component/markdown-editor');
  const editor = page.locator(markdown), source = editor.locator(field), preview = editor.locator('[data-rf-markdown-preview]');
  await source.fill('A useful idea'); await source.evaluate(element => element.setSelectionRange(2,8)); await source.press('ControlOrMeta+b'); await expect(source).toHaveValue('A **useful** idea'); await expect(preview.locator('strong')).toHaveText('useful');
  expect(await editor.locator('form').first().evaluate(form => new FormData(form).get('notes'))).toBe('A **useful** idea');
  await source.evaluate(element => element.setSelectionRange(13,17)); await source.press('ControlOrMeta+k'); const dialog = editor.getByRole('dialog', { name: 'Add a useful link.' }); await dialog.getByLabel('Link URL').fill('https://example.com'); await dialog.getByRole('button', { name: 'Insert link' }).click(); await expect(source).toBeFocused(); await expect(preview.locator('a')).toHaveText('idea');
  await source.evaluate(element => element.readOnly = true); await expect(editor.getByRole('button', { name: 'Bold', exact: true })).toBeDisabled(); await source.evaluate(element => element.readOnly = false);
  await editor.getByRole('button', { name: 'Reset note' }).click(); await expect(source).toHaveValue(/Your next chapter/); await expect(preview.locator('h3')).toHaveText('Your next chapter');
  await source.focus(); await source.evaluate(element=>element.setSelectionRange(element.value.length,element.value.length)); await source.press('Enter'); const beforeTyping = await source.inputValue(); await source.pressSequentially('new idea'); await expect(preview).toContainText('new idea'); const base = beforeTyping.trimEnd();
  for (let i = 0; i < 12 && (await source.inputValue()).trimEnd() !== base; i++) { await source.press('ControlOrMeta+z'); const value = (await source.inputValue()).trimEnd(); expect(value === base || value.startsWith(base + '\n') && 'new idea'.startsWith(value.slice(base.length + 1))).toBe(true); }
  expect((await source.inputValue()).trimEnd()).toBe(base);
  await source.evaluate(element => { element.dispatchEvent(new CompositionEvent('compositionstart')); element.value = '**日本語**'; element.dispatchEvent(new InputEvent('input', { bubbles:true,isComposing:true })); }); await expect(preview.locator('strong')).toHaveText('a good idea');
  await source.evaluate(element => element.dispatchEvent(new CompositionEvent('compositionend'))); await expect(preview.locator('strong')).toHaveText('日本語');
  await source.fill('One\nTwo\nThree'); await source.evaluate(element => element.setSelectionRange(0,4)); await editor.getByRole('button',{name:'Bullet list',exact:true}).click(); await expect(source).toHaveValue('- One\nTwo\nThree');
  for (const [name, selector] of [['Heading','h3'],['Quote','blockquote'],['Inline code','p code'],['Code block','pre code']]) { await source.fill('A thought'); await source.evaluate(element=>element.setSelectionRange(0,9)); await editor.getByRole('button',{name,exact:true}).click(); await expect(preview.locator(selector)).toHaveText('A thought'); }
  await source.fill('A [bracket]'); await source.evaluate(element=>element.setSelectionRange(0,11)); await source.press('ControlOrMeta+k'); await dialog.getByLabel('Link URL').fill('https://example.com/(guide)'); await dialog.getByRole('button',{name:'Insert link'}).click(); await expect(preview.locator('a')).toHaveText('A [bracket]'); await expect(preview.locator('a')).toHaveAttribute('href','https://example.com/%28guide%29');
  await source.evaluate(element=>element.disabled=true); await expect(editor.getByRole('button',{name:'Italic',exact:true})).toBeDisabled();
});

test('Markdown subset, safe rendering, bounded failures and editor cleanup preserve drafts', async ({ page }) => {
  const remote = []; page.on('request', request => { if (request.url().includes('editor-probe')) remote.push(request.url()); });
  await page.goto('/docs/index.html#component/markdown-editor');
  const editor = page.locator(markdown), source = editor.locator(field), preview = editor.locator('[data-rf-markdown-preview]');
  await source.fill('# Title\n\n**strong** *em* ~~gone~~ `code`\n\n> quote\n\n- [x] Done\n- [ ] Next\n\n1. First\n2. Second\n\n```js\n<script>bad()</script>\n```\n\n| Item | State |\n| --- | --- |\n| A | Ready |\n\n---\n\n<script>window.editorProbe=1</script>\n![image](https://example.com/editor-probe)\n[bad](javascript:alert)\n[good](https://example.com)');
  await expect(preview.locator('h1')).toHaveText('Title'); await expect(preview.locator('strong')).toHaveText('strong'); await expect(preview.locator('em')).toHaveText('em'); await expect(preview.locator('s')).toHaveText('gone'); await expect(preview.locator('blockquote')).toHaveText('quote'); await expect(preview.locator('table tbody td')).toHaveText(['A','Ready']); await expect(preview.getByRole('img',{name:'Completed task'})).toBeVisible(); await expect(preview.locator('a')).toHaveCount(1); await expect(preview.locator('a')).toHaveAttribute('rel','noopener noreferrer'); await expect(preview.locator('script,img,iframe')).toHaveCount(0); expect(remote).toEqual([]);
  const before = await preview.innerHTML(); await source.evaluate(element => { element.value='x'.repeat(20001); element.dispatchEvent(new Event('change',{bubbles:true})); }); await expect(editor.locator('[data-rf-editor-error]')).toBeVisible(); expect(await preview.innerHTML()).toBe(before); expect(await source.evaluate(element => element.checkValidity())).toBe(false);
  await source.fill('Retained draft'); await editor.evaluate(async element => { const { initEditors } = await import('/src/js/editors.js'); const stop = initEditors(element); stop(); }); await expect(editor.locator('[data-rf-editor-toolbar]')).toBeHidden(); await expect(source).toHaveValue('Retained draft'); await editor.evaluate(async element => (await import('/src/js/editors.js')).initEditors(element)); await expect(preview).toHaveText('Retained draft');
  await page.goto('/docs/index.html#component/rich-text-editor'); const richEditor=page.locator(rich); await richEditor.locator(field).evaluate(element => { element.value='x'.repeat(50001); element.dispatchEvent(new Event('change',{bubbles:true})); }); await expect(richEditor.locator(field)).toBeVisible(); await expect(richEditor.locator(canvas)).toBeHidden(); expect(await richEditor.locator(field).evaluate(element => element.value.length)).toBe(50001);
  await richEditor.locator(field).fill('<p>Recovered draft</p>'); await richEditor.locator(field).dispatchEvent('change'); await expect(richEditor.locator(canvas)).toHaveText('Recovered draft');
});

test('dashboard reuses the Markdown editor and isolates saved/unfinished notes across workspaces', async ({ page }) => {
  await page.goto('/examples/dashboard.html#workspace-notes'); const source=page.locator('#workspace-notes '+field);
  await expect(source).toHaveValue(/Your next chapter/); await source.fill('Studio **saved**'); await page.locator('#workspace-notes').getByRole('button',{name:'Save notes'}).click(); await source.fill('Studio unfinished');
  await page.getByRole('button',{name:'Switch workspace: Studio'}).click(); await page.getByRole('menuitem',{name:'Personal workspace',exact:true}).click(); await expect(source).toHaveValue(/A little room of your own/); await source.fill('Personal saved'); await page.locator('#workspace-notes').getByRole('button',{name:'Save notes'}).click();
  await page.getByRole('button',{name:'Switch workspace: Personal'}).click(); await page.getByRole('menuitem',{name:'Studio workspace',exact:true}).click(); await expect(source).toHaveValue('Studio **saved**'); await expect(page.locator('#workspace-notes [data-rf-markdown-preview] strong')).toHaveText('saved');
  await source.press('ControlOrMeta+z'); await expect(source).not.toHaveValue(/Personal|unfinished/); await source.fill('Discard me'); await page.locator('#workspace-notes').getByRole('button',{name:'Discard note changes'}).click(); await expect(source).toHaveValue('Studio **saved**'); await page.getByRole('link',{name:'Notes',exact:true}).click(); await expect(page.locator('.rf-breadcrumb [aria-current]')).toHaveText('Notes');
  await source.fill('Saved after reset'); await page.locator('#workspace-notes').getByRole('button',{name:'Save notes'}).click(); await source.fill('Discard again'); await page.locator('#workspace-notes').getByRole('button',{name:'Discard note changes'}).click(); await expect(source).toHaveValue('Saved after reset');
  await page.reload(); await expect(source).toHaveValue(/Your next chapter/);
});

test('editors and link dialogs fit narrow themes and pass automated WCAG checks', async ({ page }) => {
  test.setTimeout(90000); const errors=[]; page.on('pageerror',error=>errors.push(error.message)); await page.emulateMedia({reducedMotion:'reduce'});
  for (const theme of ['light','dark']) for (const id of ['rich-text-editor','markdown-editor']) {
    await page.goto('/docs/index.html#component/'+id); await page.locator('html').evaluate((element,theme)=>element.dataset.rfTheme=theme,theme);
    for (const width of [320,390,1440]) { await page.setViewportSize({width,height:900}); expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false); }
    await page.setViewportSize({width:390,height:844}); const results=await new AxeBuilder({page}).include('.preview').withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze(); expect(results.violations).toEqual([]); await page.screenshot({path:`output/playwright/rofin-${id}-${theme}-390.png`});
    await page.locator('.preview').getByRole('button',{name:'Add link',exact:true}).click(); const dialog=page.getByRole('dialog',{name:'Add a useful link.'}); await expect(dialog.getByLabel('Link URL')).toBeFocused(); expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]); await dialog.press('Escape'); await expect(dialog).not.toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('editor fallbacks remain named native textareas without JavaScript', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false}), page=await context.newPage(); await page.goto('http://127.0.0.1:4173/examples/dashboard.html#workspace-notes'); await expect(page.getByLabel('Markdown note')).toBeVisible(); await page.getByLabel('Markdown note').fill('Native draft'); await page.getByRole('button',{name:'Discard note changes'}).click(); await expect(page.getByLabel('Markdown note')).toHaveValue(/Your next chapter/);
  await page.goto('http://127.0.0.1:4173/examples/components/rich-text-editor.html'); await expect(page.getByLabel('Rich-text note HTML')).toBeVisible(); await page.getByLabel('Rich-text note HTML').fill('<p>Native draft</p>'); await page.getByRole('button',{name:'Reset note'}).click(); await expect(page.getByLabel('Rich-text note HTML')).toHaveValue(/<strong>your next idea<\/strong>/); await context.close();
});
