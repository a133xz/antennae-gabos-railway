import Link from 'next/link'
import { shopLook } from '@/content/shop-looks'
import type { Product } from '@/content/types'
import { formatPrice } from '@/lib/format-price'
import { CroppedPhoto } from './cropped-photo'

export function ProductCard({ product }: { product: Product }) {
  const look = shopLook(product.slug)

  return (
    <article>
      <Link href={`/shop/${product.slug}`} className="group block">
        {look ? (
          <CroppedPhoto crop={look.card} aspect="445 / 545" alt={look.card.alt} />
        ) : (
          <div className="relative aspect-[445/545] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image.src} alt={product.image.alt} className="h-full w-full object-contain" />
          </div>
        )}
        <div className="-mt-[27px] text-center text-[21px] uppercase leading-none">
          <h2>{product.title}</h2>
          <p className="mt-0">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}
