document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================================
    // 1. STICKY NAVBAR, SCROLL SPY & MOBILE MENU DRAWER
    // ==========================================================================

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.getElementById('backToTop');

    // Sticky navbar transition (>40px) & Back to Top visibility (>300px)
    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        if (scrollY > 40) {
            if (navbar) navbar.classList.add('scrolled');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
        }

        if (scrollY > 300) {
            if (backToTopBtn) backToTopBtn.classList.add('is-visible');
        } else {
            if (backToTopBtn) backToTopBtn.classList.remove('is-visible');
        }
    });

    // Back to top click smooth scroll
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile menu toggle & body scroll lock
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open', navLinks.classList.contains('active'));
        });
    }

    // Auto-close menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Keyboard Escape closes mobile drawer
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            if (hamburger) hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // ScrollSpy active link highlights
    function scrollSpy() {
        const currentScroll = window.scrollY + 140;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', scrollSpy);

    // ==========================================================================
    // 2. UNIVERSAL SECTION REVEAL SYSTEM & TIMELINE SCALING
    // ==========================================================================

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const timelineElement = document.querySelector('.experience-timeline');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));

        if (timelineElement) {
            const timelineObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.2
            });

            timelineObserver.observe(timelineElement);
        }
    } else {
        // Fallback for environments without IntersectionObserver
        revealElements.forEach(el => el.classList.add('is-visible'));
        if (timelineElement) timelineElement.classList.add('is-visible');
    }

    // ==========================================================================
    // 3. PROJECT CATEGORY FILTERING (ALL, BACKEND, AI, FULL-STACK)
    // ==========================================================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const filterableProjects = document.querySelectorAll('[data-category]');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const targetFilter = this.getAttribute('data-filter');

            filterableProjects.forEach(project => {
                const categories = project.getAttribute('data-category').split(' ');

                if (targetFilter === 'all' || categories.includes(targetFilter)) {
                    project.style.display = '';
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (project.style.opacity === '0') {
                            project.style.display = 'none';
                        }
                    }, 200);
                }
            });
        });
    });

    // ==========================================================================
    // 4. LIGHTBOX GALLERY MODAL FOR RECOGNITION SECTION
    // ==========================================================================

    const modal = document.getElementById('imageModal');
    if (modal) {
        const modalImage = document.getElementById('modalImage');
        const closeBtn = document.getElementById('modalClose');
        const prevBtn = document.getElementById('modalPrev');
        const nextBtn = document.getElementById('modalNext');
        const galleryItems = document.querySelectorAll('.gallery-item');

        let currentImageIndex = 0;
        let images = [];

        galleryItems.forEach((item, index) => {
            const imgSrc = item.getAttribute('data-image');
            if (imgSrc) {
                images.push(imgSrc);
            }
            item.addEventListener('click', () => openModal(index));
        });

        function openModal(index) {
            if (index < 0 || index >= images.length) return;
            currentImageIndex = index;
            modalImage.src = images[currentImageIndex];
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            modalImage.src = images[currentImageIndex];
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            modalImage.src = images[currentImageIndex];
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }

    // ==========================================================================
    // 5. HYPER-CREATIVE CELESTIAL ECLIPSE THEME ENGINE WITH RADIAL WAVE
    // ==========================================================================

    const themeToggleBtn = document.getElementById('themeToggle');

    function getStoredTheme() {
        const stored = localStorage.getItem('theme_preference');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme, animate = false, event = null) {
        const targetTheme = theme === 'light' ? 'light' : 'dark';
        const isLight = targetTheme === 'light';

        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('data-tooltip', isLight ? 'Obsidian Dark' : 'Solar Alabaster');
            themeToggleBtn.setAttribute('aria-label', isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode');
        }

        if (!animate || !event) {
            if (isLight) {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            localStorage.setItem('theme_preference', targetTheme);
            return;
        }

        // Calculate wave center coordinates
        const rect = themeToggleBtn ? themeToggleBtn.getBoundingClientRect() : { left: window.innerWidth / 2, top: 40, width: 40, height: 40 };
        const clickX = (event && event.clientX) ? event.clientX : (rect.left + rect.width / 2);
        const clickY = (event && event.clientY) ? event.clientY : (rect.top + rect.height / 2);

        const maxRadius = Math.hypot(
            Math.max(clickX, window.innerWidth - clickX),
            Math.max(clickY, window.innerHeight - clickY)
        );

        const wave = document.createElement('div');
        wave.className = 'theme-ripple-wave';
        wave.style.left = clickX + 'px';
        wave.style.top = clickY + 'px';
        wave.style.width = '0px';
        wave.style.height = '0px';
        wave.style.backgroundColor = isLight ? '#F6F7FB' : '#07080D';
        wave.style.opacity = '1';

        document.body.appendChild(wave);
        wave.getBoundingClientRect(); // trigger reflow

        wave.style.width = (maxRadius * 2.2) + 'px';
        wave.style.height = (maxRadius * 2.2) + 'px';

        setTimeout(() => {
            if (isLight) {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            localStorage.setItem('theme_preference', targetTheme);
        }, 300);

        setTimeout(() => {
            wave.style.opacity = '0';
            setTimeout(() => {
                if (wave.parentNode) wave.parentNode.removeChild(wave);
            }, 400);
        }, 750);
    }

    // Set initial theme without animation
    const initialTheme = getStoredTheme();
    applyTheme(initialTheme, false);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function (e) {
            const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const nextTheme = activeTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme, true, e);
        });
    }

    // ==========================================================================
    // 6. CONTACT FORM SUBMISSION TO GOOGLE SHEETS (VIA GOOGLE APPS SCRIPT WEB APP)
    // ==========================================================================

    const contactForm = document.getElementById('contactForm');

    /**
     * CONFIGURATION:
     * Paste your deployed Google Apps Script Web App URL below (starts with https://script.google.com/macros/s/.../exec)
     */
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzgeQPspwHhsUlsJkunM2PBsiDxKJGEdVNhXcMGtTGsDWAuxdomPjQ15Xek8GZrcZk/exec';

    if (contactForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        const honeypotInput = document.getElementById('contact_company');
        const submitBtn = document.getElementById('contactSubmitBtn');
        const statusBox = document.getElementById('contactStatus');

        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const messageError = document.getElementById('messageError');

        // RFC 5322 standard email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        function setFieldError(input, errorElement, hasError, customMsg) {
            const formGroup = input ? input.closest('.form-group') : null;
            if (hasError) {
                if (formGroup) formGroup.classList.add('has-error');
                if (errorElement) {
                    if (customMsg) errorElement.textContent = customMsg;
                    errorElement.style.display = 'block';
                }
            } else {
                if (formGroup) formGroup.classList.remove('has-error');
                if (errorElement) errorElement.style.display = 'none';
            }
        }

        function clearFieldErrors() {
            setFieldError(nameInput, nameError, false);
            setFieldError(emailInput, emailError, false);
            setFieldError(messageInput, messageError, false);
        }

        function showStatus(type, message, iconClass) {
            if (!statusBox) return;
            statusBox.className = `contact-status ${type}`;
            statusBox.innerHTML = `
                <i class="${iconClass}"></i>
                <div>${message}</div>
            `;
            statusBox.style.display = 'flex';
        }

        function hideStatus() {
            if (!statusBox) return;
            statusBox.style.display = 'none';
            statusBox.innerHTML = '';
        }

        // Live error clearing as user types
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                if (nameInput.value.trim()) setFieldError(nameInput, nameError, false);
            });
        }
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailRegex.test(emailInput.value.trim())) setFieldError(emailInput, emailError, false);
            });
        }
        if (messageInput) {
            messageInput.addEventListener('input', () => {
                if (messageInput.value.trim()) setFieldError(messageInput, messageError, false);
            });
        }

        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            clearFieldErrors();
            hideStatus();

            const nameVal = nameInput ? nameInput.value.trim() : '';
            const emailVal = emailInput ? emailInput.value.trim() : '';
            const messageVal = messageInput ? messageInput.value.trim() : '';
            const honeypotVal = honeypotInput ? honeypotInput.value.trim() : '';

            // 1. Client-Side Input Validation
            let isValid = true;

            if (!nameVal) {
                setFieldError(nameInput, nameError, true, 'Please enter your name.');
                isValid = false;
            }

            if (!emailVal) {
                setFieldError(emailInput, emailError, true, 'Please enter your email.');
                isValid = false;
            } else if (!emailRegex.test(emailVal)) {
                setFieldError(emailInput, emailError, true, 'Please enter a valid email address.');
                isValid = false;
            }

            if (!messageVal) {
                setFieldError(messageInput, messageError, true, 'Please enter your message.');
                isValid = false;
            }

            if (!isValid) {
                showStatus(
                    'error',
                    'Please fill in all required fields with valid information.',
                    'fa-solid fa-circle-exclamation'
                );
                return;
            }

            // 2. Spam Honeypot Trap
            // If filled by a bot, silently fake success without sending to Google Sheets
            if (honeypotVal !== '') {
                showStatus(
                    'success',
                    'Thank you! Your message has been sent successfully.',
                    'fa-solid fa-circle-check'
                );
                contactForm.reset();
                return;
            }

            // 3. Configuration Check
            if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes('PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) {
                showStatus(
                    'warning',
                    'Google Apps Script Web App URL is not configured yet. Please deploy your Google Apps Script and update <code>GOOGLE_SCRIPT_URL</code> in <code>js/main.js</code>.',
                    'fa-solid fa-triangle-exclamation'
                );
                return;
            }

            // 4. Loading State
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="btn-spinner"></span>
                <span>SENDING...</span>
            `;

            try {
                // Cross-Origin submission strategy for Google Apps Script Web App:
                // Send JSON payload as 'text/plain;charset=utf-8' (CORS simple request)
                // This avoids the browser sending an OPTIONS preflight request that Google Apps Script does not support.
                const payload = {
                    name: nameVal,
                    email: emailVal,
                    message: messageVal,
                    _gotcha: honeypotVal
                };

                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8'
                    },
                    body: JSON.stringify(payload)
                });

                let result;
                try {
                    result = await response.json();
                } catch (parseError) {
                    result = { status: response.ok ? 'success' : 'error' };
                }

                if (result && result.status === 'success') {
                    // Confirmed Success
                    showStatus(
                        'success',
                        'Thank you, Vikash has received your message and will get back to you shortly.',
                        'fa-solid fa-circle-check'
                    );
                    contactForm.reset();
                    clearFieldErrors();
                } else {
                    // Server-side validation or execution error
                    const serverMsg = (result && result.message) ? result.message : 'Could not save message.';
                    showStatus(
                        'error',
                        `Error: ${serverMsg} Please try again or reach out directly via WhatsApp or Email.`,
                        'fa-solid fa-circle-exclamation'
                    );
                }

            } catch (networkError) {
                console.error('Contact form submission network error:', networkError);
                showStatus(
                    'error',
                    'Unable to send message due to a network or server error. Please try again or contact Vikash directly via WhatsApp (+91 9372483191) or Email (vikashch97600@gmail.com).',
                    'fa-solid fa-circle-exclamation'
                );
            } finally {
                // 5. Restore Submit Button State
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }

    // ==========================================================================
    // 7. 60-SECOND RECRUITER DIGEST MODAL ENGINE
    // ==========================================================================

    const recruiterModal = document.getElementById('recruiterModal');
    const recruiterNavBtn = document.getElementById('recruiterDigestNavBtn');
    const recruiterMobileQuickBtn = document.getElementById('recruiterDigestMobileQuickBtn');
    const recruiterHeroBtn = document.getElementById('recruiterDigestHeroBtn');
    const recruiterHeroActionBtn = document.getElementById('recruiterDigestHeroActionBtn');
    const recruiterCloseBtn = document.getElementById('recruiterModalClose');
    const recruiterBackdrop = document.getElementById('recruiterBackdrop');
    const copySummaryBtn = document.getElementById('copySummaryBtn');
    const copyBtnText = document.getElementById('copyBtnText');

    function openRecruiterModal() {
        if (!recruiterModal) return;
        recruiterModal.classList.add('is-active');
        recruiterModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeRecruiterModal() {
        if (!recruiterModal) return;
        recruiterModal.classList.remove('is-active');
        recruiterModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    if (recruiterNavBtn) recruiterNavBtn.addEventListener('click', openRecruiterModal);
    if (recruiterMobileQuickBtn) recruiterMobileQuickBtn.addEventListener('click', openRecruiterModal);
    if (recruiterHeroBtn) recruiterHeroBtn.addEventListener('click', openRecruiterModal);
    if (recruiterHeroActionBtn) recruiterHeroActionBtn.addEventListener('click', openRecruiterModal);
    if (recruiterCloseBtn) recruiterCloseBtn.addEventListener('click', closeRecruiterModal);
    if (recruiterBackdrop) recruiterBackdrop.addEventListener('click', closeRecruiterModal);

    // Keyboard Escape Key Closes Modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && recruiterModal && recruiterModal.classList.contains('is-active')) {
            closeRecruiterModal();
        }
    });

    // Fast-Copy Recruiter Summary for ATS / Slack
    if (copySummaryBtn) {
        copySummaryBtn.addEventListener('click', function () {
            const summaryText = "Vikash R. Chaurasiya — Python Backend Developer (Django, REST APIs, MySQL, AI Integrations). MCA candidate at TIMSCDR (University of Mumbai), BCA CGPA 8.17. Flagship systems: Panchayat (Housing Society platform with AI core, 1000+ residents), SHIFTLY (location-based swipe job marketplace), and LockVault (zero-knowledge password vault). Open for immediate opportunities. Email: vikashch97600@gmail.com | Phone/WhatsApp: +91 9372483191 | Portfolio: https://vikash-personal-portfolio.netlify.app/";

            const setCopiedUI = () => {
                if (copyBtnText) copyBtnText.textContent = 'COPIED!';
                copySummaryBtn.classList.add('btn-copied');
                setTimeout(() => {
                    if (copyBtnText) copyBtnText.textContent = 'COPY SUMMARY';
                    copySummaryBtn.classList.remove('btn-copied');
                }, 2200);
            };

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(summaryText).then(setCopiedUI).catch(() => {
                    fallbackCopy(summaryText, setCopiedUI);
                });
            } else {
                fallbackCopy(summaryText, setCopiedUI);
            }
        });
    }

    function fallbackCopy(text, callback) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            if (callback) callback();
        } catch (err) {
            console.warn('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    }
});