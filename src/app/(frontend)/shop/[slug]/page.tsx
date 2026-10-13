import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AddToCartForm } from '@/components/add-to-cart-form'
import { GabosStoreShell } from '@/components/gabos-store-shell'
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

  const shots = product.gallery.length ? product.gallery : [product.image]

  return (
    <GabosStoreShell>
      <div className="grid gap-10 px-[var(--gutter)] pb-16 pt-2 lg:grid-cols-2 lg:gap-5">
        <div className="space-y-5">
          {shots.map((shot, index) => (
            <div key={`${shot.src}-${index}`} className="relative aspect-[910/1177] w-full bg-[#f5f5f5]">
              <Image src={shot.src} alt={shot.alt} fill className="object-cover" sizes="50vw" priority={index === 0} />
            </div>
          ))}
        </div>
        <div className="lg:pt-[284px]">
          <h1 className="text-center text-[32px] uppercase">{product.title}</h1>
          <AddToCartForm product={product} />
        </div>
      </div>
    </GabosStoreShell>
  )
}
