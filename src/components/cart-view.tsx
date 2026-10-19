'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { shopLook } from '@/content/shop-looks'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format-price'
import { checkoutAvailable } from '@/lib/shop-demo'
import { CroppedPhoto } from './cropped-photo'

export function CartView() {
  const { lines, subtotal, ready, setQuantity, removeLine, clear } = useCart()
  const [revealed, setRevealed] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const canCheckout = checkoutAvailable() && lines.every((line) => line.stripePriceId)

  useEffect(() => {
    if (!ready) {
      setRevealed(false)
      return
    }
    const id = requestAnimationFrame(() => setRevealed(true))
    return () => cancelAnimationFrame(id)
  }, [ready])

  async function checkout() {
    if (!canCheckout) {
      setError('Checkout is preview-only until Stripe keys and Price IDs are configured (see docs/stripe-setup.md).')
      return
    }
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

  if (!ready) {
    return (
      <div
        className="min-h-[50vh] lg:min-h-[34rem]"
        aria-busy="true"
        aria-label="Loading cart"
      />
    )
  }

  const fade =
    'transition-opacity duration-500 ease-out motion-reduce:transition-none ' +
    (revealed ? 'opacity-100' : 'opacity-0')

  if (lines.length === 0) {
    return (
      <div className={`flex-1 ${fade}`}>
        <p className="fixed left-1/2 top-1/2 w-[min(909px,90vw)] -translate-x-1/2 -translate-y-1/2 text-center text-[32px] uppercase leading-none">
          your cart is empty
        </p>
      </div>
    )
  }

  return (
    <div className={fade}>
      <ul className="border-y border-black">
        {lines.map((line) => {
          const look = shopLook(line.slug)
          const color = look?.color
          return (
            <li key={line.key} className="border-b border-black py-0 last:border-b-0">
              <div className="grid items-start gap-8 py-8 lg:grid-cols-[minmax(0,421px)_1fr_auto] lg:gap-6 lg:py-0">
                <div className="w-full max-w-[421px]">
                  {look ? (
                    <CroppedPhoto crop={look.card} aspect="421 / 545" alt={look.card.alt} />
                  ) : (
                    <div className="relative aspect-[421/545] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={line.imageSrc} alt={line.imageAlt} className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="text-center text-[21px] uppercase leading-none lg:pt-[var(--cart-line-text-offset-lg)]">
                  <p>{line.title}</p>
                  {color ? (
                    <>
                      <p className="h-[21px]" aria-hidden="true" />
                      <p>{color}</p>
                    </>
                  ) : null}
                  <p>size {line.size}</p>
                  <div className="mt-[23px] flex items-center justify-center gap-2">
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(line.key, line.quantity - 1)}>
                      -
                    </button>
                    <span className="min-w-[0.6em]">{line.quantity}</span>
                    <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(line.key, line.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.key)}
                    className="mt-3 text-[19px] normal-case opacity-60 transition-opacity hover:opacity-100"
                  >
                    remove
                  </button>
                </div>
                <p className="text-right text-[21px] uppercase leading-none lg:pt-[var(--cart-line-text-offset-lg)]">
                  {formatPrice(line.price * line.quantity, 2)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="mt-[42px] grid items-center gap-6 sm:grid-cols-3">
        <Link href="/shop" className="text-[19px] uppercase leading-none transition-opacity hover:opacity-70">
          continue shopping &gt;
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={() => void checkout()}
          className="mx-auto flex h-[38px] w-[157px] items-center justify-center border border-black text-[19px] uppercase leading-none transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          checkout &gt;
        </button>
        <p className="text-right text-[21px] uppercase leading-none">subtotal {formatPrice(subtotal, 2)}</p>
      </div>
      {!canCheckout && lines.length > 0 ? (
        <p className="mt-4 text-center text-sm font-normal normal-case opacity-70">
          Cart preview — add and remove items freely. Connect Stripe to enable checkout.
        </p>
      ) : null}
      {error ? <p className="mt-4 text-center text-sm font-normal normal-case text-red-700">{error}</p> : null}
    </div>
  )
}
