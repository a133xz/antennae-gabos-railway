import type { Metadata } from 'next'
import { GabosStoreShell } from '@/components/gabos-store-shell'
import { ProductCard } from '@/components/product-card'
import { getProducts } from '@/content/site'

export const metadata: Metadata = { title: 'Shop' }

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <GabosStoreShell>
      <div className="px-[var(--gutter)] pb-10 pt-6">
        <h1 className="sr-only">Shop</h1>
        <ul className="grid grid-cols-1 gap-x-5 gap-y-16 sm:grid-cols-2 xl:grid-cols-4">
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
