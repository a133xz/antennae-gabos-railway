'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart'

export function CartLink({ className }: { className?: string }) {
  const { count } = useCart()
  const label = count > 0 ? `cart (${count})` : 'cart'

  return (
    <Link href="/cart" className={className}>
      {label}
    </Link>
  )
}
