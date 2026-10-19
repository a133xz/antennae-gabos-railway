'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { shopLook } from '@/content/shop-looks'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format-price'
import { checkoutAvailable } from '@/lib/shop-demo'
import { CroppedPhoto } from './cropped-photo'

/** Desktop lg: line row + footer share grid-cols-[421px_1fr_auto] — detail and checkout in column 2. */
const cartDesktopCols = 'lg:grid-cols-[minmax(0,421px)_1fr_auto]'

export function CartView() {
  const { lines, subtotal, ready, setQuantity, removeLine, clear } = useCart()
  const [revealed, setRevealed] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const canCheckout = checkoutAvailable() && lines.every((line) => line.stripePriceId)
  const singleLine = lines.length === 1

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
    <div className={`flex flex-col ${fade} lg:min-h-0 lg:flex-1`}>
      <ul
        className={`border-y border-black lg:flex lg:flex-col ${singleLine ? 'lg:min-h-0 lg:flex-1' : ''}`}
      >
        {lines.map((line) => {
          const look = shopLook(line.slug)
          const color = look?.color
          return (
            <li
              key={line.key}
              className={`cart-line border-b border-black py-0 last:border-b-0 ${singleLine ? 'lg:flex lg:min-h-0 lg:flex-1 lg:flex-col' : ''}`}
            >
              <div
                className={`cart-line-grid flex flex-col items-center gap-8 py-8 lg:grid ${cartDesktopCols} lg:justify-items-stretch lg:items-center lg:gap-6 lg:py-0 ${singleLine ? 'lg:min-h-0 lg:flex-1' : ''}`}
              >
                <div className="w-full max-w-[421px] lg:justify-self-start lg:self-start">
                  {look ? (
                    <CroppedPhoto crop={look.card} aspect="421 / 545" alt={look.card.alt} />
                  ) : (
                    <div className="relative aspect-[421/545] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={line.imageSrc} alt={line.imageAlt} className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col items-center text-center text-[21px] uppercase leading-none lg:justify-self-center lg:px-4">
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
                  <p className="mt-[23px] text-[21px] uppercase leading-none lg:hidden">
                    {formatPrice(line.price * line.quantity, 2)}
                  </p>
                </div>
                <p className="hidden text-right text-[21px] uppercase leading-none lg:block lg:justify-self-end lg:self-center">
                  {formatPrice(line.price * line.quantity, 2)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <div
        className={`mt-[42px] flex flex-col items-center gap-6 text-center lg:grid ${cartDesktopCols} lg:items-center lg:text-left`}
      >
        <Link
          href="/shop"
          className="text-[19px] uppercase leading-none transition-opacity hover:opacity-70 lg:justify-self-start"
        >
          continue shopping &gt;
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={() => void checkout()}
          className="box-border block h-[38px] w-[157px] border border-black bg-transparent p-0 text-center text-[19px] uppercase leading-[38px] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 lg:justify-self-center"
        >
          checkout&nbsp;&gt;
        </button>
        <p className="text-[21px] uppercase leading-none lg:justify-self-end lg:text-right">
          subtotal {formatPrice(subtotal, 2)}
        </p>
      </div>
      {error ? <p className="mt-4 text-center text-sm font-normal normal-case text-red-700">{error}</p> : null}
    </div>
  )
}
