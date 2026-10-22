'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { CartLink } from './cart-link'
import { StoreNav, type StoreNavItem } from './store-nav'

function MenuIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden>
      <path d="M0 1h22M0 8h22M0 15h22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M1 1l18 18M19 1L1 19" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function StoreMobileMenu({
  items,
  brand,
  panelClassName = 'bg-white',
}: {
  items: StoreNavItem[]
  brand: ReactNode
  panelClassName?: string
}) {
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

  const bar = (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center">
      <div className="flex h-10 items-center justify-start">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-start transition-opacity hover:opacity-70"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <div className="flex min-w-0 justify-center px-2">{brand}</div>
      <div className="flex h-10 items-center justify-end">
        <CartLink className="inline-flex h-10 min-w-10 items-center justify-end text-[21px] uppercase leading-none transition-opacity hover:opacity-70" />
      </div>
    </div>
  )

  return (
    <div className="md:hidden">
      {!open ? bar : null}
      {open ? (
        <div
          className={`fixed inset-0 z-50 flex flex-col px-[var(--gutter-inline)] pt-[var(--gutter-top)] ${panelClassName}`}
        >
          {bar}
          <StoreNav
            items={items}
            className="store-mobile-menu-nav mt-12 flex-col flex-nowrap items-start gap-0 text-[21px] leading-none"
          />
        </div>
      ) : null}
    </div>
  )
}
