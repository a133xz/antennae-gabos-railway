import { products as seedProducts, settings as staticSettings } from './records'
import type { Product, SiteSettings } from './types'

/**
 * Serve seed copy from `records.ts` when CMS env is not set (designer preview on Vercel).
 * Set `PAYLOAD_SECRET` + `DATABASE_URL` later to switch to Payload with no code change.
 */
export function useStaticContent() {
  if (process.env.GABOS_STATIC_PREVIEW === 'true') return true
  return !process.env.PAYLOAD_SECRET?.trim()
}

const staticProducts: Product[] = seedProducts.map((doc, index) => ({
  id: index + 1,
  title: doc.title,
  slug: doc.slug,
  price: doc.price,
  description: doc.description,
  sizes: doc.sizes,
  image: doc.image,
  gallery: doc.gallery?.length ? doc.gallery : [doc.image],
  active: doc.active,
  order: doc.order,
}))

export function getStaticSettings(): SiteSettings {
  return staticSettings
}

export function getStaticProducts(): Product[] {
  return staticProducts
}

export function getStaticProduct(slug: string): Product | null {
  return staticProducts.find((p) => p.slug === slug) ?? null
}
