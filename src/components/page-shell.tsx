import { getSettings } from '@/content/site'
import { SiteFooter } from './site-footer'
import { SiteHeader } from './site-header'

export async function PageShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div className="gabos-page-white min-h-screen bg-white font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[1.2] text-black">
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </div>
  )
}
