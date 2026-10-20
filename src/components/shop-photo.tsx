/** Product imagery — pre-cropped PNGs or CMS uploads; card layout uses fixed shop grid aspect. */
export function ShopPhoto({
  src,
  alt,
  layout = 'card',
  aspect = '445 / 545',
  className = '',
}: {
  src: string
  alt: string
  /** `card` = shop grid/cart frame; `natural` = PDP (cropped file keeps its own proportions). */
  layout?: 'card' | 'natural'
  aspect?: string
  className?: string
}) {
  if (layout === 'natural') {
    return (
      <div className={`relative w-full ${className}`.trim()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="block h-auto w-full" />
      </div>
    )
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`.trim()}
      style={{ aspectRatio: aspect }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-contain" />
    </div>
  )
}
