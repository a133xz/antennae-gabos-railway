import Link from 'next/link'
import { GabosCurtainShell } from '@/components/gabos-curtain-shell'
import { GabosHero } from '@/components/gabos-hero'
import { LandingFooter } from '@/components/landing-footer'
import { LandingPanel } from '@/components/landing-panel'
import { getSettings } from '@/content/site'

export default async function HomePage() {
  const settings = await getSettings()
  const editorial = settings.editorialImage ?? {
    src: '/media/editorial.jpg',
    alt: 'Hands around a cocktail glass',
  }

  return (
    <GabosCurtainShell scrollable>
      <div className="gabos-home min-h-screen bg-[var(--color-burgundy)] font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[1.2] text-white">
        <GabosHero settings={settings} />

        <LandingPanel>
          <h1 className="mx-auto max-w-[910px] text-[32px] leading-[normal]">{settings.statement}</h1>

          <div className="mx-auto mt-[clamp(96px,10vw,180px)] aspect-[2250/2813] w-full max-w-[910px] lg:w-[47.4%]">
            <video
              src="/media/video.mp4"
              poster={editorial.src}
              autoPlay
              muted
              loop
              playsInline
              aria-label={editorial.alt}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-[clamp(72px,8vw,120px)]">
            {settings.socialUrl ? (
              <Link href={settings.socialUrl} className="grid transition-opacity hover:opacity-70" target="_blank" rel="noreferrer">
                <span>{settings.instagramLabel}</span>
                <span>{settings.socialHandle}</span>
              </Link>
            ) : (
              <p className="grid">
                <span>{settings.instagramLabel}</span>
                <span>{settings.socialHandle}</span>
              </p>
            )}
          </div>

          <LandingFooter settings={settings} />
        </LandingPanel>
      </div>
    </GabosCurtainShell>
  )
}
