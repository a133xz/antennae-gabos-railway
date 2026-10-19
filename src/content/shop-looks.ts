export type ImageCrop = {
  src: string
  alt: string
  top: string
  left: string
  width: string
  height: string
}

export type ProductFrame = ImageCrop & {
  aspect: string
}

export type ShopLook = {
  slug: string
  order: number
  color?: string
  description?: string
  card: ImageCrop
  /** Second shop-grid photo — toggled on image click (Figma Component 1 interaction). */
  cardAlt?: ImageCrop
  frames: ProductFrame[]
}

const tankDescription = [
  "Damson Madder Reversible Longline Jerry Trench in Chocolate offers two coats in one, reflecting the brand's playful, practical approach to outerwear.",
  '',
  'Designed with an oversized, longline cut, this trench pairs organic cotton with an allover check on one side and plain chocolate on the other, plus a detachable collar that doubles as a headscarf, making it a standout layer for the season.',
].join('\n')

function card(src: string, alt: string, top: string, left: string, width: string, height: string): ImageCrop {
  return { src, alt, top, left, width, height }
}

export const shopLooks: ShopLook[] = [
  {
    slug: 'f1-shorts-1',
    order: 0,
    card: card('/shop/gabos-1.png', 'Maroon F1 shorts', '8.2%', '6.39%', '87.23%', '89.03%'),
    frames: [],
  },
  {
    slug: 'f1-shorts-2',
    order: 1,
    card: card('/shop/gabos-5.png', 'Black Gabos cap', '-3.08%', '9.44%', '80.22%', '106.27%'),
    frames: [],
  },
  {
    slug: 'f1-shorts-3',
    order: 2,
    card: card('/shop/gabos-6.png', 'White F1 briefs', '21.61%', '3.6%', '92.81%', '57.13%'),
    frames: [],
  },
  {
    slug: 'f1-tank-top-black',
    order: 3,
    color: 'black',
    description: tankDescription,
    card: card('/shop/gabos-7.png', 'Black F1 tank top', '11.38%', '12.16%', '75.69%', '77.25%'),
    cardAlt: card('/shop/gabos-7-back.png', 'Black F1 tank top, back', '-21.64%', '-9.76%', '113.82%', '134.34%'),
    frames: [
      {
        src: '/shop/gabos-7.png',
        alt: 'Black F1 tank top, front',
        top: '11.38%',
        left: '7.16%',
        width: '79.99%',
        height: '77.25%',
        aspect: '910 / 1177',
      },
      {
        src: '/shop/gabos-7-back.png',
        alt: 'Black F1 tank top, back',
        top: '-21.64%',
        left: '-9.76%',
        width: '113.82%',
        height: '134.34%',
        aspect: '910 / 963',
      },
    ],
  },
]

/** Slugs shown on /shop — one row of four cards. */
export const shopCatalogSlugs = new Set(shopLooks.map((look) => look.slug))

const bySlug = new Map(shopLooks.map((look) => [look.slug, look]))

export function shopLook(slug: string) {
  return bySlug.get(slug)
}

export function shopOrder(slug: string) {
  return bySlug.get(slug)?.order ?? 100
}
