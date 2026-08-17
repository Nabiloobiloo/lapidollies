/* LAPIDOLLIES — portfolio interactions. No dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Year ---- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Sticky header state ---- */
  var head = document.getElementById('siteHead');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('siteNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Active section in nav ---- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + entry.target.id));
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Reveal on scroll ---- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---- Dialog helpers (graceful when <dialog> is unsupported) ---- */
  function openDialog(dlg) {
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    document.documentElement.style.overflow = 'hidden';
  }
  function closeDialog(dlg) {
    if (typeof dlg.close === 'function' && dlg.open) dlg.close();
    else dlg.removeAttribute('open');
    document.documentElement.style.overflow = '';
  }
  Array.prototype.slice.call(document.querySelectorAll('dialog')).forEach(function (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg || e.target.closest('[data-close]')) closeDialog(dlg);
    });
    dlg.addEventListener('close', function () { document.documentElement.style.overflow = ''; });
  });

  /* ---- Character profile modal ---- */
  var modal = document.getElementById('dollieModal');
  var modalBody = document.getElementById('dollieModalBody');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function buildProfile(card) {
    var detail = card.querySelector('.dollie-detail');
    if (!detail) return '';
    var traits = [];
    try { traits = JSON.parse(detail.getAttribute('data-traits') || '[]'); } catch (err) { traits = []; }

    var img = detail.getAttribute('data-img');
    var art = img
      ? '<div class="modal-art"><img src="' + esc(img) + '" alt="' + esc(detail.getAttribute('data-alt') || '') + '"></div>'
      : '<div class="modal-art modal-art--secret">' +
        '<div class="secret-seal"><svg aria-hidden="true" style="width:76px;height:76px;color:#7d6ea1"><use href="#i-prism"></use></svg>' +
        '<p>Super Rare Secret</p><small>Artwork withheld from the public portfolio.</small></div></div>';

    var rows = traits.map(function (t) {
      return '<div><dt>' + esc(t[0]) + '</dt><dd>' + t[1] + '</dd></div>';
    }).join('');

    return art +
      '<div class="modal-text">' +
        '<p class="eyebrow">' + esc(detail.getAttribute('data-gem') || '') + ' Dollie</p>' +
        '<h2 class="dollie-name">' + esc(detail.getAttribute('data-name') || '') + '</h2>' +
        '<p class="dollie-role script">' + esc(detail.getAttribute('data-role') || '') + '</p>' +
        '<div class="profile">' + detail.innerHTML + '</div>' +
        (rows ? '<dl>' + rows + '</dl>' : '') +
        '<blockquote><span>Collector card line</span>' + esc(detail.getAttribute('data-card') || '') + '</blockquote>' +
      '</div>';
  }

  if (modal && modalBody) {
    Array.prototype.slice.call(document.querySelectorAll('[data-dollie]')).forEach(function (card) {
      card.addEventListener('click', function () {
        modalBody.innerHTML = buildProfile(card);
        modal.style.setProperty('--gem', card.style.getPropertyValue('--gem'));
        modal.style.setProperty('--gem-deep', card.style.getPropertyValue('--gem-deep'));
        modal.style.setProperty('--gem-wash', card.style.getPropertyValue('--gem-wash'));
        modal.style.setProperty('--art-bg', card.style.getPropertyValue('--art-bg'));
        openDialog(modal);
      });
    });
  }

  /* ---- Deck page lightbox ---- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCap = document.getElementById('lightboxCap');
  if (lightbox && lightboxImg) {
    Array.prototype.slice.call(document.querySelectorAll('[data-zoom]')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var inner = btn.querySelector('img');
        lightboxImg.src = btn.getAttribute('data-zoom');
        lightboxImg.alt = inner ? inner.alt : '';
        if (lightboxCap) lightboxCap.textContent = btn.getAttribute('data-caption') || '';
        openDialog(lightbox);
      });
    });
  }
})();
