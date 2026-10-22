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

/** One vertical screen — matches mobile browser chrome better than raw innerHeight. */
function getViewportHeight() {
  return window.visualViewport?.height ?? document.documentElement.clientHeight ?? window.innerHeight ?? 1
}

function scrollFadeProgress(section: HTMLElement, scrollY: number) {
  const mobile = window.matchMedia('(max-width: 767px)').matches

  if (mobile) {
    const vh = getViewportHeight()
    const top = section.getBoundingClientRect().top
    // Fade over one vh as the landing block moves up through the viewport (not document scrollY).
    if (top >= vh) return 0
    return Math.min(1, Math.max(0, (vh - top) / vh))
  }

  // Desktop — unchanged: first viewport of scroll stays red, then one vh fade to black.
  const vh = window.innerHeight || 1
  if (scrollY <= vh) return 0
  return Math.min(1, Math.max(0, (scrollY - vh) / vh))
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

    const home = section.parentElement

    const update = () => {
      frame = 0
      const progress = scrollFadeProgress(section, window.scrollY)
      const bg = mixToBlack(curtain, progress)
      section.style.backgroundColor = bg

      const mobile = window.matchMedia('(max-width: 767px)').matches
      if (mobile && home?.classList.contains('gabos-home')) {
        home.style.backgroundColor = progress > 0 ? bg : ''
      }
      document.body.style.backgroundColor = progress >= 1 ? '#000' : ''
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    const onViewportChange = () => {
      if (!window.matchMedia('(max-width: 767px)').matches) return
      onScroll()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('resize', onViewportChange)
    window.visualViewport?.addEventListener('scroll', onViewportChange)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onViewportChange)
      window.visualViewport?.removeEventListener('scroll', onViewportChange)
      document.body.style.backgroundColor = ''
      if (home?.classList.contains('gabos-home')) home.style.backgroundColor = ''
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
