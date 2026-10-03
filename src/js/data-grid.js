const instances = new WeakMap();
const operations = { text: ['contains', 'equals', 'starts', 'empty'], number: ['equals', 'gte', 'lte', 'empty'], date: ['equals', 'gte', 'lte', 'empty'] };
const labels = { contains: 'Contains', equals: 'Equals', starts: 'Starts with', gte: 'At least / on or after', lte: 'At most / on or before', empty: 'Is empty' };
const date = value => { const parsed = new Date(`${value}T00:00:00Z`); return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value; };
const text = value => String(value ?? '').toLocaleLowerCase();
const node = (tag, className, value) => { const element = document.createElement(tag); if (className) element.className = className; if (value != null) element.textContent = value; return element; };
const field = (label, input) => { const element = node('div', 'rf-field'), name = node('label', 'rf-label', label); input.id ||= uid('rf-grid'); name.htmlFor = input.id; element.append(name, input); return element; };
const select = choices => { const element = node('select', 'rf-select'); for (const [value, label] of choices) { const option = node('option', '', label); option.value = value; element.append(option); } return element; };

/** Shared client/server query semantics. Reject unsupported fields and operators. */
export function queryGridRows(rows, columns, query = {}) {
  const { page = 0, pageSize = 25, search = '', filters = [], filterMode = 'all', sort = null } = query;
  if (!Number.isSafeInteger(page) || page < 0 || page > 1e6 || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100 || typeof search !== 'string' || search.length > 200 || !Array.isArray(filters) || filters.length > 20 || !['all', 'any'].includes(filterMode)) throw Error('Invalid grid query.');
  const byField = new Map(columns.map(column => [column.field, column]));
  if (sort && (!byField.has(sort.field) || typeof sort.descending !== 'boolean')) throw Error('Invalid sort column.');
  const checks = filters.map(filter => {
    const column = byField.get(filter.field), type = column?.type || 'text';
    if (!column || !operations[type]?.includes(filter.operator) || typeof filter.value !== 'string' || filter.value.length > 512) throw Error('Invalid filter.');
    if (filter.operator !== 'empty' && (!filter.value.trim() || type === 'number' && !Number.isFinite(Number(filter.value)) || type === 'date' && !date(filter.value))) throw Error('Enter a valid filter value.');
    return row => {
      const value = row[filter.field], target = type === 'number' ? Number(filter.value) : text(filter.value), current = type === 'number' ? Number(value) : text(value);
      if (filter.operator === 'empty') return value == null || value === '';
      if (value == null || value === '') return false;
      return filter.operator === 'contains' ? current.includes(target) : filter.operator === 'starts' ? current.startsWith(target) : filter.operator === 'gte' ? current >= target : filter.operator === 'lte' ? current <= target : current === target;
    };
  });
  const found = rows.filter(row => (!search || columns.some(column => text(row[column.field]).includes(text(search)))) && (!checks.length || (filterMode === 'all' ? checks.every(check => check(row)) : checks.some(check => check(row)))));
  if (sort) {
    const type = byField.get(sort.field).type;
    found.sort((a, b) => (type === 'number' ? Number(a[sort.field]) - Number(b[sort.field]) : String(a[sort.field] ?? '').localeCompare(String(b[sort.field] ?? ''), undefined, { numeric: true, sensitivity: 'base' })) * (sort.descending ? -1 : 1));
  }
  const actualPage = Math.min(page, Math.max(0, Math.ceil(found.length / pageSize) - 1));
  return { rows: found.slice(actualPage * pageSize, (actualPage + 1) * pageSize), total: found.length, page: actualPage, pageSize, all: found };
}

/** Enhance a native fallback table. Applications own data, transport and persistence. */
export function createDataGrid(element, options = {}) {
  if (instances.has(element)) return instances.get(element);
  if (options.loadPage != null && typeof options.loadPage !== 'function' || options.saveCell != null && typeof options.saveCell !== 'function') throw Error('Page and save callbacks must be functions.');
  const table = element.querySelector('table'), body = table?.tBodies[0], head = table?.tHead;
  if (!body || !head) throw Error('A grid requires a native table with a header and body.');
  const columns = options.columns || [...head.rows[0].cells].map(cell => ({ field: cell.dataset.rfField, label: cell.textContent.trim(), type: cell.dataset.rfType || 'text', editable: cell.hasAttribute('data-rf-editable'), width: Number(cell.dataset.rfWidth) || 180, min: cell.dataset.rfMin, max: cell.dataset.rfMax, step: cell.dataset.rfStep, maxLength: Number(cell.dataset.rfMaxLength) || 120, options: cell.dataset.rfOptions ? JSON.parse(cell.dataset.rfOptions) : undefined }));
  if (!Array.isArray(columns) || !columns.length || columns.length > 30 || new Set(columns.map(column => column.field)).size !== columns.length || columns.some(column => !/^[a-z][a-z0-9_-]{0,39}$/i.test(column.field) || ['constructor', 'prototype'].includes(column.field) || column.field === 'id' && column.editable || !operations[column.type || 'text'] || typeof column.label !== 'string' || !column.label.trim() || column.options && (!Array.isArray(column.options) || !column.options.length || column.options.length > 50 || column.options.some(value => typeof value !== 'string' || !value || value.length > 120)))) throw Error('Invalid grid columns.');
  // ponytail: client queries scan at most 100,000 rows; use loadPage for larger or remote data.
  const normalize = records => {
    if (!Array.isArray(records) || records.length > 100000) throw Error('Provide at most 100,000 rows.');
    const ids = new Set();
    return records.map(record => {
      if (!record || typeof record !== 'object' || Array.isArray(record) || !['string', 'number'].includes(typeof record.id) || typeof record.id === 'number' && !Number.isFinite(record.id) || !String(record.id) || String(record.id).length > 128 || ids.has(String(record.id))) throw Error('Rows require unique stable IDs.');
      ids.add(String(record.id)); const row = { id: String(record.id) };
      if (Number.isSafeInteger(record.version)) row.version = record.version;
      for (const column of columns) {
        const value = record[column.field] ?? '';
        if (!['string', 'number', 'boolean'].includes(typeof value) || String(value).length > 10000 || column.type === 'number' && value !== '' && !Number.isFinite(Number(value)) || column.type === 'date' && value !== '' && !date(String(value)) || column.options && !column.options.includes(String(value))) throw Error(`Invalid ${column.label || column.field} value.`);
        row[column.field] = column.type === 'number' && value !== '' ? Number(value) : String(value);
      }
      row.id = String(record.id); return row;
    });
  };
  let rows = normalize(options.rows || [...body.rows].map((row, index) => Object.fromEntries([['id', row.dataset.rfId || String(index)], ...columns.map((column, i) => [column.field, row.cells[i]?.dataset.rfValue ?? row.cells[i]?.textContent.trim() ?? ''])])));
  const defaults = () => ({ search: '', filters: [], filterMode: 'all', sort: null, page: 0, pageSize: 25, virtual: true, columns: columns.map(column => ({ field: column.field, visible: true, pinned: false, width: Math.max(120, Math.min(600, Math.round(Number(column.width) || 180))) })) });
  let state = defaults(), loader = options.loadPage, pageRows = rows, displayedVirtual = true, total = rows.length, loading = false, editing = null, generation = 0, request, frame, destroyed = false, windowKey = null, views = [];
  const controller = new AbortController(), listen = (target, event, action) => target.addEventListener(event, action, { signal: controller.signal });
  const button = (label, action) => { const element = node('button', 'rf-button rf-button--outline rf-button--small', label); element.type = 'button'; listen(element, 'click', action); return element; };
  const oldHead = [...head.childNodes], oldStyle = table.getAttribute('style'), oldCount = table.getAttribute('aria-rowcount'), oldColCount = table.getAttribute('aria-colcount');
  const scroll = element.querySelector('[data-rf-grid-scroll]') || table.parentElement, controls = node('div', 'rf-stack rf-grid-controls'), status = node('p', 'rf-help'), error = node('p', 'rf-help'), retry = button('Retry loading', () => refresh());
  status.setAttribute('role', 'status'); error.setAttribute('role', 'alert'); error.hidden = true; retry.hidden = true;
  const announce = message => { status.textContent = message; }, emit = (name, detail) => element.dispatchEvent(new CustomEvent(`rf:grid-${name}`, { bubbles: true, detail }));
  const search = node('input', 'rf-input'); search.type = 'search'; search.maxLength = 200;
  const virtual = node('input'); virtual.type = 'checkbox';
  const pageSize = select([['25', '25'], ['50', '50'], ['100', '100']]), previous = button('Previous grid page', () => { state.page--; refresh(); }), next = button('Next grid page', () => { state.page++; refresh(); });
  const reset = button('Reset grid view', () => applyView(defaults())), toolbar = node('div', 'rf-grid-toolbar'), pages = node('div', 'rf-cluster');
  toolbar.append(field('Search rows', search), field('Rows per page', pageSize), field('Virtual scrolling', virtual), reset); pages.append(previous, next, retry);
  const settings = node('details', 'rf-grid-settings'); settings.append(node('summary', '', 'Columns and filters'));
  const settingsBody = node('div', 'rf-stack'), columnSettings = node('fieldset', 'rf-fieldset'); columnSettings.append(node('legend', '', 'Columns'));
  const columnInputs = new Map();
  for (const column of columns) {
    const row = node('div', 'rf-grid-column-setting'), visible = node('input'), pinned = node('input'), width = node('input', 'rf-range'); visible.type = pinned.type = 'checkbox'; width.type = 'range'; width.min = '120'; width.max = '600'; width.step = '1';
    row.append(field(`Show ${column.label}`, visible), field(`Pin ${column.label}`, pinned), field(`${column.label} width`, width)); columnSettings.append(row); columnInputs.set(column.field, { visible, pinned, width });
    listen(visible, 'change', () => { const config = state.columns.find(item => item.field === column.field); if (!visible.checked && state.columns.filter(item => item.visible).length === 1) { visible.checked = true; announce('Keep at least one column visible.'); return; } config.visible = visible.checked; render(true); });
    listen(pinned, 'change', () => { state.columns.find(item => item.field === column.field).pinned = pinned.checked; render(true); });
    listen(width, 'input', () => { state.columns.find(item => item.field === column.field).width = Number(width.value); render(true); });
  }
  const filterMode = select([['all', 'Match all filters'], ['any', 'Match any filter']]), filters = node('div', 'rf-stack'), filterItems = []; let filterSequence = 0;
  function addFilter(value = { field: columns[0].field, operator: 'contains', value: '' }) {
    if (filterItems.length >= 20) { announce('Use at most 20 filters.'); return; }
    const row = node('div', 'rf-grid-filter'), col = select(columns.map(column => [column.field, column.label])), operator = select([]), input = node('input', 'rf-input'), number = ++filterSequence, abort = new AbortController();
    controller.signal.addEventListener('abort', () => abort.abort(), { once: true, signal: abort.signal });
    const filterListen = (target, event, action) => target.addEventListener(event, action, { signal: abort.signal });
    col.value = value.field;
    const update = () => { const column = columns.find(item => item.field === col.value); operator.replaceChildren(...operations[column.type || 'text'].map(op => { const option = node('option', '', labels[op]); option.value = op; return option; })); input.type = column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'; input.step = 'any'; input.maxLength = 512; input.value = ''; input.disabled = false; input.setCustomValidity(''); };
    update(); operator.value = operations[columns.find(item => item.field === col.value).type || 'text'].includes(value.operator) ? value.operator : operator.options[0].value; input.value = value.value; input.disabled = operator.value === 'empty';
    const item = { row, col, operator, input, abort }; filterItems.push(item);
    const remove = node('button', 'rf-button rf-button--outline rf-button--small', `Remove filter ${number}`); remove.type = 'button'; filterListen(remove, 'click', () => { filterItems.splice(filterItems.indexOf(item), 1); row.remove(); abort.abort(); add.focus(); });
    row.append(field(`Filter ${number} column`, col), field(`Filter ${number} comparison`, operator), field(`Filter ${number} value`, input), remove); filters.append(row);
    filterListen(col, 'change', update); filterListen(operator, 'change', () => { input.disabled = operator.value === 'empty'; input.setCustomValidity(''); }); filterListen(input, 'input', () => input.setCustomValidity(''));
  }
  const add = button('Add filter', () => { addFilter(); filterItems.at(-1)?.col.focus(); }), apply = button('Apply grid filters', () => {
    const candidate = filterItems.map(item => ({ field: item.col.value, operator: item.operator.value, value: item.input.value }));
    for (const item of filterItems) if (!item.input.disabled && (!item.input.value.trim() || !item.input.checkValidity())) { item.input.setCustomValidity('Enter a valid filter value.'); item.input.reportValidity(); return; }
    state.filters = candidate; state.filterMode = filterMode.value; state.page = 0; scroll.scrollTop = 0; refresh();
  });
  const filterActions = node('div', 'rf-cluster'); filterActions.append(add, apply);
  settingsBody.append(columnSettings, field('Filter matching', filterMode), filters, filterActions, node('p', 'rf-help', 'Filter changes apply when you press Apply grid filters.')); settings.append(settingsBody);
  const saved = node('details', 'rf-grid-settings'); saved.append(node('summary', '', 'Saved views')); const savedBody = node('div', 'rf-grid-toolbar'), name = node('input', 'rf-input'), view = select([['', 'Choose a saved view']]); name.maxLength = 60;
  const storageKey = options.storageKey || element.dataset.rfGridStorage;
  const validView = value => {
    try {
      if (!value || typeof value.search !== 'string' || !Array.isArray(value.filters) || !['all', 'any'].includes(value.filterMode) || !('sort' in value) || !Array.isArray(value.columns) || value.columns.length !== columns.length || new Set(value.columns.map(item => item.field)).size !== columns.length || value.columns.some(item => !columns.some(column => column.field === item.field) || typeof item.visible !== 'boolean' || typeof item.pinned !== 'boolean' || !Number.isSafeInteger(item.width) || item.width < 120 || item.width > 600) || !value.columns.some(item => item.visible) || ![25, 50, 100].includes(value.pageSize) || typeof value.virtual !== 'boolean') return false;
      queryGridRows([], columns, { ...value, page: 0 }); return true;
    } catch { return false; }
  };
  if (storageKey) try { const data = localStorage.getItem(storageKey); if (data) { const parsed = JSON.parse(data); if (Array.isArray(parsed)) views = parsed.filter(item => item && typeof item.name === 'string' && item.name.trim() && item.name.length <= 60 && validView(item.state)).slice(0, 20); } } catch { /* Browser storage is optional. */ }
  const persist = () => { if (!storageKey) return false; try { localStorage.setItem(storageKey, JSON.stringify(views)); return true; } catch { return false; } };
  function updateViews() { view.replaceChildren(...[['', 'Choose a saved view'], ...views.map(item => [item.name, item.name])].map(([value, label]) => { const option = node('option', '', label); option.value = value; return option; })); deleteView.disabled = !view.value; }
  const saveView = button('Save grid view', () => {
    const title = name.value.trim(); if (!title || title.length > 60) { name.setCustomValidity('Give this view a name of at most 60 characters.'); name.reportValidity(); return; }
    if (views.length >= 20 && !views.some(item => item.name === title)) { announce('Use at most 20 saved views.'); return; }
    const snapshot = structuredClone(state); snapshot.page = 0; views = views.filter(item => item.name !== title); views.push({ name: title, state: snapshot }); const stored = persist(); updateViews(); view.value = title; deleteView.disabled = false; announce(stored ? `Saved ${title} in this browser.` : `Saved ${title} for this page. Browser storage is unavailable or unconfigured.`);
  });
  const deleteView = button('Delete saved grid view', () => { const title = view.value; views = views.filter(item => item.name !== title); persist(); updateViews(); announce(`Deleted ${title}.`); });
  savedBody.append(field('View name', name), saveView, field('Saved grid views', view), deleteView); saved.append(savedBody);
  controls.append(toolbar, settings, saved, status, error, pages); scroll.before(controls); updateViews();
  listen(name, 'input', () => name.setCustomValidity('')); listen(view, 'change', () => { deleteView.disabled = !view.value; const savedView = views.find(item => item.name === view.value); if (savedView) applyView(savedView.state); });
  const header = node('tr'), headings = new Map();
  for (const column of columns) {
    const cell = node('th'); cell.scope = 'col'; cell.dataset.rfGridField = column.field;
    const sort = button(column.label, () => { state.sort = { field: column.field, descending: state.sort?.field === column.field ? !state.sort.descending : false }; state.page = 0; scroll.scrollTop = 0; refresh(); });
    const resize = node('span', 'rf-grid-resizer'); resize.tabIndex = 0; resize.setAttribute('role', 'separator'); resize.setAttribute('aria-orientation', 'vertical'); resize.setAttribute('aria-label', `Resize ${column.label} column`); resize.setAttribute('aria-valuemin', '120'); resize.setAttribute('aria-valuemax', '600');
    const changeWidth = value => { const config = state.columns.find(item => item.field === column.field); config.width = Math.max(120, Math.min(600, Math.round(value))); columnInputs.get(column.field).width.value = config.width; render(true); };
    listen(resize, 'keydown', event => { if (event.key === 'Escape' && drag) { const previous = drag; drag = null; if (resize.hasPointerCapture(previous.id)) resize.releasePointerCapture(previous.id); changeWidth(previous.width); event.preventDefault(); return; } if (editing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return; event.preventDefault(); const width = state.columns.find(item => item.field === column.field).width, rtl = getComputedStyle(element).direction === 'rtl'; changeWidth(event.key === 'Home' ? 120 : event.key === 'End' ? 600 : width + (event.key === 'ArrowRight' !== rtl ? 10 : -10)); });
    let drag;
    listen(resize, 'pointerdown', event => { if (editing || event.button !== 0) return; drag = { x: event.clientX, width: state.columns.find(item => item.field === column.field).width, id: event.pointerId }; resize.setPointerCapture(event.pointerId); event.preventDefault(); resize.focus(); });
    listen(resize, 'pointermove', event => { if (drag?.id === event.pointerId) changeWidth(drag.width + (event.clientX - drag.x) * (getComputedStyle(element).direction === 'rtl' ? -1 : 1)); });
    listen(resize, 'pointerup', () => { drag = null; }); listen(resize, 'pointercancel', () => { if (drag) changeWidth(drag.width); drag = null; });
    cell.append(sort, resize); header.append(cell); headings.set(column.field, { cell, sort, resize });
  }
  head.replaceChildren(header); table.setAttribute('aria-colcount', columns.length);
  const cache = new Map(), rowHeight = 56;
  function makeRow(row, index) {
    const tr = node('tr'); tr.dataset.rfId = row.id; tr.setAttribute('aria-rowindex', index + 2);
    for (const [i, column] of columns.entries()) {
      const cell = node(i === 0 ? 'th' : 'td'); if (i === 0) cell.scope = 'row'; cell.dataset.rfGridField = column.field; cell.setAttribute('aria-colindex', i + 1);
      const content = node('div', 'rf-grid-cell'), value = node('span', 'rf-grid-cell__value', row[column.field]); value.title = String(row[column.field]); content.append(value);
      if (column.editable && (!loader || options.saveCell)) { const edit = node('button', 'rf-button rf-button--outline rf-button--small', 'Edit'); edit.type = 'button'; edit.dataset.rfGridEdit = column.field; edit.setAttribute('aria-label', `Edit ${column.label} for ${row[columns[0].field] || row.id}`); content.append(edit); }
      cell.append(content); tr.append(cell);
    }
    return tr;
  }
  function setControls() {
    search.value = state.search; pageSize.value = state.pageSize; virtual.checked = state.virtual && !loader; virtual.disabled = !!loader || !!editing; pageSize.disabled = !loader && state.virtual || !!editing;
    previous.disabled = loading || !!editing || !loader && state.virtual || state.page === 0; next.disabled = loading || !!editing || !loader && state.virtual || (state.page + 1) * state.pageSize >= total;
    retry.disabled = !!editing || loading;
    for (const input of controls.querySelectorAll('input,select,button')) if (![previous, next, pageSize, virtual, retry].includes(input)) input.disabled = !!editing;
    for (const item of filterItems) item.input.disabled = !!editing || item.operator.value === 'empty';
    deleteView.disabled = !!editing || !view.value;
    for (const config of state.columns) { const input = columnInputs.get(config.field); input.visible.checked = config.visible; input.pinned.checked = config.pinned; input.width.value = config.width; input.pinned.disabled = !!editing || !config.visible; }
    for (const heading of headings.values()) { heading.sort.disabled = !!editing || loading; heading.resize.tabIndex = editing ? -1 : 0; }
    for (const edit of table.querySelectorAll('[data-rf-grid-edit]')) edit.disabled = !!editing || loading || !!loader && !options.saveCell;
  }
  function render(force = false) {
    if (destroyed) return;
    const isVirtual = displayedVirtual, all = pageRows, start = isVirtual ? Math.max(0, Math.floor(Math.max(0, scroll.scrollTop - head.offsetHeight) / rowHeight) - 4) : 0, end = isVirtual ? Math.min(all.length, start + Math.ceil(scroll.clientHeight / rowHeight) + 10) : all.length;
    const indices = Array.from({ length: Math.max(0, end - start) }, (_, i) => start + i), active = document.activeElement, focusedID = active?.closest('tr[data-rf-id]')?.dataset.rfId, focusedField = active?.closest('[data-rf-grid-field]')?.dataset.rfGridField;
    if (editing && !indices.includes(editing.index)) indices.push(editing.index); indices.sort((a, b) => a - b);
    if (focusedID) { const index = all.findIndex(row => row.id === focusedID); if (index >= 0 && !indices.includes(index)) { indices.push(index); indices.sort((a, b) => a - b); } }
    const key = indices.join(','), rebuild = windowKey !== key || indices.some(index => !cache.has(all[index]?.id)); if (!force && !rebuild) return; windowKey = key;
    const retained = new Set(indices.map(index => all[index]?.id));
    for (const id of cache.keys()) if (!retained.has(id)) cache.delete(id);
    if (rebuild) {
      const fragment = document.createDocumentFragment(); let cursor = 0;
      const spacer = count => { if (count <= 0) return; const row = node('tr'), cell = node('td'); row.dataset.rfGridSpacer = ''; row.setAttribute('aria-hidden', 'true'); cell.colSpan = state.columns.filter(column => column.visible).length; cell.style.height = `${count * rowHeight}px`; row.append(cell); fragment.append(row); };
      for (const index of indices) { const row = all[index]; if (!row) continue; if (isVirtual) spacer(index - cursor); let tr = cache.get(row.id); if (!tr) { tr = makeRow(row, index); cache.set(row.id, tr); } tr.setAttribute('aria-rowindex', (!displayedVirtual ? state.page * state.pageSize : 0) + index + 2); fragment.append(tr); cursor = index + 1; }
      if (isVirtual) spacer(all.length - cursor);
      body.replaceChildren(fragment);
    }
    for (const cell of body.querySelectorAll('[data-rf-grid-spacer] > td')) cell.colSpan = state.columns.filter(column => column.visible).length;
    table.setAttribute('aria-rowcount', total + 1);
    let pinnedOffset = 0, width = 0;
    for (const config of state.columns) {
      const heading = headings.get(config.field); heading.cell.hidden = !config.visible; heading.cell.style.width = `${config.width}px`; heading.cell.setAttribute('aria-colindex', columns.findIndex(column => column.field === config.field) + 1); heading.resize.setAttribute('aria-valuenow', config.width);
      if (state.sort?.field === config.field) heading.cell.setAttribute('aria-sort', state.sort.descending ? 'descending' : 'ascending'); else heading.cell.removeAttribute('aria-sort');
      for (const cell of [heading.cell, ...[...cache.values()].map(row => [...row.cells].find(cell => cell.dataset.rfGridField === config.field))]) { cell.hidden = !config.visible; cell.toggleAttribute('data-rf-grid-pinned', config.pinned && config.visible); cell.style.setProperty('--rf-grid-pin-offset', `${pinnedOffset}px`); }
      if (config.visible) { width += config.width; if (config.pinned) pinnedOffset += config.width; }
    }
    table.style.width = `${width}px`; setControls(); if (active && element.contains(active)) active.focus({ preventScroll: true });
    else if (focusedID) ([...cache.get(focusedID)?.cells || []].find(cell => cell.dataset.rfGridField === focusedField)?.querySelector('button') || search).focus({ preventScroll: true });
  }
  function applyView(value) {
    if (editing || !validView(value)) return;
    state = structuredClone(value); state.page = 0; filterMode.value = state.filterMode; for (const filter of filterItems) filter.abort.abort(); filters.replaceChildren(); filterItems.length = 0; for (const filter of state.filters) addFilter(filter); scroll.scrollTop = 0; refresh();
  }
  async function refresh() {
    if (destroyed || editing) return; const ticket = ++generation; request?.abort(); request = new AbortController(); error.hidden = retry.hidden = true; loading = !!loader; table.setAttribute('aria-busy', String(loading)); setControls();
    try {
      if (loader) {
        announce('Loading rows…'); const result = await loader(structuredClone({ search: state.search, filters: state.filters, filterMode: state.filterMode, sort: state.sort, page: state.page, pageSize: state.pageSize }), { signal: request.signal });
        if (destroyed || ticket !== generation) return;
        if (!result || !Number.isSafeInteger(result.total) || result.total < 0 || result.total > 1e9 || !Array.isArray(result.rows) || result.rows.length > state.pageSize) throw Error('Invalid page response.');
        const last = Math.max(0, Math.ceil(result.total / state.pageSize) - 1);
        if (result.page != null && (!Number.isSafeInteger(result.page) || result.page < 0 || result.page > last)) throw Error('Invalid page response.');
        if (state.page > last && result.page == null) { state.page = last; return refresh(); }
        const records = normalize(result.rows); total = result.total; state.page = result.page ?? state.page; pageRows = records; displayedVirtual = false;
      } else { const result = queryGridRows(rows, columns, state); state.page = result.page; total = result.total; pageRows = state.virtual ? result.all : result.rows; displayedVirtual = state.virtual; }
      cache.clear(); windowKey = null; loading = false; table.setAttribute('aria-busy', 'false'); render(true); announce(state.virtual && !loader ? `${total} rows. Virtual scrolling shows a window of rows; turn it off for paginated reading.` : `${total ? state.page * state.pageSize + 1 : 0}–${Math.min((state.page + 1) * state.pageSize, total)} of ${total} rows. Page ${state.page + 1} of ${Math.max(1, Math.ceil(total / state.pageSize))}.`); emit('change', { ...structuredClone(state), total });
    } catch (cause) { if (destroyed || ticket !== generation || request.signal.aborted) return; loading = false; table.setAttribute('aria-busy', 'false'); setControls(); error.textContent = `Could not load rows. ${cause.message || 'Try again.'}`; error.hidden = false; retry.hidden = false; announce('Previous rows remain available.'); }
  }
  function beginEdit(row, column, cell, trigger) {
    if (editing || loading) return;
    const holder = node('div', 'rf-grid-editor'), input = column.options ? select(column.options.map(value => [value, value])) : node('input', 'rf-input'); if (!column.options) input.type = column.type === 'number' ? 'number' : column.type === 'date' ? 'date' : 'text'; input.value = row[column.field]; input.setAttribute('aria-label', `${column.label} for ${row[columns[0].field] || row.id}`); input.required = true; input.maxLength = column.maxLength || 120; if (column.type === 'number') input.step = column.step ?? 'any'; if (column.min != null) input.min = column.min; if (column.max != null) input.max = column.max;
    const original = [...cell.childNodes], index = pageRows.indexOf(row), abort = new AbortController(); editing = { index, abort, row };
    controller.signal.addEventListener('abort', () => abort.abort(), { once: true, signal: abort.signal });
    const editButton = (label, action) => { const target = node('button', 'rf-button rf-button--outline rf-button--small', label); target.type = 'button'; target.addEventListener('click', action, { signal: abort.signal }); return target; };
    const finish = () => { if (destroyed) return; abort.abort(); editing = null; cell.replaceChildren(...original); trigger.focus({ preventScroll: true }); setControls(); };
    const save = editButton('✓', async () => {
      input.setCustomValidity(input.type === 'text' && (!input.value.trim() || input.value.length > input.maxLength) ? `Enter a value of at most ${input.maxLength} characters.` : ''); if (!input.reportValidity()) return;
      const value = column.type === 'number' ? Number(input.value) : input.value.trim(), previousValue = row[column.field], detail = { id: row.id, field: column.field, value, previousValue, row: { ...row } };
      if (!element.dispatchEvent(new CustomEvent('rf:grid-before-edit', { bubbles: true, cancelable: true, detail }))) { announce('Edit was not saved.'); return; }
      input.disabled = save.disabled = cancel.disabled = true;
      try {
        const result = options.saveCell ? normalize([await options.saveCell(detail, { signal: abort.signal })])[0] : { ...row, [column.field]: value };
        if (destroyed || abort.signal.aborted) return; if (result.id !== row.id) throw Error('The saved row ID changed.');
        Object.assign(row, result); finish(); if (loader) { cache.delete(row.id); render(true); } else await refresh(); if (destroyed) return; emit('edit', { ...detail, row: { ...row } }); announce(`Saved ${column.label}.`);
      } catch (cause) { if (destroyed || abort.signal.aborted) return; input.disabled = save.disabled = cancel.disabled = false; announce(`Could not save. ${cause.message || 'Try again.'} Your edit is still available.`); input.focus(); }
    });
    save.setAttribute('aria-label', 'Save cell edit'); const cancel = editButton('×', () => { finish(); announce('Edit cancelled.'); }); cancel.setAttribute('aria-label', 'Cancel cell edit');
    input.addEventListener('keydown', event => { if (event.isComposing) return; if (event.key === 'Enter') { event.preventDefault(); save.click(); } if (event.key === 'Escape' && !cancel.disabled) { event.preventDefault(); cancel.click(); } }, { signal: abort.signal });
    holder.append(input, save, cancel); cell.replaceChildren(holder); setControls(); input.focus(); input.select?.(); announce(`Editing ${column.label}. Enter saves; Escape cancels.`);
  }
  listen(search, 'input', () => { state.search = search.value; state.page = 0; scroll.scrollTop = 0; refresh(); });
  listen(pageSize, 'change', () => { state.pageSize = Number(pageSize.value); state.page = 0; scroll.scrollTop = 0; refresh(); });
  listen(virtual, 'change', () => { state.virtual = virtual.checked; state.page = 0; scroll.scrollTop = 0; refresh(); });
  listen(scroll, 'scroll', () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => render()); });
  listen(table, 'click', event => { const trigger = event.target.closest('[data-rf-grid-edit]'); if (!trigger || !table.contains(trigger)) return; const row = pageRows.find(row => row.id === trigger.closest('tr').dataset.rfId), column = columns.find(column => column.field === trigger.dataset.rfGridEdit); if (row && column) beginEdit(row, column, trigger.closest('td,th'), trigger); });
  const resizeObserver = new ResizeObserver(() => render(true)); resizeObserver.observe(scroll);
  const api = {
    getState: () => structuredClone(state), getRows: () => rows.map(row => ({ ...row })), refresh,
    setRows(records) { if (editing) throw Error('Finish the cell edit before replacing rows.'); rows = normalize(records); state.page = 0; scroll.scrollTop = 0; return refresh(); },
    setLoader(value) { if (editing) throw Error('Finish the cell edit before changing data sources.'); if (value != null && typeof value !== 'function') throw Error('Provide a page loader function.'); loader = value; state.page = 0; scroll.scrollTop = 0; return refresh(); },
    destroy() {
      if (destroyed) return; destroyed = true; generation++; request?.abort(); editing?.abort.abort(); controller.abort(); resizeObserver.disconnect(); cancelAnimationFrame(frame); controls.remove(); instances.delete(element); head.replaceChildren(...oldHead);
      const fallback = rows.slice(0, 25).map(row => { const tr = node('tr'); tr.dataset.rfId = row.id; columns.forEach((column, i) => { const cell = node(i === 0 ? 'th' : 'td', '', row[column.field]); if (i === 0) cell.scope = 'row'; tr.append(cell); }); return tr; }); body.replaceChildren(...fallback);
      for (const [attribute, value] of [['style', oldStyle], ['aria-rowcount', oldCount], ['aria-colcount', oldColCount]]) if (value == null) table.removeAttribute(attribute); else table.setAttribute(attribute, value);
      table.removeAttribute('aria-busy'); const note = element.querySelector('[data-rf-grid-note]'); if (note) note.textContent = `Showing the first ${fallback.length} of ${rows.length} browser rows. Edits are retained in the controller's getRows() result.`;
    }
  };
  instances.set(element, api); refresh(); return api;
}
import { uid } from './utils.js';
