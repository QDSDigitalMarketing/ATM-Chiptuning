// ════════════════════════════════════════════════════════════
// APEX CUSTOMS — Sound System Studio  ·  app logic
// ════════════════════════════════════════════════════════════
import { vehicleSVGs, vehicleConfigs, zoneInfo, vehicleIcon } from './data/vehicles.js';
import { catalog, fitmentTiers, accessories, settings, PRICES_CONFIRMED } from './data/catalog.js';

const STORE_KEY = 'apex.configurator.build.v1';
const $ = (id) => document.getElementById(id);
const isMobile = () => window.matchMedia('(max-width:980px)').matches;

// ── State ────────────────────────────────────────────────────
let state = freshState('doublecab');
let activeZone = null;
let quoted = false;
let lastTotal = 0;
let productQuery = '';

function freshState(vehicle) {
  return { vehicle, zones: {}, fitment: '', accessories: [], customer: {} };
}

// ── Helpers ──────────────────────────────────────────────────
const money = (n) => settings.currency + ' ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const isPoa = (p) => (!p.price) && !/none|factory|existing|retain|head unit dsp/i.test(p.name);
const priceLabel = (p) => isPoa(p) ? 'POA' : (p.price ? money(p.price) : '—');
const findProduct = (cat, id) => (catalog[cat] || []).find(p => p.id === id) || null;
const isPoaTier = (t) => !t.price && /custom|quote/i.test(t.name);

// ── Vehicle picker ───────────────────────────────────────────
function renderVehicleGrid() {
  const grid = $('vehicleGrid');
  grid.innerHTML = '';
  Object.entries(vehicleConfigs).forEach(([key, cfg]) => {
    const btn = document.createElement('button');
    btn.className = `vehicle-btn ${key === state.vehicle ? 'active' : ''}`;
    btn.innerHTML = `${vehicleIcon(key)}<div class="v-label">${cfg.label}</div>`;
    btn.onclick = () => selectVehicle(key);
    grid.appendChild(btn);
  });
}

function selectVehicle(type) {
  const valid = Object.keys(vehicleConfigs[type].zones);
  Object.keys(state.zones).forEach(z => { if (!valid.includes(z)) delete state.zones[z]; });
  state.vehicle = type;
  activeZone = null;
  renderAll();
  toast(`${vehicleConfigs[type].label} selected`);
}

// ── Car + hotspots ───────────────────────────────────────────
function renderCar() {
  // Vehicle artwork: try a top-down render (assets/vehicles/<type>.webp);
  // fall back to the built-in SVG schematic until artwork is dropped in.
  $('carSvg').innerHTML = vehicleSVGs[state.vehicle];
  $('stageVehicle').textContent = vehicleConfigs[state.vehicle].label;
  const canvas = $('carCanvas'), img = $('carImg');
  img.classList.remove('loaded'); canvas.classList.remove('has-img');
  img.dataset.ext = 'webp';
  img.onload = () => { img.classList.add('loaded'); canvas.classList.add('has-img'); };
  img.onerror = () => {
    if (img.dataset.ext === 'webp') { img.dataset.ext = 'png'; img.src = `assets/vehicles/${state.vehicle}.png`; }
    else { img.classList.remove('loaded'); canvas.classList.remove('has-img'); } // fall back to SVG schematic
  };
  img.src = `assets/vehicles/${state.vehicle}.webp`;

  const host = $('hotspots');
  host.innerHTML = '';
  Object.entries(vehicleConfigs[state.vehicle].zones).forEach(([zoneId, pos]) => {
    const info = zoneInfo[zoneId];
    const dot = document.createElement('div');
    dot.className = `hotspot ${state.zones[zoneId] ? 'has-product' : ''} ${activeZone === zoneId ? 'editing' : ''}`;
    dot.style.left = pos.x + '%';
    dot.style.top = pos.y + '%';
    dot.innerHTML = `<div class="hotspot-pulse"></div><div class="hotspot-dot"></div><div class="hotspot-label">${info.label}</div>`;
    dot.onclick = () => { selectZone(zoneId); if (isMobile()) openDrawer('panelRight'); };
    host.appendChild(dot);
  });
  renderConnections();
}

// Animated signal routing: head unit → (DSP) → amp → speakers/sub.
function renderConnections() {
  const zones = vehicleConfigs[state.vehicle].zones;
  const has = (id) => state.zones[id] && zones[id];
  const pt = (id) => zones[id];
  const lines = [];
  const hub = has('amp') ? 'amp' : (has('headunit') ? 'headunit' : null);
  if (hub) {
    if (has('headunit') && hub !== 'headunit') {
      if (has('dsp')) { lines.push(['headunit', 'dsp'], ['dsp', 'amp']); }
      else lines.push(['headunit', 'amp']);
    }
    ['tweeterL', 'tweeterR', 'frontL', 'frontR', 'rearL', 'rearR', 'sub'].forEach(s => { if (has(s)) lines.push([hub, s]); });
  }
  $('connLines').innerHTML = lines.map(([a, b]) => {
    const p = pt(a), q = pt(b);
    return `<line class="conn-line" x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}"/>`;
  }).join('');
}

// ── Zone list + progress ─────────────────────────────────────
function renderZoneList() {
  const list = $('zoneList');
  const zones = vehicleConfigs[state.vehicle].zones;
  list.innerHTML = '';
  const categories = { source:'Source', processor:'Processing', speaker:'Speakers', sub:'Bass', amp:'Power', camera:'Cameras' };
  const grouped = {};
  Object.keys(zones).forEach(z => { const c = zoneInfo[z].category; (grouped[c] = grouped[c] || []).push(z); });
  Object.entries(categories).forEach(([cat, title]) => {
    if (!grouped[cat]) return;
    const sec = document.createElement('div');
    sec.innerHTML = `<div class="zone-cat-title">${title}</div>`;
    grouped[cat].forEach(zoneId => {
      const info = zoneInfo[zoneId];
      const chosen = state.zones[zoneId];
      const item = document.createElement('div');
      item.className = `zone-item ${chosen ? 'placed' : ''} ${activeZone === zoneId ? 'editing' : ''}`;
      item.innerHTML = `<span class="zi-name">${info.icon} ${info.label}</span>
        <span class="zi-status">${chosen ? '✓ ' + chosen.name : 'Empty'}</span>`;
      item.onclick = () => { selectZone(zoneId); if (isMobile()) openDrawer('panelRight'); };
      sec.appendChild(item);
    });
    list.appendChild(sec);
  });
  // progress
  const total = Object.keys(zones).length;
  const done = Object.keys(state.zones).filter(z => zones[z]).length;
  $('progressCount').textContent = `${done} / ${total}`;
  $('progressFill').style.width = total ? (done / total * 100) + '%' : '0%';
}

// ── Zone selection + product panel ───────────────────────────
function selectZone(zoneId) {
  activeZone = zoneId;
  productQuery = '';
  renderCar();
  renderZoneList();
  renderProductPanel();
  updateStepper();
}

function renderProductPanel() {
  const panel = $('productPanel');
  if (!activeZone) {
    panel.innerHTML = `<div class="empty-card"><div class="empty-emoji">🎯</div>
      <div class="empty-title">Select a zone</div>
      <div class="empty-sub">Tap a glowing node on the vehicle to choose a product for it.</div></div>`;
    return;
  }
  const info = zoneInfo[activeZone];
  const count = (catalog[info.category] || []).length;
  const current = state.zones[activeZone];
  let html = `<div class="zone-card">
    <div class="zone-card-title">${info.icon} ${info.label}<span class="zct-cat">${info.category}</span></div>`;
  if (current) {
    html += `<div class="chosen">
      <div class="chosen-name"><span>${current.name}</span><span>${priceLabel(current)}</span></div>
      <div class="chosen-detail">${current.detail || ''}</div></div>`;
  }
  html += `<input class="prod-search" id="prodSearch" placeholder="Search ${count} options…" autocomplete="off" spellcheck="false">
    <div class="prod-results" id="prodResults"></div>
    <div class="prod-count" id="prodCount"></div>`;
  const pairs = { frontL:'frontR', frontR:'frontL', rearL:'rearR', rearR:'rearL', tweeterL:'tweeterR', tweeterR:'tweeterL' };
  const partner = pairs[activeZone];
  if (partner && current && vehicleConfigs[state.vehicle].zones[partner] && !state.zones[partner]) {
    html += `<button class="btn ghost" id="mirrorBtn" style="width:100%;margin-top:.6rem">⇄ Mirror to ${zoneInfo[partner].label}</button>`;
  }
  html += `</div>`;
  panel.innerHTML = html;

  const search = $('prodSearch');
  search.value = productQuery;
  search.oninput = () => { productQuery = search.value; fillResults(); };
  fillResults();
  const mb = $('mirrorBtn');
  if (mb) mb.onclick = () => mirrorZone(activeZone, partner);
}

// Searchable, brand-grouped results for the active zone.
function fillResults() {
  const info = zoneInfo[activeZone];
  const list = catalog[info.category] || [];
  const q = productQuery.trim().toLowerCase();
  const cur = state.zones[activeZone];
  const matches = q ? list.filter(p => (p.name + ' ' + p.brand).toLowerCase().includes(q)) : list;
  const CAP = 60;
  const byBrand = {};
  matches.slice(0, CAP).forEach(p => { (byBrand[p.brand] = byBrand[p.brand] || []).push(p); });
  const res = $('prodResults');
  if (!matches.length) {
    res.innerHTML = `<div class="prod-empty">No matches for “${productQuery}”.</div>`;
  } else {
    res.innerHTML = Object.entries(byBrand).map(([brand, ps]) => {
      const head = (brand && brand !== '—' && brand !== 'Other') ? `<div class="prod-brand">${brand}</div>` : '';
      return head + ps.map(p => `<div class="prod-opt ${cur && cur.id === p.id ? 'sel' : ''}" data-id="${p.id}">
        <span class="prod-opt-name">${p.name}</span><span class="prod-opt-price">${priceLabel(p)}</span></div>`).join('');
    }).join('');
    res.querySelectorAll('.prod-opt').forEach(el => el.onclick = () => assignProduct(el.dataset.id));
  }
  $('prodCount').textContent = matches.length > CAP
    ? `Showing ${CAP} of ${matches.length} — keep typing to narrow`
    : `${matches.length} option${matches.length === 1 ? '' : 's'}`;
}

function assignProduct(id) {
  if (!activeZone) return;
  const info = zoneInfo[activeZone];
  if (!id) delete state.zones[activeZone];
  else { state.zones[activeZone] = findProduct(info.category, id); toast(`${state.zones[activeZone].name} added`, true); }
  renderAll();
}

function mirrorZone(from, to) {
  if (!state.zones[from]) return;
  state.zones[to] = { ...state.zones[from] };
  activeZone = to;
  renderAll();
  toast(`Mirrored to ${zoneInfo[to].label}`, true);
}

// ── Fitment + extras ─────────────────────────────────────────
function renderFitment() {
  const host = $('fitmentCards');
  host.innerHTML = '';
  fitmentTiers.forEach(t => {
    const on = state.fitment === t.id;
    const card = document.createElement('div');
    card.className = `fit-card ${on ? 'on' : ''}`;
    card.innerHTML = `<span class="fit-radio"></span>
      <div class="fit-main"><div class="fit-name">${t.name}</div><div class="fit-detail">${t.detail}</div></div>
      <div class="fit-price">${t.price ? money(t.price) : 'POA'}</div>`;
    card.onclick = () => { state.fitment = on ? '' : t.id; renderAll(); };
    host.appendChild(card);
  });
}

function renderAccessories() {
  const host = $('accessoryList');
  host.innerHTML = '';
  accessories.forEach(a => {
    const on = state.accessories.includes(a.id);
    const chip = document.createElement('div');
    chip.className = `chip ${on ? 'on' : ''}`;
    chip.innerHTML = `<span>${a.name}</span><span class="chip-price">${money(a.price)}</span>`;
    chip.onclick = () => {
      if (on) state.accessories = state.accessories.filter(x => x !== a.id);
      else state.accessories.push(a.id);
      renderAll();
    };
    host.appendChild(chip);
  });
}

// ── Totals ───────────────────────────────────────────────────
function computeTotals() {
  let components = 0, hasPoa = false;
  Object.values(state.zones).forEach(p => { if (isPoa(p)) hasPoa = true; else components += p.price || 0; });
  const fit = fitmentTiers.find(t => t.id === state.fitment);
  if (fit && isPoaTier(fit)) hasPoa = true;
  const fitment = fit ? (fit.price || 0) : 0;
  const extras = state.accessories.reduce((s, id) => s + (accessories.find(a => a.id === id)?.price || 0), 0);
  const grand = components + fitment + extras;
  const vatIncluded = settings.pricesIncludeVat ? grand - grand / (1 + settings.vatRate) : 0;
  return { components, fitment, extras, grand, vatIncluded, hasPoa };
}

function renderSummary() {
  const list = $('summaryList');
  const entries = Object.entries(state.zones);
  const t = computeTotals();
  if (!entries.length && !state.fitment && !state.accessories.length) {
    list.innerHTML = '<div class="empty-sub">Nothing selected yet.</div>';
    $('totals').innerHTML = '';
  } else {
    list.innerHTML = entries.map(([z, p]) => `<div class="sum-row">
      <span class="sum-zone">${zoneInfo[z].label}</span>
      <span class="sum-name">${p.name}</span>
      <span class="sum-price">${priceLabel(p)}</span></div>`).join('') || '<div class="empty-sub">No components yet.</div>';
    const fit = fitmentTiers.find(x => x.id === state.fitment);
    $('totals').innerHTML = `
      <div class="tline"><span>Components</span><span>${money(t.components)}</span></div>
      ${fit ? `<div class="tline"><span>${fit.name}</span><span>${fit.price ? money(fit.price) : 'POA'}</span></div>` : ''}
      ${t.extras ? `<div class="tline"><span>Extras</span><span>${money(t.extras)}</span></div>` : ''}
      ${settings.pricesIncludeVat ? `<div class="tline micro"><span>incl. VAT (${settings.vatRate * 100}%)</span><span>${money(t.vatIncluded)}</span></div>` : ''}
      <div class="tline grand"><span>Total${t.hasPoa ? '*' : ''}</span><span>${money(t.grand)}</span></div>
      ${t.hasPoa ? `<div class="tline micro"><span>* excludes POA items</span><span></span></div>` : ''}`;
  }
  // animated header + actionbar totals
  animateValue($('hdrTotalValue'), lastTotal, t.grand);
  animateValue($('abTotalValue'), lastTotal, t.grand);
  lastTotal = t.grand;
}

function animateValue(el, from, to) {
  if (!el) return;
  const start = performance.now(), dur = 450;
  const tick = (now) => {
    const k = Math.min(1, (now - start) / dur);
    const v = from + (to - from) * (1 - Math.pow(1 - k, 3));
    el.textContent = money(v);
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Stepper ──────────────────────────────────────────────────
function updateStepper() {
  const placed = Object.keys(state.zones).length > 0;
  const done = { vehicle: !!state.vehicle, components: placed, fitment: !!state.fitment, quote: quoted };
  const order = ['vehicle', 'components', 'fitment', 'quote'];
  const active = order.find(s => !done[s]) || 'quote';
  document.querySelectorAll('.step').forEach(btn => {
    const s = btn.dataset.step;
    btn.classList.toggle('done', done[s] && s !== active);
    btn.classList.toggle('active', s === active);
  });
}

function gotoStep(step) {
  if (step === 'vehicle') { isMobile() ? openDrawer('panelLeft') : scrollToEl('vehicleGrid'); }
  else if (step === 'components') {
    const empty = Object.keys(vehicleConfigs[state.vehicle].zones).find(z => !state.zones[z]);
    if (empty) selectZone(empty);
    isMobile() ? openDrawer(empty ? 'panelRight' : 'panelLeft') : scrollToEl('productBlock');
  } else if (step === 'fitment') { isMobile() ? openDrawer('panelRight') : scrollToEl('fitmentCards'); }
  else if (step === 'quote') openQuote();
}
function scrollToEl(id) { $(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }

// ── Mobile drawers ───────────────────────────────────────────
function openDrawer(id) {
  closeDrawers();
  $(id).classList.add('open');
  document.body.classList.add('drawer-open');
}
function closeDrawers() {
  $('panelLeft').classList.remove('open');
  $('panelRight').classList.remove('open');
  document.body.classList.remove('drawer-open');
}

// ── Render orchestrator ──────────────────────────────────────
function renderAll() {
  renderVehicleGrid();
  renderCar();
  renderZoneList();
  renderProductPanel();
  renderFitment();
  renderAccessories();
  renderSummary();
  updateStepper();
  save();
}

// ── Persistence ──────────────────────────────────────────────
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) {} }
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (s && s.vehicle && vehicleConfigs[s.vehicle]) {
      state = Object.assign(freshState(s.vehicle), s);
      state.accessories = Array.isArray(state.accessories) ? state.accessories : [];
    }
  } catch (_) {}
}

// ── Export / import ──────────────────────────────────────────
function exportJSON() {
  const payload = { ...state, totals: computeTotals(), vehicleLabel: vehicleConfigs[state.vehicle].label, exportedAt: new Date().toISOString() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = `apex-quote-${(state.customer.name || 'draft').replace(/\s+/g, '-').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast('Quote exported', true);
}
function importJSON(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const s = JSON.parse(r.result);
      if (!s.vehicle || !vehicleConfigs[s.vehicle]) throw 0;
      state = Object.assign(freshState(s.vehicle), { zones: s.zones || {}, fitment: s.fitment || '', accessories: s.accessories || [], customer: s.customer || {} });
      activeZone = null; renderAll(); toast('Build imported', true);
    } catch (_) { toast('Could not read that file'); }
  };
  r.readAsText(file);
}

// ── Quote document ───────────────────────────────────────────
function openQuote() {
  quoted = true;
  ['Name', 'Phone', 'Vehicle', 'Notes'].forEach(k => { $('cust' + k).value = state.customer[k.toLowerCase()] || ''; });
  buildQuoteDoc();
  $('quoteModal').hidden = false;
  updateStepper();
}
function closeQuote() { $('quoteModal').hidden = true; }
function captureCustomer() {
  state.customer = { name: $('custName').value.trim(), phone: $('custPhone').value.trim(), vehicle: $('custVehicle').value.trim(), notes: $('custNotes').value.trim() };
  save();
}

function buildQuoteDoc() {
  const t = computeTotals(), b = settings.business, now = new Date();
  const valid = new Date(now.getTime() + settings.quoteValidDays * 864e5);
  const fmt = (d) => d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  const ref = 'AC-' + now.getFullYear() + '-' + String(Math.floor(now.getTime() / 1000)).slice(-5);
  const rows = [];
  Object.entries(state.zones).forEach(([z, p]) => rows.push(`<tr><td>${zoneInfo[z].label}</td><td>${p.brand !== '—' ? p.brand + ' ' : ''}${p.name}<br><span style="color:#999;font-size:.7rem">${p.detail}</span></td><td class="num">${priceLabel(p)}</td></tr>`));
  const fit = fitmentTiers.find(x => x.id === state.fitment);
  if (fit) rows.push(`<tr><td>Fitment</td><td>${fit.name}<br><span style="color:#999;font-size:.7rem">${fit.detail}</span></td><td class="num">${fit.price ? money(fit.price) : 'POA'}</td></tr>`);
  state.accessories.forEach(id => { const a = accessories.find(x => x.id === id); if (a) rows.push(`<tr><td>Extra</td><td>${a.name}<br><span style="color:#999;font-size:.7rem">${a.detail}</span></td><td class="num">${money(a.price)}</td></tr>`); });
  if (!rows.length) rows.push(`<tr><td colspan="3" style="color:#999">No items selected.</td></tr>`);

  $('quoteDoc').innerHTML = `
    <div class="qd-head">
      <div><div class="qd-logo">APEX <span>CUSTOMS</span></div>
        <div style="font-size:.72rem;color:#555">${b.tagline}<br>${b.dealer}</div></div>
      <div class="qd-meta"><strong>QUOTATION</strong><br>Ref: ${ref}<br>Date: ${fmt(now)}<br>Valid until: ${fmt(valid)}</div>
    </div>
    <div class="qd-cust"><strong>Prepared for:</strong> ${state.customer.name || '—'}${state.customer.phone ? ' · ' + state.customer.phone : ''}<br>
      <strong>Vehicle:</strong> ${state.customer.vehicle || vehicleConfigs[state.vehicle].label}${state.customer.notes ? ' · ' + state.customer.notes : ''}</div>
    <h3>System Build — ${vehicleConfigs[state.vehicle].label}</h3>
    <table><thead><tr><th>Zone</th><th>Item</th><th class="num">Price</th></tr></thead>
      <tbody>${rows.join('')}</tbody>
      <tfoot>
        <tr><td colspan="2">Subtotal</td><td class="num">${money(t.grand)}</td></tr>
        ${settings.pricesIncludeVat ? `<tr><td colspan="2">VAT (${settings.vatRate * 100}%) included</td><td class="num">${money(t.vatIncluded)}</td></tr>` : ''}
        <tr class="grand"><td colspan="2">TOTAL${t.hasPoa ? ' *' : ''}</td><td class="num">${money(t.grand)}</td></tr>
      </tfoot></table>
    ${t.hasPoa ? `<p style="font-size:.68rem;color:#999;margin-top:.5rem">* Some items are priced on application (POA) and are not included in the total.</p>` : ''}
    <div class="qd-foot"><div class="qd-sisters">${settings.sisterBrands.join('&nbsp;&nbsp;·&nbsp;&nbsp;')}</div>
      ${b.group}<br>${b.address} · ${b.email}${b.phone ? ' · ' + b.phone : ''}<br>
      Prices ${settings.pricesIncludeVat ? 'include' : 'exclude'} VAT. Quotation valid ${settings.quoteValidDays} days. E&amp;OE.</div>`;
}

// ── Footer + toast ───────────────────────────────────────────
function renderFooter() {
  $('ftr').innerHTML = `<div class="brands">${settings.sisterBrands.map(b => `<span>${b}</span>`).join('')}</div>
    ${settings.business.group} · ${settings.business.address}`;
}
let toastTimer;
function toast(msg, ok) {
  const host = $('toastHost');
  const el = document.createElement('div');
  el.className = `toast ${ok ? 'ok' : ''}`;
  el.textContent = msg;
  host.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function resetBuild() {
  if (!confirm('Clear the current build?')) return;
  state = freshState(state.vehicle); activeZone = null; quoted = false;
  renderAll(); toast('Build cleared');
}

// ── Wire up ──────────────────────────────────────────────────
function init() {
  if (!PRICES_CONFIRMED) $('draftBanner').hidden = false;
  load();
  renderFooter();
  renderAll();

  document.querySelectorAll('.step').forEach(b => b.onclick = () => gotoStep(b.dataset.step));
  $('btnReset').onclick = resetBuild;
  $('btnExport').onclick = exportJSON;
  $('btnQuoteExport').onclick = exportJSON;
  $('btnImport').onclick = () => $('importFile').click();
  $('importFile').onchange = (e) => { if (e.target.files[0]) importJSON(e.target.files[0]); };
  $('btnSave').onclick = () => { save(); toast('Saved', true); };
  $('btnQuote').onclick = openQuote;
  $('quoteClose').onclick = closeQuote;
  $('btnPrint').onclick = () => { captureCustomer(); buildQuoteDoc(); window.print(); };
  ['custName', 'custPhone', 'custVehicle', 'custNotes'].forEach(id => $(id).addEventListener('input', () => { captureCustomer(); buildQuoteDoc(); }));
  $('quoteModal').addEventListener('click', (e) => { if (e.target.id === 'quoteModal') closeQuote(); });

  // mobile drawer toggles
  document.querySelectorAll('.ab-toggle').forEach(b => b.onclick = () => {
    const id = b.dataset.target;
    $(id).classList.contains('open') ? closeDrawers() : openDrawer(id);
  });
  document.addEventListener('click', (e) => {
    if (!document.body.classList.contains('drawer-open')) return;
    if (e.target.closest('.panel') || e.target.closest('.ab-toggle')) return;
    closeDrawers();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeQuote(); closeDrawers(); } });
  window.addEventListener('resize', () => { if (!isMobile()) closeDrawers(); });
}

init();
