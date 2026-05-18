/* ===========================
   SHOP HẠT GIỐNG RAU XANH
   scripts/main.js – Core interactions
=========================== */

(function () {
  'use strict';

  /* ===========================
     NAVBAR: STICKY + SCROLL EFFECT
  =========================== */
  var navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();


  /* ===========================
     MOBILE MENU
  =========================== */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileOverlay = document.getElementById('mobileOverlay');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.style.display = 'none';
    document.body.style.overflow = '';
    if (hamburger) {
      var spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
        var spans = this.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  var mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });


  /* ===========================
     SMOOTH SCROLL FOR NAV LINKS
  =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navbarHeight = navbar ? navbar.offsetHeight : 0;
      var targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    });
  });


  /* ===========================
     PRODUCT IMAGE GALLERY
  =========================== */
  var mainImg = document.getElementById('mainProductImg');
  var thumbItems = document.querySelectorAll('.thumb-item');

  function switchImage(newSrc, clickedThumb) {
    if (!mainImg) return;
    mainImg.classList.add('fade-out');
    setTimeout(function () {
      mainImg.src = newSrc;
      mainImg.onload = function () { mainImg.classList.remove('fade-out'); };
      if (mainImg.complete) mainImg.classList.remove('fade-out');
    }, 300);

    thumbItems.forEach(function (t) { t.classList.remove('active'); });
    if (clickedThumb) clickedThumb.classList.add('active');
  }

  thumbItems.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      var imgSrc = this.dataset.img;
      if (imgSrc && imgSrc !== mainImg.src) {
        switchImage(imgSrc, this);
      }
    });
  });


  /* ===========================
     COMBO SELECTOR – update prices dynamically
  =========================== */
  var comboItems = document.querySelectorAll('.combo-item');
  var currentPriceEl  = document.getElementById('currentPrice');
  var originalPriceEl = document.getElementById('originalPrice');
  var discountBadgeEl = document.getElementById('discountBadge');
  var btnOrderPriceEl = document.getElementById('btnOrderPrice');
  var selectedCombo = { count: 10, price: '150.000đ' };

  function updatePriceDisplay(price, original, discount) {
    if (currentPriceEl)  currentPriceEl.textContent  = price;
    if (originalPriceEl) originalPriceEl.textContent = original;
    if (discountBadgeEl) discountBadgeEl.textContent = discount;
    if (btnOrderPriceEl) btnOrderPriceEl.textContent = price;
  }

  comboItems.forEach(function (item) {
    item.addEventListener('click', function () {
      comboItems.forEach(function (c) { c.classList.remove('active'); });
      this.classList.add('active');
      selectedCombo.count = parseInt(this.dataset.combo, 10);
      selectedCombo.price = this.dataset.price;
      updatePriceDisplay(this.dataset.price, this.dataset.original, this.dataset.discount);
    });
  });


  /* ===========================
     SCROLL-TRIGGERED FADE-IN ANIMATIONS
  =========================== */
  var fadeEls = document.querySelectorAll('.fade-in');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(function (el) { observer.observe(el); });


  /* ===========================
     SCROLL TO TOP BUTTON
  =========================== */
  var scrollTopBtn = document.getElementById('scrollTop');

  function handleScrollTop() {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  if (scrollTopBtn) {
    window.addEventListener('scroll', handleScrollTop, { passive: true });
    handleScrollTop();
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ===========================
     COUNTER ANIMATION FOR STATS
  =========================== */
  var statNumbers = document.querySelectorAll('.stat-number');
  var countersStarted = false;

  function animateCounter(el, target, suffix, duration) {
    var start = 0;
    var startTime = null;
    var isFloat = target % 1 !== 0;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (target - start) * eased;
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('vi-VN')) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    var data = [
      { el: statNumbers[0], target: 95, suffix: '%', duration: 1800 },
      { el: statNumbers[1], target: 10000, suffix: '+', duration: 2000 },
      { el: statNumbers[2], target: 4.9, suffix: '/5', duration: 1600 },
      { el: statNumbers[3], target: 0, suffix: 'Free', duration: 0 }
    ];
    data.forEach(function (item) {
      if (!item.el) return;
      if (item.target === 0) { item.el.textContent = item.suffix; return; }
      animateCounter(item.el, item.target, item.suffix, item.duration);
    });
  }

  var statsSection = document.getElementById('stats');
  if (statsSection) {
    var statsObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        startCounters();
        statsObserver.disconnect();
      }
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }


  /* ===========================
     GALLERY LIGHTBOX
  =========================== */
  var galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      if (!img) return;
      openLightbox(img.src, img.alt);
    });
  });

  function openLightbox(src, alt) {
    var lb = document.createElement('div');
    lb.style.cssText = [
      'position:fixed;inset:0;z-index:3000;',
      'background:rgba(0,0,0,0.9);',
      'display:flex;align-items:center;justify-content:center;',
      'cursor:zoom-out;padding:20px;'
    ].join('');

    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.style.cssText = [
      'max-width:90vw;max-height:88vh;',
      'border-radius:12px;',
      'box-shadow:0 24px 60px rgba(0,0,0,0.6);',
      'object-fit:contain;'
    ].join('');

    var closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeBtn.style.cssText = [
      'position:absolute;top:20px;right:20px;',
      'width:44px;height:44px;',
      'background:rgba(255,255,255,0.15);',
      'border:none;border-radius:50%;',
      'color:white;font-size:1.2rem;',
      'cursor:pointer;',
      'display:flex;align-items:center;justify-content:center;'
    ].join('');

    lb.appendChild(img);
    lb.appendChild(closeBtn);
    document.body.appendChild(lb);
    document.body.style.overflow = 'hidden';

    function closeLb() {
      lb.remove();
      document.body.style.overflow = '';
    }

    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    closeBtn.addEventListener('click', closeLb);
    document.addEventListener('keydown', function escLb(e) {
      if (e.key === 'Escape') { closeLb(); document.removeEventListener('keydown', escLb); }
    });
  }


  /* ===========================
     ACTIVE NAV LINK ON SCROLL
  =========================== */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-menu a');

  function updateActiveNav() {
    var scrollPos = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 80;
    sections.forEach(function (sec) {
      var top = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      var id = sec.id;
      navLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) {
          if (scrollPos >= top && scrollPos < bottom) {
            link.style.background = 'var(--green-soft)';
            link.style.color = 'var(--green-primary)';
          } else {
            link.style.background = '';
            link.style.color = '';
          }
        }
      });
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  /* ===========================
     INIT
  =========================== */
  handleNavbarScroll();
  handleScrollTop();
  updateActiveNav();

})();
