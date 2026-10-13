import { getSettings } from '@/content/site'
import { GabosStoreFooter } from './gabos-store-footer'
import { GabosStoreHeader } from './gabos-store-header'

export async function GabosStoreShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div className="gabos-page-white flex min-h-screen flex-col bg-white font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[1.2] text-black">
      <GabosStoreHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <GabosStoreFooter settings={settings} />
    </div>
  )
}
