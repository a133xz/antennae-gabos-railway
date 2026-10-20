/** Product imagery as uploaded — no in-code crops; aspect box matches shop layout. */
export function ShopPhoto({
  src,
  alt,
  aspect = '445 / 545',
  className = '',
}: {
  src: string
  alt: string
  aspect?: string
  className?: string
}) {
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
