/* ============================================================
   FILE: js/main.js
   Wild Raven Refuge — site scripts
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. MOBILE NAV ---------- */
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');

  if (toggle && nav) {
    const closeNav = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeNav();
    });
  }

  /* ---------- 2. STICKY HEADER SHADOW ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- 3. SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (revealEls.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ---------- 4. STAT COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');

  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString('en-US') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      counters.forEach((el) => {
        el.textContent =
          parseInt(el.dataset.count, 10).toLocaleString('en-US') +
          (el.dataset.suffix || '');
      });
    } else {
      const counterObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              counterObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ---------- 5. IMAGE FALLBACK ---------- */
  /* If a remote photo fails to load, the wrapper gets a styled
     silhouette block instead of a broken-image icon. */
  document.querySelectorAll('[data-fallback]').forEach((wrap) => {
    const img = wrap.querySelector('img');
    if (!img) return;

    const fail = () => wrap.classList.add('img-fallback');

    if (img.complete && img.naturalWidth === 0) {
      fail();
    } else {
      img.addEventListener('error', fail, { once: true });
    }
  });

  /* ---------- 6. CURRENT YEAR ---------- */
  const year = new Date().getFullYear();
  document.querySelectorAll('.js-year').forEach((el) => {
    el.textContent = String(year);
  });

  /* ---------- 7. SMOOTH ANCHOR OFFSET ---------- */
  /* Native CSS scroll-padding handles this in modern browsers.
     This is a fallback for older Safari. */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      const supportsScrollPadding =
        'scrollPaddingTop' in document.documentElement.style;
      if (supportsScrollPadding) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });
})();
