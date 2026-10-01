import { init, toast } from '../src/js/index.js';
import { initEffects } from '../src/js/effects.js';
init();
initEffects();
document.addEventListener('click', event => {
  if (event.target.closest('[data-demo-toast]')) toast('Your changes are saved.', { title: 'All set', variant: 'success' });
  if (event.target.closest('.demo-stage a')) { event.preventDefault(); toast('Example link. Connect it to your own destination.', { duration: 3000 }); }
});
document.addEventListener('submit', event => {
  if (event.target.matches('[data-demo-form]')) { event.preventDefault(); toast('Demo only. No data was sent.', { title: 'Form preview' }); }
});
const search = document.querySelector('#project-search');
search?.addEventListener('input', () => {
  const rows = [...document.querySelectorAll('#projects tbody tr')];
  const query = search.value.trim().toLocaleLowerCase();
  rows.forEach(row => { row.hidden = !row.textContent.toLocaleLowerCase().includes(query); });
  document.querySelector('#filter-status').textContent = `${rows.filter(row => !row.hidden).length} projects shown`;
});
