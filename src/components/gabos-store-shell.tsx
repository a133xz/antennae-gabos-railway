import { getSettings } from '@/content/site'
import { LandingFooter } from './landing-footer'
import { GabosStoreHeader } from './gabos-store-header'

export async function GabosStoreShell({
  children,
  surface = 'white',
  mainTop = 'shop',
}: {
  children: React.ReactNode
  surface?: 'white' | 'shop'
  /** Cart uses --cart-top; shop/PDP use --shop-after-nav; placeholder = coming soon / empty cart center. */
  mainTop?: 'shop' | 'cart' | 'placeholder'
}) {
  const settings = await getSettings()
  const page =
    surface === 'shop'
      ? 'gabos-page-shop bg-[#f2f2f2] text-[#251f1f]'
      : 'gabos-page-white bg-white text-black'

  const pageLayout =
    surface === 'shop'
      ? 'flex flex-col'
      : 'flex min-h-screen flex-col'

  return (
    <div
      className={`${page} ${pageLayout} px-[var(--gutter-inline)] pb-[var(--gutter-bottom)] font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[normal]`}
    >
      <GabosStoreHeader settings={settings} surface={surface} />
      <main
        className={
          mainTop === 'placeholder'
            ? 'flex flex-1 flex-col pt-0 pb-0'
            : mainTop === 'cart'
              ? 'flex flex-1 flex-col pt-[var(--cart-top)] pb-[var(--shop-before-footer)]'
              : 'flex flex-1 flex-col pt-[var(--shop-after-nav)] pb-[var(--shop-before-footer)]'
        }
      >
        {children}
      </main>
      <LandingFooter settings={settings} logo="black" />
    </div>
  )
}
