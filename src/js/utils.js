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
