import type { SiteSettings } from '@/content/types'
import { GabosNavLink } from './gabos-nav-link'
import { Logo } from './logo'

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const items = [
    { label: 'Menu', href: settings.menuPdfUrl },
    { label: 'shop', href: '/shop' },
    { label: 'book', href: settings.bookUrl },
    { label: 'contact', href: '/contact' },
  ]

  return (
    <header className="flex items-center justify-between gap-6 px-[var(--gutter-inline)] pt-[var(--gutter-top)] pb-[var(--gutter-top)] lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      <Logo />
      <nav
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-8 lg:gap-x-12"
        aria-label="Primary"
      >
        {items.map((item) => (
          <GabosNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            download={item.label === 'Menu'}
            external={item.label === 'book'}
            className={`text-[19px] uppercase transition-opacity hover:opacity-70${item.label === 'shop' ? ' max-md:hidden' : ''}`}
          />
        ))}
      </nav>
      <div className="hidden lg:block" aria-hidden />
    </header>
  )
}
