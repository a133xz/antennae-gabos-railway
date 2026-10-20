/**
 * Renders cropped shop PNGs from design/shop/originals using crops.json
 * (same math as the old CroppedPhoto component). Outputs to design/shop/cropped/.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const designDir = path.join(root, 'design', 'shop')
const originalsDir = path.join(designDir, 'originals')
const croppedDir = path.join(designDir, 'cropped')
const publicCroppedDir = path.join(root, 'public', 'shop', 'cropped')
const publicShopDir = path.join(root, 'public', 'shop')
const cropsPath = path.join(designDir, 'crops.json')

/** Transparent frame — shop gray (#f2f2f2) comes from the page CSS, not baked into PNGs. */
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

const ALPHA_CUTOFF = 16

const SCALE = 2

function parsePercent(value) {
  return parseFloat(String(value).replace('%', '')) / 100
}

function parseAspect(aspect) {
  const [w, h] = aspect.split('/').map((part) => parseFloat(part.trim()))
  if (!w || !h) throw new Error(`Invalid aspect: ${aspect}`)
  return { w, h }
}

async function ensureOriginal(filename) {
  const dest = path.join(originalsDir, filename)
  try {
    await fs.access(dest)
    return dest
  } catch {
    const fromPublic = path.join(publicShopDir, filename)
    await fs.copyFile(fromPublic, dest)
    console.log(`Copied ${filename} → design/shop/originals/ (from public/shop)`)
    return dest
  }
}

/**
 * Replicate CroppedPhoto: img stretched to width/height % of an aspect-ratio box,
 * positioned at top/left %, clipped to the box. Transparent outside the product.
 */
async function renderCrop({ sourcePath, top, left, width, height, aspect, outPath }) {
  const { w: aspectW, h: aspectH } = parseAspect(aspect)
  const containerW = Math.round(aspectW * SCALE)
  const containerH = Math.round(aspectH * SCALE)

  const imgW = Math.round(parsePercent(width) * containerW)
  const imgH = Math.round(parsePercent(height) * containerH)
  const imgX = Math.round(parsePercent(left) * containerW)
  const imgY = Math.round(parsePercent(top) * containerH)

  const resized = await sharp(sourcePath).ensureAlpha().resize(imgW, imgH, { fit: 'fill' }).png().toBuffer()

  const clipLeft = Math.max(0, imgX)
  const clipTop = Math.max(0, imgY)
  const clipRight = Math.min(containerW, imgX + imgW)
  const clipBottom = Math.min(containerH, imgY + imgH)
  const visibleW = clipRight - clipLeft
  const visibleH = clipBottom - clipTop

  await fs.mkdir(path.dirname(outPath), { recursive: true })

  const base = sharp({
    create: {
      width: containerW,
      height: containerH,
      channels: 4,
      background: TRANSPARENT,
    },
  })

  if (visibleW > 0 && visibleH > 0) {
    const srcCropX = clipLeft - imgX
    const srcCropY = clipTop - imgY
    const visible = await sharp(resized)
      .extract({
        left: Math.max(0, srcCropX),
        top: Math.max(0, srcCropY),
        width: visibleW,
        height: visibleH,
      })
      .toBuffer()
    await base.composite([{ input: visible, left: clipLeft, top: clipTop }]).png().toFile(outPath)
  } else {
    await base.png().toFile(outPath)
  }
}

function hasVisiblePixel(a) {
  return a >= ALPHA_CUTOFF
}

/** Bounding box of non-transparent pixels (the product). */
async function contentBBox(imagePath) {
  const { data, info } = await sharp(imagePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (hasVisiblePixel(data[i + 3])) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }
  if (maxX < minX) return null
  return {
    width,
    height,
    minX,
    minY,
    bw: maxX - minX + 1,
    bh: maxY - minY + 1,
    cx: minX + (maxX - minX + 1) / 2,
    cy: minY + (maxY - minY + 1) / 2,
  }
}

/** Scale hover product to match reference card so grid ↔ hover swap does not “zoom”. */
async function matchFillToReference(referencePath, hoverPath, outPath) {
  const ref = await contentBBox(referencePath)
  const hov = await contentBBox(hoverPath)
  if (!ref || !hov) {
    await fs.copyFile(hoverPath, outPath)
    return
  }

  const content = await sharp(hoverPath)
    .extract({ left: hov.minX, top: hov.minY, width: hov.bw, height: hov.bh })
    .resize(ref.bw, ref.bh, { fit: 'fill' })
    .png()
    .toBuffer()

  const left = ref.minX
  const top = ref.minY

  await sharp({
    create: {
      width: ref.width,
      height: ref.height,
      channels: 4,
      background: TRANSPARENT,
    },
  })
    .composite([{ input: content, left, top }])
    .png()
    .toFile(outPath)
}

const crops = JSON.parse(await fs.readFile(cropsPath, 'utf8'))

await fs.mkdir(originalsDir, { recursive: true })
await fs.mkdir(croppedDir, { recursive: true })
await fs.mkdir(publicCroppedDir, { recursive: true })

let count = 0
const written = new Map()

for (const item of crops.items) {
  for (const exp of item.exports) {
    const sourcePath = await ensureOriginal(exp.source)
    const outName = `${item.slug}__${exp.id}.png`
    const cropArgs = {
      sourcePath,
      top: exp.top,
      left: exp.left,
      width: exp.width,
      height: exp.height,
      aspect: exp.aspect,
    }
    const designOut = path.join(croppedDir, outName)
    const publicOut = path.join(publicCroppedDir, outName)
    await renderCrop({ ...cropArgs, outPath: designOut })
    await renderCrop({ ...cropArgs, outPath: publicOut })
    written.set(`${item.slug}::${exp.id}`, { designOut, publicOut, matchFillTo: exp.matchFillTo })
    console.log(`Wrote ${path.relative(root, designOut)} (+ public/shop/cropped/)`)
    count += 1
  }
}

for (const item of crops.items) {
  for (const exp of item.exports) {
    if (!exp.matchFillTo) continue
    const ref = written.get(`${item.slug}::${exp.matchFillTo}`)
    const self = written.get(`${item.slug}::${exp.id}`)
    if (!ref || !self) continue
    await matchFillToReference(ref.designOut, self.designOut, self.designOut)
    await matchFillToReference(ref.publicOut, self.publicOut, self.publicOut)
    console.log(`Matched ${exp.id} fill to ${exp.matchFillTo} (${item.slug})`)
  }
}

console.log(`\nDone — ${count} cropped PNG(s) in design/shop/cropped/ and public/shop/cropped/`)
