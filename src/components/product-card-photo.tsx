import type { ImageCrop } from '@/content/shop-looks'
import { CroppedPhoto } from './cropped-photo'

export function ProductCardPhoto({
  card,
  cardAlt,
  aspect,
}: {
  card: ImageCrop
  cardAlt?: ImageCrop
  aspect: string
}) {
  if (!cardAlt) {
    return <CroppedPhoto crop={card} aspect={aspect} alt={card.alt} />
  }

  return (
    <div className="relative">
      <CroppedPhoto crop={card} aspect={aspect} alt={card.alt} />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover/card:opacity-100"
        aria-hidden
      >
        <CroppedPhoto crop={cardAlt} aspect={aspect} alt={cardAlt.alt} />
      </div>
    </div>
  )
}
