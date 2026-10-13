'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavItem = {
  href: string
  label: string
}

export function SiteNav({ items, className }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={className}>
      <ul className="flex items-center gap-12">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="text-[19px] transition-opacity hover:opacity-70"
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
