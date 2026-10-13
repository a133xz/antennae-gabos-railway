import type { SiteSettings } from '@/content/types'

export function CurtainContactContent({ settings }: { settings: SiteSettings }) {
  return (
    <>
      <div className="curtain-details curtain-item">
        {settings.contactIntro.split('\n').map((line) => (
          <p key={line}>{line || '\u00A0'}</p>
        ))}
        {settings.contactPhone ? <p>T: {settings.contactPhone}</p> : null}
        {settings.contactPhoneHours ? <p>{settings.contactPhoneHours}</p> : null}
      </div>

      {settings.emails.map((email) => (
        <div key={email.address} className="curtain-item curtain-email-block">
          <p className="curtain-heading">{email.label}</p>
          <a href={`mailto:${email.address}`} className="curtain-email">
            {email.address}
          </a>
        </div>
      ))}
    </>
  )
}
