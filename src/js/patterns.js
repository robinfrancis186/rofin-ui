import { matches, onFormReset, uid } from './utils.js';

const lineCharts = new WeakMap();
/** Update an initialized chart atomically; invalid or late updates return false. */
export function updateLineChart(element, rows, options = {}) { return lineCharts.get(element)?.(rows, options?.append === true) || false; }

/** Optional patterns; initialize each root once and tear down before removing it. */
export function initPatterns(root = document) {
  const controller = new AbortController();
  const { signal } = controller;
  const cleanups = [];
  const listen = (node, type, handler) => node.addEventListener(type, handler, { signal });
  const afterReset = (form, update) => cleanups.push(onFormReset(form, update, signal));

  for (const element of matches(root, '[data-rf-sortable]')) {
    const own = selector => [...element.querySelectorAll(selector)].filter(node => node.closest('[data-rf-sortable]') === element);
    const list = own('[data-rf-sort-list]')[0];
    if (!list) continue;
    const items = () => [...list.children].filter(item => item.matches('[data-rf-sort-item]'));
    const original = items();
    if (original.some(item => !item.dataset.rfSortItem?.trim()) || new Set(original.map(item => item.dataset.rfSortItem)).size !== original.length) continue;
    const buttons = own('[data-rf-sort-move]').filter(button => button.closest('[data-rf-sort-item]')?.parentElement === list).map(button => ({ button, hidden: button.hidden, disabled: button.disabled }));
    const dragNodes = original.flatMap(item => { const handles = own('[data-rf-sort-handle]').filter(node => node.closest('[data-rf-sort-item]') === item); return handles.length ? handles : [item]; }), draggable = dragNodes.map(node => node.getAttribute('draggable'));
    const status = own('[role="status"]')[0], controls = item => buttons.filter(({ button }) => button.closest('[data-rf-sort-item]') === item);
    const blocked = item => element.dataset.rfSortDisabled === 'true' || item?.dataset.rfSortDisabled === 'true' || controls(item).length > 0 && controls(item).every(({ button }) => button.matches(':disabled'));
    let dragged;
    const update = () => items().forEach((item, index, order) => {
      for (const { button, disabled } of controls(item)) { const delta = Number(button.dataset.rfSortMove); button.hidden = false; button.disabled = disabled || element.dataset.rfSortDisabled === 'true' || item.dataset.rfSortDisabled === 'true' || ![-1, 1].includes(delta) || (delta === -1 ? index === 0 : index === order.length - 1); }
      dragNodes.filter(node => node.closest('[data-rf-sort-item]') === item).forEach(node => node.draggable = !blocked(item));
    });
    const clearDrag = () => { dragged = null; original.forEach(item => { item.removeAttribute('data-rf-dragging'); item.removeAttribute('data-rf-drop-target'); }); };
    const commit = (item, order) => {
      const previous = items(), from = previous.indexOf(item), to = order.indexOf(item);
      if (from === to || from < 0 || blocked(item)) return;
      const active = document.activeElement;
      list.append(...order); update();
      (item.contains(active) && !active.matches(':disabled') ? active : controls(item).find(({ button }) => !button.matches(':disabled'))?.button)?.focus();
      if (status) status.textContent = `${own('[data-rf-item-label]').find(label => label.closest('[data-rf-sort-item]') === item)?.textContent || item.dataset.rfSortItem} moved to position ${to + 1} of ${order.length}.`;
      element.dispatchEvent(new CustomEvent('rf:sort-change', { bubbles: true, detail: { value: item.dataset.rfSortItem, from, to, values: order.map(node => node.dataset.rfSortItem), previousValues: previous.map(node => node.dataset.rfSortItem) } }));
    };
    listen(list, 'click', event => {
      const button = event.target.closest('[data-rf-sort-move]'), item = button?.closest('[data-rf-sort-item]');
      if (!button || button.matches(':disabled') || !buttons.some(entry => entry.button === button) || item?.parentElement !== list || ![-1, 1].includes(Number(button.dataset.rfSortMove))) return;
      const order = items(), from = order.indexOf(item), to = Math.max(0, Math.min(order.length - 1, from + Number(button.dataset.rfSortMove)));
      order.splice(from, 1); order.splice(to, 0, item); commit(item, order);
    });
    listen(list, 'dragstart', event => {
      const item = event.target.closest('[data-rf-sort-item]');
      if (item?.parentElement !== list || !dragNodes.includes(event.target.closest('[draggable="true"]')) || !event.dataTransfer) return;
      if (blocked(item)) { event.preventDefault(); return; }
      dragged = item; item.dataset.rfDragging = ''; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', item.dataset.rfSortItem);
    });
    listen(list, 'dragover', event => {
      const item = event.target.closest('[data-rf-sort-item]');
      if (!dragged || blocked(dragged) || item?.parentElement !== list || item === dragged) return;
      event.preventDefault(); event.dataTransfer.dropEffect = 'move';
      original.forEach(node => node.toggleAttribute('data-rf-drop-target', node === item));
    });
    listen(list, 'drop', event => {
      const target = event.target.closest('[data-rf-sort-item]');
      if (!dragged || blocked(dragged) || target?.parentElement !== list || dragged.parentElement !== list) { clearDrag(); return; }
      event.preventDefault();
      if (target !== dragged) {
        const order = items().filter(item => item !== dragged), bounds = target.getBoundingClientRect();
        const horizontal = ['x', 'grid'].includes(element.dataset.rfSortAxis) && getComputedStyle(list).gridTemplateColumns.split(' ').length > 1;
        const after = horizontal ? (getComputedStyle(list).direction === 'rtl' ? event.clientX < bounds.left + bounds.width / 2 : event.clientX >= bounds.left + bounds.width / 2) : event.clientY >= bounds.top + bounds.height / 2;
        order.splice(order.indexOf(target) + (after ? 1 : 0), 0, dragged); commit(dragged, order);
      }
      clearDrag();
    });
    listen(list, 'dragend', clearDrag);
    listen(document, 'keydown', event => { if (event.key === 'Escape') clearDrag(); }); listen(window, 'pagehide', clearDrag);
    if (element.closest('form')) listen(element.closest('form'), 'reset', clearDrag);
    update();
    const observer = new MutationObserver(() => { update(); if (dragged && blocked(dragged)) clearDrag(); }); observer.observe(element, { attributes: true, subtree: true, attributeFilter: ['data-rf-sort-disabled'] }); cleanups.push(() => observer.disconnect());
    for (let parent = element.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'FIELDSET') observer.observe(parent, { attributes: true, attributeFilter: ['disabled'] });
    afterReset(element.closest('form'), () => { clearDrag(); list.append(...original); update(); if (status) status.textContent = 'Original order restored.'; });
    cleanups.push(() => { clearDrag(); dragNodes.forEach((node, index) => { if (draggable[index] === null) node.removeAttribute('draggable'); else node.setAttribute('draggable', draggable[index]); }); buttons.forEach(({ button, hidden, disabled }) => { button.hidden = hidden; button.disabled = disabled; }); });
  }
  for (const element of matches(root, '[data-rf-kanban]')) {
    const own = selector => [...element.querySelectorAll(selector)].filter(node => node.closest('[data-rf-kanban]') === element);
    const columns = own('[data-rf-kanban-column]');
    const lists = columns.map(column => column.querySelector('[data-rf-kanban-list]'));
    if (lists.some(list => !list) || !lists.length) continue;
    const original = lists.map(list => [...list.children].filter(item => item.matches('[data-rf-kanban-item]')));
    const items = original.flat(), draggable = items.map(item => item.getAttribute('draggable'));
    if (items.some(item => !item.dataset.rfKanbanItem?.trim()) || columns.some(column => !column.dataset.rfKanbanColumn?.trim()) || new Set(items.map(item => item.dataset.rfKanbanItem)).size !== items.length || new Set(columns.map(column => column.dataset.rfKanbanColumn)).size !== columns.length) continue;
    const controls = own('[data-rf-kanban-control]').map(control => ({ control, hidden: control.hidden }));
    const buttons = own('[data-rf-kanban-order]').map(button => ({ button, disabled: button.disabled }));
    const status = own('[role="status"]')[0];
    let dragged;
    const columnOf = item => columns[lists.indexOf(item.parentElement)];
    const cards = list => [...list.children].filter(item => items.includes(item));
    const snapshot = () => Object.fromEntries([...columns[0].parentElement.children].filter(column => columns.includes(column)).map(column => [column.dataset.rfKanbanColumn, cards(lists[columns.indexOf(column)]).map(item => item.dataset.rfKanbanItem)]));
    const blocked = item => item?.querySelector('[data-rf-kanban-move]')?.matches(':disabled');
    const update = () => columns.forEach((column, index) => {
      const count = lists[index].querySelectorAll(':scope > [data-rf-kanban-item]').length;
      const badge = column.querySelector('[data-rf-kanban-count]'), empty = column.querySelector('[data-rf-kanban-empty]');
      if (badge) badge.textContent = String(count); if (empty) empty.hidden = count > 0;
      lists[index].querySelectorAll('[data-rf-kanban-move]').forEach(select => { select.value = column.dataset.rfKanbanColumn; });
      cards(lists[index]).forEach((item, position, order) => { item.draggable = !blocked(item); for (const { button, disabled } of buttons.filter(entry => entry.button.closest('[data-rf-kanban-item]') === item)) { const delta = Number(button.dataset.rfKanbanOrder); button.disabled = disabled || blocked(item) || ![-1, 1].includes(delta) || (delta === -1 ? position === 0 : position === order.length - 1); } });
    });
    const clearDrag = () => { dragged = null; items.forEach(item => { item.removeAttribute('data-rf-dragging'); item.removeAttribute('data-rf-drop-target'); }); columns.forEach(column => column.removeAttribute('data-rf-drop-target')); };
    const move = (item, column, position, focus) => {
      const previous = columnOf(item), index = columns.indexOf(column);
      if (!previous || index < 0 || blocked(item)) { update(); return; }
      const fromIndex = cards(item.parentElement).indexOf(item), order = cards(lists[index]).filter(card => card !== item), toIndex = position === undefined ? order.length : Math.max(0, Math.min(order.length, position));
      if (column === previous && (position === undefined || fromIndex === toIndex)) { update(); return; }
      const previousValues = snapshot(); order.splice(toIndex, 0, item); lists[index].append(...order); update();
      (focus && !focus.matches(':disabled') ? focus : item.querySelector('[data-rf-kanban-move]'))?.focus();
      if (status) status.textContent = `Moved ${item.querySelector('[data-rf-item-label]')?.textContent || item.dataset.rfKanbanItem} to ${column.dataset.rfKanbanColumn}, position ${toIndex + 1} of ${order.length}.`;
      element.dispatchEvent(new CustomEvent('rf:kanban-change', { bubbles: true, detail: { value: item.dataset.rfKanbanItem, from: previous.dataset.rfKanbanColumn, to: column.dataset.rfKanbanColumn, fromIndex, toIndex, values: snapshot(), previousValues } }));
    };
    listen(element, 'change', event => {
      const select = event.target.closest('[data-rf-kanban-move]');
      const item = select?.closest('[data-rf-kanban-item]');
      if (select && items.includes(item) && !select.matches(':disabled')) move(item, columns.find(column => column.dataset.rfKanbanColumn === select.value));
    });
    listen(element, 'click', event => { const button = event.target.closest('[data-rf-kanban-order]'), item = button?.closest('[data-rf-kanban-item]'), delta = Number(button?.dataset.rfKanbanOrder); if (!button || button.matches(':disabled') || !items.includes(item) || ![-1, 1].includes(delta)) return; move(item, columnOf(item), cards(item.parentElement).indexOf(item) + delta, button); });
    listen(element, 'dragstart', event => {
      const item = event.target.closest('[data-rf-kanban-item]');
      if (!items.includes(item) || !event.dataTransfer) return;
      if (blocked(item)) { event.preventDefault(); return; }
      dragged = item; item.dataset.rfDragging = ''; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', item.dataset.rfKanbanItem);
    });
    listen(element, 'dragover', event => {
      const column = event.target.closest('[data-rf-kanban-column]');
      if (!dragged || blocked(dragged) || !columns.includes(column)) return;
      event.preventDefault(); event.dataTransfer.dropEffect = 'move'; columns.forEach(node => node.toggleAttribute('data-rf-drop-target', node === column));
      const target = event.target.closest('[data-rf-kanban-item]'); items.forEach(node => node.toggleAttribute('data-rf-drop-target', node === target && node !== dragged));
    });
    listen(element, 'drop', event => {
      const column = event.target.closest('[data-rf-kanban-column]');
      if (!dragged || blocked(dragged) || !columns.includes(column)) { clearDrag(); return; }
      event.preventDefault(); const target = event.target.closest('[data-rf-kanban-item]'), order = cards(lists[columns.indexOf(column)]).filter(item => item !== dragged);
      const bounds = target?.getBoundingClientRect(), position = target === dragged ? cards(dragged.parentElement).indexOf(dragged) : items.includes(target) ? order.indexOf(target) + (event.clientY >= bounds.top + bounds.height / 2 ? 1 : 0) : order.length;
      move(dragged, column, position); clearDrag();
    });
    listen(element, 'dragend', clearDrag);
    listen(document, 'keydown', event => { if (event.key === 'Escape') clearDrag(); }); listen(window, 'pagehide', clearDrag);
    if (element.closest('form')) listen(element.closest('form'), 'reset', clearDrag);
    controls.forEach(({ control }) => { control.hidden = false; }); update();
    const observer = new MutationObserver(() => { update(); if (dragged && blocked(dragged)) clearDrag(); }); own('[data-rf-kanban-move]').forEach(select => observer.observe(select, { attributes: true, attributeFilter: ['disabled'] }));
    for (let parent = element.parentElement; parent; parent = parent.parentElement) if (parent.tagName === 'FIELDSET') observer.observe(parent, { attributes: true, attributeFilter: ['disabled'] });
    cleanups.push(() => observer.disconnect());
    afterReset(element.closest('form'), () => { clearDrag(); lists.forEach((list, index) => list.append(...original[index])); update(); if (status) status.textContent = 'Original board restored.'; });
    // ponytail: small static boards, with native moves; add virtualization and persistence in the application when needed.
    cleanups.push(() => { clearDrag(); items.forEach((item, index) => { if (draggable[index] === null) item.removeAttribute('draggable'); else item.setAttribute('draggable', draggable[index]); }); controls.forEach(({ control, hidden }) => { control.hidden = hidden; }); buttons.forEach(({ button, disabled }) => button.disabled = disabled); });
  }
  for (const element of matches(root, '[data-rf-resizable]')) {
    const own = selector => [...element.querySelectorAll(selector)].find(node => node.closest('[data-rf-resizable]') === element);
    const range = own('input[type="range"]'), panels = own('.rf-resizable__panels'), output = own('[data-rf-panel-size]'), status = own('[data-rf-panel-status]'), reset = own('[data-rf-panel-reset]');
    if (!range || !panels || panels.children.length !== 2) continue;
    const minimum = Number(range.min || 0), maximum = Number(range.max || 100), step = range.step === 'any' ? 1 : Number(range.step || 1);
    if (![minimum, maximum, step].every(Number.isFinite) || minimum < 0 || maximum > 100 || minimum >= maximum || step <= 0 || step > maximum - minimum) continue;
    const axis = element.dataset.rfPanelAxis === 'y' ? 'y' : 'x', [primary, secondary] = panels.children;
    const divider = document.createElement('button'); divider.type = 'button'; divider.className = 'rf-resizable__divider'; divider.dataset.rfPanelDivider = '';
    const attributes = [[panels, 'data-rf-panel-enhanced'], [panels, 'data-rf-panel-axis'], [primary, 'data-rf-panel-first'], [secondary, 'data-rf-panel-second'], [range, 'aria-valuetext']].map(([node, name]) => [node, name, node.getAttribute(name)]);
    const first = panels.style.getPropertyValue('--rf-panel-first'), second = panels.style.getPropertyValue('--rf-panel-second'), originalId = primary.id, hidden = [primary.hidden, secondary.hidden], resetDisabled = reset?.disabled;
    primary.id ||= uid('rf-split-pane'); primary.dataset.rfPanelFirst = ''; secondary.dataset.rfPanelSecond = '';
    divider.setAttribute('role', 'separator'); divider.setAttribute('aria-label', primary.getAttribute('aria-label') || primary.querySelector('h1,h2,h3,h4,h5,h6')?.textContent.trim() || 'First panel');
    divider.setAttribute('aria-controls', primary.id); divider.setAttribute('aria-orientation', axis === 'x' ? 'vertical' : 'horizontal'); divider.setAttribute('aria-valuemin', minimum); divider.setAttribute('aria-valuemax', maximum);
    panels.dataset.rfPanelEnhanced = ''; panels.dataset.rfPanelAxis = axis; primary.after(divider);
    const key = element.dataset.rfPanelStorage?.trim(), storageKey = key && key.length <= 200 ? `rf-panel:${key}` : '';
    const announce = text => { if (status) status.textContent = text; };
    if (storageKey) try {
      const stored = localStorage.getItem(storageKey); let value;
      try { value = JSON.parse(stored); } catch { /* Invalid preferences leave the native default intact. */ }
      if (typeof value === 'number' && Number.isFinite(value) && value >= minimum && value <= maximum) { range.value = String(value); announce('Saved layout restored in this browser.'); }
    } catch { announce('Browser storage is unavailable. Layout changes stay on this page.'); }
    let drag, committed = range.valueAsNumber, expanded = committed > 0 ? committed : Number(range.defaultValue) || (minimum + maximum) / 2;
    const stacked = () => axis === 'x' && getComputedStyle(divider).display === 'none';
    const update = () => {
      const value = range.valueAsNumber, narrow = stacked();
      panels.style.setProperty('--rf-panel-first', `${value}fr`); panels.style.setProperty('--rf-panel-second', `${100 - value}fr`);
      const text = `${value}% first panel, ${100 - value}% second panel`;
      primary.hidden = !narrow && value === 0; secondary.hidden = !narrow && value === 100;
      range.setAttribute('aria-valuetext', narrow ? `${text}; stacked on this screen` : text); if (output) output.textContent = narrow ? `Panels stack here. Remembered split: ${text}.` : text;
      divider.setAttribute('aria-valuenow', value); divider.setAttribute('aria-valuetext', text); divider.disabled = range.matches(':disabled') || narrow; divider.setAttribute('aria-disabled', String(divider.disabled));
      if (reset) reset.disabled = range.matches(':disabled');
    };
    const assign = value => { const previous = range.value; range.value = String(value); if (range.value !== previous) range.dispatchEvent(new Event('input', { bubbles: true })); };
    const commit = (source, persist = true) => {
      const value = range.valueAsNumber, previousValue = committed; committed = value;
      if (persist && value === previousValue) return;
      if (storageKey) try { if (persist) { localStorage.setItem(storageKey, JSON.stringify(value)); announce('Layout saved in this browser.'); } else { localStorage.removeItem(storageKey); announce('Default layout restored.'); } } catch { announce('Browser storage is unavailable. Layout changes stay on this page.'); }
      if (value !== previousValue) element.dispatchEvent(new CustomEvent('rf:panel-resize', { bubbles: true, detail: { value, previousValue, axis, source } }));
    };
    const extent = () => { const rect = panels.getBoundingClientRect(); return (axis === 'x' ? rect.width : rect.height) - (axis === 'x' ? divider.offsetWidth : divider.offsetHeight); };
    const finish = (save = false, restore = true) => {
      if (!drag) return;
      if (save && (stacked() || range.matches(':disabled') || Math.abs(extent() - drag.extent) > 1)) save = false;
      const previous = drag; drag = undefined; panels.removeAttribute('data-rf-resizing');
      if (divider.hasPointerCapture(previous.id)) divider.releasePointerCapture(previous.id);
      if (save) { commit('pointer'); range.dispatchEvent(new Event('change', { bubbles: true })); }
      else if (restore) { assign(previous.value); update(); announce('Resize cancelled. Previous layout retained.'); }
      if (stacked() && range.getClientRects().length) range.focus({ preventScroll: true });
    };
    listen(range, 'input', () => { if (!range.matches(':disabled')) update(); });
    listen(range, 'change', () => { if (!range.matches(':disabled')) { update(); commit('range'); } });
    listen(divider, 'keydown', event => {
      if (divider.disabled || range.matches(':disabled') || drag || event.altKey || event.ctrlKey || event.metaKey) return;
      const rtl = axis === 'x' && getComputedStyle(panels).direction === 'rtl';
      let value;
      if (event.key === 'Home') value = minimum;
      else if (event.key === 'End') value = maximum;
      else if (axis === 'x' && ['ArrowLeft', 'ArrowRight'].includes(event.key)) value = range.valueAsNumber + (event.key === 'ArrowRight' !== rtl ? 1 : -1) * step * (event.shiftKey ? 10 : 1);
      else if (axis === 'y' && ['ArrowUp', 'ArrowDown'].includes(event.key)) value = range.valueAsNumber + (event.key === 'ArrowDown' ? 1 : -1) * step * (event.shiftKey ? 10 : 1);
      else if (event.key === 'Enter' && minimum === 0) { if (range.valueAsNumber > 0) { expanded = range.valueAsNumber; value = 0; } else value = expanded; }
      else return;
      event.preventDefault(); assign(value); update(); commit('keyboard'); range.dispatchEvent(new Event('change', { bubbles: true }));
    });
    listen(divider, 'blur', () => { if (stacked() && !range.matches(':disabled') && range.getClientRects().length) range.focus({ preventScroll: true }); });
    listen(divider, 'pointerdown', event => {
      if (event.button !== 0 || drag || divider.disabled || range.matches(':disabled') || stacked()) return;
      const size = extent(); if (size <= 0) return;
      event.preventDefault(); divider.focus({ preventScroll: true });
      drag = { id: event.pointerId, value: range.valueAsNumber, position: axis === 'x' ? event.clientX : event.clientY, extent: size, rtl: axis === 'x' && getComputedStyle(panels).direction === 'rtl' };
      try { divider.setPointerCapture(event.pointerId); } catch { drag = undefined; return; }
      panels.dataset.rfResizing = '';
    });
    listen(divider, 'pointermove', event => { if (drag?.id === event.pointerId) { if (range.matches(':disabled')) { finish(); return; } assign(drag.value + ((axis === 'x' ? event.clientX : event.clientY) - drag.position) / drag.extent * 100 * (drag.rtl ? -1 : 1)); } });
    listen(divider, 'pointerup', event => { if (drag?.id === event.pointerId) finish(true); });
    for (const type of ['pointercancel', 'lostpointercapture']) listen(divider, type, event => { if (drag?.id === event.pointerId) finish(); });
    listen(document, 'keydown', event => { if (drag && event.key === 'Escape') { event.preventDefault(); finish(); divider.focus({ preventScroll: true }); } });
    listen(window, 'pagehide', () => finish());
    const restore = () => { finish(false, false); range.value = range.defaultValue; update(); commit('reset', false); };
    if (reset) listen(reset, 'click', () => { if (!reset.disabled) restore(); });
    afterReset(range.form, restore);
    const resized = () => { if (drag && (stacked() || Math.abs(extent() - drag.extent) > 1)) finish(); update(); if (stacked() && document.activeElement === divider && range.getClientRects().length) range.focus({ preventScroll: true }); };
    const observer = new ResizeObserver(resized); observer.observe(panels);
    const disabledObserver = new MutationObserver(() => { if (range.matches(':disabled')) finish(); update(); }); disabledObserver.observe(range, { attributes: true, attributeFilter: ['disabled'] });
    for (let parent = range.parentElement; parent; parent = parent.parentElement) if (parent instanceof HTMLFieldSetElement) disabledObserver.observe(parent, { attributes: true, attributeFilter: ['disabled'] });
    update();
    cleanups.push(() => { observer.disconnect(); disabledObserver.disconnect(); finish(); divider.remove(); primary.hidden = hidden[0]; secondary.hidden = hidden[1]; if (!originalId) primary.removeAttribute('id'); if (reset) reset.disabled = resetDisabled; for (const [node, name, value] of attributes) { if (value === null) node.removeAttribute(name); else node.setAttribute(name, value); } for (const [name, value] of [['--rf-panel-first', first], ['--rf-panel-second', second]]) { if (value) panels.style.setProperty(name, value); else panels.style.removeProperty(name); } });
  }
  for (const element of matches(root, '[data-rf-line-chart]')) {
    if (lineCharts.has(element)) continue;
    const own = selector => [...element.querySelectorAll(selector)].filter(node => node.closest('[data-rf-line-chart]') === element);
    const table = own('table')[0], plot = own('[data-rf-line-plot]')[0], range = own('[data-rf-line-range]')[0], output = own('[data-rf-line-readout]')[0], controls = own('[data-rf-line-controls]')[0];
    if (!table?.tBodies[0] || !plot || !range || !output || !controls) continue;
    const series = own('thead [data-rf-line-series]').map(heading => ({ name: heading.textContent.trim(), key: heading.dataset.rfLineSeries, index: heading.cellIndex, path: own('polyline[data-rf-line-series]').find(path => path.dataset.rfLineSeries === heading.dataset.rfLineSeries), check: own('[data-rf-line-toggle]').find(check => check.dataset.rfLineToggle === heading.dataset.rfLineSeries) }));
    if (!series.length || series.length > 8 || new Set(series.map(item => item.key)).size !== series.length || series.some(item => !item.path || !item.check || !item.name || !/^[a-z][a-z0-9-]{0,39}$/.test(item.key))) continue;
    const valid = rows => Array.isArray(rows) && rows.length <= 512 && rows.every(row => row && typeof row.label === 'string' && row.label.trim() && row.label.length <= 100 && row.values && typeof row.values === 'object' && !Array.isArray(row.values) && Object.keys(row.values).length === series.length && series.every(item => Object.hasOwn(row.values, item.key) && typeof row.values[item.key] === 'number' && Number.isFinite(row.values[item.key]) && Math.abs(row.values[item.key]) <= 1e12)) && new Set(rows.map(row => row.label.trim())).size === rows.length;
    let data = [...table.tBodies[0].rows].map(row => ({ label: row.cells[0]?.textContent.trim() || '', values: Object.fromEntries(series.map(item => { const value = row.cells[item.index]?.textContent.trim(); return [item.key, value ? Number(value) : NaN]; })) }));
    if (!valid(data)) continue;
    const start = own('[data-rf-line-start]')[0], end = own('[data-rf-line-end]')[0], follow = own('[data-rf-line-follow]')[0], reset = own('[data-rf-line-reset]')[0], windowText = own('[data-rf-line-window]')[0], status = own('[data-rf-line-status]')[0], empty = own('[data-rf-line-empty]')[0];
    if (Boolean(start) !== Boolean(end)) continue;
    const fields = [range, start, end].filter(Boolean).map(input => ({ input, min: input.min, max: input.max, disabled: input.disabled, text: input.getAttribute('aria-valuetext') })), displays = series.map(item => item.path.style.display), hidden = controls.hidden;
    let first = 0, last = Math.max(0, data.length - 1);
    const group = own('[data-rf-line-labels]')[0] || document.createElementNS('http://www.w3.org/2000/svg', 'g'); group.dataset.rfLineLabels = ''; if (!group.parentElement) { plot.querySelectorAll('text').forEach(node => node.remove()); plot.append(group); }
    const draw = () => {
      const count = data.length, maximumIndex = Math.max(0, count - 1), index = Math.max(first, Math.min(last, Math.round(range.valueAsNumber) || 0));
      const visible = data.slice(first, last + 1), values = visible.flatMap(row => series.map(item => row.values[item.key])), minimum = Math.min(0, ...values), maximum = Math.max(1, ...values);
      const x = position => visible.length < 2 ? 280 : 32 + position / (visible.length - 1) * 496, y = value => 200 - (value - minimum) / (maximum - minimum) * 180;
      series.forEach(item => { item.path.setAttribute('points', visible.map((row, position) => `${x(position)},${y(row.values[item.key])}`).join(' ')); item.path.style.display = item.check.checked ? '' : 'none'; });
      const cursor = own('[data-rf-line-cursor]')[0]; if (cursor) { cursor.setAttribute('x1', x(index - first)); cursor.setAttribute('x2', x(index - first)); }
      group.replaceChildren();
      for (const position of new Set(visible.length > 2 ? [0, Math.floor((visible.length - 1) / 2), visible.length - 1] : visible.map((_, index) => index))) {
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text'); label.setAttribute('x', x(position)); label.setAttribute('y', '228'); label.setAttribute('text-anchor', position === 0 ? 'start' : position === visible.length - 1 ? 'end' : 'middle'); label.textContent = visible[position].label; group.append(label);
      }
      plot.toggleAttribute('hidden', !count); if (empty) empty.hidden = count > 0;
      const shown = series.filter(item => item.check.checked), text = count ? `${data[index].label}: ${shown.length ? shown.map(item => `${item.name} ${data[index].values[item.key]}`).join('; ') : 'No series selected.'}` : 'No data to show.';
      output.textContent = text; range.min = String(first); range.max = String(last); range.value = String(index); range.disabled = fields[0].disabled || visible.length < 2; range.setAttribute('aria-valuetext', text);
      if (start && end) {
        start.min = '0'; start.max = String(last); start.value = String(first); end.min = String(first); end.max = String(maximumIndex); end.value = String(last); start.disabled = fields.find(field => field.input === start).disabled || count < 2; end.disabled = fields.find(field => field.input === end).disabled || count < 2;
        start.setAttribute('aria-valuetext', count ? `First point: ${data[first].label}` : 'No data'); end.setAttribute('aria-valuetext', count ? `Last point: ${data[last].label}` : 'No data');
      }
      if (windowText) windowText.textContent = count ? `Showing ${data[first].label} through ${data[last].label}: ${visible.length} of ${count} points. Linear scale ${minimum} to ${maximum}; includes zero.` : 'No data to show.';
    };
    const fullView = () => { first = 0; last = Math.max(0, data.length - 1); draw(); };
    const followView = (span = last - first, full = first === 0 && last === data.length - 1) => { last = Math.max(0, data.length - 1); first = full ? 0 : Math.max(0, last - span); range.min = String(first); range.max = String(last); range.value = String(last); };
    const updateData = (rows, append) => {
      if (!valid(rows)) { if (status) status.textContent = 'Chart data was not updated. Use unique labels and finite numeric values within the documented limits.'; return false; }
      if (append && !rows.length || !append && rows.length === data.length && rows.every((row, index) => row.label === data[index].label && series.every(item => row.values[item.key] === data[index].values[item.key]))) { if (status) status.textContent = ''; return true; }
      const combined = append ? [...data, ...rows] : rows, dropped = Math.max(0, combined.length - 512), next = combined.slice(dropped);
      if (new Set(combined.map(row => row.label.trim())).size !== combined.length) { if (status) status.textContent = 'Chart data was not updated. Point labels must be unique.'; return false; }
      const point = data[Number(range.value)]?.label, firstLabel = data[first]?.label, lastLabel = data[last]?.label, full = !data.length || first === 0 && last === data.length - 1, span = last - first, oldIndex = Number(range.value);
      data = next.map(row => ({ label: row.label.trim(), values: Object.fromEntries(series.map(item => [item.key, row.values[item.key]])) }));
      first = full || !data.length ? 0 : Math.max(0, data.findIndex(row => row.label === firstLabel)); last = full || !data.length ? Math.max(0, data.length - 1) : Math.max(first, data.findIndex(row => row.label === lastLabel));
      if (follow?.checked && data.length) followView(span, full);
      range.min = String(first); range.max = String(last); const selected = data.findIndex(row => row.label === point); range.value = String(follow?.checked ? last : selected < 0 ? Math.max(first, Math.min(last, oldIndex - (append ? dropped : 0))) : selected);
      table.tBodies[0].replaceChildren(...data.map(row => { const tr = document.createElement('tr'), th = document.createElement('th'); th.scope = 'row'; th.textContent = row.label; tr.append(th); for (const item of series) { const td = document.createElement('td'); td.textContent = String(row.values[item.key]); tr.append(td); } return tr; }));
      if (start && end) { start.defaultValue = '0'; end.defaultValue = String(Math.max(0, data.length - 1)); }
      draw(); if (status) status.textContent = '';
      element.dispatchEvent(new CustomEvent('rf:chart-change', { bubbles: true, detail: { source: append ? 'append' : 'replace', count: data.length, dropped } })); return true;
    };
    lineCharts.set(element, updateData); controls.hidden = false;
    listen(range, 'input', () => { if (!range.matches(':disabled')) draw(); }); series.forEach(item => listen(item.check, 'change', draw));
    for (const input of [start, end].filter(Boolean)) listen(input, 'input', () => { if (input.matches(':disabled')) return; first = Number(start.value); last = Number(end.value); draw(); });
    if (follow) listen(follow, 'change', () => { if (follow.checked && !follow.matches(':disabled')) { followView(); draw(); } });
    if (reset) listen(reset, 'click', fullView);
    for (const input of [range, start, end, ...series.map(item => item.check)].filter(Boolean)) listen(input, 'change', () => element.dispatchEvent(new CustomEvent('rf:chart-view', { bubbles: true, detail: { from: first, to: last, selected: Number(range.value), series: series.filter(item => item.check.checked).map(item => item.key) } })));
    afterReset(element.closest('form'), fullView); draw();
    // ponytail: at most 512 points and eight fixed series; aggregate larger feeds before calling updateLineChart.
    cleanups.push(() => { lineCharts.delete(element); fullView(); series.forEach((item, index) => item.path.style.display = displays[index]); controls.hidden = hidden; for (const field of fields) { field.input.min = field.min; field.input.max = field.max; field.input.disabled = field.disabled; if (field.text === null) field.input.removeAttribute('aria-valuetext'); else field.input.setAttribute('aria-valuetext', field.text); } });
  }

  for (const element of matches(root, '[data-rf-password]')) {
    const input = element.querySelector('input');
    const button = element.querySelector('[data-rf-password-toggle]');
    if (!input || !button) continue;
    const hide = () => { input.type = 'password'; button.setAttribute('aria-pressed', 'false'); };
    button.hidden = false;
    listen(button, 'click', () => {
      const reveal = input.type === 'password';
      input.type = reveal ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(reveal));
    });
    afterReset(input.form, hide);
    cleanups.push(() => { hide(); button.hidden = true; });
  }
  for (const element of matches(root, '[data-rf-counter]')) {
    const input = element.querySelector('textarea, input');
    const count = element.querySelector('[data-rf-count]');
    if (!input || !count) continue;
    const update = () => { count.textContent = `${input.value.length}${input.maxLength >= 0 ? ` / ${input.maxLength}` : ''} characters`; };
    listen(input, 'input', update); afterReset(input.form, update); update();
  }
  for (const element of matches(root, '[data-rf-tags]')) {
    const input = element.querySelector('[data-rf-tag-input]');
    const add = element.querySelector('[data-rf-tag-add]');
    const list = element.querySelector('[data-rf-tag-list]');
    const status = element.querySelector('[role="status"]');
    if (!input || !add || !list || !status) continue;
    const limit = Math.max(1, parseInt(element.dataset.rfTagsMax, 10) || 8);
    const original = [...list.querySelectorAll('input[type="hidden"]')].map(node => node.value);
    let values = [...original];
    const render = () => {
      list.replaceChildren(...values.map(value => {
        const item = document.createElement('li'); item.className = 'rf-tag';
        const label = document.createElement('span'); label.textContent = value;
        const hidden = document.createElement('input'); hidden.type = 'hidden'; hidden.name = element.dataset.rfTagsName || 'tags'; hidden.value = value;
        const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = '×'; remove.dataset.rfTagRemove = value; remove.setAttribute('aria-label', `Remove ${value}`);
        item.append(label, hidden, remove); return item;
      }));
    };
    const addTag = () => {
      if (input.disabled || input.readOnly) return;
      const value = input.value.trim();
      if (!value) { input.focus(); return; }
      if (!input.reportValidity()) return;
      if (values.some(item => item.toLocaleLowerCase() === value.toLocaleLowerCase())) { status.textContent = 'That tag is already included.'; return; }
      if (values.length >= limit) { status.textContent = `Choose up to ${limit} tags. Remove one to add another.`; return; }
      values.push(value); render(); input.value = ''; input.focus(); status.textContent = `Added ${value}. ${values.length} of ${limit} tags.`;
      element.dispatchEvent(new CustomEvent('rf:tags-change', { bubbles: true, detail: { values: [...values] } }));
    };
    listen(add, 'click', addTag);
    listen(input, 'keydown', event => { if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); addTag(); } });
    listen(list, 'click', event => {
      const remove = event.target.closest('[data-rf-tag-remove]');
      if (!remove || input.disabled || input.readOnly) return;
      values = values.filter(value => value !== remove.dataset.rfTagRemove); render(); input.focus(); status.textContent = `Removed ${remove.dataset.rfTagRemove}. ${values.length} of ${limit} tags.`;
      element.dispatchEvent(new CustomEvent('rf:tags-change', { bubbles: true, detail: { values: [...values] } }));
    });
    afterReset(input.form, () => { values = [...original]; render(); status.textContent = ''; });
    render();
  }
  for (const element of matches(root, '[data-rf-data-table]')) {
    const table = element.querySelector('table');
    const search = element.querySelector('[data-rf-table-search]');
    const status = element.querySelector('[data-rf-table-status]');
    const body = table?.tBodies[0];
    if (!body) continue;
    let rows = [...body.rows];
    const originalRows = [...rows];
    const filters = [...element.querySelectorAll('[data-rf-table-filter]')];
    const size = element.querySelector('[data-rf-table-page-size]');
    const previous = element.querySelector('[data-rf-table-previous]');
    const next = element.querySelector('[data-rf-table-next]');
    const selectAll = table.querySelector('[data-rf-table-select-all]');
    const selectedStatus = element.querySelector('[data-rf-table-selected]');
    const actions = [...element.querySelectorAll('[data-rf-table-action]')];
    const selection = () => rows.filter(row => row.querySelector('[data-rf-table-select]')?.checked);
    const selectable = () => rows.filter(row => !row.hidden && row.querySelector('[data-rf-table-select]:not(:disabled)'));
    const updateSelection = (emit = false) => {
      const selected = selection(), visible = selectable();
      const checked = visible.filter(row => row.querySelector('[data-rf-table-select]').checked).length;
      if (selectAll) { selectAll.checked = visible.length > 0 && checked === visible.length; selectAll.indeterminate = checked > 0 && checked < visible.length; selectAll.disabled = !visible.length; }
      if (selectedStatus) selectedStatus.textContent = `${selected.length} selected across all pages`;
      for (const button of actions) button.disabled = !selected.length;
      if (emit) element.dispatchEvent(new CustomEvent('rf:table-selection', { bubbles: true, detail: { values: selected.map(row => row.querySelector('[data-rf-table-select]').value) } }));
    };
    let page = 0;
    const update = () => {
      const query = search?.value.trim().toLocaleLowerCase() || '';
      const filtered = rows.filter(row => row.textContent.toLocaleLowerCase().includes(query) && filters.every(filter => !filter.value || row.getAttribute(`data-rf-${filter.dataset.rfTableFilter}`) === filter.value));
      const pageSize = size ? Math.max(1, parseInt(size.value, 10) || rows.length || 1) : rows.length || 1;
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
      page = Math.min(page, pages - 1);
      const visible = new Set(filtered.slice(page * pageSize, (page + 1) * pageSize));
      for (const row of rows) row.hidden = !visible.has(row);
      if (previous) previous.disabled = page === 0;
      if (next) next.disabled = page === pages - 1;
      if (status) status.textContent = size ? `${filtered.length ? page * pageSize + 1 : 0}–${Math.min((page + 1) * pageSize, filtered.length)} of ${filtered.length} rows. Page ${page + 1} of ${pages}.` : `${filtered.length} of ${rows.length} rows`;
      const empty = element.querySelector('[data-rf-table-empty]');
      if (empty) empty.hidden = filtered.length > 0;
      updateSelection();
      element.dispatchEvent(new CustomEvent('rf:table-view', { bubbles: true, detail: { values: filtered.map(row => row.querySelector('[data-rf-table-select]')?.value).filter(Boolean), total: filtered.length, page, pageSize } }));
    };
    const resetPage = () => { page = 0; update(); };
    if (search) listen(search, 'input', resetPage);
    for (const filter of filters) listen(filter, 'change', resetPage);
    if (size) listen(size, 'change', resetPage);
    if (previous) listen(previous, 'click', () => { page = Math.max(0, page - 1); update(); });
    if (next) listen(next, 'click', () => { page++; update(); });
    for (const form of new Set([search, size, ...filters, ...table.querySelectorAll('[data-rf-table-select]')].map(input => input?.form).filter(Boolean))) afterReset(form, resetPage);
    if (selectAll) listen(selectAll, 'change', () => { for (const row of selectable()) row.querySelector('[data-rf-table-select]').checked = selectAll.checked; updateSelection(true); });
    for (const input of table.querySelectorAll('[data-rf-table-select]')) listen(input, 'change', () => updateSelection(true));
    for (const button of actions) listen(button, 'click', () => {
      element.dispatchEvent(new CustomEvent('rf:table-action', { bubbles: true, detail: { action: button.dataset.rfTableAction, values: selection().map(row => row.querySelector('[data-rf-table-select]').value) } }));
    });
    for (const button of table.querySelectorAll('[data-rf-sort]')) listen(button, 'click', () => {
      const heading = button.closest('th');
      const descending = heading.getAttribute('aria-sort') === 'ascending';
      for (const other of table.querySelectorAll('th[aria-sort]')) other.removeAttribute('aria-sort');
      for (const icon of table.querySelectorAll('[data-rf-sort-icon]')) icon.textContent = '↕';
      heading.setAttribute('aria-sort', descending ? 'descending' : 'ascending');
      const icon = button.querySelector('[data-rf-sort-icon]');
      if (icon) icon.textContent = descending ? '↓' : '↑';
      const value = row => { const cell = row.cells[heading.cellIndex]; return cell?.dataset.rfSortValue || cell?.textContent.trim() || ''; };
      // ponytail: static in-memory rows only; use server queries/virtualization for large datasets.
      rows.sort((a, b) => (button.dataset.rfSort === 'number' ? Number(value(a)) - Number(value(b)) : value(a).localeCompare(value(b), undefined, { numeric: true, sensitivity: 'base' })) * (descending ? -1 : 1));
      body.append(...rows); resetPage();
      if (status) status.textContent += `${status.textContent.endsWith('.') ? ' ' : '. '}Sorted by ${button.textContent.replace(/[↕↑↓]/g, '').trim()}, ${descending ? 'descending' : 'ascending'}.`;
    });
    update(); cleanups.push(() => {
      originalRows.forEach(row => { row.hidden = false; }); body.append(...originalRows);
      table.querySelectorAll('th[aria-sort]').forEach(heading => heading.removeAttribute('aria-sort'));
      table.querySelectorAll('[data-rf-sort-icon]').forEach(icon => { icon.textContent = '↕'; });
      if (selectAll) selectAll.indeterminate = false;
    });
  }
  for (const element of matches(root, '[data-rf-date-range]')) {
    const start = element.querySelector('[data-rf-date-start]'), end = element.querySelector('[data-rf-date-end]');
    if (!start || !end) continue;
    const minimum = end.getAttribute('min');
    const update = () => { const min = [minimum, start.value].filter(Boolean).sort().at(-1); if (min) end.min = min; else end.removeAttribute('min'); };
    listen(start, 'input', update); listen(start, 'change', update); afterReset(start.form, update); update();
    cleanups.push(() => { if (minimum !== null) end.min = minimum; else end.removeAttribute('min'); });
  }
  for (const element of matches(root, '[data-rf-notifications]')) {
    const button = element.querySelector('[data-rf-notifications-read]');
    if (!button) continue;
    const update = () => {
      const unread = element.querySelectorAll('[data-rf-unread]');
      for (const count of element.querySelectorAll('[data-rf-notifications-count]')) count.textContent = String(unread.length);
      button.disabled = !unread.length;
    };
    listen(button, 'click', () => {
      const items = [...element.querySelectorAll('[data-rf-unread]')];
      items.forEach(item => { item.removeAttribute('data-rf-unread'); item.querySelector('[data-rf-notification-state]')?.remove(); });
      update(); const status = element.querySelector('[role="status"]'); if (status) status.textContent = 'All notifications marked as read.';
      element.dispatchEvent(new CustomEvent('rf:notifications-read', { bubbles: true, detail: { values: items.map(item => item.dataset.rfNotificationId) } }));
    });
    update();
  }
  for (const element of matches(root, '[data-rf-check-progress]')) {
    const checks = [...element.querySelectorAll('input[type="checkbox"]')];
    const progress = element.querySelector('progress');
    const status = element.querySelector('[data-rf-check-status]');
    if (!progress || !status) continue;
    const update = () => {
      const count = checks.filter(input => input.checked).length;
      progress.max = checks.length || 1; progress.value = count;
      status.textContent = count === checks.length ? 'All set. Your next chapter starts here.' : `${count} of ${checks.length} steps complete`;
    };
    for (const input of checks) listen(input, 'change', update);
    afterReset(checks[0]?.form, update); update();
  }
  for (const element of matches(root, '[data-rf-billing]')) {
    const update = () => {
      const yearly = element.querySelector('input[value="yearly"]')?.checked;
      for (const price of element.querySelectorAll('[data-rf-monthly][data-rf-yearly]')) price.textContent = yearly ? price.dataset.rfYearly : price.dataset.rfMonthly;
      for (const note of element.querySelectorAll('[data-rf-billing-note]')) note.textContent = yearly ? 'per month, billed yearly' : 'per month, billed monthly';
    };
    for (const input of element.querySelectorAll('input[type="radio"]')) listen(input, 'change', update);
    afterReset(element.closest('form'), update); update();
  }

  for (const element of matches(root, '[data-rf-compare]')) {
    const range = element.querySelector('input[type="range"]');
    const canvas = element.querySelector('.rf-compare');
    if (!range || !canvas) continue;
    const update = () => {
      const min = Number(range.min || 0), max = Number(range.max || 100);
      canvas.style.setProperty('--rf-compare', `${max > min ? (range.valueAsNumber - min) / (max - min) * 100 : 50}%`);
    };
    listen(range, 'input', update); update();
    cleanups.push(() => canvas.style.removeProperty('--rf-compare'));
  }
  for (const element of matches(root, '[data-rf-carousel]')) {
    const track = element.querySelector('.rf-carousel__track');
    if (!track) continue;
    for (const button of element.querySelectorAll('[data-rf-carousel-move]')) listen(button, 'click', () => {
      const direction = getComputedStyle(track).direction === 'rtl' ? -1 : 1;
      const distance = (track.firstElementChild?.getBoundingClientRect().width || track.clientWidth) + (parseFloat(getComputedStyle(track).gap) || 0);
      track.scrollBy({ left: distance * Number(button.dataset.rfCarouselMove) * direction, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }
  for (const button of matches(root, '[data-rf-like]')) {
    const count = button.querySelector('[data-rf-like-count]');
    listen(button, 'click', () => {
      const pressed = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(pressed));
      if (count) count.textContent = String(Number(count.textContent) + (pressed ? 1 : -1));
    });
  }
  for (const element of matches(root, '[data-rf-stepper]')) {
    const input = element.querySelector('input[type="number"]');
    if (!input) continue;
    for (const button of element.querySelectorAll('[data-rf-stepper-move]')) listen(button, 'click', () => {
      if (input.disabled || input.readOnly) return;
      if (button.dataset.rfStepperMove === '-1') input.stepDown(); else input.stepUp();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  for (const dialog of matches(root, '[data-rf-command]')) {
    const search = dialog.querySelector('input[type="search"]');
    const items = [...dialog.querySelectorAll('[data-rf-command-item]')];
    const status = dialog.querySelector('[role="status"]');
    if (!search) continue;
    const filter = () => {
      const query = search.value.trim().toLocaleLowerCase();
      for (const item of items) item.hidden = !item.textContent.toLocaleLowerCase().includes(query);
      if (status) status.textContent = `${items.filter(item => !item.hidden).length} commands available`;
    };
    listen(search, 'input', filter);
    listen(dialog, 'keydown', event => {
      const visible = items.filter(item => !item.hidden && !item.disabled);
      const index = visible.indexOf(document.activeElement);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const next = index < 0 ? (event.key === 'ArrowDown' ? 0 : visible.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length;
        visible[next]?.focus();
      }
    });
    for (const item of items) listen(item, 'click', () => {
      dialog.dispatchEvent(new CustomEvent('rf:command', { bubbles: true, detail: { value: item.dataset.rfCommandItem } }));
      dialog.close();
    });
    listen(dialog, 'close', () => { search.value = ''; filter(); });
    filter(); cleanups.push(() => items.forEach(item => { item.hidden = false; }));
  }
  for (const form of matches(root, '[data-rf-step-form]')) {
    const steps = [...form.querySelectorAll('[data-rf-step]')];
    const next = form.querySelector('[data-rf-step-next]');
    const previous = form.querySelector('[data-rf-step-previous]');
    const submit = form.querySelector('[data-rf-step-submit]');
    const status = form.querySelector('[role="status"]');
    if (!steps.length || !next || !previous || !submit) continue;
    let index = 0;
    const update = (focus = false) => {
      steps.forEach((step, i) => { step.hidden = i !== index; });
      previous.hidden = index === 0; next.hidden = index === steps.length - 1; submit.hidden = index !== steps.length - 1;
      if (status) status.textContent = `Step ${index + 1} of ${steps.length}`;
      if (focus) steps[index].querySelector('input, select, textarea, button')?.focus();
    };
    const valid = step => [...step.querySelectorAll('input, select, textarea')].every(input => input.reportValidity());
    listen(next, 'click', () => { if (valid(steps[index])) { index = Math.min(index + 1, steps.length - 1); update(true); } });
    listen(previous, 'click', () => { index = Math.max(index - 1, 0); update(true); });
    afterReset(form, () => { index = 0; update(); });
    // Validate hidden steps explicitly so the browser can focus the invalid field.
    listen(form, 'submit', event => {
      for (let i = 0; i < steps.length; i++) {
        const invalid = [...steps[i].querySelectorAll('input, select, textarea')].find(input => !input.checkValidity());
        if (invalid) { event.preventDefault(); index = i; update(); invalid.reportValidity(); return; }
      }
    });
    const originalNoValidate = form.noValidate;
    form.noValidate = true; update();
    cleanups.push(() => { form.noValidate = originalNoValidate; steps.forEach(step => { step.hidden = false; }); next.hidden = previous.hidden = true; submit.hidden = false; });
  }
  for (const button of matches(root, '[data-rf-copy]')) listen(button, 'click', async () => {
    const status = button.parentElement.querySelector('[role="status"]');
    try {
      await navigator.clipboard.writeText(button.dataset.rfCopy);
      if (!signal.aborted && status) status.textContent = 'Copied to clipboard.';
    } catch { if (!signal.aborted && status) status.textContent = 'Copy unavailable. Select the visible text and copy it manually.'; }
  });
  return () => { controller.abort(); cleanups.forEach(cleanup => cleanup()); };
}
