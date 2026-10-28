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
  copyright: string
  socialHandle: string
  socialUrl: string
  statement: string
  contactIntro: string
  contactPhone: string
  contactPhoneHours: string
  menuPdfUrl: string
  bookUrl: string
  /** When true, the home header shows the Christmas menu link. */
  christmasMenu: boolean
  christmasMenuUrl: string
  emails: { label: string; address: string }[]
  originKicker: string
  originPlace: string
  storeAddress: string
  instagramLabel: string
  editorialImage: Picture | null
  /** When true, shop and cart are live; when false, both show “coming soon” and the cart link is hidden. */
  shopAvailable: boolean
}
