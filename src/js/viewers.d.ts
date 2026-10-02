export function createLightbox(element: HTMLElement): { destroy(): void };
export function createFileViewer(element: HTMLElement): { open(file: File): Promise<boolean>; destroy(): void };
export function initViewers(root?: Document | HTMLElement): () => void;
