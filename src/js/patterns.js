import { matches, onFormReset, uid } from './utils.js';

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
    const table = element.querySelector('table'), plot = element.querySelector('[data-rf-line-plot]'), range = element.querySelector('[data-rf-line-range]'), output = element.querySelector('[data-rf-line-readout]'), controls = element.querySelector('[data-rf-line-controls]');
    if (!table?.tBodies[0] || !plot || !range || !output || !controls) continue;
    const rows = [...table.tBodies[0].rows], headings = [...table.querySelectorAll('thead [data-rf-line-series]')];
    const series = headings.map(heading => ({ name: heading.textContent.trim(), key: heading.dataset.rfLineSeries, values: rows.map(row => row.cells[heading.cellIndex]?.textContent.trim()), path: [...plot.querySelectorAll('[data-rf-line-series]')].find(path => path.dataset.rfLineSeries === heading.dataset.rfLineSeries), check: [...controls.querySelectorAll('[data-rf-line-toggle]')].find(check => check.dataset.rfLineToggle === heading.dataset.rfLineSeries) }));
    if (!rows.length || !series.length || series.some(item => !item.path || !item.check || item.values.some(value => !value || !Number.isFinite(Number(value))))) continue;
    const labels = rows.map(row => row.cells[0].textContent.trim()), values = series.flatMap(item => item.values.map(Number)), minimum = Math.min(0, ...values), maximum = Math.max(1, ...values);
    const x = index => rows.length === 1 ? 280 : 32 + index / (rows.length - 1) * 496;
    const y = value => 200 - (Number(value) - minimum) / (maximum - minimum) * 180;
    const original = { min: range.min, max: range.max, disabled: range.disabled, hidden: controls.hidden, valueText: range.getAttribute('aria-valuetext') };
    const paths = series.map(item => ({ points: item.path.getAttribute('points'), display: item.path.style.display }));
    series.forEach(item => item.path.setAttribute('points', item.values.map((value, index) => `${x(index)},${y(value)}`).join(' ')));
    const update = () => {
      const index = Math.max(0, Math.min(rows.length - 1, Math.round(range.valueAsNumber)));
      const visible = series.filter(item => item.check.checked);
      series.forEach(item => { item.path.style.display = item.check.checked ? '' : 'none'; });
      const cursor = plot.querySelector('[data-rf-line-cursor]'); if (cursor) { cursor.setAttribute('x1', x(index)); cursor.setAttribute('x2', x(index)); }
      const text = `${labels[index]}: ${visible.length ? visible.map(item => `${item.name} ${item.values[index]}`).join('; ') : 'No series selected.'}`;
      output.textContent = text; range.setAttribute('aria-valuetext', text);
    };
    range.min = '0'; range.max = String(rows.length - 1); range.disabled = original.disabled || rows.length < 2; controls.hidden = false;
    listen(range, 'input', update); series.forEach(item => listen(item.check, 'change', update)); afterReset(element.closest('form'), update); update();
    cleanups.push(() => { series.forEach((item, index) => { if (paths[index].points === null) item.path.removeAttribute('points'); else item.path.setAttribute('points', paths[index].points); item.path.style.display = paths[index].display; }); range.min = original.min; range.max = original.max; range.disabled = original.disabled; controls.hidden = original.hidden; if (original.valueText === null) range.removeAttribute('aria-valuetext'); else range.setAttribute('aria-valuetext', original.valueText); });
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
