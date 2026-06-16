# APEX Customs — Sound System Studio

A top-down vehicle sound-system **configurator + quotation studio** for **APEX Customs**
(part of the Apex Automotive Group — APEX Customs · ATM Chiptuning · Sniper Racing · R-Tech).

Pick a body type, tap the glowing zones on the overhead car view (head unit, DSP,
tweeters, front/rear speakers, sub, amp, cameras), choose products, add fitment labour
and extras — and it builds a live, VAT-inclusive **quotation** you can print to PDF or
export as JSON for the CRM.

## Highlights (v0.2 — full UI overhaul)

- **Modern, delightful UI** — glass panels, aurora backdrop, animated hotspots, an
  animated running total, a 4-step guide (Vehicle → Components → Fitment → Quote),
  build-progress meter, toasts, and a sticky action bar.
- **Mobile-first** — on phones the side panels become slide-up drawers; the car stays
  pinned at the top; a bottom bar shows the live total + a one-tap **Quote** button.
- **6 body types**, **12 hotspot zones**, L⇄R mirroring.
- **Brand catalog** — Rockford Fosgate, Helix, DUDU Auto, Match, SmartNavi, Brax (65 items).
- **Fitment tiers** + **extras**, **SA VAT (15%)** totals, POA handling.
- **Quotation document** with customer details + sister-brand footer → print / save PDF.
- **Save/resume** (localStorage) and **JSON export/import** (CRM-ready).

## Run the dev environment

Zero dependencies — no `npm install` needed (uses Node built-ins only, Node ≥ 18):

```bash
cd apex-configurator
npm run dev                 # → http://localhost:4317  (binds 0.0.0.0)
# or choose a port:
PORT=8080 npm run dev
```

The server binds all interfaces, so if you run it **on your own machine** it's reachable
at your LAN / **Tailscale** IP on that port (e.g. `http://<your-tailscale-ip>:4317`).

> ℹ️ It can't be hosted *from the cloud dev container* on your tailnet — that sandbox is
> network-sealed (Tailscale's control plane is firewalled off). To view on mobile without
> running it locally, use **GitHub Pages** (see below).

### View on mobile via GitHub Pages

The app is fully static, so GitHub Pages serves it as-is:

1. GitHub → this repo → **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `claude/apex-sound-system-quotation-2moo7r`, **folder:** `/ (root)` → Save
4. Open: `https://qdsdigitalmarketing.github.io/ATM-Chiptuning/apex-configurator/`

> Pages on a public repo is publicly reachable. The app ships with **placeholder pricing
> and no secrets**, but it is your brand — disable Pages anytime in the same settings to
> take it offline.

## Import real products from WooCommerce

`apexcustoms.store` (WooCommerce) is the product master. To load the real catalog:

1. WP Admin → **Products → All Products → Export → Generate CSV**.
2. Run the importer (zero-dep, no install):

   ```bash
   npm run import -- path/to/wc-product-export.csv          # writes catalog
   npm run import -- path/to/wc-product-export.csv --dry     # report only
   ```

The importer parses the CSV, picks **Sale price → Regular price**, maps each
product to a zone (source / processor / speaker / sub / amp / camera) from its
WooCommerce **Categories** (falling back to the product name), detects the brand,
and rewrites **only** the block between the `AUTOGEN` markers in
`js/data/catalog.js` — your settings, fitment tiers and extras are left alone.
It prints a report of counts, any items with no price (POA), and anything it
couldn't categorise (e.g. merchandise) so nothing maps silently wrong.

After importing: review prices, set `PRICES_CONFIRMED = true`, run `npm test`, commit.
A sample export lives at `scripts/sample-woocommerce.csv` to try it out.

> Assumes WooCommerce prices include VAT (typical SA setup). If yours exclude
> VAT, set `settings.pricesIncludeVat = false` in `catalog.js`.

## Editing prices & products — one file

All catalog data, pricing, VAT, fitment tiers, extras and business details live in
**`js/data/catalog.js`**. Edit `price` values (ZAR); totals, the quote PDF and the JSON
export recalculate automatically. Set `PRICES_CONFIRMED = true` to remove the draft banner.

Vehicle outlines, hotspot positions and zone metadata live in **`js/data/vehicles.js`**.

## Structure

```
apex-configurator/
├── index.html            # layout, stepper, action bar, modal
├── css/styles.css        # full theme + responsive drawers + print styles
├── js/
│   ├── app.js            # state, render, totals, quote, persistence, drawers
│   └── data/
│       ├── catalog.js    # products · prices · VAT · fitment · extras  ← edit here
│       └── vehicles.js   # SVG outlines · zones · hotspot positions
├── server.js             # zero-dependency static dev server
├── package.json          # npm run dev
├── assets/               # logos etc.
└── prototype.html        # original single-file POC (reference)
```

## Roadmap

- [ ] **Real pricing** in `catalog.js` (replace placeholders) — pull from `apexcustoms.store`.
- [ ] APEX logo + phone number (`assets/`, `settings.business`).
- [ ] Per-zone quantity (e.g. 2× subs) + per-line discounts.
- [ ] **CRM integration** — POST the JSON export to the `crm-project` quote API.
- [ ] **WhatsApp share** — generate a customer-ready quote message.
```
