/** Absolute HTTP, HTTPS or mailto URL without credentials/control characters; otherwise null. */
export function editorLink(value: string): string | null;
/** Bounded rich-note HTML only. Requires a Document; validate persisted HTML on the server separately. */
export function sanitizeRichText(value: string, document?: Document): string;
/** Render the documented Markdown subset as safe DOM nodes. Throws on excessive input. */
export function renderMarkdown(value: string, target: HTMLElement): void;
/** Enhance rich-text/Markdown example markup; returned function removes this root's listeners. */
export function initEditors(root?: Document | HTMLElement): () => void;
