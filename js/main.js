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
  setupDynamicServiceDetails();
  setupDynamicProfileDetails();
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

  // Extract category and search parameters from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  
  const categoryParam = urlParams.get('category');
  if (categoryParam) {
    activeCategory = categoryParam.trim().toLowerCase();
    categoryTabs.forEach(tab => {
      if (tab.getAttribute('data-category') === activeCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

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
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTags = card.getAttribute('data-tags') || '';
      const cardTitle = card.querySelector('.card-service-title')?.textContent || '';
      const cardDesc = card.querySelector('.card-service-desc')?.textContent || '';

      // Map category id to human-friendly synonyms for rich search compatibility
      const categoryNames = {
        'web-development': 'web development backend frontend fullstack app coding programmer developer',
        'graphic-design': 'graphic design ui/ux ui ux logo brand illustrator designer figma product creative',
        'writing': 'writing copywriter copyediting developer guide whitepaper content blog technical copy',
        'marketing': 'marketing growth seo ads campaign digital search social email strategy brand',
        'video-editing': 'video editing animation vfx audio sound explainer motion producer 3d graphics',
        'programming': 'programming ai intelligence data software python solidity smart contracts web3 developer coding'
      };
      const categoryText = categoryNames[cardCategory] || cardCategory;
      const searchContent = `${cardTags} ${cardTitle} ${cardDesc} ${cardCategory} ${categoryText}`.toLowerCase();

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
  const cardTitleLinks = document.querySelectorAll('.catalog-card-item .card-service-title a');
  const modal = document.getElementById('proposal-modal');
  const closeBtn = document.getElementById('close-proposal-modal');
  const form = document.getElementById('proposal-form');
  const jobTitleInput = document.getElementById('proposal-job-title');

  if (!modal || !closeBtn || !form) return;

  const openProposalModal = (jobName) => {
    jobTitleInput.value = jobName;

    const modalJobTitleSpan = modal.querySelector('.gradient-text');
    if (modalJobTitleSpan) {
      modalJobTitleSpan.textContent = 'Job Proposal';
    }

    modal.classList.add('active');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  };

  applyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const jobName = btn.getAttribute('data-job') || '';
      openProposalModal(jobName);
    });
  });

  cardTitleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const jobCard = link.closest('.catalog-card-item');
      const applyBtn = jobCard ? jobCard.querySelector('.btn-apply-job') : null;
      const jobName = applyBtn ? applyBtn.getAttribute('data-job') : link.textContent.trim();
      openProposalModal(jobName);
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

// ==========================================
// FREELANCER DETAILS & PROFILE DATA ENGINE
// ==========================================

const FREELANCERS_DATA = {
  'ali-raza': {
    name: 'Ali Raza',
    level: 'Level 2 Seller',
    sellerLevel: 'Level 2 Seller',
    rating: '4.9',
    reviewsCount: 34,
    avatar: '../images/avatar_m1.png',
    bannerClass: 'banner-ai',
    bannerTitle: 'Deploy Autonomous AI Agents with LangChain & Python',
    bannerDesc: 'GPT-4 & Claude | Custom RAG Architectures | Database Integration',
    serviceTitle: 'Deploy Autonomous AI Agents with LangChain & Python',
    profileDetails: {
      from: 'Islamabad, Pakistan',
      memberSince: 'Jan 2022',
      avgResponse: '2 hours',
      lastDelivery: '1 day ago'
    },
    headline: 'Lead AI Engineer & Python Architect',
    aboutMe: [
      "Hello! I'm Ali, a dedicated AI engineer specializing in building autonomous agentic systems and Retrieval-Augmented Generation (RAG) pipelines. I have over 5 years of experience in Python, FastAPI, LangChain, and vector databases.",
      "I help companies automate complex business workflows, design custom cognitive architectures, and integrate cutting-edge LLMs (OpenAI, Anthropic, open-source models) securely with local databases."
    ],
    skills: ['Python', 'LangChain', 'FastAPI', 'Pinecone', 'PostgreSQL', 'LlamaIndex', 'Docker', 'Git'],
    experience: [
      { period: 'Feb 2024 - Present', title: 'Lead AI Developer — NeuralLabs Solutions', desc: 'Led engineering for enterprise RAG systems, resulting in a 40% reduction in query latencies. Built autonomous agent clusters for email categorization and automated response dispatching.' },
      { period: 'Aug 2022 - Jan 2024', title: 'Backend Software Developer — CloudScale Tech', desc: 'Maintained high-availability Python endpoints, designed Postgres database schemas, and integrated third-party REST APIs.' }
    ],
    portfolio: [
      { bannerClass: 'banner-ai', type: 'AI Agent', title: 'AuditIntel RAG Agent', desc: 'Custom AI agent that parses 100+ page financial reports and answers compliance queries with source citations.' },
      { bannerClass: 'banner-data', type: 'Scraper Agent', title: 'LivePrice Intelligence system', desc: 'Autonomous scraping agent checking e-commerce listings and predicting inventory re-stock cycles.' }
    ],
    descriptionParagraphs: [
      "Are you seeking to leverage the power of LLMs to automate manual work, scrape dynamic sites, or run semantic analysis on your private databases? I will build custom, reliable AI agent workflows tailored to your specific system APIs.",
      "I write highly modular and covered Python code, configure vector stores (Pinecone, Qdrant, ChromaDB), and handle prompt engineering with custom memory layers (Redis/SQL). Everything is delivered with Docker configurations and API endpoints."
    ],
    deliverables: [
      "Custom multi-agent workflow orchestration via LangChain / LlamaIndex",
      "Vector store setup and database synchronization logic",
      "Semantic search APIs and Chat-with-your-data setups",
      "Robust prompt engineering templates with conversational memory",
      "REST API integration with modern web frontends",
      "Comprehensive unit testing and Docker container configurations"
    ],
    packages: {
      basic: {
        name: 'Single-Purpose Agent',
        price: 'PKR 12,000',
        desc: 'Single LangChain agent integrated with one tool API. Prompt tuning and console script delivery.',
        delivery: '3 Days Delivery',
        revisions: '3 Revisions',
        includes: ['1 Agent Setup', '1 Tool Integration', 'Prompt Optimization', 'Setup Guide']
      },
      standard: {
        name: 'RAG Agent & Vector DB',
        price: 'PKR 24,000',
        desc: 'Multi-tool agent with long-term memory, vector database storage, and a FastAPI endpoint wrapper.',
        delivery: '5 Days Delivery',
        revisions: '5 Revisions',
        includes: ['Multi-tool Agent', 'Vector DB Integration', 'FastAPI Endpoint wrapper', 'Detailed API Docs']
      },
      premium: {
        name: 'Multi-Agent Fleet & DB',
        price: 'PKR 48,000',
        desc: 'Custom multi-agent fleet coordinating to solve complex jobs. Complete dashboard frontend, secure authentication, database sync.',
        delivery: '10 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Multi-Agent Coordination', 'Full DB Synchronization', 'React Dashboard Frontend', '1 Month Support']
      }
    },
    reviews: [
      { name: 'Tariq Mehmood', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'Ali Raza built a fantastic AI agent that automated our entire customer support queue. Saved us hundreds of hours. Outstanding communication!' },
      { name: 'Zainab Bibi', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f1.png', text: 'Superb experience working with Ali. His understanding of vector stores and RAG logic is outstanding. Highly recommended!' }
    ]
  },
  'sana-malik': {
    name: 'Sana Malik',
    level: 'Top Rated Seller',
    sellerLevel: 'Top Rated Seller',
    rating: '5.0',
    reviewsCount: 92,
    avatar: '../images/sana_malik.png',
    bannerClass: 'banner-web',
    bannerTitle: 'Next.js Fullstack SaaS Development',
    bannerDesc: 'React 19 Server Components | Serverless Vercel Deployments | Tailwind CSS',
    serviceTitle: 'Build High-Performance Next.js & React Applications',
    profileDetails: {
      from: 'Lahore, Pakistan',
      memberSince: 'Oct 2021',
      avgResponse: '1 hour',
      lastDelivery: '12 hours ago'
    },
    headline: 'Senior Fullstack Software Architect',
    aboutMe: [
      "Hello! I'm Sana, a seasoned software architect with over 8 years of experience building high-performance web and mobile products. I specialize in Next.js/React development, serverless API architectures, Postgres optimizations, and deployment automation.",
      "I collaborate with startups and enterprise teams to construct scalable, modular systems that are fully tested and clean. Let's work together to launch your next big platform!"
    ],
    skills: ['Next.js', 'React / Redux', 'Node.js', 'TypeScript', 'PostgreSQL', 'GraphQL & REST APIs', 'TailwindCSS', 'Docker', 'AWS Serverless', 'Git / CI/CD'],
    experience: [
      { period: 'Jan 2024 - Present', title: 'Lead Web3 Frontend Engineer — DecentraLabs', desc: 'Architected high-throughput React dashboard interfaces connecting to EVM compatible chains. Structured clean state stores with Redux Toolkit and optimized bundle loading speeds by 34%.' },
      { period: 'Aug 2022 - Dec 2023', title: 'Senior Fullstack Developer — StackFlow Technologies', desc: 'Managed a team of 4 junior developers writing serverless Node.js endpoints. Migrated core relational databases to multi-region Postgres setups, decreasing query delay vectors.' }
    ],
    portfolio: [
      { bannerClass: 'banner-web', type: 'SaaS Platform', title: 'VeloFlow SaaS Analytics Dashboard', desc: 'Built using Next.js 14 and Chart.js, incorporating server-side rendering and scheduled data sync cycles.' },
      { bannerClass: 'banner-ai', type: 'AI Bot', title: 'Athena AI Agents Workflow Builder', desc: 'A graphical drag-and-drop web builder interface to create multi-agent pipelines powered by GPT-4 APIs.' },
      { bannerClass: 'banner-web3', type: 'DeFi DApp', title: 'Nexus Liquid Staking Dashboard', desc: 'Web3 dashboard displaying stake metric calculations, gas rates, and staking reward yield curves in real-time.' }
    ],
    descriptionParagraphs: [
      "Are you looking to build a blazing-fast SaaS product, a high-converting web landing page, or a fully custom API-driven dashboard? This service provides complete, end-to-end fullstack engineering using the latest Next.js framework architectures.",
      "I write clean, modular React component layouts, structure secure databases (Postgres, Mongo), and implement fast client transitions using TailwindCSS. Every page is fully responsive, optimized for Core Web Vitals, and set up with automatic CI/CD deployment pipelines on Vercel."
    ],
    deliverables: [
      "Responsive Next.js App Router Structure (SSR, ISR, static configurations)",
      "Dynamic CSS styling via TailwindCSS and keyframe animations",
      "Integration of database models (Prisma, PostgreSQL, MongoDB)",
      "Third-party authentication integrations (Clerk, NextAuth, Auth0)",
      "Secure transactional payment pipelines (Stripe, LemonSqueezy)",
      "Comprehensive SEO metadata structure & Analytics tracking setups"
    ],
    packages: {
      basic: {
        name: 'Standard Landing Page',
        price: 'PKR 15,000',
        desc: 'Single-page responsive Next.js/React website styled with TailwindCSS. Full SEO optimization.',
        delivery: '3 Days Delivery',
        revisions: '3 Revisions',
        includes: ['1 HTML Page Layout', 'Tailwind CSS Styling', 'Form Integration', 'Responsive Mobile View', 'Custom Scroll Animations']
      },
      standard: {
        name: 'Multi-Page SaaS Frontend',
        price: 'PKR 30,000',
        desc: 'Multi-page website (up to 5 pages) with custom state logic, dark modes, and dynamic API fetches.',
        delivery: '6 Days Delivery',
        revisions: '5 Revisions',
        includes: ['5 Responsive HTML Pages', 'Dynamic API Fetch States', 'Multi-page Navigation', 'State Store Hook (React/Redux)', 'Custom Cursor & Tilt Engines']
      },
      premium: {
        name: 'Fullstack App & DB',
        price: 'PKR 60,000',
        desc: 'Complete SaaS application. Next.js App Router, database models (Prisma/Postgres), Stripe checkout, and Auth.',
        delivery: '12 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Unlimited Pages (Full SaaS)', 'Secure Clerk / Auth0 Setup', 'Postgres Schema & Prisma Models', 'Stripe Payment Checkout integrations', 'VIP 24/7 Deployment support']
      }
    },
    reviews: [
      { name: 'Tariq Mehmood', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: "Sana delivered exceptionally clean Next.js code. The page speed scores are literally 100% on mobile and desktop. Her understanding of Figma transitions and responsive layouts is top notch." },
      { name: 'Ali Raza', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m2.png', text: "Excellent fullstack developer! She set up our database pipelines and Stripe webhooks perfectly. Communication was prompt and the delivery was on time. Highly recommended for complex SaaS builds!" }
    ]
  },
  'muhammad-kamran': {
    name: 'Muhammad Kamran',
    level: 'Pro Verified',
    sellerLevel: 'Pro Verified',
    rating: '4.8',
    reviewsCount: 118,
    avatar: '../images/avatar_m2.png',
    bannerClass: 'banner-design',
    bannerTitle: 'Premium Brand Guidelines & Vector Logo Systems',
    bannerDesc: 'Vector Logo Design | Full Typography Sets | Brand Assets & Stationary',
    serviceTitle: 'Create Premium Brand Guidelines & Vector Logo Systems',
    profileDetails: {
      from: 'Karachi, Pakistan',
      memberSince: 'Mar 2020',
      avgResponse: '2 hours',
      lastDelivery: '3 hours ago'
    },
    headline: 'Principal Visual Brand Strategist',
    aboutMe: [
      "Hello! I'm Kamran, a vector designer and brand identity specialist with over 6 years of experience working with global startups. I craft distinct visual systems that align with your product core.",
      "I specialize in logo systems, full brand styling assets, and design guidelines that help developers build cohesive UI experiences."
    ],
    skills: ['Figma', 'Adobe Illustrator', 'Logo Design', 'Vector Illustration', 'Brand Guidelines', 'Typography Systems', 'UI Component Styling'],
    experience: [
      { period: 'Jul 2023 - Present', title: 'Creative Design Director — VibeStudio Karachi', desc: 'Managed team of designers building digital-first vector brand kits. Developed comprehensive visual tokens for 15+ local and international platforms.' },
      { period: 'Jan 2021 - Jun 2023', title: 'Senior Illustrator — BrandCraft Labs', desc: 'Designed custom iconography libraries, logos, and vector assets. Coordinated layout architectures with backend engineers.' }
    ],
    portfolio: [
      { bannerClass: 'banner-design', type: 'Brand Identity', title: 'ApexPay Fintech Guideline System', desc: 'Complete design guide, visual assets, and customized color themes for a modern mobile wallet application.' },
      { bannerClass: 'banner-uiux', type: 'Design System', title: 'OmniUI Figma Vector Kit', desc: 'A rich visual component UI library containing 200+ vector assets and layouts.' }
    ],
    descriptionParagraphs: [
      "I will design a complete, premium visual identity for your business. From iconic, high-resolution vector logos to comprehensive brand asset guidelines, typography rules, and tailored color boards.",
      "Every delivery is fully layered, organized in Figma and Illustrator formats, and optimized for screen and print layouts. Let's design a brand that captures attention!"
    ],
    deliverables: [
      "Unique main corporate logo system in SVG, AI, and PNG formats",
      "Full typography hierarchies (Google Fonts pairings)",
      "Cohesive brand color tokens and styling guidelines",
      "Stationary files (business cards, letterheads, invoice templates)",
      "Social media kit templates (banners, posts overlays)",
      "Detailed Brand Guideline PDF containing instructions and spacing rules"
    ],
    packages: {
      basic: {
        name: 'Essential Brand Logo',
        price: 'PKR 22,000',
        desc: 'Corporate logo concept with guidelines on typography and color pairing. High-resolution vector files.',
        delivery: '4 Days Delivery',
        revisions: '3 Revisions',
        includes: ['1 Logo Concept', 'Typography Guide', 'Color Palette Selection', 'SVG / Vector Source Files']
      },
      standard: {
        name: 'Brand Guidelines Kit',
        price: 'PKR 44,000',
        desc: 'Advanced logo variations, full stationery assets, and detailed brand identity guideline book (PDF).',
        delivery: '7 Days Delivery',
        revisions: '5 Revisions',
        includes: ['3 Logo Variations', 'Stationery Assets', 'Brand Guideline Booklet', 'Social Media Kit Templates']
      },
      premium: {
        name: 'Complete Corporate System',
        price: 'PKR 88,000',
        desc: 'Full corporate brand design. Logo, custom icon library, marketing kits, presentation templates, and VIP support.',
        delivery: '14 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['5 Logo Variations', 'Full Stationery Kit', 'Custom Vector Icon Library', 'Marketing Slide Deck', 'VIP 24/7 File Updates']
      }
    },
    reviews: [
      { name: 'Kashif Jamil', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'Kamran did an exceptional job capturing the vision for our startup. The guidelines booklet is extremely detailed and our dev team had zero issues implementing the design tokens.' },
      { name: 'Ayesha Khan', country: 'Pakistan', stars: '★★★★☆', avatar: '../images/avatar_f2.png', text: 'Stunning logo concepts! Very professional, responsive, and took feedback constructively. We will hire again!' }
    ]
  },
  'ayesha-imran': {
    name: 'Ayesha Imran',
    level: 'Level 2 Seller',
    sellerLevel: 'Level 2 Seller',
    rating: '5.0',
    reviewsCount: 47,
    avatar: '../images/avatar_f1.png',
    bannerClass: 'banner-video',
    bannerTitle: 'Product Demo Video Editing & 3D Motion Graphics',
    bannerDesc: 'After Effects | 3D Renders | Motion Sound Design | Color Grading',
    serviceTitle: 'Product Demo Video Editing & 3D Motion Graphics',
    profileDetails: {
      from: 'Faisalabad, Pakistan',
      memberSince: 'Sep 2022',
      avgResponse: '1 hour',
      lastDelivery: '2 days ago'
    },
    headline: 'Motion Graphics Artist & Post-Production Editor',
    aboutMe: [
      "Hello! I am Ayesha, a motion designer specializing in high-converting product demo videos, application walkthrough animations, and 3D motion layouts.",
      "I work with Premiere Pro, After Effects, and Cinema4D to build dynamic commercials that simplify software products and boost user acquisition metrics."
    ],
    skills: ['After Effects', 'Premiere Pro', 'Cinema 4D', 'Video Editing', 'Motion Graphics', 'Sound Design', 'Color Grading'],
    experience: [
      { period: 'Nov 2023 - Present', title: 'Senior Video Editor — MediaPulse Faisalabad', desc: 'Produced app explainer videos and product advertisements. Optimized sound design tracks and dynamic kinetic typography.' },
      { period: 'Jan 2022 - Oct 2023', title: 'Freelance Motion Editor — Upward Media', desc: 'Assembled cinematic product clips, applied color filters, and animated corporate layout transitions.' }
    ],
    portfolio: [
      { bannerClass: 'banner-video', type: 'Product Demo', title: 'SmartWallet App Walkthrough Commercial', desc: 'A slick, energetic app showcase rendering user interfaces, transition effects, and sound overlays.' },
      { bannerClass: 'banner-motion', type: '3D Motion', title: 'TechSphere Logo Reveal Animation', desc: 'A 3D mechanical logo assembly utilizing particle simulations and clean color transitions.' }
    ],
    descriptionParagraphs: [
      "Need a video to explain your SaaS product, showcase your mobile application, or launch a paid ad campaign? I will produce, edit, and render high-fidelity explainer videos with kinetic typography and premium sound designs.",
      "I utilize modern editing techniques, apply professional color grading, incorporate customized screen recordings, and add voiceovers. Let's tell a visually compelling story!"
    ],
    deliverables: [
      "Custom 1080p / 4K application walkthrough videos",
      "Dynamic kinetic typography and 2D/3D motion graphics overlay",
      "Professional post-production color correction and grading",
      "Sound design including curated background audio and sfx licensing",
      "Multiple aspect ratio exports (16:9 widescreen, 9:16 vertical for reels)",
      "Clean source files in Adobe After Effects / Premiere Pro formats"
    ],
    packages: {
      basic: {
        name: 'Basic App Demo (30s)',
        price: 'PKR 10,000',
        desc: '30-second app UI screen capture walkthrough video with simple transition effects and royalty-free music.',
        delivery: '3 Days Delivery',
        revisions: '3 Revisions',
        includes: ['30-Second Length', 'App Screen Recording', 'Background Track', 'Logo Watermark Integration']
      },
      standard: {
        name: 'Dynamic Explainer (60s)',
        price: 'PKR 20,000',
        desc: '60-second video featuring custom kinetic typography titles, detailed app zoom-ins, voiceover integration, and sound design.',
        delivery: '5 Days Delivery',
        revisions: '5 Revisions',
        includes: ['60-Second Length', 'Kinetic Typography', 'Sound Design & SFX', 'Voiceover Integration', 'Multi-ratio Exports']
      },
      premium: {
        name: 'Premium 3D Commercial',
        price: 'PKR 40,000',
        desc: '90-second premium advertisement. Includes 3D motion graphics elements, custom animated scripts, and unlimited edits.',
        delivery: '8 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['90-Second Length', '3D Motion Graphics', 'VIP Sound Mixing', 'Full Commercial Rights', 'After Effects Project Source Files']
      }
    },
    reviews: [
      { name: 'Imran Malik', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m2.png', text: 'Ayesha is an incredibly talented editor! The SaaS explainer video she produced is highly engaging and looks very professional. Conversion rates on our landing page increased by 20%!' },
      { name: 'Fatima Shah', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f2.png', text: 'Super fast delivery and the revisions were done exactly as requested. Outstanding After Effects skills.' }
    ]
  },
  'dawood-qureshi': {
    name: 'Dawood Qureshi',
    level: 'Level 1 Seller',
    sellerLevel: 'Level 1 Seller',
    rating: '4.9',
    reviewsCount: 23,
    avatar: '../images/avatar_m1.png',
    bannerClass: 'banner-writing',
    bannerTitle: 'Write Developer Guides & Crypto Whitepapers',
    bannerDesc: 'API Documentation | Cryptoeconomic Specs | Developer Guides',
    serviceTitle: 'Write Developer Guides & Crypto Whitepapers',
    profileDetails: {
      from: 'Peshawar, Pakistan',
      memberSince: 'May 2023',
      avgResponse: '3 hours',
      lastDelivery: '2 days ago'
    },
    headline: 'Technical Writer & Web3 Researcher',
    aboutMe: [
      "Hello! I am Dawood, a technical copywriter specializing in developer documentation, blockchain whitepapers, and cloud-native architecture guides.",
      "I translate complex technical logic (Rust, Solidity, Kubernetes structures) into highly readable, structured Markdown articles that build product authority."
    ],
    skills: ['Technical Writing', 'Markdown', 'API Documentation', 'Web3 & DeFi Research', 'Whitepapers', 'Developer Relations', 'SEO optimization'],
    experience: [
      { period: 'Mar 2024 - Present', title: 'Contract Technical Writer — EtherFlow Labs', desc: 'Wrote cryptoeconomics and protocol specifications. Managed documentation portals and created deployment guides.' },
      { period: 'Jun 2023 - Feb 2024', title: 'Content Specialist — TechStack Peshawar', desc: 'Produced SEO-optimized technical blog posts regarding cloud hosting, API design, and web development frameworks.' }
    ],
    portfolio: [
      { bannerClass: 'banner-writing', type: 'Whitepaper', title: 'Nexus DeFi Staking Whitepaper', desc: 'A 25-page formal research paper describing liquidity pool dynamics, reward equations, and validator protocols.' },
      { bannerClass: 'banner-data', type: 'API Docs', title: 'LogiLink API documentation', desc: 'Fully structured developer portal guide describing authentication, JSON payloads, and error codes.' }
    ],
    descriptionParagraphs: [
      "Do you need clear, developer-friendly documentation for your API, or a rigorous whitepaper for your blockchain project? I write high-quality developer guides, whitepapers, and cloud architecture articles.",
      "I research your codebase, understand your APIs, and write detailed docs with copy-pasteable code snippets, diagram references, and clear layout logic. Let's make your product easy to adopt!"
    ],
    deliverables: [
      "Fully structured Git-compatible Markdown (.md) document layouts",
      "Accurate REST/GraphQL API request and response JSON examples",
      "Explanatory diagrams and database schema maps",
      "Rigorous cryptoeconomic logic and staking mechanics whitepapers",
      "SEO research mapping relevant industry keywords",
      "Thorough editing and spelling validation across all directories"
    ],
    packages: {
      basic: {
        name: 'Single API Guide (1k words)',
        price: 'PKR 6,000',
        desc: '1,000 words. A clear, step-by-step developer tutorial or single API endpoint setup guide.',
        delivery: '3 Days Delivery',
        revisions: '2 Revisions',
        includes: ['1,000 Word Length', 'Code Snippet Integration', 'Markdown Formatting', '1 Focus Keyword Map']
      },
      standard: {
        name: 'Technical Portal (3k words)',
        price: 'PKR 12,000',
        desc: '3,000 words. Comprehensive setup documentation including multiple endpoints, request parameters, and database schemas.',
        delivery: '5 Days Delivery',
        revisions: '4 Revisions',
        includes: ['3,000 Word Length', 'API Endpoint Payload Guides', 'Relational Schema Diagrams', '2 Revisions Setup']
      },
      premium: {
        name: 'Full Web3 Whitepaper',
        price: 'PKR 24,000',
        desc: 'Complete DeFi or SaaS whitepaper. Detailed research, mathematical equations, governance designs, and PDF layout.',
        delivery: '9 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Full Cryptoeconomic Design', 'Mathematical Formulas', 'Governance Structure Design', 'Professional PDF Formatting']
      }
    },
    reviews: [
      { name: 'Sohail Tanveer', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m2.png', text: 'Dawood wrote our core protocols whitepaper. The mathematical formulas and explanation of consensus rules were extremely precise. Highly recommend his technical depth!' },
      { name: 'Mariam Ali', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f1.png', text: 'The API documentation is perfectly organized. Developers integrated our endpoints in record time thanks to his clear tutorials.' }
    ]
  },
  'amina-yasmin': {
    name: 'Amina Yasmin',
    level: 'Top Rated Seller',
    sellerLevel: 'Top Rated Seller',
    rating: '4.8',
    reviewsCount: 81,
    avatar: '../images/avatar_f1.png',
    bannerClass: 'banner-marketing',
    bannerTitle: 'SEO Audit & Multi-Channel Customer Acquisition Loops',
    bannerDesc: 'Programmatic SEO | Growth Engineering | Funnel Tracking | Ad Optimization',
    serviceTitle: 'SEO Audit & Multi-Channel Customer Acquisition Loops',
    profileDetails: {
      from: 'Multan, Pakistan',
      memberSince: 'Nov 2021',
      avgResponse: '1 hour',
      lastDelivery: '5 hours ago'
    },
    headline: 'Digital Growth Specialist & SEO Strategist',
    aboutMe: [
      "Hello! I'm Amina, a marketing engineer specializing in scaling customer acquisition channels. I build programmatic SEO setups, optimize conversion funnels, and manage paid campaigns.",
      "I leverage data-driven analytics to identify growth opportunities, decrease customer acquisition costs (CAC), and design organic traffic loops."
    ],
    skills: ['SEO Auditing', 'Google Analytics', 'Conversion Rate Optimization', 'Paid Ads (Meta/Google)', 'Keyword Strategy', 'Growth Marketing', 'Content Funnels'],
    experience: [
      { period: 'Dec 2023 - Present', title: 'Growth Lead — MultanTech Incubator', desc: 'Implemented organic search campaigns scaling active user metrics by 150%. Designed funnel tracking pipelines and retargeting ads.' },
      { period: 'Feb 2022 - Nov 2023', title: 'SEO Executive — BrandScale Online', desc: 'Identified technical site health issues, designed search queries maps, and wrote conversion copy layouts.' }
    ],
    portfolio: [
      { bannerClass: 'banner-marketing', type: 'Growth Loop', title: 'SaaS SEO organic traffic campaign', desc: 'An organic acquisition strategy generating 50k+ monthly impressions via structured category page SEO.' },
      { bannerClass: 'banner-ads', type: 'Paid Acquisition', title: 'Paid Ad Meta Conversion Pipeline', desc: 'Structured retargeting campaign achieving a 4.2x ROAS score with HSL Hued banners.' }
    ],
    descriptionParagraphs: [
      "Is your website struggling to rank on Google or failing to convert visiting traffic into customers? I will run a comprehensive, technical SEO audit and outline a multi-channel growth blueprint.",
      "I check Core Web Vitals, identify site crawl block issues, map competitive search terms, and structure Google Tag Manager tracking setups. You receive actionable tasks to build search traffic."
    ],
    deliverables: [
      "Detailed PDF audit describing crawl errors and site speed vectors",
      "Competitive keyword research map displaying search volume metrics",
      "On-page optimization guidelines (headings, alt text, metadata formats)",
      "Structure design for customer conversion funnels (CTA placement)",
      "Step-by-step setup guides for Google Search Console and Tag Manager",
      "Comprehensive growth strategy blueprint detailing organic traffic loops"
    ],
    packages: {
      basic: {
        name: 'Technical SEO Audit',
        price: 'PKR 14,000',
        desc: 'Crawl error check, meta tag validation, site load speed metrics, and a task list of fixes.',
        delivery: '4 Days Delivery',
        revisions: '3 Revisions',
        includes: ['1 Site Crawl Audit', 'Page Speed Check', '1 Page Competitor Check', 'Actionable Fix Checklist']
      },
      standard: {
        name: 'Audit & Keyword Map',
        price: 'PKR 28,000',
        desc: 'Full technical audit plus search term mapping for up to 10 pages and competitor content gap analysis.',
        delivery: '7 Days Delivery',
        revisions: '5 Revisions',
        includes: ['Full Technical Audit', '10-Page Keyword Map', 'Competitor Gap Analysis', 'Metadata Templates']
      },
      premium: {
        name: 'Elite Growth Package',
        price: 'PKR 56,000',
        desc: 'Full SEO optimization, GTM analytics configuration, paid ad retargeting blueprint, and 1 month coaching support.',
        delivery: '14 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Full SEO Optimization', 'GTM Tracker Setup', 'Paid Campaign Blueprint', '1-Month Strategy Coaching', 'VIP Slack Support']
      }
    },
    reviews: [
      { name: 'Zeeshan Ahmed', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'AminaYasmin did an incredible job auditing our SaaS. We fixed the crawl redirect errors she identified, and our search impressions doubled in 3 weeks!' },
      { name: 'Kiran Raza', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f2.png', text: 'Highly professional growth audit. The keywords list is very detailed and structured logically. Recommended.' }
    ]
  },
  'luqman-chaudhry': {
    name: 'Luqman Chaudhry',
    level: 'Pro Verified',
    sellerLevel: 'Pro Verified',
    rating: '5.0',
    reviewsCount: 61,
    avatar: '../images/avatar_m1.png',
    bannerClass: 'banner-web3',
    bannerTitle: 'Secure Smart Contract Auditing & Solidity Development',
    bannerDesc: 'Solidity Code | Unit Testing assertions | Gas Optimization | Security Audits',
    serviceTitle: 'Secure Smart Contract Auditing & Solidity Development',
    profileDetails: {
      from: 'Rawalpindi, Pakistan',
      memberSince: 'Feb 2021',
      avgResponse: '2 hours',
      lastDelivery: '1 hour ago'
    },
    headline: 'Web3 Lead & Smart Contract Security Auditor',
    aboutMe: [
      "Hello! I am Luqman, a Web3 engineer focusing on smart contract security audits, DeFi protocols, and decentralized app architectures.",
      "I write secure, gas-optimized Solidity contracts, configure unit tests with Hardhat and Foundry, and run vulnerability scans to prevent logic exploit states."
    ],
    skills: ['Solidity', 'Web3.js / Ethers.js', 'Foundry & Hardhat', 'DeFi Protocols', 'Smart Contract Audits', 'Gas Optimization', 'Node.js'],
    experience: [
      { period: 'Jan 2024 - Present', title: 'Lead Security Auditor — RawalWeb3 Security', desc: 'Audited DeFi lending protocols and token staking modules. Discovered 12 high-severity vulnerabilities before mainnet launch.' },
      { period: 'Jun 2022 - Dec 2023', title: 'Solidity Developer — Decentralize Labs', desc: 'Developed custom ERC-721 and ERC-20 smart contracts, implemented staking logic, and optimized execution gas fees.' }
    ],
    portfolio: [
      { bannerClass: 'banner-web3', type: 'DeFi DApp', title: 'VeloSwap AMM Liquidity Protocol', desc: 'Custom automated market maker Solidity smart contracts with automated fee distribution.' },
      { bannerClass: 'banner-ai', type: 'Auditing Report', title: 'Athena Token Audit PDF', desc: 'Comprehensive mathematical security audit detailing reentrancy protection and overflow checks.' }
    ],
    descriptionParagraphs: [
      "Are you preparing to launch a token system, custom NFT collection, or staking pool? I write secure Solidity smart contracts and conduct mathematical vulnerability testing to shield your protocol funds.",
      "I audit reentrancy vector scenarios, front-running possibilities, permission configurations, and optimize gas fee costs using Foundry tests. Deliveries include a professional PDF report."
    ],
    deliverables: [
      "Secure, fully documented Solidity smart contracts (.sol files)",
      "Foundry / Hardhat unit testing scripts asserting contract state",
      "Gas optimization recommendations (reducing compiler block cycles)",
      "Comprehensive PDF security audit outlining discovered issue layers",
      "Deploy configurations for EVM chains (Ethereum, Arbitrum, BSC)",
      "Post-deployment integration scripts using Ethers.js / Web3.js libraries"
    ],
    packages: {
      basic: {
        name: 'Basic Token Contract',
        price: 'PKR 30,000',
        desc: 'Standard ERC-20 token or ERC-721 contract. Basic compilation verification and constructor setup.',
        delivery: '3 Days Delivery',
        revisions: '3 Revisions',
        includes: ['1 Token Solidity File', 'Standard ERC Protocol', 'Compilation Checks', 'Basic Deployment Script']
      },
      standard: {
        name: 'Staking & Yield Contract',
        price: 'PKR 60,000',
        desc: 'Staking pool pool contracts with customizable yield calculations. Wrote unit test assertions.',
        delivery: '6 Days Delivery',
        revisions: '5 Revisions',
        includes: ['Multi-file Smart Contracts', 'Staking Logic Setup', 'Unit Test Assertion Scripts', 'Deployment Setup Configs']
      },
      premium: {
        name: 'DeFi Audit & Security Scan',
        price: 'PKR 120,000',
        desc: 'In-depth code audit. Mathematical verification, gas footprint minimization, vulnerability report, and VIP support.',
        delivery: '10 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Complete Protocol Security Scan', 'Gas Footprint Minimization', 'Mathematical Audit Report', 'Deployment Support Support']
      }
    },
    reviews: [
      { name: 'Naveed Iqbal', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m2.png', text: 'Luqman conducted a thorough audit on our smart contract. The gas optimization suggestions saved our users thousands in transaction fees. Incredibly smart developer!' },
      { name: 'Sidra Khan', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f1.png', text: 'Foundry testing setup is perfect. Discovered two edge-case calculation bugs which saved us from major exploits. A+' }
    ]
  },
  'saima-shah': {
    name: 'Saima Shah',
    level: 'Level 2 Seller',
    sellerLevel: 'Level 2 Seller',
    rating: '4.9',
    reviewsCount: 73,
    avatar: '../images/avatar_f2.png',
    bannerClass: 'banner-uiux',
    bannerTitle: 'High-Fidelity Dashboard & SaaS Figma Prototypes',
    bannerDesc: 'SaaS Layouts | Component Design Systems | Responsive Prototypes',
    serviceTitle: 'High-Fidelity Dashboard & SaaS Figma Prototypes',
    profileDetails: {
      from: 'Islamabad, Pakistan',
      memberSince: 'Apr 2022',
      avgResponse: '1 hour',
      lastDelivery: '8 hours ago'
    },
    headline: 'Senior UI/UX & Design System Architect',
    aboutMe: [
      "Hello! I am Saima, a product designer specializing in SaaS platforms, analytics dashboards, and web application layouts in Figma.",
      "I construct modular design systems, map out intuitive user flows, and compile fully interactive prototypes ready for dev handoffs."
    ],
    skills: ['Figma UI/UX', 'Design Systems', 'Interactive Prototypes', 'SaaS Wireframes', 'User Journey Mapping', 'Mobile App Design', 'Adobe XD'],
    experience: [
      { period: 'Jan 2024 - Present', title: 'Senior UX Designer — CapitalDesign Islamabad', desc: 'Structured complex data dashboard layouts for logistics and SaaS companies. Maintained reusable component libraries.' },
      { period: 'May 2022 - Dec 2023', title: 'UI Designer — SoftLink Solutions', desc: 'Constructed landing pages layouts, mobile wireframe arrays, and interactive click-through animations.' }
    ],
    portfolio: [
      { bannerClass: 'banner-uiux', type: 'UI/UX Design', title: 'LogiTrack SaaS Admin Dashboard', desc: 'A multi-viewport logistics portal with real-time charts, map cards, and dark theme variables.' },
      { bannerClass: 'banner-design', type: 'Mobile App', title: 'EcoShare Mobile Wallet UI Kit', desc: '40+ interactive high-fidelity screens for a green finance mobile app styled in modern clean colors.' }
    ],
    descriptionParagraphs: [
      "Are you planning a new software application and need a modern, professional visual design before writing code? I design responsive SaaS screens and component design systems.",
      "I analyze user requirements, structure neat layouts, apply accessibility color guidelines, and link fully interactive prototypes. You receive organized Figma source files with developers guidelines."
    ],
    deliverables: [
      "High-fidelity UI screens in Figma (Desktop & Mobile viewport layouts)",
      "A cohesive design system comprising color tokens, typography, and buttons",
      "Fully interactive prototype showing hover states and transition flows",
      "Asset export folders containing icons and custom illustrations",
      "Comprehensive developer handoff instructions describing grids and styles",
      "Wireframe guides detailing product user experiences"
    ],
    packages: {
      basic: {
        name: 'Dashboard UI (3 Page)',
        price: 'PKR 18,000',
        desc: '3 responsive desktop dashboard screens designed in Figma. Clean grid structures and color palette.',
        delivery: '4 Days Delivery',
        revisions: '3 Revisions',
        includes: ['3 Responsive Desktop Screens', 'Figma Source Files', 'Color Palette & Typography Selection', 'Developer Assets Handoff']
      },
      standard: {
        name: 'Complete SaaS UI (8 Page)',
        price: 'PKR 36,000',
        desc: '8 responsive desktop dashboard screens plus custom mobile layouts, UI component styling, and prototype flows.',
        delivery: '8 Days Delivery',
        revisions: '5 Revisions',
        includes: ['8 Responsive Screens', 'Mobile Viewport Adapters', 'Interactive Click Prototype', 'Asset Exports Folder']
      },
      premium: {
        name: 'Design System & App (15 Page)',
        price: 'PKR 72,000',
        desc: '15 premium pages. Full design system library (buttons, forms, cards), interactive transitions, and VIP Slack call support.',
        delivery: '14 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['15 Custom Screens', 'Reusable Component Library', 'VIP 24/7 File Updates', '1-Hour Strategy Walkthrough Video']
      }
    },
    reviews: [
      { name: 'Hamza Farooq', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'Saima Shah designed our entire business dashboard in Figma. The layouts are very clean and the interactive prototypes made development extremely simple. Brilliant designer!' },
      { name: 'Ayesha Yasmin', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f1.png', text: 'Attention to detail is outstanding. She designed our landing page and app UI perfectly matching our branding. Five stars.' }
    ]
  },
  'rehan-tariq': {
    name: 'Rehan Tariq',
    level: 'Level 1 Seller',
    sellerLevel: 'Level 1 Seller',
    rating: '4.8',
    reviewsCount: 19,
    avatar: '../images/avatar_m2.png',
    bannerClass: 'banner-data',
    bannerTitle: 'Build ETL Data Pipelines & Warehouse Architecture',
    bannerDesc: 'BigQuery / Snowflake | dbt / Airflow | SQL Query tuning | ETL Pipelines',
    serviceTitle: 'Build ETL Data Pipelines & Warehouse Architecture',
    profileDetails: {
      from: 'Gujranwala, Pakistan',
      memberSince: 'Jun 2023',
      avgResponse: '2 hours',
      lastDelivery: '1 day ago'
    },
    headline: 'Data Engineer & Database Optimization Expert',
    aboutMe: [
      "Hello! I am Rehan, a data engineer specializing in structuring reliable ETL pipelines, database warehouse query architectures, and performance tuning.",
      "I connect databases (Postgres, BigQuery, Snowflake), write dbt models, and schedule ingestion pipelines using Apache Airflow configurations."
    ],
    skills: ['PostgreSQL', 'SQL Optimization', 'dbt (data build tool)', 'Apache Airflow', 'BigQuery / Snowflake', 'ETL Pipelines', 'Python scripting'],
    experience: [
      { period: 'Aug 2023 - Present', title: 'Data Engineer — Gujranwala Analytics', desc: 'Structured scheduled database sync models processing millions of transaction rows. Optimized queries reducing warehouse costs by 28%.' },
      { period: 'Feb 2022 - Jul 2023', title: 'Database Administrator — FinTech Systems', desc: 'Managed Postgres database replicas, implemented indexing strategies, and automated data backups.' }
    ],
    portfolio: [
      { bannerClass: 'banner-data', type: 'Data Warehouse', title: 'Multi-Source Analytics Warehouse', desc: 'Centralized SQL ingestion pipelines merging sales records from Postgres and Stripe into BigQuery.' },
      { bannerClass: 'banner-writing', type: 'Data Models', title: 'dbt Ingestion Orchestration', desc: 'Scheduled dbt model scripts cleaning raw database metrics and exporting clean tables.' }
    ],
    descriptionParagraphs: [
      "Are you struggling with slow database queries, unstructured database records, or disconnected analytics channels? I will build scalable ETL data pipelines and optimize SQL structures.",
      "I configure dbt transformations, schedule ingestion jobs using Apache Airflow, and implement relational database indexing rules to keep queries under 200ms. Everything is documented and set up securely."
    ],
    deliverables: [
      "Documented SQL schema designs and database index mappings",
      "Custom dbt data model configurations and test pipelines",
      "Scheduled data sync orchestration scripts (Apache Airflow DAGs)",
      "Database migration scripts (PostgreSQL, BigQuery, Snowflake)",
      "Detailed query speed optimization audit documentation",
      "Python data ingestion helper scripts linking API data source feeds"
    ],
    packages: {
      basic: {
        name: 'Database Query Optimization',
        price: 'PKR 13,000',
        desc: 'Analyzing slow queries on a single Postgres database. Adding indexes and optimizing SQL structures.',
        delivery: '4 Days Delivery',
        revisions: '3 Revisions',
        includes: ['Postgres Index Analysis', '5 SQL Query Rewrites', 'Slow Query Log Auditing', 'Performance Audit PDF']
      },
      standard: {
        name: 'ETL Pipeline & dbt Setup',
        price: 'PKR 26,000',
        desc: 'Setting up ingestion pipelines and dbt models to transform raw database tables into clean analytical views.',
        delivery: '7 Days Delivery',
        revisions: '5 Revisions',
        includes: ['dbt Model Configurations', 'Data Source Ingestion Scripts', 'Schema Test Assertions', 'ETL Documentation']
      },
      premium: {
        name: 'Enterprise Data Warehouse',
        price: 'PKR 52,000',
        desc: 'Full data warehouse setup (BigQuery/Snowflake). Airflow orchestration, multi-source ingestion, security rules, and support.',
        delivery: '12 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Warehouse Schema Design', 'Apache Airflow DAG setup', 'Multi-Source Integration', 'Performance Test Mappings', 'VIP Support']
      }
    },
    reviews: [
      { name: 'Kamran Ali', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'Rehan optimized our Postgres query structures. Several queries that took 8 seconds now load in less than 300ms. Incredibly detailed performance tuning!' },
      { name: 'Ayesha Yasmin', country: 'Pakistan', stars: '★★★★☆', avatar: '../images/avatar_f2.png', text: 'Stunning ETL setup. The dbt documentation is clean and tests are running perfectly on schedule.' }
    ]
  },
  'kiran-fatima': {
    name: 'Kiran Fatima',
    level: 'Top Rated Seller',
    sellerLevel: 'Top Rated Seller',
    rating: '4.9',
    reviewsCount: 54,
    avatar: '../images/avatar_f2.png',
    bannerClass: 'banner-ads',
    bannerTitle: 'Setup Google Search Ads & Meta Retargeting Loops',
    bannerDesc: 'Conversion Tracking | Custom Audiences | Ad Copywriting | ROI Optimization',
    serviceTitle: 'Setup Google Search Ads & Meta Retargeting Loops',
    profileDetails: {
      from: 'Lahore, Pakistan',
      memberSince: 'Jul 2021',
      avgResponse: '1 hour',
      lastDelivery: '6 hours ago'
    },
    headline: 'Performance Marketing Architect & Ads Optimizer',
    aboutMe: [
      "Hello! I am Kiran, a performance marketer specializing in Google Search campaigns, Meta advertising, and pixel analytics tracking.",
      "I design high-converting retargeting loops, write persuasive ad copies, and optimize demographics filters to maximize client return on ad spend (ROAS)."
    ],
    skills: ['Google Ads', 'Meta Ads Manager', 'Conversion Tracking', 'Pixel Integration', 'A/B Testing', 'Ad Copywriting', 'ROI Audits'],
    experience: [
      { period: 'Jan 2023 - Present', title: 'Lead Ad Strategist — Lahore Digital Hub', desc: 'Managed monthly ad budgets scaling return figures for e-commerce brands. Prefilled GTM containers and pixels.' },
      { period: 'Aug 2021 - Dec 2022', title: 'Marketing Assistant — ApexMedia Online', desc: 'Wrote marketing headlines, researched audience demographics, and compiled weekly ad performance metrics.' }
    ],
    portfolio: [
      { bannerClass: 'banner-ads', type: 'Ad Campaign', title: 'Fintech App Google Search Ads', desc: 'Ad campaigns targeting high-intent keywords, yielding a 35% decrease in signup acquisition costs.' },
      { bannerClass: 'banner-marketing', type: 'ROAS Loop', title: 'E-commerce Facebook Ads Scaling', desc: 'Demographics scaling strategy achieving a stable 5.1x ROAS metric on local apparel sales.' }
    ],
    descriptionParagraphs: [
      "Are you spending money on Google or Facebook ads without seeing conversions or positive returns? I will setup, audit, and optimize your paid advertising campaigns.",
      "I configure Google Search keywords, set up Meta pixel conversion trackers, design custom audience funnels, and write high-converting ad headlines. You receive full reporting dashboards."
    ],
    deliverables: [
      "Google Search keyword research mapping and bidding strategy setup",
      "Meta Ads Pixel conversion tracking integration and test logs",
      "High-converting ad copy headlines and description variants",
      "Audience demographic targeting blueprints (custom / lookalikes)",
      "Setups for UTM parameter link structures and GTM events",
      "Comprehensive weekly performance reporting dashboard layout"
    ],
    packages: {
      basic: {
        name: 'Single Ad Setup',
        price: 'PKR 11,000',
        desc: 'Setup of a single Google Search ad campaign or Meta ad set with basic audience parameters and keywords.',
        delivery: '4 Days Delivery',
        revisions: '3 Revisions',
        includes: ['1 Paid Campaign Setup', 'Audience Demographics Setup', '10 Search Keywords Map', 'Ad Copy Writing']
      },
      standard: {
        name: 'Growth Ads System',
        price: 'PKR 22,000',
        desc: 'Advanced campaign configurations on Google & Meta, conversion tracker setups, pixel integration, and weekly optimization.',
        delivery: '7 Days Delivery',
        revisions: '5 Revisions',
        includes: ['Google & Meta Setup', 'Pixel Tracking Integration', 'Conversion Tagging Setup', 'Weekly Ads Tuning', 'Competitor Ad Copy Analysis']
      },
      premium: {
        name: 'Elite Advertising Scaling',
        price: 'PKR 44,000',
        desc: 'Complete ad account management. Funnel restructuring, A/B ad creative testing, conversion audits, and Slack channel updates.',
        delivery: '12 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Unlimited Campaign Setups', 'A/B Creative Ad Testing', 'ROAS Optimization Blueprint', 'GTM Conversion Audits', 'VIP Slack Performance Reports']
      }
    },
    reviews: [
      { name: 'Kashif Mehmood', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'Kiran restructured our Meta Ads account. Within two weeks, our conversion rates doubled while maintaining the exact same daily budget. Excellent communicator!' },
      { name: 'Saima Khan', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f1.png', text: 'Highly recommend! Her keywords targeting strategy on Google Search brought in high-quality enterprise leads.' }
    ]
  },
  'usman-khalid': {
    name: 'Usman Khalid',
    level: 'Level 2 Seller',
    sellerLevel: 'Level 2 Seller',
    rating: '4.7',
    reviewsCount: 38,
    avatar: '../images/avatar_m2.png',
    bannerClass: 'banner-motion',
    bannerTitle: 'Design Premium 3D Motion Logos & Typography Hooks',
    bannerDesc: '3D Logo Animation | Kinetic Text Loops | Blender & After Effects',
    serviceTitle: 'Design Premium 3D Motion Logos & Typography Hooks',
    profileDetails: {
      from: 'Sialkot, Pakistan',
      memberSince: 'Sep 2022',
      avgResponse: '2 hours',
      lastDelivery: '2 days ago'
    },
    headline: '3D Motion Designer & Blender Artist',
    aboutMe: [
      "Hello! I am Usman, a motion graphics designer focusing on Blender 3D modeling, dynamic logo intros, and kinetic title sequences.",
      "I design premium visual assets, render high-speed loop animations, and compile fluid transitions that make tech branding stand out."
    ],
    skills: ['Blender 3D', 'After Effects', '3D Logo Animation', 'Kinetic Typography', 'Motion Graphics', 'Sound Effects', 'Logo Design'],
    experience: [
      { period: 'Dec 2023 - Present', title: '3D Animation Specialist — Sialkot Graphics Studio', desc: 'Rendered commercial motion logo assets. Structured product packaging rotation models in Blender.' },
      { period: 'Jul 2022 - Nov 2023', title: 'Junior Motion Designer — ApexVFX Online', desc: 'Assembled kinetic text templates, animated banners transitions, and cleaned rendering files.' }
    ],
    portfolio: [
      { bannerClass: 'banner-motion', type: '3D Animation', title: 'CyberNet 3D Rotating Logo Reveal', desc: 'A futuristic rotating wireframe logo assembling with neon light streaks and metallic reflections.' },
      { bannerClass: 'banner-video', type: 'Text Motion', title: 'VeloFlow Launch Kinetic Intro', desc: 'High-energy kinetic typography opening sequence promoting a product release.' }
    ],
    descriptionParagraphs: [
      "Need a premium 3D logo reveal or a kinetic typography sequence for your web videos, streams, or commercials? I will model, texture, animate, and render custom motion elements in Blender.",
      "I apply custom shaders, synchronize motion to sound beats, render in 4K resolution, and deliver vector formats. Let's make your brand look dynamic!"
    ],
    deliverables: [
      "Custom 3D logo intro animations (Full HD / 4K resolution exports)",
      "Kinetic typography text elements showing product features",
      "Dynamic sound design track sync with matching audio effects",
      "Transparent background video files (.mov format with alpha channel)",
      "Organized source files in Blender (.blend) and After Effects (.aep)",
      "Static 3D rendered logo files in high-resolution PNG format"
    ],
    packages: {
      basic: {
        name: 'Basic 3D Intro (5s)',
        price: 'PKR 8,000',
        desc: '5-second 3D rotating logo intro using standard materials and clean camera zoom movement.',
        delivery: '3 Days Delivery',
        revisions: '3 Revisions',
        includes: ['5-Second Length', 'Standard Shading', '1080p Resolution Export', 'Background Music Loop']
      },
      standard: {
        name: 'Premium Logo Reveal (10s)',
        price: 'PKR 16,000',
        desc: '10-second logo reveal featuring custom metallic/glass shaders, light leak effects, and synchronized sound design.',
        delivery: '5 Days Delivery',
        revisions: '5 Revisions',
        includes: ['10-Second Length', 'Custom Glass / Metallic Shaders', 'Synchronized Sound Design', 'Transparent Alpha Channel export']
      },
      premium: {
        name: 'Enterprise Motion Bundle',
        price: 'PKR 32,000',
        desc: '2 logo variants (15s), custom kinetic title loops, sound effects, Blender source file delivery, and unlimited modifications.',
        delivery: '8 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['2 Motion Logo Variants', 'Kinetic Title Loop Asset', 'Sound Effects Library Sync', 'Blender (.blend) Source Files', 'VIP Support']
      }
    },
    reviews: [
      { name: 'Zaheer Abbas', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'Usman designed a stunning 3D intro for our tech channel. The metallic texture reflections and camera transitions look premium. Outstanding speed!' },
      { name: 'Maria Khan', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f2.png', text: 'Stunning Blender renders! Fast delivery, great communication, and followed instructions exactly. Will hire again.' }
    ]
  },
  'talha-siddiqui': {
    name: 'Talha Siddiqui',
    level: 'Pro Verified',
    sellerLevel: 'Pro Verified',
    rating: '5.0',
    reviewsCount: 31,
    avatar: '../images/avatar_m2.png',
    bannerClass: 'banner-mobile',
    bannerTitle: 'iOS & Android App Development with React Native',
    bannerDesc: 'React Native Code | App Store Submission | Push Notifications | Maps API',
    serviceTitle: 'Develop React Native Mobile Apps for AppStore & PlayStore',
    profileDetails: {
      from: 'Islamabad, Pakistan',
      memberSince: 'Mar 2022',
      avgResponse: '1 hour',
      lastDelivery: '1 day ago'
    },
    headline: 'Principal Mobile Software Engineer & React Native Lead',
    aboutMe: [
      "Hello! I am Talha, a senior mobile engineer specializing in cross-platform React Native development, iOS/Android deployments, and push notification configurations.",
      "I write clean, modular JavaScript/TypeScript, design secure local database storage layers (WatermelonDB, SQLite), and integrate location services and payment APIs."
    ],
    skills: ['React Native', 'iOS & Android SDKs', 'TypeScript', 'Redux / Zustand', 'Push Notifications', 'Google Maps API', 'App Store Deployments'],
    experience: [
      { period: 'Jan 2024 - Present', title: 'Senior Mobile Architect — Capital AppLabs', desc: 'Architected React Native e-commerce and taxi booking apps. Integrated real-time tracking and offline data caching.' },
      { period: 'Jun 2022 - Dec 2023', title: 'React Native Developer — SoftSphere Islamabad', desc: 'Developed modular interface components, integrated payment APIs, and managed beta deployments via TestFlight.' }
    ],
    portfolio: [
      { bannerClass: 'banner-mobile', type: 'Mobile App', title: 'VeloRide Real-Time Cab Application', desc: 'Cross-platform app featuring live Google map routing, driver dispatch lists, and secure payment setups.' },
      { bannerClass: 'banner-web', type: 'App UI Kit', title: 'Nexus App Framework UI system', desc: 'Highly optimized visual React Native component library supporting native iOS and Android widgets.' }
    ],
    descriptionParagraphs: [
      "Need a modern, fast, and responsive mobile application that runs seamlessly on both iOS and Android platforms? I will develop and deploy your cross-platform React Native application.",
      "I write clean, optimized TypeScript, set up push notification systems, integrate Google Maps, configure state stores (Zustand/Redux), and handle AppStore and PlayStore listing registrations. Let's launch your app!"
    ],
    deliverables: [
      "Cross-platform React Native application source code (iOS and Android)",
      "Interactive map overlays and location tracking APIs",
      "Push notification systems (Firebase Cloud Messaging / APNS)",
      "Secure local storage configurations and API state cache setups",
      "Full assistance in publishing apps to AppStore & Google PlayStore",
      "Thorough unit test scripts verifying application views and state"
    ],
    packages: {
      basic: {
        name: 'Basic App Prototype',
        price: 'PKR 25,000',
        desc: '3-screen mock application using static React Native layouts. Navigation, color themes, and source code.',
        delivery: '5 Days Delivery',
        revisions: '3 Revisions',
        includes: ['3 Application Screens', 'Standard Navigation Flow', 'Cross-Platform Build test', 'Source Code Folder']
      },
      standard: {
        name: 'Advanced API Integration',
        price: 'PKR 50,000',
        desc: '8-screen application with full REST API integration, user signup forms, secure local storage, and push notifications.',
        delivery: '9 Days Delivery',
        revisions: '5 Revisions',
        includes: ['8 Interactive Screens', 'REST API Integration', 'Push Notification Setup', 'Local Data Caching', 'Google Maps Overlays']
      },
      premium: {
        name: 'Elite Production Launch',
        price: 'PKR 100,000',
        desc: 'Complete app (unlimited pages). Staging db sync, social auth, payment checkout, app publishing assistance, and support.',
        delivery: '15 Days Delivery',
        revisions: 'Unlimited Revisions',
        includes: ['Full Mobile SaaS Codebase', 'Social Sign-in (Apple / Google)', 'Stripe Payment SDK setup', 'AppStore & PlayStore Publishing', '3 Months Support']
      }
    },
    reviews: [
      { name: 'Asif Chaudhry', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_m1.png', text: 'Talha delivered a top-notch React Native app. The performance feels native on both my iPhone 15 and Samsung test devices. Excellent developer!' },
      { name: 'Kiran Raza', country: 'Pakistan', stars: '★★★★★', avatar: '../images/avatar_f2.png', text: 'Highly recommend for mobile development. He walked us through the App Store and Play Store review processes smoothly.' }
    ]
  }
};

function setupDynamicServiceDetails() {
  const container = document.querySelector('.service-details-page');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'sana-malik';
  const freelancer = FREELANCERS_DATA[id] || FREELANCERS_DATA['sana-malik'];

  // Update Page title
  document.title = `${freelancer.serviceTitle} | ApexLance`;

  // Update breadcrumb category
  const activeBreadcrumb = container.querySelector('.breadcrumb-nav span');
  if (activeBreadcrumb) {
    let categoryName = 'Web Development';
    if (freelancer.bannerClass === 'banner-ai') categoryName = 'AI / LLM Programming';
    if (freelancer.bannerClass === 'banner-design') categoryName = 'Graphic Design';
    if (freelancer.bannerClass === 'banner-video') categoryName = 'Video & Animation';
    if (freelancer.bannerClass === 'banner-writing') categoryName = 'Writing & Translation';
    if (freelancer.bannerClass === 'banner-marketing') categoryName = 'Digital Marketing';
    if (freelancer.bannerClass === 'banner-web3') categoryName = 'Web3 Development';
    if (freelancer.bannerClass === 'banner-uiux') categoryName = 'UI/UX Design';
    if (freelancer.bannerClass === 'banner-data') categoryName = 'Data Engineering';
    if (freelancer.bannerClass === 'banner-ads') categoryName = 'Advertising';
    if (freelancer.bannerClass === 'banner-motion') categoryName = 'Motion Graphics';
    if (freelancer.bannerClass === 'banner-mobile') categoryName = 'Mobile Development';
    activeBreadcrumb.textContent = categoryName;
  }

  // Update title
  const titleEl = container.querySelector('.details-gig-title');
  if (titleEl) titleEl.textContent = freelancer.serviceTitle;

  // Update author details
  const avatarImg = container.querySelector('.details-author-row .author-avatar img');
  if (avatarImg) {
    avatarImg.src = freelancer.avatar;
    avatarImg.alt = freelancer.name;
  }
  const authorLink = container.querySelector('.details-author-row .author-name-link');
  if (authorLink) {
    authorLink.textContent = freelancer.name;
    authorLink.href = `./profile.html?id=${id}`;
  }
  const authorLevel = container.querySelector('.details-author-row .author-level');
  if (authorLevel) authorLevel.textContent = freelancer.level;

  const ratingStars = container.querySelector('.details-author-row .rating-stars');
  if (ratingStars) ratingStars.textContent = `★ ${freelancer.rating} (${freelancer.reviewsCount} reviews)`;

  // Update Visual Banner
  const bannerGraphic = container.querySelector('.details-banner-graphic');
  if (bannerGraphic) {
    // Reset banner categories class
    bannerGraphic.className = 'details-banner-graphic animate-float';
    bannerGraphic.classList.add(freelancer.bannerClass);
    
    const bannerH2 = bannerGraphic.querySelector('h2');
    if (bannerH2) bannerH2.textContent = freelancer.bannerTitle;
    
    const bannerP = bannerGraphic.querySelector('p');
    if (bannerP) bannerP.textContent = freelancer.bannerDesc;
  }

  // Update Description section
  // It's the first .details-section-content
  const sectionContents = container.querySelectorAll('.details-section-content');
  if (sectionContents.length > 0) {
    const descContainer = sectionContents[0];
    let html = `<h3 class="details-subtitle">About This Service</h3>`;
    freelancer.descriptionParagraphs.forEach(p => {
      html += `<p class="details-paragraph">${p}</p>`;
    });
    html += `<h4 class="features-list-title">What I Will Deliver:</h4>`;
    html += `<ul class="details-features-bullets">`;
    freelancer.deliverables.forEach(item => {
      html += `<li>✔ ${item}</li>`;
    });
    html += `</ul>`;
    descContainer.innerHTML = html;
  }

  // Update reviews
  const reviewsContainer = container.querySelector('.reviews-list');
  if (reviewsContainer) {
    let html = '';
    freelancer.reviews.forEach(review => {
      html += `
        <div class="review-item">
          <div class="review-header">
            <div class="review-avatar">
              <img src="${review.avatar}" alt="${review.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
            </div>
            <div class="review-meta">
              <h5 class="reviewer-name">${review.name}</h5>
              <span class="reviewer-country">${review.country}</span>
            </div>
            <span class="review-stars">${review.stars}</span>
          </div>
          <p class="review-text">
            "${review.text}"
          </p>
        </div>
      `;
    });
    reviewsContainer.innerHTML = html;
  }

  // Update Packages
  const updatePkg = (pkgId, pkgData) => {
    const pkgEl = document.getElementById(pkgId);
    if (!pkgEl) return;
    
    const pkgName = pkgEl.querySelector('.package-name');
    if (pkgName) pkgName.textContent = pkgData.name;
    
    const pkgPrice = pkgEl.querySelector('.package-price');
    if (pkgPrice) pkgPrice.textContent = pkgData.price;
    
    const pkgDesc = pkgEl.querySelector('.package-desc');
    if (pkgDesc) pkgDesc.textContent = pkgData.desc;
    
    const deliveryTime = pkgEl.querySelector('.delivery-time');
    if (deliveryTime) deliveryTime.textContent = `⏱ ${pkgData.delivery}`;
    
    const revisionsCount = pkgEl.querySelector('.revisions-count');
    if (revisionsCount) revisionsCount.textContent = `🔄 ${pkgData.revisions}`;
    
    const includesList = pkgEl.querySelector('.package-includes-list');
    if (includesList) {
      includesList.innerHTML = pkgData.includes.map(inc => `<li>✔ ${inc}</li>`).join('');
    }
  };

  updatePkg('package-basic', freelancer.packages.basic);
  updatePkg('package-standard', freelancer.packages.standard);
  updatePkg('package-premium', freelancer.packages.premium);

  // Update Order/Contact button CTAs
  const orderButton = container.querySelector('.details-sidebar-pricing .btn-primary');
  if (orderButton) {
    orderButton.href = `./contact.html?id=${id}&service=${encodeURIComponent(freelancer.serviceTitle)}`;
  }
}

function setupDynamicProfileDetails() {
  const container = document.querySelector('.seller-profile-page');
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id') || 'sana-malik';
  const freelancer = FREELANCERS_DATA[id] || FREELANCERS_DATA['sana-malik'];

  // Update page title
  document.title = `${freelancer.name} - ${freelancer.headline} | ApexLance`;

  // Update avatar
  const avatarImg = container.querySelector('.profile-avatar-3d img');
  if (avatarImg) {
    avatarImg.src = freelancer.avatar;
    avatarImg.alt = freelancer.name;
  }

  // Update fullname
  const fullnameEl = container.querySelector('.profile-fullname');
  if (fullnameEl) fullnameEl.textContent = freelancer.name;

  // Update headline
  const headlineEl = container.querySelector('.profile-headline');
  if (headlineEl) headlineEl.textContent = freelancer.headline;

  // Update badge row
  const badgeRow = container.querySelector('.profile-badge-row');
  if (badgeRow) {
    badgeRow.innerHTML = `
      <span class="profile-badge">★ ${freelancer.rating} (${freelancer.reviewsCount} reviews)</span>
      <span class="profile-badge">${freelancer.sellerLevel}</span>
    `;
  }

  // Update profile details list values (From, Member since, Avg response, Last delivery)
  const detailVals = container.querySelectorAll('.profile-details-list .detail-val');
  if (detailVals.length >= 4) {
    detailVals[0].textContent = freelancer.profileDetails.from;
    detailVals[1].textContent = freelancer.profileDetails.memberSince;
    detailVals[2].textContent = freelancer.profileDetails.avgResponse;
    detailVals[3].textContent = freelancer.profileDetails.lastDelivery;
  }

  // Update Contact button link and text
  const contactBtn = container.querySelector('.sidebar-inner-card .btn-primary');
  if (contactBtn) {
    contactBtn.textContent = `Contact ${freelancer.name.split(' ')[0]}`;
    contactBtn.href = `./contact.html?id=${id}`;
  }

  // Update main content section cards
  const sectionCards = container.querySelectorAll('.profile-section-card');
  sectionCards.forEach(card => {
    const titleEl = card.querySelector('.section-card-title');
    if (!titleEl) return;
    const titleText = titleEl.textContent.trim().toLowerCase();

    if (titleText === 'about me') {
      const inner = card.querySelector('.section-card-inner');
      let html = `<h3 class="section-card-title">About Me</h3>`;
      freelancer.aboutMe.forEach((p, idx) => {
        html += `<p class="section-card-text" style="${idx > 0 ? 'margin-top: 14px;' : ''}">${p}</p>`;
      });
      inner.innerHTML = html;
    } else if (titleText === 'technical expertise') {
      const badgesContainer = card.querySelector('.skills-grid-badges');
      if (badgesContainer) {
        badgesContainer.innerHTML = freelancer.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
      }
    } else if (titleText === 'experience') {
      const timeline = card.querySelector('.experience-timeline');
      if (timeline) {
        let html = '';
        freelancer.experience.forEach(exp => {
          html += `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="job-period">${exp.period}</span>
                <h4 class="job-title">${exp.title}</h4>
                <p class="job-desc">${exp.desc}</p>
              </div>
            </div>
          `;
        });
        timeline.innerHTML = html;
      }
    } else if (titleText === 'featured project portfolio' || titleText.includes('portfolio')) {
      const portfolioGrid = card.querySelector('.portfolio-grid');
      if (portfolioGrid) {
        let html = '';
        freelancer.portfolio.forEach(project => {
          html += `
            <div class="portfolio-item-card">
              <div class="portfolio-banner ${project.bannerClass}">
                <span>${project.type}</span>
              </div>
              <div class="portfolio-info">
                <h4 class="portfolio-title">${project.title}</h4>
                <p class="portfolio-desc">${project.desc}</p>
              </div>
            </div>
          `;
        });
        portfolioGrid.innerHTML = html;
      }
    }
  });
}
