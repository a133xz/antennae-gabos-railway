'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Product } from '@/content/types'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format-price'
import { StoreVerticalStack } from './store-vertical-stack'

export function AddToCartForm({ product }: { product: Product }) {
  const { addLine } = useCart()
  const router = useRouter()
  const [size, setSize] = useState(product.sizes[0] ?? 'XS')

  return (
    <div className="mx-auto max-w-[444px] text-center">
      <p className="mt-[18px] text-[21px] leading-none">{formatPrice(product.price)}</p>
      <StoreVerticalStack insetTop="wide" className="shop-detail-meta">
        <div className="mx-auto flex w-full max-w-[444px] justify-between text-[21px] leading-none lg:mt-11">
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
        <p className="mx-auto max-w-[444px] whitespace-pre-line text-center text-[21px] uppercase leading-[normal] lg:mt-12">
          {product.description}
        </p>
        <button
          type="button"
          onClick={() => {
            addLine(
              {
                productId: product.id,
                slug: product.slug,
                title: product.title,
                price: product.price,
                imageSrc: product.image.src,
                imageAlt: product.image.alt,
                size,
                stripePriceId: product.stripePriceId,
              },
              1,
            )
            router.push('/cart')
          }}
          className="mx-auto flex h-[38px] w-[157px] items-center justify-center border border-black text-[19px] uppercase leading-none transition-opacity hover:opacity-70 lg:mt-7"
        >
          add to cart
        </button>
      </StoreVerticalStack>
    </div>
  )
}
