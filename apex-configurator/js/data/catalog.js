// ════════════════════════════════════════════════════════════
// APEX CUSTOMS — Product catalog & pricing  (single source of truth)
// ════════════════════════════════════════════════════════════
// ⚠️  PRICES ARE PLACEHOLDERS (representative ZAR retail, incl. VAT).
//     Albert: edit `price` values below to your real dealer/retail
//     pricing. Everything else (totals, VAT, quote PDF, CRM export)
//     recalculates automatically. Set PRICES_CONFIRMED = true once
//     you've verified them to remove the "draft pricing" banner.
// ════════════════════════════════════════════════════════════

export const PRICES_CONFIRMED = false;

export const settings = {
  currency: 'R',          // ZAR
  vatRate: 0.15,          // South Africa 15%
  pricesIncludeVat: true, // catalog prices already include VAT (typical SA retail)
  quoteValidDays: 14,
  business: {
    name: 'APEX Customs',
    tagline: 'Premium Car Audio · Garden Route',
    group: 'Part of the Apex Automotive Group',
    address: 'R-Tech Building, 24 Gericke Road, Voorbaai, Mossel Bay',
    phone: '',            // fill in
    email: 'albert@apexcustoms.co.za',
    web: 'apexcustoms.co.za',
    dealer: 'Authorized Rockford Fosgate Dealer'
  },
  sisterBrands: ['APEX Customs', 'ATM Chiptuning', 'Sniper Racing', 'R-Tech']
};

// ── Component catalog, grouped by category, then brand ────────
// category keys must match zoneInfo[*].category in vehicles.js
// price = ZAR. price 0 / null = POA (price on application).
//
// The block between the AUTOGEN markers below is rewritten by
// `npm run import -- <woocommerce-export.csv>`. Edit prices here by
// hand only if you are NOT using the importer (it overwrites this block).
// <<<CATALOG_AUTOGEN_START>>>
export const catalog = {
  source: [
    { id:'dudu3-9',    brand:'DUDU Auto', name:'DUDU3 9"',        detail:'UIS8581 · 4GB/64GB · HD · CarPlay',        price:3499 },
    { id:'dudu3-95',   brand:'DUDU Auto', name:'DUDU3 9.5"',      detail:'UIS8581 · 4GB/64GB · HD · CarPlay',        price:3799 },
    { id:'dudu3-101',  brand:'DUDU Auto', name:'DUDU3 10.1"',     detail:'UIS8581 · 4GB/64GB · HD · CarPlay',        price:3999 },
    { id:'dudu5-9',    brand:'DUDU Auto', name:'DUDU5 9"',        detail:'UIS7862 · 4GB/64GB · HD · DSP · CarPlay',  price:5499 },
    { id:'dudu5-95',   brand:'DUDU Auto', name:'DUDU5 9.5"',      detail:'UIS7862 · 4GB/64GB · HD · DSP · CarPlay',  price:5799 },
    { id:'dudu5-101',  brand:'DUDU Auto', name:'DUDU5 10.1"',     detail:'UIS7862 · 4GB/64GB · HD · DSP · CarPlay',  price:5999 },
    { id:'dudu7-95',   brand:'DUDU Auto', name:'DUDU7 9.5" 2K',   detail:'UIS7870 · 12GB/512GB · 2K QLED · AKM DSP', price:8999 },
    { id:'dudu7-10',   brand:'DUDU Auto', name:'DUDU7 10" 2K',    detail:'UIS7870 · 12GB/512GB · 2K QLED · AKM DSP', price:9499 },
    { id:'dudu7-1036', brand:'DUDU Auto', name:'DUDU7 10.36" 2K', detail:'UIS7870 · 12GB/512GB · 2K QLED · AKM DSP', price:9999 },
    { id:'smartnavi',  brand:'SmartNavi', name:'SmartNavi Unit',  detail:'Android · brand-fit fascia',               price:0   },
    { id:'src-other',  brand:'Other',     name:'Imported / Other',detail:'Client-supplied or alternative brand',     price:0   }
  ],
  processor: [
    { id:'helix-dsp-mini',  brand:'Helix', name:'HELIX DSP MINI MK2',         detail:'6ch · 96kHz/24-bit · High-Res',   price:6499  },
    { id:'helix-dsp-pro',   brand:'Helix', name:'HELIX DSP PRO MK3',          detail:'10ch · 96kHz/32-bit · High-Res',  price:13999 },
    { id:'helix-dsp-ultra', brand:'Helix', name:'HELIX DSP ULTRA S',          detail:'12ch · 96kHz/32-bit · High-Res',  price:18999 },
    { id:'helix-m-six-dsp', brand:'Helix', name:'HELIX M SIX DSP',            detail:'6ch amp + 10ch DSP integrated',   price:9999  },
    { id:'helix-v12-dsp',   brand:'Helix', name:'HELIX V TWELVE DSP MK2',     detail:'12ch DSP amp',                    price:15999 },
    { id:'helix-v8-dsp',    brand:'Helix', name:'HELIX V EIGHT DSP ULTIMATE', detail:'8ch NEXT series DSP amp',          price:21999 },
    { id:'brax-dsp',        brand:'Brax',  name:'BRAX DSP',                   detail:'Reference-grade signal processor',price:0     },
    { id:'dsp-none',        brand:'—',     name:'None (head unit DSP)',       detail:'Using DUDU5/7 built-in DSP',      price:0     }
  ],
  speaker: [ // priced per PAIR / set
    { id:'helix-cb-k165',  brand:'Helix',            name:'HELIX CB K165.2-S3',     detail:'6.5" Basic kit · silk dome · 3Ω',    price:3299 },
    { id:'helix-cb-c165',  brand:'Helix',            name:'HELIX CB C165.2-S3',     detail:'6.5" Basic coaxial · 3Ω',            price:2799 },
    { id:'helix-ci3-165',  brand:'Helix',            name:'HELIX Ci3 K165.2FM-S3',  detail:'6.5" Performance kit · titanium',    price:5499 },
    { id:'helix-ci3-200',  brand:'Helix',            name:'HELIX Ci3 K200.2FM-S3',  detail:'8" Performance kit · titanium',      price:6499 },
    { id:'helix-ci5-200',  brand:'Helix',            name:'HELIX Ci5 S200FM-S2',    detail:'8" Advanced hybrid woofer · SVC',    price:7999 },
    { id:'helix-cb-k130',  brand:'Helix',            name:'HELIX CB K130.2-S3',     detail:'5.25" Basic kit · 3Ω',               price:2999 },
    { id:'helix-cb-c100',  brand:'Helix',            name:'HELIX CB C100.2-S3',     detail:'4" Basic coaxial · 3Ω',              price:2299 },
    { id:'match-ms42c',    brand:'Match',            name:'MATCH MS 42C-S',         detail:'4" component set',                   price:3499 },
    { id:'match-ms62c',    brand:'Match',            name:'MATCH MS 62C-S',         detail:'6.5" component set',                 price:4299 },
    { id:'rf-punch-coax',  brand:'Rockford Fosgate', name:'RF Punch 6.5" Coax',     detail:'Punch series coaxial',               price:1999 },
    { id:'rf-punch-comp',  brand:'Rockford Fosgate', name:'RF Punch 6.5" Component', detail:'Punch series component kit',         price:3499 },
    { id:'rf-power-t1',    brand:'Rockford Fosgate', name:'RF Power 6.5" T1',       detail:'Power series',                       price:4999 },
    { id:'rf-prime-65',    brand:'Rockford Fosgate', name:'RF Prime 6.5"',          detail:'Entry-level coaxial',                price:1299 },
    { id:'rf-punch-525',   brand:'Rockford Fosgate', name:'RF Punch 5.25"',         detail:'Punch series 5.25"',                 price:1799 },
    { id:'spk-factory',    brand:'—',                name:'Factory (retain)',       detail:'Keep factory speakers',              price:0    }
  ],
  sub: [
    { id:'rf-p1-10',   brand:'Rockford Fosgate', name:'RF P1 10" SVC',     detail:'Punch P1 · 10" · 4Ω',  price:1799 },
    { id:'rf-p1-12',   brand:'Rockford Fosgate', name:'RF P1 12" SVC',     detail:'Punch P1 · 12" · 4Ω',  price:1999 },
    { id:'rf-p2-10',   brand:'Rockford Fosgate', name:'RF P2 10" DVC',     detail:'Punch P2 · 10" · DVC', price:2499 },
    { id:'rf-p2-12',   brand:'Rockford Fosgate', name:'RF P2 12" DVC',     detail:'Punch P2 · 12" · DVC', price:2799 },
    { id:'rf-p3-10',   brand:'Rockford Fosgate', name:'RF P3 10" DVC',     detail:'Punch P3 · 10" · DVC', price:3499 },
    { id:'rf-p3-12',   brand:'Rockford Fosgate', name:'RF P3 12" DVC',     detail:'Punch P3 · 12" · DVC', price:3999 },
    { id:'rf-t1-10',   brand:'Rockford Fosgate', name:'RF T1 10"',         detail:'Power T1 · 10"',       price:4999 },
    { id:'rf-t1-12',   brand:'Rockford Fosgate', name:'RF T1 12"',         detail:'Power T1 · 12"',       price:5499 },
    { id:'helix-ik-s8', brand:'Helix',           name:'HELIX IK S8 DVC2',  detail:'8" Shallow · 2×2Ω',    price:3299 },
    { id:'helix-ik-s10',brand:'Helix',           name:'HELIX IK S10 DVC2', detail:'10" Shallow · 2×2Ω',   price:3799 },
    { id:'sub-none',   brand:'—',                name:'None',             detail:'No subwoofer',          price:0    }
  ],
  amp: [
    { id:'helix-m-one',   brand:'Helix',            name:'HELIX M ONE',             detail:'1ch sub amp · Class D · 1Ω stable', price:4999  },
    { id:'helix-m-four',  brand:'Helix',            name:'HELIX M FOUR',            detail:'4ch · Class D · active crossover',  price:6499  },
    { id:'helix-m-six',   brand:'Helix',            name:'HELIX M SIX',             detail:'6ch · Class D · active crossover',  price:7999  },
    { id:'helix-amp-201', brand:'Helix',            name:'HELIX AMPLIFY 201 DIRECT',detail:'1ch compact · DirectDSP',           price:5499  },
    { id:'helix-amp-204', brand:'Helix',            name:'HELIX AMPLIFY 204 DIRECT',detail:'4ch compact · DirectDSP',           price:7499  },
    { id:'rf-p300x1',     brand:'Rockford Fosgate', name:'RF P300X1',               detail:'Punch 300W mono',                   price:2299  },
    { id:'rf-p500',       brand:'Rockford Fosgate', name:'RF P500X1bd',             detail:'Punch 500W mono · Class BD',        price:3499  },
    { id:'rf-p1000',      brand:'Rockford Fosgate', name:'RF P1000X1bd',            detail:'Punch 1000W mono · Class BD',       price:5499  },
    { id:'rf-t400-4',     brand:'Rockford Fosgate', name:'RF T400-4',               detail:'Power 400W 4ch · 100W×4',           price:5999  },
    { id:'rf-t600-4',     brand:'Rockford Fosgate', name:'RF T600-4',               detail:'Power 600W 4ch · 150W×4',           price:7499  },
    { id:'rf-t500-1',     brand:'Rockford Fosgate', name:'RF T500-1bdCP',           detail:'Power 500W mono · Constant Power',  price:4999  },
    { id:'rf-t750',       brand:'Rockford Fosgate', name:'RF T750X1bd',             detail:'Power 750W mono · compact',         price:5999  },
    { id:'rf-t1500',      brand:'Rockford Fosgate', name:'RF T1500-1bdCP',          detail:'Power 1500W mono · Constant Power', price:8999  },
    { id:'rf-t2500',      brand:'Rockford Fosgate', name:'RF T2500-1bdCP',          detail:'Power 2500W mono · Constant Power', price:12999 },
    { id:'amp-none',      brand:'—',                name:'None',                    detail:'No external amplifier',             price:0     }
  ],
  camera: [
    { id:'cam-reverse', brand:'APEX', name:'Reverse Camera',     detail:'AHD 1080P rear view',      price:899  },
    { id:'cam-dvr',     brand:'APEX', name:'Front DVR / Dashcam', detail:'Front recording camera',  price:1299 },
    { id:'cam-360',     brand:'APEX', name:'360° Surround System',detail:'4-camera panoramic view',  price:4999 },
    { id:'cam-existing',brand:'—',    name:'Existing (retain)',   detail:'Keep factory camera',      price:0    },
    { id:'cam-none',    brand:'—',    name:'None',                detail:'No camera',                price:0    }
  ]
};
// <<<CATALOG_AUTOGEN_END>>>

// ── Fitment / installation labour tiers ──────────────────────
export const fitmentTiers = [
  { id:'bronze', name:'Bronze Fitment', detail:'Source unit + front speakers · plug-and-play', price:3500 },
  { id:'silver', name:'Silver Fitment', detail:'Full front + amp + sub · wiring + tune',       price:6500 },
  { id:'gold',   name:'Gold Fitment',   detail:'Active front + DSP tune + custom install',     price:12000 },
  { id:'custom', name:'Custom / Quote',  detail:'Show-build, fibreglass, bespoke — priced on site', price:0 }
];

// ── Optional extras / accessories (not tied to a hotspot) ─────
export const accessories = [
  { id:'deaden-door',  name:'Sound Deadening — per door', detail:'Vibration + rattle control', price:450  },
  { id:'deaden-full',  name:'Sound Deadening — full car', detail:'Doors, floor, boot',         price:3500 },
  { id:'wiring-4ga',   name:'Wiring Kit — 4GA',           detail:'Amp power/signal kit',       price:899  },
  { id:'wiring-0ga',   name:'Wiring Kit — 0GA',           detail:'High-current amp kit',       price:1499 },
  { id:'big3',         name:'Big 3 Upgrade',              detail:'Charging system upgrade',    price:750  },
  { id:'second-batt',  name:'Second Battery / Cap',       detail:'Stable voltage under load',  price:1999 },
  { id:'sub-box',      name:'Custom Sub Enclosure',       detail:'APEX built-to-spec box',     price:2500 },
  { id:'tweeter-pods', name:'Custom Tweeter Pods',        detail:'A-pillar / sail panel',      price:1500 }
];
