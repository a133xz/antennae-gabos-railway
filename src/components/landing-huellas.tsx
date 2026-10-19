'use client'

import { useEffect, useState } from 'react'

type Huella = {
  inset: { top: string; right: string; bottom: string; left: string }
  rotate: number
  src: string
}

/** Footprint order from Figma Component 1 (Default → Variant6). */
const HUELLAS: Huella[] = [
  {
    inset: { top: '0%', right: '50.19%', bottom: '87.72%', left: '34.42%' },
    rotate: 160.89,
    src: '/brand/huellas/2f781.svg',
  },
  {
    inset: { top: '18.95%', right: '16.66%', bottom: '67.56%', left: '66.63%' },
    rotate: 145.61,
    src: '/brand/huellas/a8e0a.svg',
  },
  {
    inset: { top: '45.49%', right: '84.62%', bottom: '42.24%', left: '0%' },
    rotate: 160.89,
    src: '/brand/huellas/f3698.svg',
  },
  {
    inset: { top: '43.32%', right: '34.43%', bottom: '43.19%', left: '48.86%' },
    rotate: 145.61,
    src: '/brand/huellas/a8e0a.svg',
  },
  {
    inset: { top: '78.7%', right: '50.19%', bottom: '9.03%', left: '34.42%' },
    rotate: 160.89,
    src: '/brand/huellas/f2065.svg',
  },
  {
    inset: { top: '87.72%', right: '0%', bottom: '0%', left: '84.62%' },
    rotate: 160.89,
    src: '/brand/huellas/54e23.svg',
  },
]

const STEP_MS = 420
const HOLD_MS = 2400

export function LandingHuellas() {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    let step = 0
    let timeout: ReturnType<typeof setTimeout>

    const tick = () => {
      step += 1
      if (step > HUELLAS.length) {
        setVisible(0)
        step = 0
        timeout = setTimeout(tick, HOLD_MS)
        return
      }
      setVisible(step)
      timeout = setTimeout(tick, STEP_MS)
    }

    timeout = setTimeout(tick, STEP_MS)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className="landing-huellas pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 max-md:-translate-y-[calc(15%+18vh)] md:-translate-y-[28%]"
      style={{ aspectRatio: '450.263 / 554.006' }}
      aria-hidden
    >
      {HUELLAS.map((huella, index) => (
        <div
          key={index}
          className="absolute flex items-center justify-center transition-opacity duration-300"
          style={{
            top: huella.inset.top,
            right: huella.inset.right,
            bottom: huella.inset.bottom,
            left: huella.inset.left,
            opacity: index < visible ? 1 : 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={huella.src}
            alt=""
            width={122}
            height={68}
            className="max-h-full max-w-full"
            style={{ transform: `rotate(${huella.rotate}deg)` }}
          />
        </div>
      ))}
    </div>
  )
}
