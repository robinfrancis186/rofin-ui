const form = document.querySelector('#resource-form'), snapshot = document.querySelector('#snapshot'), errors = document.querySelector('#resource-error'), status = document.querySelector('#load-status'), cancel = document.querySelector('#cancel-load');
const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
const paths = { snapshot: new URL('assets/project-snapshot.json', import.meta.url), missing: new URL('assets/missing-snapshot.json', import.meta.url), permission: '/api/sample-recovery/permission', server: '/api/sample-recovery/server' };
let pending, generation = 0;
form.hidden = false;
for (const option of form.querySelectorAll('[data-local-only]')) option.disabled = !local;
const theme = document.querySelector('#recovery-theme'); theme.hidden = false;
theme.addEventListener('click', () => { const dark = document.documentElement.dataset.rfTheme !== 'dark'; document.documentElement.dataset.rfTheme = dark ? 'dark' : 'light'; theme.setAttribute('aria-pressed', String(dark)); theme.textContent = dark ? 'Light theme' : 'Dark theme'; });

async function load(focus = true) {
  const name = form.elements.resource.value;
  if (!Object.hasOwn(paths, name) || !local && ['permission', 'server'].includes(name)) return;
  pending?.abort(); const controller = pending = new AbortController(), current = ++generation;
  snapshot.hidden = true; errors.hidden = true; errors.replaceChildren();
  cancel.disabled = false; form.querySelector('[type="submit"]').disabled = true;
  document.querySelector('#resource-output').setAttribute('aria-busy', 'true'); status.textContent = 'Loading resource…';
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 8000);
  try {
    const response = await fetch(paths[name], { signal: controller.signal, cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) throw response;
    const data = await response.json();
    if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 200 || typeof data.summary !== 'string' || data.summary.length > 2000 || !Number.isSafeInteger(data.completed) || !Number.isSafeInteger(data.total) || data.total < 1 || data.total > 1000000 || data.completed < 0 || data.completed > data.total) throw Error('Invalid snapshot.');
    if (current !== generation) return;
    snapshot.querySelector('h2').textContent = data.name; snapshot.querySelector('p').textContent = data.summary;
    const progress = snapshot.querySelector('progress'); progress.max = data.total; progress.value = data.completed; progress.textContent = document.querySelector('#snapshot-count').textContent = `${data.completed} / ${data.total}`;
    snapshot.hidden = false; status.textContent = 'Snapshot loaded. Your note stays in place.';
    if (focus && document.activeElement.id !== 'recovery-draft') snapshot.querySelector('h2').focus({ preventScroll: true });
  } catch (cause) {
    if (current !== generation || controller.signal.aborted && !timedOut) return;
    // navigator.onLine is a hint: unknown network failures keep a general retry page.
    const kind = navigator.onLine === false ? 'offline' : cause.status === 404 ? '404' : [401, 403].includes(cause.status) ? 'permission' : 'server';
    const state = kind === '404' ? 'missing' : kind;
    errors.replaceChildren(document.querySelector('#recovery-pages').content.querySelector(`[data-rf-recovery-state="${state}"]`).cloneNode(true));
    for (const link of errors.querySelectorAll('[data-rf-recovery-reload]')) link.hidden = true;
    if (kind === 'server' || kind === 'permission') errors.querySelector('.rf-error-page__code').textContent = cause.status ? String(cause.status) : '↗';
    const retry = errors.querySelector('[data-rf-recovery-retry]'); retry.hidden = false; retry.addEventListener('click', () => load());
    errors.hidden = false; status.textContent = timedOut ? 'The read timed out. Try again when the resource is available.' : kind === 'offline' ? 'Connection unavailable. Reconnect, then retry.' : `Resource unavailable${cause.status ? ` (HTTP ${cause.status})` : ''}. Your note stays in place.`;
    if (focus && document.activeElement.id !== 'recovery-draft') errors.querySelector('h2').focus({ preventScroll: true });
  } finally {
    clearTimeout(timer);
    if (current === generation) { pending = undefined; cancel.disabled = true; form.querySelector('[type="submit"]').disabled = false; document.querySelector('#resource-output').removeAttribute('aria-busy'); }
  }
}
form.addEventListener('submit', event => { event.preventDefault(); load(); });
form.elements.resource.addEventListener('change', () => { if (pending) cancel.click(); });
function cancelLoad(focus = true) { ++generation; pending?.abort(); pending = undefined; cancel.disabled = true; form.querySelector('[type="submit"]').disabled = false; document.querySelector('#resource-output').removeAttribute('aria-busy'); status.textContent = 'Read cancelled. Your note stays in place.'; if (focus) form.querySelector('[type="submit"]').focus(); }
cancel.addEventListener('click', () => cancelLoad());
window.addEventListener('pagehide', () => { if (pending) cancelLoad(false); });
load(false);
