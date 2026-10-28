import { NextResponse } from 'next/server'
import { getProductById, getSettings, isShopAvailable } from '@/content/site'
import { getStripe } from '@/lib/stripe'

type CheckoutItem = {
  stripePriceId: string
  quantity: number
  productId: number
  size: string
}

export async function POST(request: Request) {
  const settings = await getSettings()
  if (!isShopAvailable(settings)) {
    return NextResponse.json({ error: 'Shop is not available' }, { status: 403 })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe is not configured. See docs-internal/stripe-setup.md.' }, { status: 503 })
  }

  const body = (await request.json()) as { items?: CheckoutItem[] }
  const items = body.items?.filter((item) => item.stripePriceId && item.quantity > 0) ?? []
  if (!items.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const origin = new URL(request.url).origin

  for (const item of items) {
    const product = getProductById(item.productId)
    if (!product?.active || !product.stripePriceId || product.stripePriceId !== item.stripePriceId) {
      return NextResponse.json({ error: 'Product pricing is out of date. Refresh and try again.' }, { status: 400 })
    }
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map((item) => ({
      price: item.stripePriceId,
      quantity: item.quantity,
    })),
    success_url: `${origin}/shop?checkout=success`,
    cancel_url: `${origin}/cart?checkout=cancelled`,
    metadata: {
      sizes: items.map((item) => `${item.productId}:${item.size}:${item.quantity}`).join('|'),
    },
    shipping_address_collection: {
      allowed_countries: ['ES', 'PT', 'FR', 'DE', 'IT', 'GB', 'US'],
    },
  })

  if (!session.url) {
    return NextResponse.json({ error: 'Could not start checkout' }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
