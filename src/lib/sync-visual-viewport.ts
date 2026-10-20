/**
 * iOS Safari (incl. bottom tab bar): keep full-bleed curtains aligned to the visible
 * viewport top via CSS vars consumed by `.curtain-viewport-cover`.
 */
function isIosSafariLike(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export function bindVisualViewportCurtainVars(): () => void {
  if (typeof window === 'undefined' || !isIosSafariLike()) return () => {}

  const root = document.documentElement
  const vv = window.visualViewport

  const update = () => {
    const viewport = window.visualViewport
    if (!viewport) return

    const layoutH = window.innerHeight
    const offsetTop = viewport.offsetTop
    const vvHeight = viewport.height
    const bottomChrome = Math.max(0, layoutH - vvHeight - offsetTop)

    root.style.setProperty('--visual-viewport-offset-top', `${offsetTop}px`)
    root.style.setProperty('--visual-viewport-bottom-chrome', `${bottomChrome}px`)

    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const bottomToolbar = ios && bottomChrome >= 20
    root.classList.toggle('ios-safari-bottom-toolbar', bottomToolbar)
  }

  update()
  vv?.addEventListener('resize', update)
  vv?.addEventListener('scroll', update)
  window.addEventListener('resize', update)
  window.addEventListener('orientationchange', update)

  return () => {
    vv?.removeEventListener('resize', update)
    vv?.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    window.removeEventListener('orientationchange', update)
    root.classList.remove('ios-safari-bottom-toolbar')
    root.style.removeProperty('--visual-viewport-offset-top')
    root.style.removeProperty('--visual-viewport-bottom-chrome')
  }
}
