'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format-price'

export function CartView() {
  const { lines, subtotal, setQuantity, removeLine, clear } = useCart()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  if (lines.length === 0) {
    return (
      <p className="py-[40vh] text-center text-[32px] font-bold lowercase">
        your cart is empty
      </p>
    )
  }

  async function checkout() {
    setPending(true)
    setError('')
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((line) => ({
            stripePriceId: line.stripePriceId,
            quantity: line.quantity,
            productId: line.productId,
            size: line.size,
          })),
        }),
      })
      const data = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !data.url) {
        setError(data.error || 'Checkout failed')
        setPending(false)
        return
      }
      clear()
      window.location.href = data.url
    } catch {
      setError('Could not reach checkout')
      setPending(false)
    }
  }

  return (
    <div className="px-[var(--gutter)] pb-20">
      <ul className="divide-y divide-black/20 border-y border-black/20">
        {lines.map((line) => (
          <li key={line.key} className="grid gap-8 py-8 lg:grid-cols-[min(445px,40%)_1fr] lg:items-start">
            <div className="relative aspect-[421/545] w-full max-w-md bg-[#f5f5f5]">
              <Image src={line.imageSrc} alt={line.imageAlt} fill className="object-cover" sizes="40vw" />
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
              <div className="text-center lg:text-left">
                <p className="max-w-[8rem] text-[21px] lowercase leading-snug lg:mx-0 lg:max-w-none">
                  {line.title} size {line.size}
                </p>
                <div className="mt-6 inline-flex items-center gap-4 text-[21px]">
                  <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(line.key, line.quantity - 1)}>
                    -
                  </button>
                  <span>{line.quantity}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(line.key, line.quantity + 1)}>
                    +
                  </button>
                </div>
                <button type="button" className="mt-4 block text-sm font-normal normal-case opacity-60" onClick={() => removeLine(line.key)}>
                  Remove
                </button>
              </div>
              <p className="text-right text-[21px]">{formatPrice(line.price * line.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        <Link href="/shop" className="text-[19px] lowercase transition-opacity hover:opacity-70">
          continue shopping &gt;
        </Link>
        <div className="flex flex-col items-center gap-4 md:items-end">
          <p className="text-[21px]">subtotal {formatPrice(subtotal)}</p>
          <button
            type="button"
            disabled={pending}
            onClick={() => void checkout()}
            className="inline-flex min-w-[157px] items-center justify-center bg-[var(--color-burgundy)] px-6 py-2.5 text-[19px] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            checkout &gt;
          </button>
          {error ? <p className="text-sm font-normal normal-case text-red-700">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}
