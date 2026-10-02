let sequence = 0;
export function uid(prefix = 'rf') {
  let id;
  do { id = `${prefix}-${++sequence}`; } while (document.getElementById(id));
  return id;
}
export const disabled = element => element.disabled || element.getAttribute('aria-disabled') === 'true';
export const matches = (root, selector) => [
  ...(root.nodeType === 1 && root.matches(selector) ? [root] : []),
  ...root.querySelectorAll(selector)
];

// Native reset applies after its event; cancelled resets and removed roots stay untouched.
export function onFormReset(form, update, signal) {
  let timer;
  form?.addEventListener('reset', event => {
    clearTimeout(timer);
    timer = setTimeout(() => { if (!signal.aborted && !event.defaultPrevented) update(); }, 0);
  }, { signal });
  return () => clearTimeout(timer);
}

// Every instance owns its listeners. Reinserted components initialize afresh.
export function enhancer(selector, setup) {
  const instances = new Map();
  return {
    init(root = document) {
      for (const element of matches(root, selector)) {
        if (instances.has(element)) continue;
        const controller = new AbortController();
        const cleanup = setup(element, controller.signal);
        instances.set(element, () => { controller.abort(); cleanup?.(); });
      }
    },
    destroy(root) {
      for (const [element, cleanup] of instances) {
        if (root === element || root.contains(element)) {
          cleanup();
          instances.delete(element);
        }
      }
    }
  };
}
