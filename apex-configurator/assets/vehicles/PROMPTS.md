# Vehicle artwork — generation prompts

The configurator stage loads a top-down image per body type from this folder:

```
assets/vehicles/sedan.webp        coupe.webp
assets/vehicles/hatchback.webp    doublecab.webp
assets/vehicles/suv.webp          singlecab.webp
```

`.webp` is preferred; `.png` also works (the app tries `.webp` then `.png`, then
falls back to the built-in wireframe). Until you add these files, the wireframe shows.

The glowing component hotspots are positioned by **percentage** over the image, so the
artwork **must** follow the alignment rules below or the dots won't sit on the speakers.

---

## Non-negotiable alignment rules (all 6 must match)

- **True top-down**, 90° overhead, **orthographic** (no perspective/tilt).
- **Front of the vehicle points UP** (towards the top edge of the frame).
- Vehicle **centered**, occupying ~70% of width with even margins (~15% each side).
- **Aspect ratio 3:2**, export **1500 × 1000 px**.
- **Roof cut away / x-ray top view** so the **interior is visible** — seats, doors,
  dashboard, boot. (This is what makes speaker locations read for the customer.)
- **Transparent background** (preferred) or solid `#070912`.
- No text, no logos, no watermark, no people, no wheels-off — just the vehicle.

## House style (keep identical across all 6 for a cohesive set)

> dark metallic charcoal-grey bodywork, soft studio lighting from above, subtle
> cyan rim light (#19d0ff) along the panel edges, faint interior glow, clean
> premium automotive render, high detail, sharp, minimal, slight soft shadow
> beneath the car, neutral colour interior

**Tips for consistency:** generate all six in one session with the same style; in
Midjourney use `--ar 3:2 --style raw` and reuse a `--sref` / seed across all six; in
DALL·E/SDXL paste the House style block into every prompt and keep wording identical.

---

## Per-vehicle prompts

Paste **House style** + the line below. (Written for Midjourney/DALL·E; adapt freely.)

**sedan.webp**
> Top-down orthographic x-ray view of a 4-door **sedan**, roof removed showing two rows
> of seats, four doors, engine bay at the top and boot at the bottom, front of car
> facing up, centered. [House style] --ar 3:2 --style raw

**hatchback.webp**
> Top-down orthographic x-ray view of a compact **5-door hatchback**, roof removed
> showing two seat rows and a short rear cargo area, four doors, front facing up,
> centered. [House style] --ar 3:2 --style raw

**suv.webp**
> Top-down orthographic x-ray view of a large **SUV**, roof removed showing two/three
> seat rows and a rear boot, four doors, wide stance, front facing up, centered.
> [House style] --ar 3:2 --style raw

**coupe.webp**
> Top-down orthographic x-ray view of a sporty **2-door coupé**, roof removed showing
> two front seats and a small rear bench, long bonnet, front facing up, centered.
> [House style] --ar 3:2 --style raw

**doublecab.webp**
> Top-down orthographic x-ray view of a **double-cab bakkie / pickup truck**, roof
> removed showing a full 4-door cab with two seat rows, and a large open load bed at
> the rear, front facing up, centered. [House style] --ar 3:2 --style raw

**singlecab.webp**
> Top-down orthographic x-ray view of a **single-cab bakkie / pickup truck**, roof
> removed showing a 2-door cab with one seat row, and a long open load bed taking up
> the rear two-thirds, front facing up, centered. [House style] --ar 3:2 --style raw

---

## After generating

1. Crop each to 3:2, save as `assets/vehicles/<type>.webp` (1500×1000).
2. Run `npm run dev` and click through the vehicle picker — the hotspots should sit on
   the doors/dash/boot. If a dot is slightly off, nudge that zone's `x`/`y` percentage
   in `js/data/vehicles.js` (each zone is `{x, y}` in % of the frame).
3. Commit the images.
