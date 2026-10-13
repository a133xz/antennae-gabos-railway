import type { ImageCrop } from '@/content/shop-looks'

export function CroppedPhoto({
  crop,
  aspect,
  alt,
}: {
  crop: ImageCrop
  aspect: string
  alt: string
}) {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={crop.src}
        alt={alt}
        className="absolute max-w-none"
        style={{ top: crop.top, left: crop.left, width: crop.width, height: crop.height }}
      />
    </div>
  )
}
