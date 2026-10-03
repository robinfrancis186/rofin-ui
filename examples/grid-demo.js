import { createDataGrid } from '../src/js/data-grid.js';
import { sampleGridRows } from './grid-data.js';

export function initGridExamples(root) {
  const cleanups = [];
  for (const element of root.querySelectorAll('[data-rf-data-grid]')) {
    const grid = createDataGrid(element, { rows: sampleGridRows() }), mode = element.querySelector('[data-rf-grid-source]');
    const sourceGroup = mode?.closest('[data-rf-grid-demo-source]'); if (sourceGroup) sourceGroup.hidden = false;
    const controller = new AbortController(); let source = 'browser';
    if (mode) {
      const local = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
      mode.querySelector('[value="http"]').disabled = !local;
      mode.addEventListener('change', async () => {
        const selected = mode.value;
        try {
          await grid.setLoader(selected === 'http' ? async (query, { signal }) => {
            const response = await fetch(`/api/sample-grid?query=${encodeURIComponent(JSON.stringify(query))}`, { signal });
            if (!response.ok) throw Error('The sample server could not return this page.'); return response.json();
          } : null);
          if (!controller.signal.aborted && mode.value === selected) source = selected;
        } catch (cause) { mode.value = source; element.querySelector('[data-rf-grid-note]').textContent = cause.message; }
      }, { signal: controller.signal });
    }
    cleanups.push(() => { controller.abort(); if (sourceGroup) sourceGroup.hidden = true; grid.destroy(); });
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
