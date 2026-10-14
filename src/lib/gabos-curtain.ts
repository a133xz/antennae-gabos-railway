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

  function afterOpen() {
    root.classList.add('wrapper--opened')
    document.body.classList.remove('gabos-curtain-active')
    fixedLeft.style.pointerEvents = 'none'
    fixedRight.style.pointerEvents = 'none'

    if (scrollable) {
      nav.style.zIndex = '1'
      fixedLeft.style.zIndex = '5'
      fixedRight.style.zIndex = '5'
    } else {
      nav.style.zIndex = '4'
      fixedLeft.style.zIndex = '3'
      fixedRight.style.zIndex = '3'
    }
  }

  function animateMobileCurtain() {
    if (!mobileCurtain) return
    mobileCurtain.style.display = 'block'
    mobileCurtain.style.position = 'absolute'
    mobileCurtain.style.top = '0'
    mobileCurtain.style.left = '0'
    mobileCurtain.style.width = '100%'
    mobileCurtain.style.transition = 'transform 1.5s ease-in-out'

    timers.push(
      window.setTimeout(() => {
        mobileCurtain.style.transform = 'translateY(-100%)'
      }, 500),
    )

    timers.push(
      window.setTimeout(() => {
        mobileCurtain.style.display = 'none'
        afterOpen()
      }, 2000),
    )
  }

  function animateDesktopCurtains() {
    if (!curtainLeft || !curtainRight) return

    curtainLeft.style.display = 'block'
    curtainRight.style.display = 'block'
    curtainLeft.style.position = 'absolute'
    curtainRight.style.position = 'absolute'
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
        curtainLeft.style.transform = 'translateX(-100%)'
        curtainRight.style.transform = 'translateX(100%)'
      }, 500),
    )

    timers.push(
      window.setTimeout(() => {
        curtainLeft.style.display = 'none'
        curtainRight.style.display = 'none'
        afterOpen()
      }, 2000),
    )
  }

  nav.style.zIndex = '1'
  fixedLeft.style.pointerEvents = 'auto'
  fixedRight.style.pointerEvents = 'auto'
  document.body.classList.add('gabos-curtain-active')

  if (window.innerWidth <= 720) {
    animateMobileCurtain()
  } else {
    animateDesktopCurtains()
  }

  return () => {
    timers.forEach((id) => window.clearTimeout(id))
    document.body.classList.remove('gabos-curtain-active')
  }
}
