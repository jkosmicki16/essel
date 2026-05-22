/* Workshop Landing Page — Vanilla JS */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Mobile Nav Toggle
     ------------------------------------------------------------------ */
  var toggle = document.getElementById('wlp-nav-toggle');
  var menu = document.getElementById('wlp-nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------
     Smooth Scroll for anchor links
     ------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      // Account for sticky nav height
      var nav = document.getElementById('wlp-nav');
      var banner = document.querySelector('.wlp-announcement-banner');
      var offset = (nav ? nav.offsetHeight : 0) + (banner ? banner.offsetHeight : 0) + 16;

      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });

      // Close mobile menu if open
      if (menu) {
        menu.classList.remove('is-open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ------------------------------------------------------------------
     Announcement Banner dismiss
     ------------------------------------------------------------------ */
  var bannerClose = document.querySelector('.wlp-announcement-banner__close');
  var banner = document.querySelector('.wlp-announcement-banner');

  if (bannerClose && banner) {
    bannerClose.addEventListener('click', function () {
      banner.style.maxHeight = banner.offsetHeight + 'px';
      requestAnimationFrame(function () {
        banner.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
        banner.style.maxHeight = '0';
        banner.style.opacity = '0';
        banner.style.overflow = 'hidden';
      });
      banner.addEventListener('transitionend', function () {
        banner.style.display = 'none';
      }, { once: true });
    });
  }

  /* ------------------------------------------------------------------
     Sticky nav shadow on scroll
     ------------------------------------------------------------------ */
  var nav = document.getElementById('wlp-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        nav.classList.add('wlp-nav--scrolled');
      } else {
        nav.classList.remove('wlp-nav--scrolled');
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Intersection Observer — fade-in sections on scroll
     ------------------------------------------------------------------ */
  if ('IntersectionObserver' in window) {
    var fadeEls = document.querySelectorAll('.wlp-fade-in');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('wlp-fade-in--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show everything
    document.querySelectorAll('.wlp-fade-in').forEach(function (el) {
      el.classList.add('wlp-fade-in--visible');
    });
  }

})();
