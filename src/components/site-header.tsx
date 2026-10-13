import type { SiteSettings } from '@/content/types'
import { GabosNavLink } from './gabos-nav-link'
import { Logo } from './logo'
import { MobileNav } from './mobile-nav'

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const items = [
    { label: 'Menu', href: settings.menuPdfUrl },
    { label: 'shop', href: '/shop' },
    { label: 'book', href: settings.bookUrl },
    { label: 'contact', href: '/contact' },
  ]

  return (
    <header className="flex items-center justify-between gap-6 px-[var(--gutter)] py-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      <Logo />
      <nav className="hidden items-center justify-center gap-12 lg:flex" aria-label="Primary">
        {items.map((item) => (
          <GabosNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            download={item.label === 'Menu'}
            external={item.label === 'book'}
            className="text-[19px] uppercase transition-opacity hover:opacity-70"
          />
        ))}
      </nav>
      <div className="hidden lg:block" aria-hidden />
      <MobileNav items={items} />
    </header>
  )
}
