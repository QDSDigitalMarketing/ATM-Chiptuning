// ════════════════════════════════════════════════════════════
// APEX CUSTOMS — Sound System Configurator  (app logic)
// ════════════════════════════════════════════════════════════
import { vehicleSVGs, vehicleConfigs, zoneInfo, vehicleIcon } from './data/vehicles.js';
import { catalog, fitmentTiers, accessories, settings, PRICES_CONFIRMED } from './data/catalog.js';

const STORE_KEY = 'apex.configurator.build.v1';
const $ = (id) => document.getElementById(id);

// ── State ────────────────────────────────────────────────────
let state = freshState('doublecab');
let activeZone = null;

function freshState(vehicle) {
  return { vehicle, zones: {}, fitment: '', accessories: [], customer: {} };
}

// ── Helpers ──────────────────────────────────────────────────
const money = (n) => settings.currency + ' ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const isPoa = (p) => (!p.price) && !/none|factory|existing|retain|head unit dsp/i.test(p.name);
const priceLabel = (p) => isPoa(p) ? 'POA' : (p.price ? money(p.price) : '—');

function findProduct(category, id) {
  return (catalog[category] || []).find(p => p.id === id) || null;
}

// ── Vehicle picker ───────────────────────────────────────────
function initVehicleGrid() {
  const grid = $('vehicleGrid');
  grid.innerHTML = '';
  Object.entries(vehicleConfigs).forEach(([key, cfg]) => {
    const btn = document.createElement('div');
    btn.className = `vehicle-btn ${key === state.vehicle ? 'active' : ''}`;
    btn.innerHTML = `${vehicleIcon(key)}<div class="v-label">${cfg.label}</div>`;
    btn.onclick = () => selectVehicle(key);
    grid.appendChild(btn);
  });
}

function selectVehicle(type) {
  // Keep components that still have a matching zone in the new body type.
  const validZones = Object.keys(vehicleConfigs[type].zones);
  Object.keys(state.zones).forEach(z => { if (!validZones.includes(z)) delete state.zones[z]; });
  state.vehicle = type;
  activeZone = null;
  renderAll();
}

// ── Car + hotspots ───────────────────────────────────────────
function renderCar() {
  const svg = $('carSvg');
  svg.innerHTML = vehicleSVGs[state.vehicle];
  const cfg = vehicleConfigs[state.vehicle];
  const host = $('hotspots');
  host.innerHTML = '';
  Object.entries(cfg.zones).forEach(([zoneId, pos]) => {
    const info = zoneInfo[zoneId];
    const dot = document.createElement('div');
    dot.className = `hotspot ${state.zones[zoneId] ? 'has-product' : ''} ${activeZone === zoneId ? 'editing' : ''}`;
    dot.style.left = pos.x + '%';
    dot.style.top = pos.y + '%';
    dot.innerHTML = `<div class="hotspot-pulse"></div><div class="hotspot-dot"></div><div class="hotspot-label">${info.label}</div>`;
    dot.onclick = () => selectZone(zoneId);
    host.appendChild(dot);
  });
}

// ── Left zone list ───────────────────────────────────────────
function renderZoneList() {
  const list = $('zoneList');
  const cfg = vehicleConfigs[state.vehicle];
  list.innerHTML = '';
  const categories = { source:'Source', processor:'Processing', speaker:'Speakers', sub:'Bass', amp:'Power', camera:'Cameras' };
  const grouped = {};
  Object.keys(cfg.zones).forEach(z => {
    const cat = zoneInfo[z].category;
    (grouped[cat] = grouped[cat] || []).push(z);
  });
  Object.entries(categories).forEach(([cat, title]) => {
    if (!grouped[cat]) return;
    const section = document.createElement('div');
    section.className = 'comp-section';
    section.innerHTML = `<div class="comp-section-title">${title}</div>`;
    grouped[cat].forEach(zoneId => {
      const info = zoneInfo[zoneId];
      const chosen = state.zones[zoneId];
      const item = document.createElement('div');
      item.className = `comp-item ${chosen ? 'placed' : ''} ${activeZone === zoneId ? 'editing' : ''}`;
      item.innerHTML = `<div><span class="ci-name">${info.icon} ${info.label}</span></div>
        <div class="ci-status">${chosen ? '✓ ' + chosen.name : 'Empty'}</div>`;
      item.onclick = () => selectZone(zoneId);
      section.appendChild(item);
    });
    list.appendChild(section);
  });
}

// ── Zone selection + product panel ───────────────────────────
function selectZone(zoneId) {
  activeZone = zoneId;
  renderCar();
  renderZoneList();
  renderProductPanel();
}

function brandedOptions(productList, currentId) {
  // Group <option>s by brand into <optgroup>s.
  const byBrand = {};
  productList.forEach((p, i) => { (byBrand[p.brand] = byBrand[p.brand] || []).push({ p, i }); });
  return Object.entries(byBrand).map(([brand, items]) => {
    const opts = items.map(({ p }) =>
      `<option value="${p.id}" ${p.id === currentId ? 'selected' : ''}>${p.name} · ${priceLabel(p)}</option>`
    ).join('');
    return brand === '—' || brand === 'Other' ? opts : `<optgroup label="${brand}">${opts}</optgroup>`;
  }).join('');
}

function renderProductPanel() {
  const panel = $('productPanel');
  if (!activeZone) {
    panel.innerHTML = `<div class="zone-card"><div class="zone-card-title">Select a zone</div>
      <div class="zone-empty">Click a glowing node on the vehicle to configure that zone</div></div>`;
    return;
  }
  const info = zoneInfo[activeZone];
  const productList = catalog[info.category] || [];
  const current = state.zones[activeZone];
  let html = `<div class="zone-card">
    <div class="zone-card-title">${info.icon} ${info.label}</div>
    <div class="product-select-wrap">
      <label>Select Product</label>
      <select class="product-select" id="zoneSelect">
        <option value="">— Choose —</option>
        ${brandedOptions(productList, current && current.id)}
      </select>
    </div>`;
  if (current) {
    html += `<div class="selected-product">
      <div class="sp-name"><span>${current.name}</span><span class="sp-price">${priceLabel(current)}</span></div>
      <div class="sp-detail">${current.detail}</div>
    </div>`;
  }
  html += `</div>`;

  // Mirror buttons for L/R pairs
  const pairs = { frontL:'frontR', frontR:'frontL', rearL:'rearR', rearR:'rearL', tweeterL:'tweeterR', tweeterR:'tweeterL' };
  const partner = pairs[activeZone];
  if (partner && current && vehicleConfigs[state.vehicle].zones[partner] && !state.zones[partner]) {
    html += `<button class="btn-action" id="mirrorBtn" style="margin-top:.5rem">Mirror to ${zoneInfo[partner].label} ⇄</button>`;
  }
  panel.innerHTML = html;

  $('zoneSelect').onchange = (e) => assignProduct(e.target.value);
  const mb = $('mirrorBtn');
  if (mb) mb.onclick = () => mirrorZone(activeZone, partner);
}

function assignProduct(id) {
  if (!activeZone) return;
  const info = zoneInfo[activeZone];
  if (!id) delete state.zones[activeZone];
  else state.zones[activeZone] = findProduct(info.category, id);
  renderAll();
}

function mirrorZone(from, to) {
  if (state.zones[from]) {
    state.zones[to] = { ...state.zones[from] };
    activeZone = to;
    renderAll();
  }
}

// ── Fitment + accessories ────────────────────────────────────
function initFitment() {
  const sel = $('fitmentSelect');
  sel.innerHTML = `<option value="">— No fitment selected —</option>` +
    fitmentTiers.map(t => `<option value="${t.id}">${t.name} · ${t.price ? money(t.price) : 'POA'}</option>`).join('');
  sel.onchange = (e) => { state.fitment = e.target.value; renderAll(); };
}

function renderAccessories() {
  const host = $('accessoryList');
  host.innerHTML = '';
  accessories.forEach(a => {
    const on = state.accessories.includes(a.id);
    const row = document.createElement('label');
    row.className = `acc-item ${on ? 'on' : ''}`;
    row.innerHTML = `<input type="checkbox" ${on ? 'checked' : ''}>
      <span class="acc-name">${a.name}</span><span class="acc-price">${money(a.price)}</span>`;
    row.querySelector('input').onchange = (e) => {
      if (e.target.checked) state.accessories.push(a.id);
      else state.accessories = state.accessories.filter(x => x !== a.id);
      renderAll();
    };
    host.appendChild(row);
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
const isPoaTier = (t) => !t.price && /custom|quote/i.test(t.name);

function renderSummary() {
  const list = $('summaryList');
  const entries = Object.entries(state.zones);
  if (entries.length === 0 && !state.fitment && state.accessories.length === 0) {
    list.innerHTML = '<div class="zone-empty">No components selected yet</div>';
    $('totals').innerHTML = '';
    return;
  }
  list.innerHTML = entries.map(([zoneId, p]) => {
    const info = zoneInfo[zoneId];
    return `<div class="summary-item">
      <span class="si-zone">${info.icon} ${info.label}</span>
      <span class="si-product">${p.name}</span>
      <span class="si-price">${priceLabel(p)}</span>
    </div>`;
  }).join('') || '<div class="zone-empty">No components yet</div>';

  const t = computeTotals();
  const fit = fitmentTiers.find(x => x.id === state.fitment);
  $('totals').innerHTML = `
    <div class="total-line"><span>Components</span><span>${money(t.components)}</span></div>
    ${fit ? `<div class="total-line"><span>${fit.name}</span><span>${fit.price ? money(fit.price) : 'POA'}</span></div>` : ''}
    ${t.extras ? `<div class="total-line"><span>Extras</span><span>${money(t.extras)}</span></div>` : ''}
    ${settings.pricesIncludeVat ? `<div class="total-line"><span>incl. VAT (${settings.vatRate * 100}%)</span><span>${money(t.vatIncluded)}</span></div>` : ''}
    <div class="total-line grand"><span>Total${t.hasPoa ? '*' : ''}</span><span>${money(t.grand)}</span></div>
    ${t.hasPoa ? `<div class="total-line" style="font-size:.7rem"><span>* excludes POA items</span><span></span></div>` : ''}`;
}

// ── Render orchestrator ──────────────────────────────────────
function renderAll() {
  initVehicleGrid();
  renderCar();
  renderZoneList();
  renderProductPanel();
  renderAccessories();
  $('fitmentSelect').value = state.fitment || '';
  renderSummary();
  save();
}

// ── Persistence ──────────────────────────────────────────────
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) {} }
function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    const s = JSON.parse(raw);
    if (s && s.vehicle && vehicleConfigs[s.vehicle]) {
      state = Object.assign(freshState(s.vehicle), s);
      state.accessories = Array.isArray(state.accessories) ? state.accessories : [];
    }
  } catch (_) {}
}

// ── Export / import ──────────────────────────────────────────
function exportJSON() {
  const t = computeTotals();
  const payload = { ...state, totals: t, vehicleLabel: vehicleConfigs[state.vehicle].label, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `apex-quote-${(state.customer.name || 'draft').replace(/\s+/g, '-').toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const s = JSON.parse(reader.result);
      if (!s.vehicle || !vehicleConfigs[s.vehicle]) throw new Error('bad file');
      state = Object.assign(freshState(s.vehicle), { zones: s.zones || {}, fitment: s.fitment || '', accessories: s.accessories || [], customer: s.customer || {} });
      activeZone = null;
      renderAll();
    } catch (_) { alert('Could not read that file — expected an APEX quote JSON export.'); }
  };
  reader.readAsText(file);
}

// ── Quote document ───────────────────────────────────────────
function openQuote() {
  $('custName').value = state.customer.name || '';
  $('custPhone').value = state.customer.phone || '';
  $('custVehicle').value = state.customer.vehicle || '';
  $('custNotes').value = state.customer.notes || '';
  buildQuoteDoc();
  $('quoteModal').hidden = false;
}
function closeQuote() { $('quoteModal').hidden = true; }

function captureCustomer() {
  state.customer = {
    name: $('custName').value.trim(),
    phone: $('custPhone').value.trim(),
    vehicle: $('custVehicle').value.trim(),
    notes: $('custNotes').value.trim()
  };
  save();
}

function buildQuoteDoc() {
  const t = computeTotals();
  const b = settings.business;
  const now = new Date();
  const valid = new Date(now.getTime() + settings.quoteValidDays * 864e5);
  const fmtDate = (d) => d.toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
  const ref = 'AC-' + now.getFullYear() + '-' + String(Math.floor(now.getTime() / 1000)).slice(-5);

  const rows = [];
  Object.entries(state.zones).forEach(([zoneId, p]) => {
    rows.push(`<tr><td>${zoneInfo[zoneId].label}</td><td>${p.brand !== '—' ? p.brand + ' ' : ''}${p.name}<br><span style="color:#999;font-size:.7rem">${p.detail}</span></td><td class="num">${priceLabel(p)}</td></tr>`);
  });
  const fit = fitmentTiers.find(x => x.id === state.fitment);
  if (fit) rows.push(`<tr><td>Fitment</td><td>${fit.name}<br><span style="color:#999;font-size:.7rem">${fit.detail}</span></td><td class="num">${fit.price ? money(fit.price) : 'POA'}</td></tr>`);
  state.accessories.forEach(id => {
    const a = accessories.find(x => x.id === id);
    if (a) rows.push(`<tr><td>Extra</td><td>${a.name}<br><span style="color:#999;font-size:.7rem">${a.detail}</span></td><td class="num">${money(a.price)}</td></tr>`);
  });
  if (!rows.length) rows.push(`<tr><td colspan="3" style="color:#999">No items selected.</td></tr>`);

  $('quoteDoc').innerHTML = `
    <div class="qd-head">
      <div>
        <div class="qd-logo">APEX <span>CUSTOMS</span></div>
        <div style="font-size:.72rem;color:#555">${b.tagline}<br>${b.dealer}</div>
      </div>
      <div class="qd-meta">
        <strong>QUOTATION</strong><br>
        Ref: ${ref}<br>
        Date: ${fmtDate(now)}<br>
        Valid until: ${fmtDate(valid)}
      </div>
    </div>
    <div class="qd-cust">
      <strong>Prepared for:</strong> ${state.customer.name || '—'}${state.customer.phone ? ' · ' + state.customer.phone : ''}<br>
      <strong>Vehicle:</strong> ${state.customer.vehicle || vehicleConfigs[state.vehicle].label}${state.customer.notes ? ' · ' + state.customer.notes : ''}
    </div>
    <h3>System Build — ${vehicleConfigs[state.vehicle].label}</h3>
    <table>
      <thead><tr><th>Zone</th><th>Item</th><th class="num">Price</th></tr></thead>
      <tbody>${rows.join('')}</tbody>
      <tfoot>
        <tr><td colspan="2">Subtotal</td><td class="num">${money(t.grand)}</td></tr>
        ${settings.pricesIncludeVat ? `<tr><td colspan="2">VAT (${settings.vatRate * 100}%) included</td><td class="num">${money(t.vatIncluded)}</td></tr>` : ''}
        <tr class="grand"><td colspan="2">TOTAL${t.hasPoa ? ' *' : ''}</td><td class="num">${money(t.grand)}</td></tr>
      </tfoot>
    </table>
    ${t.hasPoa ? `<p style="font-size:.68rem;color:#999;margin-top:.5rem">* Some items are priced on application (POA) and are not included in the total above.</p>` : ''}
    <div class="qd-foot">
      <div class="qd-sisters">${settings.sisterBrands.join('&nbsp;&nbsp;·&nbsp;&nbsp;')}</div>
      ${b.group}<br>
      ${b.address} · ${b.email}${b.phone ? ' · ' + b.phone : ''}<br>
      Prices ${settings.pricesIncludeVat ? 'include' : 'exclude'} VAT. Quotation valid ${settings.quoteValidDays} days. E&amp;OE.
    </div>`;
}

// ── Footer ───────────────────────────────────────────────────
function renderFooter() {
  $('cfgFooter').innerHTML =
    `<div class="brands">${settings.sisterBrands.map(b => `<span>${b}</span>`).join('')}</div>
     ${settings.business.group} · ${settings.business.address}`;
}

// ── Reset ────────────────────────────────────────────────────
function resetBuild() {
  if (!confirm('Clear the current build?')) return;
  state = freshState(state.vehicle);
  activeZone = null;
  renderAll();
}

// ── Wire up ──────────────────────────────────────────────────
function init() {
  if (!PRICES_CONFIRMED) $('draftBanner').hidden = false;
  load();
  initFitment();
  renderFooter();
  renderAll();

  $('btnReset').onclick = resetBuild;
  $('btnExport').onclick = exportJSON;
  $('btnQuoteExport').onclick = exportJSON;
  $('btnImport').onclick = () => $('importFile').click();
  $('importFile').onchange = (e) => { if (e.target.files[0]) importJSON(e.target.files[0]); };
  $('btnSave').onclick = () => { save(); flash($('btnSave'), 'Saved ✓'); };
  $('btnQuote').onclick = openQuote;
  $('quoteClose').onclick = closeQuote;
  $('btnPrint').onclick = () => { captureCustomer(); buildQuoteDoc(); window.print(); };
  ['custName', 'custPhone', 'custVehicle', 'custNotes'].forEach(id =>
    $(id).addEventListener('input', () => { captureCustomer(); buildQuoteDoc(); }));
  $('quoteModal').addEventListener('click', (e) => { if (e.target.id === 'quoteModal') closeQuote(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeQuote(); });
}

function flash(btn, msg) {
  const old = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => { btn.textContent = old; }, 1200);
}

init();
