'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function CartLink({ className }: { className?: string }) {
  const pathname = usePathname()
  const onCart = pathname === '/cart' || pathname.startsWith('/cart/')
  const classes = `${className ?? ''}${onCart ? ' underline' : ''}`

  return (
    <Link href="/cart" className={classes} aria-current={onCart ? 'page' : undefined}>
      cart
    </Link>
  )
}
