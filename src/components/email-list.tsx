import type { SiteSettings } from '@/content/types'

export function EmailList({ emails }: { emails: SiteSettings['emails'] }) {
  return (
    <ul className="space-y-1">
      {emails.map((email) => (
        <li key={email.address}>
          <span className="italic normal-case">{email.label} </span>
          <a href={`mailto:${email.address}`} className="normal-case">
            {email.address}
          </a>
        </li>
      ))}
    </ul>
  )
}
