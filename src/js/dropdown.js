import { enhancer, disabled } from './utils.js';

export const dropdowns = enhancer('[data-rf-dropdown]', (element, signal) => {
  const trigger = element.querySelector('[popovertarget]');
  const menu = element.querySelector('[popover]');
  if (!trigger || !menu || trigger.getAttribute('popovertarget') !== menu.id || !menu.showPopover) return;
  const items = () => [...menu.querySelectorAll('[role="menuitem"]')].filter(item => !disabled(item) && !item.hidden);
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-controls', menu.id);
  trigger.setAttribute('aria-expanded', 'false');
  let openedListeners;
  let focusLast = false;
  let query = '';
  let queryTimer;
  function position() {
    const rect = trigger.getBoundingClientRect();
    const { width, height } = menu.getBoundingClientRect();
    const x = getComputedStyle(element).direction === 'rtl' ? rect.right - width : rect.left;
    const y = rect.bottom + height + 8 > innerHeight ? rect.top - height - 6 : rect.bottom + 6;
    menu.style.left = `${Math.max(8, Math.min(x, innerWidth - width - 8))}px`;
    menu.style.top = `${Math.max(8, Math.min(y, innerHeight - height - 8))}px`;
  }
  menu.addEventListener('toggle', event => {
    openedListeners?.abort();
    trigger.setAttribute('aria-expanded', String(event.newState === 'open'));
    if (event.newState === 'open') {
      position();
      openedListeners = new AbortController();
      window.addEventListener('resize', position, { signal: openedListeners.signal });
      window.addEventListener('scroll', position, { capture: true, signal: openedListeners.signal });
      const options = items();
      (focusLast ? options.at(-1) : options[0])?.focus();
      focusLast = false;
    } else if (menu.contains(document.activeElement)) trigger.focus();
  }, { signal });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusLast = event.key === 'ArrowUp';
      if (!menu.matches(':popover-open')) menu.showPopover();
      else (focusLast ? items().at(-1) : items()[0])?.focus();
    }
  }, { signal });
  menu.addEventListener('keydown', event => {
    const options = items();
    const current = options.indexOf(event.target.closest('[role="menuitem"]'));
    if (!options.length) return;
    let next;
    if (event.key === 'ArrowDown') next = options[(current + 1) % options.length];
    if (event.key === 'ArrowUp') next = options[(current - 1 + options.length) % options.length];
    if (event.key === 'Home') next = options[0];
    if (event.key === 'End') next = options.at(-1);
    if (event.key === 'Escape' || event.key === 'Tab') {
      if (event.key === 'Escape') event.preventDefault();
      menu.hidePopover(); trigger.focus(); return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
      query += event.key.toLocaleLowerCase();
      clearTimeout(queryTimer);
      queryTimer = setTimeout(() => { query = ''; }, 600);
      const ordered = [...options.slice(current + 1), ...options.slice(0, current + 1)];
      next = ordered.find(item => (item.getAttribute('aria-label') || item.textContent).trim().toLocaleLowerCase().startsWith(query));
    }
    if (next) { event.preventDefault(); next.focus(); }
  }, { signal });
  menu.addEventListener('click', event => {
    const item = event.target.closest('[role="menuitem"]');
    if (item && !disabled(item)) { menu.hidePopover(); trigger.focus(); }
  }, { signal });
  return () => { openedListeners?.abort(); clearTimeout(queryTimer); };
});

export function initDropdowns(root = document) { dropdowns.init(root); return () => dropdowns.destroy(root); }
