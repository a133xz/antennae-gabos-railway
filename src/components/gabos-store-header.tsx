import Link from 'next/link'
import type { SiteSettings } from '@/content/types'
import { CartLink } from './cart-link'
import { MobileNav } from './mobile-nav'
import { StoreNav } from './store-nav'

export function GabosStoreHeader({ settings }: { settings: SiteSettings }) {
  const mobileItems = [
    { label: 'Menu', href: settings.menuPdfUrl },
    { label: 'shop', href: '/shop' },
    { label: 'book', href: settings.bookUrl },
    { label: 'contact', href: '/contact' },
  ]

  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-[var(--gutter)] py-5">
      <Link href="/" className="text-[21px] uppercase transition-opacity hover:opacity-70">
        gabos
      </Link>
      <StoreNav
        items={[
          { label: 'Menu', href: settings.menuPdfUrl, download: true, external: true },
          { label: 'shop', href: '/shop', activePrefix: '/shop' },
          { label: 'book', href: settings.bookUrl, external: true },
          { label: 'contact', href: '/contact' },
        ]}
      />
      <div className="flex items-center justify-end gap-4">
        <CartLink className="text-[21px] uppercase transition-opacity hover:opacity-70" />
        <MobileNav items={mobileItems} />
      </div>
    </header>
  )
}
