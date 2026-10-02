import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { queryGridRows } from '../src/js/data-grid.js';
import { sampleGridColumns, sampleGridRows } from '../examples/grid-data.js';
import { handleSampleUpload, cleanupSampleUploads } from './sample-upload.mjs';
import { handleSampleTeam, cleanupSampleTeams } from './sample-team.mjs';
import { errorPage } from './error-pages.mjs';

const root = resolve(process.env.RF_SERVE_ROOT || '.');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.wav': 'audio/wav', '.vtt': 'text/vtt' };
const gridRows = sampleGridRows();
const rootIndex = await stat(resolve(root, 'docs/index.html')).then(() => '/docs/index.html', () => '/index.html');
async function sendError(request, response, code) {
  const kind = code === 404 ? '404' : code === 403 ? 'permission' : 'server';
  let body;
  try { body = await readFile(resolve(root, `${code}.html`)); }
  catch { body = Buffer.from(await errorPage(kind, rootIndex)); }
  response.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': body.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(request.method === 'HEAD' ? undefined : body);
}
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname.startsWith('/api/sample-teams')) { await handleSampleTeam(request, response, url, port); return; }
    if (url.pathname.startsWith('/api/sample-uploads')) { await handleSampleUpload(request, response, url, port); return; }
    // Explicit read-only HTTP status fixtures, never a production account service.
    if (url.pathname.startsWith('/api/sample-recovery/')) {
      const mode = url.pathname.slice('/api/sample-recovery/'.length), code = mode === 'permission' ? 403 : mode === 'server' ? 500 : 404;
      response.setHeader('Cache-Control', 'no-store'); response.setHeader('Content-Type', 'application/json'); response.setHeader('X-Content-Type-Options', 'nosniff');
      if (request.method !== 'GET') { response.writeHead(405, { Allow: 'GET' }).end(JSON.stringify({ error: 'This fixture only permits reads.' })); return; }
      response.writeHead(code).end(JSON.stringify({ error: 'Read-only recovery status fixture.' })); return;
    }
    if (url.pathname === '/api/sample-grid') {
      response.setHeader('Content-Type', 'application/json'); response.setHeader('Cache-Control', 'no-store'); response.setHeader('X-Content-Type-Options', 'nosniff');
      if (request.method !== 'GET') { response.writeHead(405, { Allow: 'GET' }).end(JSON.stringify({ error: 'The public sample is read only.' })); return; }
      try {
        const query = url.searchParams.get('query') || '{}'; if (query.length > 8192) throw Error('Query too long.');
        const { rows, total, page, pageSize } = queryGridRows(gridRows, sampleGridColumns, JSON.parse(query));
        response.writeHead(200).end(JSON.stringify({ rows, total, page, pageSize }));
      } catch { response.writeHead(400).end(JSON.stringify({ error: 'Invalid grid query.' })); }
      return;
    }
    const path = decodeURIComponent(url.pathname === '/' ? rootIndex : url.pathname);
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) { await sendError(request, response, 403); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
    const body = await readFile(file);
    const type = types[extname(file)] || 'application/octet-stream';
    const headers = { 'Content-Type': type + (/^(text\/|image\/svg|application\/json)/.test(type) ? '; charset=utf-8' : ''), 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' };
    let content = body, code = 200;
    if (request.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range); let start, end;
      if (range && (range[1] || range[2])) {
        start = range[1] ? Number(range[1]) : Math.max(0, body.length - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      }
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= body.length || end < start || !range[1] && Number(range[2]) === 0) { response.writeHead(416, { ...headers, 'Content-Range': `bytes */${body.length}` }).end(); return; }
      content = body.subarray(start, end + 1); code = 206; headers['Content-Range'] = `bytes ${start}-${end}/${body.length}`;
    }
    response.writeHead(code, { ...headers, 'Content-Length': content.length });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (cause) {
    if (response.headersSent) { response.destroy(); return; }
    if (cause instanceof URIError) { response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' }).end(request.method === 'HEAD' ? undefined : 'Invalid address.'); return; }
    try { await sendError(request, response, ['ENOENT', 'ENOTDIR'].includes(cause.code) ? 404 : ['EACCES', 'EPERM'].includes(cause.code) ? 403 : 500); }
    catch { response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end(request.method === 'HEAD' ? undefined : 'Resource unavailable.'); }
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Rofin UI: http://127.0.0.1:${port}`));

let stopping = false;
async function stop() { if (stopping) return; stopping = true; server.close(); server.closeAllConnections(); cleanupSampleTeams(); await cleanupSampleUploads(); process.exit(0); }
process.once('SIGINT', stop); process.once('SIGTERM', stop);
