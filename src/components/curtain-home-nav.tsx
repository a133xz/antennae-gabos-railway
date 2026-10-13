import Link from 'next/link'
import type { SiteSettings } from '@/content/types'

export function CurtainHomeNav({ settings }: { settings: SiteSettings }) {
  return (
    <>
      <a href={settings.menuPdfUrl} className="curtain-item curtain-nav-link" download>
        MENU
      </a>
      <Link href="/contact" className="curtain-item curtain-nav-link">
        CONTACT
      </Link>
      <div className="curtain-logo-wrap curtain-item">
        <Link href="/" aria-label="Gabos home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/curtain/Artboard-1-1.png" alt="" className="curtain-logo" width={280} height={200} />
        </Link>
      </div>
      <a href={settings.bookUrl} className="curtain-item curtain-nav-link" target="_blank" rel="noopener noreferrer">
        BOOK
      </a>
      <a href={settings.socialUrl} className="curtain-item curtain-nav-link" target="_blank" rel="noopener noreferrer">
        FOLLOW
      </a>
    </>
  )
}
