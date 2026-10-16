'use client'

import { useState } from 'react'
import type { ImageCrop } from '@/content/shop-looks'
import { CroppedPhoto } from './cropped-photo'

export function ProductCardPhoto({
  card,
  cardAlt,
  href,
  aspect,
}: {
  card: ImageCrop
  cardAlt?: ImageCrop
  href: string
  aspect: string
}) {
  const [showAlt, setShowAlt] = useState(false)

  if (!cardAlt) {
    return (
      <a href={href} className="block">
        <CroppedPhoto crop={card} aspect={aspect} alt={card.alt} />
      </a>
    )
  }

  return (
    <button
      type="button"
      className="group/photo relative block w-full cursor-pointer text-left"
      onClick={() => setShowAlt((current) => !current)}
      aria-label={showAlt ? cardAlt.alt : card.alt}
    >
      <div className="relative">
        <CroppedPhoto crop={card} aspect={aspect} alt={card.alt} />
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-out"
          style={{ opacity: showAlt ? 1 : 0 }}
          aria-hidden={!showAlt}
        >
          <CroppedPhoto crop={cardAlt} aspect={aspect} alt={cardAlt.alt} />
        </div>
      </div>
    </button>
  )
}
