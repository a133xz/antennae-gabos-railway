import Image from 'next/image'
import Link from 'next/link'
import type { SiteSettings } from '@/content/types'
import { GabosNavLink } from './gabos-nav-link'

const navLink = 'uppercase text-white transition-opacity hover:opacity-70'

export function GabosHero({ settings }: { settings: SiteSettings }) {
  const hero = settings.hero[0]

  return (
    <section className="gabos-hero relative grid min-h-[100vh] place-items-center bg-[var(--color-curtain)] text-white">
      {hero ? (
        <div className="gabos-hero-photo absolute inset-0">
          <Image src={hero.src} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="gabos-hero-stage relative grid w-[min(748px,calc(100%-32px))] min-h-[315px] place-items-center bg-[var(--color-curtain)] px-7 py-12">
        <nav
          className="gabos-hero-nav flex items-center justify-center gap-[clamp(28px,4vw,72px)]"
          aria-label="Primary"
        >
          <div className="gabos-hero-nav-group flex gap-12">
            <GabosNavLink
              href={settings.menuPdfUrl}
              label="Menu"
              download
              className={`${navLink} gabos-hero-nav-menu`}
            />
            <GabosNavLink
              href="/shop"
              label="shop"
              className={`${navLink} gabos-hero-nav-shop max-[758px]:hidden`}
            />
          </div>
          <Link href="/" className="gabos-hero-logo shrink-0" aria-label="Gabos home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/curtain/Artboard-1-1.png"
              alt=""
              width={200}
              height={200}
              className="gabos-hero-logo-original md:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/monogram.svg" alt="" width={118} height={165} className="hidden h-auto w-[118px] md:block" />
          </Link>
          <div className="gabos-hero-nav-group flex gap-12">
            <GabosNavLink
              href={settings.bookUrl}
              label="book"
              external
              className={`${navLink} gabos-hero-nav-book`}
            />
            <GabosNavLink href="/contact" label="contact" className={`${navLink} gabos-hero-nav-contact`} />
            <GabosNavLink
              href={settings.socialUrl || 'https://www.instagram.com/gabosmadrid/'}
              label="follow"
              external
              className={`${navLink} gabos-hero-nav-follow`}
            />
          </div>
        </nav>
      </div>
    </section>
  )
}
