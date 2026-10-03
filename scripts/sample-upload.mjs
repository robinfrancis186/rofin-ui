import { mkdtemp, open, rm, readFile, rename } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

const maxSize = 8388608, quota = 67108864, files = new Map(), active = new Map();
let directory;
const storage = () => directory ||= mkdtemp(join(tmpdir(), 'rofin-ui-upload-'));
const fail = (status, message) => Object.assign(Error(message), { status });
const send = (response, status, body) => { if (!response.destroyed && !response.writableEnded) response.writeHead(status).end(JSON.stringify(body)); };
const validID = value => /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(value);
const delay = Math.min(100, Math.max(0, Number(process.env.RF_UPLOAD_DELAY_MS) || 0));

function type(name, first, last, bytes, textValid) {
  const extension = name.toLowerCase().split('.').pop();
  if (extension === 'txt' && textValid) return 'text/plain';
  if (extension === 'png' && bytes >= 45 && first.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && first.toString('ascii', 12, 16) === 'IHDR' && first.readUInt32BE(16) > 0 && first.readUInt32BE(16) <= 10000 && first.readUInt32BE(20) > 0 && first.readUInt32BE(20) <= 10000 && last.toString('ascii', last.length - 8, last.length - 4) === 'IEND') return 'image/png';
  if (['jpg', 'jpeg'].includes(extension) && bytes >= 4 && first[0] === 255 && first[1] === 216 && first[2] === 255 && last[last.length - 2] === 255 && last[last.length - 1] === 217) return 'image/jpeg';
  if (extension === 'webp' && bytes >= 20 && first.toString('ascii', 0, 4) === 'RIFF' && first.toString('ascii', 8, 12) === 'WEBP' && first.readUInt32LE(4) + 8 === bytes) return 'image/webp';
  if (extension === 'pdf' && first.toString('ascii', 0, 5) === '%PDF-' && /%%EOF\s*$/.test(last.toString('ascii'))) return 'application/pdf';
  throw fail(415, 'The file content does not match an accepted PNG, JPEG, WebP, PDF or UTF-8 text file.');
}

/** Public localhost samples, never a replacement for authorized production storage. */
export async function handleSampleUpload(request, response, url, port) {
  response.setHeader('Content-Type', 'application/json'); response.setHeader('Cache-Control', 'no-store'); response.setHeader('X-Content-Type-Options', 'nosniff'); response.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  let path, file, id, ownsActive = false;
  try {
    const host = new URL(`http://${request.headers.host}`); if (!['127.0.0.1', 'localhost', '[::1]'].includes(host.hostname) || host.port !== String(port)) throw fail(403, 'Use the local development origin.');
    if (request.headers.origin) { const origin = new URL(request.headers.origin); if (!['127.0.0.1', 'localhost', '[::1]'].includes(origin.hostname) || origin.port !== String(port) || origin.protocol !== 'http:') throw fail(403, 'Use the local development origin.'); }
    for (const [key, value] of files) if (value.expiresAt < Date.now() && !active.has(key)) { files.delete(key); await rm(join(await storage(), key), { force: true }); }
    const suffix = url.pathname.slice('/api/sample-uploads'.length);
    if (suffix) {
      id = suffix.slice(1).toLowerCase(); if (!/^\/[a-f\d-]+$/i.test(suffix) || !validID(id) || !files.has(id)) throw fail(404, 'Sample file not found.');
      const saved = files.get(id);
      if (request.method === 'GET') {
        response.setHeader('Content-Type', saved.type); response.setHeader('Content-Disposition', `attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(saved.name).replace(/['()*]/g, character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`)}`);
        response.writeHead(200).end(await readFile(join(await storage(), id))); return;
      }
      if (request.method === 'DELETE') { await rm(join(await storage(), id), { force: true }); files.delete(id); send(response, 200, { deleted: id }); return; }
      response.setHeader('Allow', 'GET, DELETE'); throw fail(405, 'Use GET or DELETE for a sample file.');
    }
    if (request.method === 'GET') { send(response, 200, { files: [...files.values()], active: [...active.values()].map(({ id, received }) => ({ id, received })) }); return; }
    if (request.method !== 'POST') { response.setHeader('Allow', 'GET, POST'); throw fail(405, 'Use POST for binary sample uploads.'); }
    if ((request.headers['content-type'] || '').split(';')[0].trim().toLowerCase() !== 'application/octet-stream') throw fail(415, 'Send a binary file body.');
    const name = url.searchParams.get('name'); id = (url.searchParams.get('id') || randomUUID()).toLowerCase();
    if (!validID(id) || !name || Buffer.byteLength(name) > 255 || /[\x00-\x1f\x7f/\\]/.test(name) || !/\.(png|jpe?g|webp|pdf|txt)$/i.test(name)) throw fail(400, 'Provide a valid file name and upload ID.');
    const length = request.headers['content-length']; if (length != null && (!/^\d+$/.test(length) || Number(length) < 1 || Number(length) > maxSize)) throw fail(413, 'Files must contain 1 byte to 8 MB.');
    if (active.has(id)) throw fail(409, 'This upload is still finishing. Retry shortly.');
    const previous = files.get(id), reserved = Number(length) || maxSize;
    // ponytail: this temporary localhost receiver holds 64 MB and 20 receipts; production supplies authorized durable storage.
    if (active.size >= 8 || !previous && files.size + active.size >= 20 || !previous && [...files.values()].reduce((total, item) => total + item.size, 0) + [...active.values()].reduce((total, item) => total + item.reserved, 0) + reserved > quota) throw fail(507, 'The temporary sample receiver is full. Remove sample files or restart it.');
    const running = { id, reserved, received: 0 }; active.set(id, running); ownsActive = true;
    if (!previous) { path = join(await storage(), `${id}.${randomUUID()}.part`); file = await open(path, 'wx'); }
    const hash = createHash('sha256'), decoder = new TextDecoder('utf-8', { fatal: true }); let first = Buffer.alloc(0), last = Buffer.alloc(0), textValid = true, gone = false;
    const closed = () => { if (!response.writableFinished) gone = true; }; response.on('close', closed);
    try {
      for await (const chunk of request) {
        running.received += chunk.length; if (running.received > maxSize || !previous && running.received > reserved) throw fail(413, 'File exceeds the sample limit.');
        if (gone) throw fail(499, 'Transfer cancelled.'); hash.update(chunk); first = Buffer.concat([first, chunk.subarray(0, Math.max(0, 32 - first.length))]); last = Buffer.concat([last, chunk]).subarray(-1024);
        if (textValid) { try { if (chunk.includes(0)) textValid = false; else decoder.decode(chunk, { stream: true }); } catch { textValid = false; } }
        if (file) await file.writeFile(chunk); if (delay) await new Promise(resolve => setTimeout(resolve, delay));
      }
      if (!request.complete || gone || response.destroyed) throw fail(499, 'Transfer cancelled.');
      if (!running.received || length != null && running.received !== Number(length)) throw fail(400, 'The file body was incomplete.');
      if (textValid) try { decoder.decode(); } catch { textValid = false; }
      const detected = type(name, first, last, running.received, textValid), sha256 = hash.digest('hex');
      if (previous) {
        if (previous.name !== name || previous.size !== running.received || previous.sha256 !== sha256) throw fail(409, 'This upload ID already belongs to different content.');
        previous.expiresAt = Date.now() + 900000; send(response, 200, previous); return;
      }
      await file.close(); file = null;
      const final = join(await storage(), id);
      await rename(path, final); path = final;
      if (gone || response.destroyed) throw fail(499, 'Transfer cancelled.');
      const receipt = { id, name, size: running.received, type: detected, sha256, expiresAt: Date.now() + 900000 }; files.set(id, receipt); send(response, 201, receipt); path = null;
    } finally { response.removeListener('close', closed); }
  } catch (error) { if (!request.complete) request.resume(); send(response, error.status || 400, { error: error.message || 'The upload was interrupted.' }); }
  finally { if (file) await file.close().catch(() => {}); if (path) await rm(path, { force: true }); if (ownsActive) active.delete(id); }
}

export async function cleanupSampleUploads() { if (directory) await rm(await directory, { recursive: true, force: true }); files.clear(); active.clear(); }
