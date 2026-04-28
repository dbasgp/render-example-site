// Mobile nav toggle
function toggleNav() {
  document.getElementById('mobileNav').classList.toggle('open');
}

// Active nav on scroll
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${entry.target.id}` ? 'var(--red)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

// Contact form intercept
document.querySelector('.contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = '已發送！感謝您的查詢 ✓';
  btn.style.background = '#232323';
  btn.disabled = true;
});

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.product-card, .industrial-card, .why-card, .cf-item, .size-row:not(.header)');
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  fadeObs.observe(el);
});
