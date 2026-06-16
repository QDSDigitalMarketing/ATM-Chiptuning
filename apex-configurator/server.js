#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// APEX Customs Configurator — zero-dependency dev server
// with live-reload (auto-refreshes the browser on file save).
//
// Usage:  npm run dev                 (PORT 4317, all interfaces)
//         PORT=8080 npm run dev
//         node server.js --port 5000 --host 127.0.0.1
//         node server.js --no-reload  (serve static, no live-reload)
//
// No npm install required — uses only Node built-ins (Node >= 18).
// Live-reload is injected at serve-time only, so a static host
// (e.g. GitHub Pages) serves the clean files without it.
// ════════════════════════════════════════════════════════════
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const args = process.argv.slice(2);
const argVal = (flag, def) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : def; };
const PORT = Number(process.env.PORT || argVal('--port', 4317));
const HOST = process.env.HOST || argVal('--host', '0.0.0.0');
const RELOAD = !args.includes('--no-reload');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8'
};

// Live-reload client, injected before </body> in HTML responses.
const RELOAD_SNIPPET = `<script>(()=>{let es;const c=()=>{es=new EventSource('/__livereload');
es.onmessage=e=>{if(e.data==='reload')location.reload()};es.onerror=()=>{es.close();setTimeout(c,1000)}};c();})();</script>`;

const clients = new Set();
function broadcastReload() { for (const res of clients) res.write('data: reload\n\n'); }

if (RELOAD) {
  let timer;
  watch(ROOT, { recursive: true }, (_e, file) => {
    if (file && /(node_modules|\.git)/.test(file)) return;
    clearTimeout(timer);
    timer = setTimeout(broadcastReload, 80); // debounce burst saves
  });
}

const server = createServer(async (req, res) => {
  // Live-reload event stream
  if (RELOAD && req.url === '/__livereload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/') path = '/index.html';
    const safe = normalize(path).replace(/^(\.\.[/\\])+/, ''); // block path traversal
    let file = join(ROOT, safe);
    const info = await stat(file).catch(() => null);
    if (info && info.isDirectory()) file = join(file, 'index.html');
    let body = await readFile(file);
    const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
    if (RELOAD && type.startsWith('text/html')) {
      body = Buffer.from(body.toString().replace('</body>', RELOAD_SNIPPET + '</body>'));
    }
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, HOST, () => {
  const shown = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log('APEX Configurator dev server' + (RELOAD ? ' (live-reload on)' : '') + ':');
  console.log(`  → http://${shown}:${PORT}`);
  if (HOST === '0.0.0.0') console.log(`  → on your LAN / Tailscale IP at port ${PORT}`);
});
