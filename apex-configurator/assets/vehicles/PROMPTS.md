# Vehicle artwork — ChatGPT (GPT-4o) image prompts

The configurator stage loads a top-down image per body type from this folder:

```
assets/vehicles/sedan.webp        coupe.webp
assets/vehicles/hatchback.webp    doublecab.webp
assets/vehicles/suv.webp          singlecab.webp
```

ChatGPT outputs **PNG** — that's fine, the app tries `.webp` then `.png`, then falls
back to the built-in wireframe. Save each image as `assets/vehicles/<type>.png`.

The glowing component hotspots are positioned by **percentage** over the image, so the
artwork **must** follow the alignment rules below or the dots won't sit on the speakers.

---

## Alignment rules (all 6 must match, or hotspots drift)

- **True top-down**, directly overhead, **orthographic** (no perspective/tilt).
- **Front of the vehicle points UP** (towards the top of the frame).
- Vehicle **centered**, filling ~70% of the width, even margins both sides.
- **Landscape / wide (3:2)** — in ChatGPT choose the **landscape** option (1536×1024).
- **Roof removed / cutaway** so the **interior is visible** — seats, doors, dash, boot.
- **No text, labels, logos, watermarks, people, or measurement lines.**

---

## How to generate (do this in one ChatGPT chat for a matching set)

1. Paste **Prompt 1 (sedan)** below — it contains the full style.
2. When you choose the size, pick **landscape (wide)**.
3. For each of the other five, paste the short follow-up:
   > Generate the next one in the **exact same style, lighting, overhead angle, scale
   > and dark background as the previous image** — change only the vehicle to: **<X>**.
   …replacing `<X>` with the vehicle line from that prompt.
4. Download each, rename to `sedan.png`, `hatchback.png`, `suv.png`, `coupe.png`,
   `doublecab.png`, `singlecab.png`, and put them in this folder.

---

## The full style (used by Prompt 1; reused automatically by follow-ups)

> Create a wide landscape image, 3:2 aspect ratio. A photorealistic **top-down view,
> directly overhead and orthographic with no perspective distortion**, of **<VEHICLE>**,
> shown as if the roof has been cleanly removed to reveal the entire interior — seats,
> door cards, dashboard, centre console and boot/cargo area all clearly visible from
> above. The body is **dark metallic charcoal-grey**, softly lit from directly above,
> with a subtle **cyan (#19D0FF) rim light** tracing the body edges and a faint cool
> interior glow. Premium, clean, minimal automotive studio render — sharp, detailed,
> high quality. The **front of the vehicle points to the top of the frame**. **Centre**
> the vehicle with even margins so it fills about 70% of the width. **Solid very dark
> background, colour #070912.** Absolutely **no text, no labels, no logos, no
> watermarks, no people, and no measurement lines.**

*(Prefer a transparent background? Replace the background sentence with "Transparent
background." Both work — the stage behind it is #070912 anyway.)*

---

## The six vehicles (the `<VEHICLE>` line for each)

1. **sedan** — a 4-door sedan/saloon: two rows of seats, four doors, an engine bay at the top and a separate boot at the bottom.
2. **hatchback** — a compact 5-door hatchback: two rows of seats, four doors, and a short rear cargo area under the tailgate.
3. **suv** — a large SUV: tall, wide body, two (or three) rows of seats, four doors and a rear boot.
4. **coupe** — a sporty 2-door coupé: a long bonnet, two doors, two front seats and a small rear bench.
5. **doublecab** — a double-cab bakkie / pickup truck: a full four-door cab with two seat rows at the front, and a large open load bed/cargo tub across the rear third.
6. **singlecab** — a single-cab bakkie / pickup truck: a two-door cab with a single seat row at the front, and a long open load bed/cargo tub across the rear two-thirds.

---

## After generating

1. Save each as `assets/vehicles/<type>.png` (sedan, hatchback, suv, coupe, doublecab, singlecab).
2. `npm run dev` → click through the vehicle picker; hotspots should sit on the
   doors/dash/boot. If a dot is slightly off, nudge that zone's `x`/`y` (% of frame)
   in `js/data/vehicles.js`.
3. Commit the images. (Or upload them in chat and I'll place + align them.)
