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
        const width = heroImage.offsetWidth;
        const height = heroImage.offsetHeight;

        // Create scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
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

        // Handle resize
        window.addEventListener('resize', function () {
            const width = heroImage.offsetWidth;
            const height = heroImage.offsetHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }
});