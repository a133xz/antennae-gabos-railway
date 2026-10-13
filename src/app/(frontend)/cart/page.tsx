import type { Metadata } from 'next'
import { CartView } from '@/components/cart-view'
import { GabosStoreShell } from '@/components/gabos-store-shell'

export const metadata: Metadata = { title: 'Cart' }

export default function CartPage() {
  return (
    <GabosStoreShell>
      <CartView />
    </GabosStoreShell>
  )
}
