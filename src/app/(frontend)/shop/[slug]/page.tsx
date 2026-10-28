import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AddToCartForm } from '@/components/add-to-cart-form'
import { GabosStoreShell } from '@/components/gabos-store-shell'
import { ShopPhoto } from '@/components/shop-photo'
import { ShopComingSoonView } from '@/components/shop-coming-soon-view'
import { getProduct, getSettings, isShopAvailable } from '@/content/site'
import { shopPdpPhotos } from '@/lib/shop-product-photos'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product' }
  return { title: product.title }
}

export default async function ProductPage({ params }: Props) {
  const settings = await getSettings()
  if (!isShopAvailable(settings)) {
    return (
      <GabosStoreShell mainTop="cart">
        <ShopComingSoonView />
      </GabosStoreShell>
    )
  }

  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const photos = shopPdpPhotos(product)

  return (
    <GabosStoreShell>
      <div className="shop-detail-layout grid items-start gap-x-5 lg:grid-cols-2">
        <div className="shop-detail-photos">
          {photos.map((photo) => (
            <ShopPhoto key={photo.src} src={photo.src} alt={photo.alt} layout="natural" />
          ))}
        </div>
        <div className="shop-detail-copy self-start lg:sticky lg:top-[var(--shop-detail-sticky-top)]">
          <h1 className="text-center text-[32px] uppercase leading-none">{product.title}</h1>
          <AddToCartForm product={product} />
        </div>
      </div>
    </GabosStoreShell>
  )
}
