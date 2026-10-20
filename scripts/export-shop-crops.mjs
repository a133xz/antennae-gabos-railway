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

/** Shop page background — matches .gabos-page-shop */
const SHOP_BG = { r: 242, g: 242, b: 242, alpha: 1 }

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
 * positioned at top/left %, clipped to the box. Background = shop gray.
 */
async function renderCrop({ sourcePath, top, left, width, height, aspect, outPath }) {
  const { w: aspectW, h: aspectH } = parseAspect(aspect)
  const containerW = Math.round(aspectW * SCALE)
  const containerH = Math.round(aspectH * SCALE)

  const imgW = Math.round(parsePercent(width) * containerW)
  const imgH = Math.round(parsePercent(height) * containerH)
  const imgX = Math.round(parsePercent(left) * containerW)
  const imgY = Math.round(parsePercent(top) * containerH)

  const resized = await sharp(sourcePath).resize(imgW, imgH, { fit: 'fill' }).png().toBuffer()

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
      background: SHOP_BG,
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

const crops = JSON.parse(await fs.readFile(cropsPath, 'utf8'))

await fs.mkdir(originalsDir, { recursive: true })
await fs.mkdir(croppedDir, { recursive: true })
await fs.mkdir(publicCroppedDir, { recursive: true })

let count = 0
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
    console.log(`Wrote ${path.relative(root, designOut)} (+ public/shop/cropped/)`)
    count += 1
  }
}

console.log(`\nDone — ${count} cropped PNG(s) in design/shop/cropped/ and public/shop/cropped/`)
