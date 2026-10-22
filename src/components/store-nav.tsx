'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type StoreNavItem = {
  href: string
  label: string
  external?: boolean
  download?: boolean
  activePrefix?: string
}

export function StoreNav({ items, className = '' }: { items: StoreNavItem[]; className?: string }) {
  const pathname = usePathname()

  return (
    <nav
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`.trim()}
      aria-label="Primary"
    >
      {items.map((item) => {
        const active = item.activePrefix
          ? pathname === item.activePrefix || pathname.startsWith(`${item.activePrefix}/`)
          : false
        const className = `text-[21px] uppercase transition-opacity hover:opacity-70${active ? ' underline' : ''}`
        if (item.external || item.download || item.href.startsWith('http')) {
          return (
            <a
              key={item.label}
              href={item.href}
              className={className}
              {...(item.download ? { download: true } : {})}
              {...(item.external || item.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {item.label}
            </a>
          )
        }
        return (
          <Link key={item.label} href={item.href} className={className}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
