export type FileEntry = { id: string; parentId: string | null; name: string; kind: 'folder'; trashed?: boolean } | { id: string; parentId: string | null; name: string; kind: 'file'; file: File; trashed?: boolean };
export type FileOperation = { type: 'import' | 'folder' | 'file' | 'rename' | 'move' | 'trash' | 'restore'; id?: string; count?: number };
export type FileBrowser = { importFiles(files: Iterable<File>, options?: { parentId?: string | null; relativePaths?: boolean }): Promise<boolean>; getEntries(): FileEntry[]; destroy(): void };
export function createFileBrowser(element: HTMLElement, options?: { entries?: FileEntry[]; onChange?: (entries: FileEntry[], context: { operation: FileOperation; signal: AbortSignal }) => void | Promise<void> }): FileBrowser;
export function initFileBrowsers(root?: Document | HTMLElement): () => void;
