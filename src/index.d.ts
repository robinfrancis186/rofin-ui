export type Root = Document | HTMLElement;
export type Teardown = () => void;
export interface ToastOptions {
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  /** Milliseconds; 0 disables automatic dismissal. */
  duration?: number;
}
export function init(root?: Root, options?: { observe?: boolean }): Teardown;
export function initTabs(root?: Root): Teardown;
export function initDropdowns(root?: Root): Teardown;
export function initDialogs(root?: Root): Teardown;
export function initTooltips(root?: Root): Teardown;
export function initUploads(root?: Root): Teardown;
export function toast(message: string, options?: ToastOptions): { element: HTMLDivElement; dismiss: Teardown };
export function clearToasts(): void;
