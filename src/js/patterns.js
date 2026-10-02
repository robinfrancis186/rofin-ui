import { matches } from './utils.js';

/** Optional patterns; initialize each root once and tear down before removing it. */
export function initPatterns(root = document) {
  const controller = new AbortController();
  const { signal } = controller;
  const cleanups = [];
  const listen = (node, type, handler) => node.addEventListener(type, handler, { signal });
  const afterReset = (form, update) => {
    if (!form) return;
    let timer;
    listen(form, 'reset', event => {
      clearTimeout(timer);
      timer = setTimeout(() => { if (!signal.aborted && !event.defaultPrevented) update(); }, 0);
    });
    cleanups.push(() => clearTimeout(timer));
  };

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
