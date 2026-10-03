import { disabled, onFormReset } from './utils.js';

const instances = new WeakMap();
const node = (tag, className, value) => { const el = document.createElement(tag); if (className) el.className = className; if (value != null) el.textContent = value; return el; };
const size = value => value < 1024 ? `${value} B` : value < 1048576 ? `${(value / 1024).toFixed(1)} KB` : `${(value / 1048576).toFixed(1)} MB`;
const abortError = () => new DOMException('Upload cancelled.', 'AbortError');

/** Explicit binary transfer. Progress comes from XMLHttpRequest upload events. */
export function uploadFile(url, file, { signal, onProgress, headers = {}, method = 'POST', timeout = 120000, withCredentials = false } = {}) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob) || !['POST', 'PUT'].includes(method) || !Number.isSafeInteger(timeout) || timeout < 0 || timeout > 1000000 || onProgress != null && typeof onProgress !== 'function') { reject(Error('Invalid upload options.')); return; }
    if (signal?.aborted) { reject(abortError()); return; }
    const xhr = new XMLHttpRequest(); let settled = false;
    const finish = (error, value) => { if (settled) return; settled = true; signal?.removeEventListener('abort', cancel); xhr.upload.onprogress = xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onabort = null; error ? reject(error) : resolve(value); };
    const cancel = () => { xhr.abort(); finish(abortError()); };
    try {
      const endpoint = new URL(url, document.baseURI); if (!['http:', 'https:'].includes(endpoint.protocol) || endpoint.username || endpoint.password) throw Error('Provide an HTTP upload endpoint without URL credentials.');
      xhr.open(method, endpoint.href); xhr.timeout = timeout; xhr.withCredentials = !!withCredentials;
      const supplied = Object.entries(headers); if (!supplied.some(([key]) => key.toLowerCase() === 'content-type')) xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      for (const [key, value] of supplied) xhr.setRequestHeader(key, value);
      xhr.upload.onprogress = event => { if (settled || signal?.aborted) return; try { onProgress?.({ loaded: event.loaded, total: event.lengthComputable ? event.total : null }); } catch (error) { finish(error); xhr.abort(); } };
      xhr.onload = () => {
        if (xhr.status < 200 || xhr.status >= 300) { finish(Error(`Upload failed (HTTP ${xhr.status}).`)); return; }
        try { finish(null, /application\/json/i.test(xhr.getResponseHeader('Content-Type') || '') && xhr.responseText ? JSON.parse(xhr.responseText) : xhr.responseText || null); } catch { finish(Error('The upload response could not be read.')); }
      };
      xhr.onerror = () => finish(Error('The connection failed. Your file is available to retry.'));
      xhr.ontimeout = () => finish(Error('The upload timed out. Your file is available to retry.'));
      xhr.onabort = () => finish(abortError()); signal?.addEventListener('abort', cancel, { once: true }); if (signal?.aborted) cancel(); else xhr.send(file);
    } catch (error) { finish(error); xhr.abort(); }
  });
}

/** Files stay local until an explicit upload action invokes the supplied callback. */
export function createUploadQueue(element, options = {}) {
  if (instances.has(element)) return instances.get(element);
  const input = element.querySelector('input[type=file]'), list = element.querySelector('[data-rf-upload-items]'), zone = element.querySelector('[data-rf-drop-zone]') || element;
  if (!input || !list) throw Error('Provide a labelled file input and upload item list.');
  const maxFileSize = options.maxFileSize ?? Number(element.dataset.rfMaxSize || 8388608), maxFiles = options.maxFiles ?? Number(element.dataset.rfMaxFiles || 10), concurrency = options.concurrency ?? 2;
  if (!Number.isSafeInteger(maxFileSize) || maxFileSize < 1 || maxFileSize > 1073741824 || !Number.isSafeInteger(maxFiles) || maxFiles < 1 || maxFiles > 100 || !Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 4 || options.upload != null && typeof options.upload !== 'function') throw Error('Invalid upload queue options.');
  const controller = new AbortController(), listen = (el, event, action) => el.addEventListener(event, action, { signal: controller.signal });
  const oldItems = [...list.childNodes], oldAccept = input.getAttribute('accept'); if (options.accept != null) input.accept = options.accept;
  const items = [], active = new Set(); let destroyed = false;
  const controls = node('div', 'rf-stack rf-upload-controls'), actions = node('div', 'rf-cluster'), status = node('p', 'rf-help'), errors = node('div', 'rf-upload-errors'), errorList = node('ul'), summary = node('p', 'rf-help');
  status.setAttribute('role', 'status'); errors.setAttribute('role', 'alert'); errors.append(errorList); errors.hidden = true;
  const button = (label, action) => { const el = node('button', 'rf-button rf-button--outline rf-button--small', label); el.type = 'button'; listen(el, 'click', action); return el; };
  const uploadAll = button('Upload queued files', () => start()), cancelAll = button('Cancel pending uploads', () => cancel()), clearDone = button('Clear uploaded files from queue', () => { for (const item of [...items]) if (item.state === 'uploaded') remove(item.id); });
  actions.append(uploadAll, cancelAll, clearDone); controls.append(actions, summary, status, errors); list.before(controls); list.replaceChildren();
  const snapshot = () => items.map(({ id, file, state, loaded, total, error }) => ({ id, name: file.name, size: file.size, type: file.type, state, loaded, total, error }));
  const emit = (name, detail) => { if (!destroyed) element.dispatchEvent(new CustomEvent(`rf:upload-${name}`, { bubbles: true, detail })); };
  const announce = message => { status.textContent = message; };
  const blocked = () => disabled(input) || disabled(element);
  function update() {
    if (destroyed) return;
    uploadAll.disabled = !options.upload || blocked() || !items.some(item => item.state === 'queued'); cancelAll.disabled = !items.some(item => ['queued', 'uploading'].includes(item.state)); clearDone.disabled = blocked() || !items.some(item => item.state === 'uploaded');
    summary.textContent = `${items.length} of ${maxFiles} files · ${size(items.reduce((total, item) => total + item.file.size, 0))} · ${items.filter(item => item.state === 'uploaded').length} uploaded · ${active.size} transferring`;
    for (const item of items) {
      const row = item.row; row.dataset.rfUploadState = item.state;
      row.querySelector('[data-rf-upload-state]').textContent = item.error || ({ queued: 'Ready to upload', uploading: item.total ? `${size(item.loaded)} of ${size(item.total)} sent` : 'Sending…', uploaded: 'Uploaded', cancelled: 'Cancelled; available to retry', error: 'Upload failed; available to retry' })[item.state];
      const progress = row.querySelector('progress'); progress.max = item.total || item.file.size || 1; if (item.state === 'uploading' && item.total == null) progress.removeAttribute('value'); else progress.value = item.state === 'uploaded' ? progress.max : Math.min(item.loaded, progress.max);
      const upload = row.querySelector('[data-rf-upload-start]'); upload.textContent = ['cancelled', 'error'].includes(item.state) ? 'Retry' : 'Upload'; upload.setAttribute('aria-label', `${upload.textContent} ${item.file.name}`); upload.disabled = !options.upload || blocked() || ['uploading', 'uploaded'].includes(item.state);
      row.querySelector('[data-rf-upload-cancel]').disabled = !['queued', 'uploading'].includes(item.state); row.querySelector('[data-rf-upload-remove]').disabled = blocked();
    }
    emit('change', { items: snapshot() });
  }
  function accepted(file) {
    const rules = input.accept.split(',').map(value => value.trim().toLowerCase()).filter(Boolean), name = file.name.toLowerCase(), type = file.type.toLowerCase();
    return !rules.length || rules.some(rule => rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule);
  }
  function addFiles(files) {
    if (destroyed || blocked()) return;
    let added = 0, rejected = 0; errorList.replaceChildren();
    // ponytail: render at most 100 queued files and 10 rejection details; use a bulk-upload view beyond this ceiling.
    for (const file of files) {
      const reason = !(file instanceof File) ? 'Choose a file.' : !file.size ? 'Empty files are not accepted.' : file.size > maxFileSize ? `Use a file no larger than ${size(maxFileSize)}.` : !accepted(file) ? 'This file type is not accepted.' : items.length >= maxFiles ? `The queue holds at most ${maxFiles} files.` : '';
      if (reason) { rejected++; if (errorList.children.length < 10) errorList.append(node('li', '', `${file?.name || 'File'}: ${reason}`)); continue; }
      const item = { id: crypto.randomUUID(), file, state: 'queued', loaded: 0, total: file.size, error: '', wanted: false, run: null, preview: null }, row = node('li', 'rf-upload-item'); item.row = row; row.dataset.rfUploadId = item.id;
      const preview = node('div', 'rf-upload-preview'), content = node('div', 'rf-stack rf-upload-content'), name = node('strong', 'rf-upload-name', file.name), info = node('p', 'rf-help', `${size(file.size)} · ${file.type || 'Unspecified type'}`), state = node('p', 'rf-help'), progress = node('progress', 'rf-progress'), actions = node('div', 'rf-cluster'); state.dataset.rfUploadState = ''; progress.setAttribute('aria-label', `Upload progress for ${file.name}`);
      if (['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) { try { item.preview = URL.createObjectURL(file); const image = node('img'); image.alt = ''; image.src = item.preview; preview.append(image); } catch { preview.textContent = 'File'; } } else preview.textContent = file.name.split('.').pop()?.slice(0, 8).toUpperCase() || 'File';
      const upload = node('button', 'rf-button rf-button--outline rf-button--small', 'Upload'), stop = node('button', 'rf-button rf-button--outline rf-button--small', 'Cancel'), remove = node('button', 'rf-button rf-button--outline rf-button--small', 'Remove');
      for (const el of [upload, stop, remove]) { el.type = 'button'; el.dataset.rfUploadId = item.id; }
      upload.dataset.rfUploadStart = ''; stop.dataset.rfUploadCancel = ''; remove.dataset.rfUploadRemove = ''; stop.setAttribute('aria-label', `Cancel ${file.name}`); remove.setAttribute('aria-label', `Remove ${file.name} from queue`);
      actions.append(upload, stop, remove); content.append(name, info, state, progress, actions); row.append(preview, content); list.append(row); items.push(item); added++;
    }
    input.value = ''; errors.hidden = !rejected; if (rejected > 10) errorList.append(node('li', '', `${rejected - 10} additional files were rejected.`)); update(); announce(`Added ${added} files.${rejected ? ` ${rejected} files rejected; review the errors.` : ''}`);
  }
  function start(id) {
    if (destroyed || blocked() || !options.upload) return;
    for (const item of items) if ((id ? item.id === id && !['uploading', 'uploaded'].includes(item.state) : item.state === 'queued')) { item.state = 'queued'; item.error = ''; item.wanted = true; }
    schedule(); update();
  }
  function schedule() {
    if (destroyed || blocked()) return;
    while (active.size < concurrency) {
      const item = items.find(item => item.state === 'queued' && item.wanted); if (!item) break; item.wanted = false;
      if (!element.dispatchEvent(new CustomEvent('rf:upload-before', { bubbles: true, cancelable: true, detail: { id: item.id, file: item.file } }))) { announce(`${item.file.name} was not uploaded.`); continue; }
      const run = { abort: new AbortController() }; item.run = run; active.add(run); item.state = 'uploading'; item.loaded = 0; item.total = item.file.size; item.error = ''; announce(`Uploading ${item.file.name}.`); update();
      Promise.resolve().then(() => {
        if (destroyed || run.abort.signal.aborted || item.run !== run) throw abortError();
        return options.upload(item.file, { id: item.id, signal: run.abort.signal, onProgress: value => {
          if (destroyed || run.abort.signal.aborted || item.run !== run || !value || !Number.isFinite(value.loaded) || value.loaded < 0 || value.total != null && (!Number.isFinite(value.total) || value.total <= 0)) return;
          item.loaded = Math.max(item.loaded, value.loaded); item.total = value.total ?? null; update();
        } });
      }).then(receipt => {
        if (destroyed || run.abort.signal.aborted || item.run !== run) return;
        item.state = 'uploaded'; item.loaded = item.total || item.file.size; announce(`Uploaded ${item.file.name}.`); emit('complete', { id: item.id, file: item.file, receipt });
      }, cause => {
        if (destroyed || item.run !== run || run.abort.signal.aborted) return;
        item.state = 'error'; item.error = cause?.message || 'Upload failed. Your file is available to retry.'; announce(`${item.file.name}: ${item.error}`); emit('error', { id: item.id, file: item.file, error: item.error });
      }).finally(() => { active.delete(run); if (destroyed) return; if (item.run === run) item.run = null; update(); schedule(); });
    }
  }
  function cancel(id) {
    if (destroyed) return;
    for (const item of items) if ((!id || item.id === id) && ['queued', 'uploading'].includes(item.state)) { item.wanted = false; item.run?.abort.abort(); active.delete(item.run); item.run = null; item.state = 'cancelled'; item.error = ''; }
    update(); announce(id ? 'Upload cancelled. The file is available to retry.' : 'Pending uploads cancelled. Files are available to retry.'); schedule();
  }
  function remove(id) {
    if (destroyed || blocked()) return; const index = items.findIndex(item => item.id === id); if (index < 0) return;
    const item = items[index]; cancel(id); items.splice(index, 1); if (item.preview) URL.revokeObjectURL(item.preview); item.row.remove(); update(); input.focus(); announce(`${item.file.name} removed from this queue.`);
  }
  function clear() { if (destroyed) return; cancel(); for (const item of items) { if (item.preview) URL.revokeObjectURL(item.preview); item.row.remove(); } items.length = 0; errorList.replaceChildren(); errors.hidden = true; input.value = ''; update(); announce('File queue cleared.'); }
  listen(input, 'change', () => addFiles(input.files));
  listen(zone, 'dragover', event => { if (blocked() || !event.dataTransfer?.types.includes('Files')) return; event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; zone.setAttribute('data-rf-dragging', ''); });
  listen(zone, 'dragleave', event => { if (!zone.contains(event.relatedTarget)) zone.removeAttribute('data-rf-dragging'); });
  listen(zone, 'drop', event => { zone.removeAttribute('data-rf-dragging'); if (!event.dataTransfer?.files.length) return; event.preventDefault(); addFiles(event.dataTransfer.files); });
  listen(list, 'click', event => { const el = event.target.closest('button[data-rf-upload-id]'); if (!el || !list.contains(el) || el.disabled) return; if (el.hasAttribute('data-rf-upload-start')) start(el.dataset.rfUploadId); else if (el.hasAttribute('data-rf-upload-cancel')) cancel(el.dataset.rfUploadId); else if (el.hasAttribute('data-rf-upload-remove')) remove(el.dataset.rfUploadId); });
  const stopReset = onFormReset(input.form, clear, controller.signal), observer = new MutationObserver(() => { update(); schedule(); }); observer.observe(input, { attributes: true, attributeFilter: ['disabled', 'aria-disabled'] }); observer.observe(element, { attributes: true, attributeFilter: ['aria-disabled'] });
  const api = { addFiles, start, cancel, remove, clear, getFiles: () => items.map(item => item.file), getState: snapshot, destroy() {
    if (destroyed) return; cancel(); destroyed = true; controller.abort(); stopReset(); observer.disconnect(); for (const item of items) if (item.preview) URL.revokeObjectURL(item.preview); controls.remove(); list.replaceChildren(...oldItems); zone.removeAttribute('data-rf-dragging'); if (oldAccept == null) input.removeAttribute('accept'); else input.setAttribute('accept', oldAccept); instances.delete(element);
  } };
  instances.set(element, api); update(); announce(options.upload ? 'Choose or drop files. Upload starts only when you ask.' : 'Local previews are available. Configure an upload callback to transfer files.'); return api;
}
