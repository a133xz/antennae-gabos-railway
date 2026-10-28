(function () {
  var section = document.querySelector('.landing-panel');
  if (!section) return;
  var home = document.querySelector('.gabos-home');

  function viewportHeight() {
    return (window.visualViewport && window.visualViewport.height) || document.documentElement.clientHeight || window.innerHeight || 1;
  }

  function mix(amount) {
    var t = Math.min(1, Math.max(0, amount));
    var r = Math.round(110 * (1 - t));
    var g = 0;
    var b = Math.round(1 * (1 - t));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function progress() {
    var vh = viewportHeight();
    var top = section.getBoundingClientRect().top;
    var mobile = window.matchMedia('(max-width: 767px)').matches;
    if (mobile) {
      var fadeStart = vh * 0.86;
      if (top >= fadeStart) return 0;
      return Math.min(1, Math.max(0, (fadeStart - top) / fadeStart));
    }
    var fadeBegin = vh * 0.09;
    var fadeScroll = vh * 0.85;
    if (top > fadeBegin) return 0;
    return Math.min(1, Math.max(0, (fadeBegin - top) / fadeScroll));
  }

  var frame = 0;
  function update() {
    frame = 0;
    var amount = progress();
    var bg = mix(amount);
    section.style.backgroundColor = bg;
    var mobile = window.matchMedia('(max-width: 767px)').matches;
    if (mobile && home) home.style.backgroundColor = amount > 0 ? bg : '';
    document.body.style.backgroundColor = amount >= 1 ? '#000' : '';
  }

  function onScroll() {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  }

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onScroll);
    window.visualViewport.addEventListener('scroll', onScroll);
  }
})();
