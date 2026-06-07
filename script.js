// ProBuild Master Inc. — Main Script

// ============================================
// NAVBAR — scroll effect & mobile toggle
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openMenu() {
  hamburger.classList.add('active');
  navLinks.classList.add('open');
  navOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('active');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  toggleScrollTop();
});

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ============================================
// ACTIVE NAV LINK on scroll
// ============================================
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

// ============================================
// SCROLL TO TOP
// ============================================
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTop() {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
}

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// ANIMATE ON SCROLL (IntersectionObserver)
// ============================================
const animateEls = document.querySelectorAll('[data-animate]');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('animated');
      }, parseInt(delay));
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(el => animObserver.observe(el));

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const counters = document.querySelectorAll('.stat-num[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target, 1800);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ============================================
// CONTACT FORM SUBMISSION — Formspree
// ============================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

// Replace YOUR_FORM_ID below with the Formspree form ID (e.g. "xpwzqabk")
const FORMSPREE_ID = 'xbdwezkw';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;width:18px;height:18px;"></span> Sending...';

    try {
      const data = new FormData(contactForm);
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = 'Send My Request <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      alert('Something went wrong. Please try calling us directly at (437) 477-9438.');
    }
  });
}

// Spin keyframe via JS
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);

// ============================================
// BEFORE / AFTER IMAGE SLIDERS
// ============================================
function initSlider(sliderId) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;

  const before = slider.querySelector('.ba-before');
  const beforeImg = before.querySelector('img');
  const handle = slider.querySelector('.ba-handle');
  let isDragging = false;
  let currentPos = 0.5;

  function setPosition(pos) {
    pos = Math.max(0.04, Math.min(0.96, pos));
    currentPos = pos;
    before.style.width = (pos * 100) + '%';
    handle.style.left = (pos * 100) + '%';
    // Scale the image inversely so it always shows correctly
    beforeImg.style.width = (100 / pos) + '%';
    slider.style.setProperty('--ratio', pos);
  }

  function getPos(e) {
    const rect = slider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return (clientX - rect.left) / rect.width;
  }

  slider.addEventListener('mousedown', (e) => { isDragging = true; setPosition(getPos(e)); e.preventDefault(); });
  slider.addEventListener('touchstart', (e) => { isDragging = true; setPosition(getPos(e)); }, { passive: true });

  window.addEventListener('mousemove', (e) => { if (isDragging) setPosition(getPos(e)); });
  window.addEventListener('touchmove', (e) => { if (isDragging) setPosition(getPos(e)); }, { passive: true });

  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('touchend', () => { isDragging = false; });

  // Animate the initial reveal on first scroll into view
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let pos = 0.98;
        const target = 0.5;
        const step = () => {
          pos = pos - 0.018;
          setPosition(pos);
          if (pos > target) requestAnimationFrame(step);
        };
        setTimeout(() => requestAnimationFrame(step), 400);
        revealObserver.unobserve(slider);
      }
    });
  }, { threshold: 0.3 });
  revealObserver.observe(slider);

  // Init at 98% (almost all before) so the animation sweeps left
  setPosition(0.98);
}

initSlider('slider1');
initSlider('slider2');
initSlider('slider3');

// ============================================
// SMOOTH ANCHOR OFFSET (accounts for navbar height)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = navbar ? navbar.offsetHeight : 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ============================================
// CLOSE MOBILE MENU ON OUTSIDE CLICK
// ============================================
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});
