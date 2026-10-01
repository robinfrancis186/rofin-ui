import { matches } from './utils.js';

/** Opt-in effects. Content is visible without JS and stays visible on teardown. */
export function initEffects(root = document) {
  const controller = new AbortController();
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = matches(root, '[data-rf-reveal]');
  let observer;
  const showAll = () => reveal.forEach(element => element.setAttribute('data-rf-revealed', ''));
  if (!media.matches && typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.setAttribute('data-rf-revealed', ''); observer.unobserve(entry.target);
      }
    }, { threshold: 0.05 });
    reveal.forEach(element => { element.setAttribute('data-rf-reveal-ready', ''); observer.observe(element); });
  } else showAll();
  media.addEventListener('change', () => { if (media.matches) { observer?.disconnect(); showAll(); } }, { signal: controller.signal });
  const cleanups = [];
  for (const element of matches(root, '[data-rf-spotlight]')) {
    let frame;
    let pointer;
    const reset = () => { cancelAnimationFrame(frame); frame = undefined; element.style.removeProperty('--rf-pointer-x'); element.style.removeProperty('--rf-pointer-y'); };
    element.addEventListener('pointermove', event => {
      if (media.matches || event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--rf-pointer-x', `${pointer.x - rect.left}px`);
        element.style.setProperty('--rf-pointer-y', `${pointer.y - rect.top}px`);
        frame = undefined;
      });
    }, { signal: controller.signal });
    element.addEventListener('pointerleave', reset, { signal: controller.signal });
    media.addEventListener('change', () => { if (media.matches) reset(); }, { signal: controller.signal });
    cleanups.push(reset);
  }
  return () => { controller.abort(); observer?.disconnect(); showAll(); cleanups.forEach(cleanup => cleanup()); };
}
