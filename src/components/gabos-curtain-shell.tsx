'use client'

import { useLayoutEffect, useRef } from 'react'
import { runGabosCurtainAnimation } from '@/lib/gabos-curtain'
import { bindVisualViewportCurtainVars } from '@/lib/sync-visual-viewport'

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
    document.body.classList.add('gabos-curtain-view')
    if (!scrollable) {
      document.documentElement.classList.add('gabos-curtain-locked')
      document.body.classList.add('gabos-curtain-locked')
    }
    return () => {
      document.body.classList.remove('gabos-curtain-view', 'gabos-curtain-locked')
      document.documentElement.classList.remove('gabos-curtain-locked')
    }
  }, [scrollable])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    return runGabosCurtainAnimation(root, { scrollable })
  }, [scrollable])

  useLayoutEffect(() => bindVisualViewportCurtainVars(), [])

  return (
    <div
      ref={rootRef}
      className={`wrapper ${scrollable ? 'wrapper--scroll' : 'page-contact'}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/mobile_curtain.png" alt="" className="mobileCurtain curtain-viewport-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/slider_left.png" alt="" className="curtainLeft curtain-viewport-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/curtain/slider_right.png" alt="" className="curtainRight curtain-viewport-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/curtain/abierto_left.png"
        alt=""
        className="fixedCurtain fixedCurtainLeft curtain-viewport-cover"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/curtain/abierto_right.png"
        alt=""
        className="fixedCurtain fixedCurtainRight curtain-viewport-cover"
      />

      <div className="navWrapper">
        <div className={`linkContainer ${scrollable ? 'linkContainer--landing' : ''}`}>{children}</div>
      </div>
    </div>
  )
}
