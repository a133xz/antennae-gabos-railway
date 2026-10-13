'use client'

import { useEffect, useRef } from 'react'

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
      const span = Math.max(section.offsetHeight * 0.55, 1)
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
    <section ref={ref} className="relative bg-[#650f0a] text-center text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/table-skirt.svg"
        alt=""
        width={578}
        height={379}
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-auto w-[min(578px,72vw)] -translate-x-1/2 -translate-y-[38%]"
      />
      <div className="px-[var(--gutter)] pb-[var(--gutter-bottom)] pt-[clamp(188px,22vw,340px)]">
        {children}
      </div>
    </section>
  )
}
