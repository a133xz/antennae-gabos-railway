import Link from 'next/link'
import type { SiteSettings } from '@/content/types'
import { GabosNavLink } from './gabos-nav-link'

const navLink = 'uppercase text-white transition-opacity hover:opacity-70'

function Flourish({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`h-[21px] w-[82px] ${className}`}
      viewBox="0 0 82 21"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 11.5c6 0 8-7 16-7s10 12 18 12 8-10 16-10 8 6 14 6c4 0 8-1.5 14-1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M68 6.5c2.2-3 5.2-4.2 8.5-3.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function GabosHero({ settings }: { settings: SiteSettings }) {
  const christmasHref = settings.christmasMenuUrl.trim()

  return (
    <section
      className={`gabos-hero relative grid min-h-[100vh] place-items-start justify-items-center text-white ${
        settings.christmasMenu ? 'pt-24 md:pt-20' : 'pt-[clamp(40px,9vh,72px)] md:pt-0'
      } md:place-items-center`}
    >
      {settings.christmasMenu ? (
        christmasHref ? (
          <a
            href={christmasHref}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="gabos-christmas-menu absolute left-1/2 top-[clamp(18px,4vh,40px)] z-10 flex -translate-x-1/2 items-center gap-4 text-[21px] uppercase leading-none transition-opacity hover:opacity-70"
          >
            <Flourish />
            nye menu
            <Flourish className="-scale-x-100" />
          </a>
        ) : (
          <p className="gabos-christmas-menu absolute left-1/2 top-[clamp(18px,4vh,40px)] z-10 flex -translate-x-1/2 items-center gap-4 text-[21px] uppercase leading-none">
            <Flourish />
            nye menu
            <Flourish className="-scale-x-100" />
          </p>
        )
      ) : null}
      <div className="gabos-hero-stage relative grid w-[min(748px,calc(100%-32px))] min-h-[315px] place-items-center px-7 pb-12 pt-0 md:py-12">
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
            <GabosNavLink href="/shop" label="shop" className={`${navLink} gabos-hero-nav-shop`} />
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
