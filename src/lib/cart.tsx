'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type CartLine = {
  key: string
  productId: number
  slug: string
  title: string
  price: number
  imageSrc: string
  imageAlt: string
  size: string
  /** Empty until Stripe Price ID is set in Payload — cart still works for preview. */
  stripePriceId?: string
  quantity: number
}

type CartContextValue = {
  lines: CartLine[]
  count: number
  subtotal: number
  /** false until cart has been read from localStorage (avoids empty-state flash on /cart). */
  ready: boolean
  addLine: (line: Omit<CartLine, 'key' | 'quantity'>, quantity?: number) => void
  setQuantity: (key: string, quantity: number) => void
  removeLine: (key: string) => void
  clear: () => void
}

const STORAGE_KEY = 'gabos-cart-v1'

const CartContext = createContext<CartContextValue | null>(null)

function lineKey(productId: number, size: string) {
  return `${productId}:${size}`
}

function readStorage(): CartLine[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLines(readStorage())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  }, [lines, ready])

  const addLine = useCallback((line: Omit<CartLine, 'key' | 'quantity'>, quantity = 1) => {
    setLines((current) => {
      const key = lineKey(line.productId, line.size)
      const existing = current.find((item) => item.key === key)
      if (existing) {
        return current.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...current, { ...line, key, quantity }]
    })
  }, [])

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) => {
      if (quantity < 1) return current.filter((item) => item.key !== key)
      return current.map((item) => (item.key === key ? { ...item, quantity } : item))
    })
  }, [])

  const removeLine = useCallback((key: string) => {
    setLines((current) => current.filter((item) => item.key !== key))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const count = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines])
  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({ lines, count, subtotal, ready, addLine, setQuantity, removeLine, clear }),
    [lines, count, subtotal, ready, addLine, setQuantity, removeLine, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
