// Interactive Elements & Utilities

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Animations (Intersection Observer)
  const faders = document.querySelectorAll('.fade-in');

  const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // 2. Dark Mode State Persistence
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  updateThemeIcon();

  // 3. Direction State Persistence
  if (localStorage.getItem('dir') === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }
  updateDirIcon();

  // 4. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }
  // 5. Move theme/dir toggles into mobile sidebar at very small widths (<=360px)
  function moveTogglesForSmallScreens() {
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    if (!navMenu || !navActions) return;
    const existing = navMenu.querySelector('.mobile-controls');
    if (window.innerWidth <= 360) {
      if (!existing) {
        const li = document.createElement('li');
        li.className = 'mobile-controls';
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.gap = '8px';

        const dirBtn = navActions.querySelector('.dir-toggle-btn');
        const themeBtn = navActions.querySelector('.toggle-btn:not(.dir-toggle-btn)');

        if (dirBtn) li.appendChild(dirBtn.cloneNode(true));
        if (themeBtn) li.appendChild(themeBtn.cloneNode(true));

        // Insert at top of nav menu so it appears in the sidebar
        navMenu.insertBefore(li, navMenu.firstChild);
        // Update icons/state for newly inserted buttons
        updateThemeIcon();
        updateDirIcon();
      }
    } else {
      if (existing) existing.remove();
    }
  }

  // Run on load and on resize (debounced)
  moveTogglesForSmallScreens();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(moveTogglesForSmallScreens, 150);
  });
  // Password visibility toggles (attached after DOM load)
  const pwdToggles = document.querySelectorAll('.password-toggle');
  pwdToggles.forEach(btn => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    if (!input) return;
    // initialize button state
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', 'Show password');
    btn.addEventListener('click', () => {
      const currentlyHidden = input.type === 'password';
      input.type = currentlyHidden ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(currentlyHidden));
      btn.setAttribute('aria-label', currentlyHidden ? 'Hide password' : 'Show password');
      btn.innerHTML = currentlyHidden ? '🙈' : '👁';
    });
  });
  // Role selector: persist selection and toggle admin-only UI
  const roleSelect = document.getElementById('role-select');
  function applyRole(role) {
    if (role === 'admin') {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      const role = e.target.value;
      applyRole(role);
      localStorage.setItem('role', role);
    });
  }
  const savedRole = localStorage.getItem('role') || 'user';
  applyRole(savedRole);
  if (roleSelect) roleSelect.value = savedRole;
});

function toggleDark() {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.querySelector('.toggle-btn:not(.dir-toggle-btn)');
  if (btn) {
    if (document.body.classList.contains('dark')) {
      btn.innerHTML = '☀️'; // Sun icon for light mode switch
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      btn.innerHTML = '🌙'; // Moon icon for dark mode switch
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

function toggleDir() {
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', newDir);
  localStorage.setItem('dir', newDir);
  updateDirIcon();
}

function updateDirIcon() {
  const btns = document.querySelectorAll('.dir-toggle-btn');
  const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
  btns.forEach(btn => {
    btn.innerHTML = currentDir === 'ltr' ? 'LTR' : 'RTL';
  });
}