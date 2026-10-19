/**
 * Port of public/curtain/curtain.js (Gabos theme).
 * Scoped to a `.wrapper` root so home and contact share the same animation.
 */
export function runGabosCurtainAnimation(
  root: HTMLElement,
  options: { scrollable?: boolean } = {},
): () => void {
  const scrollable = options.scrollable ?? root.classList.contains('wrapper--scroll')
  const mobileCurtain = root.querySelector<HTMLElement>('.mobileCurtain')
  const curtainLeft = root.querySelector<HTMLElement>('.curtainLeft')
  const curtainRight = root.querySelector<HTMLElement>('.curtainRight')
  const fixedCurtainLeft = root.querySelector<HTMLElement>('.fixedCurtainLeft')
  const fixedCurtainRight = root.querySelector<HTMLElement>('.fixedCurtainRight')
  const navWrapper = root.querySelector<HTMLElement>('.navWrapper')

  if (!navWrapper || !fixedCurtainLeft || !fixedCurtainRight) {
    return () => {}
  }

  const nav = navWrapper
  const fixedLeft = fixedCurtainLeft
  const fixedRight = fixedCurtainRight

  const timers: number[] = []
  let finished = false
  let cancelled = false

  function finishOpen() {
    if (finished) return
    finished = true

    root.classList.add('wrapper--opened')
    document.body.classList.remove('gabos-curtain-active')

    if (mobileCurtain) mobileCurtain.style.display = 'none'
    if (curtainLeft) curtainLeft.style.display = 'none'
    if (curtainRight) curtainRight.style.display = 'none'

    fixedLeft.style.pointerEvents = 'none'
    fixedRight.style.pointerEvents = 'none'

    if (scrollable) {
      const phone = window.innerWidth <= 767
      nav.style.zIndex = phone ? '4' : '1'
      fixedLeft.style.zIndex = phone ? '3' : '5'
      fixedRight.style.zIndex = phone ? '3' : '5'
    } else {
      nav.style.zIndex = '4'
      fixedLeft.style.zIndex = '3'
      fixedRight.style.zIndex = '3'
    }
  }

  function animateMobileCurtain() {
    if (!mobileCurtain) {
      finishOpen()
      return
    }
    mobileCurtain.style.display = 'block'
    mobileCurtain.style.position = 'absolute'
    mobileCurtain.style.top = '0'
    mobileCurtain.style.left = '0'
    mobileCurtain.style.width = '100%'
    mobileCurtain.style.transition = 'transform 1.5s ease-in-out'

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return
        mobileCurtain.style.transform = 'translateY(-100%)'
      }, 500),
    )

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return
        finishOpen()
      }, 2000),
    )
  }

  function animateDesktopCurtains() {
    if (!curtainLeft || !curtainRight) {
      finishOpen()
      return
    }

    const curtainPosition = scrollable ? 'fixed' : 'absolute'

    curtainLeft.style.display = 'block'
    curtainRight.style.display = 'block'
    curtainLeft.style.position = curtainPosition
    curtainRight.style.position = curtainPosition
    curtainLeft.style.top = '0'
    curtainRight.style.top = '0'
    curtainLeft.style.left = '0'
    curtainRight.style.right = '0'
    curtainLeft.style.width = '51%'
    curtainRight.style.width = '51%'
    curtainLeft.style.transition = 'transform 1.5s ease-in-out'
    curtainRight.style.transition = 'transform 1.5s ease-in-out'

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return
        curtainLeft.style.transform = 'translateX(-100%)'
        curtainRight.style.transform = 'translateX(100%)'
      }, 500),
    )

    timers.push(
      window.setTimeout(() => {
        if (cancelled) return
        finishOpen()
      }, 2000),
    )
  }

  nav.style.zIndex = '1'
  fixedLeft.style.pointerEvents = 'auto'
  fixedRight.style.pointerEvents = 'auto'
  document.body.classList.add('gabos-curtain-active')

  if (curtainLeft && curtainRight) {
    animateDesktopCurtains()
  } else {
    animateMobileCurtain()
  }

  return () => {
    cancelled = true
    timers.forEach((id) => window.clearTimeout(id))
    document.body.classList.remove('gabos-curtain-active')
    if (!finished) finishOpen()
  }
}
