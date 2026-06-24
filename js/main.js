document.addEventListener('DOMContentLoaded', () => {
  setupStickyNavbar();
  setupMobileDrawer();
  setupInteractiveSearch();
  setupNewsletter();
  setup3DTiltEngine();
  setupScrollRevealAndCounters();
  setupCustomCursor();
  setupThemeEngine();
  setupCatalogSearchAndFilters();
  setupDetailsPackageTabs();
  setupContactFormValidation();
  setupLoginFormValidation();
  setupLoginRegisterToggling();
  setupRegisterFormValidation();
  setupJobBoardProposals();
  setupEnterpriseForm();
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
    setTimeout(() => {
      window.location.href = `./pages/services.html?search=${encodeURIComponent(query)}`;
    }, 800);
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
  // 1. Interactive 3D Tilt Cards for both index & subpages
  const tiltCards = document.querySelectorAll(
    '.service-card-3d, .catalog-card-item, .profile-sidebar, .profile-section-card, ' +
    '.intro-left-card, .intro-right-card, .mv-card, .team-card, ' +
    '.contact-info-panel, .details-sidebar-pricing'
  );

  tiltCards.forEach(card => {
    // Dynamically match any child element containing "inner" (e.g. catalog-card-inner, mv-card-inner)
    const inner = card.querySelector('[class*="inner"]');
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

      // 3D rotation calculation (max tilt: 6 degrees for cleaner visuals)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;

      // Apply dynamic rotation transform
      inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
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
      // Format 24 -> "PKR 24M+"
      counterElement.textContent = `PKR ${currentValue}M+`;
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

    // Check if element or its ancestor is interactive (including subpage interactive elements)
    const interactive = target.closest(
      'a, button, input, textarea, select, [role="button"], .service-card-3d, .hero-graphic-card-3d, ' +
      '.social-link, .tag-link, .catalog-card-item, .portfolio-item-card, .mv-card, .team-card, ' +
      '.pricing-tab, .category-tab, .btn-card-profile, .btn-card-details, .coordinate-value'
    );
    if (interactive) {
      cursorDot.classList.add('hovered');
      cursorRing.classList.add('hovered');
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    const target = e.target;
    if (!target) return;

    const interactive = target.closest(
      'a, button, input, textarea, select, [role="button"], .service-card-3d, .hero-graphic-card-3d, ' +
      '.social-link, .tag-link, .catalog-card-item, .portfolio-item-card, .mv-card, .team-card, ' +
      '.pricing-tab, .category-tab, .btn-card-profile, .btn-card-details, .coordinate-value'
    );
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

/**
 * SERVICES PAGE: Real-Time Catalog Search & Category Filters
 */
function setupCatalogSearchAndFilters() {
  const searchInput = document.getElementById('catalog-search-input');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const catalogCards = document.querySelectorAll('.catalog-card-item');

  if (!searchInput && categoryTabs.length === 0 && catalogCards.length === 0) return;

  let activeCategory = 'all';
  let searchQuery = '';

  // Extract search parameter from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('search');
  if (queryParam) {
    searchQuery = queryParam.trim().toLowerCase();
    if (searchInput) {
      searchInput.value = queryParam;
    }
  }

  const filterCards = () => {
    let visibleCount = 0;
    catalogCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTags = card.getAttribute('data-tags') || '';
      const cardTitle = card.querySelector('.card-service-title')?.textContent || '';
      const cardDesc = card.querySelector('.card-service-desc')?.textContent || '';

      const searchContent = `${cardTags} ${cardTitle} ${cardDesc}`.toLowerCase();

      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

      // Splitting search query by spaces to match all words in any order, ignoring commas in content
      const matchesSearch = searchQuery === '' || (() => {
        const queryWords = searchQuery.split(/\s+/).filter(word => word.length > 0);
        return queryWords.every(word => searchContent.includes(word));
      })();

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        visibleCount++;
        // Force reflow and scale up for a smooth transition
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.classList.add('hidden');
      }
    });

    // Toggle No Results Message element
    const noResultsMsg = document.getElementById('no-results-message');
    if (noResultsMsg) {
      if (visibleCount === 0) {
        noResultsMsg.classList.remove('hidden');
      } else {
        noResultsMsg.classList.add('hidden');
      }
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterCards();
    });
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCategory = tab.getAttribute('data-category') || 'all';
      filterCards();
    });
  });

  // Run initial filter
  filterCards();
}

/**
 * SERVICE DETAILS PAGE: Interactive Packages Switching Tabs
 */
function setupDetailsPackageTabs() {
  const pricingTabs = document.querySelectorAll('.pricing-tab');
  const pricingContents = document.querySelectorAll('.pricing-tab-content');

  if (pricingTabs.length === 0) return;

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('active'));
      pricingContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const packageId = `package-${tab.getAttribute('data-package')}`;
      const contentToShow = document.getElementById(packageId);
      if (contentToShow) {
        contentToShow.classList.add('active');
      }
    });
  });
}

/**
 * CONTACT PAGE: Client-Side Field Validation Constraints
 */
function setupContactFormValidation() {
  const form = document.getElementById('apexlance-contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const setError = (input, errorSpanId, show = true) => {
    const errorSpan = document.getElementById(errorSpanId);
    if (show) {
      input.classList.add('input-error');
      if (errorSpan) errorSpan.classList.add('visible');
    } else {
      input.classList.remove('input-error');
      if (errorSpan) errorSpan.classList.remove('visible');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    let firstInvalidInput = null;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, 'error-name', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = nameInput;
    } else {
      setError(nameInput, 'error-name', false);
    }

    // Validate Email
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !emailRegex.test(emailValue)) {
      setError(emailInput, 'error-email', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else {
      setError(emailInput, 'error-email', false);
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      setError(subjectInput, 'error-subject', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = subjectInput;
    } else {
      setError(subjectInput, 'error-subject', false);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput, 'error-message', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = messageInput;
    } else {
      setError(messageInput, 'error-message', false);
    }

    if (!isValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      showNotification('❌ Please correct the errors in the form.', 'error');
    } else {
      showNotification('✨ Message sent successfully! Our support agents will contact you shortly.', 'success');
      form.reset();
    }
  });
}

/**
 * LOGIN PAGE: Credentials Field Validation Logic
 */
function setupLoginFormValidation() {
  const form = document.getElementById('apexlance-login-form');
  if (!form) return;

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  const setError = (input, errorSpanId, show = true) => {
    const errorSpan = document.getElementById(errorSpanId);
    if (show) {
      input.classList.add('input-error');
      if (errorSpan) errorSpan.classList.add('visible');
    } else {
      input.classList.remove('input-error');
      if (errorSpan) errorSpan.classList.remove('visible');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    let firstInvalidInput = null;

    // Validate Email
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !emailRegex.test(emailValue)) {
      setError(emailInput, 'error-login-email', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else {
      setError(emailInput, 'error-login-email', false);
    }

    // Validate Password
    if (!passwordInput.value.trim()) {
      setError(passwordInput, 'error-login-password', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = passwordInput;
    } else {
      setError(passwordInput, 'error-login-password', false);
    }

    if (!isValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      showNotification('❌ Please correct the errors in the form.', 'error');
    } else {
      showNotification('✨ Logged in successfully! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
    }
  });
}

/**
 * LOGIN PAGE: Toggle between Login and Register forms
 */
function setupLoginRegisterToggling() {
  const loginForm = document.getElementById('apexlance-login-form');
  const registerForm = document.getElementById('apexlance-register-form');
  const linkToRegister = document.getElementById('link-to-register');
  const linkToLogin = document.getElementById('link-to-login');
  const loginFooterNav = document.getElementById('login-footer-nav');
  const registerFooterNav = document.getElementById('register-footer-nav');
  const cardTitle = document.querySelector('.login-title');
  const cardSubtitle = document.querySelector('.login-subtitle');

  if (!loginForm || !registerForm || !linkToRegister || !linkToLogin) return;

  const showRegister = (e) => {
    if (e) e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    if (loginFooterNav) loginFooterNav.style.display = 'none';
    if (registerFooterNav) registerFooterNav.style.display = 'block';

    // Update headers
    if (cardTitle) cardTitle.innerHTML = 'Create <span class="gradient-text">Account</span>';
    if (cardSubtitle) cardSubtitle.textContent = 'Join the elite freelance marketplace today';

    // Clear form fields and validation styles
    resetFormErrors(loginForm);
    resetFormErrors(registerForm);
  };

  const showLogin = (e) => {
    if (e) e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    if (registerFooterNav) registerFooterNav.style.display = 'none';
    if (loginFooterNav) loginFooterNav.style.display = 'block';

    // Update headers
    if (cardTitle) cardTitle.innerHTML = 'Welcome <span class="gradient-text">Back</span>';
    if (cardSubtitle) cardSubtitle.textContent = 'Enter your credentials to access your expert dashboard';

    // Clear form fields and validation styles
    resetFormErrors(loginForm);
    resetFormErrors(registerForm);
  };

  linkToRegister.addEventListener('click', showRegister);
  linkToLogin.addEventListener('click', showLogin);
}

/**
 * Helper to clear input error classes and hide error messages
 */
function resetFormErrors(form) {
  if (!form) return;
  form.reset();
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.classList.remove('input-error');
  });
  const errorSpans = form.querySelectorAll('.field-error-message');
  errorSpans.forEach(span => {
    span.classList.remove('visible');
  });
}

/**
 * LOGIN PAGE: Registration Form Field Validation Logic
 */
function setupRegisterFormValidation() {
  const form = document.getElementById('apexlance-register-form');
  if (!form) return;

  const nameInput = document.getElementById('register-name');
  const emailInput = document.getElementById('register-email');
  const passwordInput = document.getElementById('register-password');
  const confirmInput = document.getElementById('register-confirm');
  const agreeTermsCheckbox = document.getElementById('agree-terms');

  const setError = (input, errorSpanId, show = true) => {
    const errorSpan = document.getElementById(errorSpanId);
    if (show) {
      input.classList.add('input-error');
      if (errorSpan) errorSpan.classList.add('visible');
    } else {
      input.classList.remove('input-error');
      if (errorSpan) errorSpan.classList.remove('visible');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    let firstInvalidInput = null;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, 'error-register-name', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = nameInput;
    } else {
      setError(nameInput, 'error-register-name', false);
    }

    // Validate Email
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue || !emailRegex.test(emailValue)) {
      setError(emailInput, 'error-register-email', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = emailInput;
    } else {
      setError(emailInput, 'error-register-email', false);
    }

    // Validate Password (min 6 characters)
    const passwordValue = passwordInput.value;
    if (!passwordValue || passwordValue.length < 6) {
      setError(passwordInput, 'error-register-password', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = passwordInput;
    } else {
      setError(passwordInput, 'error-register-password', false);
    }

    // Validate Confirm Password
    const confirmValue = confirmInput.value;
    if (!confirmValue || confirmValue !== passwordValue) {
      setError(confirmInput, 'error-register-confirm', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = confirmInput;
    } else {
      setError(confirmInput, 'error-register-confirm', false);
    }

    // Validate Terms checkbox
    if (!agreeTermsCheckbox.checked) {
      setError(agreeTermsCheckbox, 'error-agree-terms', true);
      isValid = false;
      if (!firstInvalidInput) firstInvalidInput = agreeTermsCheckbox;
    } else {
      setError(agreeTermsCheckbox, 'error-agree-terms', false);
    }

    if (!isValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      showNotification('❌ Please correct the errors in the registration form.', 'error');
    } else {
      showNotification('✨ Account created successfully! Logging you in...', 'success');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 2000);
    }
  });
}

/**
 * JOB BOARD: Submit Proposal Modal Interaction Logic
 */
function setupJobBoardProposals() {
  const applyBtns = document.querySelectorAll('.btn-apply-job');
  const modal = document.getElementById('proposal-modal');
  const closeBtn = document.getElementById('close-proposal-modal');
  const form = document.getElementById('proposal-form');
  const jobTitleInput = document.getElementById('proposal-job-title');

  if (!modal || !closeBtn || !form) return;

  applyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const jobName = btn.getAttribute('data-job') || '';
      jobTitleInput.value = jobName;

      const modalJobTitleSpan = modal.querySelector('.gradient-text');
      if (modalJobTitleSpan) {
        modalJobTitleSpan.textContent = 'Job Proposal';
      }

      modal.classList.add('active');
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
    document.body.style.overflow = ''; // Unlock scrolling
    form.reset();
  };

  closeBtn.addEventListener('click', closeModal);

  // Close modal when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('proposal-name').value.trim();
    const bid = document.getElementById('proposal-bid').value.trim();
    const duration = document.getElementById('proposal-duration').value.trim();

    showNotification(`✨ Proposal submitted successfully for "${jobTitleInput.value}"!`, 'success');
    closeModal();
  });
}

/**
 * ENTERPRISE PAGE: Consultation Form Submission Handler
 */
function setupEnterpriseForm() {
  const form = document.getElementById('enterprise-consult-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const company = document.getElementById('ent-company').value.trim();
    const name = document.getElementById('ent-name').value.trim();
    const email = document.getElementById('ent-email').value.trim();

    showNotification(`✨ Thank you, ${name}! Our Enterprise Account Manager will contact you at ${email} within 2 hours.`, 'success');
    form.reset();
  });
}
