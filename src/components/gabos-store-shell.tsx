import { getSettings } from '@/content/site'
import { GabosStoreFooter } from './gabos-store-footer'
import { GabosStoreHeader } from './gabos-store-header'

export async function GabosStoreShell({
  children,
  surface = 'white',
}: {
  children: React.ReactNode
  surface?: 'white' | 'shop'
}) {
  const settings = await getSettings()
  const page =
    surface === 'shop'
      ? 'gabos-page-shop bg-[#f2f2f2] text-[#251f1f]'
      : 'gabos-page-white bg-white text-black'

  return (
    <div
      className={`${page} flex min-h-screen flex-col font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[normal]`}
    >
      <GabosStoreHeader settings={settings} />
      <main className="flex flex-1 flex-col">{children}</main>
      <GabosStoreFooter settings={settings} />
    </div>
  )
}
