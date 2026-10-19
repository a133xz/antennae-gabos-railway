'use client'

import { useEffect, useRef } from 'react'
import { LandingHuellas } from './landing-huellas'

const BURGUNDY = [0x65, 0x0f, 0x0a] as const

function mixToBlack(amount: number) {
  const t = Math.min(1, Math.max(0, amount))
  const r = Math.round(BURGUNDY[0] * (1 - t))
  const g = Math.round(BURGUNDY[1] * (1 - t))
  const b = Math.round(BURGUNDY[2] * (1 - t))
  return `rgb(${r}, ${g}, ${b})`
}

export function LandingPanel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const traveled = -rect.top
      // Finish the fade within ~40vh of entering the panel (not half the full section height).
      const span = Math.max(window.innerHeight * 0.3, 1)
      section.style.backgroundColor = mixToBlack(traveled / span)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={ref} className="landing-panel relative bg-[#650f0a] text-center text-white">
      <LandingHuellas />
      <div className="landing-panel-inner px-[var(--gutter-inline)] pb-[var(--gutter-bottom)] pt-[clamp(120px,16vw,280px)]">
        {children}
      </div>
    </section>
  )
}
