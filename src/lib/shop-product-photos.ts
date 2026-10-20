import type { Picture, Product } from '@/content/types'

/** Pre-rendered crops from `npm run design:shop-crops` use these name segments. */
const GRID_HOVER = /__grid-card-hover/
const PDP = /__pdp-/

/** Shop grid hover image, when gallery includes a pre-cropped hover frame. */
export function shopCardHover(product: Product): Picture | null {
  const hover = product.gallery.find((photo) => GRID_HOVER.test(photo.src))
  if (hover) return hover
  const alt = product.gallery.find((photo) => photo.src !== product.image.src)
  return alt ?? null
}

/** Product detail photos — PDP crops only, else gallery / main image. */
export function shopPdpPhotos(product: Product): Picture[] {
  const pdp = product.gallery.filter((photo) => PDP.test(photo.src))
  if (pdp.length > 0) return pdp
  const rest = product.gallery.filter((photo) => !GRID_HOVER.test(photo.src))
  if (rest.length > 0) return rest
  return product.image.src ? [product.image] : []
}
