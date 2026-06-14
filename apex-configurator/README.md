# APEX Customs — Sound System Configurator & Quote

A top-down vehicle sound-system configurator and quotation tool for **APEX Customs**
(part of the Apex Automotive Group — APEX Customs · ATM Chiptuning · Sniper Racing · R-Tech).

Pick a body type, click the glowing zones on the overhead car view (head unit, DSP,
tweeters, front/rear speakers, sub, amp, cameras), choose products per zone, add
fitment labour and extras — and the tool builds a live, VAT-inclusive **quotation**
you can print to PDF or export as JSON for the CRM.

![flow](assets/.gitkeep)

## What it does

- **6 body types** — sedan, hatchback, SUV, double cab, single cab, coupé (top-down SVG cutouts).
- **12 hotspot zones** with empty → placed → editing states, glow + pulse.
- **Brand catalog** — Rockford Fosgate, Helix, DUDU Auto, Match, SmartNavi, Brax (65 line items).
- **L ⇄ R mirroring** for paired speaker/tweeter zones.
- **Fitment tiers** (Bronze / Silver / Gold / Custom) + **extras** (deadening, wiring, Big 3, enclosures…).
- **Live totals** with South African **VAT (15%)** breakdown; POA items handled separately.
- **Quotation document** with customer details, reference, validity, sister-brand footer → **print / save PDF**.
- **Save / resume** via localStorage; **export / import** the whole build as JSON (CRM-ready).

## Run it

ES modules need to be served over HTTP (opening `index.html` from disk won't load the modules):

```bash
cd apex-configurator
python3 -m http.server 8000
# then open http://localhost:8000
```

Or drop the folder on any static host (Netlify, GitHub Pages, the existing Caddy box).

> `prototype.html` is the original single-file proof-of-concept, kept for reference.

## Editing prices & products — one file

All catalog data, pricing, VAT, fitment tiers, extras and business details live in
**`js/data/catalog.js`**. Edit `price` values (ZAR) there; totals, the quote PDF and the
JSON export recalculate automatically.

> ⚠️ **Prices are placeholders.** They're representative ZAR retail figures, not your real
> numbers. Update them, then set `PRICES_CONFIRMED = true` in `catalog.js` to remove the
> "draft pricing" banner.

Vehicle outlines, hotspot positions and zone metadata live in **`js/data/vehicles.js`**.

## Structure

```
apex-configurator/
├── index.html            # shell / layout
├── css/styles.css        # APEX theme + print styles
├── js/
│   ├── app.js            # all logic (state, render, totals, quote, persistence)
│   └── data/
│       ├── catalog.js    # products, prices, VAT, fitment, extras, business  ← edit here
│       └── vehicles.js   # SVG outlines, zones, hotspot positions
├── assets/               # logos etc.
└── prototype.html        # original single-file POC
```

## Roadmap / next steps

- [ ] **Confirm real pricing** in `catalog.js` (replace placeholders).
- [ ] Add the **APEX logo** + real phone number (`assets/`, `settings.business`).
- [ ] **Per-zone quantity** (e.g. 2× subs) and per-line discounts.
- [ ] **CRM integration** — POST the JSON export to the `crm-project` quote API
      (`/api/quotes/ai-parse-v2` shape) so a configured build lands straight in the pipeline.
- [ ] **WhatsApp share** — generate a quote summary message for the customer.
- [ ] Optional: brand logos on hotspots, saved customer builds, multi-quote compare.
```
