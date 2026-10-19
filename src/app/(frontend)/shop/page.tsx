import type { Metadata } from 'next'
import { GabosStoreShell } from '@/components/gabos-store-shell'
import { ProductCard } from '@/components/product-card'
import { shopCatalogSlugs, shopOrder } from '@/content/shop-looks'
import { getProducts } from '@/content/site'

export const metadata: Metadata = { title: 'Shop' }

export default async function ShopPage() {
  const products = [...(await getProducts())]
    .filter((product) => shopCatalogSlugs.has(product.slug))
    .sort((a, b) => shopOrder(a.slug) - shopOrder(b.slug) || a.order - b.order)

  return (
    <GabosStoreShell surface="shop">
      <>
        <h1 className="sr-only">Shop</h1>
        <ul className="grid grid-cols-4 gap-x-5">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </>
    </GabosStoreShell>
  )
}
