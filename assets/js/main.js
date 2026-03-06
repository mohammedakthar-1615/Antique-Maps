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