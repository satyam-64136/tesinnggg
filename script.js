/* ═══════════════════════════════════════════════
   SHIVA'S DELIGHTS — script.js
   Premium micro-interactions & parallax
═══════════════════════════════════════════════ */

'use strict';

/* ─── NAV: SCROLL SHRINK + ACTIVE LINKS ─── */
const nav     = document.getElementById('main-nav');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta-link)');

let lastScrollY = 0;

function onScroll() {
  const y = window.scrollY;

  // Scrolled class (shrinks nav)
  nav.classList.toggle('scrolled', y > 50);

  // Active nav link
  let current = '';
  sections.forEach(s => {
    if (y >= s.offsetTop - 180) current = s.id;
  });
  navLinks.forEach(a => {
    const match = a.getAttribute('href') === '#' + current;
    a.classList.toggle('active', match);
  });

  lastScrollY = y;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ─── MOBILE MENU ─── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose   = document.getElementById('menuClose');

function openMenu() {
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
  hamburger.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenu));

/* ─── SMOOTH ANCHOR SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      closeMenu();
      // Small offset for the fixed nav
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── HERO PARALLAX ─── */
// Subtle: hero right panel shifts slightly upward while scrolling
const heroImgWrap = document.querySelector('.hero-img-wrap');
const heroRight   = document.querySelector('.hero-right');

function heroParallax() {
  if (!heroImgWrap || !heroRight) return;
  // Only on large screens where hero is side-by-side
  if (window.innerWidth < 1025) {
    heroImgWrap.style.transform = '';
    return;
  }
  const scrolled = window.scrollY;
  const rate     = scrolled * 0.22; // very gentle
  heroImgWrap.style.transform = `translateY(${-rate}px)`;
}

// Section background parallax — very subtle depth on bg-warm sections
function sectionParallax() {
  if (window.innerWidth < 768) return; // skip on mobile for perf
  document.querySelectorAll('.parallax-bg').forEach(el => {
    const rect  = el.getBoundingClientRect();
    const mid   = window.innerHeight / 2;
    const delta = (rect.top + rect.height / 2 - mid) * 0.06;
    el.style.setProperty('--parallax-y', `${delta}px`);
  });
}

window.addEventListener('scroll', () => {
  heroParallax();
  sectionParallax();
}, { passive: true });
heroParallax();

/* ─── SCROLL REVEAL (GENERAL) ─── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Use data-delay for individual control, fallback to index stagger
      const delay = entry.target.dataset.delay
        ? parseInt(entry.target.dataset.delay)
        : i * 55;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -44px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── GALLERY STAGGERED REVEAL ─── */
const galleryItems = document.querySelectorAll('.gallery-item');

const galleryObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const idx = Array.from(galleryItems).indexOf(el);
      setTimeout(() => el.classList.add('gi-visible'), idx * 100);
      galleryObs.unobserve(el);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

galleryItems.forEach(el => galleryObs.observe(el));

/* ─── LIGHTBOX ─── */
const lbOverlay = document.getElementById('lbOverlay');
const lbImg     = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose   = document.getElementById('lbClose');

function openLightbox(src, caption) {
  lbImg.src = src;
  lbCaption.textContent = caption || '';
  lbOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lbOverlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = ''; }, 380);
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img     = item.querySelector('.g-img');
    const caption = item.querySelector('.gallery-caption span');
    if (img) openLightbox(img.src, caption?.textContent);
  });
});
lbClose.addEventListener('click', closeLightbox);
lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ─── FORM SUBMISSION ─── */
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('[type="submit"]');
  const orig = btn.textContent;

  btn.textContent   = 'Sending...';
  btn.style.opacity = '0.65';
  btn.disabled      = true;

  setTimeout(() => {
    form.reset();
    btn.textContent = orig;
    btn.style.opacity = '1';
    btn.disabled    = false;
    showToast('Enquiry sent. We will get back to you within 24 hours.');
  }, 1200);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4200);
}

/* ─── BUTTON PRESS MICRO-FEEDBACK ─── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('pointerdown', () => {
    btn.style.transition = 'transform 0.1s ease';
    btn.style.transform  = 'scale(0.97) translateY(1px)';
  });
  const reset = () => {
    btn.style.transition = '';
    btn.style.transform  = '';
  };
  btn.addEventListener('pointerup', reset);
  btn.addEventListener('pointerleave', reset);
  btn.addEventListener('pointercancel', reset);
});

/* ─── STAT COUNTER ANIMATION ─── */
function animateCounter(el) {
  const raw    = el.textContent.trim();       // "500+", "100%", "5.0"
  const num    = parseFloat(raw);
  const suffix = raw.replace(/[\d.]/g, '');   // "+", "%", ""
  if (isNaN(num)) return;

  const duration = 1200;
  const start    = performance.now();
  const isFloat  = raw.includes('.');

  function tick(now) {
    const elapsed = Math.min(now - start, duration);
    const eased   = 1 - Math.pow(1 - elapsed / duration, 3); // ease-out cubic
    const current = num * eased;
    el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
    if (elapsed < duration) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) statObs.observe(statsSection);

/* ─── CURSOR GLOW (desktop only, very subtle) ─── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  Object.assign(glow.style, {
    position: 'fixed',
    width: '300px', height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(200,118,138,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: '0',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.4s ease',
    top: '0', left: '0',
    opacity: '0',
  });
  document.body.appendChild(glow);

  let glowX = 0, glowY = 0;
  let targetX = 0, targetY = 0;
  let glowActive = false;

  document.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!glowActive) { glow.style.opacity = '1'; glowActive = true; }
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    glowActive = false;
  });

  // Smooth lerp
  function lerpGlow() {
    glowX += (targetX - glowX) * 0.1;
    glowY += (targetY - glowY) * 0.1;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(lerpGlow);
  }
  lerpGlow();
}
