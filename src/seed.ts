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
  const filename = image.src.replace(/^\/media\//, '')
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
    filePath: path.resolve('public/media', filename),
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
    },
  })
  console.log('Updated site settings (Echo nav, menu PDF, book URL, contact copy).')
}

const existingProducts = await payload.find({ collection: 'products', limit: 1 })
if (existingProducts.totalDocs === 0) {
  for (const product of products) {
    const imageId = await mediaId(product.image)
    const galleryIds = await Promise.all((product.gallery ?? [product.image]).map((image) => mediaId(image)))
    await payload.create({
      collection: 'products',
      data: {
        title: product.title,
        slug: product.slug,
        price: product.price,
        description: product.description,
        sizes: product.sizes as ('XS' | 'S' | 'M' | 'L' | 'XL')[],
        image: imageId,
        gallery: galleryIds,
        active: product.active,
        order: product.order,
      },
    })
  }
  console.log(`Seeded ${products.length} shop products.`)
} else {
  console.log('Products already exist — skipped product seed.')
}

console.log(`Payload ready. Admin: http://localhost:3000/admin`)
console.log(`Email: ${email}`)
console.log(`Password: ${password}`)
process.exit(0)
