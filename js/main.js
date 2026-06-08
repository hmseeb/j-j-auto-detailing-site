/* ============================================
   J&J AUTO DETAILING — MAIN JS
   ============================================ */

'use strict';

/* ---------- DOM HELPERS ---------- */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

/* ---------- HEADER SCROLL ---------- */
(function initHeader() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- MOBILE NAV ---------- */
(function initMobileNav() {
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');
  if (!hamburger || !navLinks) return;

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    toggle(!navLinks.classList.contains('open'));
  });

  // Close on link click
  $$('.nav__link', navLinks).forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      toggle(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggle(false);
      hamburger.focus();
    }
  });
})();

/* ---------- ACTIVE NAV LINK (scroll spy) ---------- */
(function initScrollSpy() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- BACK TO TOP ---------- */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---------- ADD REVEAL CLASSES TO ELEMENTS ---------- */
(function addRevealClasses() {
  // Section headers
  $$('.section-header').forEach(el => el.classList.add('reveal'));

  // Service cards container
  const servicesGrid = $('.services__grid');
  if (servicesGrid) servicesGrid.classList.add('reveal-stagger');

  // About
  const aboutContent = $('.about__content');
  const aboutImages  = $('.about__images');
  if (aboutContent) aboutContent.classList.add('reveal');
  if (aboutImages)  aboutImages.classList.add('reveal');

  // Testimonial cards container
  const testimonialsGrid = $('.testimonials__grid');
  if (testimonialsGrid) testimonialsGrid.classList.add('reveal-stagger');

  // Gallery items
  $$('.gallery__item').forEach(el => el.classList.add('reveal'));

  // CTA banner content
  const ctaContent = $('.cta-banner__content');
  if (ctaContent) ctaContent.classList.add('reveal');

  // Contact sections
  const contactInfo = $('.contact__info');
  const contactForm = $('.contact__form-wrap');
  if (contactInfo) contactInfo.classList.add('reveal');
  if (contactForm) contactForm.classList.add('reveal');
})();

/* ---------- INTERSECTION OBSERVER (reveal animations) ---------- */
(function initReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    $$('.reveal, .reveal-stagger').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
})();

/* ---------- CONTACT FORM ---------- */
(function initContactForm() {
  const form    = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  const validate = () => {
    let valid = true;

    // First name
    const firstName = $('#firstName');
    const firstErr  = firstName?.nextElementSibling;
    if (firstName && !firstName.value.trim()) {
      firstName.classList.add('invalid');
      if (firstErr) firstErr.textContent = 'Please enter your first name.';
      valid = false;
    } else if (firstName) {
      firstName.classList.remove('invalid');
      if (firstErr) firstErr.textContent = '';
    }

    // Last name
    const lastName = $('#lastName');
    const lastErr  = lastName?.nextElementSibling;
    if (lastName && !lastName.value.trim()) {
      lastName.classList.add('invalid');
      if (lastErr) lastErr.textContent = 'Please enter your last name.';
      valid = false;
    } else if (lastName) {
      lastName.classList.remove('invalid');
      if (lastErr) lastErr.textContent = '';
    }

    // Email
    const email    = $('#email');
    const emailErr = email?.nextElementSibling;
    const emailRx  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRx.test(email.value.trim())) {
      email.classList.add('invalid');
      if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
      valid = false;
    } else if (email) {
      email.classList.remove('invalid');
      if (emailErr) emailErr.textContent = '';
    }

    // Message
    const message    = $('#message');
    const messageErr = message?.nextElementSibling;
    if (message && !message.value.trim()) {
      message.classList.add('invalid');
      if (messageErr) messageErr.textContent = 'Please tell us about your needs.';
      valid = false;
    } else if (message) {
      message.classList.remove('invalid');
      if (messageErr) messageErr.textContent = '';
    }

    return valid;
  };

  // Real-time validation on blur
  $$('input, textarea', form).forEach(field => {
    field.addEventListener('blur', () => validate());
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Simulate submission (no real endpoint)
    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn?.querySelector('.btn-text');
    const btnLoad   = submitBtn?.querySelector('.btn-loading');

    if (submitBtn) submitBtn.disabled = true;
    if (btnText)   btnText.hidden = true;
    if (btnLoad)   btnLoad.hidden = false;

    setTimeout(() => {
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
      if (btnText)   btnText.hidden = false;
      if (btnLoad)   btnLoad.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 1200);
  });
})();

/* ---------- FOOTER YEAR ---------- */
(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ---------- SMOOTH SCROLL FOR ALL ANCHOR LINKS ---------- */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const headerH = $('#header')?.offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();
