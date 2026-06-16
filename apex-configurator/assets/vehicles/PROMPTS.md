# Vehicle artwork — generation guide

The stage loads a top-down image per body type from this folder:

```
sedan · hatchback · suv · coupe · doublecab · singlecab   (.webp preferred, .png also works)
```

The app tries `<type>.webp`, then `<type>.png`, then falls back to the built-in wireframe.

**Art direction:** flat 2D **technical blueprint / schematic** top-down (NOT photoreal),
cyan (#19D0FF) + white line-work on dark `#070912`, interior drawn as line-work so speaker
zones read, **right-hand drive** (steering wheel on the right — South Africa).

➡️ **The full, copy-paste ChatGPT prompts live in [`chatgpt-prompts.txt`](./chatgpt-prompts.txt).**

## Alignment rules (or the hotspots drift)
- True top-down / overhead, orthographic; **front points UP**.
- Vehicle centered, even margins; same scale & framing across all 6.
- Roof off / interior visible (seats, doors, dash, boot).
- No text, numbers, dimension lines, logos or people.

## After generating
1. Save each as `assets/vehicles/<type>.png` (or `.webp`).
2. `npm run dev` → check the hotspots sit on doors/dash/boot; nudge a zone's `x`/`y`
   (% of frame) in `js/data/vehicles.js` if needed.
3. Commit the images — or just upload them in chat and I'll place + align them.
