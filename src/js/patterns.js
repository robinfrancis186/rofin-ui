import { matches } from './utils.js';

/** Optional patterns; initialize each root once and tear down before removing it. */
export function initPatterns(root = document) {
  const controller = new AbortController();
  const { signal } = controller;
  const cleanups = [];
  const listen = (node, type, handler) => node.addEventListener(type, handler, { signal });

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
        visible[(index + (event.key === 'ArrowDown' ? 1 : -1) + visible.length) % visible.length]?.focus();
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
    listen(form, 'reset', () => queueMicrotask(() => { if (!signal.aborted) { index = 0; update(); } }));
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
