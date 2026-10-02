import { disabled, matches, uid } from './utils.js';

const instances = new WeakMap();
const copy = entries => entries.map(entry => ({ ...entry }));
const node = (tag, className, text) => { const element = document.createElement(tag); if (className) element.className = className; if (text != null) element.textContent = text; return element; };
const nameOK = name => typeof name === 'string' && name.length > 0 && name.length <= 120 && name === name.trim() && !/[\/\\\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(name) && !['.', '..'].includes(name);
const size = bytes => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

// ponytail: 200 entries including recoverable Trash, 32 MB and 12 levels; larger stores need application paging.
function validate(entries) {
  if (!Array.isArray(entries) || entries.length > 200) throw Error('Use at most 200 files and folders, including Trash.');
  const ids = new Map(), names = new Set(); let bytes = 0;
  const result = entries.map(entry => {
    if (!entry || typeof entry.id !== 'string' || !entry.id || entry.id.length > 120 || ids.has(entry.id) || !nameOK(entry.name) || !['file', 'folder'].includes(entry.kind) || entry.parentId != null && typeof entry.parentId !== 'string' || entry.trashed != null && typeof entry.trashed !== 'boolean') throw Error('Invalid file or folder entry.');
    if (entry.kind === 'file' && (!(entry.file instanceof File) || entry.file.name !== entry.name || entry.file.size > 8 * 1024 * 1024)) throw Error('Each file must have matching bytes/name and be at most 8 MB.');
    const value = { id: entry.id, parentId: entry.parentId ?? null, kind: entry.kind, name: entry.name, trashed: !!entry.trashed, ...(entry.kind === 'file' ? { file: entry.file } : {}) };
    const key = JSON.stringify([value.parentId, value.name.normalize('NFC').toLocaleLowerCase()]);
    if (names.has(key)) throw Error('A file or folder already uses that name, including Trash. Restore it before reusing the name.');
    names.add(key); ids.set(value.id, value); bytes += value.file?.size || 0; return value;
  });
  if (bytes > 32 * 1024 * 1024) throw Error('Keep files under 32 MB in total, including Trash.');
  for (const entry of result) {
    let current = entry, depth = 1; const visited = new Set([entry.id]);
    while (current.parentId !== null) {
      const parent = ids.get(current.parentId);
      if (!parent || parent.kind !== 'folder' || visited.has(parent.id) || !current.trashed && parent.trashed || ++depth > 12) throw Error('Folders must have valid parents, no cycles and at most 12 levels.');
      visited.add(parent.id); current = parent;
    }
  }
  return result;
}

function fallbackEntries(fallback) {
  const entries = [], prefix = 'data:text/plain;charset=utf-8,';
  const read = (list, parentId = null, depth = 1) => {
    if (depth > 12) throw Error('Use at most 12 folder levels.');
    for (const item of list.children) {
      if (item.tagName !== 'LI') continue;
      const folder = item.querySelector(':scope > details'), link = item.querySelector(':scope > a'), id = uid('rf-file');
      if (folder) { entries.push({ id, parentId, kind: 'folder', name: folder.querySelector(':scope > summary')?.textContent.trim() }); const children = folder.querySelector(':scope > ul'); if (children) read(children, id, depth + 1); }
      else if (link) {
        const href = link.getAttribute('href');
        if (!href?.startsWith(prefix) || href.length > 100000) throw Error('The sample fallback accepts small plain-text data links. Supply actual Files for application data.');
        const name = link.getAttribute('download') || link.textContent.trim();
        entries.push({ id, parentId, kind: 'file', name, file: new File([decodeURIComponent(href.slice(prefix.length))], name, { type: 'text/plain', lastModified: 0 }) });
      }
      if (entries.length > 200) throw Error('Use at most 200 entries.');
    }
  };
  read(fallback); return validate(entries);
}

/** A bounded browser-copy file store. It never reads/writes disk or sends requests automatically. */
export function createFileBrowser(element, { entries: supplied, onChange } = {}) {
  if (instances.has(element)) return instances.get(element);
  const fallback = element.querySelector('[data-rf-file-fallback]'), enhanced = element.querySelector('[data-rf-file-enhanced]'), tree = element.querySelector('[data-rf-file-tree]'), search = element.querySelector('[data-rf-file-search]'), details = element.querySelector('[data-rf-file-details]'), status = element.querySelector('[data-rf-file-status]'), error = element.querySelector('[data-rf-file-error]'), dialog = element.querySelector('[data-rf-file-dialog]');
  if (![fallback, enhanced, tree, search, details, status, error, dialog].every(Boolean) || onChange != null && typeof onChange !== 'function') throw Error('Provide complete file-browser markup and a valid change callback.');
  let entries = supplied === undefined ? fallbackEntries(fallback) : validate(supplied), selectedId = null, focusedId = null, operation = null, pending = null, destroyed = false, typeAhead = '', typedAt = 0;
  const controller = new AbortController(), expanded = new Set(), rows = new Map(), form = dialog.querySelector('form'), heading = dialog.querySelector('h4'), dialogError = dialog.querySelector('[data-rf-file-dialog-error]');
  const titleId = uid('rf-files-dialog'); heading.id = titleId; dialog.setAttribute('aria-labelledby', titleId);
  const snapshot = () => copy(entries), selected = () => entries.find(entry => entry.id === selectedId && !entry.trashed), locked = () => destroyed || pending || disabled(element), readOnly = () => locked() || element.hasAttribute('data-rf-readonly');
  const byId = id => entries.find(entry => entry.id === id), children = id => entries.filter(entry => entry.parentId === id && !entry.trashed).sort((a, b) => (a.kind !== b.kind ? a.kind === 'folder' ? -1 : 1 : a.name.localeCompare(b.name, undefined, { numeric: true })));
  const path = entry => { const names = []; for (let current = entry; current; current = byId(current.parentId)) names.unshift(current.name); return names.join('/'); };
  const descendants = id => { const result = new Set([id]); for (let added = true; added;) { added = false; for (const entry of entries) if (result.has(entry.parentId) && !result.has(entry.id)) { result.add(entry.id); added = true; } } return result; };
  const showError = message => { const target = dialog.open ? dialogError : error; target.textContent = message; target.hidden = !message; };
  const announce = message => { status.textContent = message; };
  const visibleRows = () => [...rows.values()].filter(row => !row.closest('[hidden]'));
  const updateControls = () => {
    const item = selected();
    for (const button of enhanced.querySelectorAll('[data-rf-file-action]')) {
      const action = button.dataset.rfFileAction;
      button.disabled = action === 'download' ? !!locked() || item?.kind !== 'file' : !!readOnly() || ['rename', 'move', 'trash'].includes(action) && !item || action === 'restore' && !entries.some(entry => entry.trashed);
    }
    for (const input of enhanced.querySelectorAll('input[type="file"]')) input.disabled = !!readOnly();
    const cancel = enhanced.querySelector('[data-rf-file-cancel-pending]'); if (cancel) cancel.hidden = !pending || dialog.open;
    search.disabled = !!locked(); tree.setAttribute('aria-disabled', String(!!locked()));
    for (const row of rows.values()) row.tabIndex = !locked() && row.dataset.rfFileId === focusedId ? 0 : -1;
    form.querySelector('fieldset').disabled = !!pending;
    form.querySelector('button[type="submit"]').disabled = !!readOnly();
  };
  const renderDetails = () => {
    details.replaceChildren(); const item = selected();
    if (!item) { details.append(node('p', 'rf-help', 'Select a file or folder. Arrow keys explore the tree; Home/End and typing find an item.')); return; }
    details.append(node('h4', '', item.name), node('p', 'rf-help', path(item)), node('p', 'rf-help', item.kind === 'file' ? `${size(item.file.size)} · ${item.file.type || 'Unspecified type'}` : `${children(item.id).length} direct items · Folder`));
  };
  const select = (id, focus = false) => {
    const changed = selectedId !== id;
    focusedId = selectedId = id;
    for (const [value, row] of rows) { row.setAttribute('aria-selected', String(value === selectedId)); row.tabIndex = !locked() && value === focusedId ? 0 : -1; }
    renderDetails(); updateControls(); if (focus) rows.get(id)?.focus();
    if (changed) element.dispatchEvent(new CustomEvent('rf:file-select', { bubbles: true, detail: { entry: selected() ? { ...selected() } : null } }));
  };
  function render() {
    const wasFocused = tree.contains(document.activeElement), query = search.value.trim().toLocaleLowerCase(), included = new Set();
    for (const entry of entries) if (!entry.trashed && (!query || path(entry).toLocaleLowerCase().includes(query))) { for (let current = entry; current; current = byId(current.parentId)) included.add(current.id); }
    rows.clear(); tree.replaceChildren();
    const append = (list, parentId, level = 1) => {
      const siblings = children(parentId).filter(entry => included.has(entry.id));
      siblings.forEach((entry, index) => {
        const item = node('li'), row = node('div', 'rf-file-row'), icon = node('span', 'rf-file-icon', entry.kind === 'folder' ? '▸' : '•'), label = node('span', 'rf-file-name', entry.name), isFolder = entry.kind === 'folder', nested = children(entry.id).filter(child => included.has(child.id)), open = !!query || expanded.has(entry.id);
        item.setAttribute('role', 'treeitem'); item.setAttribute('aria-label', `${entry.name}${isFolder ? ' folder' : ''}`); item.setAttribute('aria-level', String(level)); item.setAttribute('aria-posinset', String(index + 1)); item.setAttribute('aria-setsize', String(siblings.length)); item.setAttribute('aria-selected', String(entry.id === selectedId)); item.dataset.rfFileId = entry.id;
        icon.setAttribute('aria-hidden', 'true'); if (isFolder && nested.length) { item.setAttribute('aria-expanded', String(open)); icon.textContent = open ? '▾' : '▸'; icon.dataset.rfFileToggle = ''; }
        else if (isFolder) icon.textContent = '◇';
        row.append(icon, label); item.append(row); list.append(item); rows.set(entry.id, item);
        if (isFolder && nested.length) { const group = node('ul'); group.setAttribute('role', 'group'); group.hidden = !open; append(group, entry.id, level + 1); item.append(group); }
      });
    };
    append(tree, null);
    const visible = visibleRows();
    if (selectedId && !visible.some(row => row.dataset.rfFileId === selectedId)) { selectedId = null; element.dispatchEvent(new CustomEvent('rf:file-select', { bubbles: true, detail: { entry: null } })); }
    if (!visible.some(row => row.dataset.rfFileId === focusedId)) focusedId = selectedId || visible[0]?.dataset.rfFileId || null;
    for (const row of rows.values()) row.setAttribute('aria-selected', String(row.dataset.rfFileId === selectedId));
    const empty = element.querySelector('[data-rf-file-empty]'); empty.hidden = !!visible.length; empty.textContent = query ? 'No files or folders match. Try another search.' : 'A little room for your files. Import a file or create a folder.';
    renderDetails(); updateControls(); if (wasFocused) rows.get(focusedId)?.focus();
  }
  const openParents = id => { for (let item = byId(id); item?.parentId; item = byId(item.parentId)) expanded.add(item.parentId); };
  const cancelPending = () => { if (pending) { pending.abort(); pending = null; element.removeAttribute('aria-busy'); updateControls(); announce('The pending file change was cancelled.'); } };
  async function commit(next, change, selection = selectedId) {
    if (readOnly()) return false;
    let validated;
    try { validated = validate(next); } catch (cause) { showError(cause.message); return false; }
    const task = new AbortController(); pending = task; element.setAttribute('aria-busy', 'true'); updateControls(); showError('');
    try {
      await onChange?.(copy(validated), { operation: { ...change }, signal: task.signal });
      if (destroyed || task.signal.aborted || pending !== task || operation && !dialog.open) return false;
      entries = validated; pending = null; selectedId = focusedId = selection; openParents(selection); search.value = ''; render();
      announce(change.type === 'trash' ? 'Moved to recoverable Trash. Original disk files stay intact.' : change.type === 'restore' ? 'Restored the files and folders from Trash.' : 'Browser files updated. Save important files with Download file.');
      element.dispatchEvent(new CustomEvent('rf:file-change', { bubbles: true, detail: { operation: { ...change }, entries: snapshot() } })); return true;
    } catch (cause) { if (!destroyed && pending === task && !task.signal.aborted) showError(cause instanceof Error ? cause.message.slice(0, 300) : 'Files were not changed. Try again.'); return false; }
    finally { if (!destroyed && pending === task) { pending = null; updateControls(); } if (!destroyed && !pending) element.removeAttribute('aria-busy'); }
  }
  async function importFiles(files, { parentId = null, relativePaths = false } = {}) {
    if (readOnly()) return false;
    const next = snapshot(); let lastId = null;
    try {
      const parent = parentId === null ? null : byId(parentId); if (parentId !== null && (!parent || parent.kind !== 'folder' || parent.trashed)) throw Error('Choose an available destination folder.');
      let count = 0;
      for (const file of files) {
        if (++count > 200 || !(file instanceof File)) throw Error('Import at most 200 actual files.');
        const parts = (relativePaths && file.webkitRelativePath || file.name).split('/');
        if (parts.length > 12 || !parts.every(nameOK) || parts.at(-1) !== file.name) throw Error('The imported folder path is invalid or too deep.');
        let parent = parentId;
        for (const name of parts.slice(0, -1)) {
          let folder = next.find(entry => entry.parentId === parent && entry.name.normalize('NFC').toLocaleLowerCase() === name.normalize('NFC').toLocaleLowerCase());
          if (folder && (folder.kind !== 'folder' || folder.trashed)) throw Error('An imported folder conflicts with an existing item or Trash.');
          if (!folder) { folder = { id: uid('rf-file'), parentId: parent, kind: 'folder', name }; next.push(folder); }
          parent = folder.id;
        }
        lastId = uid('rf-file'); next.push({ id: lastId, parentId: parent, kind: 'file', name: file.name, file });
        if (next.length > 200) throw Error('Use at most 200 entries including Trash.');
      }
      if (!count) return false;
      return await commit(next, { type: 'import', count }, lastId);
    } catch (cause) { showError(cause instanceof Error ? cause.message : 'The files could not be imported.'); return false; }
  }
  const destination = () => { const item = selected(); return item?.kind === 'folder' ? item.id : item?.parentId ?? null; };
  const toggle = item => { if (search.value.trim() || item.kind !== 'folder' || !children(item.id).length) return; expanded.has(item.id) ? expanded.delete(item.id) : expanded.add(item.id); render(); };
  const listener = (target, name, handler) => target.addEventListener(name, handler, { signal: controller.signal });
  listener(tree, 'focusin', event => { const row = event.target.closest('[role="treeitem"]'); if (row && !locked()) select(row.dataset.rfFileId); });
  listener(tree, 'click', event => { if (locked()) return; const row = event.target.closest('[role="treeitem"]'); if (!row) return; select(row.dataset.rfFileId, true); if (event.target.closest('[data-rf-file-toggle]')) toggle(selected()); });
  listener(tree, 'dblclick', event => { const row = event.target.closest('[role="treeitem"]'); if (row && !locked() && !event.target.closest('[data-rf-file-toggle]')) toggle(byId(row.dataset.rfFileId)); });
  listener(tree, 'keydown', event => {
    if (locked() || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) return;
    const row = event.target.closest('[role="treeitem"]'); if (!row) return; const item = byId(row.dataset.rfFileId), visible = visibleRows(), index = visible.indexOf(row); let target;
    if (event.key === 'ArrowDown') target = visible[Math.min(index + 1, visible.length - 1)];
    else if (event.key === 'ArrowUp') target = visible[Math.max(0, index - 1)];
    else if (event.key === 'Home') target = visible[0]; else if (event.key === 'End') target = visible.at(-1);
    else if (event.key === 'ArrowRight') { if (row.getAttribute('aria-expanded') === 'false') toggle(item); else if (row.getAttribute('aria-expanded') === 'true') target = visible[index + 1]; }
    else if (event.key === 'ArrowLeft') { if (row.getAttribute('aria-expanded') === 'true' && !search.value.trim()) toggle(item); else target = rows.get(item.parentId); }
    else if (event.key === 'Enter') toggle(item); else if (event.key === ' ') select(item.id);
    else if (event.key.length === 1) {
      const now = Date.now(); typeAhead = (now - typedAt > 700 ? event.key : typeAhead + event.key).slice(0, 120); typedAt = now;
      const query = [...typeAhead].every(character => character === typeAhead[0]) ? typeAhead[0] : typeAhead;
      target = [...visible.slice(index + 1), ...visible.slice(0, index + 1)].find(row => byId(row.dataset.rfFileId).name.toLocaleLowerCase().startsWith(query.toLocaleLowerCase()));
    } else return;
    event.preventDefault(); if (target) select(target.dataset.rfFileId, true);
  });
  listener(search, 'input', event => { if (!event.isComposing && !locked()) render(); }); listener(search, 'compositionend', () => { if (!locked()) render(); });
  for (const input of enhanced.querySelectorAll('input[type="file"]')) listener(input, 'change', async () => { try { await importFiles(input.files, { parentId: destination(), relativePaths: input.hasAttribute('webkitdirectory') }); } finally { input.value = ''; } });
  listener(enhanced, 'click', async event => {
    const action = event.target.closest('[data-rf-file-action]'); if (!action || action.disabled || locked()) return; const type = action.dataset.rfFileAction, item = selected();
    if (type === 'download' && item?.kind === 'file') {
      const url = URL.createObjectURL(item.file), link = node('a'); link.href = url; link.download = item.name; link.hidden = true; element.append(link); link.click(); link.remove();
      const timer = setTimeout(() => { URL.revokeObjectURL(url); downloads.delete(url); }, 60000); downloads.set(url, timer); announce(`Download requested for ${item.name}.`); return;
    }
    if (readOnly()) return;
    if (type === 'restore') { if (await commit(entries.map(entry => ({ ...entry, trashed: false })), { type })) rows.get(focusedId)?.focus(); return; }
    operation = { type, id: item?.id, parentId: destination(), invoker: action }; form.reset(); dialogError.hidden = true; error.hidden = true;
    const editingName = ['folder', 'file', 'rename'].includes(type);
    form.elements.name.closest('label').hidden = !editingName; form.elements.name.required = editingName; form.elements.name.value = type === 'rename' ? item.name : type === 'file' ? 'Untitled.txt' : '';
    form.elements.contents.closest('label').hidden = type !== 'file'; form.elements.destination.closest('label').hidden = type !== 'move';
    const destinations = [node('option', '', 'Top level')]; destinations[0].value = '';
    for (const folder of entries.filter(entry => entry.kind === 'folder' && !entry.trashed && (type !== 'move' || !descendants(item.id).has(entry.id)))) { const option = node('option', '', path(folder)); option.value = folder.id; destinations.push(option); }
    form.elements.destination.replaceChildren(...destinations); form.elements.destination.value = item?.parentId || '';
    heading.textContent = ({ folder: 'Make room for a folder.', file: 'Create a text file.', rename: 'Give it a new name.', move: 'Move to a folder.', trash: 'Move this item to Trash?' })[type];
    dialog.querySelector('[data-rf-file-dialog-note]').textContent = type === 'trash' ? `${item.name} and any contents move to recoverable Trash. Original disk files stay intact.` : type === 'move' ? `Move ${item.name} and any contents. Bytes stay intact.` : 'Changes apply to this browser copy. Download files to keep them after reload.';
    form.querySelector('button[type="submit"]').textContent = type === 'trash' ? 'Move to Trash' : 'Save file change'; dialog.showModal(); (editingName ? form.elements.name : type === 'move' ? form.elements.destination : dialog.querySelector('[data-rf-file-cancel]')).focus();
  });
  listener(form, 'submit', async event => {
    event.preventDefault(); if (!operation || readOnly()) return;
    const { type, id, parentId } = operation, item = byId(id); let next = snapshot(), selected = id;
    if (['folder', 'file', 'rename'].includes(type) && !nameOK(form.elements.name.value)) { showError('Use a name of 1–120 characters without path separators, controls or surrounding spaces.'); form.elements.name.focus(); return; }
    const name = form.elements.name.value;
    if (type === 'file' && form.elements.contents.value.length > 20000) { showError('Use at most 20,000 characters in a new text file.'); form.elements.contents.focus(); return; }
    if (type === 'folder' || type === 'file') { selected = uid('rf-file'); next.push({ id: selected, parentId, name, kind: type === 'folder' ? 'folder' : 'file', ...(type === 'file' ? { file: new File([form.elements.contents.value], name, { type: 'text/plain' }) } : {}) }); }
    if (type === 'rename') next = next.map(entry => entry.id === id ? { ...entry, name, ...(entry.kind === 'file' ? { file: new File([entry.file], name, { type: entry.file.type, lastModified: entry.file.lastModified }) } : {}) } : entry);
    if (type === 'move') next = next.map(entry => entry.id === id ? { ...entry, parentId: form.elements.destination.value || null } : entry);
    if (type === 'trash') { const removed = descendants(id); next = next.map(entry => removed.has(entry.id) ? { ...entry, trashed: true } : entry); selected = item.parentId; }
    if (await commit(next, { type, id: id ?? selected }, selected)) { if (operation) operation.committed = true; dialog.close(); }
  });
  listener(dialog.querySelector('[data-rf-file-cancel]'), 'click', () => { cancelPending(); dialog.close(); });
  const cancelButton = enhanced.querySelector('[data-rf-file-cancel-pending]'); if (cancelButton) listener(cancelButton, 'click', () => { cancelPending(); rows.get(focusedId)?.focus(); });
  listener(dialog, 'cancel', cancelPending);
  listener(dialog, 'close', () => { if (dialog.open) return; cancelPending(); const invoker = operation?.invoker, committed = operation?.committed; operation = null; if (!committed && invoker?.isConnected && !invoker.disabled) invoker.focus(); else rows.get(focusedId)?.focus(); });
  const downloads = new Map(), observer = new MutationObserver(updateControls); observer.observe(element, { attributes: true, attributeFilter: ['aria-disabled', 'data-rf-readonly'] });
  fallback.hidden = true; enhanced.hidden = false; render();
  const api = { importFiles, getEntries: snapshot, destroy() { if (destroyed) return; destroyed = true; pending?.abort(); pending = null; controller.abort(); observer.disconnect(); if (dialog.open) dialog.close(); for (const [url, timer] of downloads) { clearTimeout(timer); URL.revokeObjectURL(url); } downloads.clear(); element.removeAttribute('aria-busy'); enhanced.hidden = true; fallback.hidden = false; tree.replaceChildren(); details.replaceChildren(); for (const input of enhanced.querySelectorAll('input[type="file"]')) input.value = ''; instances.delete(element); } };
  instances.set(element, api); return api;
}

export function initFileBrowsers(root = document) {
  const browsers = matches(root, '[data-rf-file-browser]').map(element => createFileBrowser(element));
  return () => browsers.forEach(browser => browser.destroy());
}
