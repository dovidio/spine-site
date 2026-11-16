// Scroll position as the app's storage meter, and the plate lifting away from the fold.
// One authored moment; nothing else on the page animates.
(function () {
  var meter = document.getElementById('meter');
  var plate = document.getElementById('plate');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ticking = false;

  function frame() {
    ticking = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    var progress = max > 0 ? Math.min(scrollY / max, 1) : 0;
    if (meter) meter.style.width = (progress * 100) + '%';
    if (!reduce && plate) {
      var lift = Math.min(scrollY * 0.06, 48);
      plate.style.transform = 'translateY(' + (-lift) + 'px)';
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();
})();
