// ════════════════════════════════════════════════════════════
// APEX Configurator — smoke test (zero-dep, `npm test`)
// Validates catalog/vehicle data integrity, then boots the dev
// server and checks routing, HTML live-reload injection, MIME
// types, 404 and path-traversal handling.
// ════════════════════════════════════════════════════════════
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { catalog, fitmentTiers, accessories, settings } from '../js/data/catalog.js';
import { vehicleConfigs, zoneInfo, vehicleSVGs } from '../js/data/vehicles.js';

let fails = 0;
const ok = (cond, msg) => { console.log((cond ? '✓ ' : '✗ ') + msg); if (!cond) fails++; };
const ROOT = fileURLToPath(new URL('..', import.meta.url));

// ── Data integrity ───────────────────────────────────────────
const cats = new Set(Object.values(zoneInfo).map(z => z.category));
ok([...cats].every(c => catalog[c]), 'every zone category resolves to a catalog list');
ok(Object.keys(vehicleConfigs).every(v => vehicleSVGs[v]), 'every vehicle has an SVG outline');
const ids = new Set(); let dupes = 0, badPrice = 0;
Object.values(catalog).flat().forEach(p => { if (ids.has(p.id)) dupes++; ids.add(p.id); if (typeof p.price !== 'number') badPrice++; });
ok(dupes === 0, 'product ids are unique');
ok(badPrice === 0, 'all product prices are numeric');
ok(fitmentTiers.every(t => typeof t.price === 'number') && accessories.every(a => typeof a.price === 'number'), 'fitment/extra prices are numeric');
ok(settings.vatRate > 0 && settings.currency, 'settings have VAT rate + currency');
console.log(`  (${ids.size} products across ${cats.size} categories, ${Object.keys(vehicleConfigs).length} vehicles)`);

// ── Server checks ────────────────────────────────────────────
const PORT = 4399;
const srv = spawn(process.execPath, [join(ROOT, 'server.js'), '--port', String(PORT), '--host', '127.0.0.1'], { stdio: 'ignore' });

const get = async (path) => {
  const r = await fetch(`http://127.0.0.1:${PORT}${path}`);
  return { status: r.status, type: r.headers.get('content-type') || '', text: await r.text() };
};

try {
  await new Promise(r => setTimeout(r, 500)); // let it boot
  const idx = await get('/');
  ok(idx.status === 200 && /text\/html/.test(idx.type), 'GET / → 200 html');
  ok(/APEX/.test(idx.text), 'index contains APEX branding');
  ok(/__livereload/.test(idx.text), 'live-reload snippet injected into HTML');
  const css = await get('/css/styles.css');
  ok(css.status === 200 && /text\/css/.test(css.type), 'GET css → 200 text/css');
  const js = await get('/js/app.js');
  ok(js.status === 200 && /javascript/.test(js.type), 'GET app.js → 200 javascript');
  ok((await get('/js/data/catalog.js')).status === 200, 'GET catalog.js → 200');
  ok((await get('/nope.xyz')).status === 404, 'missing file → 404');
  ok((await get('/../../etc/passwd')).status === 404, 'path traversal blocked → 404');
} catch (e) {
  ok(false, 'server checks threw: ' + e.message);
} finally {
  srv.kill();
}

console.log(fails ? `\n${fails} CHECK(S) FAILED` : '\n✓ ALL SMOKE TESTS PASSED');
process.exit(fails ? 1 : 0);
