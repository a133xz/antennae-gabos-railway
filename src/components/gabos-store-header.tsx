import Link from 'next/link'
import { isShopAvailable } from '@/content/site'
import type { SiteSettings } from '@/content/types'
import { CartLink } from './cart-link'
import { StoreMobileMenu } from './store-mobile-menu'
import { StoreNav, type StoreNavItem } from './store-nav'

export function GabosStoreHeader({
  settings,
  surface = 'white',
}: {
  settings: SiteSettings
  surface?: 'white' | 'shop'
}) {
  const navItems: StoreNavItem[] = [
    { label: 'Menu', href: settings.menuPdfUrl, external: true },
    { label: 'shop', href: '/shop', activePrefix: '/shop' },
    { label: 'book', href: settings.bookUrl, external: true },
    { label: 'contact', href: '/contact' },
  ]

  const panelClassName = surface === 'shop' ? 'bg-[#f2f2f2] text-[#251f1f]' : 'bg-white text-black'
  const showCart = isShopAvailable(settings)

  return (
    <header className="pt-[var(--gutter-top)] pb-0">
      <StoreMobileMenu
        items={navItems}
        showCart={showCart}
        panelClassName={panelClassName}
        brand={
          <Link href="/" className="text-[21px] uppercase transition-opacity hover:opacity-70">
            gabos
          </Link>
        }
      />

      <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-4 md:grid">
        <Link href="/" className="text-[21px] uppercase transition-opacity hover:opacity-70">
          gabos
        </Link>
        <StoreNav items={navItems} className="justify-center md:gap-x-8 lg:gap-x-12" />
        <div className="flex items-center justify-end gap-4">
          {showCart ? (
            <CartLink className="text-[21px] uppercase transition-opacity hover:opacity-70" />
          ) : null}
        </div>
      </div>
    </header>
  )
}
