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

  /* ---------- 1. Spec cards: headline + quick stats + collapsible rest ---------- */
  document.querySelectorAll('.spec-card').forEach(function (card, i) {
    var table = card.querySelector('.spec-table');
    if (!table) return;
    var rows = Array.prototype.slice.call(table.querySelectorAll('tr'));
    var h4 = card.querySelector('h4');
    if (!rows.length || !h4) return;

    function cellPair(row) {
      var c = row.querySelectorAll('td');
      return c.length >= 2 ? { k: c[0].textContent.trim(), v: c[1].textContent.trim() } : null;
    }

    // headline = first row, as a big animated metric
    var head = cellPair(rows[0]);
    if (head) {
      var m = head.v.match(/^([\d.,±]+)\s*(.*)$/);
      var hEl = document.createElement('div');
      hEl.className = 'spec-headline';
      hEl.innerHTML = m
        ? '<span class="num" data-count="' + m[1] + '">' + m[1] + '</span><span class="unit">' + (m[2] || head.k) + '</span>'
        : '<span class="num">' + head.v + '</span>';
      h4.insertAdjacentElement('afterend', hEl);

      // quick stats = next up-to-3 rows, always visible
      var quick = rows.slice(1, 4).map(cellPair).filter(Boolean);
      if (quick.length) {
        var qs = document.createElement('div');
        qs.className = 'spec-quickstats';
        qs.innerHTML = quick.map(function (p) {
          return '<div class="qs"><span class="qs-k">' + p.k + '</span><span class="qs-v">' + p.v + '</span></div>';
        }).join('');
        hEl.insertAdjacentElement('afterend', qs);
      }

      // remove surfaced rows from the table; the rest collapses
      rows.slice(0, 4).forEach(function (r) { r.remove(); });
    }

    var remaining = table.querySelectorAll('tr').length;
    if (remaining === 0) { table.remove(); return; }

    // wrap remaining table so grid-template-rows can animate true auto height
    var wrap = document.createElement('div');
    wrap.className = 'spec-wrap';
    wrap.id = 'spec-' + i;
    var inner = document.createElement('div');
    inner.className = 'spec-wrap-inner';
    table.parentNode.insertBefore(wrap, table);
    inner.appendChild(table);
    wrap.appendChild(inner);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'spec-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', wrap.id);
    btn.innerHTML = 'Full specs' + chev;
    wrap.parentNode.insertBefore(btn, wrap);

    btn.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.firstChild.textContent = open ? 'Hide specs' : 'Full specs';
    });
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
