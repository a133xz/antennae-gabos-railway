'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Product } from '@/content/types'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format-price'

export function AddToCartForm({ product }: { product: Product }) {
  const { addLine } = useCart()
  const router = useRouter()
  const [size, setSize] = useState(product.sizes[0] ?? 'XS')
  const [notice, setNotice] = useState('')

  const checkoutReady = Boolean(product.stripePriceId)

  return (
    <div className="mx-auto max-w-md text-center">
      <p className="text-[21px]">{formatPrice(product.price)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-[21px] lowercase">
        {product.sizes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSize(option)}
            className={`transition-opacity ${size === option ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="mx-auto mt-10 max-w-[28rem] text-left text-[21px] font-bold normal-case leading-snug">
        {product.description}
      </p>
      <button
        type="button"
        disabled={!checkoutReady}
        onClick={() => {
          if (!product.stripePriceId) {
            setNotice('Stripe price ID missing for this product — add it in Payload admin.')
            return
          }
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
          setNotice('Added to cart')
          router.push('/cart')
        }}
        className="mt-10 inline-flex min-w-[157px] items-center justify-center bg-[var(--color-burgundy)] px-6 py-2.5 text-[19px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        add to cart
      </button>
      {notice ? <p className="mt-4 text-sm normal-case">{notice}</p> : null}
      {!checkoutReady ? (
        <p className="mt-4 text-sm font-normal normal-case opacity-70">
          Connect Stripe and set a Price ID on this product to enable checkout.
        </p>
      ) : null}
    </div>
  )
}
