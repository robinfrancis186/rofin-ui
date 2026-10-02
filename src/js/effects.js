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
  for (const element of matches(root, '[data-rf-spotlight], [data-rf-tilt], [data-rf-magnetic]')) {
    let frame;
    let pointer;
    const reset = () => { cancelAnimationFrame(frame); frame = undefined; for (const name of ['pointer-x', 'pointer-y', 'tilt-x', 'tilt-y', 'magnetic-x', 'magnetic-y']) element.style.removeProperty(`--rf-${name}`); };
    element.addEventListener('pointermove', event => {
      if (media.matches || event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty('--rf-pointer-x', `${pointer.x - rect.left}px`);
        element.style.setProperty('--rf-pointer-y', `${pointer.y - rect.top}px`);
        if (element.hasAttribute('data-rf-tilt')) {
          element.style.setProperty('--rf-tilt-x', `${(0.5 - (pointer.y - rect.top) / rect.height) * 12}deg`);
          element.style.setProperty('--rf-tilt-y', `${((pointer.x - rect.left) / rect.width - 0.5) * 12}deg`);
        }
        if (element.hasAttribute('data-rf-magnetic')) {
          element.style.setProperty('--rf-magnetic-x', `${((pointer.x - rect.left) / rect.width - 0.5) * 10}px`);
          element.style.setProperty('--rf-magnetic-y', `${((pointer.y - rect.top) / rect.height - 0.5) * 10}px`);
        }
        frame = undefined;
      });
    }, { signal: controller.signal });
    element.addEventListener('pointerleave', reset, { signal: controller.signal });
    media.addEventListener('change', () => { if (media.matches) reset(); }, { signal: controller.signal });
    cleanups.push(reset);
  }
  return () => { controller.abort(); observer?.disconnect(); showAll(); cleanups.forEach(cleanup => cleanup()); };
}
