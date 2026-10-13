import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings } from '@/content/types'
import { GabosNavLink } from './gabos-nav-link'

export function GabosHero({ settings }: { settings: SiteSettings }) {
  const hero = settings.hero[0]

  return (
    <section className="relative grid min-h-svh place-items-center bg-[#650f0a] text-white">
      {hero ? (
        <div className="absolute inset-0">
          <Image src={hero.src} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="relative grid w-[min(748px,calc(100%-32px))] min-h-[315px] place-items-center bg-[#650f0a] px-7 py-12 max-[1350px]:w-full max-[1350px]:min-h-0 max-[1350px]:bg-transparent max-[1350px]:px-0 max-[1350px]:py-0">
        <nav
          className="flex w-full flex-col items-center max-[1350px]:py-[6vh] min-[1351px]:flex-row min-[1351px]:items-center min-[1351px]:justify-center min-[1351px]:gap-[clamp(28px,4vw,72px)]"
          aria-label="Primary"
        >
          <div className="flex flex-col items-center max-[1350px]:contents min-[1351px]:flex-row min-[1351px]:gap-12">
            <GabosNavLink
              href={settings.menuPdfUrl}
              label="Menu"
              download
              className="gabos-hero-nav-link max-[1350px]:order-3"
            />
            <GabosNavLink href="/shop" label="shop" className="gabos-hero-nav-link max-[1350px]:order-4" />
          </div>
          <Link
            href="/"
            className="max-[1350px]:order-1 max-[1350px]:mb-[2vh] min-[1351px]:shrink-0"
            aria-label="Gabos home"
          >
            {/* eslint-disable-next-line @next/next-no-img-element */}
            <img
              src="/brand/monogram.svg"
              alt=""
              width={118}
              height={165}
              className="block h-auto w-[118px] max-[1350px]:translate-x-[4%]"
            />
          </Link>
          <div className="flex flex-col items-center max-[1350px]:contents min-[1351px]:flex-row min-[1351px]:gap-12">
            <GabosNavLink
              href={settings.bookUrl}
              label="book"
              external
              className="gabos-hero-nav-link max-[1350px]:order-2"
            />
            <GabosNavLink href="/contact" label="contact" className="gabos-hero-nav-link max-[1350px]:order-5" />
          </div>
        </nav>
      </div>
    </section>
  )
}
