(function () {
  'use strict';

  // ── Banner dismiss ──
  var banner = document.getElementById('nlp-banner');
  var bannerClose = document.getElementById('nlp-banner-close');
  if (bannerClose && banner) {
    bannerClose.addEventListener('click', function () {
      banner.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
      banner.style.overflow = 'hidden';
      banner.style.opacity = '0';
      banner.style.maxHeight = '0';
      setTimeout(function () { banner.remove(); }, 320);
    });
  }

  // ── Mobile nav toggle ──
  var toggle = document.getElementById('nlp-nav-toggle');
  var mobileNav = document.getElementById('nlp-mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!mobileNav.contains(e.target) && !toggle.contains(e.target)) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Smooth scroll for anchor links with sticky header offset ──
  var header = document.querySelector('.nlp-header');
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = header ? header.offsetHeight + 12 : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  // ── Topic filter ──
  var filterBtns = document.querySelectorAll('.nlp-filter-btn');
  var cards = document.querySelectorAll('.nlp-grid .nlp-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.dataset.filter;
      cards.forEach(function (card) {
        var topic = card.dataset.topic || 'all';
        var show = filter === 'all' || topic === filter;
        card.hidden = !show;
      });

      // After filtering, reset load-more visibility
      updateLoadMore();
    });
  });

  // ── Load more (simple: reveal hidden cards in batches) ──
  var BATCH = 3;
  var loadMoreBtn = document.getElementById('nlp-load-more');
  var hiddenByLoadMore = [];

  function initLoadMore() {
    // Hide all cards beyond initial visible set (featured + first 5 standard)
    var allCards = Array.from(document.querySelectorAll('.nlp-grid .nlp-card'));
    var standard = allCards.filter(function (c) { return !c.classList.contains('nlp-card--featured'); });
    hiddenByLoadMore = standard.slice(5);
    hiddenByLoadMore.forEach(function (c) { c.setAttribute('data-hidden-by-loadmore', '1'); c.hidden = true; });
    updateLoadMore();
  }

  function updateLoadMore() {
    if (!loadMoreBtn) return;
    var remaining = hiddenByLoadMore.filter(function (c) { return c.getAttribute('data-hidden-by-loadmore') === '1'; });
    loadMoreBtn.parentElement.style.display = remaining.length ? '' : 'none';
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      var toShow = hiddenByLoadMore.filter(function (c) { return c.getAttribute('data-hidden-by-loadmore') === '1'; }).slice(0, BATCH);
      toShow.forEach(function (c) {
        c.removeAttribute('data-hidden-by-loadmore');
        c.hidden = false;
      });
      updateLoadMore();
    });
    initLoadMore();
  }

})();
