const active = new Set();

/** Text-only notifications. Duration 0 persists; hover, focus and hidden tabs pause timers. */
export function toast(message, { title = '', variant = 'info', duration = 5000 } = {}) {
  if (typeof document === 'undefined' || !document.body) throw new Error('toast() requires a browser document with a body.');
  let region = document.querySelector('[data-rf-toast-region]');
  if (!region) {
    region = document.createElement('div');
    region.className = 'rf-toast-region';
    region.dataset.rfToastRegion = '';
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', 'Notifications');
    document.body.append(region);
  }
  const element = document.createElement('div');
  element.className = 'rf-toast';
  element.dataset.variant = variant;
  const content = document.createElement('div');
  content.setAttribute('role', variant === 'danger' ? 'alert' : 'status');
  content.setAttribute('aria-atomic', 'true');
  const heading = document.createElement('strong');
  heading.className = 'rf-toast__title';
  const text = document.createElement('span');
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'rf-toast__close';
  close.setAttribute('aria-label', 'Dismiss notification');
  close.textContent = '×';
  content.append(heading, text);
  element.append(content, close);
  region.append(element);
  // Populate an already-mounted live region; never interpret message text as HTML.
  heading.textContent = String(title);
  if (!title) heading.hidden = true;
  text.textContent = String(message);
  let remaining = Number.isFinite(duration) && duration > 0 ? duration : 0;
  let started = 0;
  let timer;
  let dismissed = false;
  const previousFocus = document.activeElement;
  const controller = new AbortController();
  function dismiss() {
    if (dismissed) return;
    const restoreFocus = element.contains(document.activeElement);
    dismissed = true; clearTimeout(timer); controller.abort(); element.remove(); active.delete(dismiss);
    if (restoreFocus && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    if (!region.childElementCount) region.remove();
  }
  function pause() {
    if (!timer) return;
    clearTimeout(timer); timer = undefined;
    remaining = Math.max(1, remaining - (performance.now() - started));
  }
  function resume() {
    if (dismissed || timer || !remaining || document.hidden || element.matches(':hover') || element.contains(document.activeElement)) return;
    started = performance.now(); timer = setTimeout(dismiss, remaining);
  }
  const options = { signal: controller.signal };
  close.addEventListener('click', dismiss, options);
  element.addEventListener('pointerenter', pause, options);
  element.addEventListener('pointerleave', resume, options);
  element.addEventListener('focusin', pause, options);
  element.addEventListener('focusout', () => queueMicrotask(resume), options);
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume(), options);
  active.add(dismiss); resume();
  return { element, dismiss };
}

export function clearToasts() { for (const dismiss of active) dismiss(); }
