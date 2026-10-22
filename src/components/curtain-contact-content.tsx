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

/** Day range and clock time, so mobile can break between them instead of mid-phrase. */
function splitHourLine(line: string) {
  const match = line.match(/^(.+?)\s+(\d{1,2}\.\d{2}\s+a\s+\d{1,2}\.\d{2})$/)
  if (!match) return { days: line, time: null }
  return { days: match[1], time: match[2] }
}

export function CurtainContactContent({ settings }: { settings: SiteSettings }) {
  const hours = openingHourLines(settings.contactIntro)

  return (
    <>
      <div className="details item">
        <p>
          {hours.map((line, index) => {
            const { days, time } = splitHourLine(line)
            return (
              <span key={index} className="hours-line">
                {time ? (
                  <>
                    <span className="hours-days">{days}</span>
                    <span className="hours-time">{time}</span>
                  </>
                ) : (
                  line
                )}
              </span>
            )
          })}
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
