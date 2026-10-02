import { init, toast } from '../src/js/index.js';
import { initEffects } from '../src/js/effects.js';
import { initPatterns } from '../src/js/patterns.js';
import { initFormPatterns } from '../src/js/form-patterns.js';
init();
initEffects();
initPatterns();
initFormPatterns();
document.addEventListener('click', event => {
  if (event.target.closest('[data-demo-toast]')) toast('Your changes are saved.', { title: 'All set', variant: 'success' });
  if (!event.defaultPrevented && event.target.closest('.demo-stage a')) { event.preventDefault(); toast('Example link. Connect it to your own destination.', { duration: 3000 }); }
});
document.addEventListener('submit', event => {
  if (event.defaultPrevented) return;
  if (event.target.matches('[data-demo-form]')) { event.preventDefault(); toast('Demo only. No data was sent.', { title: 'Form preview' }); }
});

document.addEventListener('rf:table-action', event => { toast(`${event.detail.values.length} sample rows selected. Connect your own action.`, { title: 'Selection preview' }); });
