import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Product as PayloadProduct, SiteSetting } from '@/payload-types'
import {
  getStaticProduct,
  getStaticProducts,
  getStaticSettings,
  useStaticContent,
} from './static-content'
import type { Picture, Product, SiteSettings } from './types'

async function cms() {
  return getPayload({ config })
}

function picture(value: number | Media | null | undefined): Picture | null {
  if (!value || typeof value === 'number' || !value.url) return null
  return { src: value.url, alt: value.alt || '' }
}

function pictures(values: (number | Media)[] | null | undefined) {
  return (values ?? []).map(picture).filter((item): item is Picture => item !== null)
}

function toProduct(doc: PayloadProduct): Product {
  const gallery = pictures(doc.gallery)
  const image = picture(doc.image) ?? gallery[0] ?? { src: '', alt: doc.title }
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    price: doc.price ?? 0,
    description: doc.description || '',
    sizes: (doc.sizes ?? []) as string[],
    image,
    gallery: gallery.length ? gallery : image.src ? [image] : [],
    stripeProductId: doc.stripeProductId || undefined,
    stripePriceId: doc.stripePriceId || undefined,
    active: Boolean(doc.active),
    order: doc.order ?? 0,
  }
}

function toSettings(doc: SiteSetting): SiteSettings {
  return {
    tagline: doc.tagline || '',
    copyright: doc.copyright || '',
    socialHandle: doc.socialHandle || '',
    socialUrl: doc.socialUrl || '',
    statement: doc.statement || '',
    contactIntro: doc.contactIntro || '',
    contactPhone: doc.contactPhone || '',
    contactPhoneHours: doc.contactPhoneHours || '',
    menuPdfUrl: doc.menuPdfUrl || '',
    bookUrl: doc.bookUrl || '',
    emails: (doc.emails ?? [])
      .filter((email) => email.label && email.address)
      .map((email) => ({ label: email.label as string, address: email.address as string })),
    hero: pictures(doc.hero),
    originKicker: doc.originKicker || 'From',
    originPlace: doc.originPlace || '',
    storeAddress: doc.storeAddress || '',
    instagramLabel: doc.instagramLabel || 'Follow us on Instagram',
    editorialImage: picture(doc.editorialImage),
    navLinks: (doc.navLinks ?? [])
      .filter((link) => link.label && link.href)
      .map((link) => ({ label: link.label as string, href: link.href as string })),
    /** Undefined = legacy sites stay live until “Shop available” is set in admin. */
    shopAvailable: doc.shopAvailable ?? true,
  }
}

export function isShopAvailable(settings: SiteSettings) {
  return settings.shopAvailable
}

export const getSettings = cache(async () => {
  if (useStaticContent()) return getStaticSettings()
  const payload = await cms()
  const doc = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
  return toSettings(doc)
})

export const getProducts = cache(async () => {
  if (useStaticContent()) return getStaticProducts()
  const payload = await cms()
  const result = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return result.docs.map((doc) => toProduct(doc))
})

export const getProduct = cache(async (slug: string) => {
  if (useStaticContent()) return getStaticProduct(slug)
  const payload = await cms()
  const result = await payload.find({
    collection: 'products',
    where: { and: [{ slug: { equals: slug } }, { active: { equals: true } }] },
    limit: 1,
    depth: 1,
  })
  const doc = result.docs[0]
  return doc ? toProduct(doc) : null
})
