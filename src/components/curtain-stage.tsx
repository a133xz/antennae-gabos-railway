'use client'

import { useLayoutEffect, useRef, useState } from 'react'

const MOBILE_BREAKPOINT = 720
const OPEN_DELAY_MS = 500
const ANIMATION_MS = 1500
const TOTAL_MS = OPEN_DELAY_MS + ANIMATION_MS

type CurtainStageProps = {
  children: React.ReactNode
}

export function CurtainStage({ children }: CurtainStageProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const mobileCurtain = root.querySelector<HTMLElement>('[data-curtain="mobile"]')
    const curtainLeft = root.querySelector<HTMLElement>('[data-curtain="left"]')
    const curtainRight = root.querySelector<HTMLElement>('[data-curtain="right"]')
    const fixedLeft = root.querySelector<HTMLElement>('[data-curtain="fixed-left"]')
    const fixedRight = root.querySelector<HTMLElement>('[data-curtain="fixed-right"]')
    const content = root.querySelector<HTMLElement>('[data-curtain-content]')

    if (!content || !fixedLeft || !fixedRight) return

    content.style.zIndex = '1'
    fixedLeft.style.pointerEvents = 'auto'
    fixedRight.style.pointerEvents = 'auto'

    const mobile = window.innerWidth <= MOBILE_BREAKPOINT

    const finish = () => {
      content.style.zIndex = '4'
      fixedLeft.style.pointerEvents = 'none'
      fixedRight.style.pointerEvents = 'none'
      if (mobileCurtain) mobileCurtain.style.display = 'none'
      if (curtainLeft) curtainLeft.style.display = 'none'
      if (curtainRight) curtainRight.style.display = 'none'
      setReady(true)
    }

    if (mobile && mobileCurtain) {
      mobileCurtain.style.display = 'block'
      mobileCurtain.style.transform = 'translateY(0)'
      const t1 = window.setTimeout(() => {
        mobileCurtain.style.transform = 'translateY(-100%)'
      }, OPEN_DELAY_MS)
      const t2 = window.setTimeout(finish, TOTAL_MS)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    }

    if (curtainLeft && curtainRight) {
      curtainLeft.style.display = 'block'
      curtainRight.style.display = 'block'
      curtainLeft.style.transform = 'translateX(0)'
      curtainRight.style.transform = 'translateX(0)'
      const t1 = window.setTimeout(() => {
        curtainLeft.style.transform = 'translateX(-100%)'
        curtainRight.style.transform = 'translateX(100%)'
      }, OPEN_DELAY_MS)
      const t2 = window.setTimeout(finish, TOTAL_MS)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
      }
    }

    finish()
  }, [])

  return (
    <div
      ref={rootRef}
      className={`curtain-root curtain-root--contact ${ready ? 'curtain-root--ready' : ''}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-curtain="mobile"
        src="/curtain/mobile_curtain.png"
        alt=""
        className="curtain-mobile"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-curtain="left" src="/curtain/slider_left.png" alt="" className="curtain-slider curtain-slider-left" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-curtain="right" src="/curtain/slider_right.png" alt="" className="curtain-slider curtain-slider-right" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-curtain="fixed-left" src="/curtain/abierto_left.png" alt="" className="curtain-fixed curtain-fixed-left" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-curtain="fixed-right" src="/curtain/abierto_right.png" alt="" className="curtain-fixed curtain-fixed-right" />

      <div data-curtain-content className="curtain-content">
        <div className="curtain-link-container">{children}</div>
      </div>
    </div>
  )
}
