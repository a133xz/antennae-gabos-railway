import Link from 'next/link'
import type { Product } from '@/content/types'
import { formatPrice } from '@/lib/format-price'
import { shopCardHover } from '@/lib/shop-product-photos'
import { ShopPhoto } from './shop-photo'

export function ProductCard({ product }: { product: Product }) {
  const href = `/shop/${product.slug}`
  const hoverShot = shopCardHover(product)

  return (
    <article>
      <Link
        href={href}
        className="group/card block"
        aria-label={product.title}
      >
        {hoverShot ? (
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '445 / 545' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image.src}
              alt={product.image.alt}
              className="absolute inset-0 h-full w-full object-contain object-center group-hover/card:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hoverShot.src}
              alt={hoverShot.alt}
              className="absolute inset-0 hidden h-full w-full object-contain object-center group-hover/card:block"
            />
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
