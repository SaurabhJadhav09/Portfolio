// Enhanced Modern Portfolio JavaScript with Bug Fixes
'use strict';

// Application Configuration
const CONFIG = {
    THEME_KEY: 'portfolio-theme',
    ANIMATION_DURATION: 600,
    SCROLL_OFFSET: 120,
    TYPING_SPEED: 100,
    TYPING_DELETE_SPEED: 50,
    TYPING_PAUSE: 2000,
    LOADING_DURATION: 1500,
    DEBOUNCE_DELAY: 16,
    API_ENDPOINTS: {
        contact: '/api/contact'
    }
};

// Utility Functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight - offset) &&
            rect.bottom >= offset &&
            rect.left <= window.innerWidth &&
            rect.right >= 0
        );
    },

    smoothScrollTo(element, offset = CONFIG.SCROLL_OFFSET) {
        const targetPosition = element.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        };

        const animation = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / 800, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    },

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    storage: {
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch {
                return defaultValue;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        }
    }
};

// Fixed Theme Manager
class ThemeManager {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.themeToggle = null;
        this.themeIcon = null;
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.init();
    }

    getInitialTheme() {
        const savedTheme = Utils.storage.get(CONFIG.THEME_KEY);
        if (savedTheme) return savedTheme;
        
        return this.mediaQuery.matches ? 'dark' : 'light';
    }

    init() {
        // Wait for DOM elements to be available
        this.waitForElements().then(() => {
            this.setupElements();
            this.setTheme(this.currentTheme, false);
            this.setupEventListeners();
        });
    }

    async waitForElements() {
        return new Promise((resolve) => {
            const checkElements = () => {
                this.themeToggle = document.getElementById('themeToggle');
                this.themeIcon = document.getElementById('themeIcon');
                
                if (this.themeToggle && this.themeIcon) {
                    resolve();
                } else {
                    setTimeout(checkElements, 100);
                }
            };
            checkElements();
        });
    }

    setupElements() {
        if (this.themeToggle) {
            // Ensure button is properly structured
            this.themeToggle.setAttribute('type', 'button');
            this.themeToggle.setAttribute('aria-label', 'Toggle dark mode');
        }
    }

    setupEventListeners() {
        // Theme toggle click handler
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });

            // Prevent form submission if button is inside a form
            this.themeToggle.addEventListener('submit', (e) => {
                e.preventDefault();
            });
        }

        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', (e) => {
            if (!Utils.storage.get(CONFIG.THEME_KEY)) {
                this.setTheme(e.matches ? 'dark' : 'light', true);
            }
        });
    }

    setTheme(theme, animate = true) {
        console.log('Setting theme to:', theme);
        
        if (animate) {
            document.documentElement.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.documentElement.style.transition = '';
            }, 300);
        }

        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme); // Also set on body for backup
        this.currentTheme = theme;
        Utils.storage.set(CONFIG.THEME_KEY, theme);

        // Update icon
        if (this.themeIcon) {
            this.themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
        
        console.log('Theme set successfully to:', theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        console.log('Toggling theme from', this.currentTheme, 'to', newTheme);
        this.setTheme(newTheme, true);
    }
}

// Enhanced Navigation Manager
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupScrollSpy();
        this.setupSmoothScrolling();
        this.setupNavbarBackground();
    }

    setupMobileMenu() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.navMenu) {
            this.navMenu.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.hamburger) {
            this.hamburger.classList.toggle('active', this.isMenuOpen);
            this.hamburger.setAttribute('aria-expanded', this.isMenuOpen.toString());
        }

        document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        
        if (this.navMenu) {
            this.navMenu.classList.remove('active');
        }
        
        if (this.hamburger) {
            this.hamburger.classList.remove('active');
            this.hamburger.setAttribute('aria-expanded', 'false');
        }

        document.body.style.overflow = '';
    }

    setupScrollSpy() {
        const scrollHandler = Utils.throttle(() => {
            const scrollPos = window.pageYOffset + CONFIG.SCROLL_OFFSET + 50;

            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    this.updateActiveLink(sectionId);
                }
            });
        }, CONFIG.DEBOUNCE_DELAY);

        window.addEventListener('scroll', scrollHandler);
    }

    updateActiveLink(activeId) {
        this.navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('active', isActive);
            
            if (isActive) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    Utils.smoothScrollTo(targetSection);
                    this.closeMobileMenu();
                    
                    targetSection.setAttribute('tabindex', '-1');
                    targetSection.focus();
                    setTimeout(() => targetSection.removeAttribute('tabindex'), 1000);
                }
            });
        });
    }

    setupNavbarBackground() {
        const scrollHandler = Utils.throttle(() => {
            if (this.navbar) {
                const isScrolled = window.pageYOffset > 50;
                this.navbar.classList.toggle('scrolled', isScrolled);
            }
        }, CONFIG.DEBOUNCE_DELAY);

        window.addEventListener('scroll', scrollHandler);
    }
}

// Fixed Typing Animation
class TypingAnimation {
    constructor() {
        this.element = document.getElementById('typingText');
        this.texts = [
            'Software Developer',
            'Backend Engineer',
            'React Developer',
            'Python Developer',
            'Problem Solver',
            'Tech Enthusiast'
        ];
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isRunning = false;
        this.timeoutId = null;
        
        this.init();
    }

    init() {
        if (this.element) {
            // Wait a bit for page to load, then start
            setTimeout(() => this.start(), 1000);
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log('Starting typing animation');
        this.type();
    }

    stop() {
        this.isRunning = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    type() {
        if (!this.isRunning || !this.element) return;

        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.isDeleting ? CONFIG.TYPING_DELETE_SPEED : CONFIG.TYPING_SPEED;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = CONFIG.TYPING_PAUSE;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        this.timeoutId = setTimeout(() => this.type(), typeSpeed);
    }
}

// Enhanced Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll(
            '.glass-card, .section-title, .hero-stats, .about-card, .skill-category, .project-card, .contact-card'
        );
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupStaggeredAnimations();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = index * 100;
                    
                    setTimeout(() => {
                        entry.target.classList.add('fade-in', 'visible');
                        this.animateCounters(entry.target);
                    }, delay);
                    
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        this.elements.forEach(element => {
            element.classList.add('fade-in');
            this.observer.observe(element);
        });
    }

    setupStaggeredAnimations() {
        const skillTags = document.querySelectorAll('.skill-tag');
        const achievementItems = document.querySelectorAll('.achievements li');
        
        skillTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.1}s`;
        });

        achievementItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.15}s`;
        });
    }

    animateCounters(element) {
        const counters = element.querySelectorAll('.stat-item h3');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            if (target > 0) {
                this.animateCounter(counter, target);
            }
        });
    }

    animateCounter(element, target) {
        const duration = 2000;
        const start = performance.now();
        const suffix = element.textContent.replace(/[\d\s]/g, '');

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(target * this.easeOutCubic(progress));
            
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Fixed Form Handler
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.btnText = null;
        this.btnLoading = null;
        this.fields = {};
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        if (!this.form) return;

        this.setupSubmitButton();
        this.setupFields();
        this.setupValidation();
        this.setupSubmission();
    }

    setupSubmitButton() {
        if (this.submitBtn) {
            // Fix the button content structure
            this.btnText = this.submitBtn.querySelector('.btn-text');
            this.btnLoading = this.submitBtn.querySelector('.btn-loading');
            
            if (!this.btnText) {
                this.submitBtn.innerHTML = `
                    <span class="btn-text">
                        <i class="fas fa-paper-plane" aria-hidden="true"></i>
                        Send Message
                    </span>
                    <span class="btn-loading hidden">
                        <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                        Sending...
                    </span>
                `;
                this.btnText = this.submitBtn.querySelector('.btn-text');
                this.btnLoading = this.submitBtn.querySelector('.btn-loading');
            }
        }
    }

    setupFields() {
        ['name', 'email', 'subject', 'message'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            const error = document.getElementById(`${fieldName}Error`);
            
            if (field) {
                this.fields[fieldName] = { element: field, error };
                
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });
    }

    setupValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters only, min 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                minLength: 5,
                message: 'Subject must be at least 5 characters long'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Message must be at least 10 characters long'
            }
        };
    }

    setupSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const rules = this.validationRules[fieldName];
        
        if (!field || !rules) return true;

        const value = field.element.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (rules.required && !value) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        } else if (rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.message;
        } else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.message;
        }

        this.setFieldError(fieldName, errorMessage);
        return isValid;
    }

    setFieldError(fieldName, message) {
        const field = this.fields[fieldName];
        if (!field) return;

        const formGroup = field.element.closest('.form-group');
        
        if (message) {
            formGroup.classList.add('error');
            if (field.error) {
                field.error.textContent = message;
                field.error.classList.add('show');
            }
            field.element.setAttribute('aria-invalid', 'true');
        } else {
            formGroup.classList.remove('error');
            if (field.error) {
                field.error.classList.remove('show');
            }
            field.element.setAttribute('aria-invalid', 'false');
        }
    }

    clearFieldError(fieldName) {
        this.setFieldError(fieldName, '');
    }

    validateForm() {
        let isValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (this.isSubmitting) return;

        const isValid = this.validateForm();
        if (!isValid) {
            this.showNotification('Please fix the errors before submitting.', 'error');
            return;
        }

        this.setSubmittingState(true);

        try {
            const formData = this.getFormData();
            await this.simulateSubmission(formData);
            this.showSuccessMessage(formData);
            this.resetForm();
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            this.setSubmittingState(false);
        }
    }

    getFormData() {
        return Object.keys(this.fields).reduce((data, fieldName) => {
            data[fieldName] = this.fields[fieldName].element.value.trim();
            return data;
        }, {});
    }

    async simulateSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    }

    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        
        if (this.submitBtn) {
            this.submitBtn.disabled = isSubmitting;
        }
        
        if (this.btnText && this.btnLoading) {
            this.btnText.classList.toggle('hidden', isSubmitting);
            this.btnLoading.classList.toggle('hidden', !isSubmitting);
        }
    }

    showSuccessMessage(data) {
        const modal = this.createModal({
            title: 'Message Sent Successfully!',
            content: `
                <div class="success-content">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <p>Thank you <strong>${data.name}</strong> for reaching out!</p>
                    <p>I'll get back to you as soon as possible.</p>
                </div>
            `,
            type: 'success'
        });

        document.body.appendChild(modal);
        setTimeout(() => modal.remove(), 5000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type} glass-card`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            padding: 16px 20px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    createModal({ title, content, type = 'info' }) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        [closeBtn, overlay].forEach(element => {
            element.addEventListener('click', () => modal.remove());
        });

        return modal;
    }

    resetForm() {
        this.form.reset();
        Object.keys(this.fields).forEach(fieldName => {
            this.clearFieldError(fieldName);
        });
    }
}

// Fixed Modal Handler
class ModalHandler {
    constructor() {
        this.modals = new Map();
        this.init();
    }

    init() {
        this.setupCertificationsModal();
        this.setupGlobalModalControls();
    }

    setupCertificationsModal() {
        const modal = document.getElementById('certificationsModal');
        const openBtn = document.getElementById('certificationsBtn');
        const closeBtn = document.getElementById('closeModal');

        if (modal && openBtn) {
            console.log('Setting up certifications modal');
            
            this.modals.set('certifications', {
                element: modal,
                openBtn,
                closeBtn
            });

            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Opening certifications modal');
                this.openModal('certifications');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal('certifications');
                });
            }

            modal.addEventListener('click', (e) => {
                if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                    this.closeModal('certifications');
                }
            });
        } else {
            console.log('Modal elements not found:', { modal: !!modal, openBtn: !!openBtn });
        }
    }

    setupGlobalModalControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        window.addEventListener('modalOpened', (e) => {
            const modal = e.detail.modal;
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        });
    }

    openModal(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) {
            console.log('Modal not found:', modalId);
            return;
        }

        const { element } = modalData;
        console.log('Opening modal:', modalId);
        
        element.classList.remove('hidden');
        element.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        window.dispatchEvent(new CustomEvent('modalOpened', { 
            detail: { modal: element, modalId } 
        }));

        requestAnimationFrame(() => {
            element.style.animation = 'fadeIn 0.3s ease';
        });
    }

    closeModal(modalId) {
        const modalData = this.modals.get(modalId);
        if (!modalData) return;

        const { element, openBtn } = modalData;
        
        element.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            element.classList.add('hidden');
            element.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            if (openBtn) {
                openBtn.focus();
            }
        }, 300);
    }

    closeAllModals() {
        this.modals.forEach((_, modalId) => {
            this.closeModal(modalId);
        });
    }
}

// Fixed Project Filter System
class ProjectFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.activeFilter = 'all';
        
        this.init();
    }

    init() {
        console.log('Initializing project filter with', this.filterBtns.length, 'buttons and', this.projectCards.length, 'cards');
        this.setupFilterButtons();
        this.setupInitialState();
    }

    setupFilterButtons() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');
                console.log('Filter clicked:', filter);
                this.setActiveFilter(filter);
            });
        });
    }

    setupInitialState() {
        this.updateFilterButtons();
        this.filterProjects();
    }

    setActiveFilter(filter) {
        if (this.activeFilter === filter) return;
        
        console.log('Setting active filter to:', filter);
        this.activeFilter = filter;
        this.updateFilterButtons();
        this.filterProjects();
    }

    updateFilterButtons() {
        this.filterBtns.forEach(btn => {
            const isActive = btn.getAttribute('data-filter') === this.activeFilter;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive.toString());
        });
    }

    filterProjects() {
        console.log('Filtering projects with filter:', this.activeFilter);
        
        this.projectCards.forEach((card, index) => {
            const categories = card.getAttribute('data-category');
            console.log('Card categories:', categories);
            
            const categoryList = categories ? categories.split(' ') : [];
            const shouldShow = this.activeFilter === 'all' || categoryList.includes(this.activeFilter);
            
            console.log('Should show card:', shouldShow, 'for categories:', categoryList);
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Fixed Back to Top Button
class BackToTopButton {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.isVisible = false;
        
        this.init();
    }

    init() {
        if (!this.button) {
            console.log('Back to top button not found, creating one...');
            this.createButton();
        }
        
        this.setupScrollListener();
        this.setupClickHandler();
        console.log('Back to top button initialized');
    }

    createButton() {
        this.button = document.createElement('button');
        this.button.id = 'backToTop';
        this.button.className = 'back-to-top glass-btn';
        this.button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
        this.button.setAttribute('aria-label', 'Back to top');
        this.button.setAttribute('title', 'Back to top');
        
        // Add styles directly to ensure visibility
        this.button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            cursor: pointer;
        `;
        
        document.body.appendChild(this.button);
        console.log('Back to top button created and added to DOM');
    }

    setupScrollListener() {
        const scrollHandler = Utils.throttle(() => {
            const shouldShow = window.pageYOffset > 300;
            
            if (shouldShow !== this.isVisible) {
                this.isVisible = shouldShow;
                console.log('Back to top button visibility:', this.isVisible);
                
                if (this.button) {
                    this.button.style.opacity = this.isVisible ? '1' : '0';
                    this.button.style.visibility = this.isVisible ? 'visible' : 'hidden';
                    this.button.style.transform = this.isVisible ? 'translateY(0)' : 'translateY(10px)';
                }
            }
        }, 100);

        window.addEventListener('scroll', scrollHandler);
    }

    setupClickHandler() {
        if (this.button) {
            this.button.addEventListener('click', (e) => {
                e.preventDefault();
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                const homeSection = document.querySelector('#home');
                if (homeSection) {
                    setTimeout(() => {
                        homeSection.focus();
                    }, 500);
                }
            });
        }
    }
}

// Loading Screen Manager
class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.isLoaded = false;
        
        this.init();
    }

    init() {
        if (!this.loadingScreen) return;

        this.show();

        if (document.readyState === 'complete') {
            this.hide();
        } else {
            window.addEventListener('load', () => {
                setTimeout(() => this.hide(), CONFIG.LOADING_DURATION);
            });
        }
    }

    show() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
    }

    hide() {
        if (this.loadingScreen && !this.isLoaded) {
            this.isLoaded = true;
            this.loadingScreen.classList.add('hidden');
            
            setTimeout(() => {
                if (this.loadingScreen.parentNode) {
                    this.loadingScreen.remove();
                }
            }, 500);

            window.dispatchEvent(new CustomEvent('pageLoaded'));
        }
    }
}

// Resume Download Handler
class ResumeHandler {
    constructor() {
        this.resumeBtn = document.getElementById('resumeBtn');
        this.init();
    }

    init() {
        if (this.resumeBtn) {
            this.resumeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadResume();
            });
        }
    }

    downloadResume() {
        const resumeData = this.generateResumeData();
        this.showResumeModal(resumeData);
    }

    generateResumeData() {
        return {
            name: 'Saurabh Jadhav',
            title: 'Software Developer',
            email: 'sidr092003@gmail.com',
            phone: '+91 9137359926',
            location: 'Mumbai, India',
            linkedin: 'https://linkedin.com/in/saurabh-pravin-jadhav',
            github: 'https://github.com/SaurabhJadhav09'
        };
    }

    showResumeModal(data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content glass-card">
                <div class="modal-header">
                    <h3>Download Resume</h3>
                    <button class="modal-close" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="resume-preview">
                        <div class="resume-info">
                            <i class="fas fa-file-pdf" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                            <h4>${data.name} - Resume</h4>
                            <p>Click below to download my latest resume in PDF format.</p>
                        </div>
                        <div class="resume-actions">
                            <button class="glass-btn primary" id="downloadPDF">
                                <i class="fas fa-download"></i>
                                Download PDF
                            </button>
                            <button class="glass-btn secondary" id="viewOnline">
                                <i class="fas fa-eye"></i>
                                View Online
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .resume-preview {
                text-align: center;
                padding: 2rem;
            }
            .resume-info h4 {
                color: var(--text-primary);
                margin-bottom: 1rem;
            }
            .resume-info p {
                color: var(--text-secondary);
                margin-bottom: 2rem;
            }
            .resume-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        [closeBtn, overlay].forEach(el => {
            el.addEventListener('click', () => {
                modal.remove();
                style.remove();
            });
        });

        modal.querySelector('#downloadPDF').addEventListener('click', () => {
            this.simulateDownload();
            modal.remove();
            style.remove();
        });

        modal.querySelector('#viewOnline').addEventListener('click', () => {
            window.open('https://linkedin.com/in/saurabh-pravin-jadhav', '_blank');
        });
    }

    simulateDownload() {
        const notification = document.createElement('div');
        notification.className = 'notification glass-card';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-download"></i>
                <span>Resume download started...</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            padding: 16px 20px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.querySelector('span').textContent = 'Resume ready for download!';
            notification.querySelector('i').className = 'fas fa-check-circle';
        }, 1500);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        this.observePerformance();
        this.optimizeImages();
        this.preloadCriticalResources();
    }

    observePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        this.metrics = {
                            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            firstPaint: this.getFirstPaint(),
                            largestContentfulPaint: this.getLCP()
                        };
                        
                        console.log('Performance Metrics:', this.metrics);
                    }
                }, 0);
            });
        }
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : 0;
    }

    getLCP() {
        return new Promise((resolve) => {
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                resolve(lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    preloadCriticalResources() {
        const criticalResources = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }
}

// Main Application Class
class PortfolioApp {
    constructor() {
        this.components = new Map();
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        if (this.isInitialized) return;

        try {
            console.log('Initializing portfolio components...');
            
            // Initialize components in order
            this.components.set('loading', new LoadingManager());
            this.components.set('theme', new ThemeManager());
            this.components.set('navigation', new NavigationManager());
            this.components.set('typing', new TypingAnimation());
            this.components.set('scrollAnimations', new ScrollAnimations());
            this.components.set('form', new FormHandler());
            this.components.set('modal', new ModalHandler());
            this.components.set('projectFilter', new ProjectFilter());
            this.components.set('backToTop', new BackToTopButton());
            this.components.set('resume', new ResumeHandler());
            this.components.set('performance', new PerformanceMonitor());

            this.isInitialized = true;
            this.setupGlobalEvents();
            
            console.log('✅ Portfolio application initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing application:', error);
        }
    }

    setupGlobalEvents() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.components.get('typing')?.stop();
            } else {
                this.components.get('typing')?.start();
            }
        });

        window.addEventListener('online', () => {
            console.log('✅ Connection restored');
        });

        window.addEventListener('offline', () => {
            console.log('⚠️ Connection lost');
        });

        this.addCustomAnimations();
    }

    addCustomAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes fadeInUp {
                from { 
                    opacity: 0; 
                    transform: translateY(30px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            .notification {
                --notification-bg: var(--glass-bg);
                --notification-border: var(--glass-border);
                background: var(--notification-bg);
                border: 1px solid var(--notification-border);
                border-radius: var(--border-radius);
                backdrop-filter: var(--backdrop-blur);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                color: var(--text-primary);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-muted);
                cursor: pointer;
                padding: 4px;
                margin-left: auto;
            }
            
            .success-content {
                text-align: center;
                padding: 2rem;
            }
            
            .success-icon {
                font-size: 4rem;
                color: var(--success-color);
                margin-bottom: 1rem;
            }
        `;
        
        document.head.appendChild(style);
    }

    getComponent(name) {
        return this.components.get(name);
    }

    destroy() {
        this.components.forEach(component => {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        this.components.clear();
        this.isInitialized = false;
    }
}

// Initialize the application
const app = new PortfolioApp();

// Expose app globally for debugging
if (typeof window !== 'undefined') {
    window.PortfolioApp = app;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}