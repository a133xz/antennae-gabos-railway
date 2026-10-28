import { cache } from 'react'
import { products as catalog, settings } from './records'
import type { Product } from './types'

const products: Product[] = catalog.map((doc, index) => ({
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

export function isShopAvailable(siteSettings: { shopAvailable: boolean }) {
  return siteSettings.shopAvailable
}

export const getSettings = cache(async () => settings)

export const getProducts = cache(async () => products.filter((product) => product.active))

export const getProduct = cache(async (slug: string) => {
  return products.find((product) => product.slug === slug && product.active) ?? null
})

export function getProductById(id: number) {
  return products.find((product) => product.id === id && product.active) ?? null
}
