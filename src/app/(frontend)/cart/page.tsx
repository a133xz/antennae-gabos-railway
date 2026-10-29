import type { Metadata } from 'next'
import { CartView } from '@/components/cart-view'
import { GabosStoreShell } from '@/components/gabos-store-shell'
import { ShopComingSoonView } from '@/components/shop-coming-soon-view'
import { getSettings, isShopAvailable } from '@/content/site'

export const metadata: Metadata = { title: 'Cart' }

export default async function CartPage() {
  const settings = await getSettings()
  if (!isShopAvailable(settings)) {
    return (
      <GabosStoreShell mainTop="placeholder">
        <ShopComingSoonView />
      </GabosStoreShell>
    )
  }

  return (
    <GabosStoreShell mainTop="cart">
      <CartView />
    </GabosStoreShell>
  )
}
