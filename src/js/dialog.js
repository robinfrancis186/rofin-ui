export function initDialogs(root = document) {
  const controller = new AbortController();
  root.addEventListener('click', event => {
    const open = event.target.closest('[data-rf-dialog-open]');
    if (open && !open.disabled && open.getAttribute('aria-disabled') !== 'true') {
      const dialog = root.ownerDocument?.getElementById(open.dataset.rfDialogOpen) || document.getElementById(open.dataset.rfDialogOpen);
      if (dialog instanceof HTMLDialogElement && !dialog.open) {
        event.preventDefault(); dialog.showModal();
      }
    }
    const close = event.target.closest('[data-rf-dialog-close]');
    if (close && !close.disabled) {
      const dialog = close.closest('dialog');
      if (dialog) { event.preventDefault(); dialog.close(close.dataset.rfDialogClose || ''); }
    }
  }, { signal: controller.signal });
  // Native dialogs own focus trapping, Escape, and restoration. Backdrop dismissal is opt-in.
  let backdropStart;
  root.addEventListener('pointerdown', event => {
    backdropStart = undefined;
    if (!(event.target instanceof HTMLDialogElement) || !event.target.hasAttribute('data-rf-backdrop-close')) return;
    const rect = event.target.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) backdropStart = event.target;
  }, { signal: controller.signal });
  root.addEventListener('pointerup', event => {
    if (backdropStart === event.target) {
      const rect = event.target.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close();
    }
    backdropStart = undefined;
  }, { signal: controller.signal });
  return () => controller.abort();
}
