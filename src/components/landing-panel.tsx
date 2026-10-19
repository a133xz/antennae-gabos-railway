import { LandingHuellas } from './landing-huellas'

export function LandingPanel({ children }: { children: React.ReactNode }) {
  return (
    <section className="landing-panel relative text-center text-white">
      <LandingHuellas />
      <div className="landing-panel-inner px-[var(--gutter-inline)] pb-[var(--gutter-bottom)]">
        {children}
      </div>
    </section>
  )
}
