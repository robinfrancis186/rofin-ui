import { tabs } from './tabs.js';
import { dropdowns } from './dropdown.js';
import { tooltips } from './tooltip.js';
import { uploads } from './upload.js';
import { initDialogs } from './dialog.js';
export { initTabs } from './tabs.js';
export { initDropdowns } from './dropdown.js';
export { initTooltips } from './tooltip.js';
export { initUploads } from './upload.js';
export { initDialogs } from './dialog.js';
export { toast, clearToasts } from './toast.js';

const controllers = new WeakMap();
const components = [tabs, dropdowns, tooltips, uploads];

/** Idempotent for the same root. Returns a teardown function. Avoid overlapping roots. */
export function init(root = document, { observe = true } = {}) {
  if (controllers.has(root)) return controllers.get(root);
  components.forEach(component => component.init(root));
  const stopDialogs = initDialogs(root);
  let observer;
  if (observe) {
    observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.removedNodes) {
          if (node.nodeType === 1 && !root.contains(node)) components.forEach(component => component.destroy(node));
        }
        for (const node of record.addedNodes) {
          if (node.nodeType === 1 && root.contains(node)) components.forEach(component => component.init(node));
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  }
  const destroy = () => {
    observer?.disconnect(); stopDialogs();
    components.forEach(component => component.destroy(root));
    controllers.delete(root);
  };
  controllers.set(root, destroy);
  return destroy;
}
