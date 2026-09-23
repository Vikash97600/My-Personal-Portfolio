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
});