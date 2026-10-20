import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** Larger gap before this block (e.g. cart rule → actions, price → sizes). Mobile only. */
  insetTop?: 'wide' | 'none'
  /** Tighter gaps between children (e.g. footer logo + origin). Mobile only. */
  tight?: boolean
}

/**
 * Even vertical rhythm on stacked store pages (cart + PDP). Desktop layout is unchanged
 * (block flow / parent grid); spacing uses existing lg: margins on children.
 */
export function StoreVerticalStack({
  children,
  className = '',
  insetTop = 'none',
  tight = false,
}: Props) {
  const inset = insetTop === 'wide' ? 'store-vertical-stack--inset-top-wide' : ''
  const density = tight ? 'store-vertical-stack--tight' : ''
  return (
    <div className={`store-vertical-stack ${inset} ${density} ${className}`.trim()}>{children}</div>
  )
}
