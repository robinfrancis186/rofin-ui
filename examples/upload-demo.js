import { createUploadQueue, uploadFile } from '../src/js/upload-queue.js';

export function initUploadExamples(root) {
  const cleanups = [];
  for (const element of root.querySelectorAll('[data-rf-upload-queue]')) {
    const local = ['127.0.0.1', 'localhost', '[::1]'].includes(location.hostname);
    const queue = createUploadQueue(element, local ? { upload: (file, { id, signal, onProgress }) => uploadFile(`/api/sample-uploads?name=${encodeURIComponent(file.name)}&id=${id}`, file, { signal, onProgress, headers: { 'Content-Type': 'application/octet-stream' } }) } : {});
    const note = element.querySelector('[data-rf-upload-demo-note]');
    if (note) note.textContent = local ? 'Upload sends files to the local sample receiver. Its temporary files expire after 15 minutes or when the server stops. Authorized durable storage belongs to your application.' : 'This static preview keeps files on your device. Upload is available with the repository development server or your own application callback.';
    cleanups.push(() => queue.destroy());
  }
  return () => cleanups.forEach(cleanup => cleanup());
}
