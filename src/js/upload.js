import { enhancer } from './utils.js';
export const uploads = enhancer('[data-rf-upload]', (element, signal) => {
  const input = element.querySelector('input[type="file"]');
  const list = element.querySelector('[data-rf-file-list]');
  if (!input || !list) return;
  function update() {
    const rows = [...input.files].map(file => {
      const item = document.createElement('li');
      item.textContent = `${file.name} · ${file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`}`;
      return item;
    });
    list.replaceChildren(...rows);
  }
  input.addEventListener('change', update, { signal });
  let resetTimer;
  input.form?.addEventListener('reset', event => {
    // The native reset default action runs after the event's microtask checkpoint.
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { if (!signal.aborted && !event.defaultPrevented) update(); }, 0);
  }, { signal });
  update();
  return () => clearTimeout(resetTimer);
});
export function initUploads(root = document) { uploads.init(root); return () => uploads.destroy(root); }
