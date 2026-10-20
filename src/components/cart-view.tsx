'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { shopLook } from '@/content/shop-looks'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/format-price'
import { checkoutAvailable } from '@/lib/shop-demo'
import { CroppedPhoto } from './cropped-photo'
import { StoreVerticalStack } from './store-vertical-stack'

/** Action row uses footer grid; line rows use their own column template (see cartLineRow). */
const cartStoreGrid =
  'flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[1fr_auto_1fr] md:grid-rows-[1fr_auto] md:gap-x-6'
const cartLineList = 'md:col-span-3 md:row-start-1 md:min-h-0'
/**
 * md–1469: 421 | 1fr | auto — detail centered between photo and price.
 * 1470+: 1fr | auto | 1fr — detail viewport-centered (same as footer / checkout row).
 */
const cartLineRow =
  'md:grid md:items-center md:gap-x-6 md:max-[1469px]:grid-cols-[minmax(0,421px)_1fr_auto] min-[1470px]:grid-cols-[1fr_auto_1fr]'
const cartActionsRow =
  'cart-actions text-center lg:mt-[42px] md:col-span-3 md:row-start-2 md:grid md:grid-cols-subgrid md:items-center'

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
      <div className={`store-cart cart-empty flex min-h-0 flex-1 flex-col ${fade}`}>
        <p className="mx-auto w-[min(909px,90vw)] text-center text-[32px] uppercase leading-none max-md:flex max-md:min-h-0 max-md:flex-1 max-md:items-center max-md:justify-center md:fixed md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2">
          your cart is empty
        </p>
      </div>
    )
  }

  return (
    <div className={`store-cart ${fade} ${cartStoreGrid}`}>
      <ul
        className={`flex flex-col border-y border-black ${cartLineList} ${singleLine ? 'md:flex-1 md:justify-center' : ''}`}
      >
        {lines.map((line) => {
          const look = shopLook(line.slug)
          const color = look?.color
          return (
            <li
              key={line.key}
              className={`cart-line border-b border-black py-0 last:border-b-0 ${cartLineRow} ${singleLine ? 'md:min-h-0 md:flex-1' : ''}`}
            >
              <div className="cart-line-grid flex flex-col items-center gap-8 py-8 md:contents md:py-0">
                <div className="cart-line-photo w-full max-w-[421px] md:justify-self-start md:self-center">
                  {look ? (
                    <CroppedPhoto crop={look.card} aspect="421 / 545" alt={look.card.alt} />
                  ) : (
                    <div className="relative aspect-[421/545] w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={line.imageSrc} alt={line.imageAlt} className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
                <div className="cart-line-detail flex w-full flex-col items-center text-center text-[21px] uppercase leading-none md:w-auto md:justify-self-center md:self-center">
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
                  <p className="mt-[23px] text-[21px] uppercase leading-none md:hidden">
                    {formatPrice(line.price * line.quantity, 2)}
                  </p>
                </div>
                <p className="cart-line-price hidden text-right text-[21px] uppercase leading-none md:block md:justify-self-end md:self-center">
                  {formatPrice(line.price * line.quantity, 2)}
                </p>
              </div>
            </li>
          )
        })}
      </ul>

      <StoreVerticalStack insetTop="wide" className={cartActionsRow}>
        <Link
          href="/shop"
          className="text-[19px] uppercase leading-none transition-opacity hover:opacity-70 md:justify-self-start md:self-center md:text-left"
        >
          continue shopping &gt;
        </Link>
        <button
          type="button"
          disabled={pending}
          onClick={() => void checkout()}
          className="box-border block h-[38px] w-[157px] border border-black bg-transparent p-0 text-center text-[19px] uppercase leading-[38px] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 md:justify-self-center md:self-center"
        >
          checkout&nbsp;&gt;
        </button>
        <p className="text-[21px] uppercase leading-none md:justify-self-end md:self-center md:text-right">
          subtotal {formatPrice(subtotal, 2)}
        </p>
      </StoreVerticalStack>
      {error ? <p className="mt-4 text-center text-sm font-normal normal-case text-red-700">{error}</p> : null}
    </div>
  )
}
