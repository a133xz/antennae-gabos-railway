/** True when Stripe publishable key is set (client-safe). Checkout stays off until then. */
export function checkoutAvailable() {
  return Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_'))
}
