/* T4 Series Taiwan — script.js */

/* ══════════════════════════════════════
   NAV — inject "賽事" link into all pages
   (runs before DOMContentLoaded so it's
   seamless; inserted between 訓練 and Nations Cup)
══════════════════════════════════════ */
(function injectRaceNav() {
  function inject() {
    const currentPage = location.pathname.split('/').pop() || 'index.html';

    /* ── Desktop nav ── */
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      const academyLink = Array.from(navLinks.querySelectorAll('a'))
        .find(a => a.getAttribute('href') === 'academy.html');
      if (academyLink && !navLinks.querySelector('a[href="race.html"]')) {
        const raceLink = document.createElement('a');
        raceLink.href = 'race.html';
        raceLink.textContent = '賽事';
        if (currentPage === 'race.html') raceLink.classList.add('active');
        academyLink.insertAdjacentElement('afterend', raceLink);
      }
    }

    /* ── Mobile nav ── */
    const mobileNav = document.querySelector('.nav-mobile');
    if (mobileNav) {
      const mAcademy = Array.from(mobileNav.querySelectorAll('a'))
        .find(a => a.getAttribute('href') === 'academy.html');
      if (mAcademy && !mobileNav.querySelector('a[href="race.html"]')) {
        const mRace = document.createElement('a');
        mRace.href = 'race.html';
        mRace.textContent = '賽事 Race';
        mAcademy.insertAdjacentElement('afterend', mRace);
      }
    }

    /* ── Footer Quick Links ── */
    document.querySelectorAll('.footer-col a[href="academy.html"]').forEach(a => {
      if (!a.parentElement.querySelector('a[href="race.html"]')) {
        const fRace = document.createElement('a');
        fRace.href = 'race.html';
        fRace.textContent = '賽事';
        a.insertAdjacentElement('afterend', fRace);
      }
    });

    /* ── Footer 費用 column — add T4 RACE ── */
    document.querySelectorAll('.footer-col a[href="contact.html"]').forEach(a => {
      if (a.textContent.includes('T4 CLUB') &&
          !a.parentElement.querySelector('a[href="race.html#race"]')) {
        const fRacePrice = document.createElement('a');
        fRacePrice.href = 'race.html#race';
        fRacePrice.textContent = 'T4 RACE — NT$10,000~';
        a.insertAdjacentElement('afterend', fRacePrice);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

/* ══════════════════════════════════════
   HAMBURGER
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', function () {
      this.classList.toggle('open');
      navMobile.classList.toggle('open');
    });
    // close on link click
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navMobile.classList.remove('open');
      });
    });
  }

  /* ── Navbar scroll ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    function onScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════════════════════════════════
     REVEAL ANIMATIONS
  ══════════════════════════════════════ */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ══════════════════════════════════════
     COUNTER ANIMATION
  ══════════════════════════════════════ */
  document.querySelectorAll('.stat-num[data-count]').forEach(function (el) {
    const target = parseInt(el.dataset.count);
    const duration = 1800;
    const start = performance.now();
    const observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  /* ══════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navh = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--navh')) || 64;
      window.scrollTo({ top: target.offsetTop - navh - 8, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════
     FAQ ACCORDION + CATEGORY FILTER
  ══════════════════════════════════════ */
  /* Category buttons */
  document.querySelectorAll('.faq-cat-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.faq-cat-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
      const cat = this.dataset.cat;
      document.querySelectorAll('.faq-group').forEach(function (g) {
        g.classList.toggle('active', g.dataset.cat === cat || cat === 'all');
      });
    });
  });

  /* Accordion items */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');

      // close others in same group
      const group = item.closest('.faq-group') || document;
      group.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Activate first FAQ category by default
  const firstCatBtn = document.querySelector('.faq-cat-btn');
  if (firstCatBtn) firstCatBtn.click();

}); // end DOMContentLoaded
