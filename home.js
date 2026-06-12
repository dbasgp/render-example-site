/* ============================================================
   DryEaz homepage — progressive disclosure enhancements
   Runs only on the homepage (body.home). Pure progressive
   enhancement: if JS is off, all content stays visible.
   ============================================================ */
(function () {
  if (!document.body.classList.contains('home')) return;

  var chev =
    '<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  /* ---------- 1. Spec cards: headline metric + collapsible table ---------- */
  document.querySelectorAll('.spec-card').forEach(function (card, i) {
    var table = card.querySelector('.spec-table');
    if (!table) return;

    // Pull the first spec row to surface as an always-visible headline.
    var firstRow = table.querySelector('tr');
    if (firstRow) {
      var cells = firstRow.querySelectorAll('td');
      if (cells.length >= 2) {
        var val = cells[1].textContent.trim();
        var m = val.match(/^([\d.,±]+)\s*(.*)$/);
        var headline = document.createElement('div');
        headline.className = 'spec-headline';
        headline.innerHTML = m
          ? '<span class="num">' + m[1] + '</span><span class="unit">' + (m[2] || cells[0].textContent.trim()) + '</span>'
          : '<span class="num">' + val + '</span>';
        var h4 = card.querySelector('h4');
        if (h4) h4.insertAdjacentElement('afterend', headline);
      }
    }

    // Collapse the full table behind a toggle.
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'spec-toggle';
    btn.setAttribute('aria-expanded', 'false');
    var tableId = 'spec-' + i;
    table.id = tableId;
    btn.setAttribute('aria-controls', tableId);
    btn.innerHTML = 'Full specs' + chev;
    table.insertAdjacentElement('beforebegin', btn);

    btn.addEventListener('click', function () {
      var open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.firstChild.textContent = open ? 'Hide specs' : 'Full specs';
    });
  });

  /* ---------- 2. Series config/control lists: fold into a disclosure ---------- */
  document.querySelectorAll('.shared-features').forEach(function (panel, i) {
    panel.classList.add('collapsed');
    var panelId = 'feat-' + i;
    panel.id = panelId;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'feature-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', panelId);
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
    // Sync active step while scrolling through the section.
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) activate(e.target.getAttribute('data-step')); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(function (s) { obs.observe(s); });
  }
})();
