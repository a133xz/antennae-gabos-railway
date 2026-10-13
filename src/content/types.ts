export type Picture = {
  src: string
  alt: string
}

export type Product = {
  id: number
  title: string
  slug: string
  price: number
  description: string
  sizes: string[]
  image: Picture
  gallery: Picture[]
  stripeProductId?: string
  stripePriceId?: string
  active: boolean
  order: number
}

export type SiteSettings = {
  tagline: string
  copyright: string
  socialHandle: string
  socialUrl: string
  statement: string
  contactIntro: string
  contactPhone: string
  contactPhoneHours: string
  menuPdfUrl: string
  bookUrl: string
  emails: { label: string; address: string }[]
  hero: Picture[]
  originKicker: string
  originPlace: string
  storeAddress: string
  instagramLabel: string
  editorialImage: Picture | null
  navLinks: { label: string; href: string }[]
}
