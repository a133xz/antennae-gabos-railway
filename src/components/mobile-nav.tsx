'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { NavItem } from './site-nav'

export function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="text-[19px] uppercase"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        Menu
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white px-5 py-5 text-black">
          <div className="flex justify-end">
            <button
              type="button"
              className="text-[19px] uppercase"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="mt-16" aria-label="Mobile">
            <ul className="flex flex-col gap-5">
              {items.map((item) => {
                const external = item.href.startsWith('http')
                const className = 'text-4xl uppercase leading-none'
                if (external) {
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={className}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...(item.label === 'Menu' ? { download: true } : {})}
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                }
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? 'page' : undefined}
                      className={className}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  )
}
