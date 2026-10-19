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
    <header className="grid grid-cols-[1fr_auto] items-center gap-4 pt-[var(--gutter-top)] pb-0 min-[759px]:grid-cols-[1fr_auto_1fr]">
      <Link href="/" className="text-[21px] uppercase transition-opacity hover:opacity-70">
        gabos
      </Link>
      <div className="flex max-w-full flex-wrap items-center justify-end gap-4 min-[759px]:contents">
        <StoreNav items={navItems} />
        <div className="flex justify-end min-[759px]:contents">
          <CartLink className="text-[21px] uppercase transition-opacity hover:opacity-70" />
        </div>
      </div>
    </header>
  )
}
