import { getPayload } from 'payload'
import path from 'path'
import config from '@payload-config'
import { products, settings } from './content/records'
import type { Picture } from './content/types'

const email = process.env.SEED_EMAIL || 'editor@gabos.test'
const password = process.env.SEED_PASSWORD || 'gabos-local'

const payload = await getPayload({ config })

const users = await payload.find({ collection: 'users', limit: 1 })
if (users.totalDocs === 0) {
  await payload.create({
    collection: 'users',
    data: { email, password },
  })
  console.log(`Admin user created: ${email}`)
}

const uploaded = new Map<string, number>()

async function mediaId(image: Picture) {
  const cached = uploaded.get(image.src)
  if (cached) return cached
  const filename = path.basename(image.src)
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })
  if (existing.docs[0]) {
    uploaded.set(image.src, existing.docs[0].id)
    return existing.docs[0].id
  }
  const created = await payload.create({
    collection: 'media',
    data: { alt: image.alt || filename },
    filePath: path.resolve('public', image.src.replace(/^\//, '')),
  })
  uploaded.set(image.src, created.id)
  return created.id
}

const existingMedia = await payload.find({ collection: 'media', limit: 1 })
if (existingMedia.totalDocs === 0) {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      statement: settings.statement,
      contactIntro: settings.contactIntro,
      emails: settings.emails,
      tagline: settings.tagline,
      copyright: settings.copyright,
      socialHandle: settings.socialHandle,
      socialUrl: settings.socialUrl,
      hero: await Promise.all(settings.hero.map((image) => mediaId(image))),
    originKicker: settings.originKicker,
    originPlace: settings.originPlace,
    storeAddress: settings.storeAddress,
    instagramLabel: settings.instagramLabel,
    editorialImage: settings.editorialImage ? await mediaId(settings.editorialImage) : undefined,
    navLinks: settings.navLinks,
    contactPhone: settings.contactPhone,
    contactPhoneHours: settings.contactPhoneHours,
    menuPdfUrl: settings.menuPdfUrl,
    bookUrl: settings.bookUrl,
  },
})
  console.log('Seeded site settings and media.')
} else {
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      statement: settings.statement,
      contactIntro: settings.contactIntro,
      contactPhone: settings.contactPhone,
      contactPhoneHours: settings.contactPhoneHours,
      emails: settings.emails,
      tagline: settings.tagline,
      copyright: settings.copyright,
      socialHandle: settings.socialHandle,
      socialUrl: settings.socialUrl,
      menuPdfUrl: settings.menuPdfUrl,
      bookUrl: settings.bookUrl,
      navLinks: settings.navLinks,
      originKicker: settings.originKicker,
      originPlace: settings.originPlace,
      storeAddress: settings.storeAddress,
      instagramLabel: settings.instagramLabel,
    },
  })
  console.log('Updated site settings (Echo nav, menu PDF, book URL, contact copy).')
}

async function productPayload(product: (typeof products)[number]) {
  const imageId = await mediaId(product.image)
  const galleryIds = await Promise.all(
    (product.gallery ?? [product.image]).map((image) => mediaId(image)),
  )
  return {
    title: product.title,
    slug: product.slug,
    price: product.price,
    description: product.description,
    sizes: product.sizes as ('XS' | 'S' | 'M' | 'L' | 'XL')[],
    image: imageId,
    gallery: galleryIds,
    active: product.active,
    order: product.order,
  }
}

const existingProducts = await payload.find({ collection: 'products', limit: 1 })
if (existingProducts.totalDocs === 0) {
  for (const product of products) {
    await payload.create({
      collection: 'products',
      data: await productPayload(product),
    })
  }
  console.log(`Seeded ${products.length} shop products.`)
} else {
  const seedBySlug = new Map(products.map((product) => [product.slug, product]))
  const seedSlugs = new Set(seedBySlug.keys())
  const allProducts = await payload.find({ collection: 'products', limit: 100 })
  const syncProductImages = process.env.SEED_SYNC_PRODUCT_IMAGES === 'true'
  let deactivated = 0
  let mediaSynced = 0
  for (const doc of allProducts.docs) {
    const seed = seedBySlug.get(doc.slug)
    const active = seedSlugs.has(doc.slug)
    const data: Record<string, unknown> = {}
    if (doc.active !== active) data.active = active
    if (seed && syncProductImages) {
      const payloadData = await productPayload(seed)
      data.image = payloadData.image
      data.gallery = payloadData.gallery
      data.order = payloadData.order
      mediaSynced += 1
    }
    if (Object.keys(data).length > 0) {
      await payload.update({
        collection: 'products',
        id: doc.id,
        data,
      })
      if (!active) deactivated += 1
    }
  }
  console.log(
    deactivated > 0
      ? `Synced shop catalog: deactivated ${deactivated} product(s) not in seed.`
      : 'Products already exist — catalog active flags match seed.',
  )
  if (syncProductImages) {
    console.log(`Synced images from records.ts for ${mediaSynced} seed product(s).`)
  }
}

console.log(`Payload ready. Admin: http://localhost:3000/admin`)
console.log(`Email: ${email}`)
console.log(`Password: ${password}`)
process.exit(0)
