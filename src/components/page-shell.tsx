import { getSettings } from '@/content/site'
import { LandingFooter } from './landing-footer'
import { SiteHeader } from './site-header'

export async function PageShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div className="gabos-page-white min-h-screen bg-white font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[1.2] text-black">
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <div className="px-[var(--gutter-inline)] pb-[var(--gutter-bottom)]">
        <LandingFooter settings={settings} />
      </div>
    </div>
  )
}
