/* ============================================================
   DryEaz homepage — progressive disclosure + motion
   Runs only on body.home. Pure progressive enhancement.
   ============================================================ */
(function () {
  if (!document.body.classList.contains('home')) return;

  var chev =
    '<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---------- 1. Spec cards: big headline metric + full specs (always shown) ---------- */
  document.querySelectorAll('.spec-card').forEach(function (card) {
    var table = card.querySelector('.spec-table');
    if (!table) return;
    var firstRow = table.querySelector('tr');
    var h4 = card.querySelector('h4');
    if (!firstRow || !h4) return;

    var cells = firstRow.querySelectorAll('td');
    if (cells.length >= 2) {
      var k = cells[0].textContent.trim();
      var v = cells[1].textContent.trim();
      var m = v.match(/^([\d.,±]+)\s*(.*)$/);
      var hEl = document.createElement('div');
      hEl.className = 'spec-headline';
      hEl.innerHTML = m
        ? '<span class="num" data-count="' + m[1] + '">' + m[1] + '</span><span class="unit">' + (m[2] || k) + '</span>'
        : '<span class="num">' + v + '</span>';
      h4.insertAdjacentElement('afterend', hEl);
      // surface the capacity as the headline; remaining rows stay in the visible table
      firstRow.remove();
    }
  });

  /* ---------- 2. Series config/control lists: fold into a disclosure ---------- */
  document.querySelectorAll('.shared-features').forEach(function (panel, i) {
    panel.classList.add('collapsed');
    panel.id = 'feat-' + i;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'feature-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', panel.id);
    btn.innerHTML = 'Configuration &amp; controls' + chev;
    panel.insertAdjacentElement('beforebegin', btn);
    btn.addEventListener('click', function () {
      var open = panel.classList.toggle('collapsed') === false;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- 3. Technology: click-to-reveal tabs (keeps scroll sync) ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll('.tech-step'));
  var imgs = document.querySelectorAll('.tech-img');
  function activate(idx) {
    steps.forEach(function (s) { s.classList.toggle('active', s.getAttribute('data-step') === idx); });
    imgs.forEach(function (img) { img.classList.toggle('active', img.getAttribute('data-tech') === idx); });
  }
  if (steps.length) {
    activate('0');
    steps.forEach(function (step) {
      step.setAttribute('role', 'button');
      step.setAttribute('tabindex', '0');
      step.addEventListener('click', function () { activate(step.getAttribute('data-step')); });
      step.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(step.getAttribute('data-step')); }
      });
    });
    var tObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(e.target.getAttribute('data-step')); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { tObs.observe(s); });
  }

  /* ---------- 4. Count-up animation on metrics when scrolled into view ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var nums = document.querySelectorAll('.spec-headline .num[data-count]');
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        cObs.unobserve(el);
        var raw = el.getAttribute('data-count');
        var target = parseFloat(raw.replace(/,/g, '').replace('±', ''));
        if (isNaN(target)) return;
        var dec = (raw.split('.')[1] || '').length;
        var dur = 1100, start = null;
        function frame(t) {
          if (start === null) start = t;
          var p = Math.min((t - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(frame);
          else el.textContent = raw;
        }
        el.textContent = dec ? '0.0' : '0';
        requestAnimationFrame(frame);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { cObs.observe(n); });
  }
})();
