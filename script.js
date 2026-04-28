// Mobile nav
function toggleNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

// Scroll-based active nav
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting)
      navAs.forEach(a => a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--red)' : '');
  });
}, { rootMargin: '-40% 0px -55% 0px' }).observe || sections.forEach(s =>
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        navAs.forEach(a => a.style.color = a.getAttribute('href') === `#${e.target.id}` ? 'var(--red)' : '');
    });
  }, { rootMargin: '-40% 0px -55% 0px' }).observe(s)
);

// AOS (scroll fade-in)
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      aosObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
aosEls.forEach(el => aosObs.observe(el));

// Sticky nav shadow
window.addEventListener('scroll', () => {
  document.getElementById('nav').style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,.08)' : '';
});

// Contact form
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '已發送！我們將盡快聯絡您 ✓';
  btn.style.background = '#232323';
  btn.disabled = true;
});
