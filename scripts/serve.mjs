import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { queryGridRows } from '../src/js/data-grid.js';
import { sampleGridColumns, sampleGridRows } from '../examples/grid-data.js';
import { handleSampleUpload, cleanupSampleUploads } from './sample-upload.mjs';

const root = resolve(process.env.RF_SERVE_ROOT || '.');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
const gridRows = sampleGridRows();
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname.startsWith('/api/sample-uploads')) { await handleSampleUpload(request, response, url, port); return; }
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
    const path = decodeURIComponent(url.pathname === '/' ? '/docs/index.html' : url.pathname);
    let file = resolve(root, `.${path}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) { response.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': `${types[extname(file)] || 'application/octet-stream'}; charset=utf-8`, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(body);
  } catch { response.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Rofin UI: http://127.0.0.1:${port}`));

let stopping = false;
async function stop() { if (stopping) return; stopping = true; server.close(); server.closeAllConnections(); await cleanupSampleUploads(); process.exit(0); }
process.once('SIGINT', stop); process.once('SIGTERM', stop);
