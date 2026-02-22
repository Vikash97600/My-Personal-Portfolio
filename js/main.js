document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', function () {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', function () {
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');

        // Save preference to localStorage
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    }

    // Animated Typing Text
    const textElement = document.querySelector('.sec-text');
    const texts = ['Web Developer', 'Django Enthusiast', 'Flask Developer'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing animation
    setTimeout(type, 1000);

    // Skill Progress Bars Animation
    function animateProgressBars() {
        document.querySelectorAll('.progress').forEach(progressBar => {
            const targetWidth = progressBar.style.width;
            progressBar.style.width = '0';

            setTimeout(() => {
                progressBar.style.width = targetWidth;
            }, 100);
        });

        // Circular progress bars
        document.querySelectorAll('.circular-progress').forEach(circle => {
            const value = circle.getAttribute('data-value');
            const circumference = 2 * Math.PI * 34;
            const offset = circumference - (value / 100) * circumference;

            const progressRing = circle.querySelector('.progress-ring-circle');
            progressRing.style.strokeDasharray = circumference;
            progressRing.style.strokeDashoffset = circumference;

            setTimeout(() => {
                progressRing.style.strokeDashoffset = offset;
            }, 100);
        });
    }

    // Certifications Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', () => {
            item.classList.toggle('active');

            // Close other items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });

    // Form Submission
    // const contactForm = document.querySelector('.contact-form');

    // contactForm.addEventListener('submit', function(e) {
    //     e.preventDefault();

    //     // Get form values
    //     const name = this.querySelector('#name').value;
    //     const email = this.querySelector('#email').value;
    //     const message = this.querySelector('#message').value;

    //     // Here you would typically send the form data to a server
    //     console.log({ name, email, message });

    //     // Show success message
    //     alert('Thank you for your message! I will get back to you soon.');
    //     this.reset();
    // });


    // Scroll Reveal Animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Animate elements when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('skills-container')) {
                    animateProgressBars();
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skills-container, .project-card, .certifications-accordion').forEach(section => {
        observer.observe(section);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky navbar on scroll
    window.addEventListener('scroll', function () {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // 3D Animation for Hero Image (using Three.js)
    if (document.querySelector('.hero-image') && typeof THREE !== 'undefined') {
        init3DEffect();
    }

    function init3DEffect() {
        const heroImage = document.querySelector('.hero-image');
        
        // Get dimensions - ensure we have proper dimensions
        let width = heroImage.offsetWidth || 300;
        let height = heroImage.offsetHeight || 350;

        // Create scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Handle retina displays
        renderer.setClearColor(0x000000, 0);
        
        // Style the canvas for proper positioning
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '50%';
        renderer.domElement.style.left = '50%';
        renderer.domElement.style.transform = 'translate(-50%, -50%)';
        renderer.domElement.style.zIndex = '1';
        
        heroImage.appendChild(renderer.domElement);

        // Create geometry
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x2563eb,
            wireframe: true
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        }

        animate();

        // Handle resize - improved for mobile
        function handleResize() {
            // Get fresh dimensions
            let newWidth = heroImage.offsetWidth || 300;
            let newHeight = heroImage.offsetHeight || 350;
            
            // Ensure minimum dimensions
            newWidth = Math.max(newWidth, 200);
            newHeight = Math.max(newHeight, 250);

            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        }
        
        // Add resize listener with debounce for performance
        let resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 100);
        });
        
        // Also handle orientation change for mobile
        window.addEventListener('orientationchange', function() {
            setTimeout(handleResize, 100);
        });
    }



    
});



// Lightbox Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const currentIndexElement = document.getElementById('currentIndex');
    const totalImagesElement = document.getElementById('totalImages');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const downloadBtn = document.getElementById('downloadBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    let currentImageIndex = 0;
    let images = [];
    let captions = [];
    let zoomLevel = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    // Initialize gallery data
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        images = [];
        captions = [];
        
        galleryItems.forEach((item, index) => {
            const imgSrc = item.getAttribute('data-image');
            const caption = item.getAttribute('data-caption');
            
            if (imgSrc) {
                images.push(imgSrc);
                captions.push(caption || '');
            }
        });
        
        totalImagesElement.textContent = images.length;
    }

    // Open modal with specific image
    function openModal(index) {
        if (index < 0 || index >= images.length) return;
        
        currentImageIndex = index;
        updateModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Reset zoom and position
        resetImageTransform();
    }

    // Update modal content
    function updateModal() {
        if (images.length === 0) return;
        
        modalImage.src = images[currentImageIndex];
        modalImage.alt = captions[currentImageIndex] || 'Gallery image';
        modalCaption.textContent = captions[currentImageIndex] || '';
        currentIndexElement.textContent = currentImageIndex + 1;
        
        // Preload next and previous images
        preloadImages();
    }

    // Preload images for smooth navigation
    function preloadImages() {
        const nextIndex = (currentImageIndex + 1) % images.length;
        const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
        
        [nextIndex, prevIndex].forEach(index => {
            const img = new Image();
            img.src = images[index];
        });
    }

    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModal();
        resetImageTransform();
    }

    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModal();
        resetImageTransform();
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        modal.classList.remove('fullscreen');
        document.body.style.overflow = '';
        resetImageTransform();
    }

    // Reset image zoom and position
    function resetImageTransform() {
        zoomLevel = 1;
        translateX = 0;
        translateY = 0;
        updateImageTransform();
    }

    // Update image transform
    function updateImageTransform() {
        modalImage.style.transform = `scale(${zoomLevel}) translate(${translateX}px, ${translateY}px)`;
        modalImage.classList.toggle('zoomed', zoomLevel > 1);
    }

    // Zoom in
    function zoomIn() {
        if (zoomLevel < 5) {
            zoomLevel += 0.5;
            updateImageTransform();
        }
    }

    // Zoom out
    function zoomOut() {
        if (zoomLevel > 0.5) {
            zoomLevel -= 0.5;
            // Reset position if zoomed all the way out
            if (zoomLevel <= 1) {
                translateX = 0;
                translateY = 0;
            }
            updateImageTransform();
        }
    }

    // Download image
    function downloadImage() {
        const link = document.createElement('a');
        link.href = modalImage.src;
        link.download = `avishkar-image-${currentImageIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Toggle fullscreen
    function toggleFullscreen() {
        modal.classList.toggle('fullscreen');
        const icon = fullscreenBtn.querySelector('i');
        if (modal.classList.contains('fullscreen')) {
            icon.className = 'fas fa-compress';
        } else {
            icon.className = 'fas fa-expand';
        }
    }

    // Handle mouse drag for zoomed images
    function startDrag(e) {
        if (zoomLevel <= 1) return;
        
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImage.style.cursor = 'grabbing';
    }

    function doDrag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImageTransform();
    }

    function stopDrag() {
        isDragging = false;
        modalImage.style.cursor = zoomLevel > 1 ? 'grab' : 'default';
    }

    // Handle keyboard navigation
    function handleKeyDown(e) {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case '+':
            case '=':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    zoomIn();
                }
                break;
            case '-':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    zoomOut();
                }
                break;
            case '0':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    resetImageTransform();
                }
                break;
        }
    }

    // Handle swipe for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
        if (zoomLevel > 1) return; // Don't swipe if zoomed
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        if (zoomLevel > 1) return; // Don't swipe if zoomed
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Only trigger if horizontal swipe is more significant than vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swiped left - next image
                nextImage();
            } else {
                // Swiped right - previous image
                prevImage();
            }
        }
    }

    // Initialize event listeners
    function initEventListeners() {
        // Click on gallery items
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // Prevent if clicking on a link inside
                if (e.target.tagName === 'A') return;
                openModal(index);
            });
            
            // Add keyboard support for gallery items
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(index);
                }
            });
        });

        // Modal controls
        closeBtn.addEventListener('click', closeModal);
        prevBtn.addEventListener('click', prevImage);
        nextBtn.addEventListener('click', nextImage);
        zoomInBtn.addEventListener('click', zoomIn);
        zoomOutBtn.addEventListener('click', zoomOut);
        downloadBtn.addEventListener('click', downloadImage);
        fullscreenBtn.addEventListener('click', toggleFullscreen);

        // Close modal when clicking overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyDown);

        // Image drag functionality
        modalImage.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);

        // Touch events for mobile
        modalImage.addEventListener('touchstart', handleTouchStart, { passive: true });
        modalImage.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Prevent context menu on long press
        modalImage.addEventListener('contextmenu', (e) => {
            if (zoomLevel > 1) {
                e.preventDefault();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (modal.classList.contains('active')) {
                resetImageTransform();
            }
        });
    }

    // Initialize everything
    function init() {
        initGallery();
        initEventListeners();
    }

    // Initialize when DOM is loaded
    init();
});


/* Add this JavaScript to handle loading state */
modalImage.onload = function() {
    modalImage.parentElement.classList.remove('loading');
};

modalImage.onerror = function() {
    modalImage.parentElement.classList.remove('loading');
    modalImage.alt = 'Failed to load image';
};

// Update updateModal function to add loading
function updateModal() {
    if (images.length === 0) return;
    
    modalImage.parentElement.classList.add('loading');
    modalImage.src = images[currentImageIndex];
    modalImage.alt = captions[currentImageIndex] || 'Gallery image';
    modalCaption.textContent = captions[currentImageIndex] || '';
    currentIndexElement.textContent = currentImageIndex + 1;
    
    preloadImages();
}