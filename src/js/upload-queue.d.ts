export type UploadProgress = { loaded: number; total: number | null };
export type UploadItem = { id: string; name: string; size: number; type: string; state: 'queued' | 'uploading' | 'uploaded' | 'cancelled' | 'error'; loaded: number; total: number | null; error: string };
export type UploadContext = { id: string; signal: AbortSignal; onProgress(progress: UploadProgress): void };
export type UploadCallback = (file: File, context: UploadContext) => Promise<unknown>;
export function uploadFile(url: string, file: Blob, options?: { signal?: AbortSignal; onProgress?: (progress: UploadProgress) => void; headers?: Record<string, string>; method?: 'POST' | 'PUT'; timeout?: number; withCredentials?: boolean }): Promise<unknown>;
export function createUploadQueue(element: HTMLElement, options?: { accept?: string; maxFileSize?: number; maxFiles?: number; concurrency?: number; upload?: UploadCallback }): { addFiles(files: Iterable<File>): void; start(id?: string): void; cancel(id?: string): void; remove(id: string): void; clear(): void; getFiles(): File[]; getState(): UploadItem[]; destroy(): void };
