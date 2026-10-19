import { getSettings } from '@/content/site'
import { GabosStoreFooter } from './gabos-store-footer'
import { GabosStoreHeader } from './gabos-store-header'

export async function GabosStoreShell({
  children,
  surface = 'white',
  mainTop = 'shop',
}: {
  children: React.ReactNode
  surface?: 'white' | 'shop'
  /** Cart uses --cart-top on lg+; shop/PDP use --shop-after-nav. */
  mainTop?: 'shop' | 'cart'
}) {
  const settings = await getSettings()
  const page =
    surface === 'shop'
      ? 'gabos-page-shop bg-[#f2f2f2] text-[#251f1f]'
      : 'gabos-page-white bg-white text-black'

  return (
    <div
      className={`${page} flex min-h-screen flex-col px-[var(--gutter-inline)] pb-[var(--gutter-bottom)] font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[normal]`}
    >
      <GabosStoreHeader settings={settings} />
      <main
        className={
          mainTop === 'cart'
            ? 'flex flex-1 flex-col pb-[var(--shop-before-footer)] lg:pt-[var(--cart-top)]'
            : 'flex flex-1 flex-col pt-[var(--shop-after-nav)] pb-[var(--shop-before-footer)]'
        }
      >
        {children}
      </main>
      <GabosStoreFooter settings={settings} />
    </div>
  )
}
