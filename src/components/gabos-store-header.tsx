import Link from 'next/link'
import type { SiteSettings } from '@/content/types'
import { CartLink } from './cart-link'
import { StoreNav } from './store-nav'

export function GabosStoreHeader({ settings }: { settings: SiteSettings }) {
  const navItems = [
    { label: 'Menu', href: settings.menuPdfUrl, download: true, external: true },
    { label: 'shop', href: '/shop', activePrefix: '/shop' },
    { label: 'book', href: settings.bookUrl, external: true },
    { label: 'contact', href: '/contact' },
  ]

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 pt-[var(--gutter-top)] pb-0 max-[758px]:grid-cols-[1fr_auto]">
      <Link href="/" className="text-[21px] uppercase transition-opacity hover:opacity-70">
        gabos
      </Link>

      {/* Desktop (≥759px): unchanged 3-column — nav center, cart right */}
      <StoreNav
        items={navItems}
        className="justify-center max-[758px]:hidden sm:gap-x-8 lg:gap-x-12"
      />
      <div className="flex items-center justify-end gap-4 max-[758px]:hidden">
        <CartLink className="text-[21px] uppercase transition-opacity hover:opacity-70" />
      </div>

      {/* ≤758px only: nav + cart grouped on the right */}
      <div className="col-start-2 hidden max-w-full max-[758px]:flex max-[758px]:flex-wrap max-[758px]:items-center max-[758px]:justify-end max-[758px]:gap-4">
        <StoreNav items={navItems} className="justify-end gap-4" />
        <CartLink className="text-[21px] uppercase transition-opacity hover:opacity-70" />
      </div>
    </header>
  )
}
