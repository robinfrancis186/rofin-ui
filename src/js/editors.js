import { enhancer, onFormReset, uid } from './utils.js';

const HTML_LIMIT = 50000, MARKDOWN_LIMIT = 20000;
const node = (doc, tag, text) => { const element = doc.createElement(tag); if (text != null) element.textContent = text; return element; };
export function editorLink(value) {
  try { if (typeof value !== 'string' || value.length > 2048 || /[\x00-\x1f\x7f]/.test(value)) return null; const url = new URL(value.trim()); return ['https:', 'http:', 'mailto:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
const blocked = new Set(['script', 'style', 'template', 'iframe', 'object', 'embed', 'svg', 'math', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta', 'base', 'audio', 'video', 'img']);
const allowed = new Set(['p', 'br', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
/** Restricted rich-note formats, not a general HTML sanitizer or a server policy. */
export function sanitizeRichText(value, doc = globalThis.document) {
  if (typeof value !== 'string' || value.length > HTML_LIMIT) throw Error('Use at most 50,000 HTML characters.');
  if (!doc?.createElement) throw Error('A browser Document is required. Validate stored HTML on the server separately.');
  const template = doc.createElement('template'); template.innerHTML = value; const output = doc.createElement('div'); let count = 0;
  // ponytail: bounded note formats; use a document engine for larger or deeply nested documents.
  function copy(source, target, depth = 0) {
    if (++count > 10000 || depth > 30) throw Error('This note is too deeply nested or complex.');
    if (source.nodeType === 3) { target.append(doc.createTextNode(source.data)); return; }
    if (source.nodeType !== 1 || source.namespaceURI !== 'http://www.w3.org/1999/xhtml' || blocked.has(source.localName)) return;
    let tag = ({ b: 'strong', i: 'em', strike: 's' })[source.localName] || source.localName;
    if (tag === 'div' && !source.querySelector('p,div,ul,ol,blockquote,pre,h1,h2,h3,h4,h5,h6')) tag = 'p';
    let element = allowed.has(tag) ? doc.createElement(tag) : target;
    if (tag === 'a') { const href = editorLink(source.getAttribute('href')); if (href) { element.href = href; element.rel = 'noopener noreferrer'; } else element = target; }
    if (source.localName === 'span') {
      for (const mark of [Number.parseInt(source.style.fontWeight) >= 600 || source.style.fontWeight === 'bold' ? 'strong' : null, source.style.fontStyle === 'italic' ? 'em' : null, source.style.textDecorationLine.includes('underline') ? 'u' : null].filter(Boolean)) { const wrapper = doc.createElement(mark); if (element === target) target.append(wrapper); else element.append(wrapper); element = wrapper; }
    }
    if (element !== target && !element.parentNode) target.append(element);
    for (const child of source.childNodes) copy(child, element, depth + 1);
  }
  for (const child of template.content.childNodes) copy(child, output);
  const html = output.innerHTML;
  if (html.length > HTML_LIMIT) throw Error('Use at most 50,000 HTML characters.');
  return html;
}

/** Small, explicit Markdown subset. Raw HTML and image syntax remain text. */
export function renderMarkdown(value, target) {
  if (typeof value !== 'string' || value.length > MARKDOWN_LIMIT) throw Error('Use at most 20,000 Markdown characters.');
  const doc = target.ownerDocument, fragment = doc.createDocumentFragment(), lines = value.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n'); let index = 0, nodes = 0;
  function inline(text, parent, depth = 0) {
    if (depth > 12) { parent.append(doc.createTextNode(text)); return; }
    const pattern = /\\([\\`*_{}\[\]()#+.!>~-])|(`+)([^`]+)\2|\[((?:\\.|[^\]\\\n])+)\]\(([^\s)]+)\)|(\*\*|__|~~|\*|_)(?=\S)([\s\S]*?\S)\6/g; let last = 0, match;
    while ((match = pattern.exec(text))) {
      if (++nodes > 10000) throw Error('This Markdown note is too complex.'); parent.append(doc.createTextNode(text.slice(last, match.index))); let element;
      if (match[1]) parent.append(doc.createTextNode(match[1]));
      else if (match[2]) parent.append(node(doc, 'code', match[3]));
      else if (match[4]) { const href = editorLink(match[5]); if (href && text[match.index - 1] !== '!') { element = node(doc, 'a'); element.href = href; element.target = '_blank'; element.rel = 'noopener noreferrer'; inline(match[4], element, depth + 1); parent.append(element); } else parent.append(doc.createTextNode(match[0])); }
      else { element = node(doc, match[6] === '~~' ? 's' : match[6].length === 2 ? 'strong' : 'em'); inline(match[7], element, depth + 1); parent.append(element); }
      last = pattern.lastIndex;
    }
    parent.append(doc.createTextNode(text.slice(last)));
  }
  const block = (tag, text) => { const element = node(doc, tag); inline(text, element); fragment.append(element); };
  const special = line => /^(?:\s*$|#{1,6} |\s*```|> ?|[-*+] |\d+\. |(?:-{3,}|\*{3,}|_{3,})\s*$)/.test(line);
  const cells = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(cell => cell.trim().replaceAll('\\|', '|'));
  while (index < lines.length) {
    const line = lines[index++]; if (!line.trim()) continue;
    if (/^\s*```/.test(line)) { const code = []; while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) code.push(lines[index++]); if (index < lines.length) index++; const pre = node(doc, 'pre'); pre.append(node(doc, 'code', code.join('\n'))); fragment.append(pre); continue; }
    const heading = /^(#{1,6}) (.+)$/.exec(line); if (heading) { block(`h${heading[1].length}`, heading[2]); continue; }
    if (/^(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { fragment.append(node(doc, 'hr')); continue; }
    if (/^> ?/.test(line)) { const quote = [line.replace(/^> ?/, '')]; while (index < lines.length && /^> ?/.test(lines[index])) quote.push(lines[index++].replace(/^> ?/, '')); block('blockquote', quote.join('\n')); continue; }
    if (/^([-*+] |\d+\. )/.test(line)) { const ordered = /^\d+\. /.test(line), list = node(doc, ordered ? 'ol' : 'ul'), expression = ordered ? /^\d+\. / : /^[-*+] /; let current = line; do { const item = node(doc, 'li'), text = current.replace(expression, ''), task = /^\[([ xX])\] (.*)$/.exec(text); if (task) { const state = node(doc, 'span', task[1] === ' ' ? '☐ ' : '☑ '); state.setAttribute('role', 'img'); state.setAttribute('aria-label', task[1] === ' ' ? 'Incomplete task' : 'Completed task'); item.append(state); inline(task[2], item); } else inline(text, item); list.append(item); current = lines[index]; if (!current || !expression.test(current)) break; index++; } while (true); fragment.append(list); continue; }
    if (line.includes('|') && index < lines.length && cells(lines[index]).every(cell => /^:?-{3,}:?$/.test(cell))) {
      const headers = cells(line), table = node(doc, 'table'), head = node(doc, 'thead'), row = node(doc, 'tr'), body = node(doc, 'tbody'), wrap = node(doc, 'div'); index++; table.className = 'rf-table'; wrap.className = 'rf-table-wrap'; wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', 'Markdown data table'); table.append(node(doc, 'caption', 'Table from your Markdown note')); headers.forEach(text => { const cell = node(doc, 'th'); cell.scope = 'col'; inline(text, cell); row.append(cell); }); head.append(row); table.append(head, body);
      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) { const values = cells(lines[index++]), row = node(doc, 'tr'); headers.forEach((_, i) => { const cell = node(doc, 'td'); inline(values[i] || '', cell); row.append(cell); }); body.append(row); } wrap.append(table); fragment.append(wrap); continue;
    }
    const paragraph = [line]; while (index < lines.length && !special(lines[index]) && !(lines[index].includes('|') && index + 1 < lines.length && cells(lines[index + 1]).every(cell => /^:?-{3,}:?$/.test(cell)))) paragraph.push(lines[index++]); block('p', paragraph.join('\n'));
  }
  target.replaceChildren(fragment);
}

const unavailable = source => source.matches(':disabled') || source.readOnly;
// ponytail: native editing preserves undo; use a document engine if execCommand support is removed.
const editingCommand = (command, value) => { try { return document.execCommand(command, false, value); } catch { return false; } };
const supported = command => { try { return document.queryCommandSupported(command); } catch { return false; } };
function observeField(source, update) { const observer = new MutationObserver(update); observer.observe(source, { attributes: true, attributeFilter: ['disabled', 'readonly', 'required', 'maxlength'] }); for (let parent = source.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'FIELDSET') observer.observe(parent, { attributes: true, attributeFilter: ['disabled'] }); return () => observer.disconnect(); }
function linkDialog(element, signal, selection, insert, restore) {
  const dialog = element.querySelector('[data-rf-editor-link-dialog]'), form = dialog.querySelector('form'), error = dialog.querySelector('[data-rf-editor-link-error]'); dialog.setAttribute('aria-labelledby', dialog.querySelector('h4').id ||= uid('rf-editor-link'));
  form.addEventListener('submit', event => { event.preventDefault(); const href = editorLink(form.elements.url.value); if (!href) { error.textContent = 'Use an absolute HTTP, HTTPS or mailto link without embedded credentials.'; error.hidden = false; form.elements.url.focus(); return; } dialog.close(); insert(href); }, { signal });
  dialog.querySelector('[data-rf-editor-link-cancel]').addEventListener('click', () => dialog.close(), { signal });
  dialog.addEventListener('close', () => { if (element.isConnected) restore(); }, { signal });
  return { open() { selection(); form.reset(); error.hidden = true; dialog.showModal(); form.elements.url.focus(); }, close() { dialog.close(); } };
}

const rich = enhancer('[data-rf-rich-editor]', (element, signal) => {
  const source = element.querySelector('[data-rf-editor-source]'), surface = element.querySelector('[data-rf-rich-surface]'), enhanced = element.querySelector('[data-rf-editor-enhanced]'), sourceField = source.closest('[data-rf-editor-source-field]'), form = source.form, error = element.querySelector('[data-rf-editor-error]'), count = element.querySelector('[data-rf-editor-count]'), label = element.querySelector('[data-rf-editor-label]'), toolbar = element.querySelector('[data-rf-editor-toolbar]'), style = toolbar.querySelector('select');
  const original = { sourceHidden: sourceField.hidden, enhancedHidden: enhanced.hidden, sourceCustom: source.validity.customError ? source.validationMessage : '' }; let range, composing = false, touched = false;
  error.id ||= uid('rf-editor-error'); count.id ||= uid('rf-editor-count'); surface.setAttribute('aria-label', label.textContent); surface.setAttribute('aria-describedby', `${error.id} ${count.id}`);
  const remember = () => { const selection = window.getSelection(); if (selection.rangeCount && surface.contains(selection.anchorNode) && surface.contains(selection.focusNode)) range = selection.getRangeAt(0).cloneRange(); };
  const restore = () => { surface.focus(); if (range && surface.contains(range.commonAncestorContainer)) { const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); } };
  function controls() {
    const disabled = unavailable(source); surface.contentEditable = String(!disabled); surface.tabIndex = source.matches(':disabled') ? -1 : 0; surface.setAttribute('aria-disabled', String(source.matches(':disabled'))); surface.setAttribute('aria-readonly', String(source.readOnly)); surface.setAttribute('aria-required', String(source.required));
    for (const button of toolbar.querySelectorAll('button')) { const command = button.dataset.rfRichCommand || (button.hasAttribute('data-rf-editor-link') ? 'createLink' : null); button.disabled = disabled || command && !supported(command); if (button.hasAttribute('aria-pressed')) { let state = false; try { state = !!range && document.queryCommandState(command); } catch {} button.setAttribute('aria-pressed', String(state)); } }
    style.disabled = disabled || !supported('formatBlock');
  }
  function sync(show = touched) {
    try { const html = sanitizeRichText(surface.innerHTML), text = surface.textContent; source.value = html; const message = text.length > 20000 ? 'Use at most 20,000 text characters.' : source.required && !text.trim() ? 'Enter a rich-text note.' : ''; source.setCustomValidity(message); error.textContent = message; error.hidden = !show || !message; surface.setAttribute('aria-invalid', String(show && !!message)); count.textContent = `${text.length.toLocaleString()} / 20,000 text characters`; controls(); element.dispatchEvent(new CustomEvent('rf:editor-change', { bubbles: true, detail: { kind: 'rich-text', value: html, text } })); }
    catch (cause) { source.setCustomValidity(cause.message); error.textContent = cause.message; error.hidden = false; surface.setAttribute('aria-invalid', 'true'); }
  }
  function load() { try { surface.innerHTML = sanitizeRichText(source.value); range = null; touched = false; enhanced.hidden = false; sourceField.hidden = true; sync(false); } catch (cause) { enhanced.hidden = true; sourceField.hidden = false; source.setCustomValidity(cause.message); error.textContent = cause.message; error.hidden = false; } }
  function command(name, value) { if (unavailable(source) || composing) return; restore(); const accepted = editingCommand(name, value); touched = true; remember(); sync(); if (!accepted) { error.textContent = 'This formatting action is unavailable in this browser.'; error.hidden = false; } }
  const dialog = linkDialog(element, signal, remember, href => command('createLink', href), restore);
  toolbar.addEventListener('pointerdown', event => { if (event.target.closest('button')) event.preventDefault(); }, { signal });
  toolbar.addEventListener('click', event => { const button = event.target.closest('button'); if (!button || button.disabled) return; if (button.hasAttribute('data-rf-editor-link')) dialog.open(); else command(button.dataset.rfRichCommand); }, { signal });
  style.addEventListener('change', () => command('formatBlock', style.value), { signal });
  surface.addEventListener('input', () => { if (!composing) { touched = true; remember(); sync(); } }, { signal });
  surface.addEventListener('compositionstart', () => { composing = true; }, { signal }); surface.addEventListener('compositionend', () => { composing = false; touched = true; remember(); sync(); }, { signal });
  document.addEventListener('selectionchange', () => { if (!composing) { remember(); controls(); } }, { signal });
  surface.addEventListener('keydown', event => { if (composing || event.isComposing || unavailable(source) || event.altKey || !(event.ctrlKey || event.metaKey)) return; if (event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.open(); } }, { signal });
  function paste(event) { event.preventDefault(); if (unavailable(source) || composing) return; const data = event.clipboardData || event.dataTransfer; if (!data || data.files.length) { error.textContent = 'Paste text or formatted text; add files with an upload control.'; error.hidden = false; return; } try { const html = data.getData('text/html'), text = data.getData('text/plain'); const safe = html ? sanitizeRichText(html) : (() => { const div = document.createElement('div'); div.textContent = text; return div.innerHTML.replaceAll('\n', '<br>'); })(); if (safe.length > HTML_LIMIT) throw Error('Use at most 50,000 HTML characters.'); remember(); command('insertHTML', safe); } catch (cause) { error.textContent = cause.message; error.hidden = false; } }
  surface.addEventListener('paste', paste, { signal }); surface.addEventListener('drop', paste, { signal }); surface.addEventListener('dragover', event => event.preventDefault(), { signal }); surface.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); }, { signal });
  source.addEventListener('change', load, { signal }); source.addEventListener('invalid', event => { event.preventDefault(); touched = true; error.textContent = source.validationMessage; error.hidden = false; surface.setAttribute('aria-invalid', 'true'); (sourceField.hidden ? surface : source).focus(); }, { signal });
  const stopReset = onFormReset(form, () => { dialog.close(); load(); }, signal), stopObserve = observeField(source, controls);
  enhanced.hidden = false; sourceField.hidden = true; load();
  return () => { stopReset(); stopObserve(); dialog.close(); source.setCustomValidity(original.sourceCustom); sourceField.hidden = original.sourceHidden; enhanced.hidden = original.enhancedHidden; surface.contentEditable = 'false'; };
});

const markdown = enhancer('[data-rf-markdown-editor]', (element, signal) => {
  const source = element.querySelector('[data-rf-editor-source]'), preview = element.querySelector('[data-rf-markdown-preview]'), toolbar = element.querySelector('[data-rf-editor-toolbar]'), count = element.querySelector('[data-rf-editor-count]'), error = element.querySelector('[data-rf-editor-error]'); const original = { hidden: toolbar.hidden, custom: source.validity.customError ? source.validationMessage : '' }; let composing = false, selected, lastValue = source.value;
  function renewField() {
    // A fresh native field prevents stale WebKit undo commands from replaying against a reset document.
    const replacement = source.cloneNode(true), focused = document.activeElement === source, start = source.selectionStart, end = source.selectionEnd, direction = source.selectionDirection;
    markdown.destroy(element); source.replaceWith(replacement); markdown.init(element);
    if (focused) { replacement.focus(); replacement.setSelectionRange(start, end, direction); }
  }
  function update() { try { renderMarkdown(source.value, preview); source.setCustomValidity(''); error.hidden = true; count.textContent = `${source.value.length.toLocaleString()} / 20,000 characters`; element.dispatchEvent(new CustomEvent('rf:editor-change', { bubbles: true, detail: { kind: 'markdown', value: source.value } })); } catch (cause) { source.setCustomValidity(cause.message); error.textContent = cause.message; error.hidden = false; } lastValue = source.value; for (const button of toolbar.querySelectorAll('button')) button.disabled = unavailable(source); }
  function replace(text, start, end, selectionStart = start + text.length, selectionEnd = selectionStart) { if (unavailable(source) || composing) return; if (source.value.length - (end - start) + text.length > MARKDOWN_LIMIT) { error.textContent = 'Use at most 20,000 Markdown characters.'; error.hidden = false; return; } source.focus(); source.setSelectionRange(start, end); if (!editingCommand('insertText', text)) source.setRangeText(text, start, end, 'end'); source.setSelectionRange(selectionStart, selectionEnd); update(); }
  function wrap(before, after = before, fallback = 'text') { const start = source.selectionStart, end = source.selectionEnd, text = source.value.slice(start, end) || fallback; replace(before + text + after, start, end, start + before.length, start + before.length + text.length); }
  function prefix(mark) { const start = source.selectionStart ? source.value.lastIndexOf('\n', source.selectionStart - 1) + 1 : 0, selectedEnd = source.selectionEnd > source.selectionStart && source.value[source.selectionEnd - 1] === '\n' ? source.selectionEnd - 1 : source.selectionEnd, lineEnd = source.value.indexOf('\n', selectedEnd), end = lineEnd < 0 ? source.value.length : lineEnd, text = source.value.slice(start, end).split('\n').map(line => mark + line).join('\n'); replace(text, start, end, start, start + text.length); }
  const dialog = linkDialog(element, signal, () => { selected = [source.selectionStart, source.selectionEnd]; }, href => { const [start, end] = selected; const label = (source.value.slice(start, end) || 'link').replace(/\s*\n\s*/g, ' ').replace(/[\[\]\\]/g, '\\$&'), text = `[${label}](${href.replaceAll(')', '%29').replaceAll('(', '%28')})`; replace(text, start, end); }, () => source.focus());
  function action(name) { if (unavailable(source) || composing) return; if (name === 'bold') wrap('**'); else if (name === 'italic') wrap('*'); else if (name === 'code') wrap('`'); else if (name === 'fence') wrap('\n```\n', '\n```\n', 'code'); else if (name === 'heading') prefix('### '); else if (name === 'quote') prefix('> '); else if (name === 'list') prefix('- '); else if (name === 'link') dialog.open(); }
  toolbar.addEventListener('click', event => { const button = event.target.closest('button'); if (button && !button.disabled) action(button.dataset.rfMarkdownAction); }, { signal });
  source.addEventListener('keydown', event => { if (composing || event.isComposing || event.altKey || !(event.ctrlKey || event.metaKey)) return; const name = ({ b: 'bold', i: 'italic', k: 'link' })[event.key.toLowerCase()]; if (name) { event.preventDefault(); action(name); } }, { signal });
  source.addEventListener('input', () => { if (!composing) update(); }, { signal }); source.addEventListener('change', () => { if (source.value !== lastValue) return renewField(); update(); }, { signal }); source.addEventListener('compositionstart', () => composing = true, { signal }); source.addEventListener('compositionend', () => { composing = false; update(); }, { signal });
  const stopReset = onFormReset(source.form, renewField, signal), stopObserve = observeField(source, update); toolbar.hidden = false; update();
  return () => { stopReset(); stopObserve(); dialog.close(); source.setCustomValidity(original.custom); toolbar.hidden = original.hidden; };
});

export function initEditors(root = document) { rich.init(root); markdown.init(root); return () => { rich.destroy(root); markdown.destroy(root); }; }
