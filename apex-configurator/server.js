#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// APEX Customs Configurator — zero-dependency static dev server
// Usage:  node server.js            (PORT 4317, all interfaces)
//         PORT=8080 node server.js
//         node server.js --port 5000 --host 127.0.0.1
// No npm install required — uses only Node built-ins.
// ════════════════════════════════════════════════════════════
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const args = process.argv.slice(2);
const argVal = (flag, def) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : def; };
const PORT = Number(process.env.PORT || argVal('--port', 4317));
const HOST = process.env.HOST || argVal('--host', '0.0.0.0');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8'
};

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path === '/') path = '/index.html';
    // prevent path traversal
    const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
    let file = join(ROOT, safe);
    const info = await stat(file).catch(() => null);
    if (info && info.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, HOST, () => {
  const shown = HOST === '0.0.0.0' ? 'localhost' : HOST;
  console.log(`APEX Configurator dev server running:`);
  console.log(`  → http://${shown}:${PORT}`);
  if (HOST === '0.0.0.0') console.log(`  → reachable on your LAN / Tailscale IP at port ${PORT}`);
});
