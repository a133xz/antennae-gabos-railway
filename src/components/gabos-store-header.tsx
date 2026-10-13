import Link from 'next/link'
import type { SiteSettings } from '@/content/types'
import { CartLink } from './cart-link'
import { GabosNavLink } from './gabos-nav-link'
import { MobileNav } from './mobile-nav'

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
      <nav className="hidden items-center justify-center gap-12 lg:flex" aria-label="Primary">
        <GabosNavLink href={settings.menuPdfUrl} label="Menu" download className="text-[21px] uppercase transition-opacity hover:opacity-70" />
        <GabosNavLink href="/shop" label="shop" className="text-[21px] uppercase transition-opacity hover:opacity-70" />
        <GabosNavLink href={settings.bookUrl} label="book" external className="text-[21px] uppercase transition-opacity hover:opacity-70" />
        <GabosNavLink href="/contact" label="contact" className="text-[21px] uppercase transition-opacity hover:opacity-70" />
      </nav>
      <div className="flex items-center justify-end gap-4">
        <CartLink className="text-[21px] uppercase transition-opacity hover:opacity-70" />
        <MobileNav items={mobileItems} />
      </div>
    </header>
  )
}
