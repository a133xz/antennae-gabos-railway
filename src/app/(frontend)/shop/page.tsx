import type { Metadata } from 'next'
import { GabosStoreShell } from '@/components/gabos-store-shell'
import { ProductCard } from '@/components/product-card'
import { shopOrder } from '@/content/shop-looks'
import { getProducts } from '@/content/site'

export const metadata: Metadata = { title: 'Shop' }

export default async function ShopPage() {
  const products = [...(await getProducts())].sort(
    (a, b) => shopOrder(a.slug) - shopOrder(b.slug) || a.order - b.order,
  )

  return (
    <GabosStoreShell surface="shop">
      <div className="px-[var(--gutter)] pb-[clamp(96px,16vh,220px)] pt-[127px]">
        <h1 className="sr-only">Shop</h1>
        <ul className="grid grid-cols-2 gap-x-5 gap-y-[22px] lg:grid-cols-4">
          {products.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </GabosStoreShell>
  )
}
