import type { Product, SiteSettings } from './types'

/** Initial records loaded into Payload by `npm run seed`. Edit the live site in /admin. */

export const MENU_PDF_URL = 'https://gabosny.com/wp-content/uploads/2026/07/Menu_Web_July2026.pdf'
export const BOOK_URL =
  'https://www.covermanager.com/reservation/module_restaurant/restaurante-gabos-ne-york/spanish'

export const settings: SiteSettings = {
  tagline: 'New York-inspired supper club & cocktail bar',
  copyright: '© Gabos 2026',
  socialHandle: '@gabosmadrid',
  socialUrl: 'https://www.instagram.com/gabosmadrid/',
  statement:
    "Gabo's is a New York-inspired supper club and cocktail bar in Madrid offering late-night dining, vinyl music, and classic American bites",
  contactIntro: [
    'Opening hours:',
    'Tuesday – Wednesday 19.30 a 02.00',
    'Thursday – Saturday 13.00 a 02.00',
    '',
  ].join('\n'),
  contactPhone: '91 639 1343',
  contactPhoneHours: 'Tue-Sat 17.00-22.00',
  menuPdfUrl: MENU_PDF_URL,
  bookUrl: BOOK_URL,
  emails: [
    { label: 'RESERVAS', address: 'reservas@gabosnewyork.com' },
    { label: 'ADMINISTRACION Y PR', address: 'sala@gabosnewyork.com' },
  ],
  hero: [{ src: '/media/hero-curtain.png', alt: 'Velvet curtain at the entrance' }],
  originKicker: 'From',
  originPlace: 'New York',
  storeAddress: 'Calle Prim 5, Madrid, Spain 28004',
  instagramLabel: 'Follow us on Instagram',
  editorialImage: { src: '/media/editorial.jpg', alt: 'Close-up of a cocktail glass' },
  navLinks: [
    { label: 'Menu', href: MENU_PDF_URL },
    { label: 'shop', href: '/shop' },
    { label: 'book', href: BOOK_URL },
    { label: 'contact', href: '/contact' },
  ],
}

type SeedProduct = Omit<Product, 'id' | 'stripeProductId' | 'stripePriceId'> & {
  image: { src: string; alt: string }
  gallery?: { src: string; alt: string }[]
}

const productImage = { src: '/media/editorial.jpg', alt: 'Gabos apparel still life' }

export const products: SeedProduct[] = [
  {
    title: 'f1 shorts',
    slug: 'f1-shorts-1',
    price: 40,
    description:
      'Lightweight race-day shorts with an easy fit. Pair with the F1 tank for a full grid look.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: productImage,
    gallery: [productImage],
    active: true,
    order: 0,
  },
  {
    title: 'f1 shorts',
    slug: 'f1-shorts-2',
    price: 40,
    description: 'Lightweight race-day shorts with an easy fit.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: productImage,
    gallery: [productImage],
    active: true,
    order: 1,
  },
  {
    title: 'f1 shorts',
    slug: 'f1-shorts-3',
    price: 40,
    description: 'Lightweight race-day shorts with an easy fit.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: productImage,
    gallery: [productImage],
    active: true,
    order: 2,
  },
  {
    title: 'f1 tank top',
    slug: 'f1-tank-top-black',
    price: 40,
    description: [
      "Damson Madder Reversible Longline Jerry Trench in Chocolate offers two coats in one, reflecting the brand's playful, practical approach to outerwear.",
    ].join('\n'),
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    image: productImage,
    gallery: [productImage],
    active: true,
    order: 3,
  },
]
