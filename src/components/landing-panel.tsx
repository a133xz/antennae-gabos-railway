'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { LandingHuellas } from './landing-huellas'

function curtainRgb(curtain: string): [number, number, number] {
  const hex = curtain.trim().replace('#', '')
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ]
}

function mixToBlack(curtain: [number, number, number], amount: number) {
  const t = Math.min(1, Math.max(0, amount))
  const r = Math.round(curtain[0] * (1 - t))
  const g = Math.round(curtain[1] * (1 - t))
  const b = Math.round(curtain[2] * (1 - t))
  return `rgb(${r}, ${g}, ${b})`
}

export function LandingPanel({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return

    const curtain = curtainRgb(
      getComputedStyle(document.documentElement).getPropertyValue('--color-curtain') || '#6e0001',
    )
    let frame = 0

    const update = () => {
      frame = 0
      const vh = window.innerHeight || 1
      const scrollY = window.scrollY
      // First screen stays curtain red; after one viewport of scroll, ease into black.
      const progress =
        scrollY <= vh ? 0 : Math.min(1, Math.max(0, (scrollY - vh) / vh))
      const bg = mixToBlack(curtain, progress)
      section.style.backgroundColor = bg
      document.body.style.backgroundColor = progress >= 1 ? '#000' : ''
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
      document.body.style.backgroundColor = ''
    }
  }, [])

  return (
    <section ref={ref} className="landing-panel relative text-center text-white">
      <LandingHuellas />
      <div className="landing-panel-inner px-[var(--gutter-inline)] pb-[var(--gutter-bottom)]">
        {children}
      </div>
    </section>
  )
}
