import type { SiteSettings } from '@/content/types'

export function CurtainContactContent({ settings }: { settings: SiteSettings }) {
  return (
    <>
      <div className="details item">
        {settings.contactIntro.split('\n').map((line, index) => (
          <p key={`${index}-${line}`}>{line || '\u00A0'}</p>
        ))}
        {settings.contactPhone ? <p>T: {settings.contactPhone}</p> : null}
        {settings.contactPhoneHours ? <p>{settings.contactPhoneHours}</p> : null}
      </div>

      {settings.emails.map((email) => (
        <div key={email.address}>
          <p className="heading">{email.label}</p>
          <a href={`mailto:${email.address}`} className="email item">
            {email.address}
          </a>
        </div>
      ))}
    </>
  )
}
