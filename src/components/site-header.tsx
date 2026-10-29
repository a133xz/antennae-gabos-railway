import { isShopAvailable } from '@/content/site'
import type { SiteSettings } from '@/content/types'
import { GabosNavLink } from './gabos-nav-link'
import { Logo } from './logo'
import { StoreMobileMenu } from './store-mobile-menu'
import type { StoreNavItem } from './store-nav'

export function SiteHeader({ settings }: { settings: SiteSettings }) {
  const items: StoreNavItem[] = [
    { label: 'Menu', href: settings.menuPdfUrl, external: true },
    { label: 'shop', href: '/shop', activePrefix: '/shop' },
    { label: 'book', href: settings.bookUrl, external: true },
    { label: 'contact', href: '/contact' },
  ]

  return (
    <header className="px-[var(--gutter-inline)] pt-[var(--gutter-top)] pb-[var(--gutter-top)] md:flex md:items-center md:justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
      <StoreMobileMenu
        items={items}
        showCart={isShopAvailable(settings)}
        brand={<Logo className="justify-self-center" />}
      />
      <Logo className="hidden md:block" />
      <nav
        className="hidden flex-wrap items-center justify-center gap-x-4 gap-y-2 md:flex md:gap-x-8 lg:gap-x-12"
        aria-label="Primary"
      >
        {items.map((item) => (
          <GabosNavLink
            key={item.href}
            href={item.href}
            label={item.label}
            external={item.label === 'Menu' || item.label === 'book'}
            className="text-[19px] uppercase transition-opacity hover:opacity-70"
          />
        ))}
      </nav>
      <div className="hidden lg:block" aria-hidden />
    </header>
  )
}
