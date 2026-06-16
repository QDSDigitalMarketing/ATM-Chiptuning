#!/usr/bin/env node
// ════════════════════════════════════════════════════════════
// WooCommerce product CSV  →  catalog.js
//
//   npm run import -- path/to/wc-product-export.csv
//   npm run import -- export.csv --dry        (report only, no write)
//
// Export from WooCommerce: WP Admin → Products → Export → Generate CSV.
// This rewrites only the block between the AUTOGEN markers in
// js/data/catalog.js; your settings / fitment / extras are untouched.
//
// Prices: uses Sale price if present, else Regular price. Assumes the
// store shows prices INCLUDING VAT (typical SA WooCommerce). Adjust
// settings.pricesIncludeVat in catalog.js if not.
// ════════════════════════════════════════════════════════════
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const csvPath = args.find(a => !a.startsWith('--'));
const DRY = args.includes('--dry');
const CATALOG = fileURLToPath(new URL('../js/data/catalog.js', import.meta.url));
const START = '// <<<CATALOG_AUTOGEN_START>>>';
const END = '// <<<CATALOG_AUTOGEN_END>>>';

if (!csvPath) {
  console.error('Usage: npm run import -- <woocommerce-export.csv> [--dry]');
  process.exit(1);
}

// ── Minimal RFC-4180 CSV parser (quotes, commas + newlines in quotes) ──
function parseCSV(text) {
  const rows = []; let row = [], field = '', q = false;
  text = text.replace(/^﻿/, ''); // strip BOM
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// ── Helpers ──────────────────────────────────────────────────
const strip = (s) => (s || '')
  .replace(/<[^>]*>/g, ' ')        // html tags
  .replace(/&[a-z]+;/gi, ' ')      // html entities
  .replace(/\\[rnt]/g, ' ')        // literal \n \r \t escape sequences
  .replace(/[\r\n\t]+/g, ' ')      // real newlines/tabs
  .replace(/\s+/g, ' ').trim();
const clip = (s, n = 64) => { s = strip(s); if (s.length <= n) return s; const c = s.slice(0, n); const sp = c.lastIndexOf(' '); return (sp > 30 ? c.slice(0, sp) : c).trim() + '…'; };
const slug = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
const num = (s) => { const n = parseFloat(String(s || '').replace(/[^0-9.]/g, '')); return isNaN(n) ? 0 : Math.round(n); };

const BRANDS = ['Rockford Fosgate', 'Rockford', 'Helix', 'DUDU Auto', 'DUDU', 'Match', 'SmartNavi', 'Brax', 'Audison', 'Hertz',
  'Pioneer', 'Alpine', 'JBL', 'Kenwood', 'Sony', 'Focal', 'JL Audio', 'Kicker', 'AudioControl', 'Cerwin Vega', 'Morel'];
function detectBrand(name, brandCol) {
  if (brandCol && strip(brandCol)) return strip(brandCol).split(/[;,|]/)[0].trim();
  const hay = name.toLowerCase();
  for (const b of BRANDS) if (hay.includes(b.toLowerCase())) return b === 'Rockford' ? 'Rockford Fosgate' : (b === 'DUDU' ? 'DUDU Auto' : b);
  return 'Other';
}

// zone category from Woo categories first, then product name
function classify(catText, name) {
  // Note: no trailing \b so plurals match ("Subwoofers", "Speakers", "Amplifiers").
  const t = ((catText || '') + ' ' + name).toLowerCase();
  if (/camera|dash ?cam|\bdvr\b|reverse cam|rear cam|360/.test(t)) return 'camera';
  if (/\bdsp\b|sound processor|signal processor|processor/.test(t)) return 'processor';
  if (/\bamp\b|amplifier|monoblock|mono ?block|\d[\s-]?channel/.test(t)) return 'amp';
  if (/\bsub\b|subwoofer|sub ?woofer|enclosure|bass ?tube/.test(t)) return 'sub';
  if (/speaker|coax|coaxial|component|tweeter|mid ?range|mid ?bass|6\.5|6x9|5\.25|2-?way|3-?way/.test(t)) return 'speaker';
  if (/head ?unit|android|car ?play|double ?din|2 ?din|stereo|\bradio\b|receiver|\bmedia\b|navigation/.test(t)) return 'source';
  return null; // uncategorised
}

// pseudo options appended to each category so the UI keeps "None / Factory / retain"
const PSEUDO = {
  source: [{ id: 'src-other', brand: 'Other', name: 'Imported / Other', detail: 'Client-supplied or alternative brand', price: 0 }],
  processor: [{ id: 'dsp-none', brand: '—', name: 'None (head unit DSP)', detail: 'Using head-unit built-in DSP', price: 0 }],
  speaker: [{ id: 'spk-factory', brand: '—', name: 'Factory (retain)', detail: 'Keep factory speakers', price: 0 }],
  sub: [{ id: 'sub-none', brand: '—', name: 'None', detail: 'No subwoofer', price: 0 }],
  amp: [{ id: 'amp-none', brand: '—', name: 'None', detail: 'No external amplifier', price: 0 }],
  camera: [{ id: 'cam-existing', brand: '—', name: 'Existing (retain)', detail: 'Keep factory camera', price: 0 },
           { id: 'cam-none', brand: '—', name: 'None', detail: 'No camera', price: 0 }]
};

// ── Run ──────────────────────────────────────────────────────
const rows = parseCSV(await readFile(csvPath, 'utf8'));
if (rows.length < 2) { console.error('CSV looks empty.'); process.exit(1); }
const header = rows[0].map(h => h.trim().toLowerCase());
const col = (...names) => { for (const n of names) { const i = header.findIndex(h => h === n || h.includes(n)); if (i >= 0) return i; } return -1; };
const C = {
  name: col('name'), sku: col('sku'), reg: col('regular price'), sale: col('sale price'),
  cats: col('categories'), tags: col('tags'), sdesc: col('short description'), desc: col('description'),
  type: col('type'), pub: col('published'), vis: col('visibility'), brand: col('brand')
};
if (C.name < 0) { console.error('No "Name" column found — is this a WooCommerce product export?'); process.exit(1); }

const out = { source: [], processor: [], speaker: [], sub: [], amp: [], camera: [] };
const ids = new Set();
const skipped = [], noPrice = [];
let considered = 0;

for (const r of rows.slice(1)) {
  if (!r.length || !r[C.name]) continue;
  const type = (C.type >= 0 ? r[C.type] : 'simple').toLowerCase();
  if (type === 'variation') continue; // skip variations; keep parent
  if (C.pub >= 0 && String(r[C.pub]).trim() === '-1') continue; // draft
  considered++;
  const name = strip(r[C.name]);
  const cats = C.cats >= 0 ? r[C.cats] : '';
  const cat = classify(cats, name);
  if (!cat) { skipped.push(name); continue; }
  const price = num(C.sale >= 0 && r[C.sale] ? r[C.sale] : r[C.reg]);
  if (!price) noPrice.push(name);
  let id = slug(C.sku >= 0 && r[C.sku] ? r[C.sku] : name) || slug(name);
  while (ids.has(id)) id += '-x';
  ids.add(id);
  const detail = clip((C.sdesc >= 0 ? r[C.sdesc] : '') || (C.desc >= 0 ? r[C.desc] : ''));
  out[cat].push({ id, brand: detectBrand(name, C.brand >= 0 ? r[C.brand] : ''), name, detail, price });
}

// append pseudo options (avoid id clashes)
for (const k of Object.keys(out)) for (const p of PSEUDO[k]) if (!ids.has(p.id)) out[k].push(p);

// ── Report ───────────────────────────────────────────────────
console.log(`\nWooCommerce import — ${csvPath}`);
console.log(`  rows considered: ${considered}`);
for (const k of Object.keys(out)) console.log(`  ${k.padEnd(10)} ${out[k].length} items`);
if (noPrice.length) console.log(`  ⚠ ${noPrice.length} mapped item(s) had no price (POA): ${noPrice.slice(0, 6).join(', ')}${noPrice.length > 6 ? '…' : ''}`);
if (skipped.length) console.log(`  ⚠ ${skipped.length} uncategorised (skipped): ${skipped.slice(0, 8).join(', ')}${skipped.length > 8 ? '…' : ''}`);

const total = Object.values(out).reduce((s, a) => s + a.length, 0);
if (total - Object.values(PSEUDO).flat().length <= 0) { console.error('\nNo products mapped — check the CSV / category names.'); process.exit(1); }

// ── Serialise + splice into catalog.js ───────────────────────
const esc = (s) => JSON.stringify(String(s ?? ''));
const itemLine = (p) => `    { id:${esc(p.id)}, brand:${esc(p.brand)}, name:${esc(p.name)}, detail:${esc(p.detail)}, price:${p.price} }`;
const block = 'export const catalog = {\n' +
  Object.entries(out).map(([k, list]) => `  ${k}: [\n${list.map(itemLine).join(',\n')}\n  ]`).join(',\n') +
  '\n};';

if (DRY) { console.log('\n--dry: no files written.'); process.exit(0); }

const src = await readFile(CATALOG, 'utf8');
const a = src.indexOf(START), b = src.indexOf(END);
if (a < 0 || b < 0) { console.error('AUTOGEN markers not found in catalog.js'); process.exit(1); }
const next = src.slice(0, a + START.length) + '\n' + block + '\n' + src.slice(b);
await writeFile(CATALOG, next);
console.log(`\n✓ Wrote ${total} catalog entries into js/data/catalog.js`);
console.log('  Review prices, set PRICES_CONFIRMED = true, then commit.');
