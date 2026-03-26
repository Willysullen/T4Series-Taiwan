document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const tick = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav  = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.dataset.delay) || 0;
          setTimeout(() => el.classList.add('visible'), delay);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  }
  const ladderContainer = document.querySelector('.ladder-steps');
  if (ladderContainer) {
    const ladderObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const steps = entry.target.querySelectorAll('.ladder-step');
          steps.forEach((step, i) => {
            setTimeout(() => {
              step.classList.add('animate');
              const valEl = step.querySelector('.step-target-val[data-target]');
              if (valEl) scrambleText(valEl, valEl.dataset.target);
            }, i * 240);
          });
          ladderObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    ladderObs.observe(ladderContainer);
  }
  function scrambleText(el, finalText) {
    const chars = '0123456789:';
    let frame = 0, total = 22;
    const iv = setInterval(() => {
      if (frame >= total) { el.textContent = finalText; clearInterval(iv); return; }
      el.textContent = finalText.split('').map((c, i) => {
        if (c === ':') return ':';
        if (frame > (total - i * 4)) return c;
        return chars[Math.floor(Math.random() * (chars.length - 1))];
      }).join('');
      frame++;
    }, 38);
  }
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          if (isNaN(target)) return;
          const start = performance.now();
          const raf = (now) => {
            const p = Math.min((now - start) / 1500, 1);
            el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);
          countObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));
  }
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;
    btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('open');
        const fa = fi.querySelector('.faq-a');
        if (fa) fa.style.maxHeight = null;
      });
      if (!open) { item.classList.add('open'); ans.style.maxHeight = ans.scrollHeight + 'px'; }
    });
  });
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.cat;
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.faq-group').forEach(g => {
        g.classList.toggle('active', g.dataset.cat === t);
      });
    });
  });
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
    marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
  }
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ 已送出！我們將盡快聯絡您';
      btn.disabled = true;
      btn.style.background = '#198754';
      btn.style.borderColor = '#198754';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.borderColor = '';
        form.reset();
      }, 4500);
    });
  }
});
