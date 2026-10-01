import { enhancer } from './utils.js';
export const tooltips = enhancer('.rf-tooltip', (element, signal) => {
  element.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !element.hasAttribute('data-rf-tooltip-dismissed')) {
      event.preventDefault(); event.stopPropagation();
      element.setAttribute('data-rf-tooltip-dismissed', '');
    }
  }, { signal });
  const reset = () => {
    if (!element.matches(':hover') && !element.contains(document.activeElement)) element.removeAttribute('data-rf-tooltip-dismissed');
  };
  element.addEventListener('pointerleave', reset, { signal });
  element.addEventListener('focusout', () => queueMicrotask(reset), { signal });
});
export function initTooltips(root = document) { tooltips.init(root); return () => tooltips.destroy(root); }
