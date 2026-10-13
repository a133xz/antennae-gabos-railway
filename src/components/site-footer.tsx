import type { SiteSettings } from '@/content/types'

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="px-5 pb-6 pt-16">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-gabos.svg" alt="Gabos" width={234} height={175} className="h-20 w-auto" />
      <div className="mt-4 grid gap-2 text-[11px] uppercase tracking-[0.06em] sm:grid-cols-3">
        <p>{settings.tagline}</p>
        <a href={settings.socialUrl} className="transition-opacity hover:opacity-60 sm:text-center" target="_blank" rel="noreferrer">
          {settings.socialHandle}
        </a>
        <p className="sm:text-right">{settings.copyright}</p>
      </div>
    </footer>
  )
}
