/* ============================
   CUSTOM DEMANDS — index.js
   ============================ */

// ---- NAV: Hamburger ----
const ham = document.getElementById('ham');
const mobileMenu = document.getElementById('mobileMenu');

ham.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  ham.classList.toggle('open', open);
  ham.setAttribute('aria-expanded', open);
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  ham.classList.remove('open');
}

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!ham.contains(e.target) && !mobileMenu.contains(e.target)) closeMenu();
});

// ---- NAV: Scroll shadow ----
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10
    ? '0 4px 30px rgba(0,0,0,0.4)'
    : 'none';
}, { passive: true });

// ---- CARD: Scroll-triggered fade-in ----
const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const delay = (parseInt(card.dataset.index || '0') - 1) * 60;
      setTimeout(() => card.classList.add('visible'), delay);
      observer.unobserve(card);
    }
  });
}, { threshold: 0.12 });

cards.forEach(card => observer.observe(card));

// ---- Smooth anchor scroll (for mobile nav links too) ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      closeMenu();
      window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    }
  });
});
