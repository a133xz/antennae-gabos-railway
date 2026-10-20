import Link from 'next/link'
import type { Product } from '@/content/types'
import { formatPrice } from '@/lib/format-price'
import { ShopPhoto } from './shop-photo'

export function ProductCard({ product }: { product: Product }) {
  const href = `/shop/${product.slug}`
  const hoverShot = product.gallery.length > 1 ? product.gallery[1] : null

  return (
    <article>
      <Link
        href={href}
        className="group/card block"
        aria-label={product.title}
      >
        {hoverShot ? (
          <div className="relative w-full">
            <ShopPhoto src={product.image.src} alt={product.image.alt} />
            <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100" aria-hidden>
              <ShopPhoto src={hoverShot.src} alt={hoverShot.alt} />
            </div>
          </div>
        ) : (
          <ShopPhoto src={product.image.src} alt={product.image.alt} />
        )}
        <div className="relative z-10 -mt-[var(--shop-card-caption-overlap)] text-center text-[21px] uppercase leading-none">
          <h2>{product.title}</h2>
          <p className="mt-0">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}
