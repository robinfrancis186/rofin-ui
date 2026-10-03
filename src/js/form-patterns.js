import { matches, uid, onFormReset } from './utils.js';

/** Optional form workflows. Initialize each root once; destroy before structural changes. */
export function initFormPatterns(root = document) {
  const controller = new AbortController(), { signal } = controller, cleanups = [];
  const listen = (node, type, handler, options = {}) => node.addEventListener(type, handler, { ...options, signal });
  const reset = (form, update) => cleanups.push(onFormReset(form, update, signal));
  const emit = (node, name, detail) => node.dispatchEvent(new CustomEvent(`rf:${name}`, { bubbles: true, detail }));

  for (const field of matches(root, '[data-rf-combobox]')) {
    const select = field.querySelector('select'), label = field.querySelector('label');
    if (!select || !label) continue;
    const options = [...select.options].filter(option => option.value), original = { hidden: select.hidden, required: select.required, label: label.htmlFor };
    const input = document.createElement('input'); input.type = 'text'; input.className = 'rf-input'; input.id = uid('rf-combobox'); input.autocomplete = 'off';
    input.placeholder = field.dataset.rfPlaceholder || 'Search and choose…'; input.required = original.required; input.disabled = select.disabled;
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
    if (select.hasAttribute('aria-describedby')) input.setAttribute('aria-describedby', select.getAttribute('aria-describedby'));
    const popup = document.createElement('div'); popup.className = 'rf-combobox__popup'; popup.hidden = true;
    const list = document.createElement('div'); list.id = uid('rf-options'); list.setAttribute('role', 'listbox'); list.setAttribute('aria-label', label.textContent.trim());
    input.setAttribute('aria-controls', list.id);
    const status = document.createElement('p'); status.className = 'rf-help'; status.setAttribute('role', 'status');
    const nodes = options.map(option => {
      const node = document.createElement('div'); node.id = uid('rf-option'); node.className = 'rf-combobox__option'; node.setAttribute('role', 'option'); node.textContent = option.label;
      node.setAttribute('aria-disabled', String(option.disabled || option.parentElement.disabled === true)); list.append(node); return node;
    });
    const shell = document.createElement('div'); shell.className = 'rf-combobox'; shell.append(input, popup); popup.append(list, status);
    select.hidden = true; select.required = false; label.htmlFor = input.id; select.after(shell);
    let active = -1, committed = select.value;
    const enabled = index => nodes[index].getAttribute('aria-disabled') !== 'true';
    const close = () => { popup.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
    const validate = () => { const match = options.find(option => option.label === input.value && !option.disabled && !option.parentElement.disabled); input.setCustomValidity(input.value && !match ? 'Choose an available option from the list.' : ''); };
    const restore = () => { committed = select.value; input.value = options.find(option => option.value === select.value)?.label || ''; validate(); close(); nodes.forEach((node, i) => node.setAttribute('aria-selected', String(options[i].value === select.value))); };
    const highlight = index => {
      active = index; nodes.forEach((node, i) => { node.dataset.active = String(i === index); node.setAttribute('aria-selected', String(options[i].value === select.value)); });
      if (index >= 0) { input.setAttribute('aria-activedescendant', nodes[index].id); nodes[index].scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
    };
    const filter = () => {
      const query = input.value.trim().toLocaleLowerCase(); nodes.forEach((node, index) => { node.hidden = !options[index].label.toLocaleLowerCase().includes(query); });
      popup.hidden = false; input.setAttribute('aria-expanded', 'true'); highlight(-1);
      status.textContent = `${nodes.filter((node, index) => !node.hidden && enabled(index)).length} options available`;
    };
    const pick = index => {
      if (index < 0 || !enabled(index) || input.matches(':disabled')) return;
      const previous = committed; select.value = options[index].value; restore(); input.focus();
      if (previous !== select.value) { select.dispatchEvent(new Event('input', { bubbles: true })); select.dispatchEvent(new Event('change', { bubbles: true })); emit(field, 'combobox-change', { value: select.value, label: input.value }); }
    };
    listen(input, 'input', () => { select.value = options.find((option, index) => option.label === input.value && enabled(index))?.value || ''; validate(); filter(); });
    listen(input, 'keydown', event => {
      if (event.isComposing || input.matches(':disabled')) return;
      if (event.key === 'Escape') { event.preventDefault(); select.value = committed; restore(); return; }
      if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
        event.preventDefault(); if (popup.hidden) { input.value = ''; filter(); }
        const visible = nodes.map((node, index) => !node.hidden && enabled(index) ? index : -1).filter(index => index >= 0);
        const position = visible.indexOf(active), next = position < 0 ? (event.key === 'ArrowDown' ? 0 : visible.length - 1) : (position + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length;
        highlight(visible[next] ?? -1);
      } else if (!popup.hidden && ['Home', 'End'].includes(event.key)) {
        event.preventDefault(); const visible = nodes.map((node, index) => !node.hidden && enabled(index) ? index : -1).filter(index => index >= 0); highlight(visible[event.key === 'Home' ? 0 : visible.length - 1] ?? -1);
      } else if (event.key === 'Enter' && !popup.hidden) { event.preventDefault(); if (active >= 0) pick(active); else input.reportValidity(); }
    });
    listen(popup, 'mousedown', event => event.preventDefault());
    nodes.forEach((node, index) => listen(node, 'click', () => pick(index)));
    listen(input, 'blur', () => {
      if (popup.hidden) return;
      close(); validate();
      if (!input.checkValidity()) { select.value = ''; return; }
      if (committed !== select.value) { committed = select.value; select.dispatchEvent(new Event('change', { bubbles: true })); emit(field, 'combobox-change', { value: select.value, label: input.value }); }
    });
    listen(select, 'change', () => { if (document.activeElement !== input) restore(); });
    const observer = new MutationObserver(() => { input.disabled = select.disabled; if (input.disabled) close(); }); observer.observe(select, { attributes: true, attributeFilter: ['disabled'] });
    reset(select.form, restore); restore();
    cleanups.push(() => { observer.disconnect(); shell.remove(); select.hidden = original.hidden; select.required = original.required; label.htmlFor = original.label; });
  }

  for (const field of matches(root, '[data-rf-multiselect]')) {
    const select = field.querySelector('select[multiple]');
    if (!select) continue;
    const nativeLabel = select.labels?.[0], anchor = select.closest('label') || select;
    const original = { hidden: select.hidden, required: select.required, labelHidden: nativeLabel?.hidden }, options = [...select.options];
    const shell = document.createElement('div'); shell.className = 'rf-stack';
    const searchLabel = document.createElement('label'); searchLabel.className = 'rf-field'; const text = document.createElement('span'); text.className = 'rf-label'; text.textContent = 'Search choices';
    const search = document.createElement('input'); search.type = 'search'; search.className = 'rf-input'; searchLabel.append(text, search);
    const list = document.createElement('div'); list.className = 'rf-multiselect__choices'; list.setAttribute('role', 'group'); list.setAttribute('aria-label', field.dataset.rfMultiselectLabel || 'Available choices');
    const tags = document.createElement('ul'); tags.className = 'rf-selection-tags'; tags.setAttribute('aria-label', 'Selected choices');
    const status = document.createElement('p'); status.className = 'rf-help'; status.setAttribute('role', 'status');
    const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'rf-button rf-button--outline'; clear.textContent = 'Clear selection';
    const checks = options.map(option => {
      const label = document.createElement('label'); label.className = 'rf-check'; const check = document.createElement('input'); check.type = 'checkbox'; check.value = option.value;
      const span = document.createElement('span'); span.textContent = option.label; label.append(check, span); list.append(label); return check;
    });
    // Insert outside a wrapping label: the search and checkbox labels must remain independent.
    shell.append(searchLabel, tags, list, status, clear); anchor.after(shell); select.hidden = true; select.required = false; if (nativeLabel) nativeLabel.hidden = true;
    const update = () => {
      checks.forEach((check, index) => { check.checked = options[index].selected; check.disabled = select.disabled || options[index].disabled || options[index].parentElement.disabled === true; });
      search.disabled = select.disabled; const chosen = options.filter(option => option.selected); clear.disabled = select.disabled || !chosen.length;
      tags.replaceChildren(...chosen.map(option => {
        const item = document.createElement('li'), span = document.createElement('span'), button = document.createElement('button'); span.textContent = option.label;
        button.type = 'button'; button.className = 'rf-button rf-button--ghost rf-button--small'; button.textContent = '×'; button.setAttribute('aria-label', `Remove ${option.label}`); button.disabled = select.disabled || option.disabled || option.parentElement.disabled === true;
        // Delegation keeps removed tags from retaining listeners during repeated updates.
        button.dataset.rfRemoveChoice = String(options.indexOf(option)); item.append(span, button); return item;
      }));
      const query = search.value.trim().toLocaleLowerCase(); checks.forEach((check, index) => { check.parentElement.hidden = !options[index].label.toLocaleLowerCase().includes(query); });
      status.textContent = `${chosen.length} selected. ${checks.filter(check => !check.parentElement.hidden).length} choices shown.`;
      search.setCustomValidity(original.required && !chosen.length ? 'Choose at least one option.' : '');
    };
    const changed = () => { update(); select.dispatchEvent(new Event('input', { bubbles: true })); select.dispatchEvent(new Event('change', { bubbles: true })); emit(field, 'multiselect-change', { values: options.filter(option => option.selected).map(option => option.value) }); };
    checks.forEach((check, index) => listen(check, 'change', () => { options[index].selected = check.checked; changed(); }));
    listen(tags, 'click', event => { const button = event.target.closest('[data-rf-remove-choice]'); if (!button || button.disabled) return; options[Number(button.dataset.rfRemoveChoice)].selected = false; changed(); search.focus(); });
    listen(clear, 'click', () => { options.forEach((option, index) => { if (!checks[index].disabled) option.selected = false; }); changed(); search.focus(); });
    listen(search, 'input', update); listen(select, 'change', update);
    const observer = new MutationObserver(update); observer.observe(select, { attributes: true, attributeFilter: ['disabled'] }); reset(select.form, () => { search.value = ''; update(); }); update();
    cleanups.push(() => { observer.disconnect(); shell.remove(); select.hidden = original.hidden; select.required = original.required; if (nativeLabel) nativeLabel.hidden = original.labelHidden; });
  }

  for (const form of matches(root, 'form[data-rf-validation]')) {
    const summary = form.querySelector('[data-rf-errors]'), list = summary?.querySelector('ul');
    if (!summary || !list) continue;
    const originalNoValidate = form.noValidate, saved = new Map(); form.noValidate = true;
    const controls = () => [...form.elements].filter(input => input.willValidate && typeof input.checkValidity === 'function');
    const clear = () => { for (const [input, original] of saved) { input.removeAttribute('aria-invalid'); if (original.invalid !== null) input.setAttribute('aria-invalid', original.invalid); if (original.description !== null) input.setAttribute('aria-describedby', original.description); else input.removeAttribute('aria-describedby'); original.error.remove(); } saved.clear(); list.replaceChildren(); summary.hidden = true; };
    const show = focus => {
      clear(); const invalid = controls().filter(input => !input.checkValidity());
      for (const input of invalid) {
        if (!input.id) input.id = uid('rf-field');
        const label = input.labels?.[0]?.textContent.trim() || input.getAttribute('aria-label') || input.name || 'Field';
        const error = document.createElement('p'); error.className = 'rf-error'; error.id = uid('rf-error'); error.textContent = input.validationMessage;
        saved.set(input, { invalid: input.getAttribute('aria-invalid'), description: input.getAttribute('aria-describedby'), error }); input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', [input.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
        // Keep help/error text outside wrapping labels so it does not change the control's name.
        (input.closest('label') || input).after(error);
        const item = document.createElement('li'), link = document.createElement('a'); link.href = `#${input.id}`; link.textContent = `${label}: ${input.validationMessage}`; item.append(link); list.append(item);
      }
      summary.hidden = !invalid.length; if (focus && invalid.length) summary.focus(); return !invalid.length;
    };
    listen(form, 'submit', event => { if (event.submitter?.formNoValidate) return; if (!show(true)) event.preventDefault(); });
    listen(form, 'input', () => { if (!summary.hidden) show(false); }); listen(form, 'change', () => { if (!summary.hidden) show(false); });
    listen(summary, 'click', event => { const link = event.target.closest('a'); if (!link) return; event.preventDefault(); form.querySelectorAll('[id]').forEach(input => { if (`#${input.id}` === link.getAttribute('href')) input.focus(); }); });
    reset(form, clear); cleanups.push(() => { clear(); form.noValidate = originalNoValidate; });
  }

  for (const element of matches(root, '[data-rf-date-presets]')) {
    const start = element.querySelector('[data-rf-date-start]'), end = element.querySelector('[data-rf-date-end]'), status = element.querySelector('[role="status"]');
    if (!start || !end) continue;
    const originalStatus = status?.textContent;
    const day = date => `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    for (const button of element.querySelectorAll('[data-rf-date-preset]')) listen(button, 'click', () => {
      const now = element.dataset.rfToday ? new Date(`${element.dataset.rfToday}T12:00:00`) : new Date();
      if (!Number.isFinite(now.getTime())) return;
      const first = new Date(now), last = new Date(now); const preset = button.dataset.rfDatePreset;
      if (preset === 'week') first.setDate(first.getDate() - 6);
      else if (preset === 'month') first.setDate(1);
      else if (preset === 'previous-month') { first.setMonth(first.getMonth() - 1, 1); last.setDate(0); }
      else if (preset !== 'today') return;
      const previous = [start.value, end.value];
      start.value = day(first); end.value = day(last); start.dispatchEvent(new Event('input', { bubbles: true }));
      if (!start.checkValidity() || !end.checkValidity()) {
        start.value = previous[0]; end.value = previous[1]; start.dispatchEvent(new Event('input', { bubbles: true }));
        if (status) status.textContent = 'This shortcut is outside the available dates. Choose dates within the allowed range.';
        return;
      }
      end.dispatchEvent(new Event('input', { bubbles: true }));
      if (status) status.textContent = `${button.textContent.trim()}: ${start.value} through ${end.value}, inclusive.`;
      emit(element, 'date-range-change', { start: start.value, end: end.value });
    });
    reset(start.form, () => { if (status) status.textContent = originalStatus; });
  }

  for (const element of matches(root, '[data-rf-calendar]')) {
    const input = element.querySelector('input[type="date"]'), table = element.querySelector('[data-rf-calendar-grid]'), title = element.querySelector('[data-rf-calendar-title]'), controls = element.querySelector('[data-rf-calendar-controls]');
    if (!input || !table || !title || !controls) continue;
    const original = controls.hidden, originalTitle = title.textContent;
    const iso = date => `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dateOf = value => value ? new Date(`${value}T12:00:00`) : new Date();
    let viewed = dateOf(input.value); viewed.setDate(1); let active = input.value || iso(new Date());
    const allowed = value => (!input.min || value >= input.min) && (!input.max || value <= input.max);
    const render = (focus = false) => {
      const formatter = new Intl.DateTimeFormat(element.dataset.rfLocale || undefined, { month: 'long', year: 'numeric' });
      title.textContent = formatter.format(viewed); table.setAttribute('aria-label', title.textContent);
      table.replaceChildren(); const head = document.createElement('thead'), header = document.createElement('tr');
      ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].forEach(day => { const cell = document.createElement('th'); cell.scope = 'col'; cell.setAttribute('aria-label', day); cell.textContent = day.slice(0, 2); header.append(cell); }); head.append(header);
      const body = document.createElement('tbody'), offset = (viewed.getDay() + 6) % 7, days = new Date(viewed.getFullYear(), viewed.getMonth() + 1, 0).getDate();
      let row; const buttons = [];
      for (let index = 0; index < Math.ceil((offset + days) / 7) * 7; index++) {
        if (index % 7 === 0) { row = document.createElement('tr'); body.append(row); }
        const cell = document.createElement('td'), number = index - offset + 1; row.append(cell);
        if (number < 1 || number > days) continue;
        const date = new Date(viewed); date.setDate(number); const value = iso(date), button = document.createElement('button');
        button.type = 'button'; button.className = 'rf-calendar__day'; button.dataset.rfDate = value; button.textContent = String(number); button.disabled = input.matches(':disabled') || !allowed(value); button.tabIndex = -1;
        button.setAttribute('aria-label', new Intl.DateTimeFormat(element.dataset.rfLocale || undefined, { dateStyle: 'full' }).format(date)); button.setAttribute('aria-pressed', String(value === input.value));
        if (value === iso(new Date())) button.setAttribute('aria-current', 'date'); cell.append(button); buttons.push(button);
      }
      table.append(head, body); const target = buttons.find(button => !button.disabled && button.dataset.rfDate === active) || buttons.find(button => !button.disabled);
      if (target) { target.tabIndex = 0; active = target.dataset.rfDate; if (focus) target.focus(); }
      for (const button of controls.querySelectorAll('[data-rf-calendar-month]')) { const next = new Date(viewed); next.setMonth(next.getMonth() + Number(button.dataset.rfCalendarMonth)); const last = new Date(next); last.setMonth(last.getMonth() + 1, 0); button.disabled = input.matches(':disabled') || next.getFullYear() < 1 || next.getFullYear() > 9999 || (input.min && iso(last) < input.min) || (input.max && iso(next) > input.max); }
    };
    listen(controls, 'click', event => { const button = event.target.closest('[data-rf-calendar-month]'); if (!button || button.disabled) return; viewed.setMonth(viewed.getMonth() + Number(button.dataset.rfCalendarMonth)); render(); });
    listen(table, 'click', event => { const button = event.target.closest('[data-rf-date]'); if (!button || button.disabled) return; input.value = button.dataset.rfDate; active = input.value; input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); render(true); emit(element, 'date-change', { value: input.value }); });
    listen(table, 'keydown', event => {
      const button = event.target.closest('[data-rf-date]'); if (!button || event.isComposing) return;
      const date = dateOf(button.dataset.rfDate), direction = getComputedStyle(element).direction === 'rtl' ? -1 : 1;
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)) date.setDate(date.getDate() + ({ ArrowLeft: -direction, ArrowRight: direction, ArrowUp: -7, ArrowDown: 7 }[event.key]));
      else if (['Home','End'].includes(event.key)) date.setDate(date.getDate() - (date.getDay() + 6) % 7 + (event.key === 'End' ? 6 : 0));
      else if (['PageUp','PageDown'].includes(event.key)) { const number = date.getDate(); date.setDate(1); date.setMonth(date.getMonth() + (event.key === 'PageUp' ? -1 : 1)); date.setDate(Math.min(number, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate())); }
      else return;
      event.preventDefault(); const value = iso(date); if (!allowed(value) || date.getFullYear() < 1 || date.getFullYear() > 9999) return;
      active = value; viewed = new Date(date); viewed.setDate(1); render(true);
    });
    const fromInput = () => { if (input.value) { viewed = dateOf(input.value); viewed.setDate(1); active = input.value; } render(); };
    listen(input, 'change', fromInput); reset(input.form, fromInput); controls.hidden = false; render();
    const observer = new MutationObserver(() => render()); observer.observe(input, { attributes: true, attributeFilter: ['disabled', 'min', 'max'] });
    cleanups.push(() => { observer.disconnect(); table.replaceChildren(); controls.hidden = original; title.textContent = originalTitle; });
  }

  for (const element of matches(root, '[data-rf-scheduler]')) {
    const form = element.querySelector('[data-rf-event-form]'), list = element.querySelector('[data-rf-events]'), status = element.querySelector('[data-rf-event-status]');
    if (!form || !list) continue;
    const { title, date, start, end, eventId } = form.elements;
    if (![title, date, start, end, eventId].every(Boolean)) continue;
    const originalMin = end.min, save = form.querySelector('[data-rf-event-save]'), originalSave = save?.textContent;
    let events = [...list.children].map(item => ({ id: item.dataset.rfEventId, title: item.querySelector('[data-rf-event-title]').textContent, date: item.dataset.rfEventDate, start: item.dataset.rfEventStart, end: item.dataset.rfEventEnd }));
    const validate = () => { end.min = start.value; end.setCustomValidity(start.value && end.value && end.value <= start.value ? 'End time must be after start time.' : ''); title.setCustomValidity(title.value && !title.value.trim() ? 'Enter an event title.' : ''); };
    const render = () => {
      list.replaceChildren(...events.toSorted((a, b) => `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`)).map(event => {
        const item = document.createElement('li'); item.className = 'rf-card rf-stack'; item.dataset.rfEventId = event.id;
        item.dataset.rfEventDate = event.date; item.dataset.rfEventStart = event.start; item.dataset.rfEventEnd = event.end;
        const name = document.createElement('strong'); name.dataset.rfEventTitle = ''; name.textContent = event.title;
        const time = document.createElement('time'); time.dateTime = `${event.date}T${event.start}`; time.textContent = `${event.date} · ${event.start}–${event.end}`;
        const actions = document.createElement('div'); actions.className = 'rf-cluster';
        for (const action of ['edit', 'delete']) { const button = document.createElement('button'); button.type = 'button'; button.className = 'rf-button rf-button--outline rf-button--small'; button.dataset.rfEventAction = action; button.textContent = action === 'edit' ? 'Edit event' : 'Delete event'; button.setAttribute('aria-label', `${button.textContent}: ${event.title}`); actions.append(button); }
        item.append(name, time, actions); return item;
      }));
    };
    const changed = message => { render(); if (status) status.textContent = `${message} ${events.length} event${events.length === 1 ? '' : 's'} scheduled.`; emit(element, 'schedule-change', { events: events.map(event => ({ ...event })) }); };
    listen(start, 'input', validate); listen(end, 'input', validate); listen(title, 'input', validate);
    listen(form, 'submit', event => {
      if (event.defaultPrevented) return; event.preventDefault(); validate(); if (!form.reportValidity()) return;
      const item = { id: eventId.value || uid('rf-event'), title: title.value.trim(), date: date.value, start: start.value, end: end.value };
      const index = events.findIndex(event => event.id === item.id); if (index < 0) events.push(item); else events[index] = item;
      changed(`${index < 0 ? 'Created' : 'Updated'} ${item.title}.`); form.reset();
    });
    listen(list, 'click', event => {
      const button = event.target.closest('[data-rf-event-action]'); if (!button) return;
      const id = button.closest('[data-rf-event-id]').dataset.rfEventId, item = events.find(event => event.id === id); if (!item) return;
      if (button.dataset.rfEventAction === 'delete') { events = events.filter(event => event.id !== id); changed(`Deleted ${item.title}.`); title.focus(); if (eventId.value === id) form.reset(); }
      else { for (const name of ['title', 'date', 'start', 'end']) form.elements[name].value = item[name]; eventId.value = id; if (save) save.textContent = 'Save event'; validate(); title.focus(); }
    });
    reset(form, () => { eventId.value = ''; if (save) save.textContent = originalSave; validate(); });
    render(); validate(); cleanups.push(() => { list.querySelectorAll('[data-rf-event-action]').forEach(button => button.remove()); end.min = originalMin; end.setCustomValidity(''); title.setCustomValidity(''); if (save) save.textContent = originalSave; });
  }
  return () => { controller.abort(); cleanups.forEach(cleanup => cleanup()); };
}
