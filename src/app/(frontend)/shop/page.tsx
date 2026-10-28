import type { Metadata } from 'next'
import { GabosStoreShell } from '@/components/gabos-store-shell'
import { ProductCard } from '@/components/product-card'
import { ShopComingSoonView } from '@/components/shop-coming-soon-view'
import { getProducts, getSettings, isShopAvailable } from '@/content/site'

export const metadata: Metadata = { title: 'Shop' }

export default async function ShopPage() {
  const settings = await getSettings()
  if (!isShopAvailable(settings)) {
    return (
      <GabosStoreShell mainTop="cart">
        <ShopComingSoonView />
      </GabosStoreShell>
    )
  }

  const products = [...(await getProducts())].sort((a, b) => a.order - b.order)

  const fitsViewport = products.length <= 4

  return (
    <GabosStoreShell surface="shop">
      <>
        <h1 className="sr-only">Shop</h1>
        <ul
          className={
            fitsViewport ? 'shop-product-row shop-product-row--fits-viewport' : 'shop-product-row'
          }
        >
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
