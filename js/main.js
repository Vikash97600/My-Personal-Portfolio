document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================================
    // 1. STICKY NAVBAR, SCROLL SPY & MOBILE MENU DRAWER
    // ==========================================================================
    
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    // Sticky navbar on scroll (>40px)
    window.addEventListener('scroll', function () {
        if (window.scrollY > 40) {
            if (navbar) navbar.classList.add('scrolled');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
        }
    });

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
    // 2. PROJECT CATEGORY FILTERING (ALL, BACKEND, AI, FULL-STACK)
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
    // 3. LIGHTBOX GALLERY MODAL FOR RECOGNITION SECTION
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
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
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
});