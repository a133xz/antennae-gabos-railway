(function () {
  var toggle = document.querySelector('.store-menu-toggle');
  var panel = document.querySelector('.store-mobile-panel');
  if (!toggle || !panel) return;

  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    panel.hidden = open;
    document.body.classList.toggle('store-menu-open', !open);
  });
})();