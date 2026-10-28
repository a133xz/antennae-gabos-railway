import { products as seedProducts, settings as staticSettings } from './records'
import type { Product, SiteSettings } from './types'

/**
 * Serve `records.ts` when the CMS is not configured (static preview).
 * With `PAYLOAD_SECRET` set and static preview off, pages read Payload instead.
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
