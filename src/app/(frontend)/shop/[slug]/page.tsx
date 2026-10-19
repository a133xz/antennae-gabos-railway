import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AddToCartForm } from '@/components/add-to-cart-form'
import { CroppedPhoto } from '@/components/cropped-photo'
import { GabosStoreShell } from '@/components/gabos-store-shell'
import { shopLook } from '@/content/shop-looks'
import { getProduct } from '@/content/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product' }
  return { title: product.title }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const look = shopLook(product.slug)
  const frames =
    look && look.frames.length
      ? look.frames
      : [
          {
            ...(look?.card ?? {
              src: product.image.src,
              alt: product.image.alt,
              top: '0%',
              left: '0%',
              width: '100%',
              height: '100%',
            }),
            aspect: '445 / 545',
          },
        ]

  return (
    <GabosStoreShell>
      <div className="shop-detail-layout grid items-start gap-x-5 lg:grid-cols-2">
        <div className="shop-detail-photos">
          {frames.map((frame) => (
            <CroppedPhoto key={frame.src} crop={frame} aspect={frame.aspect} alt={frame.alt} />
          ))}
        </div>
        <div className="shop-detail-copy self-start lg:sticky lg:top-[var(--shop-detail-sticky-top)]">
          <h1 className="text-center text-[32px] uppercase leading-none">{product.title}</h1>
          <AddToCartForm product={product} description={look?.description} />
        </div>
      </div>
    </GabosStoreShell>
  )
}
