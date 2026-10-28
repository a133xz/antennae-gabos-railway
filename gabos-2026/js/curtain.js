(function () {
  var MOBILE_MAX = 767;
  var root = document.querySelector('.wrapper');
  if (!root) return;

  var scrollable = root.getAttribute('data-scrollable') === '1';
  var mobileCurtain = root.querySelector('.mobileCurtain');
  var curtainLeft = root.querySelector('.curtainLeft');
  var curtainRight = root.querySelector('.curtainRight');
  var fixedLeft = root.querySelector('.fixedCurtainLeft');
  var fixedRight = root.querySelector('.fixedCurtainRight');
  var nav = root.querySelector('.navWrapper');
  if (!nav || !fixedLeft || !fixedRight) return;

  var finished = false;

  function finishOpen() {
    if (finished) return;
    finished = true;
    root.classList.add('wrapper--opened');
    document.body.classList.remove('gabos-curtain-active');
    if (mobileCurtain) mobileCurtain.style.display = 'none';
    if (curtainLeft) curtainLeft.style.display = 'none';
    if (curtainRight) curtainRight.style.display = 'none';
    fixedLeft.style.pointerEvents = 'none';
    fixedRight.style.pointerEvents = 'none';

    if (scrollable) {
      var phone = window.innerWidth <= MOBILE_MAX;
      nav.style.zIndex = phone ? '4' : '1';
      fixedLeft.style.zIndex = phone ? '10' : '5';
      fixedRight.style.zIndex = phone ? '10' : '5';
    } else {
      nav.style.zIndex = '4';
      fixedLeft.style.zIndex = '3';
      fixedRight.style.zIndex = '3';
    }
  }

  function animateMobile() {
    if (!mobileCurtain) {
      finishOpen();
      return;
    }
    mobileCurtain.style.display = 'block';
    mobileCurtain.style.position = scrollable ? 'fixed' : 'absolute';
    mobileCurtain.style.left = '0';
    mobileCurtain.style.width = '100%';
    mobileCurtain.style.transform = 'translateY(0)';
    mobileCurtain.style.transition = 'transform 1.5s ease-in-out';
    window.setTimeout(function () {
      mobileCurtain.style.transform = 'translateY(-100%)';
    }, 500);
    window.setTimeout(finishOpen, 2000);
  }

  function animateDesktop() {
    if (!curtainLeft || !curtainRight) {
      finishOpen();
      return;
    }
    var position = scrollable ? 'fixed' : 'absolute';
    curtainLeft.style.display = 'block';
    curtainRight.style.display = 'block';
    curtainLeft.style.position = position;
    curtainRight.style.position = position;
    curtainLeft.style.left = '0';
    curtainRight.style.right = '0';
    curtainLeft.style.width = '51%';
    curtainRight.style.width = '51%';
    curtainLeft.style.transition = 'transform 1.5s ease-in-out';
    curtainRight.style.transition = 'transform 1.5s ease-in-out';
    window.setTimeout(function () {
      curtainLeft.style.transform = 'translateX(-100%)';
      curtainRight.style.transform = 'translateX(100%)';
    }, 500);
    window.setTimeout(finishOpen, 2000);
  }

  nav.style.zIndex = '1';
  fixedLeft.style.pointerEvents = 'auto';
  fixedRight.style.pointerEvents = 'auto';
  document.body.classList.add('gabos-curtain-active');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishOpen();
    return;
  }

  if (window.innerWidth <= MOBILE_MAX) {
    animateMobile();
  } else if (curtainLeft && curtainRight) {
    animateDesktop();
  } else {
    animateMobile();
  }
})();
