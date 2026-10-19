import Link from 'next/link'
import { shopLook } from '@/content/shop-looks'
import type { Product } from '@/content/types'
import { formatPrice } from '@/lib/format-price'
import { ProductCardPhoto } from './product-card-photo'

export function ProductCard({ product }: { product: Product }) {
  const look = shopLook(product.slug)
  const href = `/shop/${product.slug}`

  return (
    <article>
      <Link
        href={href}
        className="group/card block transition-opacity hover:opacity-70"
        aria-label={product.title}
      >
        {look ? (
          <ProductCardPhoto card={look.card} cardAlt={look.cardAlt} aspect="445 / 545" />
        ) : (
          <div className="relative aspect-[445/545] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image.src} alt={product.image.alt} className="h-full w-full object-contain" />
          </div>
        )}
        <div className="relative z-10 -mt-[var(--shop-card-caption-overlap)] text-center text-[21px] uppercase leading-none">
          <h2>{product.title}</h2>
          <p className="mt-0">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}
