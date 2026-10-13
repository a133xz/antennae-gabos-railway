import Image from 'next/image'
import Link from 'next/link'
import { CurtainIntro } from '@/components/curtain-intro'
import { GabosHero } from '@/components/gabos-hero'
import { LandingFooter } from '@/components/landing-footer'
import { getSettings } from '@/content/site'

export default async function HomePage() {
  const settings = await getSettings()

  return (
    <>
      <CurtainIntro />
      <div className="home-landing min-h-screen bg-[var(--color-burgundy)] font-[family-name:var(--font-gabos)] text-[21px] font-bold uppercase leading-[1.2] text-white">
        <GabosHero settings={settings} />

        <section className="bg-[var(--color-burgundy)] px-[var(--gutter)] pb-12 pt-[clamp(96px,14vh,180px)] text-center text-white">
          <h1 className="mx-auto max-w-[28em] text-[32px]">{settings.statement}</h1>

          {settings.editorialImage ? (
            <div className="mx-auto mt-[clamp(56px,8vh,96px)] aspect-[2250/2813] w-[min(910px,100%)]">
              <Image
                src={settings.editorialImage.src}
                alt={settings.editorialImage.alt}
                width={909}
                height={1136}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="mt-[clamp(48px,7vh,80px)]">
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
        </section>
      </div>
    </>
  )
}
