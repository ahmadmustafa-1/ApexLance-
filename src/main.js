document.addEventListener('DOMContentLoaded', () => {
  setupStickyNavbar();
  setupMobileDrawer();
  setupInteractiveSearch();
  setupNewsletter();
  setup3DTiltEngine();
  setupScrollRevealAndCounters();
  setupCustomCursor();
  setupThemeEngine();
});

/**
 * Adds a blurred backdrop background and border to the navbar when the user scrolls down.
 */
function setupStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * Manages opening, closing, and closing-interactions (outside clicks, escape key) of the mobile menu.
 */
function setupMobileDrawer() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  
  if (!menuToggle || !mobileDrawer) return;

  const toggleMenu = () => {
    menuToggle.classList.toggle('active');
    mobileDrawer.classList.toggle('active');
    document.body.style.overflow = mobileDrawer.classList.contains('active') ? 'hidden' : '';
  };

  const closeMenu = () => {
    menuToggle.classList.remove('active');
    mobileDrawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', toggleMenu);

  const drawerLinks = mobileDrawer.querySelectorAll('.drawer-link');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (
      mobileDrawer.classList.contains('active') &&
      !mobileDrawer.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      closeMenu();
    }
  });
}

/**
 * Prevents default submit and simulates search responses.
 */
function setupInteractiveSearch() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');

  if (!searchForm || !searchInput) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    showNotification(`Searching ApexLance for: "${query}"...`, 'info');
  });
}

/**
 * Handles newsletter subscription and displays success state.
 */
function setupNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.newsletter-input');
    const email = input.value.trim();

    if (email) {
      showNotification('✨ Thank you for subscribing! Check your inbox soon.', 'success');
      input.value = '';
    }
  });
}

/**
 * 3D TILT ENGINE
 * Calculates card boundaries relative to the viewport, applies perspective pitch and yaw rotation,
 * and sets mouse percentage CSS variables for cursor-following gradient border lights.
 */
function setup3DTiltEngine() {
  // 1. Featured Service Cards 3D Tilt
  const serviceCards = document.querySelectorAll('.service-card-3d');
  
  serviceCards.forEach(card => {
    const inner = card.querySelector('.card-inner-3d');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert coordinates to percentages for card shine gradients
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${xPercent}%`);
      card.style.setProperty('--mouse-y', `${yPercent}%`);

      // 3D rotation calculation (max tilt: 10 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * 10;

      // Apply dynamic rotation transform
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Smooth reset on mouse leave
    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // 2. Hero Graphic Card 3D Tilt
  const heroCard = document.getElementById('hero-tilt-card');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      heroCard.style.setProperty('--mouse-x', `${xPercent}%`);
      heroCard.style.setProperty('--mouse-y', `${yPercent}%`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 8; // Max 8 degrees tilt
      const rotateY = ((x - centerX) / centerX) * 8;

      heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }
}

/**
 * VIEWPORT INTERSECTION OBSERVER & COUNTER ANIMATION ENGINE
 * Observes elements marked as 'reveal-on-scroll' and fires scroll-revel class updates.
 * For numeric stats, triggers a dynamic rolling counter from 0 to target.
 */
function setupScrollRevealAndCounters() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // If this entry contains stat-numbers, trigger counter animation
        const counters = entry.target.querySelectorAll('.stat-number');
        if (counters.length > 0) {
          counters.forEach(counter => {
            if (!counter.classList.contains('counted')) {
              animateCounter(counter);
            }
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // Reveal slightly before it enters fully
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Animated rolling number counter
 * @param {HTMLElement} counterElement 
 */
function animateCounter(counterElement) {
  counterElement.classList.add('counted');
  const target = parseInt(counterElement.getAttribute('data-target'), 10);
  if (isNaN(target)) return;

  const duration = 2000; // 2 seconds animation
  const startTime = performance.now();

  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease-out cubic curve
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(easeProgress * target);

    // Format metrics visually
    if (target === 15000) {
      // Format 15000 -> "15K+"
      const formatted = (currentValue / 1000).toFixed(currentValue >= 10000 ? 0 : 1);
      counterElement.textContent = `${formatted}K+`;
    } else if (target === 99) {
      // Format 99 -> "99.2%"
      // Interpolate fractional success
      const fractionalValue = (easeProgress * 99.2).toFixed(1);
      counterElement.textContent = `${fractionalValue}%`;
    } else if (target === 24) {
      // Format 24 -> "$24M+"
      counterElement.textContent = `$${currentValue}M+`;
    } else {
      counterElement.textContent = currentValue;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

/**
 * Utility to display a beautiful modern notification banner at the top of the viewport.
 */
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.apex-notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `apex-notification ${type}`;
  notification.textContent = message;

  // Add styles dynamically to keep design encapsulated
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%) translateY(-20px)',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '0.95rem',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: '600',
    color: '#fff',
    backgroundColor: type === 'success' ? '#6366f1' : '#a78bfa',
    boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(99, 102, 241, 0.25)',
    border: '1px solid ' + (type === 'success' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(167, 139, 250, 0.3)'),
    zIndex: '1000',
    opacity: '0',
    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    pointerEvents: 'none'
  });

  document.body.appendChild(notification);

  // Force reflow
  notification.offsetHeight;

  // Fade and slide in
  notification.style.transform = 'translateX(-50%) translateY(0)';
  notification.style.opacity = '1';

  // Slide out after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(-50%) translateY(-20px)';
    notification.style.opacity = '0';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/**
 * CUSTOM CURSOR ENGINE
 * Tracks desktop mouse position, interpolates outer ring with spring physics (lerp),
 * and manages visual hover and click feedback classes.
 */
function setupCustomCursor() {
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (!cursorDot || !cursorRing) return;

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let hasMoved = false;

  // Track position
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!hasMoved) {
      hasMoved = true;
      cursorDot.classList.add('visible');
      cursorRing.classList.add('visible');
      // Snap ring initially so it doesn't fly in from offscreen
      ringX = mouseX;
      ringY = mouseY;
    }
  });

  // Smooth follow update loop
  const tick = () => {
    if (hasMoved) {
      // Linear interpolation (lerp) for smooth trailing delay
      const ease = 0.15;
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      // Translate positioning anchors
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  // Hover states using event delegation on document.body
  document.body.addEventListener('mouseover', (e) => {
    const target = e.target;
    if (!target) return;
    
    // Check if element or its ancestor is interactive
    const interactive = target.closest('a, button, input, textarea, select, [role="button"], .service-card-3d, .hero-graphic-card-3d, .social-link, .tag-link');
    if (interactive) {
      cursorDot.classList.add('hovered');
      cursorRing.classList.add('hovered');
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target) return;
    
    const interactive = target.closest('a, button, input, textarea, select, [role="button"], .service-card-3d, .hero-graphic-card-3d, .social-link, .tag-link');
    // Ensure we are fully exiting the interactive element
    if (interactive && (!e.relatedTarget || !interactive.contains(e.relatedTarget))) {
      cursorDot.classList.remove('hovered');
      cursorRing.classList.remove('hovered');
    }
  });

  // Click physics
  window.addEventListener('mousedown', () => {
    cursorDot.classList.add('clicked');
    cursorRing.classList.add('clicked');
  });

  window.addEventListener('mouseup', () => {
    cursorDot.classList.remove('clicked');
    cursorRing.classList.remove('clicked');
  });

  // Document boundaries
  document.addEventListener('mouseleave', () => {
    cursorDot.classList.remove('visible');
    cursorRing.classList.remove('visible');
    hasMoved = false;
  });
}

/**
 * THEME ENGINE (SLIGHT ADJUSTMENT)
 * Toggles a slightly lighter variant of the Lavender theme.
 * Persists choice via localStorage.
 */
function setupThemeEngine() {
  const toggleBtn = document.getElementById('theme-toggle');
  const mobileToggleBtn = document.getElementById('theme-toggle-mobile');

  // Retrieve theme preference or default to dark
  const currentTheme = localStorage.getItem('apex-theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  const toggleTheme = () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('apex-theme', isLight ? 'light' : 'dark');
    showNotification(
      isLight ? '🌓 Switched to Soft Light Theme' : '✨ Switched to Slate Dark Theme',
      'info'
    );
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleTheme);
  }
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', toggleTheme);
  }
}
