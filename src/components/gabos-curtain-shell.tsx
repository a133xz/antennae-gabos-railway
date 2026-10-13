'use client'

import { useLayoutEffect, useRef } from 'react'
import { runGabosCurtainAnimation } from '@/lib/gabos-curtain'

export function GabosCurtainShell({
  scrollable = false,
  children,
}: {
  /** Long home landing — side curtains stay fixed while content scrolls. */
  scrollable?: boolean
  children: React.ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    return runGabosCurtainAnimation(root, { scrollable })
  }, [scrollable])

  return (
    <div
      ref={rootRef}
      className={`wrapper ${scrollable ? 'wrapper--scroll' : ''}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/mobile_curtain.png" alt="" className="mobileCurtain" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/slider_left.png" alt="" className="curtainLeft" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/slider_right.png" alt="" className="curtainRight" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/abierto_left.png" alt="" className="fixedCurtain fixedCurtainLeft" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/abierto_right.png" alt="" className="fixedCurtain fixedCurtainRight" />

      <div className="navWrapper">
        <div className={`linkContainer ${scrollable ? 'linkContainer--landing' : ''}`}>{children}</div>
      </div>
    </div>
  )
}
