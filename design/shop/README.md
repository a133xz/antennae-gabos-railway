# Shop image crops (designer handoff)

Original photographer/designer exports live in **`originals/`**.  
Cropped previews (same framing as the old in-browser crop) are generated into **`cropped/`**.

## Workflow

1. Put full-size PNGs in `originals/` (or leave them in `public/shop/` — the export script copies missing files into `originals/` on first run).
2. Tune framing in `crops.json` if needed (percentages match the old `CroppedPhoto` layout).
3. Run:

   ```bash
   npm run design:shop-crops
   ```

4. Zip or share **`design/shop/cropped/`** with the designer for review.
5. The same command writes **`public/shop/cropped/`**, which the site uses via `records.ts` / Payload. After changing crops, run:

   ```bash
   npm run design:shop-crops
   npm run seed:shop-images
   ```

## Output names

`{product-slug}__{export-id}.png` — e.g. `f1-shorts-1__grid-card.png`, `f1-tank-top-black__grid-card-hover.png`, `f1-tank-top-black__pdp-front.png`.

Grid exports use a **445×545** frame (×2 in file resolution). PDP exports use the aspects from `crops.json`. PNGs are **transparent** outside the product; the shop page background (`#f2f2f2`) shows through in the browser.
