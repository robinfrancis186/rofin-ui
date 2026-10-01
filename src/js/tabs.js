import { enhancer, disabled, uid } from './utils.js';

export const tabs = enhancer('[data-rf-tabs]', (element, signal) => {
  const owned = selector => [...element.querySelectorAll(selector)]
    .filter(node => node.closest('[data-rf-tabs]') === element);
  const list = owned('[role="tablist"]')[0];
  const buttons = owned('[role="tab"]');
  const panels = owned('[role="tabpanel"]');
  if (!list || !buttons.length || buttons.length !== panels.length) return;

  const pairs = buttons.map((button, i) => {
    const targetId = button.getAttribute('aria-controls');
    return [button, targetId ? panels.find(panel => panel.id === targetId) : panels[i]];
  });
  if (pairs.some(([, panel]) => !panel) || new Set(pairs.map(([, p]) => p)).size !== pairs.length) return;
  for (const [button, panel] of pairs) {
    button.id ||= uid('rf-tab');
    panel.id ||= uid('rf-panel');
    button.setAttribute('aria-controls', panel.id);
    panel.setAttribute('aria-labelledby', button.id);
    panel.tabIndex = 0;
  }
  let selected;
  function activate(button, emit = true) {
    if (!button || disabled(button)) return;
    selected = button;
    for (const [tab, panel] of pairs) {
      const active = tab === button;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
    }
    if (emit) element.dispatchEvent(new CustomEvent('rf:tab-change', {
      bubbles: true, detail: { index: buttons.indexOf(button), tab: button }
    }));
  }
  activate(buttons.find(b => b.getAttribute('aria-selected') === 'true' && !disabled(b)) || buttons.find(b => !disabled(b)), false);
  list.addEventListener('click', event => {
    const button = event.target.closest('[role="tab"]');
    if (buttons.includes(button)) activate(button);
  }, { signal });
  list.addEventListener('keydown', event => {
    const current = event.target.closest('[role="tab"]');
    if (!buttons.includes(current)) return;
    const available = buttons.filter(b => !disabled(b));
    if (!available.length) return;
    const index = available.indexOf(current);
    const vertical = list.getAttribute('aria-orientation') === 'vertical';
    const rtl = getComputedStyle(list).direction === 'rtl';
    const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight';
    const prevKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
    let next;
    if (event.key === nextKey) next = available[(index + 1) % available.length];
    if (event.key === prevKey) next = available[(index - 1 + available.length) % available.length];
    if (event.key === 'Home') next = available[0];
    if (event.key === 'End') next = available.at(-1);
    if (next) {
      event.preventDefault();
      buttons.forEach(b => { b.tabIndex = b === next ? 0 : -1; });
      next.focus();
      if (element.dataset.rfActivation !== 'manual') activate(next);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); activate(current);
    }
  }, { signal });
  // Unenhanced markup remains readable after teardown.
  return () => {
    panels.forEach(panel => { panel.hidden = false; });
    buttons.forEach(button => { button.tabIndex = 0; });
    selected = undefined;
  };
});

export function initTabs(root = document) { tabs.init(root); return () => tabs.destroy(root); }
