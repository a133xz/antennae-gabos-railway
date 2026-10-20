'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { shopLook } from '@/content/shop-looks'
import type { Product } from '@/content/types'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format-price'

export function AddToCartForm({ product, description }: { product: Product; description?: string }) {
  const { addLine } = useCart()
  const router = useRouter()
  const [size, setSize] = useState(product.sizes[0] ?? 'XS')
  const look = shopLook(product.slug)
  const copy = description || product.description

  return (
    <div className="mx-auto max-w-[444px] text-center">
      <p className="mt-[18px] text-[21px] leading-none">{formatPrice(product.price)}</p>
      <div className="shop-detail-meta">
        <div className="mx-auto mt-11 flex w-full max-w-[444px] justify-between text-[21px] leading-none">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSize(option)}
              className={size === option ? 'underline' : 'transition-opacity hover:opacity-70'}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-[444px] whitespace-pre-line text-center text-[21px] uppercase leading-[normal]">
          {copy}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          addLine(
            {
              productId: product.id,
              slug: product.slug,
              title: product.title,
              price: product.price,
              imageSrc: look?.card.src ?? product.image.src,
              imageAlt: look?.card.alt ?? product.image.alt,
              size,
              stripePriceId: product.stripePriceId,
            },
            1,
          )
          router.push('/cart')
        }}
        className="mx-auto mt-7 flex h-[38px] w-[157px] items-center justify-center border border-black text-[19px] uppercase leading-none transition-opacity hover:opacity-70"
      >
        add to cart
      </button>
    </div>
  )
}
