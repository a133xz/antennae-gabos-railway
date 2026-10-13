import { Fragment } from 'react'
import type { SiteSettings } from '@/content/types'

function openingHourLines(intro: string) {
  const lines = intro.split('\n')
  const hours: string[] = []
  for (const line of lines) {
    if (line.trim() === '') break
    hours.push(line)
  }
  return hours
}

export function CurtainContactContent({ settings }: { settings: SiteSettings }) {
  const hours = openingHourLines(settings.contactIntro)

  return (
    <>
      <div className="details item">
        <p>
          {hours.map((line, index) => (
            <Fragment key={index}>
              {index > 0 ? <br /> : null}
              {line}
            </Fragment>
          ))}
        </p>
        <p>&nbsp;</p>
        {settings.contactPhone ? <p>T: {settings.contactPhone}</p> : null}
        {settings.contactPhoneHours ? <p>{settings.contactPhoneHours}</p> : null}
      </div>

      {settings.emails.map((email) => (
        <Fragment key={email.address}>
          <p className="heading">{email.label}</p>
          <a href={`mailto:${email.address}`} className="email item">
            {email.address}
          </a>
        </Fragment>
      ))}
    </>
  )
}
