/* ============================================================
   CoverCraft Studio – Shared JavaScript (shared.js)
   Handles: active nav, scroll-reveal, input polish, page init
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Active Nav Link ─────────────────────────────────── */
  function setActiveNav() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-bar a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentFile) {
        link.classList.add('active');
        // Remove any inline color override so CSS class wins
        link.style.removeProperty('color');
      }
    });
  }

  /* ── 2. Scroll-Reveal for cards / sections ──────────────── */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.card, .social-item, .hero-section, .contact-card, .app-card'
    );

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      targets.forEach(function (el) { el.style.opacity = '1'; });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // Stagger siblings that come into view together
            setTimeout(function () {
              entry.target.style.animationPlayState = 'running';
              entry.target.style.opacity = '1';
            }, i * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  /* ── 3. Input focus enhancement ────────────────────────── */
  function enhanceInputs() {
    document.querySelectorAll('input[type="text"], input[type="email"], select, textarea')
      .forEach(function (el) {
        // Highlight parent label on focus
        el.addEventListener('focus', function () {
          const label = el.closest('.form-group') && el.closest('.form-group').querySelector('label');
          if (label) label.style.color = 'var(--sage-dark)';
        });
        el.addEventListener('blur', function () {
          const label = el.closest('.form-group') && el.closest('.form-group').querySelector('label');
          if (label) label.style.color = '';
        });
      });
  }

  /* ── 4. File input label polish ────────────────────────── */
  function enhanceFileInputs() {
    document.querySelectorAll('input[type="file"]').forEach(function (input) {
      input.addEventListener('change', function () {
        const file = input.files[0];
        if (!file) return;
        const small = input.closest('.form-group') && input.closest('.form-group').querySelector('small');
        if (small) {
          small.textContent = '✔ ' + file.name;
          small.style.color = 'var(--sage-dark)';
        }
      });
    });
  }

  /* ── 5. Button ripple effect ────────────────────────────── */
  function addButtonRipples() {
    document.querySelectorAll('.btn, .btn-primary, .btn-accent').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect   = btn.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top  - size / 2;

        Object.assign(ripple.style, {
          position: 'absolute',
          width:    size + 'px',
          height:   size + 'px',
          top:      y + 'px',
          left:     x + 'px',
          background: 'rgba(255,255,255,0.25)',
          borderRadius: '50%',
          transform: 'scale(0)',
          animation: 'ripple 0.5s ease-out forwards',
          pointerEvents: 'none',
        });

        // Only add ripple if btn is positioned
        const pos = getComputedStyle(btn).position;
        if (pos === 'static') btn.style.position = 'relative';
        btn.style.overflow = 'hidden';

        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 600);
      });
    });

    // Inject keyframes once
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = '@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }';
      document.head.appendChild(style);
    }
  }

  /* ── 6. Smooth page body entrance ──────────────────────── */
  function pageEntrance() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.35s ease';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.style.opacity = '1';
      });
    });
  }

  /* ── 7. Generator page body padding ────────────────────── */
  function fixGeneratorPadding() {
    // project.html and project2.html have body padding already — ensure consistent
    const isGenerator = document.querySelector('.app-card');
    if (isGenerator) {
      document.body.style.padding = '1.5rem 1rem';
    }
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    pageEntrance();
    setActiveNav();
    enhanceInputs();
    enhanceFileInputs();
    addButtonRipples();
    fixGeneratorPadding();

    // Scroll reveal after a short delay so CSS animations don't conflict
    setTimeout(initScrollReveal, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
