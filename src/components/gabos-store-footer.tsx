import Link from 'next/link'
import type { SiteSettings } from '@/content/types'

export function GabosStoreFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto pt-10">
      <div className="flex justify-between gap-6">
        <Link href="/" className="block h-[117px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/echoes-from-new-york.svg"
            alt="Echoes from New York"
            width={712}
            height={117}
            className="block h-full w-auto max-w-[min(712px,58vw)]"
          />
        </Link>
        <div className="flex h-[117px] flex-col justify-end text-right text-[21px] uppercase">
          <p className="m-0 leading-[0.7]">
            <span>follow</span>{' '}
            <a href={settings.socialUrl} className="ml-4 transition-opacity hover:opacity-70" target="_blank" rel="noreferrer">
              {settings.socialHandle}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
