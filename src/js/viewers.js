import { disabled, matches, enhancer } from './utils.js';

const galleries = new WeakMap(), files = new WeakMap();
const node = (tag, text) => { const element = document.createElement(tag); if (text != null) element.textContent = text; return element; };
function imageURL(value) {
  if (!value || value.length > 4096 || /[\u0000-\u0020\u007f]/u.test(value)) throw Error('Use a valid image URL without controls or spaces.');
  const url = new URL(value, document.baseURI);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw Error('Use an HTTP or HTTPS image without credentials.');
  return url.href;
}

/** Native anchors remain the scripts-off fallback; only an explicit open loads a large image. */
export function createLightbox(element) {
  if (galleries.has(element)) return galleries.get(element);
  const links = [...element.querySelectorAll('[data-rf-lightbox-item]')], dialog = element.querySelector('[data-rf-lightbox-dialog]'), stage = element.querySelector('[data-rf-lightbox-stage]'), caption = element.querySelector('[data-rf-lightbox-caption]'), status = element.querySelector('[data-rf-lightbox-status]'), previous = element.querySelector('[data-rf-lightbox-prev]'), next = element.querySelector('[data-rf-lightbox-next]'), close = element.querySelector('[data-rf-viewer-close]'), original = element.querySelector('[data-rf-lightbox-original]');
  if (!links.length || links.length > 100 || ![dialog, stage, caption, status, previous, next, close, original].every(Boolean)) throw Error('Provide complete lightbox markup with 1–100 image links.');
  const error = element.querySelector('[data-rf-lightbox-error]');
  const controller = new AbortController(); let index = 0, invoker, destroyed = false;
  const listen = (target, type, handler) => target.addEventListener(type, handler, { signal: controller.signal });
  function show(position) {
    if (destroyed || disabled(element) || position < 0 || position >= links.length) return false;
    const link = links[position]; let url;
    try { url = imageURL(link.getAttribute('href')); } catch (cause) { status.textContent = cause.message; if (error) { error.textContent = cause.message; error.hidden = false; } return false; }
    if (error) error.hidden = true;
    index = position; const image = node('img'); image.alt = link.querySelector('img')?.alt || link.textContent.trim();
    caption.textContent = link.querySelector('figcaption')?.textContent || link.dataset.rfCaption || image.alt;
    status.textContent = `Image ${index + 1} of ${links.length}. Loading…`;
    listen(image, 'load', () => { if (stage.firstChild === image) status.textContent = `Image ${index + 1} of ${links.length}.`; });
    listen(image, 'error', () => { if (stage.firstChild === image) { image.hidden = true; status.textContent = `Image ${index + 1} of ${links.length} could not be displayed. Open the original or try another image.`; } });
    stage.replaceChildren(image); original.href = url; image.src = url;
    previous.disabled = index === 0 || disabled(element); next.disabled = index === links.length - 1 || disabled(element);
    if (document.activeElement?.disabled) close.focus();
    element.dispatchEvent(new CustomEvent('rf:lightbox-change', { bubbles: true, detail: { index, url } })); return true;
  }
  links.forEach((link, position) => listen(link, 'click', event => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault(); if (disabled(link) || disabled(element)) return;
    invoker = link; if (show(position) && !dialog.open) dialog.showModal();
  }));
  listen(previous, 'click', () => show(index - 1)); listen(next, 'click', () => show(index + 1));
  listen(close, 'click', () => dialog.close());
  listen(dialog, 'keydown', event => {
    if (!dialog.open || event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return;
    const position = ({ ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: links.length - 1 })[event.key];
    if (position !== undefined) { event.preventDefault(); show(position); }
  });
  listen(dialog, 'close', () => { if (dialog.open) return; stage.replaceChildren(); original.removeAttribute('href'); status.textContent = ''; if (invoker?.isConnected) invoker.focus(); });
  const api = { destroy() { if (destroyed) return; destroyed = true; if (dialog.open) dialog.close(); controller.abort(); stage.replaceChildren(); original.removeAttribute('href'); status.textContent = ''; galleries.delete(element); } };
  galleries.set(element, api); return api;
}

const types = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', wav: 'audio/wav', mp3: 'audio/mpeg', ogg: 'audio/ogg', mp4: 'video/mp4', webm: 'video/webm', pdf: 'application/pdf', txt: 'text/plain' };
const allowed = new Set([...Object.values(types), 'audio/x-wav', 'video/ogg']);

/** Explicit local-file previews; unsupported/active document formats never get embedded. */
export function createFileViewer(element) {
  if (files.has(element)) return files.get(element);
  const dialog = element.querySelector('[data-rf-file-viewer-dialog]'), body = element.querySelector('[data-rf-file-viewer-body]'), title = element.querySelector('[data-rf-file-viewer-title]'), status = element.querySelector('[data-rf-file-viewer-status]'), error = element.querySelector('[data-rf-file-viewer-error]'), download = element.querySelector('[data-rf-file-viewer-download]'), close = element.querySelector('[data-rf-viewer-close]'), field = element.querySelector('[data-rf-file-viewer-field]'), input = element.querySelector('[data-rf-file-viewer-input]');
  if (![dialog, body, title, status, error, download, close].every(Boolean)) throw Error('Provide complete file-viewer markup.');
  const controller = new AbortController(); let url, serial = 0, invoker, destroyed = false;
  const release = () => { body.querySelectorAll('audio,video').forEach(media => { media.pause(); media.removeAttribute('src'); media.load(); }); body.replaceChildren(); if (url) URL.revokeObjectURL(url); url = null; download.removeAttribute('href'); download.removeAttribute('download'); };
  async function open(file) {
    if (destroyed || disabled(element)) return false;
    const task = ++serial, trigger = document.activeElement, wasOpen = dialog.open;
    try {
      if (!(file instanceof File) || !file.size || file.size > 8 * 1024 * 1024 || !file.name || file.name.length > 255 || /[\/\\\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(file.name)) throw Error('Choose a nonempty file of at most 8 MB with a valid file name.');
      const type = file.type || types[file.name.split('.').at(-1).toLowerCase()];
      if (!allowed.has(type)) throw Error('Preview a PNG, JPEG, GIF, WebP, AVIF, PDF, plain text, WAV, MP3, Ogg, MP4 or WebM file.');
      if (type === 'application/pdf' && await file.slice(0, 5).text() !== '%PDF-') throw Error('This file does not contain a PDF header.');
      const text = type === 'text/plain' ? await file.slice(0, 64 * 1024).text() : null;
      if (destroyed || task !== serial || disabled(element) || wasOpen && !dialog.open) return false;
      release(); error.hidden = true; invoker = trigger; title.textContent = file.name; status.textContent = '';
      url = URL.createObjectURL(new Blob([file], { type })); download.href = url; download.download = file.name;
      if (text !== null) { const preview = node('pre', text); preview.className = 'rf-file-text'; body.append(preview); if (file.size > 64 * 1024) status.textContent = 'Showing the first 64 KB. Download keeps the whole file.'; }
      else {
        const preview = node(type.startsWith('image/') ? 'img' : type === 'application/pdf' ? 'object' : type.startsWith('audio/') ? 'audio' : 'video');
        if (preview.tagName === 'OBJECT') { preview.type = type; preview.data = url; preview.setAttribute('aria-label', `${file.name} PDF preview`); preview.append(node('p', 'Your browser may not embed PDFs. Download the file below to read it.')); status.textContent = 'PDF controls depend on your browser. A download remains available.'; }
        else {
          preview.src = url;
          if (preview.tagName === 'IMG') preview.alt = file.name;
          else { preview.controls = true; preview.preload = 'metadata'; preview.playsInline = true; preview.setAttribute('aria-label', file.name); status.textContent = 'Use the native media controls. Local files do not include a supplied transcript or captions.'; }
          preview.addEventListener('error', () => { if (body.firstChild === preview) status.textContent = 'This file could not be displayed. Download the original below.'; }, { signal: controller.signal });
        }
        body.append(preview);
      }
      if (!dialog.open) dialog.showModal(); close.focus(); return true;
    } catch (cause) { if (!destroyed && task === serial) { error.textContent = cause instanceof Error ? cause.message : 'The file could not be opened.'; error.hidden = false; if (dialog.open) status.textContent = error.textContent; } return false; }
  }
  close.addEventListener('click', () => dialog.close(), { signal: controller.signal });
  dialog.addEventListener('close', () => { if (dialog.open) return; release(); status.textContent = ''; if (invoker?.isConnected) invoker.focus(); }, { signal: controller.signal });
  if (field && input) { field.hidden = false; input.addEventListener('change', async () => { if (input.files[0]) await open(input.files[0]); input.value = ''; }, { signal: controller.signal }); }
  const api = { open, destroy() { if (destroyed) return; destroyed = true; serial++; if (dialog.open) dialog.close(); controller.abort(); release(); error.hidden = true; status.textContent = ''; if (field) field.hidden = true; if (input) input.value = ''; files.delete(element); } };
  files.set(element, api); return api;
}

const media = enhancer('[data-rf-media]', (element, signal) => {
  const players = [...element.querySelectorAll('audio,video')], status = element.querySelector('[data-rf-media-status]');
  for (const player of players) {
    player.addEventListener('play', () => { for (const other of players) if (other !== player) other.pause(); if (status) status.textContent = `Playing ${player.getAttribute('aria-label') || 'media'}.`; }, { signal });
    player.addEventListener('error', () => { if (status) status.textContent = 'This media could not be played. Use its download or text alternative.'; }, { signal });
    player.addEventListener('pause', () => { if (status && players.every(item => item.paused)) status.textContent = 'Media paused.'; }, { signal });
    player.addEventListener('ended', () => { if (status) status.textContent = 'Playback finished.'; }, { signal });
  }
  return () => { players.forEach(player => player.pause()); if (status) status.textContent = ''; };
});

export function initViewers(root = document) {
  const galleries = matches(root, '[data-rf-lightbox]').map(createLightbox), files = matches(root, '[data-rf-file-viewer]').map(createFileViewer);
  media.init(root); let stopped = false;
  return () => { if (stopped) return; stopped = true; galleries.forEach(api => api.destroy()); files.forEach(api => api.destroy()); media.destroy(root); };
}
