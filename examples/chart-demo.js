import { updateLineChart } from '../src/js/patterns.js';
import { matches } from '../src/js/utils.js';

/** Explicit illustrative streams; a production application supplies its own data. */
export function initChartExamples(root = document) {
  const cleanups = [];
  for (const element of matches(root, '[data-rf-line-chart]')) {
    const controls = element.querySelector('[data-rf-chart-demo-controls]'); if (!controls) continue;
    const controller = new AbortController(), { signal } = controller, source = controls.querySelector('[data-rf-chart-source]'), button = controls.querySelector('[data-rf-chart-stream]'), status = controls.querySelector('[data-rf-chart-demo-status]');
    const keys = [...element.querySelectorAll('thead [data-rf-line-series]')].map(heading => heading.dataset.rfLineSeries);
    const initial = [...element.querySelector('tbody').rows].map(row => ({ label: row.cells[0].textContent, values: Object.fromEntries(keys.map((key, index) => [key, Number(row.cells[index + 1].textContent)])) }));
    const local = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname); source.querySelector('[value="http"]').disabled = !local;
    let tick = 0, timer, stream, running = false;
    const pause = message => { running = false; clearInterval(timer); stream?.close(); stream = null; button.textContent = 'Start sample stream'; source.disabled = false; if (message) status.textContent = message; };
    const append = point => { if (!updateLineChart(element, [point], { append: true })) { pause('The sample could not update this chart. Previous data is retained.'); return false; } return true; };
    const sample = () => { tick++; return append({ label: `Sample ${tick}`, values: Object.fromEntries(keys.map((key, index) => [key, 55 + ((tick * 7 + index * 11) % 30)])) }); };
    controls.hidden = false;
    controls.querySelector('[data-rf-chart-add]').addEventListener('click', () => { if (sample() && !running) status.textContent = 'Added one illustrative point.'; }, { signal });
    button.addEventListener('click', () => {
      if (running) { pause('Sample stream paused. Data and your view are kept.'); return; }
      if (source.value === 'http' && !local) { pause('The HTTP sample is available only on localhost.'); return; }
      running = true; source.disabled = true; button.textContent = 'Pause sample stream'; status.textContent = source.value === 'http' ? 'Connecting to the public localhost sample stream…' : 'Browser sample updates running. Pause whenever you want.';
      if (source.value === 'http') {
        const current = stream = new EventSource('/api/sample-chart-stream');
        current.onopen = () => { if (stream === current) status.textContent = 'Receiving illustrative points through HTTP. Pause whenever you want.'; };
        current.onmessage = event => { if (stream !== current || signal.aborted) return; try { const row = JSON.parse(event.data); if (!row || typeof row.label !== 'string' || !row.label.trim() || row.label.length > 70) throw Error('Invalid label'); append({ label: `HTTP ${++tick}: ${row.label}`, values: row.values }); } catch { pause('The stream returned unreadable data. Previous chart data is retained.'); } };
        current.onerror = () => { if (stream === current) pause('The HTTP stream stopped. Previous data is retained; choose Start to retry.'); };
      } else timer = setInterval(sample, 1000);
    }, { signal });
    controls.querySelector('[data-rf-chart-restore]').addEventListener('click', () => { pause(); tick = 0; updateLineChart(element, initial); element.querySelector('[data-rf-line-reset]')?.click(); status.textContent = 'Original sample data restored.'; }, { signal });
    window.addEventListener('pagehide', () => pause('Sample stream paused.'), { signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden && running) pause('Sample stream paused while this page is hidden.'); }, { signal });
    cleanups.push(() => { pause(); controller.abort(); controls.hidden = true; });
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
