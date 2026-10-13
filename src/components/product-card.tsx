import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/content/types'
import { formatPrice } from '@/lib/format-price'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article>
      <Link href={`/shop/${product.slug}`} className="group block">
        <div className="relative aspect-[445/545] w-full overflow-hidden bg-[#f5f5f5]">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-opacity group-hover:opacity-90"
          />
        </div>
        <div className="mt-5 text-center text-[21px] leading-tight">
          <h2 className="font-bold lowercase">{product.title}</h2>
          <p>{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}
